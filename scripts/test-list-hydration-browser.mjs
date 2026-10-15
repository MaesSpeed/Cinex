import assert from "node:assert/strict";
import test from "node:test";
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const THROWAWAY_USER = "u-cinex-hydrate-ce33";
const THROWAWAY_PROFILE = "p-hydrate-ce33";
const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".css": "text/css",
  ".webmanifest": "application/manifest+json",
  ".png": "image/png",
};

function startStaticServer() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let path = req.url.split("?")[0] || "/";
      if (path === "/") path = "/index.html";
      const file = join(ROOT, path.replace(/^\//, ""));
      try {
        const body = readFileSync(file);
        const ext = extname(file);
        res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
        res.end(body);
      } catch {
        res.writeHead(404);
        res.end("not found");
      }
    });
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${port}` });
    });
  });
}

function startMockMovieProxy() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const match = (req.url || "").match(/\/movie\/(\d+)/);
      if (!match) {
        res.writeHead(404);
        res.end("{}");
        return;
      }
      const id = Number(match[1]);
      const body = JSON.stringify({
        id,
        title: `Hydrated ${id}`,
        original_title: `Hydrated ${id}`,
        poster_path: `/p/${id}.jpg`,
        runtime: 110,
        vote_average: 7.2,
        genres: [{ id: 18, name: "Drama" }],
        credits: { cast: [{ name: "Actor A", order: 0 }] },
      });
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      });
      res.end(body);
    });
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, proxyUrl: `http://127.0.0.1:${port}` });
    });
  });
}

function buildFixture() {
  const start = 880000;
  const known = {};
  for (let i = 0; i < 100; i++) {
    const tmdb = start + i;
    const id = `t${tmdb}`;
    known[id] = { id, tmdb, title: `Known ${i}`, poster: "https://example.test/p.jpg", minutes: 100 };
  }
  const watchlist = [];
  for (let i = 0; i < 270; i++) {
    watchlist.push({ id: `t${start + i}`, at: Date.now() - i });
  }
  return { known, watchlist, start };
}

test("hydrate 170 missing watchlist films with batched persist and limited list refresh", async (t) => {
  const { server, baseUrl } = await startStaticServer();
  const mock = await startMockMovieProxy();
  t.after(() => {
    server.close();
    mock.server.close();
  });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  t.after(async () => {
    await browser.close();
  });

  const { known, watchlist } = buildFixture();
  const prefix = `wdq.p.${THROWAWAY_USER}.${THROWAWAY_PROFILE}.`;

  await page.addInitScript((proxyUrl) => {
    window.SEARCH_PROXY = proxyUrl;
  }, mock.proxyUrl);

  await page.route(/\/movie\/\d+/, async (route) => {
    const match = route.request().url().match(/\/movie\/(\d+)/);
    const id = Number(match && match[1]);
    const body = JSON.stringify({
      id,
      title: `Hydrated ${id}`,
      original_title: `Hydrated ${id}`,
      poster_path: `/p/${id}.jpg`,
      runtime: 110,
      vote_average: 7.2,
      genres: [{ id: 18, name: "Drama" }],
      credits: { cast: [{ name: "Actor A", order: 0 }] },
    });
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body,
    });
  });

  await page.goto(`${baseUrl}/?cinex_test=1`, { waitUntil: "load" });

  await page.evaluate(({ userId, profileId, prefix, known, watchlist }) => {
    localStorage.clear();
    localStorage.setItem("wdq.users", JSON.stringify([{ id: userId, login: "HydrateThrowaway", password: "x" }]));
    localStorage.setItem(`wdq.profiles.${userId}`, JSON.stringify([
      { id: profileId, name: "Hydrate", avatar: "av1", plate: "schwarz-lava" },
    ]));
    localStorage.setItem(`${prefix}known`, JSON.stringify(known));
    localStorage.setItem(`${prefix}watchlist`, JSON.stringify(watchlist));
    localStorage.setItem(`${prefix}queue`, JSON.stringify([]));
    localStorage.setItem(`${prefix}history`, JSON.stringify([]));
    localStorage.setItem("wdq.session", JSON.stringify({ userId, profileId }));
    window.__CINEX_TEST_COUNTERS__ = { refreshWatchList: 0, knownWrites: 0 };
    const orig = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (String(key).endsWith(".known")) {
        window.__CINEX_TEST_COUNTERS__.knownWrites += 1;
      }
      return orig.call(this, key, value);
    };
    location.reload();
  }, {
    userId: THROWAWAY_USER,
    profileId: THROWAWAY_PROFILE,
    prefix,
    known,
    watchlist,
  });

  await page.waitForFunction(() => window.__CINEX_TEST__ && window.CinexTmdb, null, { timeout: 20000 });

  const result = await page.evaluate(async () => {
    const api = window.__CINEX_TEST__;
    api.hydrateMissingListFilms();
    const started = Date.now();
    const deadline = started + 45000;
    while (Date.now() < deadline) {
      const stats = api.getListHydrateStats();
      const films = api.watchlistFilms();
      const missing = films.filter((f) => !f.title || f.title === "Lädt…").length;
      if (missing === 0 && stats.inflight === 0 && stats.queued === 0 && stats.persistBatch === 0) {
        break;
      }
      await new Promise((r) => setTimeout(r, 200));
    }
    const films = api.watchlistFilms();
    const missing = films.filter((f) => !f.title || f.title === "Lädt…").length;
    const withPoster = films.filter((f) => f.poster && String(f.poster).includes("image.tmdb.org")).length;
    const counters = window.__CINEX_TEST_COUNTERS__ || {};
    return {
      missing,
      total: films.length,
      withPoster,
      refreshWatchList: counters.refreshWatchList || 0,
      knownWrites: counters.knownWrites || 0,
      stats: api.getListHydrateStats(),
      debounceMs: api.getSyncPushDebounceMs(),
      knownCount: Object.keys(api.loadKnownFilms()).length,
      durationMs: Date.now() - started,
    };
  });

  assert.equal(result.total, 270);
  assert.equal(result.missing, 0, `still missing titles: ${result.missing}`);
  assert.ok(result.withPoster >= 170, `expected hydrated posters, got ${result.withPoster}`);
  assert.ok(result.knownCount >= 270 && result.knownCount <= 280, `known map size ${result.knownCount}`);
  assert.ok(result.refreshWatchList < 80, `too many list refreshes: ${result.refreshWatchList}`);
  assert.ok(result.knownWrites < 80, `too many known writes: ${result.knownWrites}`);
  assert.equal(result.debounceMs, 60000);
  assert.equal(result.stats.inflight, 0);
  console.log("hydration-metrics", JSON.stringify({
    refreshWatchList: result.refreshWatchList,
    knownWrites: result.knownWrites,
    durationMs: result.durationMs,
    withPoster: result.withPoster,
  }));
});
