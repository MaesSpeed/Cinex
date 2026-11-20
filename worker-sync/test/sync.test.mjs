import assert from "node:assert/strict";
import test from "node:test";
import {
  PBKDF2_ITER,
  bucketCounts,
  guardProfiles,
  handle,
  hashPassword,
  isAllowedOrigin,
  isValidName,
  nameKey,
  normalizeName,
  randomHex,
  shrinkLosses,
  timingSafeEqualHex,
} from "../src/lib.js";
import * as workerEntry from "../src/index.js";

function mockKv(initial = {}) {
  const store = new Map(Object.entries(initial));
  const meta = new Map();
  return {
    store,
    meta,
    async get(key) {
      return store.has(key) ? store.get(key) : null;
    },
    async put(key, value, opts) {
      store.set(key, value);
      if (opts) meta.set(key, opts);
      else meta.delete(key);
    },
    async delete(key) {
      store.delete(key);
      meta.delete(key);
    },
    async list({ prefix } = {}) {
      const keys = [];
      for (const name of store.keys()) {
        if (!prefix || String(name).startsWith(prefix)) keys.push({ name });
      }
      return { keys, list_complete: true };
    },
  };
}

function envWith(overrides = {}) {
  return {
    CINEX_SYNC: mockKv(),
    TOKEN_TTL_SECONDS: "2592000",
    ALLOWED_ORIGINS: "",
    MAX_DATA_BYTES: "1048576",
    ...overrides,
  };
}

function call(path, {
  method = "GET",
  origin = "https://maesspeed.github.io",
  headers = {},
  body,
  env,
} = {}) {
  const init = { method, headers: { ...headers } };
  if (origin !== undefined) init.headers.Origin = origin;
  if (body !== undefined) {
    init.body = typeof body === "string" ? body : JSON.stringify(body);
    if (!init.headers["Content-Type"]) init.headers["Content-Type"] = "application/json";
  }
  return handle(new Request(`https://cinex-sync.example${path}`, init), env || envWith());
}

function films(n, start = 0) {
  const out = [];
  for (let i = start; i < start + n; i++) out.push({ id: `t${i}`, updatedAt: "2026-10-01T00:00:00.000Z" });
  return out;
}

function cinexBlob({ profiles, watchlist, history, ratings, tombs } = {}) {
  const list = profiles || [{ id: "p1", name: "Domi", updatedAt: "2026-10-01T00:00:00.000Z" }];
  const byProfile = {};
  for (const profile of list) {
    byProfile[profile.id] = {
      watchlist: watchlist || [],
      history: history || [],
      ratings: ratings || {},
    };
  }
  return {
    format: "cinex-sync",
    version: 1,
    profiles: list,
    byProfile,
    profileTombstones: tombs || [],
  };
}

async function register(env, name = "Domi", password = "pass1234") {
  const reg = await call("/register", { method: "POST", body: { name, password }, env });
  assert.equal(reg.status, 201);
  const body = await reg.json();
  return body.token;
}

async function putData(env, token, baseVersion, data, extra) {
  return call("/data", {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: { baseVersion, data, ...(extra || {}) },
    env,
  });
}

test("worker entry exports only the fetch handler", () => {
  assert.deepEqual(Object.keys(workerEntry).sort(), ["default"]);
  assert.equal(typeof workerEntry.default.fetch, "function");
});

test("CORS: allows prod + localhost, rejects others", () => {
  assert.equal(isAllowedOrigin("https://maesspeed.github.io"), true);
  assert.equal(isAllowedOrigin("http://localhost:8787"), true);
  assert.equal(isAllowedOrigin("http://127.0.0.1:4173"), true);
  assert.equal(isAllowedOrigin(""), true);
  assert.equal(isAllowedOrigin("https://evil.example"), false);
  assert.equal(isAllowedOrigin("https://preview.example", "https://preview.example"), true);
});

test("name validation", () => {
  assert.equal(isValidName("Domi"), true);
  assert.equal(isValidName("ab"), false);
  assert.equal(isValidName("a".repeat(33)), false);
  assert.equal(normalizeName("  Domi  "), "Domi");
  assert.equal(nameKey("DoMi"), "domi");
});

test("PBKDF2 hash is deterministic and different salts differ", async () => {
  const salt = randomHex(16);
  const a = await hashPassword("secret", salt);
  const b = await hashPassword("secret", salt);
  const c = await hashPassword("secret", randomHex(16));
  assert.equal(a, b);
  assert.equal(a.length, 64);
  assert.notEqual(a, c);
  assert.equal(PBKDF2_ITER, 100_000);
  assert.equal(timingSafeEqualHex(a, b), true);
  assert.equal(timingSafeEqualHex(a, c), false);
});

