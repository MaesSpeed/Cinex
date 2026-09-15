#!/usr/bin/env node
/**
 * Build a lean offline films.json from TMDB v3.
 *
 * Reads TMDB_API_KEY from the environment only (classic v3 api_key or v4 Read Access Token / Bearer JWT). Never write the key to
 * config.js, films.json, or any committed file.
 *
 * Usage:
 *   TMDB_API_KEY=… node scripts/build-films-catalog.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_FILE = path.join(ROOT, "films.json");
const API = "https://api.themoviedb.org/3";
const KEY = String(process.env.TMDB_API_KEY || "").trim();
const LANG = "de-DE";
const REGION = "DE";
const POSTER_BASE = "https://image.tmdb.org/t/p/w185";
const COLOR = "#1d4f91";
const TARGET_MIN = 800;
const TARGET_MAX = 1500;
const LIST_CONCURRENCY = 4;
const DETAIL_CONCURRENCY = 6;
const RATE_MAX = 35;
const RATE_WINDOW_MS = 10_000;

const TMDB_GENRE_NAMES = {
  28: "Action",
  12: "Abenteuer",
  16: "Animation",
  35: "Komödie",
  80: "Krimi",
  99: "Doku",
  18: "Drama",
  10751: "Familie",
  14: "Fantasy",
  36: "Historie",
  27: "Horror",
  10402: "Musik",
  9648: "Mystery",
  10749: "Romanze",
  878: "Sci-Fi",
  10770: "TV-Film",
  53: "Thriller",
  10752: "Krieg",
  37: "Western",
};

/** Known collections (TMDB ids). Missing/404 ids are skipped. */
const COLLECTIONS = [
  { id: 645, aliases: ["Bond", "007", "James Bond"] },
  { id: 10, aliases: ["Star Wars", "Krieg der Sterne"] },
  { id: 119, aliases: ["LOTR", "Herr der Ringe", "Lord of the Rings"] },
  { id: 121938, aliases: ["Hobbit"] },
  { id: 1241, aliases: ["Harry Potter"] },
  { id: 435863, aliases: ["Fantastic Beasts", "Phantastische Tierwesen", "Harry Potter"] },
  { id: 9485, aliases: ["Fast Furious", "Fast & Furious", "Fast and Furious"] },
  { id: 87359, aliases: ["Mission Impossible", "Mission: Impossible"] },
  { id: 84, aliases: ["Indiana Jones"] },
  { id: 328, aliases: ["Jurassic", "Jurassic Park"] },
  { id: 295, aliases: ["Pirates", "Fluch der Karibik", "Pirates of the Caribbean"] },
  { id: 2344, aliases: ["Matrix"] },
  { id: 263, aliases: ["Batman", "Dark Knight"] },
  { id: 120794, aliases: ["Batman"] },
  { id: 556, aliases: ["Spider-Man", "Spiderman", "Spider Man"] },
  { id: 125574, aliases: ["Spider-Man", "Spiderman", "Spider Man"] },
  { id: 531241, aliases: ["Spider-Man", "Spiderman", "Spider Man"] },
  { id: 131292, aliases: ["Marvel", "Iron Man", "MCU"] },
  { id: 86311, aliases: ["Marvel", "Avengers", "MCU"] },
  { id: 284433, aliases: ["Marvel", "Guardians", "MCU"] },
  { id: 131295, aliases: ["Marvel", "Captain America", "MCU"] },
  { id: 131296, aliases: ["Marvel", "Thor", "MCU"] },
  { id: 422834, aliases: ["Marvel", "Ant-Man", "MCU"] },
  { id: 618529, aliases: ["Marvel", "Doctor Strange", "MCU"] },
  { id: 529892, aliases: ["Marvel", "Black Panther", "MCU"] },
  { id: 131297, aliases: ["Marvel", "MCU"] },
  { id: 748, aliases: ["X-Men", "Marvel"] },
  { id: 31562, aliases: ["Bourne"] },
  { id: 8091, aliases: ["Alien"] },
  { id: 528, aliases: ["Terminator"] },
  { id: 1570, aliases: ["Die Hard", "Stirb langsam"] },
  { id: 404609, aliases: ["John Wick"] },
  { id: 131635, aliases: ["Hunger Games", "Tribute von Panem"] },
  { id: 8650, aliases: ["Transformers"] },
  { id: 10194, aliases: ["Toy Story"] },
  { id: 8354, aliases: ["Ice Age", "Eiszeit"] },
  { id: 86030, aliases: ["Minions", "Despicable Me", "Ich einfach unverbesserlich"] },
  { id: 386079, aliases: ["Frozen", "Eiskönigin"] },
  { id: 726871, aliases: ["Dune", "Der Wüstenplanet"] },
  { id: 535313, aliases: ["Godzilla"] },
  { id: 173710, aliases: ["Planet der Affen", "Planet of the Apes"] },
  { id: 87096, aliases: ["Conjuring"] },
  { id: 2980, aliases: ["Ghostbusters", "Geisterjäger"] },
  { id: 264, aliases: ["Back to the Future", "Zurück in die Zukunft"] },
  { id: 1960, aliases: ["Rocky"] },
  { id: 2366, aliases: ["Rambo"] },
  { id: 1690, aliases: ["Predator"] },
  { id: 17255, aliases: ["Ocean's", "Oceans"] },
  { id: 123800, aliases: ["Now You See Me"] },
  { id: 1237, aliases: ["Narnia"] },
  { id: 135483, aliases: ["Twilight", "Bis(s)"] },
  { id: 386534, aliases: ["MonsterVerse", "Godzilla", "Kong"] },
  { id: 230, aliases: ["Star Trek"] },
  { id: 151, aliases: ["Star Trek"] },
  { id: 2150, aliases: ["Shrek"] },
  { id: 14890, aliases: ["Kung Fu Panda"] },
  { id: 89137, aliases: ["How to Train Your Dragon", "Drachenzähmen leicht gemacht"] },
  { id: 573436, aliases: ["Venom", "Marvel"] },
  { id: 448150, aliases: ["Jumanji"] },
  { id: 656, aliases: ["Saw"] },
  { id: 91361, aliases: ["Halloween"] },
  { id: 26029, aliases: ["Scream"] },
  { id: 8864, aliases: ["Final Destination"] },
  { id: 2806, aliases: ["American Pie"] },
  { id: 454543, aliases: ["Kingsman"] },
  { id: 468552, aliases: ["Wonder Woman", "DC"] },
  { id: 272, aliases: ["Batman", "DC"] },
  { id: 209578, aliases: ["Suicide Squad", "DC"] },
  { id: 147840, aliases: ["Mad Max"] },
  { id: 257840, aliases: ["Planet of the Apes", "Planet der Affen"] },
  { id: 157431, aliases: ["Fantastic Beasts", "Harry Potter"] },
  { id: 553714, aliases: ["IT", "Es"] },
  { id: 623304, aliases: ["The Batman", "Batman", "DC"] },
];

