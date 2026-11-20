// cinex-sync: name+password accounts with an opaque, versioned JSON data blob.
// KV layout (binding CINEX_SYNC) — unchanged ids, no migration:
//   user:<name>              {hash, salt, iter, createdAt}
//   data:<name>              {version, updatedAt, data}
//   tok:<token>              {name, createdAt, expiresAt?}   (sliding TTL, default 30 days)
//   hist:<name>:<YYYY-MM-DD> one snapshot per UTC day, 30-day expiration
//   hist:<name>:undo         state from just before the latest restore, when the daily slot was already taken
//   rl:login:<name>:<ip>     failed-login counter  (15 min window, max 5)
//   rl:reg:<ip>              register counter      (1 h window, max 3)

export const PBKDF2_ITER = 100_000;
const LOGIN_FAIL_MAX = 5;
const LOGIN_WINDOW_S = 15 * 60;
const REG_MAX = 3;
const REG_WINDOW_S = 60 * 60;
const DEFAULT_TTL_S = 30 * 24 * 3600;
const DEFAULT_MAX_BYTES = 1024 * 1024;
const HIST_TTL_S = 30 * 24 * 3600;
const PROFILE_TOMB_KIND = "profile";
const NAME_RE = /^[\p{L}\p{N}_.\- ]{3,32}$/u;
const PROD_ORIGIN = "https://maesspeed.github.io";
const SHRINK_FIELDS = ["watchlist", "history", "ratings", "profiles"];
const FILM_TAG_META = new Set(["updatedAt", "deleted", "id", "at"]);

const enc = new TextEncoder();

export function isAllowedOrigin(origin, extra) {
  if (!origin) return true; // non-browser clients (curl, tests)
  if (origin === PROD_ORIGIN) return true;
  let url;
  try { url = new URL(origin); } catch { return false; }
  if (url.protocol === "http:" || url.protocol === "https:") {
    const h = url.hostname;
    if (h === "localhost" || h === "127.0.0.1" || h === "[::1]") return true;
  }
  return String(extra || "").split(",").map((s) => s.trim()).filter(Boolean).includes(origin);
}

function cors(origin, ok) {
  const h = {
    "Access-Control-Allow-Methods": "GET, PUT, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
  if (origin && ok) h["Access-Control-Allow-Origin"] = origin;
  return h;
}

function json(data, status, ctx, extra) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...cors(ctx.origin, ctx.originOk),
      ...(extra || {}),
    },
  });
}

export function normalizeName(raw) {
  return String(raw || "").trim().normalize("NFC");
}
export function nameKey(name) {
  return normalizeName(name).toLowerCase();
}
export function isValidName(raw) {
  return NAME_RE.test(normalizeName(raw));
}

function hex(buf) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function unhex(s) {
  const out = new Uint8Array(s.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(s.slice(i * 2, i * 2 + 2), 16);
  return out;
}
export function randomHex(bytes = 32) {
  const b = new Uint8Array(bytes);
  crypto.getRandomValues(b);
  return hex(b);
}

export async function hashPassword(password, saltHex, iter = PBKDF2_ITER) {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: unhex(saltHex), iterations: iter },
    key,
    256,
  );
  return hex(bits);
}

export function timingSafeEqualHex(a, b) {
  const x = String(a), y = String(b);
  let diff = x.length ^ y.length;
  const n = Math.max(x.length, y.length);
  for (let i = 0; i < n; i++) diff |= (x.charCodeAt(i) || 0) ^ (y.charCodeAt(i) || 0);
  return diff === 0;
}

function ttl(env) {
  const n = Number(env.TOKEN_TTL_SECONDS || DEFAULT_TTL_S);
  return Number.isFinite(n) && n >= 60 ? Math.floor(n) : DEFAULT_TTL_S;
}
function maxBytes(env) {
  const n = Number(env.MAX_DATA_BYTES || DEFAULT_MAX_BYTES);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_MAX_BYTES;
}
function clientIp(req) {
  return req.headers.get("CF-Connecting-IP") || req.headers.get("X-Forwarded-For")?.split(",")[0].trim() || "local";
}