test("health + OPTIONS CORS headers", async () => {
  const r = await call("/health");
  assert.equal(r.status, 200);
  assert.equal(r.headers.get("Access-Control-Allow-Origin"), "https://maesspeed.github.io");
  const body = await r.json();
  assert.equal(body.ok, true);

  const o = await call("/data", { method: "OPTIONS" });
  assert.equal(o.status, 204);
  assert.equal(o.headers.get("Access-Control-Allow-Methods"), "GET, PUT, POST, OPTIONS");

  const deny = await call("/health", { origin: "https://evil.example" });
  assert.equal(deny.status, 403);
});

test("register + login + data roundtrip + 409", async () => {
  const env = envWith();
  const reg = await call("/register", { method: "POST", body: { name: "Domi", password: "pass1234" }, env });
  assert.equal(reg.status, 201);
  const { token } = await reg.json();
  assert.equal(token.length, 64);

  const again = await call("/register", { method: "POST", body: { name: "domi", password: "other" }, env });
  assert.equal(again.status, 409);

  const bad = await call("/login", { method: "POST", body: { name: "Domi", password: "wrong" }, env });
  assert.equal(bad.status, 401);

  const login = await call("/login", { method: "POST", body: { name: "Domi", password: "pass1234" }, env });
  assert.equal(login.status, 200);
  const { token: t2 } = await login.json();

  const g0 = await call("/data", { headers: { Authorization: `Bearer ${t2}` }, env });
  assert.equal(g0.status, 200);
  const empty = await g0.json();
  assert.equal(empty.version, 0);
  assert.equal(empty.data, null);

  const payload = { lists: { watchlist: [{ id: "tt1", updatedAt: "2026-10-15T10:00:00Z" }] }, _tombstones: [] };
  const p1 = await call("/data", {
    method: "PUT",
    headers: { Authorization: `Bearer ${t2}` },
    body: { baseVersion: 0, data: payload },
    env,
  });
  assert.equal(p1.status, 200);
  const saved = await p1.json();
  assert.equal(saved.version, 1);

  const g1 = await call("/data", { headers: { Authorization: `Bearer ${t2}` }, env });
  const got = await g1.json();
  assert.equal(got.version, 1);
  assert.deepEqual(got.data, payload);

  const conflict = await call("/data", {
    method: "PUT",
    headers: { Authorization: `Bearer ${t2}` },
    body: { baseVersion: 0, data: { other: true } },
    env,
  });
  assert.equal(conflict.status, 409);
  const c = await conflict.json();
  assert.equal(c.error, "version_conflict");
  assert.equal(c.current.version, 1);

  const p2 = await call("/data", {
    method: "PUT",
    headers: { Authorization: `Bearer ${t2}` },
    body: { baseVersion: 1, data: { lists: {} } },
    env,
  });
  assert.equal(p2.status, 200);
  assert.equal((await p2.json()).version, 2);

  const no = await call("/data", { env });
  assert.equal(no.status, 401);
});

test("rate-limit after 5 failed logins", async () => {
  const env = envWith();
  await call("/register", { method: "POST", body: { name: "ratelimit", password: "goodpass" }, env });
  for (let i = 0; i < 5; i++) {
    const r = await call("/login", {
      method: "POST",
      body: { name: "ratelimit", password: "bad" },
      headers: { "CF-Connecting-IP": "1.2.3.4" },
      env,
    });
    assert.ok(r.status === 401 || r.status === 429, `attempt ${i + 1}: ${r.status}`);
  }
  const blocked = await call("/login", {
    method: "POST",
    body: { name: "ratelimit", password: "goodpass" },
    headers: { "CF-Connecting-IP": "1.2.3.4" },
    env,
  });
  assert.equal(blocked.status, 429);
  assert.ok(blocked.headers.get("Retry-After"));
});

test("PUT rejects payload over 1 MB", async () => {
  const env = envWith({ MAX_DATA_BYTES: "1024" });
  const reg = await call("/register", { method: "POST", body: { name: "big", password: "pass1234" }, env });
  const { token } = await reg.json();
  const big = "x".repeat(2000);
  const r = await call("/data", {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: { baseVersion: 0, data: { blob: big } },
    env,
  });
  assert.equal(r.status, 413);
});

