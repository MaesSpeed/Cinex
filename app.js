(() => {
  "use strict";

  window.TMDB_KEY = window.TMDB_KEY || "";

  const GENRE_DE = {
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
    10770: "TV",
    53: "Thriller",
    10752: "Krieg",
    37: "Western",
  };

  const GENRE_CHIPS = [
    "Action", "Komödie", "Drama", "Thriller", "Horror", "Sci-Fi",
    "Fantasy", "Animation", "Krimi", "Abenteuer", "Romanze", "Doku",
  ];

  const NOTE_COLORS = [
    "#d32f2f", "#e53935", "#ef6c00", "#f9a825", "#c0ca33",
    "#9ccc65", "#66bb6a", "#43a047", "#2e7d32", "#1b5e20",
  ];

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
    f(475557, "Joker", ["Drama", "Krimi"], 122, 8.2),
    f(313369, "La La Land", ["Musik", "Romanze"], 128, 8.0),
    f(244786, "Whiplash", ["Drama", "Musik"], 107, 8.5),
    f(76341, "Mad Max: Fury Road", ["Action", "Abenteuer"], 120, 7.6),
    f(68718, "Django Unchained", ["Western", "Drama"], 165, 8.2),
    f(16869, "Inglourious Basterds", ["Krieg", "Drama"], 153, 8.2),
    f(155, "The Dark Knight", ["Action", "Krimi"], 152, 8.5),
    f(550, "Fight Club", ["Drama", "Thriller"], 139, 8.4),
    f(769, "GoodFellas", ["Krimi", "Drama"], 145, 8.5),
    f(424, "Schindlers Liste", ["Drama", "Historie"], 195, 8.6),
    f(98, "Gladiator", ["Action", "Drama"], 155, 8.2),
    f(278, "Die Verurteilten", ["Drama"], 142, 8.7),
    f(105, "Zurück in die Zukunft", ["Sci-Fi", "Komödie"], 116, 8.3),
    f(329, "Jurassic Park", ["Abenteuer", "Sci-Fi"], 127, 8.0),
    f(274, "Das Schweigen der Lämmer", ["Thriller", "Krimi"], 118, 8.3),
    f(194, "Die fabelhafte Welt der Amélie", ["Komödie", "Romanze"], 122, 7.9),
    f(49047, "Gravity", ["Sci-Fi", "Thriller"], 91, 7.7),
    f(354912, "Coco – Lebendiger als das Leben", ["Animation", "Familie"], 105, 8.2),
    f(419430, "Get Out", ["Horror", "Thriller"], 104, 7.7),
    f(545611, "Everything Everywhere All at Once", ["Sci-Fi", "Komödie"], 139, 7.8),
    f(872585, "Oppenheimer", ["Drama", "Historie"], 180, 8.1),
    f(346698, "Barbie", ["Komödie", "Fantasy"], 114, 7.0),
    f(438631, "Dune", ["Sci-Fi", "Abenteuer"], 155, 7.8),
    f(569094, "Spider-Man: Across the Spider-Verse", ["Animation", "Action"], 140, 8.4),
    f(120467, "Grand Budapest Hotel", ["Komödie", "Drama"], 99, 8.1),
    f(152601, "Her", ["Drama", "Romanze"], 126, 8.0),
    f(329865, "Arrival", ["Sci-Fi", "Drama"], 116, 7.6),
  ];

  let genrePicks = GENRE_CHIPS.slice();

  function f(id, title, genres, runtime, vote_average) {
    return {
      id,
      tmdb: id,
      title,
      genre: genres[0] || "Film",
      genres,
      minutes: runtime,
      runtime,
      rating: vote_average,
      vote_average,
      poster: "",
      poster_path: null,
      color: colorFromTitle(title),
    };
  }

  function filmGenres(film) {
    if (Array.isArray(film.genres) && film.genres.length) return film.genres;
    if (film.genre) return [film.genre];
    return [];
  }

  function normalizeFilm(raw) {
    const tmdbNum = Number(raw.tmdb != null ? raw.tmdb : String(raw.id).replace(/^t/i, ""));
    const id = Number.isFinite(tmdbNum) ? tmdbNum : raw.id;
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
      poster_path: raw.poster_path || null,
      color: raw.color || "#1d4f91",
    };
  }

  function cloneFilms(list) {
    return (list || FILMS).map((row) => normalizeFilm(row));
  }

  function rebuildGenres() {
    const present = new Set();
    for (const film of FILMS) {
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

  function colorFromTitle(title) {
    let h = 0;
    for (let i = 0; i < title.length; i += 1) {
      h = (h * 31 + title.charCodeAt(i)) >>> 0;
    }
    return `hsl(${h % 360} 42% 44%)`;
  }

  function tmdbKey() {
    const fromWindow = String(window.TMDB_KEY || "").trim();
    if (fromWindow) return fromWindow;
    return String(localStorage.getItem("wdq.tmdbKey") || "").trim();
  }

  function posterUrl(film) {
    if (film.poster) return film.poster;
    if (!film.poster_path) return "";
    const path = film.poster_path.startsWith("/") ? film.poster_path : `/${film.poster_path}`;
    return `https://image.tmdb.org/t/p/w185${path}`;
  }

  const AVATARS = {
    a1: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="120" height="120" fill="#12324a"/>
      <ellipse cx="58" cy="64" rx="34" ry="22" fill="#f08a2a"/>
      <path d="M28 64c8-10 16-8 22 0 8-11 16-9 24 1 7-10 14-8 20 0" fill="none" stroke="#f6e6c8" stroke-width="5" stroke-linecap="round"/>
      <path d="M86 58c12-10 22-4 26 10-10 2-20 1-26-4z" fill="#2aa39a"/>
      <path d="M40 42c6-16 22-20 28-8-10 2-18 6-28 8z" fill="#e36b1c"/>
      <circle cx="40" cy="58" r="7" fill="#fff"/>
      <circle cx="42" cy="58" r="3.2" fill="#1a2430"/>
      <path d="M34 70c6 5 14 5 18 1" fill="none" stroke="#7a3a12" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    a2: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="120" height="120" fill="#1b2833"/>
      <rect x="56" y="18" width="8" height="16" rx="2" fill="#8ad0ff"/>
      <circle cx="60" cy="16" r="6" fill="#0066B3"/>
      <rect x="28" y="34" width="64" height="64" rx="10" fill="#d7e3ee" stroke="#0066B3" stroke-width="4"/>
      <rect x="40" y="50" width="16" height="16" fill="#0066B3"/>
      <rect x="64" y="50" width="16" height="16" fill="#0066B3"/>
      <rect x="42" y="76" width="36" height="8" fill="#5b6b7a"/>
      <rect x="46" y="78" width="6" height="4" fill="#c5d5e6"/>
      <rect x="56" y="78" width="6" height="4" fill="#c5d5e6"/>
      <rect x="66" y="78" width="6" height="4" fill="#c5d5e6"/>
    </svg>`,
  };

  const NAMES = { a1: "Account 1", a2: "Account 2" };

  const state = {
    account: null,
    screen: "accounts",
    catalog: FILMS.map((x) => normalizeFilm(x)),
    filters: {
      dauerOn: false,
      dauer: 120,
      genreOn: false,
      genres: [],
    },
    currentPicks: [],
    shortlist: [],
    sessionBlocked: new Set(),
    sessionSkip: new Set(),
    coinSpinning: false,
    coinWinner: null,
    coinLeftovers: [],
    preFlipPicks: null,
    preFlipShortlist: null,
    chosen: null,
    providers: null,
    tmdbKeyDraft: "",
  };

  const app = document.getElementById("app");
  const accountChip = document.getElementById("account-chip");
  const confettiCanvas = document.getElementById("confetti");
  const ctx = confettiCanvas.getContext("2d");

  function store(suffix) {
    return `wdq.${state.account}.${suffix}`;
  }

  function ratings() {
    try {
      return JSON.parse(localStorage.getItem(store("ratings")) || "{}");
    } catch {
      return {};
    }
  }

  function setRating(id, value) {
    const all = ratings();
    all[String(id)] = value;
    localStorage.setItem(store("ratings"), JSON.stringify(all));
  }

  function history() {
    try {
      return JSON.parse(localStorage.getItem(store("history")) || "[]");
    } catch {
      return [];
    }
  }

  function addHistory(film) {
    const rows = history();
    rows.unshift({ id: film.id, title: film.title, at: Date.now() });
    localStorage.setItem(store("history"), JSON.stringify(rows.slice(0, 200)));
  }

  function resetSession() {
    state.sessionBlocked = new Set();
    state.sessionSkip = new Set();
    state.shortlist = [];
    state.currentPicks = [];
    state.coinWinner = null;
    state.coinLeftovers = [];
    state.preFlipPicks = null;
    state.preFlipShortlist = null;
    state.coinSpinning = false;
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
    if (state.filters.genreOn && state.filters.genres.length) {
      const match = filmGenres(film).some((g) => state.filters.genres.includes(g));
      score += match ? 2.2 : -0.45;
    }
    score += Math.random() * 0.85;
    return score;
  }

  function buildPool(excludeIds) {
    const exclude = new Set((excludeIds || []).map(Number));
    const usable = (film) => !exclude.has(Number(film.id));

    let pool = state.catalog.filter((film) => (
      usable(film)
      && !state.sessionBlocked.has(Number(film.id))
      && !state.sessionSkip.has(Number(film.id))
    ));

    if (pool.length < 3) {
      state.sessionSkip.clear();
      pool = state.catalog.filter((film) => (
        usable(film) && !state.sessionBlocked.has(Number(film.id))
      ));
    }

    if (pool.length < 3) {
      pool = shuffle(state.catalog.filter(usable));
    }

    if (pool.length < 3) {
      pool = shuffle(state.catalog.slice());
    }

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
      const id = Number(row.film.id);
      if (used.has(id)) continue;
      used.add(id);
      out.push(row.film);
      if (out.length >= count) break;
    }

    if (out.length < count) {
      for (const film of shuffle(state.catalog)) {
        if (out.some((x) => Number(x.id) === Number(film.id))) continue;
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
      if (picks.some((x) => Number(x.id) === Number(film.id))) continue;
      picks.push(film);
      if (picks.length >= 3) break;
    }
    if (!picks.length && extras.length) return extras.slice(0, 3);
    while (picks.length && picks.length < 3) {
      picks.push(picks[picks.length % picks.length]);
    }
    return picks.slice(0, 3);
  }

  function skipCurrentPicks() {
    for (const film of state.currentPicks) {
      state.sessionSkip.add(Number(film.id));
    }
  }

  function replacePick(oldId) {
    const exclude = state.currentPicks
      .concat(state.shortlist)
      .map((film) => Number(film.id));
    const next = pickFilms(1, exclude)[0];
    state.currentPicks = state.currentPicks.map((film) => (
      Number(film.id) === Number(oldId) ? (next || film) : film
    ));
    hydrateVisible();
  }

  async function loadCatalog() {
    try {
      const res = await fetch("./films.json");
      if (!res.ok) throw new Error("catalog");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 20) {
        FILMS.splice(0, FILMS.length, ...data);
        state.catalog = cloneFilms(FILMS);
        rebuildGenres();
        renderGenrePicks();
        return;
      }
    } catch {
      /* keep static FILMS fallback */
    }
    state.catalog = cloneFilms(FILMS);
  }

  async function hydrateVisible() {
    const key = tmdbKey();
    if (!key) return;
    const need = state.currentPicks.filter((film) => !film.runtime);
    await Promise.all(need.map(async (film) => {
      try {
        const url = `https://api.themoviedb.org/3/movie/${film.id}?api_key=${encodeURIComponent(key)}&language=de-DE`;
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        film.runtime = data.runtime || film.runtime;
        if (data.runtime) film.minutes = data.runtime;
        if (data.poster_path) {
          film.poster_path = data.poster_path;
          film.poster = `https://image.tmdb.org/t/p/w185${data.poster_path}`;
        }
        if (data.title) film.title = data.title;
      } catch {
        /* offline / rate limit */
      }
    }));
    if (state.screen === "suggest") render();
  }

  async function loadProviders(film) {
    const key = tmdbKey();
    if (!key) {
      return {
        note: "Kein TMDB-Schlüssel hinterlegt. Anbieter können nicht geladen werden – es werden keine Dienste wie Netflix erfunden. Lege auf themoviedb.org einen API-Schlüssel an und speichere ihn als localStorage.wdq.tmdbKey.",
        stream: [],
        rent: [],
        buy: [],
      };
    }
    try {
      const url = `https://api.themoviedb.org/3/movie/${film.id}/watch/providers?api_key=${encodeURIComponent(key)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("providers");
      const data = await res.json();
      const de = data.results && data.results.DE;
      if (!de) {
        return { note: "TMDB listet für Deutschland keine Anbieter zu diesem Titel.", stream: [], rent: [], buy: [] };
      }
      const names = (arr) => (arr || []).map((p) => p.provider_name).filter(Boolean);
      return {
        note: "",
        stream: names(de.flatrate),
        rent: names(de.rent),
        buy: names(de.buy),
      };
    } catch {
      return { note: "Anbieter konnten gerade nicht geladen werden.", stream: [], rent: [], buy: [] };
    }
  }

  function burstConfetti() {
    const parts = [];
    const colors = ["#0066B3", "#ffffff", "#22c55e", "#f6d56b", "#d7f3e4", "#e53935"];
    const { innerWidth: w, innerHeight: h } = window;
    confettiCanvas.width = w;
    confettiCanvas.height = h;
    for (let i = 0; i < 110; i += 1) {
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
      if (t < 1300) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, w, h);
    }
    requestAnimationFrame(frame);
  }

  function flashButton(el) {
    if (!el) return;
    el.classList.add("flash");
    setTimeout(() => el.classList.remove("flash"), 280);
  }

  function fmtVote(value) {
    const n = Number(value || 0);
    return n.toFixed(1).replace(".", ",");
  }

  function uniqueById(films) {
    const out = [];
    const seen = new Set();
    for (const film of films) {
      const id = Number(film.id);
      if (seen.has(id)) continue;
      seen.add(id);
      out.push(film);
    }
    return out;
  }

  function updateChip() {
    if (!state.account) {
      accountChip.hidden = true;
      accountChip.innerHTML = "";
      return;
    }
    accountChip.hidden = false;
    accountChip.innerHTML = AVATARS[state.account];
    accountChip.title = `${NAMES[state.account]} – Konto wechseln`;
  }

  function renderAccounts() {
    return `
      <section class="accounts">
        <button type="button" class="card account-card" data-act="account" data-id="a1">
          <span class="avatar">${AVATARS.a1}</span>
          <strong>Account 1</strong>
        </button>
        <button type="button" class="card account-card" data-act="account" data-id="a2">
          <span class="avatar">${AVATARS.a2}</span>
          <strong>Account 2</strong>
        </button>
      </section>
    `;
  }

  function renderHome() {
    const fill = ((state.filters.dauer - 60) / (210 - 60)) * 100;
    const chips = genrePicks.map((g) => `
      <button type="button" class="chip" data-act="genre" data-genre="${g}" aria-pressed="${state.filters.genres.includes(g)}">${g}</button>
    `).join("");
    return `
      <section class="stack">
        <article class="card card-pad">
          <div class="row">
            <h2 class="filter-title">Dauer</h2>
            <button type="button" class="toggle" data-act="toggle-dauer" aria-pressed="${state.filters.dauerOn}" aria-label="Dauerfilter"></button>
          </div>
          <div class="slider-wrap">
            <div class="slider-meta">
              <span>Richtwert, keine harte Grenze</span>
              <strong>${state.filters.dauer} Min</strong>
            </div>
            <input class="filigree" data-act="dauer" type="range" min="60" max="210" step="5" value="${state.filters.dauer}" style="--fill:${fill}%">
            <div class="ticks">${"<i></i>".repeat(13)}</div>
          </div>
        </article>
        <article class="card card-pad">
          <div class="row">
            <h2 class="filter-title">Genre</h2>
            <button type="button" class="toggle" data-act="toggle-genre" aria-pressed="${state.filters.genreOn}" aria-label="Genrefilter"></button>
          </div>
          <p class="hint">Weiche Vorliebe, kein Ausschluss.</p>
          <div class="chips">${chips}</div>
        </article>
        <article class="card card-pad card-disabled">
          <div class="row">
            <h2 class="filter-title">Streaming</h2>
            <span class="soon">demnächst</span>
          </div>
        </article>
        <article class="card card-pad card-disabled">
          <div class="row">
            <h2 class="filter-title">nur kostenlos</h2>
            <span class="soon">demnächst</span>
          </div>
        </article>
        <button type="button" class="btn btn-primary home-cta" data-act="suggest">Filme vorschlagen</button>
        <details class="settings card card-pad">
          <summary>TMDB-Schlüssel (optional)</summary>
          <p class="hint">Poster und Anbieter von themoviedb.org. Wird als localStorage <code>wdq.tmdbKey</code> gespeichert.</p>
          <input type="text" data-act="tmdb-input" placeholder="API-Key (v3)" value="${escapeHtml(tmdbKey() || state.tmdbKeyDraft)}" autocomplete="off" spellcheck="false">
          <button type="button" class="btn btn-ghost" data-act="save-tmdb" style="margin-top:10px;width:100%">Schlüssel speichern</button>
        </details>
      </section>
    `;
  }

  function renderSuggest() {
    const labels = state.shortlist.map((film) => `
      <button type="button" class="short-label" data-act="unshort" data-id="${film.id}">
        <span class="x">×</span>${escapeHtml(film.title)}
      </button>
    `).join("");
    const cards = state.currentPicks.map((film) => renderCard(film)).join("");
    return `
      <div class="suggest-bar">
        <button type="button" class="btn btn-compact" data-act="back">Zurück</button>
        <button type="button" class="btn btn-compact" data-act="reroll">Neu würfeln</button>
        <button type="button" class="btn btn-compact btn-ghost" data-act="coin">Münzwurf</button>
      </div>
      <div class="shortlist">${labels}</div>
      <section class="film-grid">${cards}</section>
    `;
  }

  function renderCard(film) {
    const mine = ratings()[String(film.id)];
    const notes = NOTE_COLORS.map((color, i) => {
      const n = i + 1;
      return `<button type="button" class="note${Number(mine) === n ? " sel" : ""}" data-act="rate" data-id="${film.id}" data-n="${n}" style="background:${color}">${n}</button>`;
    }).join("");
    const src = posterUrl(film);
    const color = film.color || colorFromTitle(film.title);
    const posterStyle = src
      ? `background-color:${color};background-image:url("${src}")`
      : `background-color:${color}`;
    const genre = film.genre || (film.genres && film.genres[0]) || "Film";
    const runtime = film.runtime || film.minutes ? `${film.runtime || film.minutes} Min` : "Dauer folgt";
    return `
      <article class="card film-card" data-card="${film.id}">
        <div class="poster" style="${posterStyle}" role="img" aria-label=""></div>
        <h3 class="film-title">${escapeHtml(film.title)}</h3>
        <div class="meta">
          <span class="genre-pill">${escapeHtml(genre)}</span>
          <span>${runtime}</span>
        </div>
        <div class="public-rating">${fmtVote(film.vote_average)} <span class="muted">(öffentlich)</span></div>
        <p class="note-label">Deine Note</p>
        <div class="notes">${notes}</div>
        <div class="card-actions">
          <button type="button" class="btn" data-act="richtung" data-id="${film.id}">Die Richtung stimmt</button>
          <button type="button" class="btn btn-primary" data-act="choose" data-id="${film.id}">Film wählen</button>
          <button type="button" class="btn btn-ghost" data-act="engere" data-id="${film.id}">Engere Auswahl</button>
        </div>
      </article>
    `;
  }

  function renderCoin() {
    const title = state.coinSpinning
      ? ""
      : `<div class="winner-title">${escapeHtml(state.coinWinner ? state.coinWinner.title : "")}</div>
         <button type="button" class="btn btn-primary" data-act="confirm-coin">bestätigen</button>`;
    const leftovers = state.coinSpinning
      ? ""
      : state.coinLeftovers.map((film) => `
          <div class="card leftover">
            <strong>${escapeHtml(film.title)}</strong>
            <button type="button" class="btn btn-compact btn-primary" data-act="choose" data-id="${film.id}">Film wählen</button>
          </div>
        `).join("");
    return `
      <section class="coin-screen">
        <div class="suggest-bar">
          <button type="button" class="btn btn-compact" data-act="back-coin">Zurück</button>
        </div>
        <button type="button" class="coin${state.coinSpinning ? " spin" : ""}" data-act="confirm-coin" aria-label="Münze bestätigen">WDQ</button>
        ${title}
        <div class="leftovers">${leftovers}</div>
      </section>
    `;
  }

  function renderDone() {
    const p = state.providers || { stream: [], rent: [], buy: [], note: "Anbieter werden geladen …" };
    const block = (label, items) => `
      <article class="card card-pad">
        <h3>${label}</h3>
        ${items.length ? `<ul>${items.map((n) => `<li>${escapeHtml(n)}</li>`).join("")}</ul>` : `<p class="hint">Keine Einträge</p>`}
      </article>
    `;
    return `
      <section class="done-hero card card-pad">
        <h2>Heute: ${escapeHtml(state.chosen ? state.chosen.title : "")}</h2>
        ${p.note ? `<p class="hint">${escapeHtml(p.note)}</p>` : ""}
      </section>
      <section class="providers">
        ${block("Stream", p.stream)}
        ${block("Leihen", p.rent)}
        ${block("Kaufen", p.buy)}
      </section>
      <button type="button" class="btn btn-primary home-cta" data-act="new-round">Neue Runde</button>
    `;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function render() {
    updateChip();
    if (state.screen === "accounts") app.innerHTML = renderAccounts();
    else if (state.screen === "home") app.innerHTML = renderHome();
    else if (state.screen === "suggest") app.innerHTML = renderSuggest();
    else if (state.screen === "coin") app.innerHTML = renderCoin();
    else if (state.screen === "done") app.innerHTML = renderDone();
  }

  function findFilm(id) {
    const nid = Number(id);
    return (
      state.currentPicks.find((f) => Number(f.id) === nid)
      || state.shortlist.find((f) => Number(f.id) === nid)
      || state.coinLeftovers.find((f) => Number(f.id) === nid)
      || (state.coinWinner && Number(state.coinWinner.id) === nid ? state.coinWinner : null)
      || state.catalog.find((f) => Number(f.id) === nid)
    );
  }

  async function chooseFilm(film) {
    if (!film) return;
    addHistory(film);
    state.chosen = film;
    resetSession();
    state.screen = "done";
    state.providers = { stream: [], rent: [], buy: [], note: "Anbieter werden geladen …" };
    render();
    burstConfetti();
    state.providers = await loadProviders(film);
    render();
  }

  function startSuggestions() {
    state.currentPicks = pickThree();
    if (state.currentPicks.length < 1) {
      state.currentPicks = pickThree();
    }
    state.screen = "suggest";
    render();
    hydrateVisible();
  }

  async function onSuggestClick(btn) {
    flashButton(btn);
    burstConfetti();
    await loadCatalog();
    startSuggestions();
  }

  function startCoin() {
    const candidates = uniqueById(state.shortlist.concat(state.currentPicks));
    const pool = candidates.length ? candidates : pickThree();
    state.preFlipPicks = state.currentPicks.slice();
    state.preFlipShortlist = state.shortlist.slice();
    const winner = pool[Math.floor(Math.random() * pool.length)];
    state.coinWinner = winner;
    state.coinLeftovers = pool.filter((f) => Number(f.id) !== Number(winner.id));
    state.coinSpinning = true;
    state.screen = "coin";
    render();
    window.setTimeout(() => {
      state.coinSpinning = false;
      if (state.screen === "coin") render();
    }, 3000);
  }

  app.addEventListener("click", async (event) => {
    const t = event.target.closest("[data-act]");
    if (!t) return;
    const act = t.dataset.act;

    if (act === "account") {
      state.account = t.dataset.id;
      resetSession();
      state.screen = "home";
      render();
      loadCatalog();
      return;
    }
    if (act === "toggle-dauer") {
      state.filters.dauerOn = !state.filters.dauerOn;
      render();
      return;
    }
    if (act === "toggle-genre") {
      state.filters.genreOn = !state.filters.genreOn;
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
      if (!state.filters.genreOn) state.filters.genreOn = true;
      render();
      return;
    }
    if (act === "suggest") {
      await onSuggestClick(t);
      return;
    }
    if (act === "save-tmdb") {
      const input = app.querySelector("[data-act=tmdb-input]");
      const value = input ? input.value.trim() : "";
      if (value) localStorage.setItem("wdq.tmdbKey", value);
      else localStorage.removeItem("wdq.tmdbKey");
      await loadCatalog();
      render();
      return;
    }
    if (act === "back") {
      skipCurrentPicks();
      state.screen = "home";
      render();
      return;
    }
    if (act === "reroll") {
      skipCurrentPicks();
      state.currentPicks = pickThree();
      render();
      hydrateVisible();
      return;
    }
    if (act === "coin") {
      startCoin();
      return;
    }
    if (act === "back-coin") {
      state.currentPicks = state.preFlipPicks || state.currentPicks;
      state.shortlist = state.preFlipShortlist || state.shortlist;
      state.screen = "suggest";
      state.coinSpinning = false;
      render();
      return;
    }
    if (act === "confirm-coin") {
      if (state.coinSpinning) return;
      chooseFilm(state.coinWinner);
      return;
    }
    if (act === "unshort") {
      const id = Number(t.dataset.id);
      state.shortlist = state.shortlist.filter((f) => Number(f.id) !== id);
      state.sessionBlocked.delete(id);
      render();
      return;
    }
    if (act === "rate") {
      setRating(t.dataset.id, Number(t.dataset.n));
      render();
      return;
    }
    if (act === "richtung") {
      const film = findFilm(t.dataset.id);
      if (!film) return;
      state.sessionBlocked.add(Number(film.id));
      replacePick(film.id);
      render();
      return;
    }
    if (act === "engere") {
      const film = findFilm(t.dataset.id);
      if (!film) return;
      const card = t.closest("[data-card]");
      if (!state.shortlist.some((x) => Number(x.id) === Number(film.id))) {
        state.shortlist.push(film);
      }
      state.sessionBlocked.add(Number(film.id));
      if (card) {
        card.classList.add("fly-up");
        window.setTimeout(() => {
          replacePick(film.id);
          render();
        }, 520);
      } else {
        replacePick(film.id);
        render();
      }
      return;
    }
    if (act === "choose") {
      flashButton(t);
      chooseFilm(findFilm(t.dataset.id));
      return;
    }
    if (act === "new-round") {
      resetSession();
      state.chosen = null;
      state.providers = null;
      state.screen = "home";
      render();
    }
  });

  app.addEventListener("input", (event) => {
    const t = event.target;
    if (t.dataset.act === "dauer") {
      state.filters.dauer = Number(t.value);
      t.style.setProperty("--fill", `${((state.filters.dauer - 60) / 150) * 100}%`);
      const label = t.closest(".slider-wrap")?.querySelector("strong");
      if (label) label.textContent = `${state.filters.dauer} Min`;
    }
  });

  accountChip.addEventListener("click", () => {
    state.account = null;
    resetSession();
    state.chosen = null;
    state.providers = null;
    state.screen = "accounts";
    render();
  });

  render();
  loadCatalog();
})();
