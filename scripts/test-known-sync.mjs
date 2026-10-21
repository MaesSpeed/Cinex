import assert from "node:assert/strict";
import test from "node:test";
import {
  filmsFromIdRows,
  mergeKnownMaps,
  mergeProfileBags,
  normalizeKnownMap,
} from "./sync-known-merge.mjs";

const THROWAWAY_USER = "u-cinex-sync-test-ce33";

function buildKnown(count, start = 10000) {
  const known = {};
  for (let i = 0; i < count; i++) {
    const tmdb = start + i;
    const id = `t${tmdb}`;
    known[id] = {
      id,
      tmdb,
      title: `Throwaway Film ${i + 1}`,
      poster: `https://example.test/p/${tmdb}.jpg`,
      minutes: 90 + (i % 40),
      cast: ["A", "B"],
      updatedAt: new Date(2026, 0, 1, 0, 0, i).toISOString(),
    };
  }
  return known;
}

function buildWatchlistIds(count, start = 10000) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const id = `t${start + i}`;
    out.push({ id, at: Date.now() - i, updatedAt: new Date(2026, 1, 1).toISOString() });
  }
  return out;
}

test("normalizeKnownMap drops sync meta keys and rejects arrays", () => {
  const raw = {
    updatedAt: "2020-01-01T00:00:00.000Z",
    t155: { id: "t155", title: "Dark Knight", poster: "x" },
  };
  const norm = normalizeKnownMap(raw);
  assert.equal(norm.updatedAt, undefined);
  assert.equal(Object.keys(norm).length, 1);
  assert.equal(norm.t155.title, "Dark Knight");
  assert.deepEqual(normalizeKnownMap([]), {});
  assert.deepEqual(normalizeKnownMap(null), {});
});

test("merge keeps 250 known when remote known is empty array (broken server)", () => {
  const known = buildKnown(250);
  const watchlist = buildWatchlistIds(270);
  const local = { known, watchlist, queue: [], history: [] };
  const remote = { known: [], watchlist, queue: [], history: [] };
  const merged = mergeProfileBags(local, remote);
  assert.equal(Object.keys(merged.known).length, 250);
  assert.equal(merged.watchlist.length, 270);
});

test("two-device sync: union known maps without shrinking local", () => {
  const localKnown = buildKnown(120, 20000);
  const remoteKnown = buildKnown(95, 50000);
  const a = { known: localKnown };
  const b = { known: remoteKnown };
  const merged = mergeProfileBags(a, b);
  assert.equal(Object.keys(merged.known).length, 215);
  const mergedAgain = mergeProfileBags({ known: merged.known }, { known: localKnown });
  assert.equal(Object.keys(mergedAgain.known).length, 215);
});

test("richer known entry wins on conflict", () => {
  const local = {
    t99: { id: "t99", title: "Old", poster: "", minutes: 0 },
  };
  const remote = {
    t99: {
      id: "t99",
      title: "Fresh",
      poster: "https://x/p.jpg",
      minutes: 110,
      updatedAt: "2026-05-01T12:00:00.000Z",
    },
  };
  const out = mergeKnownMaps(local, remote);
  assert.equal(out.t99.title, "Fresh");
  assert.equal(out.t99.minutes, 110);
});

test("watchlist renders all 270 rows when findFilm only resolves ~100", () => {
  const watchlist = buildWatchlistIds(270);
  const known = buildKnown(100);
  const findFilm = (id) => known[String(id)] || null;
  const films = filmsFromIdRows(watchlist, findFilm);
  assert.equal(films.length, 270);
  const loading = films.filter((f) => f.title === "Lädt…");
  assert.equal(loading.length, 170);
});

test("remote known=[] repair: merge preserves local; hydration can refill catalog", () => {
  const known = buildKnown(50, 30000);
  const repaired = mergeKnownMaps(known, []);
  assert.equal(Object.keys(repaired).length, 50);
  const watchlist = buildWatchlistIds(55, 30000);
  const findAfterMerge = (id) => repaired[String(id)] || null;
  const visible = filmsFromIdRows(watchlist, findAfterMerge);
  assert.equal(visible.length, 55);
  assert.equal(visible.every((f) => f.title && f.title !== ""), true);
});

test("throwaway account id is not Domi", () => {
  assert.equal(THROWAWAY_USER.includes("Domi"), false);
  assert.match(THROWAWAY_USER, /test|throwaway|ce33/i);
});

test("tombstones: delete on device A wins over stale watchlist on device B", () => {
  const deletedAt = "2026-10-20T12:00:00.000Z";
  const staleAt = "2026-10-01T08:00:00.000Z";
  const local = {
    watchlist: [],
    _tombstones: [{ id: "t99", kind: "watchlist", deleted: true, updatedAt: deletedAt }],
  };
  const remote = {
    watchlist: [{ id: "t99", at: 1, updatedAt: staleAt }],
    _tombstones: [],
  };
  const merged = mergeProfileBags(local, remote);
  assert.equal(merged.watchlist.some((r) => String(r.id) === "t99"), false);
  assert.equal(merged._tombstones.length, 1);
});

test("tombstones: re-added film after delete survives when newer than tombstone", () => {
  const deletedAt = "2026-10-01T08:00:00.000Z";
  const readdedAt = "2026-10-21T09:00:00.000Z";
  const local = {
    watchlist: [{ id: "t42", at: 2, updatedAt: readdedAt }],
    _tombstones: [{ id: "t42", kind: "watchlist", deleted: true, updatedAt: deletedAt }],
  };
  const remote = { watchlist: [], _tombstones: [] };
  const merged = mergeProfileBags(local, remote);
  assert.equal(merged.watchlist.length, 1);
  assert.equal(String(merged.watchlist[0].id), "t42");
});

test("tagCovers merge keeps array shape", () => {
  const local = {
    tagCovers: [{ id: "cov-a", poster: "https://example.test/a.jpg", updatedAt: "2026-10-10T00:00:00.000Z" }],
  };
  const remote = {
    tagCovers: [{ id: "cov-b", poster: "https://example.test/b.jpg", updatedAt: "2026-10-11T00:00:00.000Z" }],
  };
  const merged = mergeProfileBags(local, remote);
  assert.ok(Array.isArray(merged.tagCovers));
  assert.equal(merged.tagCovers.length, 2);
});