test("logout invalidates token", async () => {
  const env = envWith();
  const reg = await call("/register", { method: "POST", body: { name: "out", password: "pass1234" }, env });
  const { token } = await reg.json();
  const lo = await call("/logout", { method: "POST", headers: { Authorization: `Bearer ${token}` }, env });
  assert.equal(lo.status, 200);
  const g = await call("/data", { headers: { Authorization: `Bearer ${token}` }, env });
  assert.equal(g.status, 401);
});

test("fresh token is not rewritten; a soon-expiring or legacy token slides", async () => {
  const env = envWith();
  const token = await register(env);
  const key = `tok:${token}`;
  const before = env.CINEX_SYNC.store.get(key);
  const g = await call("/data", { headers: { Authorization: `Bearer ${token}` }, env });
  assert.equal(g.status, 200);
  assert.equal(env.CINEX_SYNC.store.get(key), before);

  const rec = JSON.parse(before);
  rec.expiresAt = new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString();
  env.CINEX_SYNC.store.set(key, JSON.stringify(rec));
  const slid = await call("/data", { headers: { Authorization: `Bearer ${token}` }, env });
  assert.equal(slid.status, 200);
  const after = JSON.parse(env.CINEX_SYNC.store.get(key));
  assert.ok(Date.parse(after.expiresAt) > Date.parse(rec.expiresAt));
  assert.equal(after.name, rec.name);
  assert.equal(env.CINEX_SYNC.meta.get(key).expirationTtl, 2592000);

  delete after.expiresAt;
  env.CINEX_SYNC.store.set(key, JSON.stringify({ name: after.name, createdAt: after.createdAt }));
  const legacy = await call("/data", { headers: { Authorization: `Bearer ${token}` }, env });
  assert.equal(legacy.status, 200);
  const renewed = JSON.parse(env.CINEX_SYNC.store.get(key));
  assert.equal(renewed.name, "domi");
  assert.ok(renewed.expiresAt);
  assert.equal(renewed.createdAt, after.createdAt);
});

test("existing cinex blob and legacy token keep working", async () => {
  const env = envWith();
  const token = "cd".repeat(32);
  const legacyBlob = {
    version: 18,
    updatedAt: "2026-10-16T00:47:10.000Z",
    data: cinexBlob({ watchlist: films(3), history: films(2, 100), ratings: { t1: { value: 8, updatedAt: "2026-10-01T00:00:00.000Z" } } }),
  };
  env.CINEX_SYNC.store.set(`tok:${token}`, JSON.stringify({ name: "domi", createdAt: "2026-10-16T00:00:00.000Z" }));
  env.CINEX_SYNC.store.set("data:domi", JSON.stringify(legacyBlob));
  const got = await call("/data", { headers: { Authorization: `Bearer ${token}` }, env });
  assert.equal(got.status, 200);
  const body = await got.json();
  assert.equal(body.version, 18);
  assert.equal(body.data.byProfile.p1.watchlist.length, 3);
  const put = await putData(env, token, 18, {
    ...legacyBlob.data,
    byProfile: {
      p1: { ...legacyBlob.data.byProfile.p1, watchlist: films(4) },
    },
  });
  assert.equal(put.status, 200);
  assert.equal((await put.json()).version, 19);
});

test("shrink guard: boundaries, null, and confirmShrink", async () => {
  assert.deepEqual(bucketCounts(null), { watchlist: 0, history: 0, ratings: 0, profiles: 0 });
  const big = cinexBlob({ watchlist: films(100) });
  const drop10 = cinexBlob({ watchlist: films(90) });
  const drop11 = cinexBlob({ watchlist: films(89) });
  assert.equal(shrinkLosses(big, drop10).length, 0);
  assert.equal(shrinkLosses(big, drop11)[0].field, "watchlist");
  assert.equal(shrinkLosses(big, drop11)[0].lost, 11);
  const half = cinexBlob({ watchlist: films(50) });
  const dropPct = cinexBlob({ watchlist: films(40) });
  assert.equal(shrinkLosses(half, dropPct)[0].lost, 10);
  assert.equal(shrinkLosses(null, null).length, 0);

  const env = envWith({ SNAPSHOT_DAY: "2026-11-18" });
  const token = await register(env, "shrink");
  const first = await putData(env, token, 0, big);
  assert.equal(first.status, 200);
  const rejected = await putData(env, token, 1, drop11);
  assert.equal(rejected.status, 422);
  const rejBody = await rejected.json();
  assert.equal(rejBody.error, "shrink_rejected");
  assert.equal(rejBody.losses[0].lost, 11);
  const still = await call("/data", { headers: { Authorization: `Bearer ${token}` }, env });
  assert.equal((await still.json()).data.byProfile.p1.watchlist.length, 100);
  const hist = await call("/data/history", { headers: { Authorization: `Bearer ${token}` }, env });
  assert.deepEqual((await hist.json()).snapshots, []);

  const wiped = await putData(env, token, 1, null);
  assert.equal(wiped.status, 422);
  assert.equal((await wiped.json()).losses[0].nullData, true);

  const ok = await putData(env, token, 1, drop11, { confirmShrink: true });
  assert.equal(ok.status, 200);
  const snaps = await call("/data/history", { headers: { Authorization: `Bearer ${token}` }, env });
  const listed = (await snaps.json()).snapshots;
  assert.equal(listed.length, 1);
  assert.equal(listed[0].id, "2026-11-18");
  assert.equal(listed[0].version, 1);
});