export function currentSnapshotDay(env, nowMs = Date.now()) {
  const override = env && typeof env.SNAPSHOT_DAY === "string" ? env.SNAPSHOT_DAY : "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(override)) return override;
  return new Date(nowMs).toISOString().slice(0, 10);
}

function tsOf(value) {
  const n = Date.parse(value || "");
  return Number.isFinite(n) ? n : 0;
}

function listCount(arr) {
  if (!Array.isArray(arr)) return 0;
  let n = 0;
  for (const row of arr) {
    if (row && typeof row === "object" && !row.deleted) n += 1;
  }
  return n;
}

function ratingsCount(map) {
  if (!map || typeof map !== "object" || Array.isArray(map)) return 0;
  let n = 0;
  for (const [id, cell] of Object.entries(map)) {
    if (FILM_TAG_META.has(id)) continue;
    if (cell && typeof cell === "object" && cell.deleted) continue;
    n += 1;
  }
  return n;
}

export function bucketCounts(data) {
  const counts = { watchlist: 0, history: 0, ratings: 0, profiles: 0 };
  if (!data || typeof data !== "object" || Array.isArray(data)) return counts;
  if (data.format !== "cinex-sync") return counts;
  const profiles = Array.isArray(data.profiles) ? data.profiles : [];
  counts.profiles = profiles.filter((p) => p && typeof p === "object" && !p.deleted && p.id != null).length;
  const bags = data.byProfile && typeof data.byProfile === "object" && !Array.isArray(data.byProfile)
    ? data.byProfile
    : {};
  for (const bag of Object.values(bags)) {
    if (!bag || typeof bag !== "object") continue;
    counts.watchlist += listCount(bag.watchlist);
    counts.history += listCount(bag.history);
    counts.ratings += ratingsCount(bag.ratings);
  }
  return counts;
}

function excusedProfileDeletes(prev, next) {
  if (!prev || !next || prev.format !== "cinex-sync" || next.format !== "cinex-sync") return 0;
  const prevIds = new Set((prev.profiles || []).filter((p) => p && !p.deleted && p.id != null).map((p) => String(p.id)));
  const nextIds = new Set((next.profiles || []).filter((p) => p && !p.deleted && p.id != null).map((p) => String(p.id)));
  const tombs = new Set((next.profileTombstones || [])
    .filter((row) => row && row.deleted !== false && row.id != null)
    .map((row) => String(row.id)));
  let n = 0;
  for (const id of prevIds) {
    if (!nextIds.has(id) && tombs.has(id)) n += 1;
  }
  return n;
}

export function shrinkLosses(prev, next) {
  if (next == null || typeof next !== "object" || Array.isArray(next)) {
    const before = bucketCounts(prev);
    const any = before.watchlist + before.history + before.ratings + before.profiles;
    if (prev == null && any === 0) return [];
    return [{ field: "data", before: any || 1, after: 0, lost: any || 1, nullData: true }];
  }
  const a = bucketCounts(prev);
  const b = bucketCounts(next);
  const excused = excusedProfileDeletes(prev, next);
  const losses = [];
  for (const field of SHRINK_FIELDS) {
    let lost = a[field] - b[field];
    if (field === "profiles") lost -= excused;
    if (lost <= 0) continue;
    const pct = a[field] > 0 ? lost / a[field] : 0;
    if (lost > 10 || pct > 0.1) {
      losses.push({ field, before: a[field], after: a[field] - lost, lost });
    }
  }
  return losses;
}

function sanitizeFilmTags(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return raw;
  const out = {};
  for (const [key, val] of Object.entries(raw)) {
    if (FILM_TAG_META.has(key)) continue;
    if (!Array.isArray(val)) continue;
    out[key] = val.map((id) => String(id));
  }
  return out;
}

function sanitizeSyncBlob(data) {
  if (!data || typeof data !== "object" || data.format !== "cinex-sync" || !data.byProfile) return data;
  const byProfile = {};
  for (const [pid, bag] of Object.entries(data.byProfile)) {
    if (!bag || typeof bag !== "object" || Array.isArray(bag)) {
      byProfile[pid] = bag;
      continue;
    }
    const next = { ...bag };
    if (next.filmTags && typeof next.filmTags === "object") next.filmTags = sanitizeFilmTags(next.filmTags);
    byProfile[pid] = next;
  }
  return { ...data, byProfile };
}

