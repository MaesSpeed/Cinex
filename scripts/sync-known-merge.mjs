/**
 * Known-map merge helpers (mirrored in app.js). Node tests use this module.
 */

export const KNOWN_SYNC_META_KEYS = new Set(["updatedAt", "deleted", "id", "at"]);

export function normalizeKnownMap(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out = {};
  for (const [key, val] of Object.entries(raw)) {
    if (KNOWN_SYNC_META_KEYS.has(key)) continue;
    if (!val || typeof val !== "object" || Array.isArray(val)) continue;
    const id = val.id != null ? String(val.id) : key;
    if (!id) continue;
    out[id] = Object.assign({}, val, { id });
  }
  return out;
}

function knownEntryTs(film) {
  if (!film || typeof film !== "object") return 0;
  const t = film.updatedAt || film.syncedAt;
  if (!t) return 0;
  const n = Date.parse(t);
  return Number.isFinite(n) ? n : 0;
}

function castLen(film) {
  if (!film || typeof film !== "object") return 0;
  if (Array.isArray(film.cast)) return film.cast.length;
  if (typeof film.cast === "string" && film.cast.trim()) return 1;
  return 0;
}

export function knownEntryRichness(film) {
  if (!film || typeof film !== "object") return 0;
  let s = 0;
  const title = String(film.title || "").trim();
  if (title && title !== "Lädt…") s += 10;
  if (film.poster) s += 8;
  if (Number(film.minutes || film.runtime) > 0) s += 4;
  s += Math.min(castLen(film), 4) * 2;
  if (String(film.overview || "").trim()) s += 2;
  if (Array.isArray(film.genres) && film.genres.length) s += 1;
  return s;
}

export function pickRicherKnownEntry(a, b) {
  if (!a) return b;
  if (!b) return a;
  const ta = knownEntryTs(a);
  const tb = knownEntryTs(b);
  if (ta && tb && ta !== tb) return ta > tb ? a : b;
  if (ta && !tb) return a;
  if (tb && !ta) return b;
  const ra = knownEntryRichness(a);
  const rb = knownEntryRichness(b);
  if (rb !== ra) return rb > ra ? b : a;
  return b;
}

export function mergeKnownMaps(localRaw, remoteRaw) {
  const local = normalizeKnownMap(localRaw);
  const remote = normalizeKnownMap(remoteRaw);
  const out = { ...local };
  for (const [id, remoteFilm] of Object.entries(remote)) {
    if (!out[id]) out[id] = remoteFilm;
    else out[id] = pickRicherKnownEntry(out[id], remoteFilm);
  }
  const localCount = Object.keys(local).length;
  if (Object.keys(out).length < localCount) {
    for (const [id, film] of Object.entries(local)) {
      if (!out[id]) out[id] = film;
      else out[id] = pickRicherKnownEntry(film, out[id]);
    }
  }
  return out;
}

export function tsOf(iso) {
  if (!iso) return 0;
  const n = Date.parse(iso);
  return Number.isFinite(n) ? n : 0;
}

export function newerWins(a, b) {
  const ta = tsOf(a && a.updatedAt) || tsOf(a && a.at) || 0;
  const tb = tsOf(b && b.updatedAt) || tsOf(b && b.at) || 0;
  if (ta === tb) return b;
  return ta > tb ? a : b;
}

export function mergeArrayById(localArr, remoteArr, kind) {
  const map = new Map();
  const itemKey = (row) => {
    if (!row || typeof row !== "object") return null;
    if (kind === "tags" || kind === "profiles") return row.id != null ? String(row.id) : null;
    if (row.id != null) return String(row.id);
    return null;
  };
  (Array.isArray(localArr) ? localArr : []).forEach((row) => {
    const k = itemKey(row);
    if (k != null) map.set(k, row);
  });
  (Array.isArray(remoteArr) ? remoteArr : []).forEach((row) => {
    const k = itemKey(row);
    if (k == null) return;
    if (!map.has(k)) map.set(k, row);
    else map.set(k, newerWins(map.get(k), row));
  });
  return [...map.values()].filter((row) => row && !row.deleted);
}

export function mergeProfileBags(localBag, remoteBag) {
  const a = localBag || {};
  const b = remoteBag || {};
  const out = {};
  const listKeys = ["watchlist", "queue", "history", "tags", "videoWatchlist", "videoQueue", "videoHistory"];
  listKeys.forEach((k) => {
    out[k] = mergeArrayById(a[k], b[k], k === "tags" ? "tags" : "list");
  });
  out.known = mergeKnownMaps(a.known, b.known);
  out.ratings = a.ratings || b.ratings || {};
  return out;
}

/** List row resolution: never drop missing metadata (placeholder until hydration). */
export function resolveListFilmId(id, findFilm) {
  const hit = findFilm(id);
  if (hit) return hit;
  const sid = String(id);
  const num = Number(sid.replace(/^t/i, ""));
  return {
    id: sid,
    tmdb: Number.isFinite(num) && num > 0 ? num : 0,
    title: "Lädt…",
    genre: "Film",
    minutes: 0,
    poster: "",
    color: "#1d4f91",
  };
}

export function filmsFromIdRows(rows, findFilm) {
  return (Array.isArray(rows) ? rows : [])
    .map((row) => row && row.id != null ? resolveListFilmId(row.id, findFilm) : null)
    .filter(Boolean);
}