const COLLECTION_QUERIES = [
  { query: "James Bond", aliases: ["Bond", "007", "James Bond"] },
  { query: "Star Wars", aliases: ["Star Wars", "Krieg der Sterne"] },
  { query: "Lord of the Rings", aliases: ["LOTR", "Herr der Ringe"] },
  { query: "Hobbit", aliases: ["Hobbit"] },
  { query: "Harry Potter", aliases: ["Harry Potter"] },
  { query: "Fast and Furious", aliases: ["Fast Furious", "Fast & Furious"] },
  { query: "Mission Impossible", aliases: ["Mission Impossible"] },
  { query: "Indiana Jones", aliases: ["Indiana Jones"] },
  { query: "Jurassic", aliases: ["Jurassic"] },
  { query: "Pirates of the Caribbean", aliases: ["Pirates", "Fluch der Karibik"] },
  { query: "The Matrix", aliases: ["Matrix"] },
  { query: "Batman", aliases: ["Batman"] },
  { query: "Spider-Man", aliases: ["Spider-Man", "Spiderman"] },
  { query: "Avengers", aliases: ["Marvel", "Avengers", "MCU"] },
  { query: "X-Men", aliases: ["X-Men", "Marvel"] },
  { query: "Superman", aliases: ["Superman", "DC"] },
  { query: "John Wick", aliases: ["John Wick"] },
  { query: "Transformers", aliases: ["Transformers"] },
  { query: "Alien", aliases: ["Alien"] },
  { query: "Terminator", aliases: ["Terminator"] },
  { query: "Hunger Games", aliases: ["Hunger Games", "Tribute von Panem"] },
  { query: "Ghostbusters", aliases: ["Ghostbusters"] },
  { query: "Back to the Future", aliases: ["Zurück in die Zukunft"] },
  { query: "Bourne", aliases: ["Bourne"] },
  { query: "Die Hard", aliases: ["Die Hard", "Stirb langsam"] },
  { query: "Rocky", aliases: ["Rocky"] },
  { query: "Star Trek", aliases: ["Star Trek"] },
  { query: "Dune", aliases: ["Dune"] },
  { query: "Shrek", aliases: ["Shrek"] },
  { query: "Toy Story", aliases: ["Toy Story"] },
  { query: "Ice Age", aliases: ["Ice Age", "Eiszeit"] },
  { query: "Despicable Me", aliases: ["Minions"] },
  { query: "Frozen", aliases: ["Frozen", "Eiskönigin"] },
  { query: "Godzilla", aliases: ["Godzilla"] },
  { query: "Conjuring", aliases: ["Conjuring"] },
  { query: "Twilight", aliases: ["Twilight"] },
  { query: "Narnia", aliases: ["Narnia"] },
  { query: "Mad Max", aliases: ["Mad Max"] },
  { query: "Top Gun", aliases: ["Top Gun"] },
  { query: "Jumanji", aliases: ["Jumanji"] },
  { query: "Paddington", aliases: ["Paddington"] },
  { query: "Kung Fu Panda", aliases: ["Kung Fu Panda"] },
  { query: "How to Train Your Dragon", aliases: ["Drachenzähmen leicht gemacht"] },
  { query: "Planet of the Apes", aliases: ["Planet der Affen"] },
  { query: "The Godfather", aliases: ["Pate", "Godfather"] },
  { query: "Ocean's", aliases: ["Ocean's"] },
  { query: "Kingsman", aliases: ["Kingsman"] },
  { query: "Venom", aliases: ["Venom", "Marvel"] },
  { query: "Deadpool", aliases: ["Deadpool", "Marvel"] },
  { query: "Wonder Woman", aliases: ["Wonder Woman", "DC"] },
  { query: "Guardians of the Galaxy", aliases: ["Guardians", "Marvel"] },
];