test("daily snapshot, list, and reversible restore", async () => {
  const env = envWith({ SNAPSHOT_DAY: "2026-11-18" });
  const token = await register(env, "hist");
  const a = cinexBlob({ watchlist: films(3) });
  const b = cinexBlob({ watchlist: films(4) });
  const c = cinexBlob({ watchlist: films(5) });
  const d = cinexBlob({ watchlist: films(6) });
  assert.equal((await putData(env, token, 0, a)).status, 200);
  assert.equal((await putData(env, token, 1, b)).status, 200);
  env.SNAPSHOT_DAY = "2026-11-19";
  assert.equal((await putData(env, token, 2, c)).status, 200);
  assert.equal((await putData(env, token, 3, d)).status, 200);

  const listed = await call("/data/history", { headers: { Authorization: `Bearer ${token}` }, env });
  const snaps = (await listed.json()).snapshots;
  assert.deepEqual(snaps.map((row) => row.id).sort(), ["2026-11-18", "2026-11-19"]);
  const day18 = snaps.find((row) => row.id === "2026-11-18");
  assert.equal(day18.version, 1);

  const restored = await call("/data/restore", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: { id: "2026-11-18" },
    env,
  });
  assert.equal(restored.status, 200);
  const back = await restored.json();
  assert.equal(back.version, 5);
  assert.equal(back.data.byProfile.p1.watchlist.length, 3);

  const after = await call("/data/history", { headers: { Authorization: `Bearer ${token}` }, env });
  const withUndo = (await after.json()).snapshots;
  assert.ok(withUndo.some((row) => row.id === "undo" && row.undo && row.version === 4));

  const undo = await call("/data/restore", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: { id: "undo" },
    env,
  });
  assert.equal(undo.status, 200);
  const undone = await undo.json();
  assert.equal(undone.data.byProfile.p1.watchlist.length, 6);
  assert.ok(undone.version > back.version);

  const missing = await call("/data/restore", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: { date: "1999-01-01" },
    env,
  });
  assert.equal(missing.status, 404);
});

test("profile tombstones survive a client that forgets them", () => {
  const prev = cinexBlob({
    profiles: [
      { id: "p1", name: "Domi", updatedAt: "2026-10-01T00:00:00.000Z" },
      { id: "p2", name: "Alt", updatedAt: "2026-10-01T00:00:00.000Z" },
    ],
    tombs: [{ id: "p2", kind: "profile", deleted: true, updatedAt: "2026-11-01T00:00:00.000Z" }],
  });
  const resurrected = cinexBlob({
    profiles: [
      { id: "p1", name: "Domi", updatedAt: "2026-10-01T00:00:00.000Z" },
      { id: "p2", name: "Alt", updatedAt: "2026-10-02T00:00:00.000Z" },
    ],
  });
  delete resurrected.profileTombstones;
  const guarded = guardProfiles(prev, resurrected);
  assert.deepEqual(guarded.profiles.map((p) => p.id), ["p1"]);
  assert.equal(guarded.byProfile.p2, undefined);
  assert.equal(guarded.profileTombstones.length, 1);

  const newer = cinexBlob({
    profiles: [{ id: "p2", name: "Alt", updatedAt: "2026-12-01T00:00:00.000Z" }],
    tombs: prev.profileTombstones,
  });
  const kept = guardProfiles(prev, newer);
  assert.equal(kept.profiles.length, 1);
  assert.equal(kept.profiles[0].id, "p2");
});

function listTombstones(rows, at) {
  return rows.map((row) => ({ id: row.id, kind: "watchlist", deleted: true, updatedAt: at }));
}

