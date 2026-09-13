(() => {
  "use strict";

  const GENRE_CHIPS = [
    "Action", "Komödie", "Drama", "Thriller", "Horror", "Sci-Fi",
    "Fantasy", "Animation", "Krimi", "Abenteuer", "Romanze", "Doku",
  ];

  const RATE_KEYS = [
    { id: "sehr-gut", label: "Sehr gut" },
    { id: "gut", label: "Gut" },
    { id: "ok", label: "Ok" },
    { id: "nicht-gut", label: "Nicht gut" },
  ];

  const TAG_COLORS = [
    "#0066B3", "#2e7d32", "#ef6c00", "#8e24aa", "#00838f",
    "#c62828", "#5d4037", "#37474f",
  ];

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

  const GENRE_NAME_TO_ID = Object.fromEntries(
    Object.entries(TMDB_GENRE_NAMES).map(([id, name]) => [name, Number(id)])
  );

  const FILMS = [
    f(238, "Der Pate", ["Krimi", "Drama"], 175, 8.7),
    f(680, "Pulp Fiction", ["Krimi", "Drama"], 154, 8.5),
    f(13, "Forrest Gump", ["Drama", "Romanze"], 142, 8.5),
    f(603, "Matrix", ["Sci-Fi", "Action"], 136, 8.2),
    f(27205, "Inception", ["Sci-Fi", "Action"], 148, 8.4),
    f(157336, "Interstellar", ["Sci-Fi", "Drama"], 169, 8.4),
    f(496243, "Parasite", ["Thriller", "Drama"], 132, 8.5),
    f(597, "Titanic", ["Drama", "Romanze"], 194, 7.9),
    f(19995, "Avatar", ["Sci-Fi", "Abenteuer"], 162, 7.6),
    f(120, "Der Herr der Ringe: Die Gefährten", ["Fantasy", "Abenteuer"], 178, 8.4),
    f(671, "Harry Potter und der Stein der Weisen", ["Fantasy", "Abenteuer"], 152, 7.6),
    f(862, "Toy Story", ["Animation", "Komödie"], 81, 8.0),
    f(129, "Chihiros Reise ins Zauberland", ["Animation", "Fantasy"], 125, 8.5),
    f(155, "The Dark Knight", ["Action", "Krimi"], 152, 8.5),
    f(550, "Fight Club", ["Drama", "Thriller"], 139, 8.4),
    f(278, "Die Verurteilten", ["Drama"], 142, 8.7),
    f(872585, "Oppenheimer", ["Drama", "Historie"], 180, 8.1),
    f(569094, "Spider-Man: Across the Spider-Verse", ["Animation", "Action"], 140, 8.4),
    f(693134, "Dune: Part Two", ["Sci-Fi", "Abenteuer"], 166, 8.1),
    f(361743, "Top Gun: Maverick", ["Action"], 131, 8.2),
  ];

  let genrePicks = GENRE_CHIPS.slice();

  function f(id, title, genres, runtime, vote_average) {
    return {
      id: `t${id}`,
      tmdb: id,
      title,
      genre: genres[0] || "Film",
      genres,
      minutes: runtime,
      runtime,
      rating: vote_average,
      vote_average,
      poster: "",
      color: "#1d4f91",
    };
  }

  function filmGenres(film) {
    if (Array.isArray(film.genres) && film.genres.length) return film.genres;
    if (film.genre) return [film.genre];
    return [];
  }

  function normalizeFilm(raw) {
    const tmdbNum = Number(raw.tmdb != null ? raw.tmdb : String(raw.id).replace(/^t/i, ""));
    const id = raw.id != null ? String(raw.id) : (Number.isFinite(tmdbNum) ? `t${tmdbNum}` : "");
    const genres = filmGenres(raw);
    const minutes = Number(raw.minutes != null ? raw.minutes : raw.runtime) || 0;
    const rating = Number(raw.rating != null ? raw.rating : raw.vote_average) || 0;
    let poster = raw.poster || "";
    if (!poster && raw.poster_path) {
      const path = String(raw.poster_path).startsWith("/") ? raw.poster_path : `/${raw.poster_path}`;
      poster = `https://image.tmdb.org/t/p/w185${path}`;
    }
    return {
      id,
      tmdb: Number.isFinite(tmdbNum) ? tmdbNum : id,
      title: raw.title,
      genre: raw.genre || genres[0] || "Film",
      genres: genres.slice(),
      minutes,
      runtime: minutes || raw.runtime || 0,
      rating,
      vote_average: rating,
      poster,
      color: raw.color || "#1d4f91",
    };
  }

  function cloneFilms(list) {
    return (list || offlineFilms || FILMS).map((row) => normalizeFilm(row));
  }

  function tmdbBase() {
    return String(window.TMDB_API || "https://api.themoviedb.org/3").replace(/\/$/, "");
  }

  function tmdbKey() {
    return String(window.TMDB_KEY || "").trim();
  }

  function tmdbUrl(path, params) {
    const url = new URL(`${tmdbBase()}${path.startsWith("/") ? path : `/${path}`}`);
    url.searchParams.set("language", "de-DE");
    url.searchParams.set("region", "DE");
    url.searchParams.set("include_adult", "false");
    const key = tmdbKey();
    if (key) url.searchParams.set("api_key", key);
    Object.entries(params || {}).forEach(([name, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(name, String(value));
      }
    });
    return url.toString();
  }

  async function tmdbFetch(path, params) {
    const res = await fetch(tmdbUrl(path, params));
    if (!res.ok) {
      const err = new Error("tmdb");
      err.status = res.status;
      throw err;
    }
    return res.json();
  }

  function tmdbPoster(path) {
    if (!path) return "";
    const normalized = String(path).startsWith("/") ? path : `/${path}`;
    return `https://image.tmdb.org/t/p/w185${normalized}`;
  }

  function fromTmdbMovie(raw) {
    if (!raw || raw.id == null) return null;
    const ids = Array.isArray(raw.genre_ids)
      ? raw.genre_ids
      : (Array.isArray(raw.genres) ? raw.genres.map((g) => g.id) : []);
    const names = [];
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
    return normalizeFilm({
      id: `t${raw.id}`,
      tmdb: raw.id,
      title: raw.title || raw.original_title || "Film",
      genres: names,
      genre: names[0] || "Film",
      runtime: raw.runtime || 0,
      minutes: raw.runtime || 0,
      vote_average: raw.vote_average,
      rating: raw.vote_average,
      poster: tmdbPoster(raw.poster_path),
      poster_path: raw.poster_path,
    });
  }

  let offlineFilms = cloneFilms(FILMS);

  function rebuildGenres() {
    const present = new Set();
    const source = state.catalog && state.catalog.length ? state.catalog : offlineFilms;
    for (const film of source) {
      for (const g of filmGenres(film)) present.add(g);
    }
    const next = [];
    for (const g of GENRE_CHIPS) {
      if (present.has(g)) next.push(g);
    }
    for (const g of present) {
      if (!next.includes(g)) next.push(g);
    }
    genrePicks = next.length ? next : GENRE_CHIPS.slice();
  }

  function renderGenrePicks() {
    if (state.screen === "home" || state.screen === "suggest") render();
  }

  function posterUrl(film) {
    return film && film.poster ? film.poster : "";
  }

  function posterStyle(film) {
    const src = posterUrl(film);
    const color = (film && film.color) || "#1d4f91";
    return src
      ? `background-color:${color};background-image:url("${src}");background-size:cover;background-position:center`
      : `background-color:${color}`;
  }

  function posterTile(film) {
    const src = posterUrl(film);
    const img = src
      ? `<img src="${escapeHtml(src)}" alt="" width="185" height="278" referrerpolicy="no-referrer">`
      : "";
    return `<div class="poster" style="${posterStyle(film)}" role="img" aria-label="">${img}</div>`;
  }

  const AVATARS = {
    av1: svgFace("#12324a", "#f08a2a"),
    av2: svgBot("#1b2833"),
    av3: svgFace("#1a3a2a", "#66bb6a"),
    av4: svgBot("#2a1b33"),
    av5: svgFace("#3a1a24", "#ef6c00"),
    av6: svgBot("#102030"),
    av7: svgFace("#1d4f91", "#90caf9"),
    av8: svgBot("#37474f"),
  };

  function svgFace(bg, skin) {
    return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="120" height="120" fill="${bg}"/>
      <ellipse cx="58" cy="64" rx="34" ry="22" fill="${skin}"/>
      <circle cx="40" cy="58" r="7" fill="#fff"/>
      <circle cx="42" cy="58" r="3.2" fill="#1a2430"/>
      <path d="M34 70c6 5 14 5 18 1" fill="none" stroke="#7a3a12" stroke-width="2" stroke-linecap="round"/>
    </svg>`;
  }

  function svgBot(bg) {
    return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="120" height="120" fill="${bg}"/>
      <rect x="56" y="18" width="8" height="16" rx="2" fill="#8ad0ff"/>
      <circle cx="60" cy="16" r="6" fill="#0066B3"/>
      <rect x="28" y="34" width="64" height="64" rx="10" fill="#d7e3ee" stroke="#0066B3" stroke-width="4"/>
      <rect x="40" y="50" width="16" height="16" fill="#0066B3"/>
      <rect x="64" y="50" width="16" height="16" fill="#0066B3"/>
      <rect x="42" y="76" width="36" height="8" fill="#5b6b7a"/>
    </svg>`;
  }

  const ICONS = {
    back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M15 5 8 12l7 7"/></svg>`,
    switch: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="8" cy="9" r="3"/><circle cx="16" cy="9" r="3"/><path d="M3 19c.6-3 2.6-5 5-5s4.4 2 5 5M11 19c.6-3 2.6-5 5-5s4.4 2 5 5"/></svg>`,
    logout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 7V5a2 2 0 0 1 2-2h7v18h-7a2 2 0 0 1-2-2v-2"/><path d="M15 12H4m0 0 3-3m-3 3 3 3"/></svg>`,
    filter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 5h16l-6.5 8.2V19l-3 1.2v-7L4 5z"/></svg>`,
    covers: `<svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="52" height="52" rx="14" fill="#102030"/>
      <rect x="8" y="12" width="18" height="26" rx="3" fill="#4d7fa8"/>
      <rect x="17" y="10" width="18" height="28" rx="3" fill="#7ebce0"/>
      <rect x="26" y="8" width="18" height="30" rx="3" fill="#0066B3"/>
    </svg>`,
    lists: `<svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="52" height="52" rx="14" fill="#102030"/>
      <rect x="12" y="14" width="28" height="4" rx="2" fill="#7ebce0"/>
      <rect x="12" y="24" width="28" height="4" rx="2" fill="#0066B3"/>
      <rect x="12" y="34" width="18" height="4" rx="2" fill="#c5e4f6"/>
    </svg>`,
    tags: `<svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="52" height="52" rx="14" fill="#102030"/>
      <path d="M14 28 28 14h10v10L24 38z" fill="#0066B3"/>
      <circle cx="35" cy="19" r="2.2" fill="#fff"/>
    </svg>`,
    plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
  };

  function rateIcon(id) {
    if (id === "sehr-gut") {
      return `<svg viewBox="0 0 36 22" aria-hidden="true">
        <g fill="#2e7d32">${thumb(2, 2)}${thumb(12, 2)}</g>
      </svg>`;
    }
    if (id === "gut") {
      return `<svg viewBox="0 0 36 22" aria-hidden="true"><g fill="#81c784">${thumb(8, 2)}</g></svg>`;
    }
    if (id === "ok") {
      return `<svg viewBox="0 0 36 22" aria-hidden="true">
        <g fill="#f4c430" transform="translate(18 11) rotate(-90) translate(-10 -9)">${thumb(2, 2)}</g>
      </svg>`;
    }
    return `<svg viewBox="0 0 36 22" aria-hidden="true">
      <g fill="#e53935" transform="translate(18 11) rotate(180) translate(-10 -9)">${thumb(2, 2)}</g>
    </svg>`;
  }

  function thumb(x, y) {
    return `<path d="M${x + 7} ${y + 8}v-4.2c0-1.4.8-2.4 2-2.4s2 1 2 2.4V8h4.2c1.2 0 2 .9 1.8 2l-.8 5.2c-.2 1.1-1.1 1.8-2.2 1.8H${x + 7}z"/>
      <rect x="${x}" y="${y + 8}" width="6.2" height="9" rx="1.2"/>`;
  }

  const state = {
    screen: "login",
    authMode: "login",
    user: null,
    profile: null,
    catalog: cloneFilms(FILMS),
    filtersOpen: false,
    filters: { dauerOn: false, dauer: 120, genres: [], tags: [] },
    currentPicks: [],
    shortlist: [],
    sessionBlocked: new Set(),
    sessionSkip: new Set(),
    listTab: "watch",
    search: "",
    searchHits: [],
    searchStatus: "",
    discoverPage: 0,
    discoverTotalPages: 1,
    catalogLive: false,
    ratedFilter: "sehr-gut",
    tagFilter: [],
    seenOnlyUnrated: false,
    chosen: null,
    addName: "",
    addAvatar: "av1",
    loginName: "",
    loginPass: "",
    loginError: "",
    newTagName: "",
    newTagColor: "#0066B3",
  };

  const app = document.getElementById("app");
  const headerActions = document.getElementById("header-actions");
  const footer = document.getElementById("site-footer");
  const snackbar = document.getElementById("snackbar");
  const modalEl = document.getElementById("modal");
  const confettiCanvas = document.getElementById("confetti");
  const ctx = confettiCanvas.getContext("2d");
  const desktopNavMq = window.matchMedia("(min-width: 768px)");

  function isDesktopNav() {
    return desktopNavMq.matches;
  }

  function loadJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function saveJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function users() {
    return loadJson("wdq.users", []);
  }

  function saveUsers(list) {
    saveJson("wdq.users", list);
  }

  function profilesOf(userId) {
    return loadJson(`wdq.profiles.${userId}`, []);
  }

  function saveProfiles(userId, list) {
    saveJson(`wdq.profiles.${userId}`, list);
  }

  function pkey(suffix) {
    return `wdq.p.${state.user.id}.${state.profile.id}.${suffix}`;
  }

  function ratings() {
    return loadJson(pkey("ratings"), {});
  }

  function setRating(id, value) {
    const all = ratings();
    all[String(id)] = value;
    saveJson(pkey("ratings"), all);
  }

  function watchlist() {
    return loadJson(pkey("watchlist"), []);
  }

  function saveWatchlist(list) {
    saveJson(pkey("watchlist"), list);
  }

  function history() {
    return loadJson(pkey("history"), []);
  }

  function saveHistory(list) {
    saveJson(pkey("history"), list);
  }

  function customTags() {
    return loadJson(pkey("tags"), []);
  }

  function saveTags(list) {
    saveJson(pkey("tags"), list);
  }

  function filmTags() {
    return loadJson(pkey("filmTags"), {});
  }

  function saveFilmTags(map) {
    saveJson(pkey("filmTags"), map);
  }

  function tagsFor(filmId) {
    return filmTags()[String(filmId)] || [];
  }

  function seedIfNeeded() {
    const list = users();
    if (list.some((u) => u.login.toLowerCase() === "test")) return;
    list.push({ id: "u-test", login: "Test", password: "1234" });
    saveUsers(list);
    const profiles = [
      { id: "tester", name: "Tester", avatar: "av1" },
      { id: "user1", name: "User No 1", avatar: "av2" },
      { id: "bot", name: "Bot - Apptesti", avatar: "av3" },
    ];
    saveProfiles("u-test", profiles);
    const tags = [
      { id: "tag-omma", name: "Omma", color: "#ef6c00" },
      { id: "tag-kumpel", name: "Kumpel", color: "#0066B3" },
      { id: "tag-relax", name: "entspannen", color: "#2e7d32" },
    ];
    const prefix = "wdq.p.u-test.tester.";
    saveJson(`${prefix}tags`, tags);
    saveJson(`${prefix}watchlist`, [
      { id: "t27205", at: Date.now() - 4000 },
      { id: "t862", at: Date.now() - 2000 },
    ]);
    saveJson(`${prefix}filmTags`, { t862: ["tag-omma"] });
    saveJson(`${prefix}history`, [
      { id: "t693134", title: "Dune: Part Two", at: Date.now() - 8000 },
      { id: "t361743", title: "Top Gun: Maverick", at: Date.now() - 6000 },
      { id: "t550", title: "Fight Club", at: Date.now() - 4000 },
      { id: "t680", title: "Pulp Fiction", at: Date.now() - 2000 },
    ]);
    saveJson("wdq.p.u-test.user1.tags", tags);
    saveJson("wdq.p.u-test.bot.tags", tags);
  }

  function restoreSession() {
    const session = loadJson("wdq.session", null);
    if (!session) return;
    const user = users().find((u) => u.id === session.userId);
    if (!user) return;
    state.user = user;
    const profile = profilesOf(user.id).find((p) => p.id === session.profileId) || null;
    state.profile = profile;
    state.screen = profile ? "home" : "profiles";
  }

  function persistSession() {
    if (!state.user) {
      localStorage.removeItem("wdq.session");
      return;
    }
    saveJson("wdq.session", {
      userId: state.user.id,
      profileId: state.profile ? state.profile.id : null,
    });
  }

  function filmId(value) {
    if (value && typeof value === "object") return String(value.id);
    return String(value);
  }

  function knownKey() {
    if (!state.user || !state.profile) return null;
    return pkey("known");
  }

  function loadKnownFilms() {
    const key = knownKey();
    if (!key) return {};
    const raw = loadJson(key, {});
    return raw && typeof raw === "object" ? raw : {};
  }

  function rememberFilm(film) {
    if (!film) return null;
    const n = normalizeFilm(film);
    if (!n.id) return null;
    const idx = state.catalog.findIndex((row) => filmId(row) === filmId(n));
    if (idx >= 0) {
      const prev = state.catalog[idx];
      state.catalog[idx] = normalizeFilm({
        ...prev,
        ...n,
        minutes: n.minutes || prev.minutes,
        runtime: n.runtime || prev.runtime,
        poster: n.poster || prev.poster,
        genres: n.genres && n.genres.length ? n.genres : prev.genres,
      });
    } else {
      state.catalog.push(n);
    }
    const stored = state.catalog.find((row) => filmId(row) === filmId(n)) || n;
    const key = knownKey();
    if (key) {
      const all = loadKnownFilms();
      all[filmId(stored)] = stored;
      saveJson(key, all);
    }
    return stored;
  }

  function mergeKnownIntoCatalog() {
    for (const raw of Object.values(loadKnownFilms())) {
      if (!raw) continue;
      const n = normalizeFilm(raw);
      if (!n.id) continue;
      if (!state.catalog.some((row) => filmId(row) === filmId(n))) state.catalog.push(n);
    }
  }

  function findFilm(id) {
    const sid = String(id);
    const num = Number(String(id).replace(/^t/i, ""));
    const match = (f) => filmId(f) === sid || String(f.tmdb) === sid || Number(f.tmdb) === num;
    const lists = [state.currentPicks, state.shortlist, state.searchHits, state.catalog, offlineFilms];
    for (const list of lists) {
      const hit = (list || []).find(match);
      if (hit) return hit;
    }
    const known = loadKnownFilms();
    const raw = known[sid] || known[`t${num}`] || known[String(num)];
    return raw ? normalizeFilm(raw) : null;
  }

  function fmtDuration(min) {
    const m = Number(min) || 0;
    if (m >= 60) {
      const h = Math.floor(m / 60);
      const r = m % 60;
      return r ? `${h} Std., ${r} Min.` : `${h} Std.`;
    }
    return `${m} Min.`;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function showSnack(text) {
    snackbar.hidden = false;
    document.body.classList.add("snack-on");
    snackbar.innerHTML = `<span aria-hidden="true">✓</span><span>${escapeHtml(text)}</span>`;
    window.clearTimeout(showSnack.tid);
    showSnack.tid = window.setTimeout(() => {
      snackbar.hidden = true;
      document.body.classList.remove("snack-on");
    }, 2600);
  }

  function closeModal() {
    modalEl.hidden = true;
    modalEl.innerHTML = "";
  }

  function openModal(html) {
    modalEl.hidden = false;
    modalEl.innerHTML = html;
  }

  function resetSessionPicks() {
    state.sessionBlocked = new Set();
    state.sessionSkip = new Set();
    state.shortlist = [];
    state.currentPicks = [];
  }

  function shuffle(list) {
    const arr = list.slice();
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function scoreFilm(film) {
    let score = Number(film.vote_average || 6);
    if (state.filters.dauerOn && film.runtime) {
      const over = film.runtime - state.filters.dauer;
      if (over > 0) score -= ((over / 25) ** 1.15) * 0.55;
      else score += Math.min(0.55, (state.filters.dauer - film.runtime) / 90);
    }
    if (state.filters.genres.length) {
      const match = filmGenres(film).some((g) => state.filters.genres.includes(g));
      score += match ? 2.2 : -0.45;
    }
    if (state.filters.tags.length) {
      const have = tagsFor(film.id);
      const match = state.filters.tags.some((t) => have.includes(t));
      score += match ? 2 : -0.2;
    }
    score += Math.random() * 0.85;
    return score;
  }

  function buildPool(excludeIds) {
    const exclude = new Set((excludeIds || []).map(filmId));
    const usable = (film) => !exclude.has(filmId(film));
    let pool = state.catalog.filter((film) => (
      usable(film)
      && !state.sessionBlocked.has(filmId(film))
      && !state.sessionSkip.has(filmId(film))
    ));
    if (pool.length < 3) {
      state.sessionSkip.clear();
      pool = state.catalog.filter((film) => usable(film) && !state.sessionBlocked.has(filmId(film)));
    }
    if (pool.length < 3) pool = shuffle(state.catalog.filter(usable));
    if (pool.length < 3) pool = shuffle(state.catalog.slice());
    return pool;
  }

  function pickFilms(count, excludeIds) {
    const pool = buildPool(excludeIds);
    const ranked = pool
      .map((film) => ({ film, score: scoreFilm(film) }))
      .sort((a, b) => b.score - a.score);
    const out = [];
    const used = new Set();
    for (const row of ranked) {
      const id = filmId(row.film);
      if (used.has(id)) continue;
      used.add(id);
      out.push(row.film);
      if (out.length >= count) break;
    }
    if (out.length < count) {
      for (const film of shuffle(state.catalog)) {
        if (out.some((x) => filmId(x) === filmId(film))) continue;
        out.push(film);
        if (out.length >= count) break;
      }
    }
    if (!out.length && state.catalog.length) {
      return shuffle(state.catalog).slice(0, Math.max(count, 1));
    }
    return out;
  }

  function pickThree(excludeIds) {
    const picks = pickFilms(3, excludeIds);
    if (picks.length >= 3) return picks.slice(0, 3);
    const extras = cloneFilms(FILMS);
    for (const film of extras.concat(cloneFilms(state.catalog))) {
      if (picks.some((x) => filmId(x) === filmId(film))) continue;
      picks.push(film);
      if (picks.length >= 3) break;
    }
    if (!picks.length && extras.length) return extras.slice(0, 3);
    while (picks.length && picks.length < 3) picks.push(picks[0]);
    return picks.slice(0, 3);
  }

  let discoverKey = "";
  let discoverLoading = false;

  function currentDiscoverKey() {
    return JSON.stringify({
      genres: state.filters.genres.slice().sort(),
      dauer: state.filters.dauerOn ? state.filters.dauer : null,
    });
  }

  function discoverParams(page) {
    const params = {
      sort_by: "popularity.desc",
      page: String(page),
      include_video: "false",
    };
    const ids = state.filters.genres
      .map((name) => GENRE_NAME_TO_ID[name])
      .filter((id) => Number.isFinite(id));
    if (ids.length) params.with_genres = ids.join(",");
    if (state.filters.dauerOn) params["with_runtime.lte"] = String(state.filters.dauer);
    return params;
  }

  function addFilmsToCatalog(films) {
    const seen = new Set(state.catalog.map(filmId));
    for (const film of films) {
      const n = normalizeFilm(film);
      if (!n.id) continue;
      if (seen.has(filmId(n))) {
        rememberFilm(n);
        continue;
      }
      seen.add(filmId(n));
      state.catalog.push(n);
    }
  }

  async function fetchDiscoverPage(page) {
    const data = await tmdbFetch("/discover/movie", discoverParams(page));
    const films = (data.results || []).map(fromTmdbMovie).filter((film) => film && film.title);
    addFilmsToCatalog(films);
    state.discoverPage = Number(data.page) || page;
    state.discoverTotalPages = Number(data.total_pages) || page;
    state.catalogLive = true;
    return films.length;
  }

  async function ensureDiscoverPool(minFresh) {
    const key = currentDiscoverKey();
    if (key !== discoverKey) {
      discoverKey = key;
      state.discoverPage = 0;
      state.discoverTotalPages = 1;
    }
    if (discoverLoading) return state.catalogLive;
    discoverLoading = true;
    try {
      let pages = 0;
      const need = minFresh || 80;
      const maxPages = 12;
      while (pages < maxPages) {
        const unused = buildPool([]).length;
        if (state.catalogLive && unused >= need && state.discoverPage > 0) break;
        const next = state.discoverPage + 1;
        if (state.catalogLive && next > Math.min(state.discoverTotalPages || 1, 500)) break;
        try {
          await fetchDiscoverPage(next);
        } catch {
          break;
        }
        pages += 1;
      }
    } finally {
      discoverLoading = false;
    }
    return state.catalogLive;
  }

  async function loadOfflineFallback() {
    try {
      const res = await fetch("./films.json");
      if (!res.ok) throw new Error("catalog");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 20) {
        offlineFilms = data.map((row) => normalizeFilm(row));
      }
    } catch {
      offlineFilms = cloneFilms(FILMS);
    }
  }

  async function loadCatalog() {
    await loadOfflineFallback();
    const live = await ensureDiscoverPool(80);
    if (!live) {
      state.catalog = cloneFilms(offlineFilms);
      state.catalogLive = false;
    }
    mergeKnownIntoCatalog();
    rebuildGenres();
    renderGenrePicks();
  }

  function anyFilterOn() {
    return state.filters.dauerOn
      || state.filters.genres.length > 0
      || state.filters.tags.length > 0;
  }

  function filterSummary() {
    const bits = [];
    if (state.filters.dauerOn) bits.push(`${state.filters.dauer} Min.`);
    bits.push(...state.filters.genres);
    const tags = customTags();
    for (const id of state.filters.tags) {
      const tag = tags.find((t) => t.id === id);
      if (tag) bits.push(tag.name);
    }
    return bits.join(" · ");
  }

  function burstConfetti() {
    const parts = [];
    const colors = ["#0066B3", "#ffffff", "#22c55e", "#f6d56b", "#d7f3e4", "#e53935"];
    const { innerWidth: w, innerHeight: h } = window;
    confettiCanvas.width = w;
    confettiCanvas.height = h;
    for (let i = 0; i < 90; i += 1) {
      parts.push({
        x: w * 0.5 + (Math.random() - 0.5) * 80,
        y: h * 0.28,
        vx: (Math.random() - 0.5) * 11,
        vy: Math.random() * -9 - 3,
        g: 0.18 + Math.random() * 0.12,
        s: 4 + Math.random() * 5,
        c: colors[i % colors.length],
        r: Math.random() * 6,
      });
    }
    const start = performance.now();
    function frame(now) {
      const t = now - start;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.vy += p.g;
        p.x += p.vx;
        p.y += p.vy;
        p.r += 0.12;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        ctx.restore();
      }
      if (t < 1200) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, w, h);
    }
    requestAnimationFrame(frame);
  }

  function updateHeader() {
    const items = [];
    if (["suggest", "lists", "tags", "done", "profile-add"].includes(state.screen)) {
      items.push(`<button type="button" class="icon-btn" data-act="back" aria-label="Zurück" title="Zurück">${ICONS.back}</button>`);
    }
    if (state.screen === "home") {
      items.push(`<button type="button" class="icon-btn" data-act="switch" aria-label="Account wechseln" title="Account wechseln">${ICONS.switch}</button>`);
      items.push(`<button type="button" class="icon-btn" data-act="logout" aria-label="Ausloggen" title="Ausloggen">${ICONS.logout}</button>`);
    }
    headerActions.innerHTML = items.join("");
  }

  let phoneFooterLocked = false;
  let lastScrollY = window.scrollY;

  function setPhoneFooterOpen(open) {
    if (isDesktopNav()) {
      footer.classList.add("is-visible");
      document.body.classList.add("footer-open");
      return;
    }
    footer.classList.toggle("is-visible", open);
    document.body.classList.toggle("footer-open", open);
  }

  function contentOverflows() {
    const header = document.querySelector(".site-header");
    const headerH = header ? header.offsetHeight : 0;
    const contentH = app ? app.scrollHeight : 0;
    return headerH + contentH > window.innerHeight + 8;
  }

  function syncPhoneFooter(opts) {
    const reset = !!(opts && opts.reset);
    if (!state.profile || footer.hidden) {
      phoneFooterLocked = false;
      return;
    }
    if (isDesktopNav()) {
      phoneFooterLocked = false;
      setPhoneFooterOpen(true);
      return;
    }
    phoneFooterLocked = !contentOverflows();
    if (phoneFooterLocked) setPhoneFooterOpen(true);
    else if (reset) setPhoneFooterOpen(false);
  }

  function scheduleFooterSync(opts) {
    window.requestAnimationFrame(() => {
      syncPhoneFooter(opts);
      lastScrollY = window.scrollY;
    });
  }

  function updateFooter() {
    const show = !!(state.user && state.profile);
    footer.hidden = !show;
    document.body.classList.toggle("has-footer", show);
    if (!show) {
      footer.classList.remove("is-visible");
      document.body.classList.remove("footer-open");
      phoneFooterLocked = false;
      return;
    }
    const current = (
      state.screen === "suggest" ? "suggest"
      : state.screen === "lists" ? "lists"
      : state.screen === "tags" ? "tags"
      : ""
    );
    footer.querySelectorAll("[data-nav]").forEach((btn) => {
      btn.setAttribute("aria-current", btn.dataset.nav === current ? "page" : "false");
    });
    if (isDesktopNav()) setPhoneFooterOpen(true);
  }

  function renderLogin() {
    const register = state.authMode === "register";
    return `
      <section class="card auth-card">
        <h2>${register ? "Registrieren" : "Anmelden"}</h2>
        <form data-act="auth-form">
        <label class="field">
          <span>Login</span>
          <input data-act="login-name" name="login" autocomplete="username" value="${escapeHtml(state.loginName)}">
        </label>
        <label class="field">
          <span>Passwort</span>
          <input data-act="login-pass" name="password" type="password" autocomplete="${register ? "new-password" : "current-password"}" value="${escapeHtml(state.loginPass)}">
        </label>
        ${state.loginError ? `<p class="error">${escapeHtml(state.loginError)}</p>` : ""}
        <button type="submit" class="btn btn-primary" data-act="auth-submit" style="margin-top:14px">
          ${register ? "Konto anlegen" : "Anmelden"}
        </button>
        </form>
        <button type="button" class="btn btn-ghost auth-switch" data-act="auth-toggle">
          ${register ? "Schon ein Konto? Anmelden" : "Neu hier? Registrieren"}
        </button>
      </section>
    `;
  }

  function renderProfiles() {
    const rows = profilesOf(state.user.id).map((p) => `
      <div class="card menu-card">
        <button type="button" class="avatar" data-act="pick-profile" data-id="${p.id}" aria-label="${escapeHtml(p.name)}">${AVATARS[p.avatar] || AVATARS.av1}</button>
        <button type="button" data-act="pick-profile" data-id="${p.id}" style="all:unset;cursor:pointer">
          <strong>${escapeHtml(p.name)}</strong>
        </button>
        <button type="button" class="menu-side danger" data-act="ask-delete-profile" data-id="${p.id}" aria-label="Profil löschen" title="Löschen">×</button>
      </div>
    `).join("");
    return `
      <h2 class="screen-title">Wer schaut</h2>
      <section class="stack">
        ${rows}
        <button type="button" class="card menu-card" data-act="add-profile">
          <span class="menu-icon" style="background:#e8edf2;color:#0066B3">${ICONS.plus}</span>
          <strong>Profil hinzufügen</strong>
          <span></span>
        </button>
      </section>
    `;
  }

  function renderProfileAdd() {
    const picks = Object.keys(AVATARS).map((id) => `
      <button type="button" class="avatar-pick" data-act="add-avatar" data-id="${id}" aria-pressed="${state.addAvatar === id}">
        <span class="avatar">${AVATARS[id]}</span>
      </button>
    `).join("");
    return `
      <h2 class="screen-title">Profil hinzufügen</h2>
      <section class="card auth-card">
        <label class="field">
          <span>Name</span>
          <input data-act="add-name" value="${escapeHtml(state.addName)}" maxlength="40">
        </label>
        <p class="hint">Avatar wählen</p>
        <div class="avatar-grid">${picks}</div>
        <button type="button" class="btn btn-primary" data-act="save-profile" style="margin-top:16px">Speichern</button>
      </section>
    `;
  }

  function renderHome() {
    const fill = ((state.filters.dauer - 60) / 150) * 100;
    const tags = customTags();
    const genreChips = genrePicks.map((g) => `
      <button type="button" class="chip" data-act="genre" data-genre="${escapeHtml(g)}" aria-pressed="${state.filters.genres.includes(g)}">${escapeHtml(g)}</button>
    `).join("");
    const tagChips = tags.length
      ? tags.map((t) => `
          <button type="button" class="chip" data-act="filter-tag" data-id="${t.id}" aria-pressed="${state.filters.tags.includes(t.id)}">${escapeHtml(t.name)}</button>
        `).join("")
      : `<span class="hint">Noch keine eigenen Tags</span>`;
    const filters = state.filtersOpen ? `
      <div class="filters">
        <div class="filter-row">
          <span class="filter-label">Dauer</span>
          <div class="filter-values">
            <input class="filigree${state.filters.dauerOn ? "" : " idle"}" data-act="dauer" type="range" min="60" max="210" step="5" value="${state.filters.dauer}" style="--fill:${fill}%">
            <button type="button" class="chip${state.filters.dauerOn ? " on" : ""}" data-act="toggle-dauer">${state.filters.dauer} Min.</button>
          </div>
        </div>
        <div class="filter-row">
          <span class="filter-label">Genre</span>
          <div class="filter-values">${genreChips}</div>
        </div>
        <div class="filter-row">
          <span class="filter-label">Tag</span>
          <div class="filter-values">${tagChips}</div>
        </div>
        <div class="filter-row">
          <span class="filter-label">Streaming</span>
          <div class="filter-values"><span class="chip soon">Platzhalter</span></div>
        </div>
        <div class="filter-row">
          <span class="filter-label">nur kostenlos</span>
          <div class="filter-values"><span class="chip soon">Platzhalter</span></div>
        </div>
      </div>
    ` : "";
    const summary = anyFilterOn()
      ? `<p class="filter-summary">${escapeHtml(filterSummary())}</p>`
      : "";
    return `
      <h2 class="screen-title">Hauptmenü</h2>
      <section class="stack">
        <article class="card menu-card wide-filter">
          <button type="button" class="menu-icon" data-act="suggest" aria-hidden="true">${ICONS.covers}</button>
          <button type="button" data-act="suggest" style="all:unset;cursor:pointer">
            <strong>Filme vorschlagen</strong>
          </button>
          <button type="button" class="menu-side${anyFilterOn() ? " on" : ""}" data-act="toggle-filters" aria-pressed="${state.filtersOpen}" aria-label="Filter" title="Filter">${ICONS.filter}</button>
          ${summary}
          ${filters}
        </article>
        <button type="button" class="card menu-card" data-act="lists">
          <span class="menu-icon">${ICONS.lists}</span>
          <strong>Meine Filmlisten</strong>
          <span></span>
        </button>
        <button type="button" class="card menu-card" data-act="tags">
          <span class="menu-icon">${ICONS.tags}</span>
          <strong>Tags verwalten</strong>
          <span></span>
        </button>
      </section>
    `;
  }

  function renderRates(film, always) {
    const mine = ratings()[filmId(film)];
    return `
      <div class="rates">
        ${RATE_KEYS.map((r) => `
          <button type="button" class="rate${mine === r.id ? " sel" : ""}" data-act="rate" data-id="${escapeHtml(filmId(film))}" data-n="${r.id}" title="${r.label}" aria-label="${r.label}">
            ${rateIcon(r.id)}
          </button>
        `).join("")}
      </div>
    `;
  }

  function renderSuggest() {
    const labels = state.shortlist.map((film) => `
      <button type="button" class="short-label" data-act="unshort" data-id="${escapeHtml(filmId(film))}">
        <span class="x">×</span>${escapeHtml(film.title)}
      </button>
    `).join("");
    const cards = state.currentPicks.map((film) => {
      const tagNames = tagsFor(film.id).map((id) => {
        const tag = customTags().find((t) => t.id === id);
        return tag ? tag.name : "";
      }).filter(Boolean);
      const meta = [fmtDuration(film.runtime || film.minutes), film.genre].concat(tagNames).join(" · ");
      return `
        <article class="card film-card">
          <div class="film-top">
            ${posterTile(film)}
            <div class="film-meta">
              <h3 class="film-title">${escapeHtml(film.title)}</h3>
              <div class="meta">${escapeHtml(meta)}</div>
              ${renderRates(film, true)}
            </div>
          </div>
          <div class="card-actions">
            <button type="button" class="btn btn-compact" data-act="richtung" data-id="${escapeHtml(filmId(film))}">Die Richtung stimmt</button>
            <button type="button" class="btn btn-compact btn-primary" data-act="choose" data-id="${escapeHtml(filmId(film))}">Film wählen</button>
            <button type="button" class="btn btn-compact" data-act="engere" data-id="${escapeHtml(filmId(film))}">Engere Auswahl</button>
            <button type="button" class="btn btn-compact btn-ghost" data-act="watch-add" data-id="${escapeHtml(filmId(film))}">→ Vorgemerkt</button>
          </div>
        </article>
      `;
    }).join("");
    return `
      <div class="suggest-wrap">
        <div class="shortlist">${labels}</div>
        <section class="film-col">${cards}</section>
      </div>
    `;
  }

  function unratedCount() {
    const all = ratings();
    return history().filter((row) => !all[String(row.id)]).length;
  }

  function watchlistFilms() {
    return watchlist()
      .map((row) => findFilm(row.id))
      .filter(Boolean);
  }

  function renderListRow(film, opts) {
    const tagNames = tagsFor(film.id).map((id) => {
      const tag = customTags().find((t) => t.id === id);
      return tag ? tag.name : "";
    }).filter(Boolean);
    if (opts.gesehen) tagNames.unshift("gesehen");
    const extra = opts.extra || "";
    const meta = [fmtDuration(film.runtime || film.minutes), film.genre].concat(tagNames).concat(extra).filter(Boolean).join(" · ");
    const unrated = opts.unrated;
    return `
      <article class="card row-card${unrated ? " unrated" : ""}">
        <div class="row-copy">
          <h3>${escapeHtml(film.title)}</h3>
          <p>${escapeHtml(meta)}</p>
          ${opts.actions || ""}
          ${unrated || opts.rates ? renderRates(film, true) : ""}
        </div>
        ${posterTile(film)}
      </article>
    `;
  }

  function renderLists() {
    const badge = unratedCount();
    const tabs = [
      ["watch", "Vorgemerkt"],
      ["rated", "Bewertete"],
      ["tags", "Tags"],
      ["seen", "Angesehen"],
    ].map(([id, label]) => `
      <button type="button" class="tab" data-act="list-tab" data-id="${id}" aria-selected="${state.listTab === id}">
        ${label}${id === "seen" && badge ? `<span class="badge">${badge}</span>` : ""}
      </button>
    `).join("");
    return `
      <div class="tabs">${tabs}</div>
      ${state.listTab === "watch" ? renderWatchTab() : ""}
      ${state.listTab === "rated" ? renderRatedTab() : ""}
      ${state.listTab === "tags" ? renderTagsTab() : ""}
      ${state.listTab === "seen" ? renderSeenTab() : ""}
    `;
  }

  function renderFilmTagChips(film) {
    const have = tagsFor(film.id);
    return customTags().map((t) => `
      <button type="button" class="chip" data-act="film-tag" data-id="${escapeHtml(filmId(film))}" data-tag="${t.id}" aria-pressed="${have.includes(t.id)}">${escapeHtml(t.name)}</button>
    `).join("");
  }

  function searchStatusText() {
    if (state.searchStatus === "empty") return "Kein Treffer";
    if (state.searchStatus === "offline") return "Katalog nicht erreichbar";
    if (state.searchStatus === "loading") return "Suche…";
    return "";
  }

  function renderSearchChipsHtml() {
    const q = state.search.trim();
    if (!q) return "";
    const listed = watchlist();
    const chips = (state.searchHits || []).filter((film) => (
      !listed.some((row) => String(row.id) === filmId(film))
    ));
    const chipHtml = chips.map((film) => (
      `<button type="button" class="chip" data-act="watch-add" data-id="${escapeHtml(filmId(film))}">${escapeHtml(film.title)}</button>`
    )).join("");
    if (chipHtml) return chipHtml;
    const status = searchStatusText();
    return status ? `<p class="hint search-status">${escapeHtml(status)}</p>` : "";
  }

  function paintSearchUi() {
    if (state.screen !== "lists" || state.listTab !== "watch") return;
    const wrap = app.querySelector(".search-wrap");
    if (wrap) {
      const clear = wrap.querySelector("[data-act=search-clear]");
      if (state.search && !clear) {
        wrap.insertAdjacentHTML("beforeend", `<button type="button" class="search-clear" data-act="search-clear" aria-label="Suche leeren">${ICONS.close}</button>`);
      } else if (!state.search && clear) {
        clear.remove();
      }
    }
    const box = app.querySelector("[data-role=search-chips]");
    if (box) box.innerHTML = renderSearchChipsHtml();
  }

  let searchTimer = 0;
  let searchSeq = 0;

  function scheduleTitleSearch(query) {
    window.clearTimeout(searchTimer);
    const q = String(query || "").trim();
    if (!q) {
      searchSeq += 1;
      state.searchHits = [];
      state.searchStatus = "";
      paintSearchUi();
      return;
    }
    state.searchStatus = "loading";
    paintSearchUi();
    searchTimer = window.setTimeout(() => {
      runTitleSearch(q);
    }, 200);
  }

  async function runTitleSearch(query) {
    const seq = ++searchSeq;
    try {
      const data = await tmdbFetch("/search/movie", { query });
      if (seq !== searchSeq) return;
      const films = (data.results || []).map(fromTmdbMovie).filter((film) => film && film.title);
      state.searchHits = films;
      films.forEach((film) => rememberFilm(film));
      state.searchStatus = films.length ? "ok" : "empty";
    } catch {
      if (seq !== searchSeq) return;
      state.searchHits = [];
      state.searchStatus = "offline";
    }
    paintSearchUi();
  }

  function renderWatchTab() {
    const q = state.search.trim().toLowerCase();
    const listed = watchlistFilms();
    const listedMatch = q
      ? listed.filter((f) => f.title.toLowerCase().includes(q))
      : [];
    const rest = q
      ? listed.filter((f) => !listedMatch.some((x) => filmId(x) === filmId(f)))
      : listed;
    const ordered = listedMatch.concat(rest);
    const rows = ordered.map((film) => {
      const already = q && film.title.toLowerCase().includes(q);
      return renderListRow(film, {
        extra: already ? "schon vorgemerkt" : "",
        actions: `
          <div class="row-actions">
            <button type="button" class="btn btn-compact btn-primary" data-act="choose" data-id="${escapeHtml(filmId(film))}">Anschauen</button>
            <button type="button" class="btn btn-compact" data-act="watch-remove" data-id="${escapeHtml(filmId(film))}">Streichen</button>
            ${renderFilmTagChips(film)}
          </div>
        `,
      });
    }).join("");
    return `
      <div class="search-wrap">
        <input data-act="search" placeholder="Film suchen" value="${escapeHtml(state.search)}" autocomplete="off">
        ${state.search ? `<button type="button" class="search-clear" data-act="search-clear" aria-label="Suche leeren">${ICONS.close}</button>` : ""}
      </div>
      <div class="suggest-chips" data-role="search-chips">${renderSearchChipsHtml()}</div>
      <section class="stack">${rows || `<p class="hint">Noch nichts vorgemerkt.</p>`}</section>
    `;
  }

  function renderRatedTab() {
    const all = ratings();
    const chips = RATE_KEYS.map((r) => `
      <button type="button" class="chip" data-act="rated-filter" data-id="${r.id}" aria-pressed="${state.ratedFilter === r.id}">${r.label}</button>
    `).join("");
    const films = state.catalog.filter((f) => all[filmId(f)] === state.ratedFilter);
    const rows = films.map((film) => renderListRow(film, { rates: true })).join("");
    return `
      <div class="suggest-chips" style="margin-top:12px">${chips}</div>
      <section class="stack">${rows || `<p class="hint">Keine Filme mit dieser Bewertung.</p>`}</section>
    `;
  }

  function renderTagsTab() {
    const tags = customTags();
    const chips = tags.map((t) => `
      <button type="button" class="chip" data-act="tag-filter" data-id="${t.id}" aria-pressed="${state.tagFilter.includes(t.id)}">${escapeHtml(t.name)}</button>
    `).join("");
    const selected = state.tagFilter.slice().sort();
    const map = filmTags();
    const films = selected.length
      ? state.catalog.filter((f) => {
        const have = (map[filmId(f)] || []).slice().sort();
        return have.length === selected.length && have.every((id, i) => id === selected[i]);
      })
      : [];
    const rows = films.map((film) => renderListRow(film, {})).join("");
    return `
      <div class="suggest-chips" style="margin-top:12px">${chips || `<span class="hint">Noch keine eigenen Tags</span>`}</div>
      <section class="stack">${selected.length ? (rows || `<p class="hint">Keine Filme mit genau diesen Tags.</p>`) : `<p class="hint">Tags wählen, um Filme zu sehen.</p>`}</section>
    `;
  }

  function renderSeenTab() {
    const all = ratings();
    let rows = history().slice().sort((a, b) => b.at - a.at);
    if (state.seenOnlyUnrated) rows = rows.filter((row) => !all[String(row.id)]);
    const cards = rows.map((row) => {
      const film = findFilm(row.id) || { id: row.id, title: row.title, genre: "Film", minutes: 0, poster: "", color: "#1d4f91" };
      const unrated = !all[String(row.id)];
      return renderListRow(film, {
        gesehen: true,
        unrated,
        extra: unrated ? "noch keine Note" : RATE_KEYS.find((r) => r.id === all[String(row.id)])?.label,
      });
    }).join("");
    return `
      <div class="suggest-chips" style="margin-top:12px">
        <button type="button" class="chip" data-act="seen-unrated" aria-pressed="${state.seenOnlyUnrated}">nur unbewertet</button>
        <button type="button" class="chip" data-act="seen-all" aria-pressed="${!state.seenOnlyUnrated}">alle</button>
      </div>
      <section class="stack">${cards || `<p class="hint">Noch keine gesehenen Filme.</p>`}</section>
    `;
  }

  function renderTagsManage() {
    const tags = customTags();
    const rows = tags.map((t) => `
      <div class="card menu-card">
        <span class="tag-pill" style="background:${t.color}">${escapeHtml(t.name)}</span>
        <span></span>
        <button type="button" class="menu-side danger" data-act="ask-delete-tag" data-id="${t.id}" aria-label="Tag löschen">×</button>
      </div>
    `).join("");
    const swatches = TAG_COLORS.map((c) => `
      <button type="button" class="swatch" data-act="tag-color" data-color="${c}" aria-pressed="${state.newTagColor === c}" style="background:${c}"></button>
    `).join("");
    return `
      <h2 class="screen-title">Tags verwalten</h2>
      <section class="stack">${rows || `<p class="hint">Noch keine eigenen Tags.</p>`}</section>
      <section class="card auth-card plus-row">
        <label class="field">
          <span>Neuer Tag</span>
          <input data-act="tag-name" value="${escapeHtml(state.newTagName)}" maxlength="24" placeholder="Name">
        </label>
        <div class="color-row" style="margin-top:10px">${swatches}</div>
        <button type="button" class="btn btn-primary" data-act="tag-add" style="margin-top:12px">Plus: Tag anlegen</button>
      </section>
    `;
  }

  function renderDone() {
    return `
      <section class="card done-hero">
        <h2>Heute: ${escapeHtml(state.chosen ? state.chosen.title : "")}</h2>
        <p class="hint">Liegt unter Angesehen. Standard-Tag: gesehen.</p>
      </section>
      <button type="button" class="btn btn-primary" data-act="new-round" style="margin-top:16px">Neue Runde</button>
    `;
  }

  function render() {
    updateHeader();
    updateFooter();
    if (state.screen === "login") app.innerHTML = renderLogin();
    else if (state.screen === "profiles") app.innerHTML = renderProfiles();
    else if (state.screen === "profile-add") app.innerHTML = renderProfileAdd();
    else if (state.screen === "home") app.innerHTML = renderHome();
    else if (state.screen === "suggest") app.innerHTML = renderSuggest();
    else if (state.screen === "lists") app.innerHTML = renderLists();
    else if (state.screen === "tags") app.innerHTML = renderTagsManage();
    else if (state.screen === "done") app.innerHTML = renderDone();
    scheduleFooterSync();
  }

  function goBack() {
    if (state.screen === "profile-add") state.screen = "profiles";
    else if (state.screen === "suggest" || state.screen === "lists" || state.screen === "tags" || state.screen === "done") {
      state.screen = "home";
    }
    render();
  }

  function submitAuth() {
    const nameInput = app.querySelector("[data-act=login-name]");
    const passInput = app.querySelector("[data-act=login-pass]");
    if (nameInput) state.loginName = nameInput.value;
    if (passInput) state.loginPass = passInput.value;
    const login = state.loginName.trim();
    const password = state.loginPass;
    if (!login || !password) {
      state.loginError = "Bitte Login und Passwort eingeben.";
      render();
      return;
    }
    const list = users();
    if (state.authMode === "register") {
      if (list.some((u) => u.login.toLowerCase() === login.toLowerCase())) {
        state.loginError = "Dieser Login ist schon vergeben.";
        render();
        return;
      }
      const user = { id: `u-${Date.now()}`, login, password };
      list.push(user);
      saveUsers(list);
      state.user = user;
      state.profile = null;
      state.screen = "profiles";
      state.loginError = "";
      persistSession();
      render();
      return;
    }
    const user = list.find((u) => u.login.toLowerCase() === login.toLowerCase() && u.password === password);
    if (!user) {
      state.loginError = "Login oder Passwort stimmt nicht.";
      render();
      return;
    }
    state.user = user;
    state.profile = null;
    state.screen = "profiles";
    state.loginError = "";
    persistSession();
    render();
  }

  async function enrichFilm(film) {
    if (!film || !film.tmdb) return film;
    if (film.runtime && film.poster && film.genres && film.genres.length) return film;
    try {
      const data = await tmdbFetch(`/movie/${film.tmdb}`);
      return rememberFilm(fromTmdbMovie(data)) || film;
    } catch {
      return film;
    }
  }

  async function enrichPicks() {
    const next = [];
    for (const film of state.currentPicks) {
      next.push(await enrichFilm(film));
    }
    state.currentPicks = next;
    if (state.screen === "suggest") render();
  }

  async function startSuggestions() {
    await loadCatalog();
    await ensureDiscoverPool(80);
    if (!state.catalog.length) state.catalog = cloneFilms(offlineFilms);
    state.currentPicks = pickThree();
    state.screen = "suggest";
    render();
    scheduleFooterSync({ reset: true });
    enrichPicks();
  }

  function skipCurrent() {
    for (const film of state.currentPicks) state.sessionSkip.add(filmId(film));
  }

  async function replacePick(oldId) {
    await ensureDiscoverPool(20);
    const exclude = state.currentPicks.concat(state.shortlist).map(filmId);
    const next = pickFilms(1, exclude)[0];
    state.currentPicks = state.currentPicks.map((film) => (
      filmId(film) === filmId(oldId) ? (next || film) : film
    ));
    enrichPicks();
  }

  function addWatch(film) {
    if (!film) return false;
    rememberFilm(film);
    const list = watchlist();
    if (list.some((row) => String(row.id) === filmId(film))) return false;
    list.unshift({ id: filmId(film), at: Date.now() });
    saveWatchlist(list);
    return true;
  }

  function chooseFilm(film) {
    if (!film) return;
    rememberFilm(film);
    const hid = filmId(film);
    const rows = history().filter((row) => String(row.id) !== hid);
    rows.unshift({ id: hid, title: film.title, at: Date.now() });
    saveHistory(rows.slice(0, 300));
    saveWatchlist(watchlist().filter((row) => String(row.id) !== hid));
    resetSessionPicks();
    state.chosen = film;
    state.screen = "done";
    render();
    burstConfetti();
  }

  app.addEventListener("click", async (event) => {
    const t = event.target.closest("[data-act]");
    if (!t) return;
    const act = t.dataset.act;

    if (act === "auth-toggle") {
      state.authMode = state.authMode === "login" ? "register" : "login";
      state.loginError = "";
      render();
      return;
    }
    if (act === "auth-submit") {
      submitAuth();
      return;
    }
    if (act === "pick-profile") {
      const profile = profilesOf(state.user.id).find((p) => p.id === t.dataset.id);
      if (!profile) return;
      state.profile = profile;
      resetSessionPicks();
      state.screen = "home";
      persistSession();
      render();
      loadCatalog();
      return;
    }
    if (act === "add-profile") {
      state.addName = "";
      state.addAvatar = "av1";
      state.screen = "profile-add";
      render();
      return;
    }
    if (act === "add-avatar") {
      state.addAvatar = t.dataset.id;
      render();
      return;
    }
    if (act === "save-profile") {
      const name = state.addName.trim();
      if (!name) return;
      const list = profilesOf(state.user.id);
      list.push({ id: `p-${Date.now()}`, name, avatar: state.addAvatar });
      saveProfiles(state.user.id, list);
      state.screen = "profiles";
      render();
      return;
    }
    if (act === "ask-delete-profile") {
      const id = t.dataset.id;
      openModal(`
        <div class="card modal-card">
          <h2>Profil löschen</h2>
          <p class="hint">Bitte das Passwort von ${escapeHtml(state.user.login)} bestätigen.</p>
          <label class="field"><span>Passwort</span><input data-act="del-pass" type="password"></label>
          <div class="modal-actions">
            <button type="button" class="btn" data-act="modal-close">Abbrechen</button>
            <button type="button" class="btn btn-primary" data-act="delete-profile" data-id="${id}">Löschen</button>
          </div>
        </div>
      `);
      return;
    }
    if (act === "modal-close") {
      closeModal();
      return;
    }
    if (act === "toggle-filters") {
      state.filtersOpen = !state.filtersOpen;
      render();
      return;
    }
    if (act === "toggle-dauer") {
      state.filters.dauerOn = !state.filters.dauerOn;
      render();
      return;
    }
    if (act === "genre") {
      const g = t.dataset.genre;
      if (state.filters.genres.includes(g)) {
        state.filters.genres = state.filters.genres.filter((x) => x !== g);
      } else {
        state.filters.genres.push(g);
      }
      render();
      return;
    }
    if (act === "filter-tag") {
      const id = t.dataset.id;
      if (state.filters.tags.includes(id)) {
        state.filters.tags = state.filters.tags.filter((x) => x !== id);
      } else {
        state.filters.tags.push(id);
      }
      render();
      return;
    }
    if (act === "suggest") {
      await startSuggestions();
      return;
    }
    if (act === "lists") {
      state.listTab = "watch";
      state.search = "";
      state.searchHits = [];
      state.searchStatus = "";
      state.screen = "lists";
      render();
      return;
    }
    if (act === "tags") {
      state.screen = "tags";
      render();
      return;
    }
    if (act === "back") {
      goBack();
      return;
    }
    if (act === "switch") {
      state.profile = null;
      state.screen = "profiles";
      persistSession();
      render();
      return;
    }
    if (act === "logout") {
      state.user = null;
      state.profile = null;
      state.screen = "login";
      persistSession();
      render();
      return;
    }
    if (act === "rate") {
      setRating(t.dataset.id, t.dataset.n);
      render();
      return;
    }
    if (act === "richtung") {
      state.sessionBlocked.add(filmId(t.dataset.id));
      await replacePick(t.dataset.id);
      render();
      return;
    }
    if (act === "engere") {
      const film = findFilm(t.dataset.id);
      if (!film) return;
      if (!state.shortlist.some((x) => filmId(x) === filmId(film))) state.shortlist.push(film);
      state.sessionBlocked.add(filmId(film));
      await replacePick(film.id);
      render();
      return;
    }
    if (act === "unshort") {
      state.shortlist = state.shortlist.filter((f) => filmId(f) !== filmId(t.dataset.id));
      state.sessionBlocked.delete(filmId(t.dataset.id));
      render();
      return;
    }
    if (act === "watch-add") {
      const film = findFilm(t.dataset.id);
      if (addWatch(film)) {
        render();
        showSnack(`${film.title} ist hinzugefügt`);
      }
      return;
    }
    if (act === "film-tag") {
      const map = filmTags();
      const id = String(t.dataset.id);
      const tag = t.dataset.tag;
      const have = new Set(map[id] || []);
      if (have.has(tag)) have.delete(tag);
      else have.add(tag);
      map[id] = Array.from(have);
      saveFilmTags(map);
      render();
      return;
    }
    if (act === "watch-remove") {
      saveWatchlist(watchlist().filter((row) => String(row.id) !== filmId(t.dataset.id)));
      render();
      return;
    }
    if (act === "choose") {
      chooseFilm(findFilm(t.dataset.id));
      return;
    }
    if (act === "new-round") {
      resetSessionPicks();
      state.chosen = null;
      state.screen = "home";
      render();
      return;
    }
    if (act === "list-tab") {
      state.listTab = t.dataset.id;
      render();
      return;
    }
    if (act === "search-clear") {
      state.search = "";
      state.searchHits = [];
      state.searchStatus = "";
      window.clearTimeout(searchTimer);
      searchSeq += 1;
      render();
      return;
    }
    if (act === "rated-filter") {
      state.ratedFilter = t.dataset.id;
      render();
      return;
    }
    if (act === "tag-filter") {
      const id = t.dataset.id;
      if (state.tagFilter.includes(id)) state.tagFilter = state.tagFilter.filter((x) => x !== id);
      else state.tagFilter.push(id);
      render();
      return;
    }
    if (act === "seen-unrated") {
      state.seenOnlyUnrated = true;
      render();
      return;
    }
    if (act === "seen-all") {
      state.seenOnlyUnrated = false;
      render();
      return;
    }
    if (act === "tag-color") {
      state.newTagColor = t.dataset.color;
      render();
      return;
    }
    if (act === "tag-add") {
      const name = state.newTagName.trim();
      if (!name) return;
      const list = customTags();
      list.push({ id: `tag-${Date.now()}`, name, color: state.newTagColor });
      saveTags(list);
      state.newTagName = "";
      render();
      return;
    }
    if (act === "ask-delete-tag") {
      const id = t.dataset.id;
      openModal(`
        <div class="card modal-card">
          <h2>Tag löschen</h2>
          <p>Bist du dir wirklich sicher, dass der Tag weg muss?</p>
          <div class="modal-actions">
            <button type="button" class="btn" data-act="modal-close">Abbrechen</button>
            <button type="button" class="btn btn-primary" data-act="delete-tag" data-id="${id}">Löschen</button>
          </div>
        </div>
      `);
      return;
    }
  });

  app.addEventListener("submit", (event) => {
    if (event.target.closest("[data-act=auth-form]")) {
      event.preventDefault();
      submitAuth();
    }
  });

  app.addEventListener("keydown", (event) => {
    const act = event.target.dataset && event.target.dataset.act;
    if (event.key === "Enter" && (act === "login-name" || act === "login-pass")) {
      event.preventDefault();
      submitAuth();
    }
  });

  app.addEventListener("input", (event) => {
    const t = event.target;
    const act = t.dataset.act;
    if (act === "login-name") state.loginName = t.value;
    if (act === "login-pass") state.loginPass = t.value;
    if (act === "add-name") state.addName = t.value;
    if (act === "tag-name") state.newTagName = t.value;
    if (act === "search") {
      state.search = t.value;
      scheduleTitleSearch(t.value);
    }
    if (act === "dauer") {
      state.filters.dauer = Number(t.value);
      state.filters.dauerOn = true;
      t.style.setProperty("--fill", `${((state.filters.dauer - 60) / 150) * 100}%`);
      t.classList.remove("idle");
      const chip = t.parentElement.querySelector("[data-act=toggle-dauer]");
      if (chip) {
        chip.textContent = `${state.filters.dauer} Min.`;
        chip.classList.add("on");
      }
      const sum = app.querySelector(".filter-summary");
      if (sum) sum.textContent = filterSummary();
      else render();
    }
  });

  headerActions.addEventListener("click", (event) => {
    const t = event.target.closest("[data-act]");
    if (!t) return;
    if (t.dataset.act === "back") goBack();
    if (t.dataset.act === "switch") {
      state.profile = null;
      state.screen = "profiles";
      persistSession();
      render();
    }
    if (t.dataset.act === "logout") {
      state.user = null;
      state.profile = null;
      state.screen = "login";
      persistSession();
      render();
    }
  });

  modalEl.addEventListener("click", (event) => {
    if (event.target === modalEl) {
      closeModal();
      return;
    }
    const t = event.target.closest("[data-act]");
    if (!t) return;
    if (t.dataset.act === "modal-close") {
      closeModal();
      return;
    }
    if (t.dataset.act === "delete-profile") {
      const input = modalEl.querySelector("[data-act=del-pass]");
      const value = input ? input.value : "";
      if (value !== state.user.password) {
        const hint = modalEl.querySelector(".hint");
        if (hint) hint.textContent = "Passwort stimmt nicht.";
        return;
      }
      const id = t.dataset.id;
      saveProfiles(state.user.id, profilesOf(state.user.id).filter((p) => p.id !== id));
      if (state.profile && state.profile.id === id) state.profile = null;
      closeModal();
      state.screen = "profiles";
      persistSession();
      render();
      return;
    }
    if (t.dataset.act === "delete-tag") {
      const id = t.dataset.id;
      saveTags(customTags().filter((x) => x.id !== id));
      const map = filmTags();
      for (const key of Object.keys(map)) {
        map[key] = (map[key] || []).filter((x) => x !== id);
      }
      saveFilmTags(map);
      state.filters.tags = state.filters.tags.filter((x) => x !== id);
      state.tagFilter = state.tagFilter.filter((x) => x !== id);
      closeModal();
      render();
    }
  });

  footer.addEventListener("click", async (event) => {
    const btn = event.target.closest("[data-nav]");
    if (!btn || !state.profile) return;
    const nav = btn.dataset.nav;
    if (nav === "suggest") {
      await startSuggestions();
      return;
    }
    if (nav === "lists") {
      state.listTab = "watch";
      state.search = "";
      state.searchHits = [];
      state.searchStatus = "";
      state.screen = "lists";
      render();
      return;
    }
    if (nav === "tags") {
      state.screen = "tags";
      render();
    }
  });

  let lastTouchY = null;

  function onScrollDir(delta) {
    if (!state.profile || footer.hidden || isDesktopNav() || phoneFooterLocked) return;
    if (delta < -6) setPhoneFooterOpen(true);
    else if (delta > 6) setPhoneFooterOpen(false);
  }

  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    onScrollDir(y - lastScrollY);
    lastScrollY = y;
  }, { passive: true });

  window.addEventListener("touchstart", (event) => {
    lastTouchY = event.touches[0] ? event.touches[0].clientY : null;
  }, { passive: true });

  window.addEventListener("touchmove", (event) => {
    if (lastTouchY == null || !event.touches[0]) return;
    if (footer.contains(event.target)) return;
    const y = event.touches[0].clientY;
    onScrollDir(lastTouchY - y);
    lastTouchY = y;
  }, { passive: true });

  desktopNavMq.addEventListener("change", () => {
    scheduleFooterSync({ reset: !isDesktopNav() });
  });

  window.addEventListener("resize", () => scheduleFooterSync());

  seedIfNeeded();
  restoreSession();
  render();
  loadCatalog();

  window.CinexTmdb = {
    url: tmdbUrl,
    movie: fromTmdbMovie,
    key: tmdbKey,
  };
})();