const MOVIE_SEARCHES = [
  { query: "James Bond", aliases: ["Bond", "007", "James Bond"] },
  { query: "007", aliases: ["Bond", "007", "James Bond"] },
  { query: "Bond", aliases: ["Bond", "007"] },
  { query: "Skyfall", aliases: ["Bond", "007"] },
  { query: "Spectre", aliases: ["Bond", "007"] },
  { query: "Casino Royale", aliases: ["Bond", "007"] },
  { query: "Keine Zeit zu sterben", aliases: ["Bond", "007"] },
  { query: "Stirb an einem anderen Tag", aliases: ["Bond", "007"] },
  { query: "Ein Quantum Trost", aliases: ["Bond", "007"] },
  { query: "GoldenEye", aliases: ["Bond", "007"] },
  { query: "Marvel", aliases: ["Marvel", "MCU"] },
  { query: "Avengers", aliases: ["Marvel", "Avengers"] },
  { query: "Star Wars", aliases: ["Star Wars"] },
  { query: "Krieg der Sterne", aliases: ["Star Wars"] },
  { query: "Herr der Ringe", aliases: ["LOTR", "Herr der Ringe"] },
  { query: "Hobbit", aliases: ["Hobbit"] },
  { query: "Harry Potter", aliases: ["Harry Potter"] },
  { query: "Fast & Furious", aliases: ["Fast Furious"] },
  { query: "Mission Impossible", aliases: ["Mission Impossible"] },
  { query: "Indiana Jones", aliases: ["Indiana Jones"] },
  { query: "Jurassic Park", aliases: ["Jurassic"] },
  { query: "Jurassic World", aliases: ["Jurassic"] },
  { query: "Fluch der Karibik", aliases: ["Pirates", "Fluch der Karibik"] },
  { query: "Pirates of the Caribbean", aliases: ["Pirates"] },
  { query: "Matrix", aliases: ["Matrix"] },
  { query: "Batman", aliases: ["Batman"] },
  { query: "Spider-Man", aliases: ["Spider-Man", "Spiderman"] },
  { query: "Superman", aliases: ["Superman", "DC"] },
  { query: "Wonder Woman", aliases: ["Wonder Woman", "DC"] },
  { query: "Joker", aliases: ["Joker", "DC"] },
  { query: "Deadpool", aliases: ["Deadpool"] },
  { query: "X-Men", aliases: ["X-Men"] },
  { query: "John Wick", aliases: ["John Wick"] },
  { query: "Transformers", aliases: ["Transformers"] },
  { query: "Tribute von Panem", aliases: ["Hunger Games"] },
  { query: "Hunger Games", aliases: ["Hunger Games"] },
  { query: "Stirb langsam", aliases: ["Die Hard"] },
  { query: "Zurück in die Zukunft", aliases: ["Back to the Future"] },
  { query: "Dune", aliases: ["Dune"] },
  { query: "Minions", aliases: ["Minions"] },
  { query: "Eiskönigin", aliases: ["Frozen"] },
  { query: "Ice Age", aliases: ["Ice Age"] },
  { query: "Shrek", aliases: ["Shrek"] },
  { query: "Toy Story", aliases: ["Toy Story"] },
  { query: "Alien", aliases: ["Alien"] },
  { query: "Terminator", aliases: ["Terminator"] },
  { query: "Godzilla", aliases: ["Godzilla"] },
  { query: "Planet der Affen", aliases: ["Planet der Affen"] },
  { query: "Ghostbusters", aliases: ["Ghostbusters"] },
  { query: "Bourne", aliases: ["Bourne"] },
  { query: "Rocky", aliases: ["Rocky"] },
  { query: "Rambo", aliases: ["Rambo"] },
  { query: "Mad Max", aliases: ["Mad Max"] },
  { query: "Top Gun", aliases: ["Top Gun"] },
  { query: "Star Trek", aliases: ["Star Trek"] },
];