test("a tombstoned profile delete does not ask again", async () => {
  const env = envWith();
  const token = await register(env, "profiles");
  const two = cinexBlob({
    profiles: [
      { id: "p1", name: "Domi", updatedAt: "2026-10-01T00:00:00.000Z" },
      { id: "p2", name: "Gast", updatedAt: "2026-10-01T00:00:00.000Z" },
    ],
  });
  assert.equal((await putData(env, token, 0, two)).status, 200);
  const bare = cinexBlob({
    profiles: [{ id: "p1", name: "Domi", updatedAt: "2026-10-01T00:00:00.000Z" }],
  });
  const rejected = await putData(env, token, 1, bare);
  assert.equal(rejected.status, 422);
  assert.equal((await rejected.json()).losses[0].field, "profiles");
  const one = cinexBlob({
    profiles: [{ id: "p1", name: "Domi", updatedAt: "2026-10-01T00:00:00.000Z" }],
    tombs: [{ id: "p2", kind: "profile", deleted: true, updatedAt: "2026-11-20T12:00:00.000Z" }],
  });
  const put = await putData(env, token, 1, one);
  assert.equal(put.status, 200);
});

test("restore wins on the other device, including a small shrink", async () => {
  const env = envWith({ SNAPSHOT_DAY: "2026-11-20" });
  const token = await register(env, "multi");
  const full = cinexBlob({ watchlist: films(100) });
  const oldAt = "2026-11-20T09:00:00.000Z";
  const trimmed = cinexBlob({ watchlist: films(92) });
  trimmed.byProfile.p1._tombstones = listTombstones(films(8, 92), oldAt);
  assert.equal((await putData(env, token, 0, full)).status, 200);
  assert.equal((await putData(env, token, 1, trimmed)).status, 200);
  const restored = await call("/data/restore", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: { id: "2026-11-20" },
    env,
  });
  assert.equal(restored.status, 200);
  const cloud = await restored.json();
  assert.equal(cloud.data.byProfile.p1.watchlist.length, 100);
  assert.ok(cloud.data.restoredAt);

  const other = cinexBlob({ watchlist: films(92) });
  other.byProfile.p1._tombstones = listTombstones(films(8, 92), oldAt);
  const revert = await putData(env, token, cloud.version, other);
  assert.equal(revert.status, 200);
  const after = await call("/data", { headers: { Authorization: `Bearer ${token}` }, env });
  const body = await after.json();
  assert.equal(body.data.byProfile.p1.watchlist.length, 100);
  assert.equal(body.data.restoredAt, cloud.data.restoredAt);

  const heavy = cinexBlob({ watchlist: films(80) });
  heavy.byProfile.p1._tombstones = listTombstones(films(20, 80), oldAt);
  const blocked = await putData(env, token, body.version, heavy);
  assert.equal(blocked.status, 200);
  const kept = await call("/data", { headers: { Authorization: `Bearer ${token}` }, env });
  const keptBody = await kept.json();
  assert.equal(keptBody.data.byProfile.p1.watchlist.length, 100);

  const freshAt = "2099-01-01T00:00:00.000Z";
  const later = cinexBlob({ watchlist: films(97) });
  later.byProfile.p1._tombstones = listTombstones(films(3, 97), freshAt);
  const fresh = await putData(env, token, keptBody.version, later);
  assert.equal(fresh.status, 200);
  const finalBody = await call("/data", { headers: { Authorization: `Bearer ${token}` }, env });
  const ids = (await finalBody.json()).data.byProfile.p1.watchlist.map((row) => row.id);
  assert.equal(ids.length, 97);
  assert.equal(ids.includes("t97"), false);
  assert.equal(ids.includes("t0"), true);
});

test("verify checks the password and does not mint a token", async () => {
  const env = envWith();
  const token = await register(env, "checker", "pass1234");
  const before = [...env.CINEX_SYNC.store.keys()].filter((key) => key.startsWith("tok:")).length;
  const bad = await call("/verify", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: { name: "checker", password: "nope" },
    env,
  });
  assert.equal(bad.status, 401);
  const good = await call("/verify", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: { name: "Checker", password: "pass1234" },
    env,
  });
  assert.equal(good.status, 200);
  assert.equal((await good.json()).ok, true);
  const after = [...env.CINEX_SYNC.store.keys()].filter((key) => key.startsWith("tok:")).length;
  assert.equal(after, before);
  const anon = await call("/verify", {
    method: "POST",
    body: { name: "checker", password: "pass1234" },
    env,
  });
  assert.equal(anon.status, 401);
});