function asProfileTomb(row) {
  if (!row || row.id == null || row.deleted === false) return null;
  if (row.kind && row.kind !== PROFILE_TOMB_KIND) return null;
  return {
    id: String(row.id),
    kind: PROFILE_TOMB_KIND,
    deleted: true,
    updatedAt: row.updatedAt || new Date(0).toISOString(),
  };
}

export function mergeProfileTombstones(localRows, remoteRows) {
  const map = new Map();
  const all = []
    .concat(Array.isArray(localRows) ? localRows : [])
    .concat(Array.isArray(remoteRows) ? remoteRows : []);
  for (const row of all) {
    const tomb = asProfileTomb(row);
    if (!tomb) continue;
    const prev = map.get(tomb.id);
    if (!prev || tsOf(tomb.updatedAt) >= tsOf(prev.updatedAt)) map.set(tomb.id, tomb);
  }
  return [...map.values()];
}

export function guardProfiles(prevData, nextData) {
  if (!nextData || typeof nextData !== "object" || Array.isArray(nextData) || nextData.format !== "cinex-sync") {
    return nextData;
  }
  const prev = prevData && typeof prevData === "object" && prevData.format === "cinex-sync" ? prevData : null;
  let tombs = mergeProfileTombstones(
    prev ? prev.profileTombstones : [],
    nextData.profileTombstones,
  );
  const restoreCut = tsOf(prev && prev.restoredAt);
  if (restoreCut) tombs = tombs.filter((row) => tsOf(row.updatedAt) > restoreCut);
  const byId = new Map(tombs.map((row) => [row.id, row]));
  const profiles = (Array.isArray(nextData.profiles) ? nextData.profiles : []).filter((p) => {
    if (!p || typeof p !== "object" || p.deleted || p.id == null) return false;
    const tomb = byId.get(String(p.id));
    if (!tomb) return true;
    return tsOf(p.updatedAt) > tsOf(tomb.updatedAt);
  });
  const kept = new Set(profiles.map((p) => String(p.id)));
  const byProfile = { ...(nextData.byProfile && typeof nextData.byProfile === "object" ? nextData.byProfile : {}) };
  for (const id of byId.keys()) {
    if (!kept.has(id)) delete byProfile[id];
  }
  return sanitizeSyncBlob({ ...nextData, profiles, profileTombstones: tombs, byProfile });
}

const RESTORE_LISTS = {
  watchlist: "watchlist",
  queue: "queue",
  history: "history",
  tags: "tags",
  videoWatchlist: "videoWatchlist",
  videoQueue: "videoQueue",
  videoHistory: "videoHistory",
};

function rowTs(row) {
  return tsOf(row && row.updatedAt) || tsOf(row && row.at) || 0;
}

function applyBagEpoch(prevBag, nextBag, cut) {
  const prev = prevBag && typeof prevBag === "object" && !Array.isArray(prevBag) ? prevBag : {};
  const next = nextBag && typeof nextBag === "object" && !Array.isArray(nextBag) ? nextBag : {};
  const tombs = (Array.isArray(next._tombstones) ? next._tombstones : []).filter((row) => row && tsOf(row.updatedAt) > cut);
  const tombKey = new Set(tombs.map((row) => `${row.kind}:${row.id}`));
  const out = { ...next, _tombstones: tombs };
  for (const [key, kind] of Object.entries(RESTORE_LISTS)) {
    const prevRows = Array.isArray(prev[key]) ? prev[key] : [];
    const nextRows = Array.isArray(next[key]) ? next[key] : [];
    if (!prevRows.length && !nextRows.length) continue;
    const prevBy = new Map();
    for (const row of prevRows) {
      if (row && row.id != null && !row.deleted) prevBy.set(String(row.id), row);
    }
    const merged = new Map();
    for (const row of nextRows) {
      if (!row || row.id == null || row.deleted) continue;
      const id = String(row.id);
      const old = prevBy.get(id);
      merged.set(id, old && rowTs(row) <= cut ? old : row);
    }
    for (const [id, old] of prevBy) {
      if (merged.has(id)) continue;
      if (tombKey.has(`${kind}:${id}`)) continue;
      merged.set(id, old);
    }
    out[key] = [...merged.values()];
  }
  if ((prev.ratings && typeof prev.ratings === "object") || (next.ratings && typeof next.ratings === "object")) {
    const prevRatings = prev.ratings && typeof prev.ratings === "object" && !Array.isArray(prev.ratings) ? prev.ratings : {};
    const nextRatings = next.ratings && typeof next.ratings === "object" && !Array.isArray(next.ratings) ? next.ratings : {};
    const ratings = { ...nextRatings };
    for (const id of Object.keys(prevRatings)) {
      const old = prevRatings[id];
      const cur = nextRatings[id];
      if (cur == null) {
        if (!tombKey.has(`ratings:${id}`)) ratings[id] = old;
      } else {
        const curTs = cur && typeof cur === "object" ? rowTs(cur) : 0;
        ratings[id] = curTs > cut ? cur : old;
      }
    }
    out.ratings = ratings;
  }
  return out;
}