if (!KEY) {
  console.error(
    "Missing TMDB_API_KEY.\n" +
      "Add a repository secret named TMDB_API_KEY (Settings → Secrets and variables → Actions)\n" +
      "and re-run the workflow. Do not put the key in config.js or any committed file."
  );
  process.exit(1);
}

const recentStarts = [];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function takeToken() {
  while (true) {
    const now = Date.now();
    while (recentStarts.length && now - recentStarts[0] >= RATE_WINDOW_MS) {
      recentStarts.shift();
    }
    if (recentStarts.length < RATE_MAX) {
      recentStarts.push(now);
      return;
    }
    await sleep(RATE_WINDOW_MS - (now - recentStarts[0]) + 15);
  }
}

async function tmdb(pathname, params = {}, { optional = false } = {}) {
  const url = new URL(`${API}${pathname.startsWith("/") ? pathname : `/${pathname}`}`);
  const useBearer = KEY.length > 64 || KEY.startsWith("eyJ");
  if (!useBearer) url.searchParams.set("api_key", KEY);
  url.searchParams.set("language", LANG);
  url.searchParams.set("region", REGION);
  url.searchParams.set("include_adult", "false");
  for (const [name, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(name, String(value));
    }
  }
  const headers = { Accept: "application/json" };
  if (useBearer) headers.Authorization = `Bearer ${KEY}`;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    await takeToken();
    const res = await fetch(url, { headers });
    if (res.status === 404 && optional) return null;
    if (res.status === 429) {
      const retryAfter = Number(res.headers.get("retry-after")) || 1.5;
      await sleep(Math.min(20, retryAfter) * 1000);
      continue;
    }
    if (res.status >= 500 && attempt < 5) {
      await sleep(400 * (attempt + 1));
      continue;
    }
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      const err = new Error(`TMDB ${res.status} ${pathname}: ${body.slice(0, 180)}`);
      err.status = res.status;
      throw err;
    }
    return res.json();
  }
  throw new Error(`TMDB retry exhausted for ${pathname}`);
}

