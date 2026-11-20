import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import test from "node:test";

const require = createRequire(import.meta.url);
const {
  AUTH_EXPIRED_NOTICE,
  mergeProfilesWithTombstones,
  restampBackupKeys,
  sanitizeFilmTagsMap,
  shrinkDialogCopy,
  stampChangedRows,
  syncPayloadEqual,
} = require("../sync-safety.js");

test("auth notice is the exact sentence", () => {
  assert.equal(
    AUTH_EXPIRED_NOTICE,
    "Bitte neu anmelden – deine Änderungen sind gerade nur auf diesem Gerät.",
  );
});

test("history rows keep updatedAt unless the row itself changed", () => {
  const prev = [
    { id: "t1", title: "Dune", at: 10, views: [10], updatedAt: "2026-10-01T00:00:00.000Z" },
    { id: "t2", title: "Heat", at: 20, views: [20], updatedAt: "2026-10-02T00:00:00.000Z" },
  ];
  const same = stampChangedRows(prev, prev.map((row) => ({ ...row })), "2026-11-20T12:00:00.000Z");
  assert.equal(same[0].updatedAt, prev[0].updatedAt);
  assert.equal(same[1].updatedAt, prev[1].updatedAt);

  const next = [
    { id: "t1", title: "Dune", at: 30, views: [30, 10], updatedAt: "2026-10-01T00:00:00.000Z" },
    { id: "t2", title: "Heat", at: 20, views: [20] },
    { id: "t3", title: "Alien", at: 40, views: [40] },
  ];
  const stamped = stampChangedRows(prev, next, "2026-11-20T12:00:00.000Z");
  assert.equal(stamped[0].updatedAt, "2026-11-20T12:00:00.000Z");
  assert.equal(stamped[1].updatedAt, prev[1].updatedAt);
  assert.equal(stamped[2].updatedAt, "2026-11-20T12:00:00.000Z");
  assert.equal(stamped.length, 3);
});

test("film tag map ignores the sync stamp that used to crash delete", () => {
  const clean = sanitizeFilmTagsMap({
    t862: ["tag-omma"],
    updatedAt: "2026-11-20T12:00:00.000Z",
    deleted: true,
    id: "filmTags",
  });
  assert.deepEqual(clean, { t862: ["tag-omma"] });
  Object.keys(clean).forEach((key) => {
    const ids = clean[key];
    assert.equal(Array.isArray(ids), true);
    ids.filter((id) => id !== "tag-omma");
  });
});

test("deleted profile does not come back, a newer profile does", () => {
  const tombs = [{ id: "p2", kind: "profile", deleted: true, updatedAt: "2026-11-01T00:00:00.000Z" }];
  const local = [{ id: "p1", name: "Domi", updatedAt: "2026-10-01T00:00:00.000Z" }];
  const remote = [
    { id: "p1", name: "Domi", updatedAt: "2026-10-01T00:00:00.000Z" },
    { id: "p2", name: "Alt", updatedAt: "2026-10-01T00:00:00.000Z" },
  ];
  const merged = mergeProfilesWithTombstones(local, remote, tombs, []);
  assert.deepEqual(merged.profiles.map((p) => p.id), ["p1"]);
  assert.deepEqual(merged.droppedIds, ["p2"]);
  assert.equal(merged.profileTombstones.length, 1);

  const oldTomb = [{ id: "p2", kind: "profile", deleted: true, updatedAt: "2026-01-01T00:00:00.000Z" }];
  const revived = mergeProfilesWithTombstones(
    [],
    [{ id: "p2", name: "Alt", updatedAt: "2026-11-20T00:00:00.000Z" }],
    oldTomb,
    [],
  );
  assert.equal(revived.profiles.length, 1);
  assert.equal(revived.droppedIds.length, 0);
});