export function applyRestoreEpoch(prev, next) {
  if (!next || typeof next !== "object" || Array.isArray(next) || next.format !== "cinex-sync") return next;
  if (!prev || typeof prev !== "object" || prev.format !== "cinex-sync" || !prev.restoredAt) return next;
  if (tsOf(next.restoredAt) > tsOf(prev.restoredAt)) return next;
  const cut = tsOf(prev.restoredAt);
  const prevProfiles = new Map();
  for (const row of Array.isArray(prev.profiles) ? prev.profiles : []) {
    if (row && row.id != null && !row.deleted) prevProfiles.set(String(row.id), row);
  }
  const freshTombs = (Array.isArray(next.profileTombstones) ? next.profileTombstones : [])
    .filter((row) => row && row.id != null && row.deleted !== false && tsOf(row.updatedAt) > cut);
  const freshIds = new Set(freshTombs.map((row) => String(row.id)));
  const profiles = [];
  const seen = new Set();
  for (const row of Array.isArray(next.profiles) ? next.profiles : []) {
    if (!row || row.id == null || row.deleted) continue;
    const id = String(row.id);
    seen.add(id);
    const old = prevProfiles.get(id);
    profiles.push(old && rowTs(row) <= cut ? old : row);
  }
  for (const [id, old] of prevProfiles) {
    if (seen.has(id) || freshIds.has(id)) continue;
    profiles.push(old);
  }
  const prevBags = prev.byProfile && typeof prev.byProfile === "object" ? prev.byProfile : {};
  const nextBags = next.byProfile && typeof next.byProfile === "object" ? next.byProfile : {};
  const pids = new Set([
    ...Object.keys(prevBags),
    ...Object.keys(nextBags),
    ...profiles.map((row) => String(row.id)),
  ]);
  const kept = new Set(profiles.map((row) => String(row.id)));
  const byProfile = {};
  for (const pid of pids) {
    if (!kept.has(pid)) continue;
    byProfile[pid] = applyBagEpoch(prevBags[pid], nextBags[pid], cut);
  }
  return {
    ...next,
    restoredAt: prev.restoredAt,
    profiles,
    profileTombstones: freshTombs,
    byProfile,
  };
}

function withRestoreStamp(data) {
  const restoredAt = new Date().toISOString();
  if (data && typeof data === "object" && !Array.isArray(data)) return { ...data, restoredAt };
  return data;
}

async function readJson(req, limit) {
  const len = Number(req.headers.get("Content-Length") || 0);
  if (len > limit) return { tooLarge: true };
  const text = await req.text();
  if (enc.encode(text).length > limit) return { tooLarge: true };
  try { return { body: JSON.parse(text) }; } catch { return { bad: true }; }
}

async function counter(kv, key) {
  const v = await kv.get(key);
  return v ? JSON.parse(v) : { n: 0, exp: 0 };
}
async function bump(kv, key, windowS) {
  const now = Math.floor(Date.now() / 1000);
  let c = await counter(kv, key);
  if (!c.exp || c.exp <= now) c = { n: 0, exp: now + windowS };
  c.n += 1;
  await kv.put(key, JSON.stringify(c), { expirationTtl: Math.max(60, c.exp - now) });
  return c;
}
function retryAfter(c) {
  return String(Math.max(1, c.exp - Math.floor(Date.now() / 1000)));
}