async function mapPool(items, limit, fn) {
  const out = new Array(items.length);
  let index = 0;
  async function worker() {
    while (index < items.length) {
      const current = index;
      index += 1;
      out[current] = await fn(items[current], current);
    }
  }
  const n = Math.min(limit, Math.max(1, items.length));
  await Promise.all(Array.from({ length: n }, () => worker()));
  return out;
}

function uniqueStrings(values) {
  const seen = new Set();
  const out = [];
  for (const value of values || []) {
    const text = String(value || "").trim();
    if (!text) continue;
    const key = text.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(text);
  }
  return out;
}

function genreNames(raw) {
  const names = [];
  const ids = Array.isArray(raw.genre_ids)
    ? raw.genre_ids
    : (Array.isArray(raw.genres) ? raw.genres.map((g) => (typeof g === "object" ? g.id : g)) : []);
  if (Array.isArray(raw.genres)) {
    for (const genre of raw.genres) {
      const mapped = TMDB_GENRE_NAMES[genre.id] || genre.name;
      if (mapped && !names.includes(mapped)) names.push(mapped);
    }
  }
  for (const id of ids) {
    const mapped = TMDB_GENRE_NAMES[id];
    if (mapped && !names.includes(mapped)) names.push(mapped);
  }
  return names;
}

function posterUrl(path) {
  if (!path) return "";
  const normalized = String(path).startsWith("/") ? path : `/${path}`;
  if (String(path).startsWith("http")) return String(path);
  return `${POSTER_BASE}${normalized}`;
}

function toStub(raw, extra = {}) {
  if (!raw || raw.adult || raw.id == null) return null;
  const title = String(raw.title || raw.original_title || raw.name || "").trim();
  if (!title) return null;
  const poster = posterUrl(raw.poster_path || raw.poster);
  if (!poster) return null;
  const genres = genreNames(raw);
  const year = raw.release_date ? Number(String(raw.release_date).slice(0, 4)) : Number(raw.year) || 0;
  return {
    id: Number(raw.id),
    title,
    original_title: String(raw.original_title || "").trim(),
    poster,
    genres,
    genre: raw.genre || genres[0] || "Film",
    minutes: Number(raw.runtime || raw.minutes) || 0,
    rating: Number(raw.vote_average != null ? raw.vote_average : raw.rating) || 0,
    year: Number.isFinite(year) ? year : 0,
    popularity: Number(raw.popularity) || 0,
    vote_count: Number(raw.vote_count) || 0,
    aliases: uniqueStrings(extra.aliases),
    pinned: Boolean(extra.pinned),
  };
}

const catalog = new Map();

function mergeStub(stub) {
  if (!stub || !stub.id) return;
  const prev = catalog.get(stub.id);
  if (!prev) {
    catalog.set(stub.id, stub);
    return;
  }
  catalog.set(stub.id, {
    ...prev,
    ...stub,
    title: stub.title || prev.title,
    original_title: stub.original_title || prev.original_title,
    poster: stub.poster || prev.poster,
    genres: stub.genres && stub.genres.length ? stub.genres : prev.genres,
    genre: stub.genre && stub.genre !== "Film" ? stub.genre : prev.genre,
    minutes: stub.minutes || prev.minutes,
    rating: stub.rating || prev.rating,
    year: stub.year || prev.year,
    popularity: Math.max(prev.popularity || 0, stub.popularity || 0),
    vote_count: Math.max(prev.vote_count || 0, stub.vote_count || 0),
    aliases: uniqueStrings([...(prev.aliases || []), ...(stub.aliases || [])]),
    pinned: Boolean(prev.pinned || stub.pinned),
  });
}