test("backup restore restamps rows and drops tombstones that would undo them", () => {
  const now = "2026-11-20T15:00:00.000Z";
  const keys = restampBackupKeys({
    "wdq.profiles.u1": JSON.stringify([{ id: "p1", name: "Domi", updatedAt: "2026-01-01T00:00:00.000Z" }]),
    "wdq.profileTombstones.u1": JSON.stringify([
      { id: "p1", kind: "profile", deleted: true, updatedAt: "2026-10-01T00:00:00.000Z" },
      { id: "p9", kind: "profile", deleted: true, updatedAt: "2026-10-01T00:00:00.000Z" },
    ]),
    "wdq.p.u1.p1.history": JSON.stringify([
      { id: "t1", title: "Dune", at: 5, updatedAt: "2026-01-01T00:00:00.000Z" },
    ]),
    "wdq.p.u1.p1.watchlist": JSON.stringify([
      { id: "t9", updatedAt: "2026-01-01T00:00:00.000Z" },
    ]),
    "wdq.p.u1.p1._tombstones": JSON.stringify([
      { id: "t1", kind: "history", deleted: true, updatedAt: "2026-10-20T00:00:00.000Z" },
      { id: "t8", kind: "history", deleted: true, updatedAt: "2026-10-20T00:00:00.000Z" },
      { id: "t9", kind: "watchlist", deleted: true, updatedAt: "2026-10-20T00:00:00.000Z" },
    ]),
    "wdq.p.u1.p1.ratings": JSON.stringify({ t1: 8 }),
  }, now);
  const history = JSON.parse(keys["wdq.p.u1.p1.history"]);
  assert.equal(history[0].updatedAt, now);
  const tombs = JSON.parse(keys["wdq.p.u1.p1._tombstones"]);
  assert.deepEqual(tombs.map((row) => row.id), ["t8"]);
  const profiles = JSON.parse(keys["wdq.profiles.u1"]);
  assert.equal(profiles[0].updatedAt, now);
  const profileTombs = JSON.parse(keys["wdq.profileTombstones.u1"]);
  assert.deepEqual(profileTombs.map((row) => row.id), ["p9"]);
  const sync = JSON.parse(keys["wdq.p.u1.p1.ratingsSync"]);
  assert.equal(sync.t1.value, 8);
  assert.equal(sync.t1.updatedAt, now);
  assert.equal(JSON.parse(keys["wdq.p.u1.p1.ratings"]).t1, 8);
});

test("periodic compare ignores collectedAt and updatedAt, notices a real change", () => {
  const local = { format: "cinex-sync", profiles: [{ id: "p1", updatedAt: "a" }], collectedAt: "a" };
  const remote = { format: "cinex-sync", profiles: [{ id: "p1", updatedAt: "b" }], collectedAt: "b" };
  assert.equal(syncPayloadEqual(local, remote), true);
  assert.equal(syncPayloadEqual(local, { format: "cinex-sync", profiles: [] }), false);
  assert.equal(syncPayloadEqual(local, null), false);
  assert.equal(syncPayloadEqual(
    { byProfile: { p1: { ratings: { t1: { value: 8, updatedAt: "a" } } } } },
    { byProfile: { p1: { ratings: { t1: { value: 9, updatedAt: "a" } } } } },
  ), false);
});

test("app wires the safety helpers and drops the history cap", () => {
  const src = readFileSync(new URL("../app.js", import.meta.url), "utf8");
  assert.match(src, /function saveHistory\(list\) \{[\s\S]{0,240}WDQSync\.stampChangedRows/);
  assert.match(src, /function saveVideoHistory\(list\) \{[\s\S]{0,240}WDQSync\.stampChangedRows/);
  assert.doesNotMatch(src, /saveHistory\(rows\.slice\(0,\s*300\)\)/);
  assert.match(src, /WDQSync\.syncPayloadEqual/);
  assert.match(src, /WDQSync\.restampBackupKeys/);
  assert.match(src, /WDQSync\.mergeProfilesWithTombstones/);
  assert.match(src, /syncApi\("\/verify"/);
  assert.match(src, /AUTH_EXPIRED_NOTICE/);
  assert.match(src, /confirmShrink/);
  assert.match(src, /\/data\/history/);
  assert.match(src, /\/data\/restore/);
});

test("shrink copy names the missing films", () => {
  assert.equal(
    shrinkDialogCopy([{ field: "watchlist", lost: 42, before: 100, after: 58 }]).text,
    "Auf diesem Gerät fehlen 42 Filme. Wirklich so speichern?",
  );
  assert.equal(
    shrinkDialogCopy([{ field: "watchlist", lost: 1, before: 1, after: 0 }]).text,
    "Auf diesem Gerät fehlt 1 Film. Wirklich so speichern?",
  );
  assert.match(shrinkDialogCopy([{ field: "data", lost: 1, nullData: true }]).text, /Kontodaten/);
});
