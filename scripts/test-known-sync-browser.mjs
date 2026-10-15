import assert from "node:assert/strict";
import test from "node:test";
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = join(import.meta.dirname, "..");
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

test("app mergeProfileBags matches module; watchlist keeps 270 visible rows", async (t) => {
  const { server, baseUrl } = await startStaticServer();
  t.after(() => server.close());

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  t.after(async () => {
    await browser.close();
  });

  await page.goto(`${baseUrl}/?cinex_test=1`, { waitUntil: "load" });
  await page.waitForFunction(() => window.__CINEX_TEST__ && window.CinexTmdb, null, { timeout: 15000 });

  const result = await page.evaluate(() => {
    const api = window.__CINEX_TEST__;
    if (!api) return { ok: false, reason: "missing __CINEX_TEST__" };

    const known = {};
    for (let i = 0; i < 250; i++) {
      const tmdb = 60000 + i;
      const id = `t${tmdb}`;
      known[id] = { id, tmdb, title: `Browser ${i}`, poster: "p", minutes: 100 };
    }
    const watchlist = [];
    for (let i = 0; i < 270; i++) {
      watchlist.push({ id: `t${60000 + i}` });
    }
    const merged = api.mergeProfileBags(
      { known, watchlist },
      { known: [], watchlist },
    );
    const knownCount = Object.keys(api.normalizeKnownMap(merged.known)).length;

    return {
      ok: true,
      knownCount,
      watchlistLen: watchlist.length,
      proxy: api.searchProxyBase(),
    };
  });

  assert.equal(result.ok, true, result.reason);
  assert.equal(result.knownCount, 250);
  assert.equal(result.watchlistLen, 270);
  assert.equal(result.proxy, "https://cinex-search.iammrspeed.workers.dev");
});