function addMovies(results, extra = {}) {
  for (const raw of results || []) {
    mergeStub(toStub(raw, extra));
  }
}

async function addPaged(pathname, pages, extraParams = {}, extra = {}) {
  const first = await tmdb(pathname, { page: 1, ...extraParams });
  addMovies(first.results, extra);
  const total = Math.min(pages, Number(first.total_pages) || 1);
  const rest = [];
  for (let page = 2; page <= total; page += 1) rest.push(page);
  await mapPool(rest, LIST_CONCURRENCY, async (page) => {
    const data = await tmdb(pathname, { page, ...extraParams });
    addMovies(data.results, extra);
  });
}

async function addSearch(query, aliases, pages = 3) {
  await addPaged("/search/movie", pages, { query }, { aliases, pinned: true });
}

async function addCollection(id, aliases) {
  const data = await tmdb(`/collection/${id}`, {}, { optional: true });
  if (!data || !Array.isArray(data.parts)) return;
  addMovies(data.parts, { aliases, pinned: true });
}

async function addCollectionSearch(query, aliases) {
  const data = await tmdb("/search/collection", { query, page: 1 }, { optional: true });
  const hits = (data && data.results) || [];
  await mapPool(hits.slice(0, 4), LIST_CONCURRENCY, async (row) => {
    if (row && row.id) await addCollection(row.id, aliases);
  });
}

function seedExisting() {
  if (!fs.existsSync(OUT_FILE)) return;
  try {
    const existing = JSON.parse(fs.readFileSync(OUT_FILE, "utf8"));
    if (!Array.isArray(existing)) return;
    for (const row of existing) {
      mergeStub(toStub({
        id: row.tmdb || String(row.id || "").replace(/^t/i, ""),
        title: row.title,
        original_title: row.original_title,
        poster_path: row.poster,
        poster: row.poster,
        genre: row.genre,
        genres: row.genres,
        runtime: row.minutes,
        minutes: row.minutes,
        vote_average: row.rating,
        rating: row.rating,
        release_date: row.year ? `${row.year}-01-01` : "",
        year: row.year,
        adult: false,
        popularity: 1,
      }, { aliases: row.aliases || [], pinned: true }));
    }
    console.log(`Seeded ${existing.length} titles from existing films.json`);
  } catch (err) {
    console.warn(`Could not seed existing films.json: ${err.message}`);
  }
}

function toOutputFilm(row) {
  const film = {
    id: `t${row.id}`,
    tmdb: row.id,
    title: row.title,
    genre: row.genre || (row.genres && row.genres[0]) || "Film",
    minutes: Number(row.minutes) || 0,
    rating: Math.round((Number(row.rating) || 0) * 10) / 10,
    poster: row.poster,
    color: COLOR,
  };
  if (row.original_title && row.original_title !== row.title) {
    film.original_title = row.original_title;
  }
  if (row.year) film.year = row.year;
  if (row.genres && row.genres.length > 1) film.genres = row.genres.slice(0, 4);
  if (row.aliases && row.aliases.length) film.aliases = row.aliases;
  return film;
}

function selectFinal() {
  const all = Array.from(catalog.values()).filter((row) => row && row.id && row.title && row.poster);
  const pinned = all.filter((row) => row.pinned);
  const rest = all
    .filter((row) => !row.pinned)
    .sort((a, b) => {
      const pop = (b.popularity || 0) - (a.popularity || 0);
      if (pop) return pop;
      return (b.vote_count || 0) - (a.vote_count || 0);
    });
  const picked = [];
  const seen = new Set();
  for (const row of pinned.concat(rest)) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    picked.push(row);
    if (picked.length >= TARGET_MAX) break;
  }
  picked.sort((a, b) => {
    const pin = Number(b.pinned) - Number(a.pinned);
    if (pin) return pin;
    const pop = (b.popularity || 0) - (a.popularity || 0);
    if (pop) return pop;
    return String(a.title).localeCompare(String(b.title), "de");
  });
  return picked;
}