function histKey(name, id) {
  return `hist:${name}:${id}`;
}

function snapshotRecord(cur, day, undo) {
  return {
    version: cur.version,
    updatedAt: cur.updatedAt,
    data: cur.data,
    snapshotDate: day,
    undo: Boolean(undo),
  };
}

async function putHist(kv, key, cur, day, undo) {
  await kv.put(key, JSON.stringify(snapshotRecord(cur, day, undo)), { expirationTtl: HIST_TTL_S });
}

async function preserveBeforeOverwrite(kv, name, cur, env, restoringId) {
  if (!cur || !cur.version || cur.data == null) return;
  const day = currentSnapshotDay(env);
  const dailyKey = histKey(name, day);
  const existing = await kv.get(dailyKey);
  if (!existing) {
    await putHist(kv, dailyKey, cur, day, false);
    return;
  }
  if (!restoringId) return;
  let existingVersion = null;
  try { existingVersion = JSON.parse(existing).version; } catch { existingVersion = null; }
  if (existingVersion === cur.version) return;
  await putHist(kv, histKey(name, "undo"), cur, day, true);
}

async function listHist(kv, name) {
  const prefix = `hist:${name}:`;
  const names = [];
  let cursor;
  do {
    const page = await kv.list({ prefix, cursor });
    for (const key of page.keys || []) names.push(key.name);
    cursor = page && page.list_complete === false ? page.cursor : "";
  } while (cursor);
  const snaps = [];
  for (const key of names) {
    const raw = await kv.get(key);
    if (!raw) continue;
    let row;
    try { row = JSON.parse(raw); } catch { continue; }
    const id = key.slice(prefix.length);
    if (!id) continue;
    snaps.push({
      id,
      date: row.snapshotDate || (id === "undo" ? "" : id),
      updatedAt: row.updatedAt || null,
      version: row.version,
      undo: Boolean(row.undo || id === "undo"),
    });
  }
  snaps.sort((a, b) => tsOf(b.updatedAt) - tsOf(a.updatedAt));
  return snaps;
}

async function authName(req, env) {
  const m = /^Bearer\s+([0-9a-f]{64})$/i.exec(req.headers.get("Authorization") || "");
  if (!m) return null;
  const token = m[1].toLowerCase();
  const raw = await env.CINEX_SYNC.get(`tok:${token}`);
  if (!raw) return null;
  let rec;
  try { rec = JSON.parse(raw); } catch { return null; }
  if (!rec || typeof rec.name !== "string" || !rec.name) return null;
  const life = ttl(env);
  const exp = tsOf(rec.expiresAt);
  const refresh = !exp || exp - Date.now() < (life / 2) * 1000;
  if (refresh) {
    const expiresAt = new Date(Date.now() + life * 1000).toISOString();
    await env.CINEX_SYNC.put(
      `tok:${token}`,
      JSON.stringify({
        name: rec.name,
        createdAt: rec.createdAt || new Date().toISOString(),
        expiresAt,
      }),
      { expirationTtl: life },
    );
  }
  return { name: rec.name, token };
}

async function issueToken(env, key) {
  const token = randomHex(32);
  const t = ttl(env);
  const expiresAt = new Date(Date.now() + t * 1000).toISOString();
  await env.CINEX_SYNC.put(
    `tok:${token}`,
    JSON.stringify({ name: key, createdAt: new Date().toISOString(), expiresAt }),
    { expirationTtl: t },
  );
  return { token, expiresAt };
}

async function loadUser(kv, key) {
  const raw = await kv.get(`user:${key}`);
  return raw ? JSON.parse(raw) : null;
}

async function passwordMatches(user, password) {
  const hash = await hashPassword(password, user ? user.salt : "00".repeat(16), user ? user.iter : PBKDF2_ITER);
  return Boolean(user) && timingSafeEqualHex(hash, user.hash);
}

async function readData(kv, name) {
  const raw = await kv.get(`data:${name}`);
  return raw ? JSON.parse(raw) : { version: 0, updatedAt: null, data: null };
}

function emptyData() {
  return { version: 0, updatedAt: null, data: null };
}