async function fillRuntimes(rows) {
  const need = rows.filter((row) => !row.minutes);
  if (!need.length) return;
  console.log(`Fetching details for ${need.length} titles (runtime/genres)…`);
  let done = 0;
  await mapPool(need, DETAIL_CONCURRENCY, async (row) => {
    try {
      const detail = await tmdb(`/movie/${row.id}`, {}, { optional: true });
      if (!detail) return;
      const stub = toStub(detail, { aliases: row.aliases, pinned: row.pinned });
      if (stub) mergeStub(stub);
    } catch (err) {
      console.warn(`detail ${row.id}: ${err.message}`);
    }
    done += 1;
    if (done % 100 === 0 || done === need.length) {
      console.log(`  details ${done}/${need.length}`);
    }
  });
}

async function main() {
  seedExisting();

  console.log("Fetching popular, top rated, and discover lists…");
  await addPaged("/movie/popular", 20);
  await addPaged("/movie/top_rated", 15);
  await addPaged("/movie/now_playing", 5);
  await addPaged("/movie/upcoming", 5);
  await addPaged("/discover/movie", 20, {
    sort_by: "popularity.desc",
    "vote_count.gte": 80,
    include_video: "false",
  });
  await addPaged("/discover/movie", 10, {
    sort_by: "vote_average.desc",
    "vote_count.gte": 1500,
    include_video: "false",
  });
  await addPaged("/discover/movie", 8, {
    sort_by: "popularity.desc",
    with_original_language: "de",
    include_video: "false",
  });
  await addPaged("/discover/movie", 6, {
    sort_by: "popularity.desc",
    with_original_language: "en",
    "vote_count.gte": 400,
    include_video: "false",
  });

  console.log("Fetching franchise collections…");
  await mapPool(COLLECTIONS, LIST_CONCURRENCY, async (row) => {
    try {
      await addCollection(row.id, row.aliases);
    } catch (err) {
      console.warn(`collection ${row.id}: ${err.message}`);
    }
  });
  await mapPool(COLLECTION_QUERIES, LIST_CONCURRENCY, async (row) => {
    try {
      await addCollectionSearch(row.query, row.aliases);
    } catch (err) {
      console.warn(`collection search ${row.query}: ${err.message}`);
    }
  });

  console.log("Fetching franchise title searches…");
  await mapPool(MOVIE_SEARCHES, LIST_CONCURRENCY, async (row) => {
    try {
      await addSearch(row.query, row.aliases, 4);
    } catch (err) {
      console.warn(`search ${row.query}: ${err.message}`);
    }
  });

  let selected = selectFinal();
  if (selected.length < TARGET_MIN) {
    console.log(`Only ${selected.length} titles so far, fetching more discover pages…`);
    await addPaged("/discover/movie", 30, {
      sort_by: "popularity.desc",
      include_video: "false",
    });
    selected = selectFinal();
  }

  await fillRuntimes(selected);
  selected = selectFinal();

  if (selected.length < TARGET_MIN) {
    console.warn(`Catalog has ${selected.length} titles (target ${TARGET_MIN}–${TARGET_MAX}).`);
  }

  const films = selected.map(toOutputFilm);
  const json = `${JSON.stringify(films, null, 2)}\n`;
  fs.writeFileSync(OUT_FILE, json);
  const kb = Math.round(Buffer.byteLength(json) / 1024);
  const withBond = films.filter((film) => {
    const blob = `${film.title} ${film.original_title || ""} ${(film.aliases || []).join(" ")}`.toLowerCase();
    return blob.includes("bond") || blob.includes("007");
  }).length;
  console.log(`Wrote ${films.length} films to films.json (${kb} KB). Bond/007-tagged: ${withBond}.`);
}

main().catch((err) => {
  console.error(err.stack || err.message || err);
  process.exit(1);
});