export async function handle(req, env) {
  const kv = env.CINEX_SYNC;
  const url = new URL(req.url);
  const origin = req.headers.get("Origin") || "";
  const ctx = { origin, originOk: isAllowedOrigin(origin, env.ALLOWED_ORIGINS) };
  const path = url.pathname.replace(/\/+$/, "") || "/";

  if (req.method === "OPTIONS") {
    return new Response(null, { status: ctx.originOk ? 204 : 403, headers: cors(origin, ctx.originOk) });
  }
  if (!ctx.originOk) return json({ error: "origin_not_allowed" }, 403, ctx);

  if (path === "/health" && req.method === "GET") return json({ ok: true, service: "cinex-sync" }, 200, ctx);

  if ((path === "/register" || path === "/login") && req.method === "POST") {
    const { body, bad, tooLarge } = await readJson(req, 4096);
    if (tooLarge) return json({ error: "too_large" }, 413, ctx);
    if (bad || !body || typeof body !== "object") return json({ error: "bad_json" }, 400, ctx);
    const name = normalizeName(body.name);
    const password = typeof body.password === "string" ? body.password : "";
    if (!isValidName(name)) return json({ error: "invalid_name" }, 400, ctx);
    if (password.length < 1 || password.length > 256) return json({ error: "invalid_password" }, 400, ctx);
    const key = nameKey(name);
    const ip = clientIp(req);

    if (path === "/register") {
      if (password.length < 4) return json({ error: "password_too_short" }, 400, ctx);
      const regMax = Number(env.REGISTER_MAX || REG_MAX);
      const rk = `rl:reg:${ip}`;
      const c = await counter(kv, rk);
      if (c.exp > Date.now() / 1000 && c.n >= regMax) return json({ error: "rate_limited" }, 429, ctx, { "Retry-After": retryAfter(c) });
      if (await kv.get(`user:${key}`)) return json({ error: "name_taken" }, 409, ctx);
      await bump(kv, rk, REG_WINDOW_S);
      const salt = randomHex(16);
      const hash = await hashPassword(password, salt);
      await kv.put(`user:${key}`, JSON.stringify({ name, hash, salt, iter: PBKDF2_ITER, createdAt: new Date().toISOString() }));
      const t = await issueToken(env, key);
      return json({ ok: true, name, ...t }, 201, ctx);
    }

    const lk = `rl:login:${key}:${ip}`;
    const c = await counter(kv, lk);
    if (c.exp > Date.now() / 1000 && c.n >= LOGIN_FAIL_MAX) return json({ error: "rate_limited" }, 429, ctx, { "Retry-After": retryAfter(c) });
    const user = await loadUser(kv, key);
    if (!(await passwordMatches(user, password))) {
      const n = await bump(kv, lk, LOGIN_WINDOW_S);
      if (n.n >= LOGIN_FAIL_MAX) return json({ error: "rate_limited" }, 429, ctx, { "Retry-After": retryAfter(n) });
      return json({ error: "invalid_credentials" }, 401, ctx);
    }
    await kv.delete(lk);
    const t = await issueToken(env, key);
    return json({ ok: true, name: user.name, ...t }, 200, ctx);
  }

  if (path === "/verify" && req.method === "POST") {
    const a = await authName(req, env);
    if (!a) return json({ error: "unauthorized" }, 401, ctx);
    const { body, bad, tooLarge } = await readJson(req, 4096);
    if (tooLarge) return json({ error: "too_large" }, 413, ctx);
    if (bad || !body || typeof body !== "object") return json({ error: "bad_json" }, 400, ctx);
    const name = normalizeName(body.name);
    const password = typeof body.password === "string" ? body.password : "";
    if (!isValidName(name) || nameKey(name) !== a.name) return json({ error: "unauthorized" }, 401, ctx);
    if (password.length < 1 || password.length > 256) return json({ error: "invalid_password" }, 400, ctx);
    const ip = clientIp(req);
    const lk = `rl:login:${a.name}:${ip}`;
    const c = await counter(kv, lk);
    if (c.exp > Date.now() / 1000 && c.n >= LOGIN_FAIL_MAX) return json({ error: "rate_limited" }, 429, ctx, { "Retry-After": retryAfter(c) });
    const user = await loadUser(kv, a.name);
    if (!(await passwordMatches(user, password))) {
      const n = await bump(kv, lk, LOGIN_WINDOW_S);
      if (n.n >= LOGIN_FAIL_MAX) return json({ error: "rate_limited" }, 429, ctx, { "Retry-After": retryAfter(n) });
      return json({ error: "invalid_credentials" }, 401, ctx);
    }
    await kv.delete(lk);
    return json({ ok: true, name: user.name }, 200, ctx);
  }

  if (path === "/logout" && req.method === "POST") {
    const a = await authName(req, env);
    if (a) await kv.delete(`tok:${a.token}`);
    return json({ ok: true }, 200, ctx);
  }

  if (path === "/data/history" && req.method === "GET") {
    const a = await authName(req, env);
    if (!a) return json({ error: "unauthorized" }, 401, ctx);
    const snapshots = await listHist(kv, a.name);
    return json({ snapshots }, 200, ctx);
  }

  if (path === "/data/restore" && req.method === "POST") {
    const a = await authName(req, env);
    if (!a) return json({ error: "unauthorized" }, 401, ctx);
    const { body, bad, tooLarge } = await readJson(req, 4096);
    if (tooLarge) return json({ error: "too_large" }, 413, ctx);
    if (bad || !body || typeof body !== "object") return json({ error: "bad_json" }, 400, ctx);
    const id = String(body.id || body.date || "");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(id) && id !== "undo") return json({ error: "bad_snapshot" }, 400, ctx);
    const raw = await kv.get(histKey(a.name, id));
    if (!raw) return json({ error: "snapshot_not_found" }, 404, ctx);
    let snap;
    try { snap = JSON.parse(raw); } catch { return json({ error: "snapshot_not_found" }, 404, ctx); }
    if (!snap || snap.data == null) return json({ error: "snapshot_empty" }, 422, ctx);
    const cur = await readData(kv, a.name);
    await preserveBeforeOverwrite(kv, a.name, cur.version ? cur : emptyData(), env, id);
    const next = {
      version: (Number(cur.version) || 0) + 1,
      updatedAt: new Date().toISOString(),
      data: withRestoreStamp(snap.data),
    };
    await kv.put(`data:${a.name}`, JSON.stringify(next));
    return json({ ok: true, version: next.version, updatedAt: next.updatedAt, data: next.data, restoredFrom: id }, 200, ctx);
  }

  if (path === "/data") {
    const a = await authName(req, env);
    if (!a) return json({ error: "unauthorized" }, 401, ctx);
    const dk = `data:${a.name}`;
    const cur = await readData(kv, a.name);

    if (req.method === "GET") return json(cur, 200, ctx);

    if (req.method === "PUT") {
      const { body, bad, tooLarge } = await readJson(req, maxBytes(env));
      if (tooLarge) return json({ error: "too_large", limit: maxBytes(env) }, 413, ctx);
      if (bad || !body || typeof body !== "object") return json({ error: "bad_json" }, 400, ctx);
      if (!Number.isInteger(body.baseVersion) || body.baseVersion < 0) return json({ error: "missing_baseVersion" }, 400, ctx);
      if (!("data" in body) || body.data === undefined) return json({ error: "missing_data" }, 400, ctx);
      if (body.baseVersion !== cur.version) return json({ error: "version_conflict", current: cur }, 409, ctx);
      let nextData = body.data;
      if (nextData && typeof nextData === "object" && !Array.isArray(nextData) && nextData.format === "cinex-sync") {
        nextData = applyRestoreEpoch(cur.data, nextData);
        nextData = guardProfiles(cur.data, nextData);
      }
      const confirm = body.confirmShrink === true;
      const losses = shrinkLosses(cur.data, nextData);
      if (!confirm && losses.length) return json({ error: "shrink_rejected", losses }, 422, ctx);
      await preserveBeforeOverwrite(kv, a.name, cur.version ? cur : emptyData(), env, null);
      const next = { version: cur.version + 1, updatedAt: new Date().toISOString(), data: nextData };
      await kv.put(dk, JSON.stringify(next));
      return json({ ok: true, version: next.version, updatedAt: next.updatedAt }, 200, ctx);
    }
    return json({ error: "method_not_allowed" }, 405, ctx, { Allow: "GET, PUT, OPTIONS" });
  }

  return json({ error: "not_found" }, 404, ctx);
}

