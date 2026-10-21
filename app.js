(() => {
  "use strict";

  const GENRE_CHIPS = [
    "Komödie", "Action", "Drama", "Thriller", "Horror", "Sci-Fi",
    "Fantasy", "Animation", "Krimi", "Abenteuer", "Romanze", "Doku",
  ];

  const STREAMING_CHIPS = [
    { id: "netflix", label: "Netflix" },
    { id: "prime", label: "Prime" },
    { id: "disney", label: "Disney+" },
    { id: "apple", label: "Apple TV+" },
    { id: "wow", label: "WOW" },
    { id: "paramount", label: "Paramount+" },
  ];

  const TYPE_CHIPS = [
    { id: "animation", label: "Animation" },
    { id: "doku", label: "Dokumentation" },
    { id: "tv", label: "TV-Film" },
    { id: "real", label: "Realfilm" },
  ];

  const DISCOVER_CATS = [
    { id: "dauer", label: "Dauer" },
    { id: "genre", label: "Genre" },
    { id: "tags", label: "Tags" },
    { id: "streaming", label: "Stream" },
    { id: "typ", label: "Typ" },
    { id: "actor", label: "Schauspieler" },
    { id: "similar", label: "Ähnlich wie" },
  ];

  const INTERSTELLAR_POSTER = "https://image.tmdb.org/t/p/w185/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg";

  const PROVIDER_NAME_MAP = {
    "Amazon Prime Video": "Prime Video",
    "Amazon Video": "Prime Video",
    "Disney Plus": "Disney+",
    "Disney+": "Disney+",
    "Apple TV Plus": "Apple TV+",
    "Apple TV+": "Apple TV+",
    "Apple TV": "Apple TV+",
    "Wow": "WOW",
    "WOW": "WOW",
    "Paramount Plus": "Paramount+",
    "Paramount+ Amazon Channel": "Paramount+",
    "Netflix": "Netflix",
    "Netflix basic with Ads": "Netflix",
  };

  const FALLBACK_PROVIDERS = {
    t120: ["Prime Video", "Disney+", "Netflix"],
    t121: ["Prime Video", "Disney+", "Netflix"],
    t122: ["Prime Video", "Disney+", "Netflix"],
    t155: ["Netflix", "Prime Video", "Apple TV+"],
    t27205: ["Netflix", "Prime Video", "Disney+"],
    t157336: ["Prime Video", "Apple TV+", "Netflix"],
    t603: ["Netflix", "Prime Video"],
    t238: ["Netflix", "Prime Video"],
    t680: ["Netflix", "Prime Video"],
    t13: ["Netflix", "Disney+"],
    t557: ["Disney+", "Prime Video", "Netflix"],
    t569094: ["Disney+", "Netflix"],
    t671: ["Disney+", "Prime Video"],
    t872585: ["Prime Video", "Apple TV+"],
    t693134: ["Prime Video", "Netflix"],
    t361743: ["Netflix", "Paramount+", "Prime Video"],
    t550: ["Netflix", "Prime Video"],
    t278: ["Netflix", "Prime Video"],
    t129: ["Netflix", "Disney+"],
    t862: ["Disney+", "Prime Video"],
    t496243: ["Netflix", "Prime Video"],
    t597: ["Disney+", "Netflix"],
    t19995: ["Disney+", "Prime Video"],
  };

  const HERO_COVERS = [
    { tmdb: 155, src: "https://image.tmdb.org/t/p/w185/qJ2tW6WMUDux911r6m7haRef0WH.jpg" },
    { tmdb: 27205, src: "https://image.tmdb.org/t/p/w185/oYu4f6tE5z9PQ6aRthYx3ce2GwA.jpg" },
    { tmdb: 157336, src: "https://image.tmdb.org/t/p/w185/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg" },
  ];

  const TAG_STARTER_DEFS = [
    { id: "t155", title: "Dark Knight" },
    { id: "t557", title: "Spider-Man" },
    { id: "t13", title: "Forrest" },
    { id: "t361743", title: "Maverick" },
    { id: "t157336", title: "Interstellar" },
  ];

  const LOGIN_POSTERS = [
    { id: "t557", title: "Spider-Man", poster: "https://image.tmdb.org/t/p/w185/2xSL6CAWsynawHFDGdJSGutUj9X.jpg" },
    { id: "t155", title: "The Dark Knight", poster: "https://image.tmdb.org/t/p/w185/z1DfRQf2CgnROyhVZ6ch8FbWt71.jpg" },
    { id: "t120", title: "Der Herr der Ringe - Die Gefährten", poster: "https://image.tmdb.org/t/p/w185/k6lw7hhaMDzJ170bfZfBbnipxcW.jpg" },
    { id: "t27205", title: "Inception", poster: "https://image.tmdb.org/t/p/w185/t5WUY5ZSxwVIVExaMZmmIj88BKA.jpg" },
    { id: "t157336", title: "Interstellar", poster: "https://image.tmdb.org/t/p/w185/hHdhfkkzt0Mwec33Ux177Z7CO8w.jpg" },
    { id: "t238", title: "Der Pate", poster: "https://image.tmdb.org/t/p/w185/uumEbSnYqeV1oennyVx8DPVjujF.jpg" },
    { id: "t680", title: "Pulp Fiction", poster: "https://image.tmdb.org/t/p/w185/hOg9USqmQmglmr5kGvpyg1XkhqN.jpg" },
    { id: "t13", title: "Forrest Gump", poster: "https://image.tmdb.org/t/p/w185/zUWRCzac72YuO9k5kEWSe0aGbs7.jpg" },
    { id: "t603", title: "Matrix", poster: "https://image.tmdb.org/t/p/w185/iVmDLujHcV1zaMnaahKWn4TcCS6.jpg" },
    { id: "t597", title: "Titanic", poster: "https://image.tmdb.org/t/p/w185/MlnPG3oxhfmuiDwcoeElQWui9m.jpg" },
    { id: "t19995", title: "Avatar", poster: "https://image.tmdb.org/t/p/w185/8VV4YUwOGxgolFZTo2SgNwsfznR.jpg" },
    { id: "t671", title: "Harry Potter und der Stein der Weisen", poster: "https://image.tmdb.org/t/p/w185/nKspzM3rVJASkT4CvZvuj9KDT7l.jpg" },
    { id: "t862", title: "Toy Story", poster: "https://image.tmdb.org/t/p/w185/om4fMx3e4xkx27sAsacoFP4WiEd.jpg" },
    { id: "t550", title: "Fight Club", poster: "https://image.tmdb.org/t/p/w185/5sLBZtBzmL9Xd5MdGyqymgM9kPY.jpg" },
    { id: "t278", title: "Die Verurteilten", poster: "https://image.tmdb.org/t/p/w185/78Pb6FMLMfpm1jUOKTniwREYgAN.jpg" },
    { id: "t872585", title: "Oppenheimer", poster: "https://image.tmdb.org/t/p/w185/9AiHV08v8RyyuHcO5wuTaTXBxfe.jpg" },
    { id: "t569094", title: "Spider-Man: Across the Spider-Verse", poster: "https://image.tmdb.org/t/p/w185/6jYQM7zldTF0q6Ky1XbIJCNsS2L.jpg" },
    { id: "t693134", title: "Dune: Part Two", poster: "https://image.tmdb.org/t/p/w185/zYLP7Uiqz6XqoiQLAu4XQ6DRUMz.jpg" },
    { id: "t122", title: "Der Herr der Ringe - Die Rückkehr des Königs", poster: "https://image.tmdb.org/t/p/w185/uFjlP9U9UOZAzGB25HUtmlEpXbc.jpg" },
    { id: "t1726", title: "Iron Man", poster: "https://image.tmdb.org/t/p/w185/ueGAjn2cR1nc1f2i8VjIhpiP73E.jpg" },
    { id: "t76341", title: "Mad Max: Fury Road", poster: "https://image.tmdb.org/t/p/w185/6zI7lI5Usf5z6wXH9KPWvGWvKS7.jpg" },
    { id: "t533535", title: "Deadpool & Wolverine", poster: "https://image.tmdb.org/t/p/w185/chDpMyvXNDFMhg3yUknITnGUCUk.jpg" },
    { id: "t496243", title: "Parasite", poster: "https://image.tmdb.org/t/p/w185/hoqe3leVhHBgboB6G1bv1kB8K4p.jpg" },
    { id: "t361743", title: "Top Gun: Maverick", poster: "https://image.tmdb.org/t/p/w185/cvLe7YpLTsgT25FpuTD1bwgEcWZ.jpg" },
    { id: "t129", title: "Chihiros Reise ins Zauberland", poster: "https://image.tmdb.org/t/p/w185/wWNLsGvKqhi6cNWul0uvhqbQ4kl.jpg" },
    { id: "t24428", title: "The Avengers", poster: "https://image.tmdb.org/t/p/w185/nwdcPGzBtex0XSOhG8vryGXKByZ.jpg" },
    { id: "t299534", title: "Avengers: Endgame", poster: "https://image.tmdb.org/t/p/w185/ibO8Pj0aA1nwj3Q9FMpMcYZkdCA.jpg" },
    { id: "t447365", title: "Guardians of the Galaxy Vol. 3", poster: "https://image.tmdb.org/t/p/w185/jrz8nDZH6u3Xfpl74q2xeaS33RL.jpg" },
    { id: "t218", title: "Terminator", poster: "https://image.tmdb.org/t/p/w185/kdYu7YJJP0uuGEuhUX5toqvBSog.jpg" },
    { id: "t49026", title: "The Dark Knight Rises", poster: "https://image.tmdb.org/t/p/w185/9NyCuhyvFKTqGRLcr4r8fWXnu9v.jpg" },
  ];

  const RATE_KEYS = [
    { id: "sehr-gut", label: "Sehr gut" },
    { id: "gut", label: "Gut" },
    { id: "ok", label: "Ok" },
    { id: "nicht-gut", label: "Nicht gut" },
  ];

  const EMOJI_AVATARS = [
    { id: "cowboy", emoji: "🤠" },
    { id: "monster", emoji: "👾" },
    { id: "pumpkin", emoji: "🎃" },
    { id: "robot", emoji: "🤖" },
    { id: "fox", emoji: "🦊" },
    { id: "penguin", emoji: "🐧" },
    { id: "frog", emoji: "🐸" },
    { id: "dino", emoji: "🦕" },
    { id: "ghost", emoji: "👻" },
    { id: "alien", emoji: "👽" },
    { id: "ninja", emoji: "🥷" },
    { id: "sloth", emoji: "🦥" },
    { id: "octopus", emoji: "🐙" },
    { id: "dragon", emoji: "🐲" },
    { id: "moai", emoji: "🗿" },
  ];

  const LEGACY_AVATAR_TO_EMOJI = {
    av1: "cowboy",
    av2: "monster",
    av3: "frog",
    av4: "robot",
    av5: "fox",
    av6: "ghost",
    av7: "alien",
    av8: "moai",
  };

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
    f(238, "Der Pate", ["Krimi", "Drama"], 175, 8.7, ["Marlon Brando", "Al Pacino", "James Caan"], "The Godfather", "Der alternde Don Corleone übergibt sein New Yorker Mafia-Imperium an den Sohn, der eigentlich rausbleiben wollte."),
    f(680, "Pulp Fiction", ["Krimi", "Drama"], 154, 8.5, ["John Travolta", "Samuel L. Jackson", "Uma Thurman"], "", "Verwobene Gangster-Episoden in Los Angeles: Koffer, Boxkampf, Diners und ein Paar auf Raubzug."),
    f(13, "Forrest Gump", ["Drama", "Romanze"], 142, 8.5, ["Tom Hanks", "Robin Wright", "Gary Sinise"], "", "Forrest stolpert durch Jahrzehnte US-Geschichte – mit Laufschuhen, Pralinen und einer großen Liebe."),
    f(603, "Matrix", ["Sci-Fi", "Action"], 136, 8.2, ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"], "The Matrix", "Ein Hacker erkennt, dass die Welt Simulation ist, und schließt sich dem Widerstand gegen die Maschinen an."),
    f(27205, "Inception", ["Sci-Fi", "Action"], 148, 8.4, ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"], "", "Diebe steigen in Träume ein, um Ideen zu pflanzen – je tiefer die Ebene, desto brüchiger die Realität."),
    f(157336, "Interstellar", ["Sci-Fi", "Drama"], 169, 8.4, ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"], "", "Mit der Erde am Ende fliegt eine Crew durch ein Wurmloch, um der Menschheit eine neue Heimat zu finden."),
    f(496243, "Parasite", ["Thriller", "Drama"], 132, 8.5, ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"], "", "Eine arme Familie schleust sich in den Haushalt der Reichen ein – der Klassengraben kippt ins Absurde."),
    f(597, "Titanic", ["Drama", "Romanze"], 194, 7.9, ["Leonardo DiCaprio", "Kate Winslet", "Billy Zane"], "", "An Bord der Titanic verlieben sich Jack und Rose, während das Schiff auf den Eisberg zusteuert."),
    f(19995, "Avatar", ["Sci-Fi", "Abenteuer"], 162, 7.6, ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"], "", "Ein gelähmter Marine wird als Avatar nach Pandora geschickt und stellt sich auf die Seite der Na’vi."),
    f(120, "Der Herr der Ringe: Die Gefährten", ["Fantasy", "Abenteuer"], 178, 8.4, ["Elijah Wood", "Ian McKellen", "Viggo Mortensen"], "The Lord of the Rings: The Fellowship of the Ring", "Frodo soll den Einen Ring vernichten. Eine Gefährtengruppe geleitet ihn aus dem Auenland nach Mordor."),
    f(155, "The Dark Knight", ["Action", "Krimi"], 152, 8.5, ["Christian Bale", "Heath Ledger", "Aaron Eckhart"], "", "Batman, Gordon und Harvey Dent jagen den Joker, der Gotham in Chaos und moralische Fallen stürzt."),
    f(671, "Harry Potter und der Stein der Weisen", ["Fantasy", "Abenteuer"], 152, 7.6, ["Daniel Radcliffe", "Rupert Grint", "Emma Watson"], "Harry Potter and the Philosopher's Stone", "Harry erfährt, dass er ein Zauberer ist, und erlebt sein erstes Jahr in Hogwarts – samt Stein der Weisen."),
    f(862, "Toy Story", ["Animation", "Komödie"], 81, 8.0, ["Tom Hanks", "Tim Allen", "Don Rickles"], "", "Spielzeug wird lebendig, sobald niemand hinsieht. Sheriff Woody fürchtet den neuen Liebling Buzz Lightyear."),
    f(129, "Chihiros Reise ins Zauberland", ["Animation", "Fantasy"], 125, 8.5, ["Rumi Hiiragi", "Miyu Irino", "Mari Natsuki"], "Spirited Away", "Chihiro gerät in eine Geisterwelt und muss in einem Badehaus arbeiten, um ihre in Schweine verwandelten Eltern zu retten."),
    f(550, "Fight Club", ["Drama", "Thriller"], 139, 8.4, ["Brad Pitt", "Edward Norton", "Helena Bonham Carter"], "", "Ein schlafloser Angestellter gründet mit dem chaotischen Tyler Durden einen Untergrund-Kampfclub."),
    f(278, "Die Verurteilten", ["Drama"], 142, 8.7, ["Tim Robbins", "Morgan Freeman", "Bob Gunton"], "The Shawshank Redemption", "Unschuldig in Shawshank, hält Andy an Hoffnung und einer langen, stillen Flucht fest."),
    f(872585, "Oppenheimer", ["Drama", "Historie"], 180, 8.1, ["Cillian Murphy", "Emily Blunt", "Robert Downey Jr."], "", "Robert Oppenheimer leitet das Manhattan-Projekt – und trägt danach die Last der Atombombe."),
    f(569094, "Spider-Man: Across the Spider-Verse", ["Animation", "Action"], 140, 8.4, ["Shameik Moore", "Hailee Steinfeld", "Brian Tyree Henry"], "", "Miles Morales trifft Spider-People aus anderen Universen und muss gegen ein festgeschriebenes Schicksal ankämpfen."),
    f(693134, "Dune: Part Two", ["Sci-Fi", "Abenteuer"], 166, 8.1, ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"], "", "Paul Atreides geht unter den Fremen auf Arrakis seinen Weg – zwischen Rache, Prophezeiung und Wüstenkrieg."),
    f(361743, "Top Gun: Maverick", ["Action"], 131, 8.2, ["Tom Cruise", "Miles Teller", "Jennifer Connelly"], "", "Pete „Maverick“ Mitchell trainiert Top-Gun-Piloten für eine fast unmögliche Mission – darunter der Sohn seines alten Freundes."),
  ];

  const WATCH_CATS = [
    { id: "blockbuster", label: "Blockbuster" },
    { id: "neu", label: "Neu" },
    { id: "top", label: "Top bewertet" },
    { id: "action", label: "Action" },
    { id: "klassiker", label: "Klassiker" },
  ];
  const WATCH_PAGE_SIZE = 20;
  const SEARCH_SHORT_MAX = 39;

  const BLOCKBUSTER_IDS = [
    27205, 157336, 299534, 604, 120, 155, 24428, 19995, 597, 361743,
    569094, 1726, 693134, 603, 872585, 447365, 76341, 49026, 671, 13,
  ];

  const KLASSIKER_IDS = [
    238, 680, 13, 603, 120, 278, 550, 129, 862, 155, 122, 11, 1891, 78, 769,
  ];

  let genrePicks = GENRE_CHIPS.slice();

  function filmCastNames(raw) {
    if (!raw) return [];
    if (Array.isArray(raw.cast)) {
      return raw.cast.map((row) => {
        if (typeof row === "string") return row.trim();
        return String((row && (row.name || row.original_name)) || "").trim();
      }).filter(Boolean);
    }
    if (typeof raw.cast === "string") {
      return raw.cast.split(",").map((name) => name.trim()).filter(Boolean);
    }
    return [];
  }

  function f(id, title, genres, runtime, vote_average, cast, originalTitle, overview) {
    return {
      id: `t${id}`,
      tmdb: id,
      title,
      original_title: originalTitle || "",
      genre: genres[0] || "Film",
      genres,
      minutes: runtime,
      runtime,
      rating: vote_average,
      vote_average,
      poster: "",
      color: "#1d4f91",
      cast: Array.isArray(cast) ? cast.slice() : [],
      overview: overview || "",
    };
  }

  function filmGenres(film) {
    if (Array.isArray(film.genres) && film.genres.length) return film.genres;
    if (film.genre) return [film.genre];
    return [];
  }

  function filmAliases(raw) {
    if (!raw) return [];
    if (Array.isArray(raw.aliases)) {
      return raw.aliases.map((row) => String(row || "").trim()).filter(Boolean);
    }
    if (typeof raw.aliases === "string" && raw.aliases.trim()) return [raw.aliases.trim()];
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
    const providers = Array.isArray(raw.providers)
      ? raw.providers.slice()
      : (Array.isArray(raw.streaming) ? raw.streaming.slice() : []);
    return {
      id,
      tmdb: Number.isFinite(tmdbNum) ? tmdbNum : id,
      title: raw.title,
      original_title: raw.original_title || raw.originalTitle || "",
      genre: raw.genre || genres[0] || "Film",
      genres: genres.slice(),
      minutes,
      runtime: minutes || raw.runtime || 0,
      rating,
      vote_average: rating,
      poster,
      color: raw.color || "#1d4f91",
      cast: filmCastNames(raw).slice(0, 4),
      year: Number(raw.year) || (raw.release_date ? Number(String(raw.release_date).slice(0, 4)) : 0) || 0,
      aliases: filmAliases(raw),
      popularity: Number(raw.popularity) || 0,
      vote_count: Number(raw.vote_count) || 0,
      providers,
      overview: String(raw.overview || raw.plot || raw.tagline || "").trim(),
      ...(Number(raw.castOrderFixed) >= 1 ? { castOrderFixed: 1 } : {}),
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

  function searchProxyBase() {
    const raw = String(window.SEARCH_PROXY || "").trim();
    if (!raw) return "";
    try {
      const url = new URL(raw);
      url.searchParams.delete("api_key");
      url.hash = "";
      return url.toString().replace(/\/$/, "");
    } catch {
      return raw.replace(/\/$/, "").replace(/([?&])api_key=[^&]*/gi, "$1").replace(/[?&]$/, "");
    }
  }

  function remoteSearchAvailable() {
    return !!searchProxyBase();
  }

  async function proxyFetch(path, params) {
    const base = searchProxyBase();
    if (!base) {
      const err = new Error("proxy-unset");
      throw err;
    }
    const url = new URL(`${base}${path.startsWith("/") ? path : `/${path}`}`);
    url.searchParams.set("language", "de-DE");
    url.searchParams.set("region", "DE");
    url.searchParams.set("include_adult", "false");
    Object.entries(params || {}).forEach(([name, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(name, String(value));
      }
    });
    url.searchParams.delete("api_key");
    const res = await fetch(url.toString());
    if (!res.ok) {
      const err = new Error("proxy");
      err.status = res.status;
      throw err;
    }
    return res.json();
  }

  const SEARCH_ENRICH_FIRST = 8;
  const SEARCH_ENRICH_CONCURRENCY = 3;
  const liveDetailTried = new Set();
  const detailInflight = new Map();
  const searchEnrichGaveUp = new Set();
  const searchEnrichQueued = new Set();
  let searchEnrichQueue = [];
  let searchEnrichActive = 0;
  let searchEnrichToken = 0;
  let searchEnrichTimer = 0;
  let searchRowObserver = null;
  let searchEnrichScrollTarget = null;
  let searchEnrichScrollHandler = null;
  let searchEnrichScrollFrame = 0;

  function searchRowNeedsEnrich(film) {
    if (!film || !remoteSearchAvailable()) return false;
    const tmdb = Number(film.tmdb);
    if (!Number.isFinite(tmdb) || tmdb <= 0) return false;
    const id = filmId(film);
    if (!id || liveDetailTried.has(id)) return false;
    const hasRuntime = Number(film.minutes || film.runtime) > 0;
    const hasCast = filmCastNames(film).length > 0;
    return !hasRuntime || !hasCast;
  }

  function applyLiveFilm(next) {
    const stored = rememberFilm(next);
    if (!stored) return null;
    const id = filmId(stored);
    if (Array.isArray(state.searchHits)) {
      state.searchHits = state.searchHits.map((row) => (filmId(row) === id ? stored : row));
    }
    if (Array.isArray(state.currentPicks)) {
      state.currentPicks = state.currentPicks.map((row) => (filmId(row) === id ? stored : row));
    }
    if (state.chosen && filmId(state.chosen) === id) state.chosen = stored;
    return stored;
  }

  function creditsCastNames(data) {
    return ((data && data.credits && data.credits.cast) || [])
      .slice()
      .sort(sortCastByOrder)
      .map((row) => String((row && (row.name || row.original_name)) || "").trim())
      .filter(Boolean)
      .slice(0, 4);
  }

  function filmFromMovieDetail(data) {
    const next = fromTmdbMovie(data);
    if (!next) return null;
    const names = creditsCastNames(data);
    if (names.length) {
      next.cast = names;
      next.castOrderFixed = 1;
    }
    return next;
  }

  function patchFilmRowMeta(film) {
    const id = filmId(film);
    if (!id) return;
    const runtime = durationPill(film);
    const line = filmCastLine(film);
    document.querySelectorAll(".film-row[data-id]").forEach((row) => {
      if (row.dataset.id !== id || row.hasAttribute("data-seen")) return;
      const titleline = row.querySelector(".film-row-titleline");
      if (titleline && runtime) {
        let pill = titleline.querySelector(".duration-pill");
        if (!pill) {
          pill = document.createElement("span");
          pill.className = "duration-pill";
          titleline.appendChild(pill);
        }
        pill.textContent = runtime;
      }
      if (!line) return;
      let castEl = row.querySelector(".film-row-cast");
      if (!castEl) {
        const body = row.querySelector(".film-row-body");
        if (!body) return;
        castEl = document.createElement("p");
        castEl.className = "film-row-cast";
        body.appendChild(castEl);
      }
      castEl.textContent = line;
    });
  }

  function requestLiveDetails(film) {
    if (!searchRowNeedsEnrich(film)) return null;
    const id = filmId(film);
    if (detailInflight.has(id)) return detailInflight.get(id);
    const tmdb = Number(film.tmdb);
    const promise = proxyFetch(`/movie/${tmdb}`, { append_to_response: "credits" }).then((data) => {
      const next = filmFromMovieDetail(data);
      if (!next) return null;
      liveDetailTried.add(id);
      searchEnrichGaveUp.delete(id);
      const stored = applyLiveFilm(next);
      if (stored) patchFilmRowMeta(stored);
      return stored;
    }).catch(() => null).finally(() => {
      detailInflight.delete(id);
    });
    detailInflight.set(id, promise);
    return promise;
  }

  function scheduleLiveDetails(film) {
    const pending = requestLiveDetails(film);
    if (!pending) return;
    pending.then((stored) => {
      if (!stored) return;
      if (state.watchSheet) paintWatchSheetList();
      if (state.screen === "lists") {
        if (state.listTab === "seen" && state.justWatchedId && filmId(stored) === state.justWatchedId) render();
        else refreshWatchList();
      } else if (state.screen === "done") render();
    });
  }

  const LIST_HYDRATE_CONCURRENCY = 4;
  const LIST_HYDRATE_BATCH_MS = 80;
  const LIST_HYDRATE_MAX_FAILURES = 3;
  const listHydrateQueued = new Set();
  const listHydrateInflight = new Map();
  const listHydrateFailCount = new Map();
  const listHydrateRetryAfter = new Map();
  let listHydrateQueue = [];
  let listHydrateActive = 0;
  let listHydrateKickTimer = 0;
  let listHydratePersistTimer = 0;
  let listHydrateRenderFrame = 0;
  let listHydratePersistBatch = [];

  function tmdbFromListId(id) {
    const n = Number(String(id).replace(/^t/i, ""));
    return Number.isFinite(n) && n > 0 ? n : 0;
  }

  function canonicalListFilmId(id) {
    const sid = String(id);
    const tmdb = tmdbFromListId(sid);
    if (tmdb) return `t${tmdb}`;
    return sid;
  }

  function isListFilmPlaceholder(film) {
    if (!film) return true;
    const title = String(film.title || "").trim();
    if (!title || title === "Lädt…") return true;
    const tmdb = Number(film.tmdb);
    return !Number.isFinite(tmdb) || tmdb <= 0;
  }

  function filmListResolved(id) {
    const sid = canonicalListFilmId(id);
    const film = findFilm(sid) || findFilm(id);
    if (!film || isListFilmPlaceholder(film)) return null;
    return film;
  }

  function pendingListFilm(id) {
    const sid = canonicalListFilmId(id);
    const tmdb = tmdbFromListId(sid);
    return normalizeFilm({
      id: sid,
      tmdb: tmdb || sid,
      title: "Lädt…",
      genre: "Film",
      minutes: 0,
      poster: "",
      color: "#1d4f91",
    });
  }

  function scheduleListHydrateRender() {
    if (listHydrateRenderFrame) return;
    listHydrateRenderFrame = window.requestAnimationFrame(() => {
      listHydrateRenderFrame = 0;
      if (state.watchSheet) paintWatchSheetList();
      if (state.screen === "lists") {
        if (state.listTab === "seen") render();
        else refreshWatchList();
      } else if (state.screen === "done") render();
    });
  }

  function flushListHydratePersist() {
    listHydratePersistTimer = 0;
    if (!listHydratePersistBatch.length) return;
    const batch = listHydratePersistBatch;
    listHydratePersistBatch = [];
    persistKnownFilms(batch);
    scheduleDebouncedSync();
    batch.forEach((stored) => patchFilmRowMeta(stored));
    scheduleListHydrateRender();
  }

  function enqueueListHydrateResult(stored) {
    if (!stored) return;
    listHydratePersistBatch.push(stored);
    window.clearTimeout(listHydratePersistTimer);
    listHydratePersistTimer = window.setTimeout(flushListHydratePersist, LIST_HYDRATE_BATCH_MS);
  }

  function noteListHydrateFailure(sid) {
    const fails = (listHydrateFailCount.get(sid) || 0) + 1;
    listHydrateFailCount.set(sid, fails);
    if (fails >= LIST_HYDRATE_MAX_FAILURES) return;
    const backoff = Math.min(30000, 750 * Math.pow(2, fails - 1));
    listHydrateRetryAfter.set(sid, Date.now() + backoff);
    listHydrateQueued.delete(sid);
    window.setTimeout(() => queueFilmHydration(sid), backoff);
  }

  function shouldSkipListHydrate(sid) {
    if (filmListResolved(sid)) return true;
    if (listHydrateInflight.has(sid)) return true;
    const retryAt = listHydrateRetryAfter.get(sid) || 0;
    if (retryAt > Date.now()) return true;
    if ((listHydrateFailCount.get(sid) || 0) >= LIST_HYDRATE_MAX_FAILURES) return true;
    return false;
  }

  function pumpListFilmHydration() {
    while (listHydrateActive < LIST_HYDRATE_CONCURRENCY && listHydrateQueue.length) {
      const sid = listHydrateQueue[0];
      if (!sid) {
        listHydrateQueue.shift();
        continue;
      }
      if (shouldSkipListHydrate(sid)) {
        if (filmListResolved(sid)) {
          listHydrateQueue.shift();
          listHydrateQueued.delete(sid);
          continue;
        }
        if ((listHydrateFailCount.get(sid) || 0) >= LIST_HYDRATE_MAX_FAILURES) {
          listHydrateQueue.shift();
          listHydrateQueued.delete(sid);
          continue;
        }
        break;
      }
      listHydrateQueue.shift();
      const tmdb = tmdbFromListId(sid);
      if (!tmdb || !remoteSearchAvailable()) continue;
      listHydrateActive += 1;
      const promise = proxyFetch(`/movie/${tmdb}`, { append_to_response: "credits" }).then((data) => {
        const next = filmFromMovieDetail(data);
        if (!next) {
          noteListHydrateFailure(sid);
          return null;
        }
        listHydrateFailCount.delete(sid);
        listHydrateRetryAfter.delete(sid);
        liveDetailTried.add(filmId(next));
        const stored = rememberFilm(next, { persist: false });
        if (stored) enqueueListHydrateResult(stored);
        return stored;
      }).catch(() => {
        noteListHydrateFailure(sid);
        return null;
      }).finally(() => {
        listHydrateInflight.delete(sid);
        listHydrateQueued.delete(sid);
        listHydrateActive -= 1;
        pumpListFilmHydration();
      });
      listHydrateInflight.set(sid, promise);
    }
  }

  function kickListFilmHydration() {
    window.clearTimeout(listHydrateKickTimer);
    listHydrateKickTimer = window.setTimeout(() => {
      listHydrateKickTimer = 0;
      pumpListFilmHydration();
    }, 16);
  }

  function queueFilmHydration(id) {
    const sid = canonicalListFilmId(id);
    if (!sid || !remoteSearchAvailable()) return;
    if (filmListResolved(sid)) return;
    if (!tmdbFromListId(sid)) return;
    if (listHydrateQueued.has(sid) || listHydrateInflight.has(sid)) return;
    if ((listHydrateFailCount.get(sid) || 0) >= LIST_HYDRATE_MAX_FAILURES) return;
    const retryAt = listHydrateRetryAfter.get(sid) || 0;
    if (retryAt > Date.now()) return;
    listHydrateQueued.add(sid);
    listHydrateQueue.push(sid);
    kickListFilmHydration();
  }

  function listFilmOrPlaceholder(id) {
    const film = filmListResolved(id);
    if (film) return filmWithPoster(film);
    queueFilmHydration(id);
    return filmWithPoster(pendingListFilm(id));
  }

  function collectListFilmIds() {
    const ids = new Set();
    watchlist().forEach((row) => { if (row && row.id != null) ids.add(String(row.id)); });
    queue().forEach((row) => { if (row && row.id != null) ids.add(String(row.id)); });
    history().forEach((row) => { if (row && row.id != null) ids.add(String(row.id)); });
    Object.keys(ratings()).forEach((id) => ids.add(String(id)));
    return ids;
  }

  function hydrateMissingListFilms() {
    if (!state.profile || !remoteSearchAvailable()) return;
    collectListFilmIds().forEach((id) => {
      if (!filmListResolved(id)) queueFilmHydration(id);
    });
  }

  function beginSearchEnrichCycle() {
    window.clearTimeout(searchEnrichTimer);
    searchEnrichToken += 1;
    searchEnrichQueue = [];
    searchEnrichQueued.clear();
    unbindSearchRowEnrich();
  }

  function enqueueSearchEnrich(films, token) {
    for (const film of films || []) {
      if (token !== searchEnrichToken) return;
      const id = film && filmId(film);
      if (!id || searchEnrichQueued.has(id) || searchEnrichGaveUp.has(id) || liveDetailTried.has(id)) continue;
      const current = (state.searchHits || []).find((row) => filmId(row) === id) || film;
      if (!searchRowNeedsEnrich(current)) continue;
      searchEnrichQueued.add(id);
      searchEnrichQueue.push({ id, token });
    }
    pumpSearchEnrich();
  }

  function pumpSearchEnrich() {
    while (searchEnrichActive < SEARCH_ENRICH_CONCURRENCY && searchEnrichQueue.length) {
      const job = searchEnrichQueue.shift();
      if (!job || job.token !== searchEnrichToken) continue;
      const film = (state.searchHits || []).find((row) => filmId(row) === job.id);
      if (!film || !searchRowNeedsEnrich(film)) continue;
      searchEnrichActive += 1;
      const pending = requestLiveDetails(film);
      Promise.resolve(pending).then((stored) => {
        if (!stored && searchRowNeedsEnrich(film)) searchEnrichGaveUp.add(job.id);
      }).finally(() => {
        searchEnrichActive -= 1;
        pumpSearchEnrich();
      });
    }
  }

  function unbindSearchRowEnrich() {
    if (searchRowObserver) {
      searchRowObserver.disconnect();
      searchRowObserver = null;
    }
    if (searchEnrichScrollFrame) {
      window.cancelAnimationFrame(searchEnrichScrollFrame);
      searchEnrichScrollFrame = 0;
    }
    if (searchEnrichScrollTarget && searchEnrichScrollHandler) {
      searchEnrichScrollTarget.removeEventListener("scroll", searchEnrichScrollHandler);
    }
    searchEnrichScrollTarget = null;
    searchEnrichScrollHandler = null;
  }

  function visibleSearchRowFilms(list) {
    const rect = list.getBoundingClientRect();
    const byId = new Map((state.searchHits || []).map((film) => [filmId(film), film]));
    const next = [];
    list.querySelectorAll(".film-row[data-id]").forEach((row) => {
      const box = row.getBoundingClientRect();
      if (box.bottom < rect.top - 24 || box.top > rect.bottom + 80) return;
      const film = byId.get(row.dataset.id);
      if (film) next.push(film);
    });
    return next;
  }

  function bindSearchRowEnrich() {
    unbindSearchRowEnrich();
    if (state.watchSheet !== "search" || state.searchStatus === "loading") return;
    if (!remoteSearchAvailable() || !watchSheetEl) return;
    const list = watchSheetEl.querySelector("[data-role=watch-sheet-list]");
    if (!list) return;
    const token = searchEnrichToken;
    const byId = new Map((state.searchHits || []).map((film) => [filmId(film), film]));
    enqueueSearchEnrich(watchSheetFilms().slice(0, SEARCH_ENRICH_FIRST), token);
    if (typeof IntersectionObserver === "function") {
      searchRowObserver = new IntersectionObserver((entries) => {
        if (token !== searchEnrichToken) return;
        const next = [];
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const film = byId.get(entry.target.dataset.id);
          if (film) next.push(film);
        }
        enqueueSearchEnrich(next, token);
      }, {
        root: list,
        rootMargin: "80px 0px",
        threshold: 0.01,
      });
      list.querySelectorAll(".film-row[data-id]").forEach((row) => searchRowObserver.observe(row));
    }
    searchEnrichScrollTarget = list;
    searchEnrichScrollHandler = () => {
      if (searchEnrichScrollFrame) return;
      searchEnrichScrollFrame = window.requestAnimationFrame(() => {
        searchEnrichScrollFrame = 0;
        if (token !== searchEnrichToken || state.watchSheet !== "search") return;
        enqueueSearchEnrich(visibleSearchRowFilms(list), token);
      });
    };
    list.addEventListener("scroll", searchEnrichScrollHandler, { passive: true });
  }

  function scheduleSettledSearchEnrich() {
    window.clearTimeout(searchEnrichTimer);
    if (state.watchSheet !== "search" || state.searchStatus === "loading") return;
    const token = searchEnrichToken;
    searchEnrichTimer = window.setTimeout(() => {
      if (token !== searchEnrichToken) return;
      if (state.watchSheet !== "search" || state.searchStatus === "loading") return;
      bindSearchRowEnrich();
    }, 200);
  }

  const TMDB_POSTER_BASE = "https://image.tmdb.org/t/p/";
  const POSTER_SIZE_CARD = "w185";
  const POSTER_SIZE_THUMB = "w92";

  function tmdbPoster(path, size) {
    if (!path) return "";
    const normalized = String(path).startsWith("/") ? path : `/${path}`;
    return `${TMDB_POSTER_BASE}${size || POSTER_SIZE_CARD}${normalized}`;
  }

  function withPosterSize(src, size) {
    if (!src) return "";
    if (!size) return String(src);
    return String(src).replace(/^(https:\/\/image\.tmdb\.org\/t\/p\/)w\d+\//, `$1${size}/`);
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
      original_title: raw.original_title || "",
      genres: names,
      genre: names[0] || "Film",
      runtime: raw.runtime || 0,
      minutes: raw.runtime || 0,
      vote_average: raw.vote_average,
      rating: raw.vote_average,
      poster: tmdbPoster(raw.poster_path),
      poster_path: raw.poster_path,
      year: raw.release_date ? Number(String(raw.release_date).slice(0, 4)) : 0,
      release_date: raw.release_date || "",
      popularity: Number(raw.popularity) || 0,
      vote_count: Number(raw.vote_count) || 0,
      overview: String(raw.overview || "").trim(),
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
    if (state.screen === "discover") render();
  }

  function posterUrl(film, size) {
    const src = film && film.poster ? String(film.poster) : "";
    return size ? withPosterSize(src, size) : src;
  }

  function posterTile(film, opts) {
    const lazy = !!(opts && opts.lazy);
    const size = (opts && opts.size) || (lazy ? POSTER_SIZE_THUMB : POSTER_SIZE_CARD);
    const src = posterUrl(film, size);
    const color = (film && film.color) || "#1d4f91";
    let img = "";
    if (src) {
      const dims = lazy
        ? `width="92" height="138"`
        : `width="185" height="278"`;
      const srcAttr = lazy
        ? `data-poster-src="${escapeHtml(src)}"`
        : `src="${escapeHtml(src)}"`;
      img = `<img ${srcAttr} alt="" ${dims} decoding="async"${lazy ? ' loading="lazy"' : ""} referrerpolicy="no-referrer">`;
    }
    return `<div class="poster" style="background-color:${color}" role="img" aria-label="">${img}</div>`;
  }

  const posterObserversByList = new WeakMap();

  function revealPosterImg(img) {
    if (!img) return;
    const src = img.getAttribute("data-poster-src");
    if (!src) return;
    img.src = src;
    img.removeAttribute("data-poster-src");
  }

  function observeListPosters(scope) {
    const root = scope || document;
    const imgs = root.querySelectorAll ? root.querySelectorAll("img[data-poster-src]") : [];
    if (!imgs.length) return;
    if (typeof IntersectionObserver !== "function") {
      imgs.forEach(revealPosterImg);
      return;
    }
    const groups = new Map();
    imgs.forEach((img) => {
      const list = img.closest(".film-list") || root;
      if (!groups.has(list)) groups.set(list, []);
      groups.get(list).push(img);
    });
    groups.forEach((group, list) => {
      const prev = posterObserversByList.get(list);
      if (prev) prev.disconnect();
      const scrollRoot = list && list.classList && list.classList.contains("film-list") && list.clientHeight
        ? list
        : null;
      const obs = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          revealPosterImg(entry.target);
          obs.unobserve(entry.target);
        }
      }, {
        root: scrollRoot,
        rootMargin: "160px 0px",
        threshold: 0.01,
      });
      group.forEach((img) => obs.observe(img));
      posterObserversByList.set(list, obs);
    });
  }

  function observeListPostersSoon(scope) {
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(() => observeListPosters(scope));
    } else {
      observeListPosters(scope);
    }
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
    logout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3.2v8.2"/><path d="M7.05 5.7a8 8 0 1 0 9.9 0"/></svg>`,
    swap: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h12"/><path d="m15.5 3.8 3.5 3.2-3.5 3.2"/><path d="M17 17H5"/><path d="m8.5 13.8-3.5 3.2 3.5 3.2"/></svg>`,
    gear: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3.1"/><path d="M12 3.2v2.1M12 18.7v2.1M3.2 12h2.1M18.7 12h2.1M5.9 5.9l1.5 1.5M16.6 16.6l1.5 1.5M18.1 5.9l-1.5 1.5M7.4 16.6l-1.5 1.5"/></svg>`,
    filter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.6 4.8h16.8l-6.2 7.6v5.3L9.8 20v-7.6L3.6 4.8z"/></svg>`,
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
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 10 17.5 19 7"/></svg>`,
    search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="6.2"/><path d="m16 16 4.2 4.2"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
    chipX: `<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 3l6 6M9 3 3 9"/></svg>`,
    jump: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.2 3.2H3.8A1.6 1.6 0 0 0 2.2 4.8v7.4A1.6 1.6 0 0 0 3.8 13.8h7.4a1.6 1.6 0 0 0 1.6-1.6V9.8"/><path d="M8.6 7.4 13.8 2.2M9.8 2.2h4v4"/></svg>`,
    edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h4.2L19.2 8.9a1.6 1.6 0 0 0 0-2.3l-1.8-1.8a1.6 1.6 0 0 0-2.3 0L4 15.8V20z"/><path d="m13.6 6.4 4 4"/></svg>`,
    person: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="8.1" r="3.1"/><path d="M5.4 19.2c.9-3.3 3.3-5.1 6.6-5.1s5.7 1.8 6.6 5.1"/></svg>`,
    lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="6" y="10.2" width="12" height="9.3" rx="2"/><path d="M8.2 10.2V8.1a3.8 3.8 0 0 1 7.6 0v2.1"/></svg>`,
    eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2.7 12S6.1 6.6 12 6.6 21.3 12 21.3 12 17.9 17.4 12 17.4 2.7 12 2.7 12z"/><circle cx="12" cy="12" r="2.35"/></svg>`,
    eyeOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 5.1 19.4 20.5"/><path d="M10.1 10.4a2.35 2.35 0 0 0 3.4 3.3"/><path d="M7.1 7.6C5 8.9 3.4 11.1 2.7 12c0 0 3.4 5.4 9.3 5.4 1.6 0 3-.3 4.2-.8"/><path d="M16.8 16.1c1.8-1.2 3.2-3 3.8-4.1 0 0-1.6-2.6-4.5-4.2"/></svg>`,
    cloud: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.5 18h9.2a4.3 4.3 0 0 0 .6-8.55 5.5 5.5 0 0 0-10.55 1.7A3.7 3.7 0 0 0 7.5 18z"/></svg>`,
    menu: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5.5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="18.5" cy="12" r="1.7"/></svg>`,
    chevron: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`,
    chevronUp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg>`,
    richtung: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19.9 3.55 3.35 10.05c-.72.29-.68 1.32.06 1.55l6.15 1.84 1.84 6.15c.23.74 1.26.78 1.55.06l6.5-16.55c.28-.7-.35-1.33-1.05-1.05z"/></svg>`,
    bookmark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" aria-hidden="true"><path d="M7 4.2h10c.55 0 1 .45 1 1V20l-6-3.5L6 20V5.2c0-.55.45-1 1-1z"/></svg>`,
    bookmarkOn: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 3.5h10c.83 0 1.5.67 1.5 1.5V21l-6.5-3.8L5.5 21V5c0-.83.67-1.5 1.5-1.5z"/></svg>`,
  };

  function svgPaintId(prefix) {
    return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
  }

  const THUMB_RIM = "#a8b6c4";

  function thumbEnamel(x, y, base, shade) {
    return `<g transform="translate(${x} ${y})">
      <path d="M7 8v-4.2c0-1.4.8-2.4 2-2.4s2 1 2 2.4V8h4.2c1.2 0 2 .9 1.8 2l-.8 5.2c-.2 1.1-1.1 1.8-2.2 1.8H7z" fill="${base}" stroke="${THUMB_RIM}" stroke-width="0.8" stroke-linejoin="round"/>
      <rect x="0" y="8" width="6.2" height="9" rx="1.2" fill="${shade}" stroke="${THUMB_RIM}" stroke-width="0.8"/>
      <path d="M1.1 9.4c1.6-1.1 3.6-1 4.9.2" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="0.55" stroke-linecap="round"/>
    </g>`;
  }

  function rateIcon(id) {
    const yellow = thumbEnamel(0, 0, "var(--yellow)", "#e0b020");
    const red = thumbEnamel(0, 0, "var(--red)", "#cf2f2b");
    if (id === "sehr-gut") {
      return `<svg viewBox="0 0 36 22" aria-hidden="true" class="rate-thumb-svg">
        ${thumbEnamel(2, 2, "var(--green-strong)", "#256d2a")}${thumbEnamel(12, 2, "var(--green-strong)", "#256d2a")}
      </svg>`;
    }
    if (id === "gut") {
      return `<svg viewBox="0 0 36 22" aria-hidden="true" class="rate-thumb-svg">${thumbEnamel(8, 2, "var(--green-soft)", "#6fbb76")}</svg>`;
    }
    if (id === "ok") {
      return `<svg viewBox="0 0 36 22" aria-hidden="true" class="rate-thumb-svg">
        <g transform="translate(18 11) rotate(-90) translate(-10 -9)">${yellow}</g>
      </svg>`;
    }
    return `<svg viewBox="0 0 36 22" aria-hidden="true" class="rate-thumb-svg">
      <g transform="translate(18 11) rotate(180) translate(-10 -9)">${red}</g>
    </svg>`;
  }

  function enamelPlayIcon() {
    const gid = svgPaintId("emberPlay");
    return `<svg class="enamel-play-svg" viewBox="0 0 58 58" fill="none" aria-hidden="true">
      <circle cx="29" cy="29" r="22" fill="rgba(255,255,255,.46)" stroke="#d4926a" stroke-width="1.15"/>
      <circle cx="29" cy="29" r="18.5" fill="url(#${gid})" stroke="rgba(255,255,255,.96)" stroke-width="1"/>
      <defs>
        <linearGradient id="${gid}" x1="17" y1="12" x2="42" y2="48" gradientUnits="userSpaceOnUse">
          <stop stop-color="#fff"/>
          <stop offset=".55" stop-color="#f8fbfe"/>
          <stop offset="1" stop-color="#deedf6"/>
        </linearGradient>
      </defs>
      <path d="M25 19.5L39 29 25 38.5z" fill="#0872bc"/>
    </svg>`;
  }

  function videoSwitchSvg() {
    return `<svg class="switch-icon icon-swap" viewBox="5 7 14 10" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 10h11l-2.5-2.5M17 14H6l2.5 2.5"/><path d="M18 10l-2.5 2.5M6 14l2.5-2.5"/></svg>`;
  }

  function videoCoverSvg() {
    return `<svg class="cov" viewBox="0 0 72 52" aria-hidden="true"><defs><linearGradient id="avel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a0d16"/><stop offset=".25" stop-color="#9c2230"/><stop offset=".5" stop-color="#5c1019"/><stop offset=".75" stop-color="#a82838"/><stop offset="1" stop-color="#4a0d16"/></linearGradient><pattern id="afolds" width="4" height="52" patternUnits="userSpaceOnUse"><rect width="4" height="52" fill="url(#avel)"/></pattern><radialGradient id="ascr" cx=".5" cy=".42" r=".7"><stop offset="0" stop-color="#2a4f78"/><stop offset=".55" stop-color="#132a44"/><stop offset="1" stop-color="#0a1524"/></radialGradient><linearGradient id="agold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6dfa4"/><stop offset=".45" stop-color="#c9a256"/><stop offset=".7" stop-color="#f3d690"/><stop offset="1" stop-color="#9c7533"/></linearGradient><radialGradient id="aplate" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#f3f8fc"/><stop offset="1" stop-color="#d6e7f3"/></radialGradient><radialGradient id="aglow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#f6d08a" stop-opacity=".55"/><stop offset="1" stop-color="#f6d08a" stop-opacity="0"/></radialGradient></defs><rect width="72" height="52" rx="9" fill="url(#ascr)"/><path d="M0 0h20c-3 14-6 30-5 52H9C4 52 0 48 0 43z" fill="url(#afolds)"/><path d="M72 0H52c3 14 6 30 5 52h6c5 0 9-4 9-9z" fill="url(#afolds)"/><path d="M15 30c3-1 4 1 3 3" stroke="url(#agold)" stroke-width="1.6" fill="none"/><path d="M57 30c-3-1-4 1-3 3" stroke="url(#agold)" stroke-width="1.6" fill="none"/><path d="M0 0h72v7c-4 3-8 3-12 0-4 3-8 3-12 0-4 3-8 3-12 0-4 3-8 3-12 0-4 3-8 3-12 0-4 3-8 3-12 0z" fill="url(#avel)"/><path d="M0 7c4 3 8 3 12 0 4 3 8 3 12 0 4 3 8 3 12 0 4 3 8 3 12 0 4 3 8 3 12 0 4 3 8 3 12 0" stroke="url(#agold)" stroke-width="1.1" fill="none"/><ellipse cx="36" cy="29" rx="14" ry="11" fill="url(#aglow)"/><circle cx="36" cy="29" r="10.2" fill="none" stroke="url(#agold)" stroke-width="1.3"/><circle cx="36" cy="29" r="8" fill="url(#aplate)" stroke="#fff" stroke-width=".8"/><path d="M33.44 25.16L40.4 29L33.44 32.84z" fill="#0872bc"/><rect x=".5" y=".5" width="71" height="51" rx="8.5" fill="none" stroke="url(#agold)" stroke-width="1"/></svg>`;
  }

  function detectPlatform(urlStr) {
    if (!urlStr || typeof urlStr !== "string") return { id: "generic", label: "Web", cls: "plat-generic" };
    try {
      const url = new URL(urlStr.trim().startsWith("http") ? urlStr.trim() : `https://${urlStr.trim()}`);
      const host = url.hostname.toLowerCase();
      if (host.includes("youtube.com") || host.includes("youtu.be")) return { id: "yt", label: "YouTube", cls: "plat-yt" };
      if (host.includes("instagram.com")) return { id: "ig", label: "Instagram", cls: "plat-ig" };
      if (host.includes("facebook.com") || host.includes("fb.watch") || host.includes("fb.com")) return { id: "fb", label: "Facebook", cls: "plat-fb" };
      if (host.includes("tiktok.com")) return { id: "tiktok", label: "TikTok", cls: "plat-tiktok" };
      if (host.includes("vimeo.com")) return { id: "vimeo", label: "Vimeo", cls: "plat-vimeo" };
      if (host.includes("twitch.tv")) return { id: "twitch", label: "Twitch", cls: "plat-twitch" };
      if (host.includes("netflix.com")) return { id: "netflix", label: "Netflix", cls: "plat-netflix" };
      if (host.includes("amazon.") || host.includes("primevideo.com")) return { id: "prime", label: "Prime Video", cls: "plat-prime" };
      if (host.includes("disneyplus.com")) return { id: "disney", label: "Disney+", cls: "plat-disney" };
      if (host.includes("ardmediathek.de")) return { id: "ard", label: "ARD Mediathek", cls: "plat-mediathek" };
      if (host.includes("zdf.de")) return { id: "zdf", label: "ZDF Mediathek", cls: "plat-mediathek" };
      const clean = host.replace(/^www\./, "");
      return { id: "generic", label: clean, cls: "plat-generic" };
    } catch {
      return { id: "generic", label: "Web", cls: "plat-generic" };
    }
  }

  const videoEmbedBlocked = new Set();
  let ytApiPromise = null;
  let activeYtPlayer = null;

  function embedParentDomain() {
    const host = window.location.hostname || "";
    if (host === "localhost" || host === "127.0.0.1" || host.endsWith(".github.io")) return host;
    return "maesspeed.github.io";
  }

  function parseYouTubeId(urlStr) {
    if (!urlStr) return "";
    try {
      const url = new URL(urlStr.trim().startsWith("http") ? urlStr.trim() : `https://${urlStr.trim()}`);
      const host = url.hostname.toLowerCase();
      if (host.includes("youtu.be")) return (url.pathname.slice(1).split("/")[0] || "").split("?")[0];
      if (!host.includes("youtube.com")) return "";
      const parts = url.pathname.split("/").filter(Boolean);
      if (parts[0] === "shorts" && parts[1]) return parts[1];
      if (parts[0] === "embed" && parts[1]) return parts[1];
      return url.searchParams.get("v") || "";
    } catch {
      return "";
    }
  }

  function parseVimeoId(urlStr) {
    if (!urlStr) return "";
    try {
      const url = new URL(urlStr.trim().startsWith("http") ? urlStr.trim() : `https://${urlStr.trim()}`);
      if (!url.hostname.toLowerCase().includes("vimeo.com")) return "";
      const parts = url.pathname.split("/").filter(Boolean);
      const id = parts.find((p) => /^\d+$/.test(p));
      return id || "";
    } catch {
      return "";
    }
  }

  function parseDailymotionId(urlStr) {
    if (!urlStr) return "";
    try {
      const url = new URL(urlStr.trim().startsWith("http") ? urlStr.trim() : `https://${urlStr.trim()}`);
      const host = url.hostname.toLowerCase();
      if (!host.includes("dailymotion.com")) return "";
      const m = url.pathname.match(/\/video\/([^/?#]+)/);
      return m ? m[1] : (url.searchParams.get("video") || "");
    } catch {
      return "";
    }
  }

  function parseTwitchEmbedSrc(urlStr) {
    if (!urlStr) return "";
    try {
      const url = new URL(urlStr.trim().startsWith("http") ? urlStr.trim() : `https://${urlStr.trim()}`);
      const host = url.hostname.toLowerCase();
      if (!host.includes("twitch.tv")) return "";
      const parent = embedParentDomain();
      const clipMatch = url.pathname.match(/\/clip\/([^/?#]+)/i);
      if (clipMatch) return `https://clips.twitch.tv/embed?clip=${encodeURIComponent(clipMatch[1])}&parent=${encodeURIComponent(parent)}`;
      const videoMatch = url.pathname.match(/\/videos\/(\d+)/);
      if (videoMatch) return `https://player.twitch.tv/?video=${encodeURIComponent(videoMatch[1])}&parent=${encodeURIComponent(parent)}`;
      const channel = url.pathname.split("/").filter(Boolean)[0];
      if (channel && !["directory", "videos", "clip", "clips"].includes(channel.toLowerCase())) {
        return `https://player.twitch.tv/?channel=${encodeURIComponent(channel)}&parent=${encodeURIComponent(parent)}`;
      }
    } catch { /* ignore */ }
    return "";
  }

  function embedInfo(urlStr) {
    if (!urlStr || typeof urlStr !== "string") return { kind: "none" };
    const detected = detectPlatform(urlStr);
    const ytId = parseYouTubeId(urlStr);
    if (ytId) {
      return {
        kind: "iframe",
        provider: "yt",
        videoId: ytId,
        src: `https://www.youtube-nocookie.com/embed/${ytId}?playsinline=1&rel=0`,
        label: "YouTube",
      };
    }
    const vimeoId = parseVimeoId(urlStr);
    if (vimeoId) {
      return {
        kind: "iframe",
        provider: "vimeo",
        src: `https://player.vimeo.com/video/${vimeoId}?playsinline=1`,
        label: "Vimeo",
      };
    }
    const dmId = parseDailymotionId(urlStr);
    if (dmId) {
      return {
        kind: "iframe",
        provider: "dailymotion",
        src: `https://www.dailymotion.com/embed/video/${dmId}`,
        label: "Dailymotion",
      };
    }
    const twitchSrc = parseTwitchEmbedSrc(urlStr);
    if (twitchSrc) {
      return { kind: "iframe", provider: "twitch", src: twitchSrc, label: "Twitch" };
    }
    try {
      const url = new URL(urlStr.trim().startsWith("http") ? urlStr.trim() : `https://${urlStr.trim()}`);
      if (/\.(mp4|webm|m3u8)(\?.*)?$/i.test(url.pathname)) {
        return { kind: "video", src: urlStr.trim(), label: detected.label || "Video" };
      }
    } catch { /* ignore */ }
    return { kind: "none", label: detected.label };
  }

  function destroyInlineVideoPlayer() {
    if (activeYtPlayer) {
      try {
        if (typeof activeYtPlayer.destroy === "function") activeYtPlayer.destroy();
      } catch { /* ignore */ }
      activeYtPlayer = null;
    }
  }

  function loadYouTubeIframeApi() {
    if (window.YT && window.YT.Player) return Promise.resolve();
    if (ytApiPromise) return ytApiPromise;
    ytApiPromise = new Promise((resolve) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prev === "function") prev();
        resolve();
      };
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    });
    return ytApiPromise;
  }

  function mountInlineVideoPlayer() {
    if (!state.inlineVideoPlayerId || state.screen !== "lists" || state.listsMode !== "videos") return;
    const hid = String(state.inlineVideoPlayerId);
    if (videoEmbedBlocked.has(hid)) return;
    const video = findVideo(hid);
    if (!video || !video.url) return;
    const embed = embedInfo(video.url);
    if (embed.kind === "none") return;
    const mount = app.querySelector(`[data-role=video-inline-mount][data-id="${hid}"]`);
    if (!mount || mount.dataset.mounted === "1") return;

    destroyInlineVideoPlayer();
    mount.innerHTML = "";
    mount.dataset.mounted = "1";

    if (embed.kind === "video") {
      const el = document.createElement("video");
      el.src = embed.src;
      el.controls = true;
      el.playsInline = true;
      el.setAttribute("playsinline", "");
      el.preload = "metadata";
      mount.appendChild(el);
      return;
    }

    if (embed.provider === "yt" && embed.videoId) {
      const playerId = `yt-inline-${hid.replace(/[^a-zA-Z0-9_-]/g, "")}`;
      mount.innerHTML = `<div id="${playerId}" class="video-inline-yt"></div>`;
      loadYouTubeIframeApi().then(() => {
        if (state.inlineVideoPlayerId !== hid) return;
        const box = document.getElementById(playerId);
        if (!box || !window.YT || !window.YT.Player) return;
        activeYtPlayer = new window.YT.Player(playerId, {
          videoId: embed.videoId,
          host: "https://www.youtube-nocookie.com",
          playerVars: {
            playsinline: 1,
            rel: 0,
            modestbranding: 1,
          },
          events: {
            onError: (event) => {
              if (event.data === 101 || event.data === 150) {
                videoEmbedBlocked.add(hid);
                destroyInlineVideoPlayer();
                render();
              }
            },
          },
        });
      });
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.src = embed.src;
    iframe.title = embed.label || "Video";
    iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    iframe.allowFullscreen = true;
    iframe.setAttribute("playsinline", "");
    mount.appendChild(iframe);
  }

  function updateVideoEverywhere(patch) {
    if (!patch || !patch.id) return false;
    const hid = String(patch.id);
    const now = nowIso();
    const merged = Object.assign({}, patch, { updatedAt: now });
    let changed = false;
    const touch = (load, save) => {
      const list = load();
      const idx = list.findIndex((v) => String(v.id) === hid);
      if (idx < 0) return;
      const next = list.slice();
      next[idx] = Object.assign({}, list[idx], merged);
      save(next);
      changed = true;
    };
    touch(videoWatchlist, saveVideoWatchlist);
    touch(videoQueue, saveVideoQueue);
    touch(videoHistory, saveVideoHistory);
    return changed;
  }

  function platformBadgeHtml(platId, labelOverride) {
    if (platId === "yt") return `<span class="v-plat plat-yt"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23 12s0-3.6-.46-5.2a2.9 2.9 0 0 0-2-2C18.8 4.3 12 4.3 12 4.3s-6.8 0-8.54.5a2.9 2.9 0 0 0-2 2C1 8.4 1 12 1 12s0 3.6.46 5.2a2.9 2.9 0 0 0 2 2c1.74.5 8.54.5 8.54.5s6.8 0 8.54-.5a2.9 2.9 0 0 0 2-2C23 15.6 23 12 23 12zm-13 3.3V8.7L16.2 12 10 15.3z"/></svg> ${labelOverride || "YT"}</span>`;
    if (platId === "ig") return `<span class="v-plat plat-ig"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2zm6.1-8.2a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM12 3.5c-2.3 0-2.6 0-3.5.05-.9.04-1.5.2-2 .38a4 4 0 0 0-1.45.94 4 4 0 0 0-.94 1.45c-.18.5-.34 1.1-.38 2C3.5 9.4 3.5 9.7 3.5 12s0 2.6.05 3.5c.04.9.2 1.5.38 2a4 4 0 0 0 .94 1.45 4 4 0 0 0 1.45.94c.5.18 1.1.34 2 .38.9.05 1.2.05 3.5.05s2.6 0 3.5-.05c.9-.04 1.5-.2 2-.38a4 4 0 0 0 1.45-.94 4 4 0 0 0 .94-1.45c.18-.5.34-1.1.38-2 .05-.9.05-1.2.05-3.5s0-2.6-.05-3.5c-.04-.9-.17-1.26-.28-1.56-.15-.39-.33-.67-.62-.96-.29-.29-.57-.47-.96-.62-.3-.11-.74-.24-1.56-.28C14.6 3.5 14.3 3.5 12 3.5z"/></svg> ${labelOverride || "IG"}</span>`;
    if (platId === "fb") return `<span class="v-plat plat-fb"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z"/></svg> ${labelOverride || "FB"}</span>`;
    if (platId === "tiktok") return `<span class="v-plat plat-tiktok">TikTok</span>`;
    if (platId === "vimeo") return `<span class="v-plat plat-vimeo">Vimeo</span>`;
    if (platId === "twitch") return `<span class="v-plat plat-twitch">Twitch</span>`;
    if (platId === "netflix") return `<span class="v-plat plat-netflix">Netflix</span>`;
    if (platId === "prime") return `<span class="v-plat plat-prime">Prime</span>`;
    if (platId === "disney") return `<span class="v-plat plat-disney">Disney+</span>`;
    if (platId === "ard") return `<span class="v-plat plat-mediathek">ARD</span>`;
    if (platId === "zdf") return `<span class="v-plat plat-mediathek">ZDF</span>`;
    return `<span class="v-plat plat-generic">${escapeHtml(labelOverride || platId || "Web")}</span>`;
  }

  function externalLinkSvg() {
    return `<svg class="video-ext-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 5h5v5"/><path d="M10 14L19 5"/><path d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>`;
  }

  const state = {
    screen: "login",
    authMode: "login",
    user: null,
    profile: null,
    catalog: [],
    filtersOpen: false,
    discoverView: "hub",
    discoverCat: "",
    filters: { dauerOn: false, dauer: 120, genres: [], tags: [], streaming: [], types: [], actors: [], similar: [] },
    zufallFilters: { dauerOn: false, dauer: 120, genres: [], tags: [], streaming: [], types: [], actors: [], similar: [] },
    zufallFiltersDraft: null,
    zufallFilterSheet: false,
    actorQuery: "",
    actorHits: [],
    actorStatus: "",
    similarQuery: "",
    similarHits: [],
    similarStatus: "",
    similarDraft: [],
    similarVisible: 20,
    filterMore: {
      genre: false,
      tags: false,
      streaming: false,
      types: false,
      zufall: false,
      listWatch: false,
      listQueue: false,
      listRated: false,
      listTags: false,
      listTagsActions: false,
      listSeen: false,
      videoWatch: false,
      videoQueue: false,
      videoSeen: false,
      videoRated: false,
      videoTags: false,
      videoTagsActions: false,
    },
    shinePaused: false,
    currentPicks: [],
    shortlist: [],
    sessionBlocked: new Set(),
    sessionSkip: new Set(),
    sessionSuggestGenres: new Set(),
    directionSeeds: [],
    seenRateFor: "",
    seenVideoRateFor: "",
    listTab: "watch",
    search: "",
    searchHits: [],
    searchStatus: "",
    zufallSources: [],
    zufallOrigin: [],
    watchSheet: null,
    watchSheetBaselineIds: null,
    watchCat: "blockbuster",
    watchSearch: "",
    watchSearchContext: null,
    searchContextAddedIds: [],
    highlightWatchlistId: "",
    watchVisibleCount: WATCH_PAGE_SIZE,
    discoverPage: 0,
    discoverTotalPages: 1,
    catalogLive: false,
    ratedFilter: "sehr-gut",
    tagFilter: [],
    seenOnlyUnrated: false,
    seenViewsExpanded: {},
    seenDateEditId: "",
    seenDateEditScope: "film",
    seenSheetFrac: { kind: "preset", f: 1, customPct: "", lastPreset: 1 },
    justWatchedId: null,
    pinJustWatched: false,
    chosen: null,
    addName: "",
    addPlate: "schwarz-lava",
    addCover: null,
    editingProfileId: null,
    coverQuery: "",
    coverHits: [],
    coverStatus: "",
    loginName: "",
    loginPass: "",
    loginError: "",
    cloudSyncOn: false,
    cloudStatus: "hidden", // hidden | ok | syncing | offline
    authBusy: false,
    newTagName: "",
    newTagColor: "#0066B3",
    tagEditId: null,
    editTagName: "",
    editTagColor: "#0066B3",
    editTagPlate: "hell",
    editTagCover: null,
    tagCoverSheet: false,
    tagCoverCandidate: null,
    expandedFilmId: null,
    listsMode: "filme",
    tagManageScope: "film",
    expandedVideoId: null,
    videoSearch: "",
    videoSearchOpen: false,
    videoFormUrl: "",
    videoFormTitle: "",
    videoFormDesc: "",
    videoFormPlat: "",
    videoFormPlatId: "",
    videoFormCustomPlat: false,
    videoFormEditId: null,
    inlineVideoPlayerId: null,
    settingsBusy: false,
    settingsError: "",
    settingsReturnScreen: "lists",
  };

  const app = document.getElementById("app");
  const headerActions = document.getElementById("header-actions");
  const footer = document.getElementById("site-footer");
  const snackbar = document.getElementById("snackbar");
  const watchSheetEl = document.getElementById("watch-sheet");
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

  function syncProxyUrl() {
    const raw = typeof window.SYNC_PROXY === "string" ? window.SYNC_PROXY.trim() : "";
    return raw.replace(/\/+$/, "");
  }

  function cloudSyncAvailable() {
    return Boolean(syncProxyUrl());
  }

  function loadCloudPref() {
    return loadJson("wdq.cloudPref", { on: false }).on === true;
  }

  function saveCloudPref(on) {
    saveJson("wdq.cloudPref", { on: Boolean(on) });
  }

  function loadCloudSession() {
    return loadJson("wdq.cloud", null);
  }

  function saveCloudSession(session) {
    if (!session) {
      localStorage.removeItem("wdq.cloud");
      return;
    }
    saveJson("wdq.cloud", session);
  }

  function cloudUserIdForLogin(login) {
    const key = String(login || "").trim().toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "user";
    return `u-cloud-${key}`;
  }

  function upsertLocalCloudUser(login) {
    const list = users();
    let user = list.find((u) => u.login.toLowerCase() === login.toLowerCase());
    if (!user) {
      user = { id: cloudUserIdForLogin(login), login, cloud: true };
      list.push(user);
    } else {
      user = { ...user, login: user.login || login, cloud: true };
      delete user.password;
      const idx = list.findIndex((u) => u.id === user.id);
      list[idx] = user;
    }
    saveUsers(list);
    return user;
  }

  async function syncApi(path, { method = "GET", body, token } = {}) {
    const base = syncProxyUrl();
    if (!base) throw new Error("Cloud-Sync ist nicht konfiguriert.");
    const headers = { Accept: "application/json" };
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (token) headers.Authorization = `Bearer ${token}`;
    let res;
    try {
      res = await fetch(`${base}${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch (err) {
      const msg = err && err.message ? err.message : "Failed to fetch";
      throw new Error(msg);
    }
    let data = null;
    const text = await res.text();
    if (text) {
      try { data = JSON.parse(text); } catch { data = { error: text }; }
    }
    return { ok: res.ok, status: res.status, data };
  }

  function collectAccountBackup(user) {
    if (!user || !user.id) return null;
    const keys = {};
    const prefix = `wdq.p.${user.id}.`;
    const profileKey = `wdq.profiles.${user.id}`;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      if (key === profileKey || key.startsWith(prefix)) {
        keys[key] = localStorage.getItem(key);
      }
    }
    return {
      format: "cinex-backup",
      version: 1,
      exportedAt: new Date().toISOString(),
      login: user.login,
      user: { id: user.id, login: user.login, cloud: Boolean(user.cloud) },
      keys,
    };
  }

  function downloadJsonFile(filename, obj) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function exportAccountBackupForLogin(login) {
    const name = String(login || "").trim();
    if (!name) {
      state.loginError = "Zum Sichern zuerst den Benutzernamen eingeben.";
      paintLoginError();
      return false;
    }
    const user = users().find((u) => u.login.toLowerCase() === name.toLowerCase());
    if (!user) {
      state.loginError = "Kein lokales Konto mit diesem Namen gefunden.";
      paintLoginError();
      return false;
    }
    const backup = collectAccountBackup(user);
    const stamp = new Date().toISOString().slice(0, 10);
    const safe = String(user.login).replace(/[^\w.-]+/g, "_");
    downloadJsonFile(`cinex-backup-${safe}-${stamp}.json`, backup);
    try {
      saveJson(`wdq.backup.${stamp}.${user.id}`, { at: Date.now(), login: user.login });
    } catch { /* ignore quota */ }
    state.loginError = "";
    paintLoginError();
    showSnack(`Sicherung gespeichert: cinex-backup-${safe}-${stamp}.json`);
    return true;
  }

  function formatSyncWhen(ts) {
    if (!ts) return "";
    try {
      return new Date(ts).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" });
    } catch {
      return "";
    }
  }

  function downloadAccountBackup(user, reason) {
    if (!user) return false;
    const backup = collectAccountBackup(user);
    if (!backup) return false;
    const stamp = new Date().toISOString().slice(0, 10);
    const safe = String(user.login).replace(/[^\w.-]+/g, "_");
    downloadJsonFile(`cinex-backup-${safe}-${stamp}.json`, backup);
    try {
      saveJson(`wdq.backup.${stamp}.${user.id}`, { at: Date.now(), login: user.login, reason: reason || "manual" });
    } catch { /* ignore quota */ }
    return true;
  }

  function cloudAccountLinked() {
    return Boolean(state.user && state.user.cloud && loadCloudSession() && loadCloudSession().token);
  }

  function openSettingsScreen() {
    if (!state.user) return;
    closeAccountMenu();
    state.settingsReturnScreen = state.screen;
    state.settingsError = "";
    state.screen = "settings";
    render();
  }

  function renderSettings() {
    const user = state.user;
    if (!user) return "";
    const linked = cloudAccountLinked();
    const meta = loadSyncMeta(user.id);
    const when = formatSyncWhen(meta.lastPullAt);
    const status = linked
      ? `Cloud-Sync aktiv${when ? ` · Zuletzt ${when}` : ""}`
      : "nur auf diesem Gerät";
    const syncBtn = !linked && cloudSyncAvailable()
      ? `<button type="button" class="btn btn-primary settings-btn" data-act="settings-enable-sync" ${state.settingsBusy ? "disabled" : ""}>${state.settingsBusy ? "Wird eingerichtet …" : "Synchronisierung einschalten"}</button>`
      : "";
    const syncNowBtn = linked
      ? `<button type="button" class="btn btn-primary settings-btn" data-act="settings-sync-now" ${state.settingsBusy ? "disabled" : ""}>${state.settingsBusy ? "Synchronisiere …" : "Jetzt synchronisieren"}</button>`
      : "";
    const err = state.settingsError
      ? `<p class="error settings-error">${escapeHtml(state.settingsError)}</p>`
      : "";
    return `
      <h2 class="screen-title home-title settings-title">Einstellungen</h2>
      <section class="stack settings-stack">
        <article class="card settings-konto">
          <h3 class="settings-konto-title">Konto: ${escapeHtml(user.login)}</h3>
          <p class="settings-konto-status">${escapeHtml(status)}</p>
        </article>
        ${err}
        <button type="button" class="btn btn-primary settings-btn" data-act="settings-backup" ${state.settingsBusy ? "disabled" : ""}>Daten sichern</button>
        ${syncNowBtn}
        ${syncBtn}
      </section>
    `;
  }

  function openEnableSyncPasswordSheet() {
    if (!state.user || state.settingsBusy || !cloudSyncAvailable()) return;
    downloadAccountBackup(state.user, "pre-cloud-enable");
    showSnack("Sicherungsdatei wird heruntergeladen …");
    openConfirm({
      title: "Cloud-Synchronisierung",
      text: "Gib dein Kontopasswort ein. Deine Daten auf diesem Gerät bleiben erhalten und werden online gesichert.",
      extra: `<label class="field"><span>Passwort</span><input data-act="settings-sync-pass" type="password" autocomplete="current-password"></label>`,
      confirmLabel: "Synchronisierung starten",
      confirmAct: "settings-sync-confirm",
      bottom: true,
    });
  }

  function paintSettingsSyncModalError(message) {
    const hint = modalEl.querySelector(".hint");
    if (hint && message) hint.textContent = message;
  }

  async function confirmEnableCloudSync() {
    const user = state.user;
    if (!user || state.settingsBusy || !cloudSyncAvailable()) return;
    const input = modalEl.querySelector("[data-act=settings-sync-pass]");
    const password = input ? input.value : "";
    if (!password) {
      paintSettingsSyncModalError("Bitte Passwort eingeben.");
      return;
    }
    const login = String(user.login || "").trim();
    if (login.length < 3 || login.length > 32) {
      paintSettingsSyncModalError("Benutzername: 3–32 Zeichen.");
      return;
    }
    state.settingsBusy = true;
    state.settingsError = "";
    render();
    let linkedMsg = "";
    try {
      let token = null;
      const reg = await syncApi("/register", { method: "POST", body: { name: login, password } });
      if (reg.ok && reg.data && reg.data.token) {
        token = reg.data.token;
      } else if (reg.status === 409) {
        const log = await syncApi("/login", { method: "POST", body: { name: login, password } });
        if (!log.ok || !log.data || !log.data.token) {
          if (log.status === 401) paintSettingsSyncModalError("Login oder Passwort stimmt nicht.");
          else if (log.status === 429) paintSettingsSyncModalError("Zu viele Versuche. Bitte kurz warten.");
          else paintSettingsSyncModalError((log.data && (log.data.error || log.data.message)) || "Cloud-Anmeldung fehlgeschlagen.");
          return;
        }
        token = log.data.token;
        linkedMsg = "Konto verknüpft";
      } else if (reg.status === 401) {
        paintSettingsSyncModalError("Login oder Passwort stimmt nicht.");
        return;
      } else if (reg.status === 429) {
        paintSettingsSyncModalError("Zu viele Versuche. Bitte kurz warten.");
        return;
      } else {
        paintSettingsSyncModalError((reg.data && (reg.data.error || reg.data.message)) || "Cloud-Anmeldung fehlgeschlagen.");
        return;
      }
      const list = users();
      const idx = list.findIndex((u) => u.id === user.id);
      if (idx < 0) throw new Error("Lokales Konto nicht gefunden.");
      const updated = { ...list[idx], login, cloud: true };
      delete updated.password;
      list[idx] = updated;
      saveUsers(list);
      state.user = updated;
      saveCloudSession({
        token,
        name: login,
        userId: user.id,
        at: Date.now(),
      });
      closeModal();
      bindCloudLifecycle();
      setCloudStatus("syncing");
      await syncAccount(updated, { forceUpload: true });
      setCloudStatus("ok");
      if (linkedMsg) showSnack(linkedMsg);
      else showSnack("Cloud-Synchronisierung aktiv");
    } catch (err) {
      const msg = err && err.message ? err.message : "Keine Verbindung zur Cloud.";
      state.settingsError = msg;
      closeModal();
    } finally {
      state.settingsBusy = false;
      render();
    }
  }

  function importAccountBackupObject(obj) {
    if (!obj || obj.format !== "cinex-backup" || !obj.user || !obj.user.id || !obj.keys) {
      throw new Error("Ungültige Sicherungsdatei.");
    }
    const list = users();
    let user = list.find((u) => u.id === obj.user.id || u.login.toLowerCase() === String(obj.user.login || "").toLowerCase());
    if (!user) {
      user = { id: obj.user.id, login: obj.user.login, cloud: Boolean(obj.user.cloud) };
      list.push(user);
    } else {
      user = { ...user, login: obj.user.login || user.login };
      if (obj.user.cloud) {
        user.cloud = true;
        delete user.password;
      }
      const idx = list.findIndex((u) => u.id === user.id);
      list[idx] = user;
    }
    saveUsers(list);
    Object.entries(obj.keys).forEach(([key, value]) => {
      if (typeof key === "string" && key.startsWith("wdq.") && typeof value === "string") {
        localStorage.setItem(key, value);
      }
    });
    return user;
  }

  function pickBackupFile() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json,.json";
    input.addEventListener("change", async () => {
      const file = input.files && input.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        const obj = JSON.parse(text);
        const user = importAccountBackupObject(obj);
        state.loginName = user.login || state.loginName;
        state.loginError = "";
        showSnack(`Sicherung für „${user.login}“ geladen.`);
        render();
      } catch (err) {
        state.loginError = err && err.message ? err.message : "Sicherung konnte nicht geladen werden.";
        paintLoginError();
      }
    });
    input.click();
  }


  // --- Cloud Sync Schritt 3: collect / merge / tombstones / migration ---
  const SYNC_TOMBSTONE_MAX_MS = 90 * 24 * 3600 * 1000;
  const SYNC_PUSH_DEBOUNCE_MS = 60 * 1000;
  const SYNC_PULL_INTERVAL_MS = 5 * 60 * 1000;
  const SYNC_PROFILE_SUFFIXES = [
    "watchlist", "queue", "history", "ratings", "tags", "filmTags", "tagCovers",
    "favorite", "known", "videoWatchlist", "videoQueue", "videoHistory", "watchSwipeHint",
    "profileMeta", "zufallFilters",
  ];

  const TAG_SCOPE_MIGRATION_VERSION = 1;
  const CAST_ORDER_MIGRATION_VERSION = 1;
  const FILM_FALLBACK_CAST_IDS = new Set(FILMS.map((row) => filmId(row)));

  function sortCastByOrder(a, b) {
    const ao = Number.isFinite(Number(a.order)) ? Number(a.order) : 999;
    const bo = Number.isFinite(Number(b.order)) ? Number(b.order) : 999;
    return ao - bo;
  }

  function isVideoEntityId(id) {
    return String(id || "").startsWith("v-");
  }

  function tagScopeOf(tag) {
    if (!tag || typeof tag !== "object") return "film";
    return tag.scope === "video" ? "video" : "film";
  }

  function profileStoragePrefix(userId, profileId) {
    return `wdq.p.${userId}.${profileId}.`;
  }

  function migrateTagsScopeForStorage(prefix) {
    if (!prefix) return;
    const meta = loadJson(`${prefix}profileMeta`, {});
    if (Number(meta.tagsScopeMigrated) >= TAG_SCOPE_MIGRATION_VERSION) return;

    const mapRaw = loadJson(`${prefix}filmTags`, {});
    const map = mapRaw && typeof mapRaw === "object" && !Array.isArray(mapRaw) ? mapRaw : {};
    let tags = loadJson(`${prefix}tags`, []);
    if (!Array.isArray(tags)) tags = [];

    const usedOnFilm = new Set();
    const usedOnVideo = new Set();
    Object.entries(map).forEach(([entityId, tagIds]) => {
      const ids = Array.isArray(tagIds) ? tagIds : [];
      if (isVideoEntityId(entityId)) ids.forEach((tid) => usedOnVideo.add(String(tid)));
      else ids.forEach((tid) => usedOnFilm.add(String(tid)));
    });

    const removedTagIds = new Set();
    const nextTags = [];
    tags.forEach((tag) => {
      if (!tag || typeof tag !== "object" || tag.id == null) return;
      const id = String(tag.id);
      const onFilm = usedOnFilm.has(id);
      const onVideo = usedOnVideo.has(id);
      const scope = tagScopeOf(tag);
      if (scope === "video" || (onVideo && !onFilm)) {
        removedTagIds.add(id);
        return;
      }
      const copy = Object.assign({}, tag, { scope: "film" });
      nextTags.push(copy);
    });

    const nextMap = {};
    Object.entries(map).forEach(([entityId, tagIds]) => {
      if (isVideoEntityId(entityId)) return;
      const cleaned = (Array.isArray(tagIds) ? tagIds : [])
        .map(String)
        .filter((tid) => !removedTagIds.has(tid));
      if (cleaned.length) nextMap[entityId] = cleaned;
    });

    saveJson(`${prefix}tags`, nextTags);
    saveJson(`${prefix}filmTags`, nextMap);
    saveJson(`${prefix}profileMeta`, Object.assign({}, meta, {
      tagsScopeMigrated: TAG_SCOPE_MIGRATION_VERSION,
    }));
  }

  function migrateTagsScopeIfNeeded() {
    if (!state.user || !state.profile) return;
    migrateTagsScopeForStorage(profileStoragePrefix(state.user.id, state.profile.id));
  }

  function migrateCastOrderForStorage(prefix) {
    if (!prefix) return;
    const meta = loadJson(`${prefix}profileMeta`, {});
    if (Number(meta.castOrderFixed) >= CAST_ORDER_MIGRATION_VERSION) return;
    const key = `${prefix}known`;
    const raw = loadJson(key, {});
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      saveJson(`${prefix}profileMeta`, Object.assign({}, meta, { castOrderFixed: CAST_ORDER_MIGRATION_VERSION }));
      return;
    }
    const next = Object.assign({}, raw);
    let changed = false;
    Object.keys(next).forEach((id) => {
      if (KNOWN_SYNC_META_KEYS.has(id)) return;
      const row = next[id];
      if (!row || typeof row !== "object") return;
      const canon = canonicalListFilmId(filmId(row));
      if (FILM_FALLBACK_CAST_IDS.has(canon)) return;
      if (!Array.isArray(row.cast) || !row.cast.length) return;
      const copy = Object.assign({}, row);
      delete copy.cast;
      next[id] = copy;
      changed = true;
    });
    if (changed) saveJson(key, next);
    saveJson(`${prefix}profileMeta`, Object.assign({}, meta, { castOrderFixed: CAST_ORDER_MIGRATION_VERSION }));
  }

  function migrateCastOrderIfNeeded() {
    if (!state.user || !state.profile) return;
    migrateCastOrderForStorage(profileStoragePrefix(state.user.id, state.profile.id));
    invalidateKnownFilmsCache();
  }

  function migrateCastOrderForUser(userId) {
    if (!userId) return;
    const profiles = loadJson(`wdq.profiles.${userId}`, []);
    (Array.isArray(profiles) ? profiles : []).forEach((prof) => {
      if (!prof || !prof.id) return;
      migrateCastOrderForStorage(profileStoragePrefix(userId, String(prof.id)));
    });
  }

  function migrateTagsScopeForUser(userId) {
    if (!userId) return;
    const profiles = loadJson(`wdq.profiles.${userId}`, []);
    (Array.isArray(profiles) ? profiles : []).forEach((prof) => {
      if (!prof || !prof.id) return;
      migrateTagsScopeForStorage(profileStoragePrefix(userId, String(prof.id)));
    });
  }

  function syncMetaKey(userId) {
    return `wdq.sync.meta.${userId}`;
  }

  function loadSyncMeta(userId) {
    return loadJson(syncMetaKey(userId), {
      version: 0,
      migrated: false,
      migrateLater: false,
      lastPullAt: 0,
    });
  }

  function saveSyncMeta(userId, meta) {
    saveJson(syncMetaKey(userId), meta);
  }

  function syncPendingKey(userId) {
    return `wdq.sync.pending.${userId}`;
  }

  function hasPendingSync(userId) {
    if (!userId) return false;
    return loadJson(syncPendingKey(userId), { pending: false }).pending === true;
  }

  function markPendingSync(userId, pending) {
    if (!userId) return;
    if (pending) saveJson(syncPendingKey(userId), { pending: true, at: Date.now() });
    else {
      try { localStorage.removeItem(syncPendingKey(userId)); } catch { /* ignore */ }
    }
  }

  function cloudSessionActive() {
    return Boolean(state.user && loadCloudSession() && loadCloudSession().token);
  }

  function isNetworkOnline() {
    return typeof navigator === "undefined" || navigator.onLine !== false;
  }

  function cloudStatusLabel(status) {
    if (status === "syncing") return "Synchronisiere …";
    if (status === "offline") return "Offline";
    if (status === "ok") return "Gesichert";
    return "";
  }

  function cloudStatusTitle(status) {
    if (status === "syncing") return "Synchronisiere …";
    if (status === "offline") return "Offline – wird später hochgeladen";
    if (status === "ok") return "Gesichert – alles online";
    return "";
  }

  function setCloudStatus(status) {
    const next = status || "hidden";
    if (state.cloudStatus === next) {
      paintCloudStatusBadge();
      return;
    }
    state.cloudStatus = next;
    paintCloudStatusBadge();
  }

  function cloudStatusHtml() {
    if (!cloudSessionActive()) return "";
    const status = state.cloudStatus;
    if (!status || status === "hidden") return "";
    const label = cloudStatusLabel(status);
    const title = cloudStatusTitle(status);
    return `<span class="cloud-status cloud-status--${status}" title="${title}" aria-live="polite" role="status"><span class="cloud-status-icon" aria-hidden="true">${ICONS.cloud}</span><span class="cloud-status-label">${label}</span></span>`;
  }

  function paintCloudStatusBadge() {
    if (!headerActions) return;
    let el = headerActions.querySelector("[data-role=cloud-status]");
    const html = cloudStatusHtml();
    if (!html) {
      if (el) el.remove();
      return;
    }
    const wrap = `<span data-role="cloud-status" class="cloud-status-slot">${html}</span>`;
    if (el) {
      el.outerHTML = wrap;
      return;
    }
    // Insert before account menu / logout / back cluster: prefer before .acct-slot
    const acct = headerActions.querySelector(".acct-slot");
    if (acct) {
      acct.insertAdjacentHTML("beforebegin", wrap);
      return;
    }
    headerActions.insertAdjacentHTML("afterbegin", wrap);
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function tsOf(value) {
    if (value == null) return 0;
    if (typeof value === "number" && Number.isFinite(value)) return value;
    const n = Date.parse(String(value));
    return Number.isFinite(n) ? n : 0;
  }

  function stampItem(item, fallbackTs) {
    if (!item || typeof item !== "object") return item;
    if (item.updatedAt) return item;
    const base = Number(item.at) || fallbackTs || Date.now();
    return Object.assign({}, item, { updatedAt: new Date(base).toISOString() });
  }

  function collectLocalSyncData(userId) {
    const fallback = Date.now();
    const profiles = loadJson(`wdq.profiles.${userId}`, []);
    const byProfile = {};
    const list = Array.isArray(profiles) ? profiles : [];
    list.forEach((prof) => {
      if (!prof || !prof.id) return;
      const pid = String(prof.id);
      const prefix = `wdq.p.${userId}.${pid}.`;
      const bag = {};
      SYNC_PROFILE_SUFFIXES.forEach((suf) => {
        const raw = localStorage.getItem(prefix + suf);
        if (raw == null) return;
        let parsed;
        try { parsed = JSON.parse(raw); } catch { parsed = raw; }
        if (suf === "ratings" && parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          const rich = loadJson(prefix + "ratingsSync", null);
          const src = rich && typeof rich === "object" ? rich : parsed;
          const next = {};
          Object.keys(Object.assign({}, parsed, rich || {})).forEach((id) => {
            const v = (rich && rich[id] !== undefined) ? rich[id] : parsed[id];
            if (v && typeof v === "object" && "value" in v) {
              next[id] = stampItem(v, fallback);
            } else {
              next[id] = { value: v, updatedAt: new Date(fallback).toISOString() };
            }
          });
          bag[suf] = next;
        } else if (suf === "known") {
          bag[suf] = normalizeKnownMap(parsed);
        } else if (Array.isArray(parsed)) {
          bag[suf] = parsed.map((row) => stampItem(row, fallback));
        } else if (parsed && typeof parsed === "object") {
          bag[suf] = stampItem(parsed, fallback);
        } else {
          bag[suf] = parsed;
        }
      });
      bag._tombstones = loadJson(prefix + "_tombstones", []);
      byProfile[pid] = bag;
    });
    return {
      format: "cinex-sync",
      version: 1,
      userId,
      profiles: list.map((p) => stampItem(p, fallback)),
      byProfile,
      collectedAt: nowIso(),
    };
  }

  function writeLocalSyncData(userId, data) {
    if (!data || !userId) return;
    const profiles = Array.isArray(data.profiles) ? data.profiles.filter((p) => p && !p.deleted) : [];
    saveJson(`wdq.profiles.${userId}`, profiles.map((p) => {
      const copy = Object.assign({}, p);
      // keep updatedAt for future merges; app tolerates extra fields
      return copy;
    }));
    const byProfile = data.byProfile || {};
    Object.keys(byProfile).forEach((pid) => {
      const bag = byProfile[pid] || {};
      const prefix = `wdq.p.${userId}.${pid}.`;
      SYNC_PROFILE_SUFFIXES.forEach((suf) => {
        if (!(suf in bag)) return;
        let value = bag[suf];
        if (suf === "ratings" && value && typeof value === "object" && !Array.isArray(value)) {
          const plain = {};
          Object.keys(value).forEach((id) => {
            const cell = value[id];
            if (cell && typeof cell === "object" && cell.deleted) return;
            if (cell && typeof cell === "object" && "value" in cell) plain[id] = cell.value;
            else plain[id] = cell;
          });
          saveJson(prefix + suf, plain);
          // keep rich map for merge fidelity
          saveJson(prefix + "ratingsSync", value);
        } else if (suf === "known") {
          saveJson(prefix + suf, normalizeKnownMap(value));
          invalidateKnownFilmsCache();
        } else if (Array.isArray(value)) {
          saveJson(prefix + suf, value.filter((row) => !(row && row.deleted)));
        } else if (value == null || (typeof value === "object" && value.deleted)) {
          localStorage.removeItem(prefix + suf);
        } else {
          saveJson(prefix + suf, value);
        }
      });
      if (Array.isArray(bag._tombstones)) saveJson(prefix + "_tombstones", bag._tombstones);
      migrateTagsScopeForStorage(prefix);
      migrateCastOrderForStorage(prefix);
    });
  }

  function itemKey(row, kind) {
    if (!row || typeof row !== "object") return null;
    if (kind === "tags" || kind === "profiles") return row.id != null ? String(row.id) : null;
    if (row.id != null) return String(row.id);
    return null;
  }

  function newerWins(a, b) {
    const ta = tsOf(a && a.updatedAt) || tsOf(a && a.at) || 0;
    const tb = tsOf(b && b.updatedAt) || tsOf(b && b.at) || 0;
    if (ta === tb) return b; // prefer remote on tie for stability after 409
    return ta > tb ? a : b;
  }

  function mergeArrayById(localArr, remoteArr, kind) {
    const map = new Map();
    (Array.isArray(localArr) ? localArr : []).forEach((row) => {
      const k = itemKey(row, kind);
      if (k != null) map.set(k, row);
    });
    (Array.isArray(remoteArr) ? remoteArr : []).forEach((row) => {
      const k = itemKey(row, kind);
      if (k == null) return;
      if (!map.has(k)) map.set(k, row);
      else map.set(k, newerWins(map.get(k), row));
    });
    const cutoff = Date.now() - SYNC_TOMBSTONE_MAX_MS;
    return [...map.values()].filter((row) => {
      if (!row || !row.deleted) return true;
      return tsOf(row.updatedAt) >= cutoff;
    });
  }

  function mergeRatings(localMap, remoteMap) {
    const out = {};
    const keys = new Set([
      ...Object.keys(localMap || {}),
      ...Object.keys(remoteMap || {}),
    ]);
    keys.forEach((id) => {
      const a = (localMap || {})[id];
      const b = (remoteMap || {})[id];
      const la = a && typeof a === "object" && "value" in a ? a : { value: a, updatedAt: nowIso() };
      const rb = b && typeof b === "object" && "value" in b ? b : (b === undefined ? null : { value: b, updatedAt: nowIso() });
      if (!rb) out[id] = la;
      else if (!a && a !== 0 && a !== false) out[id] = rb;
      else out[id] = newerWins(la, rb);
    });
    const cutoff = Date.now() - SYNC_TOMBSTONE_MAX_MS;
    Object.keys(out).forEach((id) => {
      if (out[id] && out[id].deleted && tsOf(out[id].updatedAt) < cutoff) delete out[id];
    });
    return out;
  }

  function mergeObjectsLww(localObj, remoteObj) {
    if (!localObj) return remoteObj || null;
    if (!remoteObj) return localObj;
    return newerWins(stampItem(localObj), stampItem(remoteObj));
  }

  const KNOWN_SYNC_META_KEYS = new Set(["updatedAt", "deleted", "id", "at"]);

  function normalizeKnownMap(raw) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
    const out = {};
    Object.entries(raw).forEach(([key, val]) => {
      if (KNOWN_SYNC_META_KEYS.has(key)) return;
      if (!val || typeof val !== "object" || Array.isArray(val)) return;
      const n = normalizeFilm(val);
      if (!n.id) return;
      out[filmId(n)] = n;
    });
    return out;
  }

  function knownEntryTs(film) {
    if (!film || typeof film !== "object") return 0;
    return tsOf(film.updatedAt) || tsOf(film.syncedAt) || 0;
  }

  function knownEntryRichness(film) {
    if (!film || typeof film !== "object") return 0;
    let score = 0;
    const title = String(film.title || "").trim();
    if (title && title !== "Lädt…") score += 10;
    if (film.poster) score += 8;
    if (Number(film.minutes || film.runtime) > 0) score += 4;
    if (Number(film.castOrderFixed) >= 1) {
      score += Math.min(filmCastNames(film).length, 4) * 2;
    }
    if (String(film.overview || "").trim()) score += 2;
    if (Array.isArray(film.genres) && film.genres.length) score += 1;
    return score;
  }

  function pickRicherKnownEntry(a, b) {
    if (!a) return b;
    if (!b) return a;
    const fixA = Number(a.castOrderFixed) >= 1;
    const fixB = Number(b.castOrderFixed) >= 1;
    if (fixA && !fixB) return a;
    if (fixB && !fixA) return b;
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

  function mergeKnownMaps(localRaw, remoteRaw) {
    const local = normalizeKnownMap(localRaw);
    const remote = normalizeKnownMap(remoteRaw);
    const out = Object.assign({}, local);
    Object.entries(remote).forEach(([id, remoteFilm]) => {
      if (!out[id]) out[id] = remoteFilm;
      else out[id] = pickRicherKnownEntry(out[id], remoteFilm);
    });
    const localCount = Object.keys(local).length;
    if (Object.keys(out).length < localCount) {
      Object.entries(local).forEach(([id, film]) => {
        if (!out[id]) out[id] = film;
        else out[id] = pickRicherKnownEntry(film, out[id]);
      });
    }
    return out;
  }

  function mergeProfileBags(localBag, remoteBag) {
    const a = localBag || {};
    const b = remoteBag || {};
    const out = {};
    const listKeys = ["watchlist", "queue", "history", "tags", "videoWatchlist", "videoQueue", "videoHistory"];
    listKeys.forEach((k) => {
      out[k] = mergeArrayById(a[k], b[k], k === "tags" ? "tags" : "list");
    });
    out.known = mergeKnownMaps(a.known, b.known);
    out.ratings = mergeRatings(a.ratings, b.ratings);
    // filmTags is a map id->tagIds[]; merge keys LWW per film id
    if ((a.filmTags && typeof a.filmTags === "object") || (b.filmTags && typeof b.filmTags === "object")) {
      const fa = a.filmTags || {};
      const fb = b.filmTags || {};
      // If stored as stamped wrapper with id, unwrap
      const ua = fa.id === "filmTags" ? Object.assign({}, fa) : fa;
      const ub = fb.id === "filmTags" ? Object.assign({}, fb) : fb;
      delete ua.id; delete ua.updatedAt; delete ua.deleted;
      delete ub.id; delete ub.updatedAt; delete ub.deleted;
      // Prefer richer merge: per-key, if both arrays take remote if we can't compare — keep union of tag ids when both present without timestamps
      const keys = new Set([...Object.keys(ua), ...Object.keys(ub)]);
      const merged = {};
      keys.forEach((id) => {
        const va = ua[id];
        const vb = ub[id];
        if (Array.isArray(va) && Array.isArray(vb)) {
          merged[id] = [...new Set([...va, ...vb].map(String))];
        } else {
          merged[id] = vb !== undefined ? vb : va;
        }
      });
      const migA = Number((a.profileMeta || {}).tagsScopeMigrated) || 0;
      const migB = Number((b.profileMeta || {}).tagsScopeMigrated) || 0;
      if (Math.max(migA, migB) >= TAG_SCOPE_MIGRATION_VERSION) {
        Object.keys(merged).forEach((id) => {
          if (isVideoEntityId(id)) delete merged[id];
        });
      }
      out.filmTags = merged;
    }
    out.profileMeta = (() => {
      const ma = a.profileMeta && typeof a.profileMeta === "object" ? a.profileMeta : {};
      const mb = b.profileMeta && typeof b.profileMeta === "object" ? b.profileMeta : {};
      const merged = Object.assign({}, ma, mb);
      merged.tagsScopeMigrated = Math.max(Number(ma.tagsScopeMigrated) || 0, Number(mb.tagsScopeMigrated) || 0);
      merged.castOrderFixed = Math.max(Number(ma.castOrderFixed) || 0, Number(mb.castOrderFixed) || 0);
      return merged;
    })();
    out.tagCovers = (() => {
      const ta = a.tagCovers || {};
      const tb = b.tagCovers || {};
      return Object.assign({}, ta, tb);
    })();
    const zufallMerged = mergeObjectsLww(a.zufallFilters, b.zufallFilters);
    if (zufallMerged != null) out.zufallFilters = zufallMerged;
    const favoriteMerged = mergeObjectsLww(a.favorite, b.favorite);
    if (favoriteMerged != null) out.favorite = favoriteMerged;
    const hintMerged = mergeObjectsLww(a.watchSwipeHint, b.watchSwipeHint);
    if (hintMerged != null) out.watchSwipeHint = hintMerged;
    out._tombstones = mergeArrayById(a._tombstones, b._tombstones, "list");
    return out;
  }

  function mergeSyncData(localData, remoteData) {
    if (!remoteData || remoteData.data == null) return localData;
    const remote = remoteData.data && remoteData.data.format === "cinex-sync"
      ? remoteData.data
      : remoteData.data;
    // Accept legacy opaque shapes: if remote is not cinex-sync, prefer newer whole-blob by updatedAt
    if (!remote || remote.format !== "cinex-sync") {
      if (!localData) return remote;
      return localData;
    }
    if (!localData || localData.format !== "cinex-sync") return remote;
    const profiles = mergeArrayById(localData.profiles, remote.profiles, "profiles")
      .filter((p) => p && !p.deleted);
    const pids = new Set([
      ...Object.keys(localData.byProfile || {}),
      ...Object.keys(remote.byProfile || {}),
      ...profiles.map((p) => String(p.id)),
    ]);
    const byProfile = {};
    pids.forEach((pid) => {
      byProfile[pid] = mergeProfileBags(
        (localData.byProfile || {})[pid],
        (remote.byProfile || {})[pid]
      );
    });
    return {
      format: "cinex-sync",
      version: 1,
      userId: localData.userId || remote.userId,
      profiles,
      byProfile,
      collectedAt: nowIso(),
    };
  }

  function accountHasLocalData(userId) {
    if (!userId) return false;
    const profiles = loadJson(`wdq.profiles.${userId}`, []);
    if (Array.isArray(profiles) && profiles.length) return true;
    const prefix = `wdq.p.${userId}.`;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) return true;
    }
    return false;
  }

  async function pullCloudData(token) {
    const { ok, status, data } = await syncApi("/data", { method: "GET", token });
    if (!ok) throw new Error((data && data.error) || `GET /data failed (${status})`);
    return data; // { version, updatedAt, data }
  }

  async function pushCloudData(token, baseVersion, payload) {
    const { ok, status, data } = await syncApi("/data", {
      method: "PUT",
      token,
      body: { baseVersion, data: payload },
    });
    return { ok, status, data };
  }

  async function syncAccount(user, { forceUpload = false, reason = "manual" } = {}) {
    const session = loadCloudSession();
    if (!session || !session.token || !user) return { ok: false, reason: "no-session" };
    if (!isNetworkOnline()) {
      markPendingSync(user.id, true);
      setCloudStatus("offline");
      return { ok: false, reason: "offline" };
    }
    if (state._syncInFlight) {
      state._syncDirtyDuringFlight = true;
      markPendingSync(user.id, true);
      return { ok: false, reason: "busy" };
    }
    state._syncInFlight = true;
    state._syncDirtyDuringFlight = false;
    setCloudStatus("syncing");
    try {
      const local = collectLocalSyncData(user.id);
      let remote = await pullCloudData(session.token);
      let merged = forceUpload && (remote.data == null)
        ? local
        : mergeSyncData(local, remote);
      if (forceUpload && remote.data == null) merged = local;
      let baseVersion = Number(remote.version) || 0;
      for (let attempt = 0; attempt < 3; attempt++) {
        const put = await pushCloudData(session.token, baseVersion, merged);
        if (put.ok) {
          writeLocalSyncData(user.id, merged);
          const meta = loadSyncMeta(user.id);
          meta.version = put.data.version;
          meta.lastPullAt = Date.now();
          meta.migrated = true;
          saveSyncMeta(user.id, meta);
          const moreSoon = Boolean(state._syncTimer) || state._syncDirtyDuringFlight;
          if (moreSoon) {
            markPendingSync(user.id, true);
            setCloudStatus("syncing");
          } else {
            markPendingSync(user.id, false);
            setCloudStatus("ok");
          }
          return { ok: true, version: put.data.version, reason };
        }
        if (put.status === 409 && put.data && put.data.current) {
          remote = put.data.current;
          merged = mergeSyncData(merged, remote);
          baseVersion = Number(remote.version) || 0;
          continue;
        }
        throw new Error((put.data && put.data.error) || `PUT /data failed (${put.status})`);
      }
      throw new Error("Sync-Konflikt: bitte erneut versuchen.");
    } catch (err) {
      const msg = String(err && err.message || err || "");
      const offlineish = !isNetworkOnline()
        || /Failed to fetch|NetworkError|Load failed|network/i.test(msg);
      markPendingSync(user.id, true);
      if (offlineish) {
        setCloudStatus("offline");
        return { ok: false, reason: "offline", error: msg };
      }
      setCloudStatus("offline");
      throw err;
    } finally {
      const dirty = state._syncDirtyDuringFlight;
      state._syncInFlight = false;
      state._syncDirtyDuringFlight = false;
      if (dirty && user && isNetworkOnline() && !state._syncTimer) {
        scheduleDebouncedSync();
      }
    }
  }

  async function loadCloudIntoLocal(user) {
    const session = loadCloudSession();
    if (!session || !session.token) return false;
    const remote = await pullCloudData(session.token);
    if (remote.data == null) return false;
    const payload = remote.data.format === "cinex-sync" ? remote.data : remote.data;
    if (payload && payload.format === "cinex-sync") {
      writeLocalSyncData(user.id, payload);
    } else if (payload && payload.format === "cinex-backup" && payload.keys) {
      importAccountBackupObject(payload);
    } else if (payload && typeof payload === "object") {
      // unknown blob: ignore
      return false;
    }
    const meta = loadSyncMeta(user.id);
    meta.version = Number(remote.version) || 0;
    meta.lastPullAt = Date.now();
    meta.migrated = true;
    saveSyncMeta(user.id, meta);
    return true;
  }

  function markTombstone(userId, profileId, kind, id) {
    if (!userId || !profileId || id == null) return;
    const key = `wdq.p.${userId}.${profileId}._tombstones`;
    const list = loadJson(key, []);
    const row = { id: String(id), kind, deleted: true, updatedAt: nowIso(), at: Date.now() };
    const next = list.filter((r) => !(r && String(r.id) === String(id) && r.kind === kind));
    next.push(row);
    saveJson(key, next);
  }

  function scheduleDebouncedSync() {
    if (!state.user || !loadCloudSession()) return;
    markPendingSync(state.user.id, true);
    if (state._syncInFlight) {
      state._syncDirtyDuringFlight = true;
      return;
    }
    if (!isNetworkOnline()) {
      setCloudStatus("offline");
      return;
    }
    if (state._syncTimer) return;
    state._syncTimer = setTimeout(() => {
      state._syncTimer = null;
      syncAccount(state.user, { reason: "change" }).catch((err) => {
        console.warn("cloud sync", err);
      });
    }, SYNC_PUSH_DEBOUNCE_MS);
  }

  async function flushPendingSync(reason = "flush") {
    if (!state.user || !loadCloudSession()) return;
    if (!isNetworkOnline()) {
      setCloudStatus("offline");
      return;
    }
    if (!hasPendingSync(state.user.id) && state.cloudStatus === "ok") return;
    try {
      await syncAccount(state.user, { reason });
    } catch (err) {
      console.warn("cloud flush", err);
    }
  }

  function startCloudPullInterval() {
    if (state._syncPullInterval) return;
    state._syncPullInterval = window.setInterval(() => {
      if (!cloudSessionActive() || document.visibilityState !== "visible") return;
      if (!isNetworkOnline() || state._syncInFlight) return;
      syncAccount(state.user, { reason: "periodic" }).catch((err) => {
        console.warn("cloud periodic sync", err);
      });
    }, SYNC_PULL_INTERVAL_MS);
  }

  function bindCloudLifecycle() {
    if (state._cloudLifeBound) return;
    state._cloudLifeBound = true;
    startCloudPullInterval();
    window.addEventListener("online", () => {
      if (!cloudSessionActive()) return;
      flushPendingSync("online");
    });
    window.addEventListener("offline", () => {
      if (!cloudSessionActive()) return;
      markPendingSync(state.user.id, true);
      setCloudStatus("offline");
    });
    document.addEventListener("visibilitychange", () => {
      if (!cloudSessionActive()) return;
      if (document.visibilityState === "hidden") {
        if (state._syncTimer) {
          clearTimeout(state._syncTimer);
          state._syncTimer = null;
        }
        flushPendingSync("hidden");
        return;
      }
      if (!state._syncInFlight && !state._syncTimer) {
        syncAccount(state.user, { reason: "visible" }).catch((err) => {
          console.warn("cloud visible sync", err);
        });
      }
    });
    window.addEventListener("pagehide", () => {
      if (!cloudSessionActive()) return;
      if (state._syncTimer) {
        clearTimeout(state._syncTimer);
        state._syncTimer = null;
      }
      flushPendingSync("pagehide");
    });
    window.addEventListener("pageshow", () => {
      if (!cloudSessionActive()) return;
      if (!state._syncInFlight && !state._syncTimer) {
        syncAccount(state.user, { reason: "pageshow" }).catch((err) => {
          console.warn("cloud pageshow sync", err);
        });
      }
    });
  }

  function showMigrateDialog() {
    state.migrateDialog = true;
    render();
  }

  function hideMigrateDialog() {
    state.migrateDialog = false;
  }

  async function runMigrationUpload() {
    const user = state.user;
    if (!user) return;
    state.migrateBusy = true;
    render();
    try {
      // auto backup before upload
      const backup = collectAccountBackup(user);
      const stamp = new Date().toISOString().slice(0, 10);
      const safe = String(user.login).replace(/[^\w.-]+/g, "_");
      downloadJsonFile(`cinex-backup-${safe}-${stamp}.json`, backup);
      try {
        saveJson(`wdq.backup.${stamp}.${user.id}`, { at: Date.now(), login: user.login, reason: "pre-migrate" });
      } catch { /* ignore */ }
      await syncAccount(user, { forceUpload: true });
      const meta = loadSyncMeta(user.id);
      meta.migrated = true;
      meta.migrateLater = false;
      saveSyncMeta(user.id, meta);
      hideMigrateDialog();
      showSnack("Filme online übernommen.");
    } catch (err) {
      showSnack(err && err.message ? err.message : "Hochladen fehlgeschlagen.");
    } finally {
      state.migrateBusy = false;
      render();
    }
  }

  function deferMigration() {
    // Später: nur diese Sitzung überspringen; beim nächsten Start wieder anbieten
    hideMigrateDialog();
    render();
  }

  async function afterCloudAuth(user) {
    const meta = loadSyncMeta(user.id);
    const hasLocal = accountHasLocalData(user.id);
    bindCloudLifecycle();
    if (!isNetworkOnline()) {
      markPendingSync(user.id, true);
      setCloudStatus("offline");
    } else if (hasPendingSync(user.id)) {
      setCloudStatus("syncing");
    } else {
      setCloudStatus("syncing");
    }
    try {
      const session = loadCloudSession();
      const remote = session && session.token ? await pullCloudData(session.token) : null;
      const cloudEmpty = !remote || remote.data == null;
      if (hasLocal && (cloudEmpty || !meta.migrated)) {
        // migrateLater not persisted — always re-offer until migrated
        state.migrateDialog = true;
        setCloudStatus(hasPendingSync(user.id) || !isNetworkOnline() ? "offline" : "ok");
        return;
      }
      if (!hasLocal && remote && remote.data != null) {
        await loadCloudIntoLocal(user);
        markPendingSync(user.id, false);
        setCloudStatus("ok");
        showSnack("Daten aus der Cloud geladen.");
        return;
      }
      if (hasLocal && remote && remote.data != null) {
        await syncAccount(user, { reason: "start" });
        return;
      }
      setCloudStatus(isNetworkOnline() ? "ok" : "offline");
    } catch (err) {
      // keep local session; soft fail
      console.warn("cloud afterAuth", err);
      const offlineish = !isNetworkOnline() || /Failed to fetch|NetworkError|Load failed|network/i.test(String(err && err.message || err || ""));
      if (offlineish) {
        markPendingSync(user.id, true);
        setCloudStatus("offline");
      }
    }
  }


  const PLATE_IDS = ["hell", "schwarz", "hell-lava", "schwarz-lava"];
  const DEFAULT_PLATE = "schwarz-lava";
  const PLATE_CHOICES = [
    { id: "hell", label: "Hell" },
    { id: "schwarz", label: "Schwarz" },
    { id: "hell-lava", label: "Hell", sub: "Lava" },
    { id: "schwarz-lava", label: "Schwarz", sub: "Lava" },
  ];
  const TAG_PLATE_CHOICES = [
    { id: "hell", label: "Hell" },
    { id: "schwarz", label: "Schwarz" },
    { id: "hell-lava", label: "Hell", sub: "Lava-Buchstaben" },
    { id: "schwarz-lava", label: "Schwarz", sub: "Lava-Buchstaben" },
  ];

  function normalizePlate(value) {
    return PLATE_IDS.includes(value) ? value : DEFAULT_PLATE;
  }

  function normalizeTagPlate(value) {
    return PLATE_IDS.includes(value) ? value : "hell";
  }

  function normalizeCover(value) {
    if (!value || typeof value !== "object") return null;
    const id = value.id != null && value.id !== "" ? String(value.id) : "";
    const title = value.title ? String(value.title) : "";
    const poster = value.poster ? String(value.poster) : "";
    if (!id && !title && !poster) return null;
    return { id, title, poster };
  }

  function coversEqual(a, b) {
    const left = normalizeCover(a);
    const right = normalizeCover(b);
    if (!left && !right) return true;
    if (!left || !right) return false;
    return left.id === right.id && left.title === right.title && left.poster === right.poster;
  }

  function profilesOf(userId) {
    const list = loadJson(`wdq.profiles.${userId}`, []);
    if (!userId || !Array.isArray(list)) return [];
    return migrateProfiles(userId, list);
  }

  function migrateProfiles(userId, list) {
    let changed = false;
    const next = list.map((row) => {
      if (!row || typeof row !== "object") return row;
      const plate = normalizePlate(row.plate);
      let cover = normalizeCover(row.cover);
      if (!cover && row.id) cover = normalizeCover(loadJson(`wdq.p.${userId}.${row.id}.favorite`, null));
      const plateChanged = row.plate !== plate;
      const coverChanged = !!cover && !coversEqual(row.cover, cover);
      if (!plateChanged && !coverChanged) return row;
      changed = true;
      const copy = Object.assign({}, row, { plate });
      if (cover) copy.cover = cover;
      return copy;
    });
    if (changed) saveProfiles(userId, next);
    return next;
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
    const syncMap = loadJson(pkey("ratingsSync"), {});
    syncMap[String(id)] = { value, updatedAt: nowIso() };
    saveJson(pkey("ratingsSync"), syncMap);
    scheduleDebouncedSync();
  }

  function watchlist() {
    return loadJson(pkey("watchlist"), []);
  }

  function saveWatchlist(list) {
    const now = nowIso();
    const stamped = (Array.isArray(list) ? list : []).map((row) => row && typeof row === "object" ? Object.assign({}, row, { updatedAt: row.updatedAt || now }) : row);
    saveJson(pkey("watchlist"), stamped);
    scheduleDebouncedSync();
  }

  // Demnächst core API
  // QueueRow = { id: string, at: number }
  // stored at pkey("queue") — copy into this list, never a move from watchlist.
  // ZufallSourceId = "watch" | "queue" | "rated" | `tag:${tagId}`
  // state.zufallSources = selected source ids (multi-select)
  // state.zufallOrigin = sources selected when the sheet opened (ember)
  function queue() {
    const rows = loadJson(pkey("queue"), []);
    if (!Array.isArray(rows)) return [];
    if (!state.user || !state.profile) return rows;
    const watchIds = new Set(watchlist().map((row) => String(row.id)));
    const next = rows.filter((row) => watchIds.has(String(row.id)));
    if (next.length !== rows.length) saveQueue(next);
    return next;
  }

  function saveQueue(list) {
    const now = nowIso();
    const stamped = (Array.isArray(list) ? list : []).map((row) => row && typeof row === "object" ? Object.assign({}, row, { updatedAt: row.updatedAt || now }) : row);
    saveJson(pkey("queue"), stamped);
    scheduleDebouncedSync();
  }

  function viewAtOf(entry) {
    if (entry == null) return NaN;
    if (typeof entry === "number") return Number(entry);
    if (typeof entry === "object") {
      const at = Number(entry.at);
      return Number.isFinite(at) && at > 0 ? at : NaN;
    }
    return NaN;
  }

  function viewFractionOf(entry) {
    if (entry == null) return 1;
    if (typeof entry === "number") return 1;
    if (typeof entry === "object") {
      const f = Number(entry.f);
      if (!Number.isFinite(f) || f <= 0) return 1;
      if (f >= 1) return 1;
      return Math.round(f * 10000) / 10000;
    }
    return 1;
  }

  function parseViewsList(row) {
    if (!row || typeof row !== "object") return [];
    let raw = [];
    if (Array.isArray(row.views) && row.views.length) raw = row.views.slice();
    else {
      const at = Number(row.at);
      if (Number.isFinite(at) && at > 0) raw = [at];
      else return [];
    }
    const detailed = raw
      .map((v) => ({ at: viewAtOf(v), f: viewFractionOf(v) }))
      .filter((v) => Number.isFinite(v.at) && v.at > 0);
    detailed.sort((a, b) => b.at - a.at);
    return detailed;
  }

  function compactViewsList(detailed) {
    return detailed
      .map(({ at, f }) => {
        if (!Number.isFinite(at) || at <= 0) return null;
        if (f >= 0.9999) return at;
        const pct = Math.round(f * 100);
        if (pct >= 100) return at;
        if (pct <= 0) return at;
        return { at, f: pct / 100 };
      })
      .filter(Boolean);
  }

  function historyViews(row) {
    return parseViewsList(row).map((v) => v.at);
  }

  function historyViewsDetailed(row) {
    return parseViewsList(row);
  }

  function history() {
    const rows = loadJson(pkey("history"), []);
    let changed = false;
    const next = rows.map((row) => {
      if (!row || typeof row !== "object") return row;
      if (Array.isArray(row.views) && row.views.length) return row;
      const at = Number(row.at);
      if (!Number.isFinite(at) || at <= 0) return row;
      changed = true;
      return Object.assign({}, row, { views: [at] });
    });
    if (changed) saveHistory(next);
    return changed ? next : rows;
  }

  function saveHistory(list) {
    const now = nowIso();
    const stamped = (Array.isArray(list) ? list : []).map((row) => row && typeof row === "object" ? Object.assign({}, row, { updatedAt: now }) : row);
    saveJson(pkey("history"), stamped);
    scheduleDebouncedSync();
  }

  function recordFilmWatched(film, at) {
    if (!film) return;
    const when = Number.isFinite(Number(at)) ? Number(at) : Date.now();
    const hid = filmId(film);
    const rows = history();
    const idx = rows.findIndex((row) => String(row.id) === hid);
    let entry;
    if (idx >= 0) {
      const prev = rows[idx];
      const views = compactViewsList([{ at: when, f: 1 }, ...parseViewsList(prev)]);
      entry = Object.assign({}, prev, { id: hid, title: film.title, at: when, views });
      rows.splice(idx, 1);
    } else {
      entry = { id: hid, title: film.title, at: when, views: [when] };
    }
    rows.unshift(entry);
    saveHistory(rows.slice(0, 300));
  }

  function removeLatestView(id) {
    const hid = String(filmId(id));
    const before = history();
    const idx = before.findIndex((row) => String(row.id) === hid);
    if (idx < 0) return null;
    const row = before[idx];
    const detailed = parseViewsList(row);
    const removedAt = detailed[0] ? detailed[0].at : NaN;
    const restViews = compactViewsList(detailed.slice(1));
    let next;
    if (!restViews.length) {
      next = before.filter((r) => String(r.id) !== hid);
    } else {
      const updated = Object.assign({}, row, { at: viewAtOf(restViews[0]), views: restViews });
      next = before.slice();
      next[idx] = updated;
    }
    saveHistory(next);
    return { before, removedAt, hid };
  }

  function formatSeenShort(at) {
    const d = new Date(Number(at));
    if (!Number.isFinite(d.getTime())) return "";
    return `${d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}.`;
  }

  function dateInputValueFromTs(ts) {
    const d = new Date(Number(ts));
    if (!Number.isFinite(d.getTime())) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function todayDateInputMax() {
    return dateInputValueFromTs(Date.now());
  }

  function tsFromDateInput(value, fallbackTs) {
    if (!value) return NaN;
    const parts = String(value).split("-").map((x) => Number(x));
    if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return NaN;
    const d = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0, 0);
    const ts = d.getTime();
    if (!Number.isFinite(ts)) return NaN;
    const fb = Number(fallbackTs);
    if (Number.isFinite(fb) && dateInputValueFromTs(fb) === value) {
      const orig = new Date(fb);
      d.setHours(orig.getHours(), orig.getMinutes(), orig.getSeconds(), orig.getMilliseconds());
      return d.getTime();
    }
    return ts;
  }

  function updateLatestViewEntry(id, newAt, newF, scope) {
    const isVideo = scope === "video";
    const hid = isVideo ? String(id) : String(filmId(id));
    const rows = isVideo ? videoHistory() : history();
    const save = isVideo ? saveVideoHistory : saveHistory;
    const idx = rows.findIndex((row) => String(row.id) === hid);
    if (idx < 0) return false;
    const row = rows[idx];
    const detailed = parseViewsList(row);
    if (!detailed.length) return false;
    const f = newF != null && Number.isFinite(Number(newF)) ? Math.min(1, Math.max(0.01, Number(newF))) : detailed[0].f;
    detailed[0] = { at: newAt, f };
    const views = compactViewsList(detailed);
    const updated = Object.assign({}, row, { at: newAt, views });
    const next = rows.slice();
    next[idx] = updated;
    save(next);
    return true;
  }

  function updateLatestViewDate(id, newAt) {
    return updateLatestViewEntry(id, newAt, null, "film");
  }

  // Videos Core API (separate per-profile storage, not mixed with films)
  function videoWatchlist() {
    return loadJson(pkey("videoWatchlist"), []);
  }

  function saveVideoWatchlist(list) {
    const now = nowIso();
    const stamped = (Array.isArray(list) ? list : []).map((row) => row && typeof row === "object" ? Object.assign({}, row, { updatedAt: row.updatedAt || now }) : row);
    saveJson(pkey("videoWatchlist"), stamped);
    scheduleDebouncedSync();
  }

  function videoQueue() {
    const rows = loadJson(pkey("videoQueue"), []);
    if (!Array.isArray(rows)) return [];
    if (!state.user || !state.profile) return rows;
    const watchIds = new Set(videoWatchlist().map((v) => String(v.id)));
    const next = rows.filter((v) => watchIds.has(String(v.id)));
    if (next.length !== rows.length) saveVideoQueue(next);
    return next;
  }

  function saveVideoQueue(list) {
    const now = nowIso();
    const stamped = (Array.isArray(list) ? list : []).map((row) => row && typeof row === "object" ? Object.assign({}, row, { updatedAt: row.updatedAt || now }) : row);
    saveJson(pkey("videoQueue"), stamped);
    scheduleDebouncedSync();
  }

  function videoHistory() {
    return loadJson(pkey("videoHistory"), []);
  }

  function saveVideoHistory(list) {
    const now = nowIso();
    const stamped = (Array.isArray(list) ? list : []).map((row) => row && typeof row === "object" ? Object.assign({}, row, { updatedAt: now }) : row);
    saveJson(pkey("videoHistory"), stamped);
    scheduleDebouncedSync();
  }

  function findVideo(id) {
    const hid = String(id || "");
    return videoWatchlist().find((v) => String(v.id) === hid) ||
           videoQueue().find((v) => String(v.id) === hid) ||
           videoHistory().find((v) => String(v.id) === hid) ||
           null;
  }

  function addVideoWatch(video) {
    if (!video || !video.id) return false;
    const list = videoWatchlist();
    if (list.some((v) => String(v.id) === String(video.id))) return false;
    list.unshift(video);
    saveVideoWatchlist(list);
    return true;
  }

  function addVideoQueue(video) {
    if (!video || !video.id) return false;
    addVideoWatch(video);
    const list = videoQueue();
    if (list.some((v) => String(v.id) === String(video.id))) return false;
    list.unshift(video);
    saveVideoQueue(list);
    return true;
  }

  function removeVideoQueueId(id) {
    const hid = String(id);
    const next = videoQueue().filter((v) => String(v.id) !== hid);
    if (next.length === videoQueue().length) return false;
    saveVideoQueue(next);
    return true;
  }

  function removeVideoFromWatchlist(id) {
    const hid = String(id);
    const before = videoWatchlist();
    const next = before.filter((v) => String(v.id) !== hid);
    const removed = next.length !== before.length;
    if (removed) saveVideoWatchlist(next);
    removeVideoQueueId(hid);
    return removed;
  }

  function removeVideoFromHistory(id) {
    const hid = String(id);
    const before = videoHistory();
    const next = before.filter((v) => String(v.id) !== hid);
    const removed = next.length !== before.length;
    if (removed) saveVideoHistory(next);
    return removed;
  }

  function videoHistoryViews(row) {
    return historyViews(row);
  }

  function videoHistoryViewsDetailed(row) {
    return historyViewsDetailed(row);
  }

  function recordVideoWatched(video, at) {
    if (!video || !video.id) return;
    const when = Number.isFinite(Number(at)) ? Number(at) : Date.now();
    const vid = String(video.id);
    const rows = videoHistory();
    const idx = rows.findIndex((v) => String(v.id) === vid);
    let entry;
    if (idx >= 0) {
      const prev = rows[idx];
      const views = compactViewsList([{ at: when, f: 1 }, ...parseViewsList(prev)]);
      entry = Object.assign({}, prev, video, { at: when, views });
      rows.splice(idx, 1);
    } else {
      entry = Object.assign({}, video, { at: when, views: [when] });
    }
    rows.unshift(entry);
    saveVideoHistory(rows);
  }

  function removeLatestVideoView(id) {
    const hid = String(id);
    const before = videoHistory();
    const idx = before.findIndex((v) => String(v.id) === hid);
    if (idx < 0) return null;
    const row = before[idx];
    const detailed = parseViewsList(row);
    const removedAt = detailed[0] ? detailed[0].at : NaN;
    const restViews = compactViewsList(detailed.slice(1));
    let next;
    if (!restViews.length) {
      next = before.filter((v) => String(v.id) !== hid);
    } else {
      const updated = Object.assign({}, row, { at: viewAtOf(restViews[0]), views: restViews });
      next = before.slice();
      next[idx] = updated;
    }
    saveVideoHistory(next);
    return { before, removedAt, hid };
  }

  function allKnownVideos() {
    const byId = new Map();
    [...videoWatchlist(), ...videoQueue(), ...videoHistory()].forEach((v) => {
      if (v && v.id) byId.set(String(v.id), v);
    });
    return Array.from(byId.values());
  }

  function countVideosWithTag(tagId) {
    const tag = customTags().find((row) => row.id === tagId);
    if (tag && tagScopeOf(tag) !== "video") return 0;
    const map = filmTags();
    let n = 0;
    for (const v of allKnownVideos()) {
      if ((map[String(v.id)] || []).includes(tagId)) n += 1;
    }
    return n;
  }

  function platLabelFromId(platId) {
    const id = String(platId || "");
    if (id === "yt") return "YouTube";
    if (id === "ig") return "Instagram";
    if (id === "fb") return "Facebook";
    if (id === "tiktok") return "TikTok";
    if (id === "vimeo") return "Vimeo";
    if (id === "twitch") return "Twitch";
    if (id === "netflix") return "Netflix";
    if (id === "prime") return "Prime Video";
    if (id === "disney") return "Disney+";
    if (id === "ard") return "ARD Mediathek";
    if (id === "zdf") return "ZDF Mediathek";
    return id || "Web";
  }

  function tagStarterCovers() {
    return TAG_STARTER_DEFS.map((def) => {
      const film = LOGIN_POSTERS.find((row) => row.id === def.id);
      const poster = film && film.poster ? film.poster : "";
      if (!poster) return null;
      return { id: def.id, title: def.title, poster };
    }).filter(Boolean);
  }

  function migrateTags(list) {
    const starters = tagStarterCovers();
    let changed = false;
    const next = list.map((tag, index) => {
      if (!tag || typeof tag !== "object") return tag;
      const plate = normalizeTagPlate(tag.plate);
      let cover = normalizeCover(tag.cover);
      if (!cover && starters.length) cover = starters[index % starters.length];
      const plateChanged = tag.plate !== plate;
      const coverChanged = !coversEqual(tag.cover, cover);
      if (!plateChanged && !coverChanged) return tag;
      changed = true;
      const copy = Object.assign({}, tag, { plate });
      if (cover) copy.cover = cover;
      return copy;
    });
    if (changed) saveTags(next);
    return next;
  }

  function customTags(scope) {
    const list = loadJson(pkey("tags"), []);
    if (!Array.isArray(list)) return [];
    const migrated = migrateTags(list);
    if (!scope) return migrated;
    return migrated.filter((tag) => tagScopeOf(tag) === scope);
  }

  function activeTagManageScope() {
    return state.tagManageScope === "video" ? "video" : "film";
  }

  function saveTags(list) {
    saveJson(pkey("tags"), list);
  }

  function tagCovers() {
    const list = loadJson(pkey("tagCovers"), []);
    if (!Array.isArray(list)) return [];
    const starters = new Set(tagStarterCovers().map((row) => row.id));
    const seen = new Set();
    const out = [];
    for (const row of list) {
      const cover = normalizeCover(row);
      if (!cover || !cover.poster) continue;
      if (cover.id && (starters.has(cover.id) || seen.has(cover.id))) continue;
      if (cover.id) seen.add(cover.id);
      out.push(cover);
    }
    return out;
  }

  function saveTagCovers(list) {
    saveJson(pkey("tagCovers"), list);
  }

  function filmTags() {
    const map = loadJson(pkey("filmTags"), {});
    return map && typeof map === "object" && !Array.isArray(map) ? map : {};
  }

  function saveFilmTags(map) {
    saveJson(pkey("filmTags"), map);
  }

  function tagsFor(filmId) {
    return filmTags()[String(filmId)] || [];
  }

  function seedIfNeeded() {
    const list = users();
    const hasTest = list.some((u) => u.login.toLowerCase() === "test");
    if (!hasTest) {
      list.push({ id: "u-test", login: "Test", password: "1234" });
      saveUsers(list);
      const profiles = [
        { id: "tester", name: "Tester", avatar: "av1", plate: "schwarz-lava" },
        { id: "user1", name: "User No 1", avatar: "av2", plate: "schwarz-lava" },
        { id: "bot", name: "Bot - Apptesti", avatar: "av3", plate: "schwarz-lava" },
      ];
      saveProfiles("u-test", profiles);
      const covers = tagStarterCovers();
      const tags = [
        { id: "tag-omma", name: "Omma", color: "#ef6c00", plate: "hell", cover: covers[0] },
        { id: "tag-kumpel", name: "Kumpel", color: "#0066B3", plate: "hell", cover: covers[1] || covers[0] },
        { id: "tag-relax", name: "entspannen", color: "#2e7d32", plate: "hell", cover: covers[2] || covers[0] },
      ];
      const prefix = "wdq.p.u-test.tester.";
      saveJson(`${prefix}tags`, tags);
      saveJson(`${prefix}watchlist`, FILMS.map((film, index) => ({
        id: film.id,
        at: Date.now() - ((FILMS.length - index) * 1000),
      })));
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
    const vPrefix = "wdq.p.u-test.tester.";
    if (!localStorage.getItem(`${vPrefix}videoWatchlist`)) {
      saveJson(`${vPrefix}videoWatchlist`, [
        { id: "v-seed-1", title: "Trailer: Dune Part Three", desc: "Offizieller Teaser – Sandstorm & Harkonnen", plat: "yt", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", at: Date.now() - 50000 },
        { id: "v-seed-2", title: "Behind the Scenes: Interstellar", desc: "Nolan erklärt die Docking-Szene", plat: "yt", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", at: Date.now() - 40000 },
        { id: "v-seed-3", title: "Reel: Filmabend Setup", desc: "Beamer, Snacks, Reihenfolge – 45 Sek.", plat: "ig", url: "https://www.instagram.com/reel/example", at: Date.now() - 30000 },
        { id: "v-seed-4", title: "Clip: Dark Knight Bankheist", desc: "Eröffnungsszene – kommentiert", plat: "fb", url: "https://www.facebook.com/watch/?v=example", at: Date.now() - 20000 },
        { id: "v-seed-5", title: "Top 10 Sci-Fi 2026", desc: "Countdown – was lohnt sich?", plat: "yt", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", at: Date.now() - 10000 },
        { id: "v-seed-6", title: "Story: Watchlist Tipps", desc: "Kurze Ideen für den nächsten Abend", plat: "ig", url: "https://www.instagram.com/reel/example2", at: Date.now() - 8000 },
        { id: "v-seed-7", title: "Panel: Film vs. Serie", desc: "Live-Mitschnitt aus der Gruppe", plat: "fb", url: "https://www.facebook.com/watch/?v=example2", at: Date.now() - 6000 },
      ]);
      saveJson(`${vPrefix}videoQueue`, [
        { id: "v-seed-5", title: "Top 10 Sci-Fi 2026", desc: "Countdown – was lohnt sich?", plat: "yt", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", at: Date.now() - 10000 },
        { id: "v-seed-6", title: "Story: Watchlist Tipps", desc: "Kurze Ideen für den nächsten Abend", plat: "ig", url: "https://www.instagram.com/reel/example2", at: Date.now() - 8000 },
        { id: "v-seed-7", title: "Panel: Film vs. Serie", desc: "Live-Mitschnitt aus der Gruppe", plat: "fb", url: "https://www.facebook.com/watch/?v=example2", at: Date.now() - 6000 },
      ]);
      saveJson(`${vPrefix}videoHistory`, [
        { id: "v-seed-h1", title: "Recap: Endgame", desc: "Plot-Punkte in 8 Minuten", plat: "yt", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", at: new Date(2026, 8, 28, 20, 15).getTime() },
        { id: "v-seed-h2", title: "Reel: Ranking der Woche", desc: "Unsere Top 3 – kurz & knapp", plat: "ig", url: "https://www.instagram.com/reel/example3", at: new Date(2026, 8, 25, 19, 30).getTime() },
        { id: "v-seed-h3", title: "Clip: LotR Extended", desc: "Fan-Edit Highlights", plat: "fb", url: "https://www.facebook.com/watch/?v=example3", at: new Date(2026, 8, 20, 21, 0).getTime() },
      ]);
    }
  }

  function restoreSession() {
    const session = loadJson("wdq.session", null);
    if (!session) return;
    const user = users().find((u) => u.id === session.userId);
    if (!user) return;
    state.user = user;
    const profile = profilesOf(user.id).find((p) => p.id === session.profileId) || null;
    state.profile = profile;
    invalidateKnownFilmsCache();
    migrateTagsScopeIfNeeded();
    migrateCastOrderIfNeeded();
    state.discoverView = "hub";
    if (profile) openWatchlistHome();
    else state.screen = "profiles";
  }

  function openWatchlistHome() {
    state.listTab = "watch";
    state.screen = "lists";
    state.discoverView = "hub";
    state.expandedFilmId = null;
    state.justWatchedId = null;
    state.pinJustWatched = false;
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

  let knownFilmsCache = null;
  let knownFilmsCacheKey = null;

  function invalidateKnownFilmsCache() {
    knownFilmsCache = null;
    knownFilmsCacheKey = null;
  }

  function loadKnownFilms() {
    const key = knownKey();
    if (!key) return {};
    if (knownFilmsCache && knownFilmsCacheKey === key) return knownFilmsCache;
    const raw = loadJson(key, {});
    knownFilmsCache = normalizeKnownMap(raw);
    knownFilmsCacheKey = key;
    return knownFilmsCache;
  }

  function writeKnownFilmsMap(all) {
    const key = knownKey();
    if (!key || !all) return;
    knownFilmsCache = all;
    knownFilmsCacheKey = key;
    saveJson(key, all);
  }

  function pickRuntime(next, prev) {
    const a = Number(next) || 0;
    const b = Number(prev) || 0;
    if (a && b && a === 120 && b !== 120) return b;
    return a || b;
  }

  function rememberFilm(film, options) {
    if (!film) return null;
    const n = normalizeFilm(film);
    if (!n.id) return null;
    const idx = state.catalog.findIndex((row) => filmId(row) === filmId(n));
    if (idx >= 0) {
      const prev = state.catalog[idx];
      const minutes = pickRuntime(n.minutes || n.runtime, prev.minutes || prev.runtime);
      state.catalog[idx] = normalizeFilm({
        ...prev,
        ...n,
        minutes,
        runtime: minutes,
        poster: n.poster || prev.poster,
        genres: n.genres && n.genres.length ? n.genres : prev.genres,
        cast: (n.cast && n.cast.length) ? n.cast : (prev.cast || []),
        castOrderFixed: Math.max(Number(n.castOrderFixed) || 0, Number(prev.castOrderFixed) || 0),
        year: n.year || prev.year,
        original_title: n.original_title || prev.original_title || "",
        aliases: uniqueAliasList([...(n.aliases || []), ...(prev.aliases || [])]),
        popularity: Math.max(Number(n.popularity) || 0, Number(prev.popularity) || 0),
        vote_count: Math.max(Number(n.vote_count) || 0, Number(prev.vote_count) || 0),
        providers: (n.providers && n.providers.length) ? n.providers : (prev.providers || []),
        overview: n.overview || prev.overview || "",
      });
    } else {
      state.catalog.push(n);
    }
    const stored = state.catalog.find((row) => filmId(row) === filmId(n)) || n;
    const persist = !options || options.persist !== false;
    if (persist && knownKey()) {
      const all = loadKnownFilms();
      all[canonicalListFilmId(filmId(stored))] = stored;
      writeKnownFilmsMap(all);
    }
    return stored;
  }

  function persistKnownFilms(films) {
    if (!knownKey() || !films || !films.length) return;
    const all = loadKnownFilms();
    let changed = false;
    for (const film of films) {
      if (!film || !film.id) continue;
      all[canonicalListFilmId(filmId(film))] = film;
      changed = true;
    }
    if (changed) writeKnownFilmsMap(all);
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
    const lists = [state.currentPicks, state.shortlist, state.searchHits, state.catalog, offlineFilms, FILMS, LOGIN_POSTERS];
    for (const list of lists) {
      const hit = (list || []).find(match);
      if (hit) return hit;
    }
    const known = loadKnownFilms();
    const canon = canonicalListFilmId(sid);
    const raw = known[canon] || known[sid] || known[`t${num}`] || known[String(num)];
    return raw ? normalizeFilm(raw) : null;
  }

  function listFilmsFromRows(rows) {
    return (Array.isArray(rows) ? rows : [])
      .map((row) => (row && row.id != null ? listFilmOrPlaceholder(row.id) : null))
      .filter(Boolean);
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

  function durationPill(film) {
    const m = Number((film && (film.runtime || film.minutes)) || 0);
    return m > 0 ? `${m} min` : "";
  }

  function filmCastLine(film) {
    let names = filmCastNames(film).slice(0, 3);
    if (!names.length && film) {
      const sid = filmId(film);
      const fallback = FILMS.find((row) => filmId(row) === sid);
      names = filmCastNames(fallback).slice(0, 3);
    }
    return names.join(", ");
  }

  function filmOverview(film) {
    const text = String((film && (film.overview || film.plot || film.tagline)) || "").trim();
    if (text) return text;
    const fallback = film && FILMS.find((row) => filmId(row) === filmId(film));
    return String((fallback && fallback.overview) || "").trim();
  }

  function clipPlot(text, max) {
    const t = String(text || "").replace(/\s+/g, " ").trim();
    const limit = max || 280;
    if (t.length <= limit) return t;
    return `${t.slice(0, limit - 1).replace(/\s+\S*$/, "").trim()}…`;
  }

  const castFetchTried = new Set();
  let listCastSeq = 0;

  async function enrichListCast(films) {
    const seq = ++listCastSeq;
    const pending = (films || []).filter((film) => {
      const id = filmId(film);
      if (!id || castFetchTried.has(id)) return false;
      if (isListFilmPlaceholder(film)) return false;
      if (filmCastNames(film).length) {
        castFetchTried.add(id);
        return false;
      }
      if (!film.tmdb) {
        castFetchTried.add(id);
        return false;
      }
      return true;
    });
    if (!pending.length) return;
    let changed = false;
    await Promise.all(pending.map(async (film) => {
      const id = filmId(film);
      castFetchTried.add(id);
      try {
        const data = await tmdbFetch(`/movie/${film.tmdb}/credits`);
        const names = (data.cast || [])
          .slice()
          .sort(sortCastByOrder)
          .map((row) => String(row.name || row.original_name || "").trim())
          .filter(Boolean)
          .slice(0, 3);
        if (names.length) {
          rememberFilm({ ...film, cast: names, castOrderFixed: 1 });
          changed = true;
        }
      } catch {
        /* keep empty cast line hidden */
      }
    }));
    if (changed && seq === listCastSeq) patchFilmCastLines();
  }

  function patchFilmCastLines() {
    document.querySelectorAll(".film-row[data-id]").forEach((row) => {
      if (row.hasAttribute("data-seen")) return;
      const film = findFilm(row.dataset.id);
      if (!film) return;
      const line = filmCastLine(film);
      let el = row.querySelector(".film-row-cast");
      if (!line) {
        if (el) el.remove();
        return;
      }
      if (el) {
        el.textContent = line;
        return;
      }
      const body = row.querySelector(".film-row-body");
      if (body) body.insertAdjacentHTML("beforeend", `<p class="film-row-cast">${escapeHtml(line)}</p>`);
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function hexToRgb(hex) {
    const raw = String(hex || "").replace("#", "");
    const full = raw.length === 3 ? raw.split("").map((c) => c + c).join("") : raw;
    const n = parseInt(full, 16);
    if (!Number.isFinite(n) || full.length !== 6) return { r: 0, g: 102, b: 179 };
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  function rgbToHsl(r, g, b) {
    const rr = r / 255;
    const gg = g / 255;
    const bb = b / 255;
    const max = Math.max(rr, gg, bb);
    const min = Math.min(rr, gg, bb);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    const d = max - min;
    if (d) {
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === rr) h = (gg - bb) / d + (gg < bb ? 6 : 0);
      else if (max === gg) h = (bb - rr) / d + 2;
      else h = (rr - gg) / d + 4;
      h *= 60;
    }
    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  function hexToHsl(hex) {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHsl(r, g, b);
  }

  function hslToHex(h, s, l) {
    const sat = s / 100;
    const light = l / 100;
    const a = sat * Math.min(light, 1 - light);
    const f = (n) => {
      const k = (n + h / 30) % 12;
      const color = light - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  function clampTagName(name) {
    return String(name || "").trim().slice(0, 10);
  }

  function avatarById(id) {
    const mapped = LEGACY_AVATAR_TO_EMOJI[id] || id;
    return EMOJI_AVATARS.find((row) => row.id === mapped) || null;
  }

  function avatarMarkup(id) {
    const emoji = avatarById(id);
    if (emoji) return `<span class="avatar avatar-emoji" aria-hidden="true">${emoji.emoji}</span>`;
    if (AVATARS[id]) return `<span class="avatar">${AVATARS[id]}</span>`;
    return `<span class="avatar avatar-emoji" aria-hidden="true">${EMOJI_AVATARS[0].emoji}</span>`;
  }

  function profileInitial(name) {
    const text = String(name || "").trim();
    for (const ch of Array.from(text)) {
      if (/[\p{L}\p{N}]/u.test(ch)) return ch.toLocaleUpperCase("de-DE");
    }
    return "?";
  }

  function favoriteRecord() {
    if (!state.user || !state.profile) return null;
    const saved = loadJson(pkey("favorite"), null);
    const cover = normalizeCover(saved);
    if (!cover || !cover.id) return null;
    const film = findFilm(cover.id);
    const title = (film && film.title) || cover.title || "";
    const poster = (film && film.poster) || cover.poster || "";
    if (!title && !poster) return null;
    return { id: cover.id, title, poster };
  }

  function activeCoverRecord() {
    const fromProfile = state.profile && normalizeCover(state.profile.cover);
    if (fromProfile && (fromProfile.poster || fromProfile.title)) return fromProfile;
    return favoriteRecord();
  }

  function profileCoverRecord(profile) {
    if (!profile) return null;
    const own = normalizeCover(profile.cover);
    if (own) return own;
    if (!state.user || !profile.id) return null;
    return normalizeCover(loadJson(`wdq.p.${state.user.id}.${profile.id}.favorite`, null));
  }

  function defaultFavoritePoster() {
    const row = LOGIN_POSTERS.find((film) => film.id === "t155") || LOGIN_POSTERS[0];
    return (row && row.poster) || INTERSTELLAR_POSTER;
  }

  function accountCoverSrc() {
    return coverSrcFrom(activeCoverRecord());
  }

  function coverSrcFrom(cover) {
    const row = normalizeCover(cover);
    const poster = row && row.poster ? row.poster : defaultFavoritePoster();
    return withPosterSize(poster, "w342") || poster;
  }

  function writeProfileCover(profileId, cover) {
    if (!state.user || !profileId) return;
    const nextCover = normalizeCover(cover);
    const list = profilesOf(state.user.id).map((row) => {
      if (row.id !== profileId) return row;
      const copy = Object.assign({}, row, { plate: normalizePlate(row.plate) });
      if (nextCover) copy.cover = nextCover;
      else delete copy.cover;
      return copy;
    });
    saveProfiles(state.user.id, list);
    const favKey = `wdq.p.${state.user.id}.${profileId}.favorite`;
    if (nextCover && nextCover.id) saveJson(favKey, nextCover);
    else localStorage.removeItem(favKey);
    if (state.profile && state.profile.id === profileId) {
      state.profile = list.find((row) => row.id === profileId) || state.profile;
    }
  }

  function saveFavorite(film) {
    if (!film || !state.user || !state.profile) return;
    const poster = posterUrl(film, "w342") || film.poster || "";
    writeProfileCover(state.profile.id, {
      id: filmId(film),
      title: film.title || "",
      poster,
    });
  }

  function isFavoriteFilm(film) {
    const fav = activeCoverRecord();
    return !!(fav && film && fav.id && fav.id === filmId(film));
  }

  function favoriteButtonHtml(film) {
    const on = isFavoriteFilm(film);
    return `<div class="film-expand-fav"><button type="button" class="btn btn-compact fav-btn${on ? " is-on" : ""}" data-act="set-favorite" data-id="${escapeHtml(filmId(film))}" aria-pressed="${on ? "true" : "false"}">Lieblingsfilm</button></div>`;
  }

  function accountPlateHtml(largeOrOpts) {
    const opts = largeOrOpts && typeof largeOrOpts === "object" ? largeOrOpts : { large: !!largeOrOpts };
    const plate = normalizePlate(opts.plate != null ? opts.plate : (state.profile && state.profile.plate));
    const letter = escapeHtml(opts.letter != null ? opts.letter : profileInitial(opts.name != null ? opts.name : (state.profile && state.profile.name)));
    const src = escapeHtml(opts.cover !== undefined ? coverSrcFrom(opts.cover) : accountCoverSrc());
    const lava = plate === "hell-lava" || plate === "schwarz-lava";
    const size = opts.size ? ` is-${opts.size}` : (opts.large ? " is-lg" : "");
    return `
      <span class="acct-plate is-${plate}${lava ? " is-lava" : ""}${size}">
        ${lava ? `<span class="acct-wave" aria-hidden="true"></span>` : ""}
        <span class="acct-letter" aria-hidden="true">
          <span class="acct-letter-rim">${letter}</span>
          <span class="acct-letter-fill" data-cover="${src}">${letter}</span>
        </span>
      </span>
    `;
  }

  function profilePlateHtml(profile, size) {
    return accountPlateHtml({
      plate: profile && profile.plate,
      letter: profileInitial(profile && profile.name),
      cover: profileCoverRecord(profile),
      size: size || "row",
    });
  }

  function accountMenuHtml() {
    const name = state.profile ? state.profile.name : "";
    const fav = activeCoverRecord();
    const filmLine = fav && fav.title
      ? `<span class="acct-menu-film">${escapeHtml(fav.title)}</span>`
      : "";
    return `
      <div class="acct-slot">
        <button type="button" class="acct-btn" data-act="account-menu" aria-haspopup="menu" aria-expanded="false" aria-label="Konto ${escapeHtml(name)}">
          ${accountPlateHtml(false)}
        </button>
        <div class="acct-menu" role="menu" aria-label="Konto" hidden>
          <div class="acct-menu-head">
            ${accountPlateHtml(true)}
            <div class="acct-menu-id">
              <strong>${escapeHtml(name)}</strong>
              ${filmLine}
            </div>
          </div>
          <div class="acct-menu-items">
            <button type="button" class="acct-menu-item" role="menuitem" data-act="account-switch">
              <span class="acct-menu-ico" aria-hidden="true">${ICONS.swap}</span>
              <span>Benutzer wechseln</span>
            </button>
            <button type="button" class="acct-menu-item" role="menuitem" data-act="account-settings">
              <span class="acct-menu-ico" aria-hidden="true">${ICONS.gear}</span>
              <span>Einstellungen</span>
            </button>
            <button type="button" class="acct-menu-item is-danger" role="menuitem" data-act="account-logout">
              <span class="acct-menu-ico" aria-hidden="true">${ICONS.logout}</span>
              <span>Ausloggen</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function bindAccountCovers(root) {
    const scope = root || headerActions;
    if (!scope) return;
    scope.querySelectorAll(".acct-letter-fill[data-cover], .tag-chip-fill[data-cover]").forEach((el) => {
      if (el.dataset.coverBound === "1") return;
      el.dataset.coverBound = "1";
      const src = el.dataset.cover || "";
      const plate = el.closest(".acct-plate, .tag-chip");
      if (!src) {
        if (plate) plate.classList.add("is-fallback");
        return;
      }
      const img = new Image();
      img.referrerPolicy = "no-referrer";
      img.decoding = "async";
      img.onload = () => {
        el.style.backgroundImage = `url("${src.replace(/["\\\n\r()]/g, "")}")`;
        el.classList.add("is-ready");
      };
      img.onerror = () => {
        if (plate) plate.classList.add("is-fallback");
      };
      img.src = src;
    });
  }

  function countFilmsWithTag(tagId) {
    const tag = customTags().find((row) => row.id === tagId);
    if (tag && tagScopeOf(tag) !== "film") return 0;
    const map = filmTags();
    let n = 0;
    for (const [id, ids] of Object.entries(map)) {
      if (isVideoEntityId(id)) continue;
      if ((ids || []).includes(tagId)) n += 1;
    }
    return n;
  }

  function sortedTags(scope) {
    const useScope = scope === "video" ? "video" : "film";
    const countFn = useScope === "video" ? countVideosWithTag : countFilmsWithTag;
    return customTags(useScope).slice().sort((a, b) => {
      const diff = countFn(b.id) - countFn(a.id);
      if (diff) return diff;
      return String(a.name).localeCompare(b.name, "de", { sensitivity: "base" });
    });
  }

  function renderTagsScopeHint(scope) {
    return "";
  }

  function tagPillHtml(tag) {
    return tagChipHtml(tag, { size: "mini" });
  }

  function colorSpectrumHtml(scope, hex) {
    const hsl = hexToHsl(hex || "#0066B3");
    const sat = Math.max(25, hsl.s || 100);
    return `
      <div class="color-spectrum" data-spectrum="${scope}">
        <input class="spectrum-slider spectrum-hue" data-act="spectrum-hue" data-scope="${scope}" type="range" min="0" max="360" value="${hsl.h}" aria-label="Farbton">
        <input class="spectrum-slider spectrum-sat" data-act="spectrum-sat" data-scope="${scope}" type="range" min="25" max="100" value="${sat}" style="--hue:${hsl.h}" aria-label="Sättigung">
      </div>
    `;
  }

  function onSpectrumInput(el) {
    const scope = el.dataset.scope;
    const root = scope === "add" ? modalEl : app;
    const hueEl = root.querySelector(`[data-act=spectrum-hue][data-scope="${scope}"]`);
    const satEl = root.querySelector(`[data-act=spectrum-sat][data-scope="${scope}"]`);
    if (!hueEl || !satEl) return;
    const hue = Number(hueEl.value);
    const sat = Number(satEl.value);
    const prev = hexToHsl(scope === "edit" ? state.editTagColor : state.newTagColor);
    const light = prev.l >= 22 && prev.l <= 58 ? prev.l : 35;
    const hex = hslToHex(hue, sat, light);
    satEl.style.setProperty("--hue", String(hue));
    if (scope === "add") {
      state.newTagColor = hex;
      return;
    }
    state.editTagColor = hex;
    const pill = app.querySelector(`[data-tag-card="${state.tagEditId}"] .tag-pill`);
    if (pill) pill.style.setProperty("--tag-color", hex);
  }

  const SNACK_MARK = {
    success: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="var(--blue)"/><path d="M7.1 12.3 10.3 15.5 17.1 8.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    danger: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#d64545"/><path d="M8.2 8.2 15.8 15.8M15.8 8.2 8.2 15.8" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`,
    warn: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#2f5f86"/><text x="12" y="16.5" text-anchor="middle" fill="#fff" font-size="13" font-weight="800" font-family="system-ui,sans-serif">i</text></svg>`,
    info: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#2f5f86"/><text x="12" y="16.5" text-anchor="middle" fill="#fff" font-size="13" font-weight="800" font-family="system-ui,sans-serif">i</text></svg>`,
  };

  function snackKind(tone) {
    if (tone === "danger") return "danger";
    if (tone === "warn" || tone === "warning") return "warn";
    if (tone === "info") return "info";
    return "success";
  }

  function hideSnack() {
    window.clearTimeout(showSnack.tid);
    showSnack.undoFn = null;
    snackbar.hidden = true;
    snackbar.classList.remove("is-danger", "is-warn", "is-info", "is-context");
    document.body.classList.remove("snack-on");
  }

  function showSnack(text, tone, extras) {
    const kind = snackKind(tone);
    const tags = extras && extras.tags ? extras.tags : [];
    const undoFn = extras && extras.undo ? extras.undo : null;
    const duration = (extras && extras.duration) || (undoFn ? 5000 : 2600);
    snackbar.hidden = false;
    snackbar.classList.toggle("is-danger", kind === "danger");
    snackbar.classList.toggle("is-warn", kind === "warn");
    snackbar.classList.toggle("is-info", kind === "info");
    snackbar.classList.toggle("is-context", !!(extras && extras.context));
    document.body.classList.add("snack-on");
    const tagsHtml = tags.length
      ? `<span class="snackbar-tags">${tags.map((tag) => `<span class="snackbar-tag">${escapeHtml(tag)}</span>`).join("")}</span>`
      : "";
    const actionHtml = undoFn
      ? `<button type="button" class="snackbar-action" data-act="snack-undo">Rückgängig</button>`
      : "";
    snackbar.innerHTML = `<span class="snackbar-mark" aria-hidden="true">${SNACK_MARK[kind]}</span><span class="snackbar-text">${escapeHtml(text)}</span>${tagsHtml}${actionHtml}`;
    showSnack.undoFn = undoFn;
    window.clearTimeout(showSnack.tid);
    showSnack.tid = window.setTimeout(hideSnack, duration);
  }

  let pendingSwipeRemove = null;

  function closeModal() {
    pendingSwipeRemove = null;
    state.seenDateEditId = "";
    modalEl.classList.remove("is-bottom");
    modalEl.hidden = true;
    modalEl.innerHTML = "";
  }

  function openModal(html, opts) {
    modalEl.hidden = false;
    modalEl.classList.toggle("is-bottom", !!(opts && opts.bottom));
    modalEl.innerHTML = html;
  }

  function resetSessionPicks() {
    state.sessionBlocked = new Set();
    state.sessionSkip = new Set();
    state.sessionSuggestGenres = new Set();
    state.directionSeeds = [];
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

  function filterFitScore(film) {
    let score = 0;
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
    if (state.filters.streaming.length) {
      const have = Array.isArray(film.providers) ? film.providers : film.streaming;
      if (Array.isArray(have) && have.length) {
        const match = state.filters.streaming.some((id) => have.includes(id));
        score += match ? 1.6 : -0.15;
      }
    }
    if (state.filters.types.length && filmMatchesType(film)) score += 1.4;
    if (state.filters.actors.length && filmMatchesActors(film)) score += 2.4;
    if ((state.filters.similar || []).length) {
      const similar = filmSimilarScore(film);
      if (similar > 0) {
        score += similar * 3;
        if (SIMILAR_CURATED_IDS.has(filmId(film))) score += 6.2;
      }
    }
    return score;
  }

  function directionBias(film) {
    const seeds = state.directionSeeds || [];
    if (!seeds.length || !film) return 0;
    const id = filmId(film);
    let best = 0;
    for (const seed of seeds) {
      if (!seed || seed.id === id) continue;
      const score = similarOverlap(film, seed);
      if (score > best) best = score;
    }
    return best;
  }

  // Raw vote_average put 10.0 long-tail titles first. Tier real features ahead
  // of shorts and untrusted perfect scores; popularity wins when we have it.
  const SUGGEST_FEATURE_MIN = 80;
  const SUGGEST_SHORT_MAX = 44;
  const SUGGEST_IDENTITY = [
    "Horror", "Komödie", "Animation", "Romanze", "Krimi", "Drama",
    "Fantasy", "Sci-Fi", "Thriller", "Action", "Abenteuer",
  ];
  let suggestFamiliarity = null;
  let suggestCuratedIds = new Set();

  function invalidateSuggestIndex() {
    suggestFamiliarity = null;
  }

  function ensureSuggestIndex() {
    if (suggestFamiliarity) return;
    const map = new Map();
    const list = offlineFilms && offlineFilms.length ? offlineFilms : [];
    const total = Math.max(list.length, 1);
    list.forEach((film, index) => {
      const id = filmId(film);
      if (!id) return;
      const rank = 1 - index / total;
      const prev = map.get(id);
      if (prev == null || rank > prev) map.set(id, rank);
    });
    const curated = new Set();
    const mark = (id, floor) => {
      if (!id) return;
      curated.add(String(id));
      map.set(String(id), Math.max(map.get(String(id)) || 0, floor));
    };
    for (const film of FILMS) mark(filmId(film), 0.97);
    for (const id of BLOCKBUSTER_IDS) mark(`t${id}`, 0.96);
    for (const id of KLASSIKER_IDS) mark(`t${id}`, 0.96);
    suggestCuratedIds = curated;
    suggestFamiliarity = map;
  }

  function suggestIsCurated(film) {
    ensureSuggestIndex();
    return suggestCuratedIds.has(filmId(film));
  }

  function suggestFamiliarityOf(film) {
    ensureSuggestIndex();
    const known = suggestFamiliarity.get(filmId(film));
    if (known != null) return known;
    const popularity = Number(film && film.popularity) || 0;
    const votes = Number(film && film.vote_count) || 0;
    if (popularity >= 40 || votes >= 1500) return 0.9;
    if (popularity >= 15 || votes >= 400) return 0.7;
    return 0;
  }

  function suggestIdentity(film) {
    const names = filmGenres(film);
    for (const name of SUGGEST_IDENTITY) {
      if (names.includes(name)) return name;
    }
    return names[0] || "Film";
  }

  function suggestTieBreak(film) {
    const id = filmId(film);
    let hash = 0;
    for (let i = 0; i < id.length; i += 1) hash = (hash * 33 + id.charCodeAt(i)) >>> 0;
    return (hash % 1000) / 1000 * 1.1;
  }

  function suggestQualityScore(film) {
    const popularity = Number(film && film.popularity) || 0;
    const votes = Number(film && film.vote_count) || 0;
    const rating = Number((film && (film.rating != null ? film.rating : film.vote_average)) || 0) || 0;
    const minutes = filmMinutesOf(film);
    const familiarity = suggestFamiliarityOf(film);
    const curated = suggestIsCurated(film);
    let used = rating;
    if (!curated && votes < 800) used = Math.min(rating, rating >= 8.9 ? 7.2 : 8.25);
    let score = used * 4.8;
    if (popularity > 0) score += Math.log10(1 + popularity) * 22;
    if (votes > 0) score += Math.log10(1 + votes) * 14;
    if (familiarity > 0 && popularity < 12 && votes < 200) score += familiarity * 36;
    if (curated) score += 16;
    if (minutes >= 90 && minutes <= 180) score += 6;
    else if (minutes >= SUGGEST_FEATURE_MIN && minutes <= 210) score += 3;
    else if (minutes > 0 && minutes < SUGGEST_SHORT_MAX) score -= 10;
    const genres = filmGenres(film);
    if (genres.includes("Doku") && votes < 600 && popularity < 30) score -= 12;
    if (genres.includes("TV-Film") && votes < 600) score -= 8;
    return score + suggestTieBreak(film);
  }

  function suggestTier(film) {
    const minutes = filmMinutesOf(film);
    const rating = Number((film && (film.rating != null ? film.rating : film.vote_average)) || 0) || 0;
    const votes = Number(film && film.vote_count) || 0;
    const popularity = Number(film && film.popularity) || 0;
    const familiarity = suggestFamiliarityOf(film);
    const curated = suggestIsCurated(film);
    const genres = filmGenres(film);
    const inflated = rating >= 8.9 && !curated && votes < 800 && popularity < 40;
    const known = curated || familiarity >= 0.75 || votes >= 400 || popularity >= 18;
    const feature = minutes >= SUGGEST_FEATURE_MIN && minutes <= 220;
    const sane = rating >= 6 && rating < 9.5;
    const weakDoku = genres.includes("Doku") && votes < 500 && popularity < 25;
    const weakTv = genres.includes("TV-Film") && votes < 400 && popularity < 20;
    if (feature && sane && known && !inflated && !weakDoku && !weakTv) return 0;
    const micro = minutes > 0 && minutes < SUGGEST_SHORT_MAX;
    const fakePerfect = rating >= 9.5 && votes < 400 && popularity < 30 && !curated;
    const unknownLength = !minutes && votes < 300 && popularity < 20 && familiarity < 0.8;
    if (micro || fakePerfect || rating <= 0 || unknownLength) return 2;
    if (rating > 0 && rating < 4.5 && votes < 150) return 2;
    return 1;
  }

  function suggestShouldDiversify() {
    if (state.filters.genres.length) return false;
    if ((state.filters.types || []).length) return false;
    if ((state.filters.similar || []).length) return false;
    if ((state.directionSeeds || []).length) return false;
    return true;
  }

  function suggestDiversityPenalty(film, chosen) {
    const identity = suggestIdentity(film);
    let penalty = 0;
    if ((chosen || []).some((other) => suggestIdentity(other) === identity)) penalty += 22;
    const seen = state.sessionSuggestGenres;
    if (seen && seen.has && seen.has(identity)) penalty += 11;
    const mine = filmGenres(film);
    for (const other of chosen || []) {
      for (const name of filmGenres(other)) {
        if (mine.includes(name)) penalty += 1.8;
      }
    }
    return penalty;
  }

  function suggestGuideBonus(film) {
    const direction = directionBias(film);
    if (!(anyFilterOn() || direction > 0)) return 0;
    // Alias hits sit around 12. Extra genre overlap past that must not
    // promote a narrower mockbuster over the real film.
    const steered = Math.min(direction, 12) * 10 + Math.max(0, direction - 12) * 3;
    return filterFitScore(film) * 34 + steered;
  }

  function suggestSignalMatch(film) {
    const direction = directionBias(film);
    if (direction >= 8) return true;
    if (state.filters.genres.length && filmGenres(film).some((name) => state.filters.genres.includes(name))) {
      return true;
    }
    if (state.filters.dauerOn) {
      const minutes = filmMinutesOf(film);
      if (minutes > 0 && minutes <= Number(state.filters.dauer) + 10) return true;
    }
    if ((state.filters.types || []).length && filmMatchesType(film)) return true;
    if ((state.filters.actors || []).length && filmMatchesActors(film)) return true;
    if ((state.filters.similar || []).length && filmSimilarScore(film) >= 3.2) return true;
    if (state.filters.streaming.length) {
      const have = Array.isArray(film.providers) ? film.providers : film.streaming;
      if (Array.isArray(have) && have.some((id) => state.filters.streaming.includes(id))) return true;
    }
    if (state.filters.tags.length && state.filters.tags.some((tag) => tagsFor(film.id).includes(tag))) return true;
    return false;
  }

  function suggestionBucket(film) {
    const tier = suggestTier(film);
    if (tier >= 2) return 2;
    const direction = directionBias(film);
    if (!(anyFilterOn() || direction > 0)) return tier;
    return suggestSignalMatch(film) ? 0 : 1;
  }

  function rankSuggestionPool(pool) {
    return (pool || [])
      .map((film) => ({
        film,
        tier: suggestionBucket(film),
        score: suggestQualityScore(film) + suggestGuideBonus(film),
      }))
      .sort((a, b) => (a.tier - b.tier) || (b.score - a.score));
  }

  function takeSuggestionFilms(ranked, count, genreContext) {
    const diversify = suggestShouldDiversify();
    const chosen = (genreContext || []).slice();
    const seen = new Set(chosen.map((film) => filmId(film)));
    const remaining = [];
    for (const row of ranked || []) {
      const id = filmId(row.film);
      if (!id || seen.has(id)) continue;
      seen.add(id);
      remaining.push(row);
    }
    const out = [];
    while (out.length < count && remaining.length) {
      let bestIndex = 0;
      if (diversify) {
        let bestValue = -Infinity;
        const bestTier = remaining[0].tier;
        const limit = Math.min(remaining.length, 36);
        for (let i = 0; i < limit; i += 1) {
          const row = remaining[i];
          if (row.tier !== bestTier) break;
          const value = row.score - suggestDiversityPenalty(row.film, chosen);
          if (value > bestValue) {
            bestValue = value;
            bestIndex = i;
          }
        }
      }
      const [row] = remaining.splice(bestIndex, 1);
      chosen.push(row.film);
      out.push(row.film);
    }
    return out;
  }

  function rememberSuggestGenres(films) {
    if (!state.sessionSuggestGenres) state.sessionSuggestGenres = new Set();
    for (const film of films || []) {
      if (!film) continue;
      state.sessionSuggestGenres.add(suggestIdentity(film));
    }
  }

  function rememberDirection(film) {
    const full = findFilm(film) || film;
    if (!full || !full.title) return;
    const seed = {
      id: filmId(full),
      year: Number(full.year) || 0,
      genres: similarFoldedSet(filmGenres(full)),
      aliases: similarFoldedSet(full.aliases, 2),
      cast: similarFoldedSet(filmCastNames(full)),
    };
    const rest = (state.directionSeeds || []).filter((row) => row.id !== seed.id);
    state.directionSeeds = [seed].concat(rest).slice(0, 3);
  }

  function filmMatchesType(film, filters) {
    const wanted = (filters || state.filters).types || [];
    if (!wanted.length) return true;
    const genres = filmGenres(film);
    const animated = genres.includes("Animation");
    const doku = genres.includes("Doku");
    const tv = genres.includes("TV-Film");
    return wanted.some((id) => {
      if (id === "animation") return animated;
      if (id === "doku") return doku;
      if (id === "tv") return tv;
      if (id === "real") return !animated && !doku && !tv;
      return false;
    });
  }

  function filmMatchesActors(film, filters) {
    const wanted = (filters || state.filters).actors || [];
    if (!wanted.length) return true;
    const id = filmId(film);
    const names = filmCastNames(film).map((name) => foldSearch(name));
    return wanted.some((actor) => {
      if (actor && actor.liveIdSet && actor.liveIdSet.has(id)) return true;
      const q = foldSearch(actor && actor.name);
      if (!q || !names.length) return false;
      return names.some((name) => name === q || name.includes(q));
    });
  }

  const SIMILAR_CURATED_IDS = new Set(
    FILMS.map((film) => filmId(film))
      .concat(LOGIN_POSTERS.map((row) => String(row.id)))
      .concat(BLOCKBUSTER_IDS.map((id) => `t${id}`))
      .concat(KLASSIKER_IDS.map((id) => `t${id}`))
  );

  let similarFetchedKey = "";
  let similarRemoteIds = new Set();
  let similarSeedCacheKey = "";
  let similarSeedCache = [];

  function similarFoldedSet(values, minLength) {
    const out = new Set();
    for (const value of values || []) {
      const folded = foldSearch(value);
      if (!folded || folded.length < (minLength || 1)) continue;
      out.add(folded);
    }
    return out;
  }

  function resolvedSimilarSeeds() {
    const rows = state.filters.similar || [];
    const key = `${state.catalog.length}:${rows.map((row) => row.id).join("|")}`;
    if (key === similarSeedCacheKey) return similarSeedCache;
    similarSeedCacheKey = key;
    similarSeedCache = rows.map((row) => {
      const film = findFilm(row.id) || row;
      if (!film || !film.title) return null;
      return {
        film,
        id: filmId(film),
        year: Number(film.year) || Number(row.year) || 0,
        genres: similarFoldedSet(filmGenres(film)),
        aliases: similarFoldedSet(film.aliases, 2),
        cast: similarFoldedSet(filmCastNames(film)),
      };
    }).filter(Boolean);
    return similarSeedCache;
  }

  function similarOverlap(film, seed) {
    const genres = similarFoldedSet(filmGenres(film));
    let sharedGenres = 0;
    genres.forEach((name) => {
      if (seed.genres.has(name)) sharedGenres += 1;
    });
    const union = genres.size + seed.genres.size - sharedGenres;
    const jaccard = union ? sharedGenres / union : 0;
    const aliases = similarFoldedSet(film.aliases, 2);
    let sharedAlias = 0;
    aliases.forEach((name) => {
      if (seed.aliases.has(name)) sharedAlias += 1;
    });
    const cast = similarFoldedSet(filmCastNames(film));
    let sharedCast = 0;
    cast.forEach((name) => {
      if (seed.cast.has(name)) sharedCast += 1;
    });
    let score = 0;
    if (sharedAlias) score += 12 + sharedAlias * 2;
    if (sharedCast && (sharedGenres || sharedAlias)) score += 1.6 + sharedCast * 0.8;
    if (sharedGenres) score += jaccard * 5 + sharedGenres * 0.4;
    const year = Number(film.year) || 0;
    if (year && seed.year) {
      const delta = Math.abs(year - seed.year);
      if (delta <= 8 && (sharedAlias || sharedGenres >= 2)) score += 1.2;
      else if (delta <= 15 && sharedGenres >= 2) score += 0.5;
    }
    return score;
  }

  function filmSimilarScore(film) {
    const seeds = resolvedSimilarSeeds();
    if (!seeds.length || !film) return 0;
    const id = filmId(film);
    if (seeds.some((seed) => seed.id === id)) return -1;
    let best = 0;
    let hits = 0;
    for (const seed of seeds) {
      const score = similarOverlap(film, seed);
      if (score > best) best = score;
      if (score >= 3.2) hits += 1;
    }
    if (similarRemoteIds.has(id)) best = Math.max(best, 13);
    if (hits > 1) best += Math.min(3, (hits - 1) * 1.4);
    return best;
  }

  function filmMatchesSimilar(film) {
    if (!(state.filters.similar || []).length) return true;
    return filmSimilarScore(film) >= 3.2;
  }

  function hasHardFilters() {
    return (state.filters.types && state.filters.types.length > 0)
      || (state.filters.actors && state.filters.actors.length > 0)
      || (state.filters.similar && state.filters.similar.length > 0);
  }

  function passesHardFilters(film) {
    return filmMatchesType(film) && filmMatchesActors(film) && filmMatchesSimilar(film);
  }

  function buildPool(excludeIds) {
    const exclude = new Set((excludeIds || []).map(filmId));
    const usable = (film) => !exclude.has(filmId(film)) && passesHardFilters(film);
    let pool = state.catalog.filter((film) => (
      usable(film)
      && !state.sessionBlocked.has(filmId(film))
      && !state.sessionSkip.has(filmId(film))
    ));
    if (!pool.length) {
      state.sessionSkip.clear();
      pool = state.catalog.filter((film) => usable(film) && !state.sessionBlocked.has(filmId(film)));
    }
    if (pool.length < 3 && !hasHardFilters()) {
      state.sessionSkip.clear();
      pool = state.catalog.filter((film) => usable(film) && !state.sessionBlocked.has(filmId(film)));
    }
    if (pool.length < 3 && !hasHardFilters()) pool = shuffle(state.catalog.filter(usable));
    if (pool.length < 3 && !hasHardFilters()) pool = shuffle(state.catalog.slice());
    return pool;
  }

  function pickFilms(count, excludeIds, genreContext) {
    const pool = buildPool(excludeIds);
    const ranked = rankSuggestionPool(pool);
    const out = takeSuggestionFilms(ranked, count, genreContext || []);
    if (!hasHardFilters() && out.length < count) {
      for (const row of ranked) {
        if (out.some((film) => filmId(film) === filmId(row.film))) continue;
        out.push(row.film);
        if (out.length >= count) break;
      }
    }
    if (!out.length && state.catalog.length && !hasHardFilters()) {
      return ranked.slice(0, Math.max(count, 1)).map((row) => row.film);
    }
    return out;
  }

  function pickThree(excludeIds) {
    const picks = pickFilms(3, excludeIds);
    if (hasHardFilters() || picks.length >= 3) return picks.slice(0, 3);
    const extras = cloneFilms(offlineFilms).filter(passesHardFilters);
    for (const film of extras.concat(cloneFilms(state.catalog))) {
      if (!passesHardFilters(film)) continue;
      if (picks.some((x) => filmId(x) === filmId(film))) continue;
      picks.push(film);
      if (picks.length >= 3) break;
    }
    if (!picks.length && extras.length) return extras.slice(0, 3);
    while (picks.length && picks.length < 3 && !hasHardFilters()) picks.push(picks[0]);
    return picks.slice(0, 3);
  }

  const SUGGEST_STACK = 3;

  function suggestionCandidates(excludeIds) {
    const exclude = new Set((excludeIds || []).map(filmId));
    return state.catalog.filter((film) => {
      const id = filmId(film);
      return !exclude.has(id)
        && passesHardFilters(film)
        && !state.sessionBlocked.has(id)
        && !state.sessionSkip.has(id);
    });
  }

  function refillSuggestionStack() {
    const need = SUGGEST_STACK - state.currentPicks.length;
    if (need <= 0) return;
    const ranked = rankSuggestionPool(suggestionCandidates(state.currentPicks.map(filmId)));
    const next = takeSuggestionFilms(ranked, need, state.currentPicks);
    for (const film of next) state.currentPicks.push(film);
    rememberSuggestGenres(next);
  }

  let discoverKey = "";
  let discoverLoading = false;
  let discoverWaiters = [];
  let catalogInFlight = null;

  function currentDiscoverKey() {
    return JSON.stringify({
      genres: state.filters.genres.slice().sort(),
      dauer: state.filters.dauerOn ? state.filters.dauer : null,
      types: (state.filters.types || []).slice().sort(),
      actors: (state.filters.actors || []).map((actor) => actor.id).sort(),
      similar: (state.filters.similar || []).map((film) => film.id).sort(),
    });
  }

  function discoverNeedsBrowse() {
    return state.filters.dauerOn
      || state.filters.genres.length > 0
      || state.filters.tags.length > 0
      || state.filters.streaming.length > 0
      || state.filters.types.length > 0
      || (state.filters.actors || []).length > 0;
  }

  async function fetchSimilarForSeeds() {
    const seeds = state.filters.similar || [];
    const key = seeds.map((row) => String(row.id)).sort().join("|");
    if (!key) {
      similarRemoteIds = new Set();
      similarFetchedKey = "";
      return;
    }
    if (similarFetchedKey === key) return;
    similarRemoteIds = new Set();
    if (!tmdbKey()) {
      similarFetchedKey = key;
      return;
    }
    const next = new Set();
    const seedIds = new Set(seeds.map((row) => String(row.id)));
    for (const seed of seeds) {
      const id = Number(seed.tmdb) || Number(String(seed.id).replace(/^t/i, ""));
      if (!Number.isFinite(id) || id <= 0) continue;
      try {
        const data = await tmdbFetch(`/movie/${id}/similar`, { page: "1" });
        const films = (data.results || []).map(fromTmdbMovie).filter((film) => film && film.title);
        addFilmsToCatalog(films);
        for (const film of films) {
          const hid = filmId(film);
          if (!seedIds.has(hid)) next.add(hid);
        }
      } catch {
        /* Local genre, cast, and alias overlap still ranks the catalog. */
      }
    }
    similarRemoteIds = next;
    similarFetchedKey = key;
    similarSeedCacheKey = "";
  }

  function discoverParams(page) {
    const guided = anyFilterOn();
    const params = {
      sort_by: "popularity.desc",
      page: String(page),
      include_video: "false",
      "vote_count.gte": guided ? "40" : "250",
    };
    if (!guided) params["vote_average.gte"] = "6";
    const allowShort = state.filters.dauerOn && Number(state.filters.dauer) < SUGGEST_FEATURE_MIN;
    if (!allowShort) params["with_runtime.gte"] = guided ? "50" : "80";
    const ids = state.filters.genres
      .map((name) => GENRE_NAME_TO_ID[name])
      .filter((id) => Number.isFinite(id));
    const typeIds = [];
    if (state.filters.types.includes("animation")) typeIds.push(16);
    if (state.filters.types.includes("doku")) typeIds.push(99);
    if (state.filters.types.includes("tv")) typeIds.push(10770);
    if (ids.length) params.with_genres = ids.join(",");
    else if (typeIds.length && !(state.filters.types.length === 1 && state.filters.types[0] === "real")) {
      params.with_genres = typeIds.join("|");
    }
    if (state.filters.types.length === 1 && state.filters.types[0] === "real") {
      params.without_genres = "16,99,10770";
    }
    if (state.filters.dauerOn) params["with_runtime.lte"] = String(state.filters.dauer);
    const person = (state.filters.actors || []).find((actor) => actor && actor.tmdb);
    if (person) params.with_cast = String(person.tmdb);
    return params;
  }

  function addFilmsToCatalog(films, alreadyNormalized) {
    const seen = new Set(state.catalog.map(filmId));
    for (const film of films) {
      const n = alreadyNormalized ? film : normalizeFilm(film);
      if (!n || !n.id) continue;
      if (seen.has(filmId(n))) {
        if (!alreadyNormalized) rememberFilm(n);
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
    if (discoverLoading) {
      await new Promise((resolve) => discoverWaiters.push(resolve));
      return state.catalogLive;
    }
    discoverLoading = true;
    try {
      if ((state.filters.similar || []).length) await fetchSimilarForSeeds();
      if ((state.filters.similar || []).length && !discoverNeedsBrowse()) return;
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
      const waiting = discoverWaiters.splice(0);
      for (const resolve of waiting) resolve();
    }
    return state.catalogLive;
  }

  function yieldToPaint() {
    if (typeof scheduler !== "undefined" && typeof scheduler.yield === "function") {
      return scheduler.yield();
    }
    return new Promise((resolve) => setTimeout(resolve, 0));
  }

  async function normalizeFilmsChunked(rows) {
    const out = new Array(rows.length);
    const chunk = 80;
    for (let i = 0; i < rows.length; i += chunk) {
      const end = Math.min(rows.length, i + chunk);
      for (let j = i; j < end; j += 1) out[j] = normalizeFilm(rows[j]);
      if (end < rows.length) await yieldToPaint();
    }
    return out;
  }

  async function loadOfflineFallback() {
    try {
      const res = await fetch("./films.json");
      if (!res.ok) throw new Error("catalog");
      const text = await res.text();
      await yieldToPaint();
      const data = JSON.parse(text);
      await yieldToPaint();
      if (Array.isArray(data) && data.length > 20) {
        offlineFilms = await normalizeFilmsChunked(data);
        invalidateSuggestIndex();
      }
    } catch {
      offlineFilms = cloneFilms(FILMS);
      invalidateSuggestIndex();
    }
  }

  async function loadCatalog() {
    if (catalogInFlight) return catalogInFlight;
    catalogInFlight = (async () => {
      await loadOfflineFallback();
      addFilmsToCatalog(offlineFilms, true);
      addFilmsToCatalog(FILMS);
      const live = await ensureDiscoverPool(80);
      if (!live && !state.catalogLive) {
        if (!state.catalog.length) state.catalog = offlineFilms.slice();
        state.catalogLive = false;
      }
      mergeKnownIntoCatalog();
      hydrateMissingListFilms();
      rebuildGenres();
      renderGenrePicks();
      reapplyActorFilmographies();
    })();
    try {
      await catalogInFlight;
    } finally {
      catalogInFlight = null;
    }
  }

  function scheduleCatalogLoad() {
    const start = () => { loadCatalog(); };
    const afterPaint = (fn) => {
      if (typeof requestAnimationFrame === "function") {
        requestAnimationFrame(() => setTimeout(fn, 0));
      } else {
        setTimeout(fn, 0);
      }
    };
    if (state.screen === "login") {
      ensureLoginPostersPreloaded().finally(() => {
        if (typeof requestIdleCallback === "function") {
          requestIdleCallback(() => start(), { timeout: 1800 });
        } else {
          afterPaint(start);
        }
      });
      return;
    }
    afterPaint(start);
  }

  function anyFilterOn() {
    return state.filters.dauerOn
      || state.filters.genres.length > 0
      || state.filters.tags.length > 0
      || state.filters.streaming.length > 0
      || state.filters.types.length > 0
      || state.filters.actors.length > 0
      || (state.filters.similar || []).length > 0;
  }

  function discoverCatOn(id) {
    return filterCatOn(state.filters, id);
  }

  function entdeckenIconHtml(large) {
    const w = large ? 36 : 18;
    const h = large ? 52 : 26;
    return `
      <span class="entdecken-icon${large ? " is-lg" : ""}" aria-hidden="true">
        <img class="entdecken-cover" src="${INTERSTELLAR_POSTER}" alt="" width="${w}" height="${h}" decoding="async" referrerpolicy="no-referrer">
        <svg class="entdecken-glass" viewBox="0 0 32 32" aria-hidden="true">
          <circle cx="11" cy="11" r="8" fill="#d4926a" stroke="#6b3a24" stroke-width="1.6"/>
          <circle cx="8.6" cy="8.4" r="2.3" fill="#f8e2cc"/>
          <path d="M16.6 16.6 28 28" stroke="#111" stroke-width="3.2" stroke-linecap="round"/>
        </svg>
      </span>
    `;
  }

  function dauerFill(value) {
    return ((Number(value) - 60) / 150) * 100;
  }

  function dauerLabel(value) {
    return `≤ ${Number(value) || 0}`;
  }

  function dauerChipLabel(value) {
    return `≤ ${Number(value) || 0} Min.`;
  }

  function coversMarkup() {
    const tiles = HERO_COVERS.map((row, index) => {
      const known = findFilm(`t${row.tmdb}`);
      const src = (known && known.poster) || row.src;
      return `<img class="cover-stack-tile" style="--i:${index}" src="${escapeHtml(src)}" alt="" width="56" height="84" referrerpolicy="no-referrer" onerror="this.style.visibility='hidden'">`;
    });
    return `<span class="cover-stack" aria-hidden="true">${ICONS.covers}${tiles.join("")}</span>`;
  }

  function filterChipRows() {
    const tags = customTags("film");
    const chips = [];
    if (state.filters.dauerOn) {
      chips.push({ kind: "dauer", id: "dauer", label: dauerChipLabel(state.filters.dauer) });
    }
    for (const genre of state.filters.genres) {
      chips.push({ kind: "genre", id: genre, label: genre });
    }
    for (const id of state.filters.tags) {
      const tag = tags.find((t) => t.id === id);
      if (tag) chips.push({ kind: "tag", id, label: tag.name });
    }
    for (const id of state.filters.streaming) {
      const row = STREAMING_CHIPS.find((s) => s.id === id);
      if (row) chips.push({ kind: "streaming", id, label: row.label });
    }
    for (const id of state.filters.types) {
      const row = TYPE_CHIPS.find((s) => s.id === id);
      if (row) chips.push({ kind: "type", id, label: row.label });
    }
    for (const actor of state.filters.actors) {
      chips.push({ kind: "actor", id: actor.id, label: actorFilterLabel(actor) });
    }
    for (const film of state.filters.similar || []) {
      chips.push({ kind: "similar", id: film.id, label: film.title });
    }
    return chips;
  }

  function activeFilterChipBody(chip) {
    if (chip.kind === "tag") {
      const tag = customTags().find((row) => row.id === chip.id);
      if (tag) return tagChipHtml(tag, { size: "mini" });
    }
    return `<span>${escapeHtml(chip.label)}</span>`;
  }

  function renderActiveFilterChips() {
    const chips = filterChipRows();
    if (!chips.length) return "";
    const items = chips.map((chip) => `
      <span class="active-chip${chip.kind === "tag" ? " is-tag" : ""}">
        ${activeFilterChipBody(chip)}
        <button type="button" class="active-chip-x" data-act="remove-filter" data-kind="${escapeHtml(chip.kind)}" data-id="${escapeHtml(chip.id)}" aria-label="${escapeHtml(chip.label)} entfernen">${ICONS.chipX}</button>
      </span>
    `).join("");
    return `
      <div class="active-chip-row">
        <button type="button" class="chip-clear-all" data-act="ask-clear-filters" aria-label="Alle Filter löschen" title="Alle Filter löschen">×</button>
        ${items}
      </div>
    `;
  }

  function renderListChipRow(key, chipsHtml) {
    const expanded = !!state.filterMore[key];
    return `
      <div class="list-chip-row${expanded ? " is-expanded" : ""}">
        <div class="filter-chips${expanded ? " is-expanded" : ""}" data-chip-row="${key}">
          ${chipsHtml}
        </div>
        <button type="button" class="chip-more${expanded ? " is-weniger" : ""}" data-act="filter-more" data-key="${key}"${expanded ? "" : " hidden"}>${expanded ? "weniger" : "mehr"}</button>
      </div>
    `;
  }

  function renderOverflowChips(key, items) {
    if (!items.length) {
      return `<span class="hint filter-empty">${key === "tags" ? "Noch keine eigenen Tags" : ""}</span>`;
    }
    const chips = items.map((item) => (
      item.chipHtml
        ? item.chipHtml
        : `<button type="button" class="chip" data-act="${item.act}" ${item.attrs} aria-pressed="${item.on}">${escapeHtml(item.label)}</button>`
    )).join("");
    const expanded = !!state.filterMore[key];
    return `
      <div class="filter-chips${expanded ? " is-expanded" : ""}" data-chip-row="${key}">
        ${chips}
      </div>
      <button type="button" class="chip-more${expanded ? " is-weniger" : ""}" data-act="filter-more" data-key="${key}" ${expanded ? "" : "hidden"}>${expanded ? "weniger" : "mehr"}</button>
    `;
  }

  function chipOverflowRank(chip, key) {
    if (key === "listRated" || key === "listSeen" || key === "listTags") {
      return chip.getAttribute("aria-pressed") === "true" ? 2 : 0;
    }
    return 0;
  }

  function paintChipOverflow() {
    const roots = [];
    if (state.screen === "discover" && state.discoverView === "hub") roots.push(app);
    if (state.screen === "lists") roots.push(app);
    if (state.watchSheet === "zufall") roots.push(watchSheetEl);
    roots.forEach((root) => {
      if (!root) return;
      root.querySelectorAll("[data-chip-row]").forEach((row) => {
      const key = row.dataset.chipRow;
      const wrap = row.closest(".filter-card, .zufall-chip-row, .list-chip-row") || row.parentElement;
      const moreBtn = wrap ? wrap.querySelector("[data-act=filter-more], [data-act=zufall-more]") : null;
      const chips = [...row.querySelectorAll(".chip, .tag-chip, .watch-add-chip")].filter((chip) => !chip.classList.contains("watch-zufall-hint"));
      chips.forEach((chip) => { chip.hidden = false; });
      if (state.filterMore[key]) {
        row.classList.add("is-expanded");
        if (wrap) wrap.classList.add("is-expanded");
        if (moreBtn) {
          moreBtn.hidden = false;
          moreBtn.textContent = "weniger";
          moreBtn.classList.add("is-weniger");
        }
        return;
      }
      row.classList.remove("is-expanded");
      if (wrap) wrap.classList.remove("is-expanded");
      if (!moreBtn) return;
      moreBtn.textContent = "mehr";
      moreBtn.classList.remove("is-weniger");
      moreBtn.hidden = false;
      const overflows = () => row.scrollWidth > row.clientWidth + 1;
      if (!overflows()) {
        moreBtn.hidden = true;
        return;
      }
      if (key === "zufall") {
        const rank = (chip) => (chip.dataset.origin === "1" ? 2 : (chip.getAttribute("aria-pressed") === "true" ? 1 : 0));
        const hideOrder = chips.slice().reverse().sort((a, b) => rank(a) - rank(b));
        for (const chip of hideOrder) {
          if (!overflows()) break;
          if (chip.dataset.origin === "1") continue;
          chip.hidden = true;
        }
      } else if (key === "listRated" || key === "listSeen" || key === "listTags") {
        const hideOrder = chips.slice().reverse().sort((a, b) => chipOverflowRank(a, key) - chipOverflowRank(b, key));
        for (const chip of hideOrder) {
          if (!overflows()) break;
          if (chipOverflowRank(chip, key) >= 2) continue;
          chip.hidden = true;
        }
      } else {
        for (let i = chips.length - 1; i >= 0; i -= 1) {
          chips[i].hidden = true;
          if (!overflows()) break;
        }
      }
      if (chips.every((chip) => chip.hidden) && chips[0]) chips[0].hidden = false;
      });
    });
  }

  function clearAllFilters() {
    state.filters.dauerOn = false;
    state.filters.genres = [];
    state.filters.tags = [];
    state.filters.streaming = [];
    state.filters.types = [];
    state.filters.actors = [];
    state.filters.similar = [];
    state.actorQuery = "";
    state.actorHits = [];
    state.actorStatus = "";
    state.similarQuery = "";
    state.similarHits = [];
    state.similarStatus = "";
    state.similarDraft = [];
    state.directionSeeds = [];
    similarRemoteIds = new Set();
    similarFetchedKey = "";
    similarSeedCacheKey = "";
  }

  function emptyFilterBag() {
    return {
      dauerOn: false,
      dauer: 120,
      genres: [],
      tags: [],
      streaming: [],
      types: [],
      actors: [],
      similar: [],
    };
  }

  function cloneFilterBag(src) {
    const bag = src || emptyFilterBag();
    return {
      dauerOn: !!bag.dauerOn,
      dauer: Number(bag.dauer) || 120,
      genres: (bag.genres || []).slice(),
      tags: (bag.tags || []).slice(),
      streaming: (bag.streaming || []).slice(),
      types: (bag.types || []).slice(),
      actors: (bag.actors || []).map((actor) => Object.assign({}, actor)),
      similar: (bag.similar || []).map((film) => Object.assign({}, film)),
    };
  }

  function loadZufallFiltersFromStorage() {
    if (!state.user || !state.profile) return;
    const raw = loadJson(pkey("zufallFilters"), null);
    state.zufallFilters = cloneFilterBag(raw || emptyFilterBag());
  }

  function saveZufallFiltersToStorage() {
    if (!state.user || !state.profile) return;
    saveJson(pkey("zufallFilters"), cloneFilterBag(state.zufallFilters));
    scheduleDebouncedSync();
  }

  function zufallFiltersDraftBag() {
    return state.zufallFiltersDraft || state.zufallFilters;
  }

  function filterCtxFrom(el) {
    const box = el && el.closest("[data-filter-ctx]");
    return box && box.dataset.filterCtx === "zufall" ? "zufall" : "discover";
  }

  function filtersBagForCtx(ctx) {
    return ctx === "zufall" ? zufallFiltersDraftBag() : state.filters;
  }

  function zufallAnyFilterOn(bag) {
    const f = bag || state.zufallFilters;
    return f.dauerOn
      || f.genres.length > 0
      || f.tags.length > 0
      || f.types.length > 0
      || (f.actors || []).length > 0;
  }

  function zufallActiveFilterCount(bag) {
    const f = bag || state.zufallFilters;
    let n = 0;
    if (f.dauerOn) n += 1;
    n += f.genres.length;
    n += f.tags.length;
    n += f.types.length;
    n += (f.actors || []).length;
    return n;
  }

  function filterCatOn(filters, id) {
    const bag = filters || state.filters;
    if (id === "dauer") return !!bag.dauerOn;
    if (id === "genre") return bag.genres.length > 0;
    if (id === "tags") return bag.tags.length > 0;
    if (id === "streaming") return bag.streaming.length > 0;
    if (id === "typ") return bag.types.length > 0;
    if (id === "actor") return (bag.actors || []).length > 0;
    if (id === "similar") return (bag.similar || []).length > 0;
    return false;
  }

  function zufallFilterChipRows(bag) {
    const filters = bag || state.zufallFilters;
    const tags = customTags("film");
    const chips = [];
    if (filters.dauerOn) {
      chips.push({ kind: "dauer", id: "dauer", label: dauerChipLabel(filters.dauer) });
    }
    for (const genre of filters.genres) {
      chips.push({ kind: "genre", id: genre, label: genre });
    }
    for (const id of filters.tags) {
      const tag = tags.find((t) => t.id === id);
      if (tag) chips.push({ kind: "tag", id, label: tag.name });
    }
    for (const id of filters.types) {
      const row = TYPE_CHIPS.find((s) => s.id === id);
      if (row) chips.push({ kind: "type", id, label: row.label });
    }
    for (const actor of filters.actors || []) {
      chips.push({ kind: "actor", id: actor.id, label: actorFilterLabel(actor) });
    }
    return chips;
  }

  function zufallHardMatch(film, filters) {
    const bag = filters || state.zufallFilters;
    if (!film) return false;
    if (bag.dauerOn) {
      const minutes = Number(film.minutes || film.runtime) || 0;
      if (!minutes) return false;
      const limit = Number(bag.dauer) * 1.1;
      if (minutes > limit) return false;
    }
    if (bag.genres.length && !filmGenres(film).some((name) => bag.genres.includes(name))) return false;
    if (bag.tags.length && !bag.tags.some((tag) => tagsFor(film.id).includes(tag))) return false;
    if (bag.types.length && !filmMatchesType(film, bag)) return false;
    if ((bag.actors || []).length && !filmMatchesActors(film, bag)) return false;
    return true;
  }

  function zufallMatchStats(filters) {
    const base = zufallUnionFilms(state.zufallSources && state.zufallSources.length
      ? state.zufallSources
      : defaultZufallOrigin()).map(filmWithPoster).filter(Boolean);
    const bag = filters || state.zufallFilters;
    let hiddenNoRuntime = 0;
    const matched = [];
    for (const film of base) {
      if (bag.dauerOn) {
        const minutes = Number(film.minutes || film.runtime) || 0;
        if (!minutes) {
          hiddenNoRuntime += 1;
          continue;
        }
      }
      if (zufallHardMatch(film, bag)) matched.push(film);
    }
    return { base, matched, total: base.length, count: matched.length, hiddenNoRuntime };
  }

  function zufallLoosenSuggestions(draft) {
    const stats = zufallMatchStats(draft);
    if (stats.count > 0) return [];
    const out = [];
    const bag = draft || zufallFiltersDraftBag();
    if (bag.dauerOn) {
      const tryBag = cloneFilterBag(bag);
      tryBag.dauerOn = false;
      const n = zufallMatchStats(tryBag).count;
      if (n > stats.count) {
        out.push({ act: "zufall-loosen-dauer", label: `Dauer auf ≤ ${bag.dauer} Min.`, count: n });
      }
    }
    for (const genre of bag.genres) {
      const tryBag = cloneFilterBag(bag);
      tryBag.genres = tryBag.genres.filter((g) => g !== genre);
      const n = zufallMatchStats(tryBag).count;
      if (n > 0) {
        out.push({ act: "zufall-loosen-genre", id: genre, label: `„${genre}“ entfernen`, count: n });
      }
    }
    return out.slice(0, 4);
  }

  function closeFilmMenus() {
    app.querySelectorAll(".film-menu-pop").forEach((pop) => {
      pop.hidden = true;
      pop.style.position = "";
      pop.style.left = "";
      pop.style.right = "";
      pop.style.top = "";
      pop.style.width = "";
      pop.style.transform = "";
    });
    app.querySelectorAll("[data-act=film-menu]").forEach((btn) => {
      btn.setAttribute("aria-expanded", "false");
    });
  }

  function placeFilmMenu(btn, pop) {
    const rect = btn.getBoundingClientRect();
    pop.style.position = "fixed";
    pop.style.transform = "none";
    const width = Math.min(200, Math.max(148, window.innerWidth - 24));
    let left = rect.right - width;
    if (left < 8) left = 8;
    if (left + width > window.innerWidth - 8) left = Math.max(8, window.innerWidth - width - 8);
    pop.style.left = `${left}px`;
    pop.style.right = "auto";
    pop.style.width = `${width}px`;
    const h = pop.offsetHeight;
    let top = rect.bottom + 4;
    if (top + h > window.innerHeight - 8) {
      top = Math.max(8, rect.top - h - 4);
    }
    pop.style.top = `${top}px`;
  }

  function openConfirm(opts) {
    const extra = opts.extra || "";
    const idAttr = opts.id ? ` data-id="${escapeHtml(opts.id)}"` : "";
    const body = opts.html
      ? opts.html
      : (opts.text ? `<p class="hint">${opts.text}</p>` : "");
    const confirmClass = opts.danger ? "btn btn-danger btn-confirm" : "btn btn-primary btn-confirm";
    const confirmBtn = `<button type="button" class="${confirmClass}" data-act="${escapeHtml(opts.confirmAct)}"${idAttr}>${escapeHtml(opts.confirmLabel)}</button>`;
    const cancelBtn = `<button type="button" class="btn btn-ghost" data-act="modal-close">Abbrechen</button>`;
    const actions = opts.danger ? `${cancelBtn}${confirmBtn}` : `${confirmBtn}${cancelBtn}`;
    openModal(`
      <div class="card modal-card${opts.center ? " is-center" : ""}">
        <h2>${escapeHtml(opts.title)}</h2>
        ${body}
        ${extra}
        <div class="modal-actions">
          ${actions}
        </div>
      </div>
    `);
  }

  function openAddTagModal() {
    openTagEditor(null);
  }

  function askDeleteTag(id) {
    const tag = customTags().find((t) => t.id === id);
    if (!tag) return;
    const isVideo = tagScopeOf(tag) === "video";
    const n = isVideo ? countVideosWithTag(id) : countFilmsWithTag(id);
    const entity = isVideo ? "Videos" : "Filme";
    const html = n > 0
      ? `<p class="hint hint-with-pill">Es gibt mit ${tagPillHtml(tag)} getaggte ${entity}. Willst Du wirklich löschen?</p>`
      : `<p class="hint hint-with-pill">Willst Du ${tagPillHtml(tag)} wirklich löschen?</p>`;
    openConfirm({
      title: "Wirklich löschen?",
      html,
      confirmLabel: "löschen",
      confirmAct: "delete-tag",
      id,
      center: true,
    });
  }

  function saveNewTag() {
    state.editTagName = state.newTagName;
    state.editTagPlate = "hell";
    state.editTagCover = tagStarterCovers()[0] || null;
    state.tagEditId = null;
    saveEditedTag();
  }

  function resetTagEditor() {
    state.tagEditId = null;
    state.tagCoverSheet = false;
    state.tagCoverCandidate = null;
    state.coverQuery = "";
    state.coverHits = [];
    state.coverStatus = "";
  }

  function openTagEditor(tag) {
    const starters = tagStarterCovers();
    state.tagEditId = tag ? tag.id : null;
    state.editTagName = tag ? tag.name : "";
    state.editTagPlate = tag ? normalizeTagPlate(tag.plate) : "hell";
    state.editTagCover = tag ? (normalizeCover(tag.cover) || starters[0] || null) : (starters[0] || null);
    state.tagCoverSheet = false;
    state.tagCoverCandidate = null;
    state.coverQuery = "";
    state.coverHits = [];
    state.coverStatus = "";
    state.screen = "tag-edit";
    render();
    if (!state.editTagName) {
      const input = app.querySelector("[data-act=edit-tag-name]");
      if (input) input.focus();
    }
  }

  function saveEditedTag() {
    const name = clampTagName(state.editTagName);
    if (!name) {
      showSnack("Bitte einen Namen eingeben.", "warn");
      return;
    }
    const plate = normalizeTagPlate(state.editTagPlate);
    const cover = normalizeCover(state.editTagCover) || tagStarterCovers()[0] || null;
    const id = state.tagEditId;
    if (id) {
      saveTags(customTags().map((tag) => (
        tag.id === id ? Object.assign({}, tag, { name, plate, cover }) : tag
      )));
    } else {
      const list = customTags();
      const scope = activeTagManageScope();
      const row = { id: `tag-${Date.now()}`, name, plate, scope };
      if (cover) row.cover = cover;
      list.push(row);
      saveTags(list);
    }
    resetTagEditor();
    state.screen = "tags";
    closeModal();
    render();
  }

  function jumpToExactTag(id, scope) {
    const useScope = scope || activeTagManageScope();
    state.listsMode = useScope === "video" ? "videos" : "filme";
    state.listTab = "tags";
    state.tagFilter = [id];
    state.screen = "lists";
    state.tagEditId = null;
    state.expandedFilmId = null;
    state.expandedVideoId = null;
    render();
  }

  function askLogout() {
    openConfirm({
      title: "Ausloggen?",
      text: "Wirklich abmelden?",
      confirmLabel: "Ausloggen",
      confirmAct: "confirm-logout",
    });
  }

  function switchToProfiles() {
    closeAccountMenu();
    state.profile = null;
    state.expandedFilmId = null;
    state.justWatchedId = null;
    state.pinJustWatched = false;
    state.screen = "profiles";
    persistSession();
    render();
  }

  function doLogout() {
    closeWatchSheet();
    closeModal();
    state.user = null;
    state.profile = null;
    state.expandedFilmId = null;
    state.justWatchedId = null;
    state.pinJustWatched = false;
    state.screen = "login";
    state.cloudStatus = "hidden";
    // Keep cloud token so the same device can reconnect; clear only the session.
    persistSession();
    render();
  }

  function burstConfetti(origin) {
    const parts = [];
    const ember = !!(origin && origin.ember);
    const colors = ember
      ? ["#e3b07c", "#d4926a", "#c87a54", "#fff4e0", "#e53935", "#f6d56b"]
      : ["#0066B3", "#ffffff", "#22c55e", "#f6d56b", "#d7f3e4", "#e53935"];
    const { innerWidth: w, innerHeight: h } = window;
    confettiCanvas.width = w;
    confettiCanvas.height = h;
    const ox = origin && Number.isFinite(origin.x) ? origin.x : w * 0.5;
    const oy = origin && Number.isFinite(origin.y) ? origin.y : h * 0.28;
    const count = ember ? 58 : 90;
    for (let i = 0; i < count; i += 1) {
      parts.push({
        x: ox + (Math.random() - 0.5) * (ember ? 46 : 80),
        y: oy,
        vx: (Math.random() - 0.5) * (ember ? 9 : 11),
        vy: Math.random() * -9 - 3,
        g: 0.18 + Math.random() * 0.12,
        s: 4 + Math.random() * 5,
        c: colors[i % colors.length],
        r: Math.random() * 6,
      });
    }
    const start = performance.now();
    const life = ember ? 900 : 1200;
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
      if (t < life) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, w, h);
    }
    requestAnimationFrame(frame);
  }

  function updateHeader() {
    const menuWasOpen = !!(headerActions.querySelector(".acct-menu") && !headerActions.querySelector(".acct-menu").hidden);
    const items = [];
    if (["tags", "done", "profile-add", "tag-edit", "settings"].includes(state.screen)) {
      items.push(`<button type="button" class="icon-btn" data-act="back" aria-label="Zurück" title="Zurück">${ICONS.back}</button>`);
    }
    if (state.screen === "tag-edit") {
      items.push(`<button type="button" class="tag-save-head" data-act="tag-edit-save">Speichern</button>`);
    }
    if ((state.screen === "discover" || state.screen === "lists" || state.screen === "settings") && state.profile) {
      const badge = cloudStatusHtml();
      if (badge) items.push(`<span data-role="cloud-status" class="cloud-status-slot">${badge}</span>`);
      if (state.screen !== "settings") items.push(accountMenuHtml());
    }
    if (state.screen === "profiles") {
      items.push(`<button type="button" class="icon-btn" data-act="logout" aria-label="Ausloggen" title="Ausloggen">${ICONS.logout}</button>`);
    }
    headerActions.innerHTML = items.join("");
    bindAccountCovers(headerActions);
    if (menuWasOpen && headerActions.querySelector(".acct-menu")) openAccountMenu();
  }

  function placeAccountMenu() {
    const btn = headerActions.querySelector("[data-act=account-menu]");
    const pop = headerActions.querySelector(".acct-menu");
    if (!btn || !pop || pop.hidden) return;
    const rect = btn.getBoundingClientRect();
    const margin = 8;
    const width = Math.min(276, window.innerWidth - margin * 2);
    pop.style.width = `${width}px`;
    let left = rect.right - width;
    left = Math.max(margin, Math.min(left, window.innerWidth - width - margin));
    let top = rect.bottom + 8;
    const height = pop.offsetHeight;
    if (top + height > window.innerHeight - margin) top = Math.max(margin, rect.top - height - 8);
    pop.style.left = `${Math.round(left)}px`;
    pop.style.top = `${Math.round(top)}px`;
  }

  function openAccountMenu() {
    const btn = headerActions.querySelector("[data-act=account-menu]");
    const pop = headerActions.querySelector(".acct-menu");
    if (!btn || !pop) return;
    pop.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    placeAccountMenu();
  }

  function closeAccountMenu() {
    const btn = headerActions.querySelector("[data-act=account-menu]");
    const pop = headerActions.querySelector(".acct-menu");
    if (pop) pop.hidden = true;
    if (btn) btn.setAttribute("aria-expanded", "false");
  }

  function toggleAccountMenu() {
    const pop = headerActions.querySelector(".acct-menu");
    if (!pop || !pop.hidden) closeAccountMenu();
    else openAccountMenu();
  }

  let phoneFooterLocked = false;
  let lastScrollY = window.scrollY;
  let listsFooterTimer = 0;

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
    const list = app.querySelector("[data-role=film-list]");
    if (list) return list.scrollHeight > list.clientHeight + 8;
    const header = document.querySelector(".site-header");
    const headerH = header ? header.offsetHeight : 0;
    const contentH = app ? app.scrollHeight : 0;
    return headerH + contentH > window.innerHeight + 8;
  }

  function bindFilmListScroll() {
    const list = app.querySelector("[data-role=film-list]");
    if (!list) return;
    let last = list.scrollTop;
    list.addEventListener("scroll", () => {
      dismissWatchSwipeHint();
      const y = list.scrollTop;
      onScrollDir(y - last, list);
      last = y;
    }, { passive: true });
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
    if (state.screen === "lists") {
      phoneFooterLocked = !contentOverflows();
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
      state.watchSheet === "zufall" ? "zufall"
      : state.screen === "discover" ? "entdecken"
      : state.screen === "lists" ? "lists"
      : ""
    );
    footer.querySelectorAll("[data-nav]").forEach((btn) => {
      btn.setAttribute("aria-current", btn.dataset.nav === current ? "page" : "false");
    });
    const zufallBtn = footer.querySelector("[data-nav=zufall]");
    if (zufallBtn) {
      const empty = !footerZufallEnabled();
      zufallBtn.disabled = empty;
      zufallBtn.setAttribute("aria-disabled", empty ? "true" : "false");
      zufallBtn.title = empty ? "Mind. 1 Film" : "Zufallswahl";
    }
    paintFooterZufallIcon();
    paintFooterListenIcon();
    if (isDesktopNav()) setPhoneFooterOpen(true);
  }

  const HERO_IDS = { left: "t120", center: "t557", right: "t155" };

  const loginUi = {
    autoPlayed: false,
    hintShown: false,
    posters: [],
    items: [],
    angle: 0,
    vel: 0,
    mode: "idle",
    raf: 0,
    lastTs: 0,
    drag: null,
    root: null,
    ring: null,
    covers: null,
    metrics: { radius: 126, tilt: -20, hide: 48 },
    unbind: null,
    reduced: false,
    ro: null,
  };

  const LOGIN_CAROUSEL_BASE_RADIUS = 126;
  const LOGIN_CAROUSEL_IDLE_H = 224;
  const LOGIN_CAROUSEL_IDLE_H_WIDE = 248;
  const LOGIN_CAROUSEL_IDLE_SCALE = 1.5;
  const LOGIN_CAROUSEL_IDLE_SCALE_WIDE = 1.62;
  const LOGIN_CAROUSEL_MIN_H = 132;

  function loginIdleCarouselHeight() {
    return window.matchMedia("(min-width: 640px)").matches
      ? LOGIN_CAROUSEL_IDLE_H_WIDE
      : LOGIN_CAROUSEL_IDLE_H;
  }

  function loginIdleCarouselScale() {
    return window.matchMedia("(min-width: 640px)").matches
      ? LOGIN_CAROUSEL_IDLE_SCALE_WIDE
      : LOGIN_CAROUSEL_IDLE_SCALE;
  }

  function loginCarouselScale(height) {
    const idleH = loginIdleCarouselHeight();
    const idleScale = loginIdleCarouselScale();
    const h = height || idleH;
    if (h >= idleH - 8) return idleScale;
    return h / 200;
  }

  const zufallUi = {
    posters: [],
    isFiller: [],
    items: [],
    pool: [],
    angle: 0,
    vel: 0,
    mode: "idle",
    phase: "idle",
    raf: 0,
    spinRaf: 0,
    lastTs: 0,
    drag: null,
    root: null,
    ring: null,
    covers: null,
    metrics: { radius: 168, tilt: -20, hide: 46 },
    unbind: null,
    reduced: false,
    frontLocked: false,
    front: null,
    skipTimer: 0,
    mountSeq: 0,
  };

  function posterThumb(url, size) {
    return String(url || "").replace(/\/w\d+\//, `/${size}/`);
  }

  function arrangeCarouselPosters(films) {
    const usable = (films || []).filter((film) => film && film.poster);
    const take = (id) => usable.find((film) => filmId(film) === id);
    const left = take(HERO_IDS.left);
    const center = take(HERO_IDS.center);
    const right = take(HERO_IDS.right);
    const rest = usable.filter((film) => {
      const id = filmId(film);
      return id !== HERO_IDS.left && id !== HERO_IDS.center && id !== HERO_IDS.right;
    });
    if (left && center && right) return [center, right, ...rest, left];
    return usable.slice();
  }

  function packCarouselPosters(films) {
    const arranged = arrangeCarouselPosters(films);
    const target = 96;
    if (!arranged.length) return arranged;
    if (arranged.length >= target) return arranged.slice(0, target);
    const packed = arranged.slice();
    const mid = arranged.slice(2, Math.max(2, arranged.length - 1));
    const extras = mid.length ? mid : arranged;
    let i = 0;
    const insertAt = Math.max(2, packed.length - 1);
    while (packed.length < target) {
      packed.splice(insertAt + i, 0, extras[i % extras.length]);
      i += 1;
    }
    return packed;
  }

  const loginPosterImages = new Map();
  let loginPosterPreload = null;
  let loginMountSeq = 0;

  function loginPosterSrc(film) {
    return film && film.poster ? String(film.poster) : "";
  }

  function loginPosterReady(url) {
    const img = loginPosterImages.get(url);
    return !!(img && img.complete && img.naturalWidth);
  }

  function preloadLoginImage(url) {
    if (!url) return Promise.resolve(false);
    const existing = loginPosterImages.get(url);
    if (existing && existing.complete && existing.naturalWidth) return Promise.resolve(true);
    return new Promise((resolve) => {
      const img = existing || new Image();
      img.referrerPolicy = "no-referrer";
      const finish = (ok) => resolve(!!ok);
      img.onload = () => {
        const decode = typeof img.decode === "function" ? img.decode() : Promise.resolve();
        decode.then(() => finish(img.naturalWidth > 0), () => finish(img.naturalWidth > 0));
      };
      img.onerror = () => finish(false);
      loginPosterImages.set(url, img);
      img.src = url;
    });
  }

  function ensureLoginPostersPreloaded() {
    if (!loginPosterPreload) {
      loginPosterPreload = Promise.all(LOGIN_POSTERS.map(async (row) => {
        const ok = await preloadLoginImage(row.poster);
        return ok ? row : null;
      })).then((rows) => rows.filter(Boolean));
    }
    return loginPosterPreload;
  }

  function carouselMetrics(explicitH) {
    const box = loginUi.root ? loginUi.root.getBoundingClientRect() : null;
    const h = explicitH || (box && box.height) || loginIdleCarouselHeight();
    const scale = loginCarouselScale(h);
    const maxRadius = box && box.width
      ? Math.max(96, Math.floor(box.width / 2) - 8)
      : LOGIN_CAROUSEL_BASE_RADIUS;
    return {
      radius: Math.min(maxRadius, Math.round(LOGIN_CAROUSEL_BASE_RADIUS * scale)),
      tilt: -20,
      hide: 48,
      scale,
    };
  }

  function applyCarouselScale(explicitH) {
    if (!loginUi.root) return;
    const metrics = carouselMetrics(explicitH);
    loginUi.metrics = metrics;
    loginUi.root.style.setProperty("--login-scale", metrics.scale.toFixed(4));
    const inner = loginUi.root.querySelector(".login-carousel-inner");
    if (inner) {
      const persp = `${Math.round(820 * metrics.scale)}px`;
      inner.style.perspective = persp;
      inner.style.webkitPerspective = persp;
    }
  }

  function clearLoginViewport() {
    ["--login-pad-bottom", "--login-vvh", "--login-vv-y", "--login-header-h"].forEach((prop) => {
      document.documentElement.style.removeProperty(prop);
    });
  }

  function syncLoginViewport() {
    if (state.screen !== "login") {
      clearLoginViewport();
      return;
    }
    const vv = window.visualViewport;
    const visH = vv ? vv.height : window.innerHeight;
    const header = document.querySelector(".site-header");
    const form = app.querySelector("[data-role=login-form]");
    const headerH = header ? header.getBoundingClientRect().height : 56;
    const formH = form ? Math.ceil(form.getBoundingClientRect().height) : 154;
    const inset = vv ? Math.max(0, window.innerHeight - visH) : 0;
    const idleH = loginIdleCarouselHeight();
    const room = visH - headerH - formH - 2 - 8;
    const tight = inset > 80 || room < idleH + 12;
    const padBottom = tight ? 6 : 12;
    const root = document.documentElement;
    root.style.setProperty("--login-header-h", `${Math.round(headerH)}px`);
    root.style.setProperty("--login-pad-bottom", `${padBottom}px`);
    root.style.setProperty("--login-vvh", `${Math.round(visH)}px`);
    root.style.setProperty("--login-vv-y", `${vv ? Math.round(vv.offsetTop) : 0}px`);
    window.scrollTo(0, 0);
    const apply = () => {
      if (!loginUi.root) return;
      applyCarouselScale(loginUi.root.getBoundingClientRect().height);
      paintLoginCarousel();
    };
    apply();
    window.requestAnimationFrame(apply);
  }

  function wrapDeg(deg) {
    const x = ((deg % 360) + 360) % 360;
    return x > 180 ? x - 360 : x;
  }

  function setCover(el, film) {
    if (!el) return;
    const src = loginPosterSrc(film);
    if (!src || !loginPosterReady(src)) {
      el.style.backgroundImage = "";
      el.title = "";
      return;
    }
    el.style.backgroundImage = `url("${src}")`;
    el.title = film && film.title ? film.title : "";
  }

  function carouselFrontIndex(ui) {
    const n = ui.posters.length;
    if (!n) return 0;
    const step = 360 / n;
    let idx = Math.round(((-ui.angle / step) % n));
    if (idx < 0) idx += n;
    return idx;
  }

  function paintCarouselView(ui) {
    const n = ui.items.length;
    if (!n) return;
    const { radius, tilt, hide } = ui.metrics;
    const spin = ui.angle;
    const step = 360 / n;
    const fade = 10;
    if (ui.ring) {
      ui.ring.style.transform = `rotateX(${tilt}deg)`;
    }
    const flags = ui.isFiller || [];
    for (let i = 0; i < n; i += 1) {
      const deg = (i * step) + spin;
      const facing = Math.abs(wrapDeg(deg));
      let vis = 1;
      if (facing < hide - fade) vis = 0;
      else if (facing < hide) vis = (facing - (hide - fade)) / fade;
      if (flags[i]) vis *= 0.48;
      const el = ui.items[i];
      el.style.transform = `translate(-50%, -50%) rotateY(${deg.toFixed(2)}deg) translateZ(${radius}px) rotateY(${(-deg).toFixed(2)}deg)`;
      el.style.opacity = vis.toFixed(3);
      el.style.zIndex = String(10 + Math.round((180 - facing) / 4));
    }
    const posters = ui.posters;
    const pCount = posters.length;
    if (!pCount || !ui.covers) return;
    let leftFilm;
    let centerFilm;
    let rightFilm;
    if (ui.frontLocked && ui.front) {
      leftFilm = ui.front.left;
      centerFilm = ui.front.center;
      rightFilm = ui.front.right;
    } else if (ui.pool && ui.pool.length) {
      const trio = tripletAt(carouselFrontIndex(ui));
      leftFilm = trio.left;
      centerFilm = trio.center;
      rightFilm = trio.right;
    } else {
      const idx = carouselFrontIndex(ui);
      const at = (delta) => posters[(idx + delta + pCount) % pCount];
      leftFilm = at(-1);
      centerFilm = at(0);
      rightFilm = at(1);
    }
    setCover(ui.covers.left, leftFilm);
    setCover(ui.covers.center, centerFilm);
    setCover(ui.covers.right, rightFilm);
    if (ui.covers.center) {
      ui.covers.center.classList.toggle("is-rest", ui.mode === "idle" && !ui.frontLocked);
    }
  }

  function paintLoginCarousel() {
    paintCarouselView(loginUi);
  }

  function onCarouselResize() {
    syncLoginViewport();
  }

  function maybeSwipeHint() {
    if (loginUi.hintShown || loginUi.mode !== "idle") return;
    try {
      if (sessionStorage.getItem("wdq.loginSwipeHint")) {
        loginUi.hintShown = true;
        return;
      }
      sessionStorage.setItem("wdq.loginSwipeHint", "1");
    } catch {
      /* private mode */
    }
    loginUi.hintShown = true;
    if (loginUi.reduced) return;
    const hint = loginUi.root && loginUi.root.querySelector("[data-role=login-hint]");
    const inner = loginUi.root && loginUi.root.querySelector(".login-carousel-inner");
    if (hint) {
      hint.hidden = false;
      hint.classList.add("is-on");
      window.setTimeout(() => {
        hint.classList.remove("is-on");
        hint.hidden = true;
      }, 2200);
    }
    if (inner) {
      inner.classList.add("is-hinting");
      window.setTimeout(() => inner.classList.remove("is-hinting"), 1300);
    }
  }

  function finishCarouselRest() {
    loginUi.vel = 0;
    loginUi.mode = "idle";
    paintLoginCarousel();
    maybeSwipeHint();
  }

  function snapCarouselToStep(ui, paint, onRest) {
    const n = ui.posters.length;
    if (!n) {
      onRest();
      return;
    }
    const step = 360 / n;
    const target = Math.round(ui.angle / step) * step;
    const from = ui.angle;
    if (ui.reduced || Math.abs(target - from) < 0.25) {
      ui.angle = target;
      onRest();
      return;
    }
    ui.mode = "snap";
    const t0 = performance.now();
    const dur = 260;
    function stepSnap(now) {
      if (ui.mode !== "snap") return;
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - ((1 - p) * (1 - p));
      ui.angle = from + ((target - from) * e);
      paint();
      if (p < 1) requestAnimationFrame(stepSnap);
      else {
        ui.angle = target;
        onRest();
      }
    }
    requestAnimationFrame(stepSnap);
  }

  function ensureCarouselCoast(ui, paint, snapFn) {
    if (ui.raf) return;
    ui.lastTs = 0;
    ui.raf = requestAnimationFrame(function loop(ts) {
      ui.raf = 0;
      if (ui.mode !== "coast") return;
      if (!ui.lastTs) ui.lastTs = ts;
      const dt = Math.min(0.034, (ts - ui.lastTs) / 1000);
      ui.lastTs = ts;
      const decel = 215;
      const v = ui.vel;
      if (Math.abs(v) < 10) {
        snapFn();
        return;
      }
      const sign = v < 0 ? -1 : 1;
      ui.vel = v - (sign * decel * dt);
      if (ui.vel * v < 0) ui.vel = 0;
      ui.angle += ui.vel * dt;
      paint();
      if (ui.mode === "coast") {
        ui.raf = requestAnimationFrame(loop);
      }
    });
  }

  function snapLoginCarousel() {
    snapCarouselToStep(loginUi, paintLoginCarousel, finishCarouselRest);
  }

  function ensureCoastLoop() {
    ensureCarouselCoast(loginUi, paintLoginCarousel, snapLoginCarousel);
  }

  function startAutoSpin() {
    if (loginUi.reduced) {
      loginUi.angle = 0;
      finishCarouselRest();
      return;
    }
    const start = -540;
    const end = 0;
    const dur = 3100;
    const t0 = performance.now();
    loginUi.mode = "auto";
    loginUi.angle = start;
    paintLoginCarousel();
    function step(now) {
      if (loginUi.mode !== "auto") return;
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - ((1 - p) ** 3);
      loginUi.angle = start + ((end - start) * e);
      paintLoginCarousel();
      if (p < 1) requestAnimationFrame(step);
      else {
        loginUi.angle = 0;
        finishCarouselRest();
      }
    }
    requestAnimationFrame(step);
  }

  function bindCarouselPointer(ui, root, hooks) {
    hooks = hooks || {};
    const paint = () => {
      if (hooks.paint) hooks.paint();
      else paintCarouselView(ui);
    };
    const onDown = (ev) => {
      if (ev.pointerType === "mouse" && ev.button !== 0) return;
      if (hooks.canDrag && !hooks.canDrag()) return;
      ui.mode = "drag";
      ui.vel = 0;
      ui.drag = {
        id: ev.pointerId,
        x: ev.clientX,
        lastX: ev.clientX,
        lastT: performance.now(),
        samples: [],
        moved: false,
      };
      if (root.setPointerCapture) root.setPointerCapture(ev.pointerId);
      if (hooks.onDragStart) hooks.onDragStart();
    };
    const onMove = (ev) => {
      if (!ui.drag || ev.pointerId !== ui.drag.id) return;
      const dx = ev.clientX - ui.drag.lastX;
      if (Math.abs(ev.clientX - ui.drag.x) > 3) {
        if (!ui.drag.moved && hooks.onUserSpin) hooks.onUserSpin();
        ui.drag.moved = true;
      }
      const now = performance.now();
      ui.angle += dx * 0.44;
      ui.drag.samples.push({ dx, dt: now - ui.drag.lastT, t: now });
      if (ui.drag.samples.length > 7) ui.drag.samples.shift();
      ui.drag.lastX = ev.clientX;
      ui.drag.lastT = now;
      paint();
      ev.preventDefault();
    };
    const onUp = (ev) => {
      if (!ui.drag || ev.pointerId !== ui.drag.id) return;
      const samples = ui.drag.samples;
      const moved = ui.drag.moved;
      ui.drag = null;
      if (!moved) {
        if (hooks.onRest) hooks.onRest({ moved: false });
        return;
      }
      if (hooks.onUserSpin) hooks.onUserSpin();
      const cutoff = performance.now() - 130;
      const recent = samples.filter((s) => s.dt > 0 && s.t >= cutoff);
      const use = recent.length ? recent : samples.filter((s) => s.dt > 0);
      let vx = 0;
      if (use.length) {
        const dx = use.reduce((sum, s) => sum + s.dx, 0);
        const dt = use.reduce((sum, s) => sum + s.dt, 0);
        vx = dt ? (dx / dt) * 1000 : 0;
      }
      let vel = vx * 0.36;
      vel = Math.max(-800, Math.min(800, vel));
      if (Math.abs(vel) < 20) {
        if (hooks.snap) hooks.snap();
        return;
      }
      ui.vel = vel;
      ui.mode = "coast";
      if (hooks.coast) hooks.coast();
    };
    root.addEventListener("pointerdown", onDown);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerup", onUp);
    root.addEventListener("pointercancel", onUp);
    return () => {
      root.removeEventListener("pointerdown", onDown);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointercancel", onUp);
    };
  }

  function teardownLoginCarousel() {
    if (loginUi.root) loginUi.root.classList.remove("is-ready");
    if (loginUi.unbind) loginUi.unbind();
    loginUi.unbind = null;
    if (loginUi.ro) {
      loginUi.ro.disconnect();
      loginUi.ro = null;
    }
    if (loginUi.raf) cancelAnimationFrame(loginUi.raf);
    loginUi.raf = 0;
    loginUi.root = null;
    loginUi.ring = null;
    loginUi.items = [];
    loginUi.covers = null;
    loginUi.drag = null;
    loginUi.mode = "idle";
    loginUi.vel = 0;
    window.removeEventListener("resize", onCarouselResize);
    if (window.visualViewport) {
      window.visualViewport.removeEventListener("resize", onCarouselResize);
      window.visualViewport.removeEventListener("scroll", onCarouselResize);
    }
    clearLoginViewport();
  }

  async function mountLoginCarousel() {
    const root = app.querySelector("[data-role=login-carousel]");
    if (!root) return;
    if (loginUi.root === root && loginUi.items.length) return;
    const seq = ++loginMountSeq;
    teardownLoginCarousel();
    loginUi.root = root;
    loginUi.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.classList.remove("is-ready");
    const readyPosters = await ensureLoginPostersPreloaded();
    if (seq !== loginMountSeq) return;
    if (state.screen !== "login" || app.querySelector("[data-role=login-carousel]") !== root) return;
    if (!readyPosters.length) return;
    const ring = root.querySelector("[data-role=login-ring]");
    loginUi.ring = ring;
    loginUi.posters = packCarouselPosters(readyPosters).filter((film) => loginPosterReady(loginPosterSrc(film)));
    loginUi.items = [];
    if (ring) {
      const frag = document.createDocumentFragment();
      for (const film of loginUi.posters) {
        const src = loginPosterSrc(film);
        const el = document.createElement("div");
        el.className = "login-ring-item";
        el.style.backgroundImage = `url("${src}")`;
        frag.appendChild(el);
        loginUi.items.push(el);
      }
      ring.innerHTML = "";
      ring.appendChild(frag);
    }
    loginUi.covers = {
      left: root.querySelector("[data-role=cover-left]"),
      center: root.querySelector("[data-role=cover-center]"),
      right: root.querySelector("[data-role=cover-right]"),
    };
    applyCarouselScale();
    loginUi.unbind = bindCarouselPointer(loginUi, root, {
      paint: paintLoginCarousel,
      onRest: finishCarouselRest,
      snap: snapLoginCarousel,
      coast: ensureCoastLoop,
    });
    window.addEventListener("resize", onCarouselResize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", onCarouselResize);
      window.visualViewport.addEventListener("scroll", onCarouselResize);
    }
    if (typeof ResizeObserver === "function") {
      loginUi.ro = new ResizeObserver(() => {
        applyCarouselScale();
        paintLoginCarousel();
      });
      loginUi.ro.observe(root);
    }
    syncLoginViewport();
    root.classList.add("is-ready");
    if (!loginUi.autoPlayed) {
      loginUi.autoPlayed = true;
      startAutoSpin();
    } else {
      loginUi.angle = 0;
      finishCarouselRest();
    }
  }

  function paintLoginError() {
    const box = app.querySelector("[data-role=login-error]");
    if (!box) return;
    if (state.loginError) {
      box.hidden = false;
      box.textContent = state.loginError;
    } else {
      box.hidden = true;
      box.textContent = "";
    }
  }

  function validateLoginNameBlur() {
    const name = state.loginName.trim();
    if (!name) {
      state.loginError = "Bitte einen Benutzernamen eingeben.";
      paintLoginError();
      return;
    }
    if (state.authMode === "register") {
      const taken = users().some((u) => u.login.toLowerCase() === name.toLowerCase());
      if (taken) {
        state.loginError = "Dieser Login ist schon vergeben.";
        paintLoginError();
        return;
      }
    }
    if (
      state.loginError === "Bitte einen Benutzernamen eingeben."
      || state.loginError === "Dieser Login ist schon vergeben."
    ) {
      state.loginError = "";
      paintLoginError();
    }
  }

  function bindLoginChrome() {
    const form = app.querySelector("[data-role=login-form]");
    if (!form) return;
    form.addEventListener("focusin", () => {
      document.body.classList.add("login-focus");
      window.scrollTo(0, 0);
      syncLoginViewport();
      window.requestAnimationFrame(syncLoginViewport);
    });
    form.addEventListener("focusout", (ev) => {
      if (!form.contains(ev.relatedTarget)) {
        document.body.classList.remove("login-focus");
        window.scrollTo(0, 0);
        syncLoginViewport();
      }
    });
  }

  function renderMigrateDialog() {
    const busy = state.migrateBusy;
    return `<div class="migrate-backdrop" data-role="migrate-dialog">
      <div class="migrate-card" role="dialog" aria-modal="true" aria-labelledby="migrate-title">
        <div class="migrate-icon" aria-hidden="true">☁️</div>
        <h2 id="migrate-title">Deine Filme auf diesem Gerät in dein Online-Konto übernehmen?</h2>
        <p class="migrate-copy">Vor dem Hochladen wird automatisch eine Sicherungsdatei gespeichert. Danach sind deine Listen auch am PC verfügbar.</p>
        <div class="migrate-actions">
          <button type="button" class="btn btn-primary" data-act="migrate-upload" ${busy ? "disabled" : ""}>${busy ? "Wird hochgeladen …" : "Hochladen"}</button>
          <button type="button" class="migrate-later" data-act="migrate-later" ${busy ? "disabled" : ""}>Später</button>
        </div>
      </div>
    </div>`;
  }

  function renderLoginForm() {
    const register = state.authMode === "register";
    const cloudOk = cloudSyncAvailable();
    const cloudOn = cloudOk && state.cloudSyncOn;
    return `
      <form class="login-form" data-act="auth-form" data-role="login-form">
        <label class="login-field">
          <span class="login-field-icon">${ICONS.person}</span>
          <input data-act="login-name" name="login" autocomplete="username" placeholder="Benutzername" value="${escapeHtml(state.loginName)}" enterkeyhint="next" ${state.authBusy ? "disabled" : ""}>
        </label>
        <label class="login-field">
          <span class="login-field-icon">${ICONS.lock}</span>
          <input data-act="login-pass" name="password" type="password" autocomplete="${register ? "new-password" : "current-password"}" placeholder="Passwort" value="${escapeHtml(state.loginPass)}" enterkeyhint="go" ${state.authBusy ? "disabled" : ""}>
          <button type="button" class="login-eye" data-act="toggle-pass" aria-label="Passwort anzeigen" aria-pressed="false">${ICONS.eye}</button>
        </label>
        ${cloudOk ? `
        <label class="login-cloud-row">
          <span>Mit Cloud synchronisieren</span>
          <button type="button" class="login-cloud-switch${cloudOn ? " is-on" : ""}" data-act="cloud-toggle" role="switch" aria-checked="${cloudOn ? "true" : "false"}" aria-label="Mit Cloud synchronisieren" ${state.authBusy ? "disabled" : ""}>
            <span class="login-cloud-knob"></span>
          </button>
        </label>` : ""}
        <p class="error" data-role="login-error"${state.loginError ? "" : " hidden"}>${escapeHtml(state.loginError)}</p>
        <div class="login-actions">
          <button type="submit" class="btn btn-primary login-submit" data-act="auth-submit" ${state.authBusy ? "disabled" : ""}>
            ${state.authBusy ? "Einen Moment …" : (register ? "Konto anlegen" : "Anmelden")}
          </button>
          <button type="button" class="login-alt" data-act="auth-toggle" ${state.authBusy ? "disabled" : ""}>
            ${register ? "Anmelden" : "Registrieren"}
          </button>
        </div>
        ${cloudOn ? `
        <p class="login-cloud-hint">${ICONS.cloud}<span>Konto wird online gesichert</span></p>` : ""}
        <div class="login-backup-row">
          <button type="button" class="login-backup-btn" data-act="backup-export" ${state.authBusy ? "disabled" : ""}>Daten sichern</button>
          <button type="button" class="login-backup-btn" data-act="backup-import" ${state.authBusy ? "disabled" : ""}>Sicherung laden</button>
        </div>
      </form>
    `;
  }

  function renderLogin() {
    return `
      <section class="login-screen">
        <div class="login-carousel" data-role="login-carousel" aria-hidden="true">
          <div class="login-carousel-inner">
            <div class="login-carousel-stage">
              <div class="login-carousel-ring" data-role="login-ring"></div>
            </div>
            <div class="login-carousel-front">
              <div class="login-cover login-cover-side login-cover-left" data-role="cover-left"></div>
              <div class="login-cover login-cover-center" data-role="cover-center"></div>
              <div class="login-cover login-cover-side login-cover-right" data-role="cover-right"></div>
            </div>
          </div>
          <div class="login-swipe-hint" data-role="login-hint" hidden>
            <span class="login-swipe-arrows"></span>
          </div>
        </div>
        ${renderLoginForm()}
      </section>
    `;
  }

  function renderProfiles() {
    const rows = profilesOf(state.user.id).map((p) => `
      <div class="card menu-card">
        <button type="button" class="avatar-hit" data-act="pick-profile" data-id="${p.id}" aria-label="${escapeHtml(p.name)}">${profilePlateHtml(p, "row")}</button>
        <button type="button" data-act="pick-profile" data-id="${p.id}" style="all:unset;cursor:pointer">
          <strong>${escapeHtml(p.name)}</strong>
        </button>
        <span class="menu-actions">
          <button type="button" class="menu-side" data-act="edit-profile" data-id="${p.id}" aria-label="Profil bearbeiten" title="Bearbeiten">${ICONS.edit}</button>
          <button type="button" class="menu-side danger" data-act="ask-delete-profile" data-id="${p.id}" aria-label="Profil löschen" title="Löschen">×</button>
        </span>
      </div>
    `).join("");
    return `
      <h2 class="screen-title home-title">Wer schaut</h2>
      <section class="stack">
        ${rows}
        <button type="button" class="card menu-card add-entity" data-act="add-profile">
          <span class="plus-circle">${ICONS.plus}</span>
          <strong>Profil hinzufügen</strong>
          <span></span>
        </button>
      </section>
    `;
  }

  function editorCoverLabel() {
    const cover = normalizeCover(state.addCover);
    return cover && cover.title ? cover.title : "Katalog-Cover";
  }

  function coverPickButton(film, compact) {
    const id = filmId(film);
    const on = !!(state.addCover && state.addCover.id === id);
    const src = posterUrl(film, compact ? "w185" : "w92") || film.poster || "";
    const title = film.title || "Cover";
    if (compact) {
      return `<button type="button" class="cover-pick${on ? " is-on" : ""}" data-act="pick-cover" data-id="${escapeHtml(id)}" aria-label="${escapeHtml(title)}" aria-pressed="${on ? "true" : "false"}"><img src="${escapeHtml(src)}" alt="" width="48" height="72" decoding="async" referrerpolicy="no-referrer"></button>`;
    }
    return `<button type="button" class="cover-pick cover-pick-row${on ? " is-on" : ""}" data-act="pick-cover" data-id="${escapeHtml(id)}" aria-pressed="${on ? "true" : "false"}"><img src="${escapeHtml(src)}" alt="" width="36" height="54" decoding="async" referrerpolicy="no-referrer"><span>${escapeHtml(title)}</span></button>`;
  }

  function coverHitsHtml() {
    const query = state.coverQuery.trim();
    if (!query) {
      const picks = LOGIN_POSTERS.slice(0, 10).map((film) => coverPickButton(film, true)).join("");
      return `<div class="cover-quick" data-role="cover-hits">${picks}</div>`;
    }
    if (state.coverStatus === "loading" && !(state.coverHits || []).length) {
      return `<div class="cover-hits" data-role="cover-hits"><p class="hint">Suche …</p></div>`;
    }
    if (!(state.coverHits || []).length) {
      return `<div class="cover-hits" data-role="cover-hits"><p class="hint">Kein Film gefunden.</p></div>`;
    }
    return `<div class="cover-hits" data-role="cover-hits">${state.coverHits.slice(0, 6).map((film) => coverPickButton(film, false)).join("")}</div>`;
  }

  function paintCoverHits() {
    const box = app.querySelector("[data-role=cover-results]");
    if (box) box.innerHTML = coverHitsHtml();
    const tagBox = app.querySelector("[data-role=tag-cover-hits]");
    if (tagBox) tagBox.innerHTML = tagCoverHitsHtml();
  }

  function paintProfileLetters() {
    const root = app.querySelector("[data-role=profile-editor]");
    if (!root) return;
    const letter = profileInitial(state.addName);
    root.querySelectorAll(".acct-letter-rim, .acct-letter-fill").forEach((el) => {
      el.textContent = letter;
    });
  }

  let coverTimer = 0;
  let coverSeq = 0;

  function uniqueCoverHits(films) {
    const seen = new Set();
    const out = [];
    for (const film of films || []) {
      if (!film || !film.title || !film.poster) continue;
      const key = foldSearch(film.title);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(film);
    }
    return out;
  }

  function scheduleCoverSearch(query) {
    window.clearTimeout(coverTimer);
    coverSeq += 1;
    const q = String(query || "").trim();
    const seq = coverSeq;
    if (!q) {
      state.coverHits = [];
      state.coverStatus = "";
      paintCoverHits();
      return;
    }
    state.coverStatus = "loading";
    if (!(state.coverHits || []).length) paintCoverHits();
    coverTimer = window.setTimeout(() => {
      runCoverSearch(q, seq);
    }, 180);
  }

  async function runCoverSearch(query, seq) {
    if (!state.catalog.length) {
      try { await loadCatalog(); } catch { /* keep the local pool */ }
    }
    if (seq !== coverSeq) return;
    const pool = rankSearchFilms(allKnownFilms(), query);
    const ranked = uniqueCoverHits(pool);
    let hits = ranked.slice(0, 6);
    if (remoteSearchAvailable() && localTitleSearchIsThin(pool, query)) {
      try {
        const data = await proxyFetch("/search/movie", { query });
        if (seq !== coverSeq) return;
        const remote = (data.results || []).map(fromTmdbMovie).filter((film) => film && film.title);
        remote.forEach((film) => rememberFilm(film));
        const merged = [];
        const seen = new Set();
        for (const film of ranked.concat(remote)) {
          const id = filmId(film);
          if (!id || seen.has(id)) continue;
          seen.add(id);
          merged.push(film);
        }
        hits = uniqueCoverHits(rankSearchFilms(merged, query, true)).slice(0, 6);
      } catch {
        if (seq !== coverSeq) return;
      }
    }
    if (seq !== coverSeq) return;
    state.coverHits = hits;
    state.coverStatus = hits.length ? "ok" : "empty";
    paintCoverHits();
  }

  function openProfileEditor(profile) {
    state.editingProfileId = profile ? profile.id : null;
    state.addName = profile ? profile.name : "";
    state.addPlate = normalizePlate(profile && profile.plate);
    state.addCover = profile ? profileCoverRecord(profile) : null;
    state.coverQuery = "";
    state.coverHits = [];
    state.coverStatus = "";
    state.screen = "profile-add";
    render();
  }

  function filmForCoverPick(id) {
    const hit = (state.coverHits || []).find((row) => filmId(row) === id);
    if (hit) return hit;
    const login = LOGIN_POSTERS.find((row) => filmId(row) === id);
    if (login) return login;
    return findFilm(id);
  }

  function saveProfileEditor() {
    const name = state.addName.trim();
    if (!name || !state.user) return;
    const list = profilesOf(state.user.id);
    const plate = normalizePlate(state.addPlate);
    const cover = normalizeCover(state.addCover);
    let id = state.editingProfileId;
    if (id) {
      const idx = list.findIndex((row) => row.id === id);
      if (idx < 0) return;
      const copy = Object.assign({}, list[idx], { name, plate });
      if (cover) copy.cover = cover;
      else delete copy.cover;
      list[idx] = copy;
    } else {
      id = `p-${Date.now()}`;
      const row = { id, name, plate };
      if (cover) row.cover = cover;
      list.push(row);
    }
    saveProfiles(state.user.id, list);
    const favKey = `wdq.p.${state.user.id}.${id}.favorite`;
    if (cover && cover.id) saveJson(favKey, cover);
    else localStorage.removeItem(favKey);
    state.editingProfileId = null;
    state.screen = "profiles";
    render();
  }

  function renderProfileAdd() {
    const letter = profileInitial(state.addName);
    const preview = accountPlateHtml({
      plate: state.addPlate,
      letter,
      cover: state.addCover,
      size: "preview",
    });
    const plates = PLATE_CHOICES.map((choice) => {
      const on = state.addPlate === choice.id;
      const label = choice.sub
        ? `<span class="plate-pick-label">${escapeHtml(choice.label)}<span>${escapeHtml(choice.sub)}</span></span>`
        : `<span class="plate-pick-label">${escapeHtml(choice.label)}</span>`;
      const aria = choice.sub ? `${choice.label} ${choice.sub}` : choice.label;
      return `
        <button type="button" class="plate-pick" data-act="pick-plate" data-id="${choice.id}" aria-pressed="${on ? "true" : "false"}" aria-label="${escapeHtml(aria)}">
          ${accountPlateHtml({ plate: choice.id, letter, cover: state.addCover, size: "pick" })}
          ${label}
        </button>
      `;
    }).join("");
    const title = state.editingProfileId ? "Profil bearbeiten" : "Profil hinzufügen";
    return `
      <h2 class="screen-title home-title">${title}</h2>
      <section class="card auth-card profile-add-card" data-role="profile-editor">
        <div class="profile-preview">
          ${preview}
          <p class="profile-cover-name">${escapeHtml(editorCoverLabel())}</p>
        </div>
        <input class="glow-input" data-act="add-name" value="${escapeHtml(state.addName)}" maxlength="40" placeholder="Name" aria-label="Name">
        <p class="hint avatar-pick-label">Platte</p>
        <div class="plate-grid">${plates}</div>
        <p class="hint avatar-pick-label">Cover</p>
        <input class="glow-input cover-search" data-act="cover-search" value="${escapeHtml(state.coverQuery)}" placeholder="Lieblingsfilm suchen" aria-label="Lieblingsfilm suchen" autocomplete="off" enterkeyhint="search">
        <div data-role="cover-results">${coverHitsHtml()}</div>
        <button type="button" class="btn btn-primary btn-save-center" data-act="save-profile">speichern</button>
      </section>
    `;
  }

  function filterCardClass(id, extra, filters) {
    const bag = filters || state.filters;
    return `card filter-card${extra ? ` ${extra}` : ""}${filterCatOn(bag, id) ? " is-on" : ""}`;
  }

  function renderDiscoverFilters(ctx) {
    const isZufall = ctx === "zufall";
    const filters = isZufall ? zufallFiltersDraftBag() : state.filters;
    const fill = dauerFill(filters.dauer);
    const genreItems = genrePicks.map((g) => ({
      act: "genre",
      attrs: `data-genre="${escapeHtml(g)}"`,
      label: g,
      on: filters.genres.includes(g),
    }));
    const tagItems = customTags("film").map((t) => ({
      chipHtml: tagChipHtml(t, {
        size: "mini",
        act: "filter-tag",
        attrs: `data-id="${escapeHtml(t.id)}"`,
        pressed: filters.tags.includes(t.id),
      }),
    }));
    const streamItems = STREAMING_CHIPS.map((s) => ({
      act: "filter-stream",
      attrs: `data-id="${s.id}"`,
      label: s.label,
      on: filters.streaming.includes(s.id),
    }));
    const typeItems = TYPE_CHIPS.map((row) => ({
      act: "filter-type",
      attrs: `data-id="${row.id}"`,
      label: row.label,
      on: filters.types.includes(row.id),
    }));
    const selectedActors = (filters.actors || []).map((actor) => `
      <span class="active-chip">
        <span>${escapeHtml(actorFilterLabel(actor))}</span>
        <button type="button" class="active-chip-x" data-act="actor-remove" data-id="${escapeHtml(actor.id)}" aria-label="${escapeHtml(actorFilterLabel(actor))} entfernen">${ICONS.chipX}</button>
      </span>
    `).join("");
    const streamBlock = isZufall ? "" : `
        <div class="${filterCardClass("streaming", "", filters)}" data-cat="streaming">
          <span class="filter-label">Stream</span>
          ${renderOverflowChips("streaming", streamItems)}
        </div>`;
    const similarBlock = isZufall ? "" : `
        <div class="${filterCardClass("similar", "is-similar", filters)}" data-cat="similar">
          <span class="filter-label">Ähnlich wie</span>
          <div class="similar-search-col">
            ${similarHubChips()}
            <button type="button" class="similar-hub-search${(state.filters.similar || []).length ? " is-active" : ""}" data-act="similar-open" aria-haspopup="dialog" aria-label="Filme suchen">
              <span class="sheet-search-icon">${ICONS.search}</span>
              <span>Filme suchen</span>
            </button>
          </div>
        </div>`;
    const moreKey = isZufall ? "zufallF" : "";
    return `
      <div class="filter-stack" data-filter-ctx="${isZufall ? "zufall" : "discover"}">
        <div class="${filterCardClass("dauer", "is-dauer", filters)}" data-cat="dauer">
          <span class="filter-label">Dauer</span>
          <div class="dauer-controls">
            <input class="filigree${filters.dauerOn ? "" : " idle"}" data-act="dauer" type="range" min="60" max="210" step="5" value="${filters.dauer}" style="--fill:${fill}%" aria-label="Maximale Dauer">
            <span class="dauer-value" data-role="dauer-value">${dauerLabel(filters.dauer)}</span>
          </div>
        </div>
        <div class="${filterCardClass("genre", "", filters)}" data-cat="genre">
          <span class="filter-label">Genre</span>
          ${renderOverflowChips(isZufall ? "zufallFGenre" : "genre", genreItems)}
        </div>
        <div class="${filterCardClass("tags", "", filters)}" data-cat="tags">
          <span class="filter-label">Tags</span>
          ${renderOverflowChips(isZufall ? "zufallFTags" : "tags", tagItems)}
        </div>
        ${streamBlock}
        <div class="${filterCardClass("typ", "", filters)}" data-cat="typ">
          <span class="filter-label">Typ</span>
          ${renderOverflowChips(isZufall ? "zufallFTypes" : "types", typeItems)}
        </div>
        <div class="${filterCardClass("actor", "is-actor", filters)}" data-cat="actor">
          <span class="filter-label">Schauspieler</span>
          <div class="actor-search-col">
            ${selectedActors ? `<div class="active-chip-row">${selectedActors}</div>` : ""}
            <div class="sheet-search-wrap actor-search-wrap">
              <span class="sheet-search-icon">${ICONS.search}</span>
              <input data-act="actor-search" placeholder="Schauspieler suchen" value="${escapeHtml(state.actorQuery)}" autocomplete="off" enterkeyhint="search" aria-label="Schauspieler suchen">
            </div>
            <div class="actor-hits" data-role="actor-hits">${actorHitsHtml()}</div>
          </div>
        </div>
        ${similarBlock}
      </div>
    `;
  }

  function similarCompact(film) {
    if (!film || !film.title) return null;
    const id = filmId(film);
    const tmdb = Number(film.tmdb) || Number(String(id).replace(/^t/i, "")) || 0;
    return {
      id,
      title: film.title,
      tmdb,
      year: Number(film.year) || 0,
      poster: film.poster || "",
    };
  }

  function similarChipsHtml(rows, removeAct) {
    return (rows || []).map((film) => `
      <span class="active-chip is-lava similar-chip">
        <span>${escapeHtml(film.title)}</span>
        <button type="button" class="active-chip-x" data-act="${removeAct}" data-id="${escapeHtml(film.id)}" aria-label="${escapeHtml(film.title)} entfernen">${ICONS.chipX}</button>
      </span>
    `).join("");
  }

  function similarHubChips() {
    const html = similarChipsHtml(state.filters.similar, "similar-remove");
    return html ? `<div class="active-chip-row">${html}</div>` : "";
  }

  function renderDiscoverHub() {
    const active = anyFilterOn() ? renderActiveFilterChips() : "";
    return `
      <section class="home-screen discover-screen">
        <article class="card suggest-hero discover-hero is-shining">
          <button type="button" class="suggest-hero-row discover-hero-hit" data-act="suggest">
            ${entdeckenIconHtml(true)}
            <span class="suggest-hero-copy">
              <strong>Filme vorschlagen</strong>
            </span>
            <span class="discover-hero-play btn-play" aria-hidden="true">${enamelPlayIcon()}</span>
          </button>
          <div data-role="discover-chips">${active}</div>
        </article>
        ${renderDiscoverFilters()}
      </section>
    `;
  }

  function paintDiscoverActiveChips() {
    const slot = app.querySelector("[data-role=discover-chips]");
    if (slot) slot.innerHTML = anyFilterOn() ? renderActiveFilterChips() : "";
    app.querySelectorAll(".filter-card[data-cat]").forEach((card) => {
      card.classList.toggle("is-on", discoverCatOn(card.dataset.cat));
    });
  }

  function anschauenButtonHtml(className, attrs) {
    return `<button type="button" class="btn btn-primary ${className}" ${attrs}><span class="btn-play" aria-hidden="true">${enamelPlayIcon()}</span>Anschauen</button>`;
  }

  function renderSuggestCard(film) {
    film = filmWithPoster(film) || film;
    const id = escapeHtml(filmId(film));
    const hid = filmId(film);
    const open = state.expandedFilmId === hid;
    const runtime = durationPill(film);
    const cast = filmCastLine(film);
    const seen = lastSeenEntry(film);
    const seenDate = seen ? formatSeenOn(seen.at) : "";
    const seenInHead = open && seenDate
      ? `<p class="suggest-seen-inline">Zuletzt gesehen: ${escapeHtml(seenDate)}</p>`
      : "";
    const inlineWatch = open
      ? ""
      : anschauenButtonHtml("suggest-inline-watch film-expand-watch", `data-act="choose" data-id="${id}"`);
    const onWatch = isOnWatchlist(film);
    const inQueue = isOnQueue(film);
    const memberChips = [
      inQueue ? `<span class="chip is-lava">Demnächst</span>` : "",
      onWatch ? `<span class="chip">Watchlist</span>` : "",
    ].filter(Boolean).join("");
    const listsBlock = `
      <div class="film-expand-in">
        <p class="film-expand-in-label">Enthalten in:</p>
        <div class="film-expand-in-chips">${memberChips || `<span class="hint">—</span>`}</div>
      </div>
    `;
    const tags = renderFilmTagChips(film);
    const expand = `
      <div class="film-row-expand"${open ? "" : " hidden"}>
        <div class="suggest-actions">
          ${anschauenButtonHtml("suggest-action suggest-action-watch film-expand-watch", `data-act="choose" data-id="${id}"`)}
          <button type="button" class="btn suggest-action suggest-action-richtung" data-act="richtung" data-id="${id}"><span class="suggest-action-ico" aria-hidden="true">${ICONS.richtung}</span>Passende Richtung</button>
          <button type="button" class="btn suggest-action suggest-action-watchlist" data-act="suggest-watch" data-id="${id}" aria-pressed="${onWatch ? "true" : "false"}"><span class="suggest-action-ico" aria-hidden="true">${onWatch ? ICONS.bookmarkOn : ICONS.bookmark}</span>Watchlist</button>
        </div>
        ${listsBlock}
        <p class="film-expand-in-label">Tags</p>
        <div class="film-expand-tags" data-role="suggest-tags">${tags || `<span class="hint">Noch keine eigenen Tags</span>`}</div>
        <p class="film-expand-in-label">Bewertung</p>
        <div class="film-expand-rates">${renderRates(film, true)}</div>
      </div>
    `;
    const article = `
      <article class="film-row suggest-card is-expandable is-tall swipe-front${open ? " is-open" : ""}" data-id="${id}">
        <div class="film-row-head" data-act="film-expand" data-id="${id}" aria-expanded="${open}">
          ${posterTile(film, { size: POSTER_SIZE_CARD })}
          <div class="film-row-body">
            <div class="film-row-titleline">
              <h3 class="film-row-title">${escapeHtml(film.title)}</h3>
              ${runtime ? `<span class="duration-pill">${escapeHtml(runtime)}</span>` : ""}
            </div>
            ${seenInHead}
            ${cast ? `<p class="film-row-cast">${escapeHtml(cast)}</p>` : ""}
            ${inlineWatch}
          </div>
        </div>
        ${expand}
      </article>
    `;
    return wrapSwipeTrack(article, hid, "suggest");
  }

  function renderDiscoverResults() {
    const cards = state.currentPicks.map((film) => renderSuggestCard(film)).join("");
    const empty = `<p class="hint">Keine passenden Filme. Filter anpassen oder Refresh.</p>`;
    return `
      <section class="discover-results">
        <div class="suggest-results-bar">
          <button type="button" class="suggest-nav-btn" data-act="discover-filters">‹ Filter</button>
          <h2 class="screen-title home-title">Vorschläge</h2>
          <button type="button" class="suggest-nav-btn" data-act="discover-refresh">Refresh</button>
        </div>
        <div class="suggest-results">${cards || empty}</div>
      </section>
    `;
  }

  function renderDiscover() {
    if (state.discoverView === "results") return renderDiscoverResults();
    return renderDiscoverHub();
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

  function unratedCount() {
    const all = ratings();
    return history().filter((row) => !all[String(row.id)]).length;
  }

  function watchlistFilms() {
    return listFilmsFromRows(watchlist());
  }

  function queueFilms() {
    return listFilmsFromRows(queue());
  }

  function ratedSourceFilms() {
    const all = ratings();
    const want = state.ratedFilter || "sehr-gut";
    const out = [];
    const seen = new Set();
    Object.entries(all).forEach(([id, value]) => {
      if (value !== want) return;
      const sid = String(id);
      if (seen.has(sid)) return;
      seen.add(sid);
      out.push(listFilmOrPlaceholder(sid));
    });
    return out.filter(Boolean);
  }

  function tagSourceFilms(tagId) {
    const map = filmTags();
    const out = [];
    for (const [id, ids] of Object.entries(map)) {
      if (isVideoEntityId(id)) continue;
      if (!(ids || []).includes(tagId)) continue;
      const film = listFilmOrPlaceholder(id);
      if (film) out.push(film);
    }
    return out;
  }

  function tagSourceVideos(tagId) {
    const map = filmTags();
    const out = [];
    for (const v of allKnownVideos()) {
      const id = String(v.id);
      if (!(map[id] || []).includes(tagId)) continue;
      out.push(v);
    }
    return out;
  }

  function zufallSourceMeta(id) {
    if (id === "watch") return { id, label: "Watchlist" };
    if (id === "queue") return { id, label: "Demnächst" };
    if (id === "rated") {
      const rate = RATE_KEYS.find((r) => r.id === (state.ratedFilter || "sehr-gut"));
      return { id, label: rate ? rate.label : "Sehr gut" };
    }
    if (String(id).startsWith("tag:")) {
      const tagId = String(id).slice(4);
      const tag = customTags().find((t) => t.id === tagId);
      return tag ? { id, label: tag.name } : null;
    }
    return null;
  }

  function zufallSourceFilms(id) {
    if (id === "watch") return watchlistFilms();
    if (id === "queue") return queueFilms();
    if (id === "rated") return ratedSourceFilms();
    if (String(id).startsWith("tag:")) return tagSourceFilms(String(id).slice(4));
    return [];
  }

  function zufallUnionFilms(ids) {
    const selected = ids || state.zufallSources || [];
    const seen = new Set();
    const out = [];
    for (const sourceId of selected) {
      for (const film of zufallSourceFilms(sourceId)) {
        const id = filmId(film);
        if (!id || seen.has(id)) continue;
        seen.add(id);
        out.push(film);
      }
    }
    return out;
  }

  function zufallUnionCount(ids) {
    return zufallUnionFilms(ids).length;
  }

  function zufallUberLabel(ids) {
    const wanted = new Set(ids || state.zufallSources || []);
    const names = zufallAvailableSources().filter((id) => wanted.has(id) && zufallUnionCount([id]) > 0).map((id) => {
      const meta = zufallSourceMeta(id);
      return meta ? meta.label : "";
    }).filter(Boolean);
    const n = zufallUnionCount(ids || state.zufallSources);
    if (names.length < 2) return "";
    return `${names.join(" & ")} (${n})`;
  }

  function defaultZufallOrigin() {
    if (state.screen === "lists") {
      if (state.listTab === "queue") return ["queue"];
      if (state.listTab === "rated") return ["rated"];
      if (state.listTab === "tags") {
        return state.tagFilter.map((id) => `tag:${id}`);
      }
    }
    return ["watch"];
  }

  function originPoolCount() {
    return zufallUnionCount(defaultZufallOrigin());
  }

  function footerZufallEnabled() {
    return originPoolCount() > 0;
  }

  function lastSeenEntry(film) {
    const hid = filmId(film);
    return history().find((row) => String(row.id) === hid) || null;
  }

  function filmGenreLine(film) {
    return filmGenres(film).slice(0, 2).join(" · ");
  }

  function renderListRow(film, opts) {
    film = filmWithPoster(film) || film;
    const extra = opts.extra || "";
    const unrated = opts.unrated;
    const runtime = durationPill(film);
    const cast = (opts.hideCast || opts.gesehen) ? "" : filmCastLine(film);
    const sub = extra && extra !== cast ? extra : "";
    const line = [cast, sub].filter(Boolean).join(" · ");
    const id = escapeHtml(filmId(film));
    const hid = filmId(film);
    const onWatch = isOnWatchlist(film);
    const expandable = !opts.toggle;
    const open = expandable && state.expandedFilmId === hid;
    let control;
    if (opts.toggle) {
      control = `<button type="button" class="watch-toggle${onWatch ? " is-on" : ""}" data-act="watch-toggle" data-id="${id}" aria-pressed="${onWatch}" aria-label="${onWatch ? "Von Watchlist entfernen" : "Zur Watchlist hinzufügen"}">${onWatch ? ICONS.check : ICONS.plus}</button>`;
    } else {
      control = `<button type="button" class="film-row-chevron" data-act="film-expand" data-id="${id}" aria-expanded="${open}" aria-label="${open ? "Zuklappen" : "Aufklappen"}">${open ? ICONS.chevronUp : ICONS.chevron}</button>`;
    }
    const plot = clipPlot(filmOverview(film));
    const tags = expandable ? renderFilmTagChips(film) : "";
    const genre = filmGenreLine(film);
    const seen = lastSeenEntry(film);
    const seenDate = seen ? formatSeenOn(seen.at) : "";
    const seenLine = seenDate ? `<p class="film-expand-seen">Zuletzt gesehen: ${escapeHtml(seenDate)}</p>` : "";
    const inQueue = isOnQueue(film);
    const listsBlock = inQueue ? `
          <div class="film-expand-in">
            <p class="film-expand-in-label">Enthalten in:</p>
            <div class="film-expand-in-chips">
              <span class="chip is-lava">Demnächst</span>
            </div>
          </div>
        ` : "";
    const justWatched = !!(opts.gesehen && state.justWatchedId && state.justWatchedId === hid);
    const justChip = justWatched ? `<span class="just-watched-chip">Gerade angeschaut</span>` : "";
    const searchAdded = !!(opts.searchContextAdded && onWatch);
    const searchAddedBadge = searchAdded ? `<span class="search-added-badge" aria-hidden="true">In Watchlist</span>` : "";
    const watchAction = expandable
      ? anschauenButtonHtml("film-expand-watch", `data-act="choose" data-id="${id}"`)
      : "";
    const meta = genre ? `<p class="film-expand-meta"><strong>${escapeHtml(genre)}</strong></p>` : "";
    const providerLine = formatProviderLine(film && (film.providers || fallbackProvidersFor(film)));
    const stream = providerLine.text
      ? `<div class="film-expand-stream" data-role="film-expand-stream">
            <p class="film-expand-stream-label">verfügbar auf:</p>
            <p class="film-expand-stream-names">${escapeHtml(providerLine.text)}${providerLine.extra ? `<span class="zufall-mehr">+ mehr</span>` : ""}</p>
          </div>`
      : `<div class="film-expand-stream" data-role="film-expand-stream" hidden></div>`;
    const expand = expandable ? `
        <div class="film-row-expand"${open ? "" : " hidden"}>
          ${watchAction}
          ${plot ? `<p class="film-expand-plot">${escapeHtml(plot)}</p>` : ""}
          ${meta}
          ${seenLine}
          ${listsBlock}
          ${tags ? `<div class="film-expand-tags">${tags}</div>` : ""}
          <div class="film-expand-rates">${renderRates(film, true)}</div>
          ${stream}
          <div class="film-expand-collapse">
            <button type="button" class="film-row-fold" data-act="film-expand" data-id="${id}" aria-label="Zuklappen">${ICONS.chevronUp} Zuklappen</button>
          </div>
        </div>
      ` : "";
    const article = `
      <article class="film-row${unrated ? " is-unrated" : ""}${opts.swipeMode ? " swipe-front" : ""}${expandable ? " is-expandable" : ""}${open ? " is-open" : ""}${justWatched ? " is-just-watched" : ""}${searchAdded ? " is-search-context-added" : ""}${opts.watchlistFlash ? " is-watchlist-flash" : ""}"${opts.swipeMode ? "" : " data-swipe-row"} data-id="${id}"${opts.gesehen ? ' data-seen="1"' : ""}>
        <div class="film-row-head"${expandable ? ` data-act="film-expand" data-id="${id}" aria-expanded="${open}"` : ""}>
          ${posterTile(film, { lazy: true, size: POSTER_SIZE_THUMB })}
          ${searchAddedBadge}
          <div class="film-row-body">
            ${justChip}
            <div class="film-row-titleline">
              <h3 class="film-row-title">${escapeHtml(film.title)}</h3>
              ${runtime ? `<span class="duration-pill">${escapeHtml(runtime)}</span>` : ""}
            </div>
            ${line ? `<p class="film-row-cast">${escapeHtml(line)}</p>` : ""}
          </div>
          ${control}
        </div>
        ${expand}
      </article>
    `;
    if (!opts.swipeMode) return article;
    return wrapSwipeTrack(article, hid, opts.swipeMode);
  }

  function wrapSwipeTrack(inner, id, mode) {
    const left = (mode === "search" || mode === "suggest")
      ? `<div class="swipe-action swipe-action-queue">Demnächst<br>+ Watchlist</div>`
      : mode === "watch"
        ? `<div class="swipe-action swipe-action-queue">Demnächst<span class="swipe-arrow">→</span></div>`
        : `<div class="swipe-action swipe-action-queue" hidden></div>`;
    const right = mode === "suggest"
      ? `<div class="swipe-action swipe-action-dismiss">Weg</div>`
      : (mode === "watch" || mode === "queue")
        ? `<div class="swipe-action swipe-action-remove">Entfernen</div>`
        : `<div class="swipe-action swipe-action-remove" hidden></div>`;
    return `
      <div class="swipe-track" data-swipe-row data-swipe-mode="${escapeHtml(mode)}" data-id="${escapeHtml(id)}">
        <div class="swipe-actions" aria-hidden="true">${left}${right}</div>
        ${inner}
      </div>
    `;
  }

  function renderLists() {
    const isVideos = state.listsMode === "videos";
    const badge = isVideos ? 0 : unratedCount();
    const tabs = [
      ["watch", "Watchlist"],
      ["queue", "Demnächst"],
      ["rated", "Bewertete"],
      ["tags", "Tags"],
      ["seen", "Angesehen"],
    ].map(([id, label]) => `
      <button type="button" class="tab" data-act="list-tab" data-id="${id}" aria-selected="${state.listTab === id}">
        ${label}${id === "seen" && badge ? `<span class="badge">${badge}</span>` : ""}
      </button>
    `).join("");

    const switchHtml = `
      <div class="title-row-switch">
        <h2 class="screen-title home-title">${isVideos ? "Videos" : "Filme"}</h2>
        <button class="video-switch" type="button" data-act="toggle-lists-mode" aria-label="${isVideos ? "Zu Filmen wechseln" : "Zu Videos wechseln"}" aria-pressed="${isVideos ? "true" : "false"}">
          ${videoSwitchSvg()}<span>${isVideos ? "Filme" : "Videos"}</span>
        </button>
      </div>
    `;

    let bodyHtml = "";
    if (isVideos) {
      if (state.listTab === "watch") bodyHtml = renderVideoWatchTab();
      else if (state.listTab === "queue") bodyHtml = renderVideoQueueTab();
      else if (state.listTab === "rated") bodyHtml = renderVideoRatedTab();
      else if (state.listTab === "tags") bodyHtml = renderVideoTagsTab();
      else if (state.listTab === "seen") bodyHtml = renderVideoSeenTab();
    } else {
      if (state.listTab === "watch") bodyHtml = renderWatchTab();
      else if (state.listTab === "queue") bodyHtml = renderQueueTab();
      else if (state.listTab === "rated") bodyHtml = renderRatedTab();
      else if (state.listTab === "tags") bodyHtml = renderTagsTab();
      else if (state.listTab === "seen") bodyHtml = renderSeenTab();
    }

    return `
      <div class="lists-screen">
        ${switchHtml}
        <div class="tabs">${tabs}</div>
        ${bodyHtml}
      </div>
    `;
  }

  function renderFilmTagChips(film) {
    const have = tagsFor(film.id);
    return customTags("film").map((t) => tagChipHtml(t, {
      size: "mini",
      act: "film-tag",
      attrs: `data-id="${escapeHtml(filmId(film))}" data-tag="${escapeHtml(t.id)}"`,
      pressed: have.includes(t.id),
    })).join("");
  }

  function renderVideoTagChips(video) {
    const vid = String(video.id);
    const have = tagsFor(vid);
    const chips = customTags("video").map((t) => tagChipHtml(t, {
      size: "mini",
      act: "film-tag",
      attrs: `data-id="${escapeHtml(vid)}" data-tag="${escapeHtml(t.id)}"`,
      pressed: have.includes(t.id),
    })).join("");
    const addBtn = `<button type="button" class="tag-chip-new" data-act="tag-add-open">＋ Neuer Tag</button>`;
    return `${chips}${addBtn}`;
  }

  function renderVideoRates(video) {
    const vid = String(video.id);
    const mine = ratings()[vid];
    return `
      <div class="rates">
        ${RATE_KEYS.map((r) => `
          <button type="button" class="rate${mine === r.id ? " sel" : ""}" data-act="rate" data-id="${escapeHtml(vid)}" data-n="${r.id}" title="${r.label}" aria-label="${r.label}">
            ${rateIcon(r.id)}
          </button>
        `).join("")}
      </div>
    `;
  }

  function searchStatusText() {
    if (state.searchStatus === "empty") return "Kein Treffer";
    if (state.searchStatus === "offline") return "Kein Treffer im lokalen Katalog. Online-Suche nicht verfügbar.";
    if (state.searchStatus === "loading") return "Suche…";
    return "";
  }

  function foldSearch(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ß/g, "ss")
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .trim();
  }

  function uniqueAliasList(values) {
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

  function searchHasPhrase(haystack, needle) {
    if (!haystack || !needle) return false;
    if (haystack === needle) return true;
    return (` ${haystack} `).includes(` ${needle} `);
  }

  function filmSearchTitleTexts(film) {
    return uniqueAliasList([
      foldSearch(film && film.title),
      foldSearch(film && film.original_title),
      foldSearch(film && film.originalTitle),
      foldSearch(film && film.name),
    ].filter(Boolean));
  }

  function filmSearchAliasTexts(film) {
    return uniqueAliasList((filmAliases(film) || []).map((row) => foldSearch(row)).filter(Boolean));
  }

  function fieldMatchKind(text, q) {
    if (!text || !q) return -1;
    if (text === q) return 0;
    if (text.startsWith(q)) return 1;
    if (searchHasPhrase(text, q)) return 2;
    const tokens = q.split(/\s+/).filter(Boolean);
    if (tokens.length > 1 && tokens.every((tok) => searchHasPhrase(text, tok))) return 2;
    if (text.includes(q)) return 4;
    if (tokens.length > 1 && tokens.every((tok) => text.includes(tok))) return 4;
    return -1;
  }

  function bestFieldMatchKind(texts, q) {
    let best = -1;
    for (const text of texts || []) {
      const kind = fieldMatchKind(text, q);
      if (kind < 0) continue;
      if (best < 0 || kind < best) best = kind;
    }
    return best;
  }

  function filmMinutesOf(film) {
    return Number((film && (film.minutes || film.runtime)) || 0) || 0;
  }

  function filmLengthBucket(film) {
    const minutes = filmMinutesOf(film);
    if (minutes >= 70) return 0;
    if (!minutes) return 1;
    if (minutes >= 40) return 2;
    return 3;
  }

  function filmRecognitionScore(film) {
    const popularity = Number(film && film.popularity) || 0;
    const votes = Number(film && film.vote_count) || 0;
    const rating = Number((film && (film.rating != null ? film.rating : film.vote_average)) || 0) || 0;
    const year = Number(film && film.year) || 0;
    let score = 0;
    if (popularity > 0) score += popularity * 100;
    if (votes > 0) score += (Math.log(1 + votes) / Math.log(10)) * 50;
    score += rating * 14;
    if (year > 0) score += Math.max(0, Math.min(year, 2030) - 1950) * 0.05;
    return score;
  }

  function canonicalFranchiseScore(film) {
    const title = filmSearchTitleTexts(film).join(" ");
    let score = 0;
    if (searchHasPhrase(title, "james bond")) score += 4;
    if (searchHasPhrase(title, "007")) score += 2;
    return score;
  }

  function scoreSearchFilm(film, q) {
    if (!film || !q) return null;
    const titleKind = bestFieldMatchKind(filmSearchTitleTexts(film), q);
    const aliasKind = bestFieldMatchKind(filmSearchAliasTexts(film), q);
    let rank = -1;
    if (titleKind === 0) rank = 0;
    else if (titleKind === 1) rank = 1;
    else if (titleKind === 2) rank = 2;
    else if (aliasKind >= 0 && aliasKind <= 2) rank = 3;
    else if (titleKind === 4 || aliasKind === 4) rank = 4;
    else return null;
    const multi = q.split(/\s+/).filter(Boolean).length > 1;
    if (!multi && (rank === 1 || rank === 2)) rank = 2;
    const exactTitle = titleKind === 0;
    const minutes = filmMinutesOf(film);
    if (!exactTitle && minutes > 0 && minutes <= SEARCH_SHORT_MAX) return null;
    return { film, rank, exactTitle, minutes, canonical: canonicalFranchiseScore(film) };
  }

  function compareSearchRows(a, b) {
    if (a.rank !== b.rank) return a.rank - b.rank;
    const length = filmLengthBucket(a.film) - filmLengthBucket(b.film);
    if (length) return length;
    const canonical = (b.canonical || 0) - (a.canonical || 0);
    if (canonical) return canonical;
    const recognition = filmRecognitionScore(b.film) - filmRecognitionScore(a.film);
    if (recognition) return recognition;
    const year = (Number(b.film.year) || 0) - (Number(a.film.year) || 0);
    if (year) return year;
    return String(a.film.title || "").localeCompare(String(b.film.title || ""), "de");
  }

  function rankSearchFilms(films, query, keepUnmatched) {
    const q = foldSearch(query);
    if (!q) return [];
    const rows = [];
    for (const film of films || []) {
      const scored = scoreSearchFilm(film, q);
      if (scored) {
        rows.push(scored);
        continue;
      }
      if (!keepUnmatched) continue;
      const minutes = filmMinutesOf(film);
      if (minutes > 0 && minutes <= SEARCH_SHORT_MAX) continue;
      rows.push({ film, rank: 5, exactTitle: false, minutes, canonical: canonicalFranchiseScore(film) });
    }
    rows.sort(compareSearchRows);
    return rows.map((row) => row.film);
  }

  function localTitleSearchIsThin(hits, query) {
    const q = foldSearch(query);
    if (q.length < 2) return false;
    const list = hits || [];
    if (!list.length) return true;
    const top = scoreSearchFilm(list[0], q);
    if (top && top.exactTitle) return false;
    if (top && top.rank <= 2 && list.length >= 5) return false;
    if (top && top.rank <= 3 && list.length >= 8) return false;
    return true;
  }

  function watchSheetHiddenIds() {
    if (state.watchSheetBaselineIds) return state.watchSheetBaselineIds;
    return new Set(watchlist().map((row) => String(row.id)));
  }

  function withoutWatchlisted(films) {
    const listed = watchSheetHiddenIds();
    return (films || []).filter((film) => film && !listed.has(filmId(film)));
  }

  function captureWatchSheetBaseline() {
    state.watchSheetBaselineIds = new Set(watchlist().map((row) => String(row.id)));
  }

  function clearWatchSheetBaseline() {
    state.watchSheetBaselineIds = null;
  }

  function mergeKnownFilm(map, row) {
    if (!row) return;
    const n = normalizeFilm(row);
    if (!n.id || !n.title) return;
    const key = filmId(n);
    const prev = map.get(key);
    if (!prev) {
      map.set(key, n);
      return;
    }
    const minutes = pickRuntime(n.minutes || n.runtime, prev.minutes || prev.runtime);
    map.set(key, normalizeFilm({
      ...prev,
      ...n,
      minutes,
      runtime: minutes,
      poster: n.poster || prev.poster,
      genres: n.genres && n.genres.length ? n.genres : prev.genres,
      cast: (n.cast && n.cast.length) ? n.cast : (prev.cast || []),
      year: n.year || prev.year,
      original_title: n.original_title || prev.original_title || "",
      aliases: uniqueAliasList([...(n.aliases || []), ...(prev.aliases || [])]),
      popularity: Math.max(Number(n.popularity) || 0, Number(prev.popularity) || 0),
      vote_count: Math.max(Number(n.vote_count) || 0, Number(prev.vote_count) || 0),
      providers: (n.providers && n.providers.length) ? n.providers : (prev.providers || []),
      overview: n.overview || prev.overview || "",
    }));
  }

  function allKnownFilms() {
    if (state.catalog && state.catalog.length) return state.catalog;
    const map = new Map();
    LOGIN_POSTERS.forEach((row) => mergeKnownFilm(map, row));
    FILMS.forEach((row) => mergeKnownFilm(map, row));
    (offlineFilms || []).forEach((row) => mergeKnownFilm(map, row));
    Object.values(loadKnownFilms()).forEach((row) => mergeKnownFilm(map, row));
    return Array.from(map.values());
  }

  function filmsByTmdbIds(ids, pool) {
    const source = pool || allKnownFilms();
    return ids.map((num) => source.find((film) => Number(film.tmdb) === Number(num) || filmId(film) === `t${num}`)).filter(Boolean);
  }

  function watchCategoryFilms(cat) {
    const all = withoutWatchlisted(allKnownFilms());
    if (cat === "action") {
      return all
        .filter((film) => filmGenres(film).includes("Action"))
        .sort((a, b) => {
          const rec = filmRecognitionScore(b) - filmRecognitionScore(a);
          if (rec) return rec;
          return (Number(b.year) || 0) - (Number(a.year) || 0);
        });
    }
    if (cat === "top") {
      return all
        .filter((film) => (Number(film.rating) || Number(film.vote_average) || 0) > 0)
        .sort((a, b) => {
          const rating = (Number(b.rating) || 0) - (Number(a.rating) || 0);
          if (rating) return rating;
          return filmRecognitionScore(b) - filmRecognitionScore(a);
        });
    }
    if (cat === "neu") {
      return all
        .filter((film) => (Number(film.year) || 0) >= 2020 || (Number(film.tmdb) || 0) > 300000)
        .sort((a, b) => {
          const year = (Number(b.year) || 0) - (Number(a.year) || 0);
          if (year) return year;
          return filmRecognitionScore(b) - filmRecognitionScore(a);
        });
    }
    if (cat === "klassiker") {
      const curated = filmsByTmdbIds(KLASSIKER_IDS, all);
      const seen = new Set(curated.map((film) => filmId(film)));
      const rest = all.filter((film) => !seen.has(filmId(film)) && (Number(film.year) || 0) > 0 && (Number(film.year) || 0) < 2000);
      return curated.concat(rest);
    }
    const curated = filmsByTmdbIds(BLOCKBUSTER_IDS, all);
    const seen = new Set(curated.map((film) => filmId(film)));
    const rest = all.filter((film) => !seen.has(filmId(film)) && (Number(film.rating) || 0) >= 7.6);
    return curated.concat(rest);
  }

  function titleSearchLocal(query) {
    const ranked = rankSearchFilms(allKnownFilms(), query);
    return {
      ranked,
      visible: ranked,
      thin: localTitleSearchIsThin(ranked, query),
    };
  }

  function catalogTitleHits(query) {
    return titleSearchLocal(query).visible;
  }

  function watchSheetAllFilms() {
    if (state.watchSheet === "search") {
      if (!state.watchSearch.trim()) return [];
      return state.searchHits || [];
    }
    return withoutWatchlisted(watchCategoryFilms(state.watchCat || "blockbuster"));
  }

  function watchSheetFilms() {
    return watchSheetAllFilms().slice(0, state.watchVisibleCount || WATCH_PAGE_SIZE);
  }

  function watchSheetHasMore() {
    return watchSheetAllFilms().length > (state.watchVisibleCount || WATCH_PAGE_SIZE);
  }

  let watchMoreLock = false;
  let watchMoreObserver = null;

  function resetWatchSheetPage() {
    state.watchVisibleCount = WATCH_PAGE_SIZE;
    watchMoreLock = false;
  }

  function unbindWatchMoreSentinel() {
    if (watchMoreObserver) {
      watchMoreObserver.disconnect();
      watchMoreObserver = null;
    }
  }

  function bindWatchMoreSentinel() {
    unbindWatchMoreSentinel();
    if (!watchSheetEl || watchSheetEl.hidden) return;
    const sentinel = watchSheetEl.querySelector("[data-role=watch-more-sentinel]");
    const list = watchSheetEl.querySelector("[data-role=watch-sheet-list]");
    if (!sentinel || !list) return;
    if (typeof IntersectionObserver !== "function") return;
    watchMoreObserver = new IntersectionObserver((entries) => {
      if (watchMoreLock) return;
      if (!entries.some((entry) => entry.isIntersecting && entry.target === sentinel)) return;
      loadMoreWatchSheetFilms();
    }, {
      root: list,
      rootMargin: "120px 0px",
      threshold: 0,
    });
    watchMoreObserver.observe(sentinel);
  }

  function loadMoreWatchSheetFilms() {
    if (watchMoreLock) return false;
    if (!state.watchSheet || state.watchSheet === "zufall") return false;
    const all = watchSheetAllFilms();
    const from = state.watchVisibleCount || WATCH_PAGE_SIZE;
    if (from >= all.length) return false;
    watchMoreLock = true;
    unbindWatchMoreSentinel();
    const to = Math.min(from + WATCH_PAGE_SIZE, all.length);
    state.watchVisibleCount = to;
    const extra = all.slice(from, to);
    const list = watchSheetEl && watchSheetEl.querySelector("[data-role=watch-sheet-list]");
    if (!list) {
      watchMoreLock = false;
      return false;
    }
    const moreWrap = list.querySelector("[data-role=watch-more]");
    const html = extra.map((film) => (
      state.watchSheet === "search" ? renderSearchResultRow(film) : renderListRow(film, { toggle: true })
    )).join("");
    if (moreWrap) moreWrap.insertAdjacentHTML("beforebegin", html);
    else list.insertAdjacentHTML("beforeend", html);
    if (to >= all.length) {
      if (moreWrap) moreWrap.remove();
    }
    observeListPostersSoon(list);
    enrichListCast(extra);
    if (state.watchSheet === "search" && state.searchStatus !== "loading") bindSearchRowEnrich();
    bindWatchMoreSentinel();
    window.requestAnimationFrame(() => {
      watchMoreLock = false;
      const nextSentinel = watchSheetEl && watchSheetEl.querySelector("[data-role=watch-more-sentinel]");
      const nextList = watchSheetEl && watchSheetEl.querySelector("[data-role=watch-sheet-list]");
      if (!nextSentinel || !nextList || !watchSheetHasMore()) return;
      const listRect = nextList.getBoundingClientRect();
      const sentRect = nextSentinel.getBoundingClientRect();
      if (sentRect.top <= listRect.bottom + 120) loadMoreWatchSheetFilms();
    });
    return true;
  }

  function renderWatchMore(hasMore) {
    if (!hasMore) return "";
    return `
      <div class="sheet-more" data-role="watch-more">
        <button type="button" class="sheet-more-btn" data-act="watch-more">Weitere anzeigen</button>
        <div class="sheet-more-sentinel" data-role="watch-more-sentinel" aria-hidden="true"></div>
      </div>
    `;
  }

  function renderWatchSheetListInner() {
    const all = watchSheetAllFilms();
    const films = all.slice(0, state.watchVisibleCount || WATCH_PAGE_SIZE);
    return renderWatchSheetRows(films) + renderWatchMore(all.length > films.length);
  }

  function watchSheetEmptyText() {
    if (state.watchSheet === "search") {
      if (!state.watchSearch.trim()) return "Titel eingeben, um im Katalog zu suchen.";
      return searchStatusText() || "Kein Treffer";
    }
    return "Keine Filme in dieser Kategorie.";
  }

  function sheetLeavesBgHtml(variant) {
    const layer = variant === "b" ? "sheet-bg-leaves-b" : "sheet-bg-leaves-a";
    const soft = variant === "b" ? "" : '<span class="sheet-leaf soft"></span><span class="sheet-leaf soft"></span>';
    return `<div class="sheet-bg ${layer}" aria-hidden="true">${"<span class=\"sheet-leaf\"></span>".repeat(6)}${soft}</div>`;
  }

  function resolveWatchSearchContext() {
    if (state.screen !== "lists") return null;
    if (state.listTab === "tags" && state.tagFilter.length) {
      return { kind: "tags", tagIds: state.tagFilter.slice() };
    }
    if (state.listTab === "rated") {
      const rate = RATE_KEYS.find((r) => r.id === (state.ratedFilter || "sehr-gut"));
      return { kind: "rated", rating: state.ratedFilter || "sehr-gut", label: rate ? rate.label : "" };
    }
    if (state.listTab === "seen") {
      return { kind: "seen" };
    }
    return null;
  }

  function renderWatchSearchContextBanner() {
    const ctx = state.watchSearchContext;
    if (!ctx) return "";
    if (ctx.kind === "tags") {
      const chips = (ctx.tagIds || []).map((id) => {
        const tag = customTags().find((row) => row.id === id);
        if (!tag) return "";
        return `<span class="search-ctx-chip"><span class="search-ctx-dot" aria-hidden="true"></span>${escapeHtml(tag.name)}</span>`;
      }).join("");
      return `<div class="search-ctx-banner" role="status"><span class="search-ctx-label">Wird getaggt mit:</span>${chips}</div>`;
    }
    if (ctx.kind === "rated") {
      const label = ctx.label || (RATE_KEYS.find((r) => r.id === ctx.rating)?.label || "");
      return `<div class="search-ctx-banner" role="status"><span class="search-ctx-label">Wird bewertet als:</span><span class="search-ctx-chip"><span class="search-ctx-dot" aria-hidden="true"></span>${escapeHtml(label)}</span></div>`;
    }
    if (ctx.kind === "seen") {
      return `<div class="search-ctx-banner" role="status"><span class="search-ctx-label">Kontext:</span><span class="search-ctx-chip"><span class="search-ctx-dot" aria-hidden="true"></span>Angesehen</span></div>`;
    }
    return "";
  }

  function searchWatchlistTrayHtml(film, id) {
    const ctx = state.watchSearchContext;
    let third = "";
    if (ctx && ctx.kind === "tags") {
      third = `<button type="button" class="search-watchlist-ctx" data-act="search-ctx-tag" data-id="${id}"><span class="search-watchlist-ctx-icon" aria-hidden="true">${ICONS.tags}</span>Taggen</button>`;
    } else if (ctx && ctx.kind === "rated") {
      third = `<button type="button" class="search-watchlist-ctx" data-act="search-ctx-rate" data-id="${id}"><span class="search-watchlist-ctx-icon rate-thumb-svg" aria-hidden="true">${rateIcon("sehr-gut")}</span>Bewerten</button>`;
    }
    const trayClass = third ? "search-watchlist-tray has-three" : "search-watchlist-tray";
    return `
        <div class="${trayClass}">
          <button type="button" class="search-watchlist-goto" data-act="watch-search-goto" data-id="${id}">In Watchlist anzeigen <span class="arrow" aria-hidden="true">→</span></button>
          ${anschauenButtonHtml("search-watchlist-watch", `data-act="choose" data-id="${id}"`)}
          ${third}
        </div>`;
  }

  function renderWatchlistSearchRow(film) {
    film = filmWithPoster(film) || film;
    const runtime = durationPill(film);
    const cast = filmCastLine(film);
    const id = escapeHtml(filmId(film));
    return `
      <article class="film-row is-on-watchlist" data-id="${id}">
        ${posterTile(film, { lazy: true, size: POSTER_SIZE_THUMB })}
        <div class="film-row-head">
          <div class="film-row-body">
            <div class="film-row-titleline">
              <h3 class="film-row-title">${escapeHtml(film.title)}</h3>
              ${runtime ? `<span class="duration-pill">${escapeHtml(runtime)}</span>` : ""}
            </div>
            ${cast ? `<p class="film-row-cast">${escapeHtml(cast)}</p>` : ""}
          </div>
        </div>
        ${searchWatchlistTrayHtml(film, id)}
      </article>
    `;
  }

  function renderSearchResultRow(film) {
    if (isOnWatchlist(film)) return renderWatchlistSearchRow(film);
    const added = (state.searchContextAddedIds || []).includes(filmId(film));
    const row = renderListRow(film, { toggle: true, swipeMode: "search", searchContextAdded: added });
    return row;
  }

  function renderWatchSheetRows(films) {
    if (!films.length) return `<p class="hint">${escapeHtml(watchSheetEmptyText())}</p>`;
    return films.map((film) => renderSearchResultRow(film)).join("");
  }

  function paintWatchSheetList() {
    if (!watchSheetEl || !state.watchSheet) return;
    const list = watchSheetEl.querySelector("[data-role=watch-sheet-list]");
    if (!list) return;
    const scrollTop = list.scrollTop;
    const films = watchSheetFilms();
    unbindWatchMoreSentinel();
    list.innerHTML = renderWatchSheetRows(films) + renderWatchMore(watchSheetHasMore());
    list.scrollTop = scrollTop;
    observeListPostersSoon(list);
    enrichListCast(films);
    bindWatchMoreSentinel();
    if (state.watchSheet === "search" && state.searchStatus !== "loading") scheduleSettledSearchEnrich();
  }

  function paintWatchToggles() {
    const listed = new Set(watchlist().map((row) => String(row.id)));
    document.querySelectorAll("[data-act=watch-toggle]").forEach((btn) => {
      const on = listed.has(filmId(btn.dataset.id));
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.setAttribute("aria-label", on ? "Von Watchlist entfernen" : "Zur Watchlist hinzufügen");
      btn.innerHTML = on ? ICONS.check : ICONS.plus;
    });
  }

  function renderWatchRows() {
    return watchlistFilms().map((film) => renderListRow(film, {
      swipeMode: "watch",
      watchlistFlash: state.highlightWatchlistId === filmId(film),
    })).join("");
  }

  function refreshWatchList() {
    if (typeof window !== "undefined" && window.__CINEX_TEST_COUNTERS__) {
      window.__CINEX_TEST_COUNTERS__.refreshWatchList = (window.__CINEX_TEST_COUNTERS__.refreshWatchList || 0) + 1;
    }
    if (state.screen !== "lists" || (state.listTab !== "watch" && state.listTab !== "queue")) return;
    if (state.listsMode === "videos") {
      render();
      return;
    }
    const list = app.querySelector("[data-role=film-list]");
    if (!list) return;
    const scrollTop = list.scrollTop;
    if (state.listTab === "queue") {
      const rows = renderQueueRows();
      list.innerHTML = rows || `<p class="hint">Noch nichts unter Demnächst.</p>`;
      observeListPostersSoon(list);
      enrichListCast(queueFilms());
    } else {
      const rows = renderWatchRows();
      list.innerHTML = rows || `<p class="hint">Noch nichts auf der Watchlist.</p>`;
      observeListPostersSoon(list);
      enrichListCast(watchlistFilms());
    }
    if (scrollTop) {
      list.scrollTop = scrollTop;
      window.requestAnimationFrame(() => {
        if (list.isConnected && Math.abs(list.scrollTop - scrollTop) > 1) list.scrollTop = scrollTop;
      });
    }
    paintFooterListenIcon();
    if (state.listTab === "watch") window.requestAnimationFrame(() => maybeWatchlistSwipeHint());
    paintZufallChip();
    updateFooter();
    scheduleFooterSync();
    if (state.expandedFilmId) enrichExpandedFilm(state.expandedFilmId);
  }

  function similarEmptyText() {
    if (!String(state.similarQuery || "").trim()) return "Titel eingeben, um Filme zu suchen.";
    if (state.similarStatus === "loading") return "Suche…";
    return "Kein Treffer";
  }

  function similarVisibleFilms() {
    return (state.similarHits || []).slice(0, state.similarVisible || 20);
  }

  function renderSimilarRow(film) {
    const id = filmId(film);
    const on = (state.similarDraft || []).some((row) => row.id === id);
    const year = Number(film.year) || 0;
    return `
      <article class="film-row" data-id="${escapeHtml(id)}">
        <div class="film-row-head">
          ${posterTile(film, { lazy: true, size: POSTER_SIZE_THUMB })}
          <div class="film-row-body">
            <div class="film-row-titleline">
              <h3 class="film-row-title">${escapeHtml(film.title)}</h3>
            </div>
            ${year ? `<p class="film-row-cast">${year}</p>` : ""}
          </div>
          <button type="button" class="watch-toggle${on ? " is-on" : ""}" data-act="similar-toggle" data-id="${escapeHtml(id)}" aria-pressed="${on ? "true" : "false"}" aria-label="${on ? "Auswahl aufheben" : "Film wählen"}">${on ? ICONS.check : ICONS.plus}</button>
        </div>
      </article>
    `;
  }

  function renderSimilarListInner() {
    const films = similarVisibleFilms();
    if (!films.length) return `<p class="hint">${escapeHtml(similarEmptyText())}</p>`;
    const more = (state.similarHits || []).length > films.length;
    const moreHtml = more ? `
      <div class="sheet-more" data-role="similar-more">
        <button type="button" class="sheet-more-btn" data-act="similar-more">Weitere anzeigen</button>
      </div>
    ` : "";
    return films.map((film) => renderSimilarRow(film)).join("") + moreHtml;
  }

  function renderSimilarSheetHtml() {
    const draft = state.similarDraft || [];
    const chips = similarChipsHtml(draft, "similar-draft-remove");
    const active = String(state.similarQuery || "").trim() || draft.length;
    return `
      <div class="sheet-panel is-similar" data-role="sheet-panel" role="dialog" aria-modal="true" aria-labelledby="similar-sheet-title">
        <div class="sheet-head" data-role="sheet-drag">
          <div class="sheet-handle" aria-hidden="true"></div>
          <h2 class="sheet-title" id="similar-sheet-title">Ähnlich wie</h2>
          <p class="sheet-sub">Ein oder mehrere Filme wählen</p>
        </div>
        <div class="sheet-search-wrap${active ? " is-active" : ""}">
          <span class="sheet-search-icon">${ICONS.search}</span>
          <input data-act="similar-search" placeholder="Filme suchen" value="${escapeHtml(state.similarQuery)}" autocomplete="off" enterkeyhint="search" aria-label="Filme suchen">
        </div>
        <div class="active-chip-row similar-chip-row" data-role="similar-chips">${chips}</div>
        <section class="film-list" data-role="similar-list">${renderSimilarListInner()}</section>
        <button type="button" class="btn btn-primary similar-apply" data-act="similar-apply">Übernehmen (${draft.length})</button>
      </div>
    `;
  }

  function paintSimilarList() {
    if (!watchSheetEl || state.watchSheet !== "similar") return;
    const list = watchSheetEl.querySelector("[data-role=similar-list]");
    if (!list) return;
    const scrollTop = list.scrollTop;
    list.innerHTML = renderSimilarListInner();
    list.scrollTop = scrollTop;
    observeListPostersSoon(list);
  }

  function paintSimilarSelection() {
    if (!watchSheetEl || state.watchSheet !== "similar") return;
    const chips = watchSheetEl.querySelector("[data-role=similar-chips]");
    if (chips) chips.innerHTML = similarChipsHtml(state.similarDraft, "similar-draft-remove");
    const apply = watchSheetEl.querySelector("[data-act=similar-apply]");
    if (apply) apply.textContent = `Übernehmen (${(state.similarDraft || []).length})`;
    const wrap = watchSheetEl.querySelector(".sheet-panel.is-similar .sheet-search-wrap");
    if (wrap) {
      const active = !!String(state.similarQuery || "").trim() || (state.similarDraft || []).length > 0;
      wrap.classList.toggle("is-active", active);
    }
    const picked = new Set((state.similarDraft || []).map((row) => row.id));
    watchSheetEl.querySelectorAll("[data-act=similar-toggle]").forEach((btn) => {
      const on = picked.has(btn.dataset.id);
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.setAttribute("aria-label", on ? "Auswahl aufheben" : "Film wählen");
      btn.innerHTML = on ? ICONS.check : ICONS.plus;
    });
  }

  function toggleSimilarDraft(id) {
    const film = findFilm(id);
    if (!film) return;
    const compact = similarCompact(film);
    if (!compact) return;
    const draft = state.similarDraft || [];
    if (draft.some((row) => row.id === compact.id)) {
      state.similarDraft = draft.filter((row) => row.id !== compact.id);
    } else {
      state.similarDraft = draft.concat(compact);
    }
    paintSimilarSelection();
  }

  function openSimilarSheet() {
    closeFilmMenus();
    window.clearTimeout(searchTimer);
    searchSeq += 1;
    teardownZufallCarousel();
    state.watchSearch = "";
    state.searchHits = [];
    state.searchStatus = "";
    state.similarDraft = (state.filters.similar || []).map((row) => ({ ...row }));
    state.similarQuery = "";
    state.similarHits = [];
    state.similarStatus = "";
    state.similarVisible = 20;
    state.watchSheet = "similar";
    paintWatchSheet();
    if (!state.catalog.length) loadCatalog();
  }

  function openVideoAddSheet() {
    closeFilmMenus();
    state.watchSheet = "video-add";
    state.videoFormEditId = null;
    state.videoFormUrl = "";
    state.videoFormTitle = "";
    state.videoFormDesc = "";
    state.videoFormPlat = "";
    state.videoFormPlatId = "";
    state.videoFormCustomPlat = false;
    paintWatchSheet();
  }

  function openVideoEditSheet(videoId) {
    const video = findVideo(videoId);
    if (!video) return;
    closeFilmMenus();
    state.watchSheet = "video-add";
    state.videoFormEditId = String(video.id);
    state.videoFormUrl = video.url || "";
    state.videoFormTitle = video.title || "";
    state.videoFormDesc = video.desc || "";
    const detected = detectPlatform(video.url);
    state.videoFormPlatId = video.plat || detected.id || "";
    state.videoFormPlat = "";
    state.videoFormCustomPlat = false;
    paintWatchSheet();
  }

  function videoSheetPlatPickerHtml(platId) {
    return `
      <div class="video-plat-picker" role="group" aria-label="Plattform">
        <button class="video-plat-chip" type="button" data-act="video-pick-plat" data-plat="yt" aria-pressed="${platId === "yt" ? "true" : "false"}">
          <span class="ico yt"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 12s0-3.6-.46-5.2a2.9 2.9 0 0 0-2-2C18.8 4.3 12 4.3 12 4.3s-6.8 0-8.54.5a2.9 2.9 0 0 0-2 2C1 8.4 1 12 1 12s0 3.6.46 5.2a2.9 2.9 0 0 0 2 2c1.74.5 8.54.5 8.54.5s6.8 0 8.54-.5a2.9 2.9 0 0 0 2-2C23 15.6 23 12 23 12zm-13 3.3V8.7L16.2 12 10 15.3z"/></svg></span>
          YouTube
        </button>
        <button class="video-plat-chip" type="button" data-act="video-pick-plat" data-plat="ig" aria-pressed="${platId === "ig" ? "true" : "false"}">
          <span class="ico ig"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2zm6.1-8.2a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM12 3.5c-2.3 0-2.6 0-3.5.05-.9.04-1.5.2-2 .38a4 4 0 0 0-1.45.94 4 4 0 0 0-.94 1.45c-.18.5-.34 1.1-.38 2C3.5 9.4 3.5 9.7 3.5 12s0 2.6.05 3.5c.04.9.2 1.5.38 2a4 4 0 0 0 .94 1.45 4 4 0 0 0 1.45.94c.5.18 1.1.34 2 .38.9.05 1.2.05 3.5.05s2.6 0 3.5-.05c.9-.04 1.5-.2 2-.38a4 4 0 0 0 1.45-.94 4 4 0 0 0 .94-1.45c.18-.5.34-1.1.38-2 .05-.9.05-1.2.05-3.5s0-2.6-.05-3.5c-.04-.9-.17-1.26-.28-1.56-.15-.39-.33-.67-.62-.96-.29-.29-.57-.47-.96-.62-.3-.11-.74-.24-1.56-.28C14.6 3.5 14.3 3.5 12 3.5z"/></svg></span>
          Instagram
        </button>
        <button class="video-plat-chip" type="button" data-act="video-pick-plat" data-plat="fb" aria-pressed="${platId === "fb" ? "true" : "false"}">
          <span class="ico fb"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z"/></svg></span>
          Facebook
        </button>
      </div>
    `;
  }

  function renderVideoAddSheetHtml() {
    const editing = !!state.videoFormEditId;
    const url = state.videoFormUrl || "";
    const detected = url ? detectPlatform(url) : { id: "", label: "Web" };
    const platId = state.videoFormPlatId || detected.id || "";
    const embed = url ? embedInfo(url) : { kind: "none" };
    const platLabel = platLabelFromId(platId) || detected.label || "Web";
    const platHint = embed.kind !== "none"
      ? `✓ Aus dem Link erkannt: ${platLabel} – auch „hier anschauen“ möglich`
      : `✓ Aus dem Link erkannt: ${platLabel}`;
    const platOpt = state.videoFormPlat || (platId && platId !== "generic" ? platLabelFromId(platId) : "");
    const titleId = editing ? "video-edit-title" : "video-add-title";
    const sheetTitle = editing ? "Video bearbeiten" : "Video hinzufügen";
    const fieldsAdd = `
          <div class="video-field">
            <label for="video-url">URL</label>
            <input id="video-url" type="url" placeholder="https://..." value="${escapeHtml(url)}" required autocomplete="off" autofocus>
          </div>
          <div class="video-field">
            <label for="video-title">Titel</label>
            <input id="video-title" type="text" placeholder="Titel des Videos" value="${escapeHtml(state.videoFormTitle)}">
          </div>
          <div class="video-field">
            <label for="video-desc">Beschreibung</label>
            <textarea id="video-desc" placeholder="Kurzbeschreibung oder Notiz">${escapeHtml(state.videoFormDesc)}</textarea>
          </div>
          <div class="video-field">
            <label for="video-plat">Plattform <span class="hint-opt">(optional)</span></label>
            <input id="video-plat" type="text" placeholder="Wird automatisch ermittelt" value="${escapeHtml(platOpt)}">
            ${videoSheetPlatPickerHtml(platId)}
          </div>
    `;
    const fieldsEdit = `
          <div class="video-field">
            <label for="video-title">Titel</label>
            <input id="video-title" type="text" placeholder="Titel des Videos" value="${escapeHtml(state.videoFormTitle)}" autofocus>
          </div>
          <div class="video-field">
            <label for="video-desc">Notiz / Text</label>
            <textarea id="video-desc" placeholder="Kurzbeschreibung oder Notiz">${escapeHtml(state.videoFormDesc)}</textarea>
          </div>
          <div class="video-field">
            <label for="video-url">Link (URL)</label>
            <input id="video-url" type="url" placeholder="https://..." value="${escapeHtml(url)}" required autocomplete="off">
          </div>
          <div class="video-field">
            <label>Plattform <span class="hint-opt">(automatisch erkannt)</span></label>
            ${videoSheetPlatPickerHtml(platId)}
            <p class="video-plat-detect-hint">${escapeHtml(platHint)}</p>
          </div>
    `;
    const removeBlock = editing ? `
          <div class="video-sheet-remove-wrap">
            <button type="button" class="video-sheet-remove" data-act="video-edit-remove" data-id="${escapeHtml(state.videoFormEditId)}">🗑 Von Liste entfernen</button>
            <p class="hint video-sheet-remove-hint">Entfernt das Video aus der Watchlist · mit Rückgängig</p>
          </div>
    ` : "";
    return `
      <div class="sheet-panel is-video-add${editing ? " is-video-edit" : ""}" data-role="sheet-panel" role="dialog" aria-modal="true" aria-labelledby="${titleId}">
        <div class="sheet-head" data-role="sheet-drag">
          <div class="sheet-handle" aria-hidden="true"></div>
          <h2 class="sheet-title" id="${titleId}">${sheetTitle}</h2>
          <button type="button" class="sheet-close" data-act="watch-sheet-close" aria-label="Schließen">${ICONS.close}</button>
        </div>
        <form class="video-add-form" data-role="video-add-form" onsubmit="return false;">
          ${editing ? fieldsEdit : fieldsAdd}
          <div class="video-sheet-actions">
            <button class="btn btn-ghost" type="button" data-act="watch-sheet-close">Abbrechen</button>
            <button class="btn btn-primary" type="button" data-act="video-save">${editing ? "Speichern" : "Speichern"}</button>
          </div>
          ${removeBlock}
        </form>
      </div>
    `;
  }

  function removeVideoWithUndo(video) {
    if (!video) return;
    const beforeWatch = videoWatchlist();
    const beforeQueue = videoQueue();
    const beforeHistory = videoHistory();
    const hid = String(video.id);
    if (state.listTab === "seen") removeVideoFromHistory(video.id);
    else removeVideoFromWatchlist(video.id);
    if (state.expandedVideoId === hid) state.expandedVideoId = null;
    if (state.inlineVideoPlayerId === hid) {
      state.inlineVideoPlayerId = null;
      destroyInlineVideoPlayer();
    }
    if (state.videoFormEditId === hid) closeWatchSheet();
    render();
    showSnack("Video entfernt", "danger", {
      undo: () => {
        saveVideoWatchlist(beforeWatch);
        saveVideoQueue(beforeQueue);
        saveVideoHistory(beforeHistory);
        render();
      },
    });
  }

  function saveVideoFromForm() {
    const urlInput = watchSheetEl && watchSheetEl.querySelector("#video-url");
    const titleInput = watchSheetEl && watchSheetEl.querySelector("#video-title");
    const descInput = watchSheetEl && watchSheetEl.querySelector("#video-desc");
    const platInput = watchSheetEl && watchSheetEl.querySelector("#video-plat");
    const url = (urlInput ? urlInput.value : state.videoFormUrl || "").trim();
    if (!url) {
      if (urlInput) {
        urlInput.focus();
        if (typeof urlInput.reportValidity === "function") urlInput.reportValidity();
      }
      return;
    }
    const detected = detectPlatform(url);
    const customPlat = (platInput ? platInput.value : state.videoFormPlat || "").trim();
    let platId = state.videoFormPlatId || detected.id;
    if (customPlat) {
      const lower = customPlat.toLowerCase();
      if (lower.includes("youtube") || lower.includes("youtu.be")) platId = "yt";
      else if (lower.includes("instagram")) platId = "ig";
      else if (lower.includes("facebook") || lower.includes("fb.")) platId = "fb";
      else if (lower.includes("tiktok")) platId = "tiktok";
      else if (lower.includes("vimeo")) platId = "vimeo";
      else if (lower.includes("twitch")) platId = "twitch";
      else if (lower.includes("netflix")) platId = "netflix";
      else if (lower.includes("prime")) platId = "prime";
      else if (lower.includes("disney")) platId = "disney";
      else if (lower.includes("ard")) platId = "ard";
      else if (lower.includes("zdf")) platId = "zdf";
      else platId = "generic";
    } else if (state.videoFormEditId) {
      platId = detected.id || platId || "generic";
    }
    let title = (titleInput ? titleInput.value : state.videoFormTitle || "").trim();
    if (!title) {
      title = `${customPlat || platLabelFromId(platId) || detected.label}-Video`;
    }
    const desc = (descInput ? descInput.value : state.videoFormDesc || "").trim();

    if (state.videoFormEditId) {
      const existing = findVideo(state.videoFormEditId);
      if (!existing) {
        closeWatchSheet();
        render();
        return;
      }
      updateVideoEverywhere({
        id: existing.id,
        title,
        desc,
        url,
        plat: platId,
        customPlat: customPlat || detected.label,
      });
      closeWatchSheet();
      render();
      showSnack("Gespeichert");
      return;
    }

    const newVideo = {
      id: "v-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
      title,
      desc,
      url,
      plat: platId,
      customPlat: customPlat || detected.label,
      at: Date.now(),
    };

    if (state.listTab === "queue") {
      addVideoQueue(newVideo);
    } else {
      addVideoWatch(newVideo);
    }
    closeWatchSheet();
    render();
    showSnack(`${newVideo.title} hinzugefügt`);
  }

  function renderWatchSheetHtml() {
    if (state.watchSheet === "video-add") return renderVideoAddSheetHtml();
    if (state.watchSheet === "similar") return renderSimilarSheetHtml();
    if (state.watchSheet === "zufall") return renderZufallSheetHtml();
    const searching = state.watchSheet === "search";
    if (searching) {
      return `
        <div class="sheet-panel is-search has-sheet-bg" data-role="sheet-panel" role="dialog" aria-modal="true" aria-labelledby="watch-search-title">
          ${sheetLeavesBgHtml("b")}
          <div class="sheet-head" data-role="sheet-drag">
            <div class="sheet-handle" aria-hidden="true"></div>
            <h2 class="sheet-title" id="watch-search-title">Film suchen</h2>
            <button type="button" class="sheet-close" data-act="watch-sheet-close" aria-label="Schließen">${ICONS.close}</button>
          </div>
          <div class="sheet-search-wrap">
            <span class="sheet-search-icon">${ICONS.search}</span>
            <input data-act="watch-search" placeholder="Film suchen" value="${escapeHtml(state.watchSearch)}" autocomplete="off" enterkeyhint="search">
          </div>
          ${renderWatchSearchContextBanner()}
          <section class="film-list" data-role="watch-sheet-list">${renderWatchSheetListInner()}</section>
        </div>
      `;
    }
    const chips = WATCH_CATS.map((cat) => `
      <button type="button" class="chip" data-act="watch-cat" data-id="${cat.id}" aria-pressed="${state.watchCat === cat.id}">${escapeHtml(cat.label)}</button>
    `).join("");
    return `
      <div class="sheet-panel" data-role="sheet-panel">
        <div class="sheet-head" data-role="sheet-drag">
          <div class="sheet-handle" aria-hidden="true"></div>
          <h2 class="sheet-title">Zu Watchlist hinzufügen</h2>
        </div>
        <div class="sheet-cats">${chips}</div>
        <section class="film-list" data-role="watch-sheet-list">${renderWatchSheetListInner()}</section>
        <button type="button" class="sheet-search-bar" data-act="watch-search-open">
          <span class="sheet-search-icon">${ICONS.search}</span>
          Film suchen
        </button>
      </div>
    `;
  }

  function syncWatchSheetTop() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const top = Math.ceil(header.getBoundingClientRect().bottom) + 12;
    document.documentElement.style.setProperty("--sheet-top", `${Math.max(top, 0)}px`);
  }

  function paintWatchSheet() {
    if (!watchSheetEl) return;
    unbindWatchMoreSentinel();
    if (!state.watchSheet) {
      teardownZufallCarousel();
      document.body.classList.remove("watch-sheet-open");
      watchSheetEl.hidden = true;
      watchSheetEl.innerHTML = "";
      return;
    }
    document.body.classList.add("watch-sheet-open");
    document.body.classList.toggle("zufall-sheet-open", state.watchSheet === "zufall");
    syncWatchSheetTop();
    const animateIn = watchSheetEl.hidden;
    teardownZufallCarousel();
    watchSheetEl.hidden = false;
    watchSheetEl.innerHTML = renderWatchSheetHtml();
    const panel = watchSheetEl.querySelector("[data-role=sheet-panel]");
    if (animateIn && panel && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      panel.classList.add("is-enter");
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          panel.classList.remove("is-enter");
        });
      });
    }
    if (state.watchSheet === "zufall") {
      loadZufallFiltersFromStorage();
      mountZufallCarousel();
      paintZufallFilterOverflow();
      paintChipOverflow();
      return;
    }
    if (state.watchSheet === "video-add") {
      const input = watchSheetEl.querySelector(state.videoFormEditId ? "#video-title" : "#video-url");
      if (input) {
        input.focus({ preventScroll: true });
        const len = input.value.length;
        try { input.setSelectionRange(len, len); } catch { /* ignore */ }
      }
      return;
    }
    if (state.watchSheet === "similar") {
      observeListPostersSoon(watchSheetEl);
      const input = watchSheetEl.querySelector("[data-act=similar-search]");
      if (input) {
        input.focus({ preventScroll: true });
        const len = input.value.length;
        try { input.setSelectionRange(len, len); } catch { /* ignore */ }
      }
      return;
    }
    const films = watchSheetFilms();
    observeListPostersSoon(watchSheetEl);
    enrichListCast(films);
    bindWatchMoreSentinel();
    if (state.watchSheet === "search") {
      const input = watchSheetEl.querySelector("[data-act=watch-search]");
      if (input) {
        input.focus({ preventScroll: true });
        const len = input.value.length;
        try { input.setSelectionRange(len, len); } catch { /* ignore */ }
      }
    }
  }

  function openWatchAddSheet() {
    closeFilmMenus();
    if (!state.watchSheet) captureWatchSheetBaseline();
    state.watchSheet = "add";
    state.watchCat = state.watchCat || "blockbuster";
    resetWatchSheetPage();
    paintWatchSheet();
    if (!state.catalog.length) {
      loadCatalog().then(() => {
        if (state.watchSheet === "add") paintWatchSheetList();
      });
    }
  }

  function openWatchSearchSheet() {
    closeFilmMenus();
    if (!state.watchSheetBaselineIds) captureWatchSheetBaseline();
    state.watchSearchContext = resolveWatchSearchContext();
    state.watchSheet = "search";
    resetWatchSheetPage();
    paintWatchSheet();
    if (state.watchSearch.trim()) scheduleTitleSearch(state.watchSearch);
  }

  function closeWatchSheet() {
    window.clearTimeout(searchTimer);
    window.clearTimeout(similarTimer);
    searchSeq += 1;
    similarSeq += 1;
    beginSearchEnrichCycle();
    unbindWatchMoreSentinel();
    teardownZufallCarousel();
    state.watchSheet = null;
    state.zufallSources = [];
    state.zufallOrigin = [];
    state.zufallFilterSheet = false;
    state.zufallFiltersDraft = null;
    state.filterMore.zufall = false;
    clearWatchSheetBaseline();
    state.watchSearch = "";
    state.watchSearchContext = null;
    state.searchContextAddedIds = [];
    state.searchHits = [];
    state.searchStatus = "";
    state.similarQuery = "";
    state.similarHits = [];
    state.similarStatus = "";
    state.similarDraft = [];
    state.videoFormEditId = null;
    resetWatchSheetPage();
    document.body.classList.remove("watch-sheet-open");
    document.body.classList.remove("zufall-sheet-open");
    if (watchSheetEl) {
      watchSheetEl.hidden = true;
      watchSheetEl.innerHTML = "";
    }
    updateFooter();
  }

  function landOnWatchlist() {
    const already = state.screen === "lists" && state.listTab === "watch";
    closeWatchSheet();
    if (already) return;
    state.screen = "lists";
    state.listTab = "watch";
    state.expandedFilmId = null;
    render();
  }

  function dismissWatchSheet() {
    const panel = watchSheetEl && watchSheetEl.querySelector("[data-role=sheet-panel]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finish = () => {
      if (state.watchSheet === "search") {
        landOnWatchlist();
        return;
      }
      closeWatchSheet();
    };
    if (!panel || reduce) {
      finish();
      return;
    }
    panel.style.transition = "transform 0.22s ease";
    panel.style.transform = "translateY(110%)";
    window.setTimeout(finish, 220);
  }

  let searchTimer = 0;
  let searchSeq = 0;
  let actorTimer = 0;
  let actorSeq = 0;
  let similarTimer = 0;
  let similarSeq = 0;
  const actorCreditCache = new Map();

  function catalogActorHits(query) {
    const q = foldSearch(query);
    if (!q) return [];
    const counts = new Map();
    const source = (state.catalog || []).concat(FILMS);
    for (const film of source) {
      for (const name of filmCastNames(film)) {
        const folded = foldSearch(name);
        if (!folded || (!folded.includes(q) && !folded.split(" ").some((part) => part.startsWith(q)))) continue;
        const prev = counts.get(folded);
        if (prev) prev.count += 1;
        else counts.set(folded, { name, count: 1 });
      }
    }
    return [...counts.values()]
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "de"))
      .slice(0, 8)
      .map((row) => ({ id: row.name, name: row.name, tmdb: 0, count: row.count, profile: "" }));
  }

  function localActorSearchIsThin(hits, query) {
    const q = foldSearch(query);
    if (q.length < 2) return false;
    const list = hits || [];
    if (!list.length) return true;
    const exact = list.some((row) => foldSearch(row && row.name) === q);
    if (exact) return false;
    const prefix = list.some((row) => foldSearch(row && row.name).startsWith(q));
    if (prefix && list.length >= 3) return false;
    return list.length < 4;
  }

  function actorInitials(name) {
    const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    const letters = parts.slice(0, 2).map((part) => part[0]).join("");
    return (letters || "?").toUpperCase();
  }

  function actorCountLabel(count) {
    const n = Number(count) || 0;
    if (n <= 0) return "";
    return n === 1 ? "1 Film" : `${n} Filme`;
  }

  function actorAvatarHtml(row) {
    if (row && row.profile) {
      return `<span class="actor-hit-avatar"><img src="${escapeHtml(row.profile)}" alt="" width="32" height="32" decoding="async" referrerpolicy="no-referrer"></span>`;
    }
    return `<span class="actor-hit-avatar" aria-hidden="true">${escapeHtml(actorInitials(row && row.name))}</span>`;
  }

  function actorHitsHtml() {
    const q = String(state.actorQuery || "").trim();
    if (!q) return "";
    if (state.actorStatus === "loading" && !state.actorHits.length) return `<p class="hint actor-hit-status">Suche…</p>`;
    if (state.actorStatus === "offline" && !state.actorHits.length) {
      return `<p class="hint actor-hit-status">Kein Treffer im lokalen Katalog. Online-Suche nicht verfügbar.</p>`;
    }
    if (!state.actorHits.length) return `<p class="hint actor-hit-status">Kein Treffer</p>`;
    return state.actorHits.map((row) => {
      const count = actorCountLabel(shownActorCount(row));
      return `
        <button type="button" class="actor-hit" data-act="actor-pick" data-id="${escapeHtml(String(row.id))}" data-name="${escapeHtml(row.name)}" data-tmdb="${row.tmdb || ""}">
          ${actorAvatarHtml(row)}
          <span class="actor-hit-name">${escapeHtml(row.name)}</span>
          ${count ? `<span class="actor-hit-count">${escapeHtml(count)}</span>` : ""}
        </button>
      `;
    }).join("");
  }

  function paintActorHits() {
    const html = actorHitsHtml();
    const roots = [app, watchSheetEl].filter(Boolean);
    roots.forEach((root) => {
      root.querySelectorAll("[data-role=actor-hits]").forEach((box) => {
        box.innerHTML = html;
      });
    });
  }

  function shownActorCount(row) {
    const cached = actorCreditCache.get(foldSearch(row && row.name));
    if (cached && remoteSearchAvailable() && Number(cached.count) > 0) return Number(cached.count);
    return Number(row && row.count) || 0;
  }

  function actorFilterLabel(actor) {
    if (!actor || !actor.name) return "";
    if (actor.filmStatus === "live") {
      const count = actorCountLabel(actor.liveCount);
      if (count) return `${actor.name} · ${count}`;
    }
    return actor.name;
  }

  function paintActorCounts() {
    const byId = new Map((state.filters.actors || []).map((actor) => [String(actor.id), actor]));
    document.querySelectorAll("[data-act=actor-remove], [data-act=remove-filter][data-kind=actor]").forEach((btn) => {
      const actor = byId.get(String(btn.dataset.id));
      if (!actor) return;
      const label = actorFilterLabel(actor);
      const chip = btn.closest(".active-chip");
      const span = chip && Array.from(chip.children).find((el) => el.tagName === "SPAN");
      if (span) span.textContent = label;
      btn.setAttribute("aria-label", `${label} entfernen`);
    });
  }

  function reapplyActorFilmographies() {
    for (const actor of state.filters.actors || []) {
      if (!actor) continue;
      const cached = actorCreditCache.get(foldSearch(actor.name));
      if (!cached || !Array.isArray(cached.films)) continue;
      applyActorFilmography(actor, cached);
    }
  }

  function activeFilterActorsBag() {
    if (state.zufallFilterSheet) return zufallFiltersDraftBag();
    return state.filters;
  }

  function actorStillSelected(actor) {
    return (activeFilterActorsBag().actors || []).some((row) => row === actor);
  }

  function settleActorFilmographies() {
    const pending = (state.filters.actors || []).map((actor) => actor && actor.filmPromise).filter(Boolean);
    if (!pending.length) return Promise.resolve();
    return Promise.all(pending.map((promise) => Promise.resolve(promise).catch(() => null)));
  }

  function mergeCastNames(current, extra) {
    const out = [];
    const seen = new Set();
    for (const name of [].concat(current || [], extra || [])) {
      const text = String(name || "").trim();
      const key = foldSearch(text);
      if (!text || !key || seen.has(key)) continue;
      seen.add(key);
      out.push(text);
      if (out.length >= 4) break;
    }
    return out;
  }

  function castWithActor(current, actorName) {
    const names = filmCastNames({ cast: current });
    const q = foldSearch(actorName);
    if (q && names.some((name) => {
      const folded = foldSearch(name);
      return folded === q || folded.includes(q);
    })) {
      return names.slice(0, 4);
    }
    return mergeCastNames([actorName], names);
  }

  function filmDetailScore(film) {
    let score = 0;
    if (Number(film && (film.minutes || film.runtime)) > 0) score += 4;
    if (film && film.poster) score += 2;
    score += Math.min(filmCastNames(film).length, 4);
    if (film && film.overview) score += 1;
    return score;
  }

  function bestKnownFilm(film) {
    const id = filmId(film);
    const tmdb = Number(film && film.tmdb);
    const matches = [];
    for (const pool of [state.catalog, offlineFilms, FILMS]) {
      for (const row of pool || []) {
        if (!row) continue;
        if (filmId(row) === id || (tmdb > 0 && Number(row.tmdb) === tmdb)) matches.push(row);
      }
    }
    if (!matches.length) return null;
    matches.sort((a, b) => filmDetailScore(b) - filmDetailScore(a));
    return matches[0];
  }

  function upsertActorCredit(film, actorName) {
    const known = bestKnownFilm(film);
    const base = known || film;
    const cast = castWithActor(filmCastNames(base), actorName);
    const prevCast = filmCastNames(base);
    const inCatalog = !!(known && state.catalog.some((row) => filmId(row) === filmId(base) || (Number(base.tmdb) > 0 && Number(row.tmdb) === Number(base.tmdb))));
    const sameCast = prevCast.length === cast.length && prevCast.every((name, index) => name === cast[index]);
    if (inCatalog && sameCast) {
      return {
        film: state.catalog.find((row) => filmId(row) === filmId(base) || (Number(base.tmdb) > 0 && Number(row.tmdb) === Number(base.tmdb))) || base,
        changed: false,
      };
    }
    const stored = rememberFilm({ ...base, cast }, { persist: false });
    return stored ? { film: stored, changed: true } : null;
  }

  function pickPersonId(results, name) {
    const q = foldSearch(name);
    const rows = Array.isArray(results) ? results : [];
    const exact = rows.find((row) => foldSearch(row && row.name) === q);
    const chosen = exact || rows[0];
    const id = Number(chosen && chosen.id);
    if (!Number.isFinite(id) || id <= 0) return 0;
    return Math.floor(id);
  }

  function filmsFromPersonCredits(data, actorName) {
    const rows = ((data && data.cast) || []).filter((row) => (
      row
      && row.id
      && !row.adult
      && (row.title || row.original_title)
      && row.media_type !== "tv"
    ));
    const seen = new Set();
    const films = [];
    for (const row of rows) {
      const film = fromTmdbMovie(row);
      if (!film || !film.title || film.title === "Film") continue;
      const id = filmId(film);
      if (!id || seen.has(id)) continue;
      seen.add(id);
      film.cast = castWithActor(film.cast, actorName);
      films.push(film);
    }
    return films;
  }

  function nameMatchesActor(film, actorName) {
    const q = foldSearch(actorName);
    if (!q) return false;
    return filmCastNames(film).some((name) => {
      const folded = foldSearch(name);
      return folded === q || folded.includes(q);
    });
  }

  function hybridActorCount(actor) {
    const ids = new Set(actor && actor.liveIdSet ? actor.liveIdSet : []);
    if (actor && actor.name) {
      for (const film of allKnownFilms()) {
        if (nameMatchesActor(film, actor.name)) ids.add(filmId(film));
      }
    }
    return ids.size;
  }

  function applyActorFilmography(actor, cached) {
    if (!actor || !cached || !actorStillSelected(actor)) return;
    const storedFilms = [];
    const ids = [];
    for (const film of cached.films || []) {
      const result = upsertActorCredit(film, actor.name);
      if (!result || !result.film) continue;
      ids.push(filmId(result.film));
      if (result.changed) storedFilms.push(result.film);
    }
    persistKnownFilms(storedFilms);
    actor.tmdb = actor.tmdb || cached.tmdb || 0;
    actor.liveIdSet = new Set(ids);
    actor.liveCount = hybridActorCount(actor);
    actor.filmStatus = "live";
    cached.ids = ids.slice();
    cached.count = actor.liveCount;
    actorCreditCache.set(foldSearch(actor.name), cached);
    paintActorCounts();
  }

  async function loadActorFilmography(actor) {
    if (!actor || !actor.name || !remoteSearchAvailable()) return;
    const key = foldSearch(actor.name);
    if (!key) return;
    const cached = actorCreditCache.get(key);
    if (cached && Array.isArray(cached.films)) {
      applyActorFilmography(actor, cached);
      return;
    }
    actor.filmStatus = "loading";
    try {
      let personId = Number(actor.tmdb) || 0;
      if (!Number.isFinite(personId) || personId <= 0) {
        const found = await proxyFetch("/search/person", { query: actor.name });
        if (!actorStillSelected(actor)) return;
        personId = pickPersonId(found && found.results, actor.name);
      } else {
        personId = Math.floor(personId);
      }
      if (!personId) {
        actor.filmStatus = "";
        return;
      }
      actor.tmdb = personId;
      const data = await proxyFetch(`/person/${personId}/movie_credits`);
      const films = filmsFromPersonCredits(data, actor.name);
      const entry = {
        tmdb: personId,
        ids: films.map((film) => filmId(film)),
        films,
        count: films.length,
      };
      actorCreditCache.set(key, entry);
      if (!actorStillSelected(actor)) return;
      applyActorFilmography(actor, entry);
    } catch {
      if (actorStillSelected(actor) && actor.filmStatus === "loading") actor.filmStatus = "";
    }
  }

  function scheduleActorSearch(query) {
    window.clearTimeout(actorTimer);
    actorSeq += 1;
    const q = String(query || "").trim();
    const seq = actorSeq;
    if (!q) {
      state.actorHits = [];
      state.actorStatus = "";
      paintActorHits();
      return;
    }
    const local = catalogActorHits(q);
    state.actorHits = local;
    const live = remoteSearchAvailable() && localActorSearchIsThin(local, q);
    state.actorStatus = live ? (local.length ? "ok" : "loading") : (local.length ? "ok" : "empty");
    paintActorHits();
    if (!live) return;
    actorTimer = window.setTimeout(async () => {
      if (seq !== actorSeq) return;
      try {
        const data = await proxyFetch("/search/person", { query: q });
        if (seq !== actorSeq) return;
        const localCount = new Map(local.map((row) => [foldSearch(row.name), row.count]));
        const remote = (data.results || []).slice(0, 8).map((row) => ({
          id: `p${row.id}`,
          name: row.name,
          tmdb: row.id,
          count: localCount.get(foldSearch(row.name)) || 0,
          profile: row.profile_path ? `https://image.tmdb.org/t/p/w185${row.profile_path}` : "",
        })).filter((row) => row.name);
        const seen = new Set();
        const hits = [];
        for (const row of remote.concat(local)) {
          const key = foldSearch(row.name);
          if (!key || seen.has(key)) continue;
          seen.add(key);
          hits.push(row);
          if (hits.length >= 8) break;
        }
        state.actorHits = hits;
        state.actorStatus = hits.length ? "ok" : "empty";
      } catch {
        if (seq !== actorSeq) return;
        state.actorHits = local;
        state.actorStatus = local.length ? "ok" : "offline";
      }
      paintActorHits();
    }, 220);
  }

  function similarSearchPool() {
    if (state.catalog && state.catalog.length) return state.catalog;
    return allKnownFilms();
  }

  function scheduleSimilarSearch(query) {
    window.clearTimeout(similarTimer);
    similarSeq += 1;
    state.similarVisible = 20;
    const q = String(query || "").trim();
    const seq = similarSeq;
    if (!q) {
      state.similarHits = [];
      state.similarStatus = "";
      paintSimilarList();
      return;
    }
    const applyLocal = () => {
      if (seq !== similarSeq || state.watchSheet !== "similar") return false;
      if (String(state.similarQuery || "").trim() !== q) return false;
      const local = rankSearchFilms(similarSearchPool(), q);
      state.similarHits = local;
      if (!tmdbKey()) {
        state.similarStatus = local.length ? "ok" : "empty";
        paintSimilarList();
        return false;
      }
      state.similarStatus = local.length ? "ok" : "loading";
      paintSimilarList();
      return true;
    };
    if (!state.catalog.length) {
      loadCatalog().then(() => {
        if (seq !== similarSeq || state.watchSheet !== "similar") return;
        if (String(state.similarQuery || "").trim() !== q) return;
        if (applyLocal()) similarTimer = window.setTimeout(() => runSimilarSearch(q, seq), 200);
      });
      return;
    }
    if (!applyLocal()) return;
    similarTimer = window.setTimeout(() => runSimilarSearch(q, seq), 200);
  }

  async function runSimilarSearch(query, scheduledSeq) {
    const seq = scheduledSeq || similarSeq;
    if (seq !== similarSeq || state.watchSheet !== "similar") return;
    if (!state.catalog.length) await loadCatalog();
    if (seq !== similarSeq) return;
    const local = rankSearchFilms(similarSearchPool(), query);
    if (!tmdbKey()) {
      state.similarHits = local;
      state.similarStatus = local.length ? "ok" : "empty";
      paintSimilarList();
      return;
    }
    try {
      const data = await tmdbFetch("/search/movie", { query });
      if (seq !== similarSeq) return;
      const remote = (data.results || []).map(fromTmdbMovie).filter((film) => film && film.title);
      remote.forEach((film) => rememberFilm(film));
      const merged = [];
      const seen = new Set();
      for (const film of local.concat(remote)) {
        const id = filmId(film);
        if (!id || seen.has(id)) continue;
        seen.add(id);
        merged.push(film);
      }
      state.similarHits = rankSearchFilms(merged, query, true);
      state.similarStatus = state.similarHits.length ? "ok" : "empty";
    } catch {
      if (seq !== similarSeq) return;
      state.similarHits = local;
      state.similarStatus = local.length ? "ok" : "empty";
    }
    paintSimilarList();
  }

  function scheduleTitleSearch(query) {
    window.clearTimeout(searchTimer);
    searchSeq += 1;
    beginSearchEnrichCycle();
    resetWatchSheetPage();
    const q = String(query || "").trim();
    const seq = searchSeq;
    if (!q) {
      state.searchHits = [];
      state.searchStatus = "";
      paintWatchSheetList();
      return;
    }
    const applyLocal = () => {
      if (seq !== searchSeq) return false;
      if (state.watchSheet !== "search") return false;
      if (String(state.watchSearch || "").trim() !== q) return false;
      const found = titleSearchLocal(q);
      const local = found.visible;
      state.searchHits = local;
      if (!remoteSearchAvailable() || !found.thin) {
        state.searchStatus = local.length ? "ok" : "empty";
        paintWatchSheetList();
        return false;
      }
      state.searchStatus = local.length ? "ok" : "loading";
      paintWatchSheetList();
      return true;
    };
    if (!state.catalog.length) {
      loadCatalog().then(() => {
        if (seq !== searchSeq) return;
        if (state.watchSheet !== "search" || String(state.watchSearch || "").trim() !== q) return;
        if (applyLocal()) {
          searchTimer = window.setTimeout(() => {
            if (seq !== searchSeq) return;
            runTitleSearch(q, seq);
          }, 200);
        }
      });
      return;
    }
    if (!applyLocal()) return;
    searchTimer = window.setTimeout(() => {
      if (seq !== searchSeq) return;
      runTitleSearch(q, seq);
    }, 200);
  }

  async function runTitleSearch(query, scheduledSeq) {
    if (!state.catalog.length) await loadCatalog();
    const seq = scheduledSeq || searchSeq;
    if (seq !== searchSeq) return;
    const found = titleSearchLocal(query);
    const local = found.visible;
    if (seq !== searchSeq) return;
    state.searchHits = local;
    if (!remoteSearchAvailable() || !found.thin) {
      state.searchStatus = local.length ? "ok" : "empty";
      paintWatchSheetList();
      return;
    }
    try {
      const data = await proxyFetch("/search/movie", { query });
      if (seq !== searchSeq) return;
      const remote = (data.results || []).map(fromTmdbMovie).filter((film) => film && film.title);
      const merged = [];
      const seen = new Set();
      for (const film of local.concat(remote)) {
        const id = filmId(film);
        if (!id || seen.has(id)) continue;
        seen.add(id);
        merged.push(film);
      }
      state.searchHits = rankSearchFilms(merged, query, true);
      state.searchStatus = state.searchHits.length ? "ok" : "empty";
    } catch {
      if (seq !== searchSeq) return;
      state.searchHits = local;
      state.searchStatus = local.length ? "ok" : "offline";
    }
    if (seq !== searchSeq) return;
    paintWatchSheetList();
  }

  function filmWithPoster(film) {
    if (!film) return null;
    let poster = film.poster || "";
    if (!poster && film.poster_path) {
      poster = tmdbPoster(film.poster_path);
    }
    const id = filmId(film);
    const loginHit = LOGIN_POSTERS.find((row) => filmId(row) === id);
    if (!poster && loginHit && loginHit.poster) poster = loginHit.poster;
    const known = findFilm(id);
    if (!poster && known) {
      if (known.poster) poster = known.poster;
      else if (known.poster_path) poster = tmdbPoster(known.poster_path);
    }
    if (poster && poster !== film.poster) {
      return Object.assign({}, film, { poster });
    }
    if (film.poster) return film;
    return film;
  }

  function uniqueProviderNames(values) {
    const seen = new Set();
    const out = [];
    for (const value of values || []) {
      const text = String(value || "").trim();
      if (!text) continue;
      const mapped = PROVIDER_NAME_MAP[text] || text;
      const key = mapped.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(mapped);
    }
    return out;
  }

  function fallbackProvidersFor(film) {
    if (!film) return [];
    const id = filmId(film);
    if (FALLBACK_PROVIDERS[id]) return FALLBACK_PROVIDERS[id].slice();
    const tmdb = Number(film.tmdb);
    if (Number.isFinite(tmdb) && FALLBACK_PROVIDERS[`t${tmdb}`]) {
      return FALLBACK_PROVIDERS[`t${tmdb}`].slice();
    }
    return uniqueProviderNames(film.providers || film.streaming || []);
  }

  function formatProviderLine(names) {
    const list = uniqueProviderNames(names);
    if (!list.length) return { text: "", extra: false };
    const shown = list.slice(0, 3);
    return { text: shown.join(", "), extra: list.length > 3 };
  }

  async function loadFilmProviders(film) {
    const fallback = fallbackProvidersFor(film);
    if (film && Array.isArray(film.providers) && film.providers.length) {
      return uniqueProviderNames(film.providers);
    }
    if (!film || !film.tmdb || !tmdbKey()) return fallback;
    try {
      const data = await tmdbFetch(`/movie/${film.tmdb}/watch/providers`);
      const de = data && data.results && data.results.DE;
      const rows = [].concat((de && de.flatrate) || [], (de && de.ads) || []);
      const names = uniqueProviderNames(rows.map((row) => row && row.provider_name));
      if (names.length) {
        film.providers = names;
        rememberFilm(film);
        return names;
      }
    } catch {
      /* keep fallback */
    }
    return fallback;
  }

  function zufallPoolFilms() {
    return zufallMatchStats().matched.filter((film) => film && film.poster);
  }

  function isZufallPoolFilm(film) {
    if (!film) return false;
    const id = filmId(film);
    return zufallUi.pool.some((row) => filmId(row) === id);
  }

  function packZufallPosters(pool, fillers) {
    const target = 96;
    const packed = [];
    const flags = [];
    if (!pool.length) return { packed, flags };
    const poolIds = new Set(pool.map((film) => filmId(film)));
    const fillerSrc = (fillers || []).filter((film) => film && film.poster && !poolIds.has(filmId(film)));
    const extras = fillerSrc.length ? fillerSrc : (fillers || []).filter((film) => film && film.poster);
    const sprinkle = pool.length < 16 ? Math.max(2, Math.min(6, 18 - pool.length)) : 1;
    let fi = 0;
    while (packed.length < target) {
      for (const film of pool) {
        packed.push(film);
        flags.push(false);
        if (packed.length >= target) break;
      }
      if (packed.length >= target) break;
      for (let k = 0; k < sprinkle && packed.length < target; k += 1) {
        const extra = extras.length ? extras[fi % extras.length] : pool[fi % pool.length];
        packed.push(extra);
        flags.push(extras.length ? true : false);
        fi += 1;
      }
    }
    return { packed: packed.slice(0, target), flags: flags.slice(0, target) };
  }

  const ZUFALL_RADIUS_IDLE = 168;
  const ZUFALL_RADIUS_SETTLED = 156;
  const ZUFALL_PERSP = 1100;

  function zufallMetrics(settled, mix) {
    const t = settled ? 1 : Math.max(0, Math.min(1, mix || 0));
    const box = zufallUi.root ? zufallUi.root.getBoundingClientRect() : null;
    const maxRadius = box && box.width
      ? Math.max(120, Math.floor(box.width / 2) - 10)
      : ZUFALL_RADIUS_IDLE;
    const desired = Math.round(
      ZUFALL_RADIUS_IDLE + ((ZUFALL_RADIUS_SETTLED - ZUFALL_RADIUS_IDLE) * t)
    );
    return {
      radius: Math.min(maxRadius, desired),
      tilt: -20,
      hide: 46,
    };
  }

  function applyZufallPerspective() {
    const root = zufallUi.root || zufallSheetRoot();
    const inner = root && root.querySelector(".login-carousel-inner");
    if (!inner) return;
    const persp = `${ZUFALL_PERSP}px`;
    inner.style.perspective = persp;
    inner.style.webkitPerspective = persp;
  }

  function paintZufallCarousel() {
    paintCarouselView(zufallUi);
  }

  function zufallSheetRoot() {
    return watchSheetEl && watchSheetEl.querySelector("[data-role=zufall-carousel]");
  }

  function setZufallCues(on, opts) {
    const root = zufallSheetRoot();
    if (!root) return;
    const ember = !!(opts && opts.ember);
    root.classList.toggle("is-cuing", on && !ember);
    const chevrons = root.querySelector("[data-role=zufall-chevrons]");
    const swipen = root.querySelector("[data-role=zufall-swipen]");
    if (chevrons) chevrons.hidden = !on;
    if (swipen) {
      swipen.hidden = !on;
      swipen.classList.toggle("is-on", on && !ember);
    }
  }

  function nudgeZufallCarousel() {
    const inner = zufallSheetRoot() && zufallSheetRoot().querySelector(".login-carousel-inner");
    if (!inner || zufallUi.reduced) return;
    inner.classList.remove("is-hinting");
    void inner.offsetWidth;
    inner.classList.add("is-hinting");
    window.setTimeout(() => inner.classList.remove("is-hinting"), 1300);
  }

  function paintZufallActions() {
    if (!watchSheetEl) return;
    const idle = watchSheetEl.querySelector("[data-role=zufall-idle-actions]");
    const result = watchSheetEl.querySelector("[data-role=zufall-result]");
    const push = watchSheetEl.querySelector("[data-act=zufall-push]");
    const skip = watchSheetEl.querySelector("[data-act=zufall-skip]");
    const spinning = zufallUi.phase === "spinning";
    const done = zufallUi.phase === "result";
    if (idle) idle.hidden = done;
    if (result) result.hidden = !done;
    if (push) {
      const poolEmpty = !zufallUi.pool.length;
      push.hidden = done;
      push.disabled = poolEmpty;
      push.classList.toggle("is-disabled", poolEmpty);
      push.classList.toggle("is-spinning", spinning);
      push.setAttribute("aria-disabled", poolEmpty ? "true" : "false");
    }
    if (skip && (!spinning || done)) skip.hidden = true;
    const root = zufallSheetRoot();
    if (root) root.classList.toggle("is-settled", done);
  }

  function shortZufallTitle(film) {
    if (!film || !film.title) return "";
    const title = String(film.title);
    if (title.length <= 28) return title;
    return `${title.slice(0, 26).trim()}…`;
  }

  function paintZufallResult() {
    const box = watchSheetEl && watchSheetEl.querySelector("[data-role=zufall-result]");
    if (!box || !zufallUi.front) return;
    const { left, center, right } = zufallUi.front;
    const leftBtn = box.querySelector("[data-side=left]");
    const rightBtn = box.querySelector("[data-side=right]");
    const title = box.querySelector("[data-role=zufall-title-center]");
    const stream = box.querySelector("[data-role=zufall-stream]");
    const providers = box.querySelector("[data-role=zufall-providers]");
    const watch = box.querySelector("[data-act=choose]");
    if (leftBtn) {
      leftBtn.textContent = shortZufallTitle(left);
      leftBtn.disabled = !left || filmId(left) === filmId(center);
    }
    if (rightBtn) {
      rightBtn.textContent = shortZufallTitle(right);
      rightBtn.disabled = !right || filmId(right) === filmId(center);
    }
    if (title) {
      title.textContent = center ? center.title : "";
      title.classList.toggle("is-ember", zufallUi.phase === "result");
    }
    if (watch && center) watch.dataset.id = filmId(center);
    const line = formatProviderLine(center && (center.providers || fallbackProvidersFor(center)));
    if (stream) stream.hidden = !line.text;
    if (providers) {
      providers.innerHTML = line.text
        ? (line.extra
          ? `${escapeHtml(line.text)}<span class="zufall-mehr">+ mehr</span>`
          : escapeHtml(line.text))
        : "";
    }
  }

  async function refreshZufallProviders(film) {
    const names = await loadFilmProviders(film);
    if (!zufallUi.front || !film || filmId(zufallUi.front.center) !== filmId(film)) return;
    zufallUi.front.center.providers = names;
    paintZufallResult();
  }

  function uniquePoolFilms() {
    const seen = new Set();
    const out = [];
    for (const film of zufallUi.pool || []) {
      const id = filmId(film);
      if (!id || seen.has(id)) continue;
      seen.add(id);
      out.push(film);
    }
    return out;
  }

  function pickDistinctTrio(center, preferredLeft, preferredRight) {
    const uniq = uniquePoolFilms();
    const centerFilm = (center && uniq.some((film) => filmId(film) === filmId(center)))
      ? center
      : (uniq[0] || center || null);
    if (!centerFilm) return { left: null, center: null, right: null };
    const cid = filmId(centerFilm);
    const rest = uniq.filter((film) => filmId(film) !== cid);
    if (uniq.length <= 1) {
      const only = uniq[0] || centerFilm;
      return { left: only, center: only, right: only };
    }
    function take(preferred, used) {
      const id = preferred && filmId(preferred);
      if (id && !used.has(id) && rest.some((film) => filmId(film) === id)) return preferred;
      return rest.find((film) => !used.has(filmId(film))) || null;
    }
    const used = new Set([cid]);
    const left = take(preferredLeft, used) || rest[0];
    used.add(filmId(left));
    const right = take(preferredRight, used) || (uniq.length === 2 ? left : rest.find((film) => !used.has(filmId(film))) || left);
    return { left, center: centerFilm, right };
  }

  function tripletAt(index) {
    const n = zufallUi.posters.length;
    if (!n) return { left: null, center: null, right: null };
    const packedCenter = zufallUi.posters[index];
    const center = (packedCenter && !zufallUi.isFiller[index] && isZufallPoolFilm(packedCenter))
      ? packedCenter
      : zufallUi.posters[nearestPoolIndex(index)];
    const leftIdx = (index - 1 + n) % n;
    const rightIdx = (index + 1) % n;
    const leftPacked = zufallUi.posters[leftIdx];
    const rightPacked = zufallUi.posters[rightIdx];
    const preferLeft = (!zufallUi.isFiller[leftIdx] && isZufallPoolFilm(leftPacked)) ? leftPacked : null;
    const preferRight = (!zufallUi.isFiller[rightIdx] && isZufallPoolFilm(rightPacked)) ? rightPacked : null;
    return pickDistinctTrio(center, preferLeft, preferRight);
  }

  function nearestPoolIndex(from) {
    const n = zufallUi.posters.length;
    if (!n) return 0;
    for (let dist = 0; dist <= n; dist += 1) {
      const signs = dist === 0 ? [0] : [-1, 1];
      for (const sign of signs) {
        const i = (from + sign * dist + n * 8) % n;
        if (!zufallUi.isFiller[i] && isZufallPoolFilm(zufallUi.posters[i])) return i;
      }
    }
    return from;
  }

  function findLandingIndex(winner) {
    const n = zufallUi.posters.length;
    const want = filmId(winner);
    const ranked = [];
    for (let i = 0; i < n; i += 1) {
      if (zufallUi.isFiller[i] || filmId(zufallUi.posters[i]) !== want) continue;
      const leftIdx = (i - 1 + n) % n;
      const rightIdx = (i + 1) % n;
      const lOk = !zufallUi.isFiller[leftIdx] && isZufallPoolFilm(zufallUi.posters[leftIdx]);
      const rOk = !zufallUi.isFiller[rightIdx] && isZufallPoolFilm(zufallUi.posters[rightIdx]);
      ranked.push({ i, score: (lOk ? 1 : 0) + (rOk ? 1 : 0) });
    }
    ranked.sort((a, b) => b.score - a.score);
    return ranked.length ? ranked[0].i : nearestPoolIndex(carouselFrontIndex(zufallUi));
  }

  function burstZufallFireworks() {
    const cover = zufallUi.covers && zufallUi.covers.center;
    if (!cover) {
      burstConfetti({ ember: true });
      return;
    }
    const rect = cover.getBoundingClientRect();
    burstConfetti({
      ember: true,
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height * 0.35,
    });
  }

  function settleZufallAt(index, opts) {
    const quiet = !!(opts && opts.quiet);
    const idx = nearestPoolIndex(index);
    const step = 360 / Math.max(1, zufallUi.posters.length);
    const snapped = -idx * step;
    let turns = Math.round((zufallUi.angle - snapped) / 360);
    if (!Number.isFinite(turns)) turns = 0;
    zufallUi.angle = snapped + (turns * 360);
    zufallUi.front = tripletAt(idx);
    zufallUi.frontLocked = true;
    zufallUi.phase = "result";
    zufallUi.mode = "idle";
    zufallUi.vel = 0;
    zufallUi.metrics = zufallMetrics(true);
    window.clearTimeout(zufallUi.skipTimer);
    setZufallCues(true, { ember: true });
    paintZufallCarousel();
    paintZufallResult();
    paintZufallActions();
    if (!quiet) burstZufallFireworks();
    refreshZufallProviders(zufallUi.front.center);
    const pushBtn = watchSheetEl && watchSheetEl.querySelector("[data-act=zufall-push]");
    if (pushBtn && !zufallUi.reduced) {
      pushBtn.classList.add("is-result-flash");
      window.setTimeout(() => pushBtn.classList.remove("is-result-flash"), 420);
    }
  }

  function settleZufallFromAngle() {
    settleZufallAt(carouselFrontIndex(zufallUi));
  }

  function hideZufallIdleCues() {
    setZufallCues(false);
  }

  function showZufallIdleCues() {
    setZufallCues(true);
    nudgeZufallCarousel();
  }

  function hermiteEase(p0, e0, v0, p1, e1, v1, p) {
    const t = (p - p0) / (p1 - p0);
    const t2 = t * t;
    const t3 = t2 * t;
    const dp = p1 - p0;
    return (
      ((2 * t3) - (3 * t2) + 1) * e0
      + ((t3 - (2 * t2) + t) * dp * v0)
      + (((-2 * t3) + (3 * t2)) * e1)
      + ((t3 - t2) * dp * v1)
    );
  }

  function slotSpinEase(p) {
    if (p <= 0) return 0;
    if (p >= 1) return 1;
    if (p < 0.4) return hermiteEase(0, 0, 2.55, 0.4, 0.78, 0.62, p);
    return hermiteEase(0.4, 0.78, 0.62, 1, 1, 0, p);
  }

  function stopZufallSpinRaf() {
    if (zufallUi.spinRaf) cancelAnimationFrame(zufallUi.spinRaf);
    zufallUi.spinRaf = 0;
  }

  function startZufallAutoSpin(opts) {
    const skip = !!(opts && opts.skip);
    if (!zufallUi.pool.length) return;
    if (zufallUi.phase === "spinning") return;
    try {
      if (navigator.vibrate) navigator.vibrate(10);
    } catch { /* ignore */ }
    hideZufallIdleCues();
    zufallUi.phase = "spinning";
    zufallUi.frontLocked = false;
    zufallUi.front = null;
    zufallUi.metrics = zufallMetrics(false);
    const root = zufallSheetRoot();
    if (root) root.classList.remove("is-settled");
    paintZufallActions();
    const winner = zufallUi.pool[Math.floor(Math.random() * zufallUi.pool.length)];
    const targetIdx = findLandingIndex(winner);
    const n = zufallUi.posters.length;
    const step = 360 / Math.max(1, n);
    const from = zufallUi.angle;
    let target = -targetIdx * step;
    while (target > from) target -= 360;
    const minTravel = skip ? 40 : 1080;
    while (from - target < minTravel) target -= 360;
    if (zufallUi.reduced || skip) {
      settleZufallAt(targetIdx);
      return;
    }
    window.clearTimeout(zufallUi.skipTimer);
    zufallUi.skipTimer = window.setTimeout(() => {
      const skipBtn = watchSheetEl && watchSheetEl.querySelector("[data-act=zufall-skip]");
      if (skipBtn && zufallUi.phase === "spinning") skipBtn.hidden = false;
    }, 1200);
    const dur = 3000;
    const t0 = performance.now();
    zufallUi.mode = "auto";
    stopZufallSpinRaf();
    zufallUi.spinTargetIdx = targetIdx;
    function stepSpin(now) {
      if (zufallUi.mode !== "auto") return;
      const p = Math.min(1, (now - t0) / dur);
      zufallUi.angle = from + ((target - from) * slotSpinEase(p));
      const settleMix = p < 0.78 ? 0 : ((p - 0.78) / 0.22);
      zufallUi.metrics = zufallMetrics(false, settleMix * settleMix);
      paintZufallCarousel();
      if (p < 1) zufallUi.spinRaf = requestAnimationFrame(stepSpin);
      else {
        zufallUi.spinRaf = 0;
        settleZufallAt(targetIdx);
      }
    }
    zufallUi.spinRaf = requestAnimationFrame(stepSpin);
  }

  function skipZufallSpin() {
    if (zufallUi.phase !== "spinning") return;
    zufallUi.mode = "idle";
    stopZufallSpinRaf();
    const idx = Number.isFinite(zufallUi.spinTargetIdx)
      ? zufallUi.spinTargetIdx
      : nearestPoolIndex(carouselFrontIndex(zufallUi));
    settleZufallAt(idx);
  }

  function resetZufallIdle() {
    stopZufallSpinRaf();
    window.clearTimeout(zufallUi.skipTimer);
    zufallUi.phase = "idle";
    zufallUi.mode = "idle";
    zufallUi.frontLocked = false;
    zufallUi.front = null;
    zufallUi.vel = 0;
    zufallUi.metrics = zufallMetrics(false);
    const root = zufallSheetRoot();
    if (root) root.classList.remove("is-settled");
    paintZufallCarousel();
    paintZufallActions();
    showZufallIdleCues();
  }

  function swapZufallFront(side) {
    if (zufallUi.phase !== "result" || !zufallUi.front) return;
    const { left, center, right } = zufallUi.front;
    if (side === "left" && left && filmId(left) !== filmId(center)) {
      zufallUi.front = { left: center, center: left, right };
    } else if (side === "right" && right && filmId(right) !== filmId(center)) {
      zufallUi.front = { left, center: right, right: center };
    } else {
      return;
    }
    paintZufallCarousel();
    paintZufallResult();
    refreshZufallProviders(zufallUi.front.center);
  }

  function onZufallUserSpin() {
    if (zufallUi.phase === "result") {
      const root = zufallSheetRoot();
      if (root) root.classList.remove("is-settled");
      zufallUi.frontLocked = false;
      zufallUi.front = null;
    }
    if (zufallUi.phase === "idle" || zufallUi.phase === "result") {
      zufallUi.phase = "spinning";
      hideZufallIdleCues();
      paintZufallActions();
    }
  }

  function finishZufallRest(info) {
    zufallUi.vel = 0;
    zufallUi.mode = "idle";
    paintZufallCarousel();
    if (zufallUi.phase === "result") return;
    if (info && info.moved === false && zufallUi.phase === "idle") return;
    if (zufallUi.phase === "idle") return;
    settleZufallFromAngle();
  }

  function snapZufallCarousel() {
    snapCarouselToStep(zufallUi, paintZufallCarousel, () => finishZufallRest({ moved: true }));
  }

  function ensureZufallCoast() {
    ensureCarouselCoast(zufallUi, paintZufallCarousel, snapZufallCarousel);
  }

  function onZufallResize() {
    if (!zufallUi.root) return;
    applyZufallPerspective();
    zufallUi.metrics = zufallMetrics(zufallUi.phase === "result");
    paintZufallCarousel();
  }

  function teardownZufallCarousel() {
    stopZufallSpinRaf();
    window.clearTimeout(zufallUi.skipTimer);
    if (zufallUi.unbind) zufallUi.unbind();
    if (zufallUi.raf) cancelAnimationFrame(zufallUi.raf);
    window.removeEventListener("resize", onZufallResize);
    zufallUi.unbind = null;
    zufallUi.raf = 0;
    zufallUi.root = null;
    zufallUi.ring = null;
    zufallUi.items = [];
    zufallUi.covers = null;
    zufallUi.drag = null;
    zufallUi.posters = [];
    zufallUi.isFiller = [];
    zufallUi.pool = [];
    zufallUi.front = null;
    zufallUi.frontLocked = false;
    zufallUi.phase = "idle";
    zufallUi.mode = "idle";
    zufallUi.vel = 0;
  }

  async function mountZufallCarousel() {
    const root = watchSheetEl && watchSheetEl.querySelector("[data-role=zufall-carousel]");
    if (!root) return;
    root.hidden = false;
    const seq = ++zufallUi.mountSeq;
    teardownZufallCarousel();
    zufallUi.root = root;
    zufallUi.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pool = zufallPoolFilms().filter((film) => film && film.poster);
    if (!pool.length) {
      paintZufallActions();
      return;
    }
    const fillerRows = await ensureLoginPostersPreloaded();
    await Promise.all(pool.map((film) => preloadLoginImage(loginPosterSrc(film))));
    if (seq !== zufallUi.mountSeq) return;
    if (state.watchSheet !== "zufall") return;
    const packed = packZufallPosters(pool, fillerRows);
    zufallUi.pool = pool;
    zufallUi.posters = packed.packed;
    zufallUi.isFiller = packed.flags;
    const ring = root.querySelector("[data-role=login-ring]");
    zufallUi.ring = ring;
    zufallUi.items = [];
    if (ring) {
      const frag = document.createDocumentFragment();
      packed.packed.forEach((film, i) => {
        const src = loginPosterSrc(film);
        const el = document.createElement("div");
        el.className = packed.flags[i] ? "login-ring-item is-filler" : "login-ring-item";
        if (src && loginPosterReady(src)) el.style.backgroundImage = `url("${src}")`;
        frag.appendChild(el);
        zufallUi.items.push(el);
      });
      ring.innerHTML = "";
      ring.appendChild(frag);
    }
    zufallUi.covers = {
      left: root.querySelector("[data-role=cover-left]"),
      center: root.querySelector("[data-role=cover-center]"),
      right: root.querySelector("[data-role=cover-right]"),
    };
    zufallUi.metrics = zufallMetrics(false);
    applyZufallPerspective();
    zufallUi.angle = 0;
    zufallUi.unbind = bindCarouselPointer(zufallUi, root, {
      paint: paintZufallCarousel,
      onRest: finishZufallRest,
      snap: snapZufallCarousel,
      coast: ensureZufallCoast,
      onUserSpin: onZufallUserSpin,
      canDrag: () => zufallUi.phase === "idle" || zufallUi.phase === "result",
    });
    window.addEventListener("resize", onZufallResize);
    root.classList.add("is-ready");
    paintZufallCarousel();
    paintZufallActions();
    showZufallIdleCues();
  }

  function zufallChipTiles() {
    const films = zufallPoolFilms().filter((film) => film.poster).slice(0, 3);
    const fallback = HERO_COVERS.map((row) => ({ poster: row.src }));
    const tiles = (films.length ? films.concat(fallback).slice(0, 3) : fallback);
    return tiles.map((film) => {
      const src = posterUrl(film, POSTER_SIZE_THUMB) || film.poster;
      return `<img class="zufall-chip-tile" src="${escapeHtml(src)}" alt="" width="24" height="36" decoding="async" referrerpolicy="no-referrer">`;
    }).join("");
  }

  function paintZufallChip() {
    const empty = originPoolCount() < 1;
    document.querySelectorAll("[data-act=zufall-open]").forEach((btn) => {
      btn.disabled = empty;
      btn.setAttribute("aria-disabled", empty ? "true" : "false");
      btn.title = empty ? "Mind. 1 Film" : "Zufallswahl";
      const icon = btn.querySelector("[data-role=zufall-chip-icon]");
      if (icon) icon.innerHTML = zufallChipTiles();
    });
    const hint = app.querySelector("[data-role=zufall-empty-hint]");
    if (hint) hint.hidden = !empty;
    paintFooterZufallIcon();
  }

  function paintFooterZufallIcon() {
    const icon = footer && footer.querySelector("[data-role=footer-zufall-icon]");
    if (!icon) return;
    icon.innerHTML = `<span class="watch-zufall-stack">${zufallChipTiles()}</span>`;
  }

  function listenIconRowsHtml() {
    const films = watchlistFilms().slice(0, 3);
    const placeholders = [0, 1, 2].map((i) => {
      const film = films[i];
      const poster = film ? (posterUrl(film, POSTER_SIZE_THUMB) || film.poster) : "";
      const thumb = poster
        ? `<img class="nav-listen-poster" src="${escapeHtml(poster)}" alt="" width="8" height="11" decoding="async" referrerpolicy="no-referrer">`
        : `<span class="nav-listen-poster is-ph" aria-hidden="true"></span>`;
      return `<span class="nav-listen-row">${thumb}<span class="nav-listen-lines" aria-hidden="true"><i></i><i></i></span><span class="nav-listen-pill" aria-hidden="true"></span></span>`;
    });
    return placeholders.join("");
  }

  function paintFooterListenIcon() {
    const icon = footer && footer.querySelector("[data-role=footer-listen-icon]");
    if (!icon) return;
    icon.innerHTML = `<span class="nav-listen-card" aria-hidden="true">${listenIconRowsHtml()}</span>`;
  }

  function watchSwipeHintSeen() {
    if (!state.user || !state.profile) return true;
    return !!loadJson(pkey("watchSwipeHint"), false);
  }

  function dismissWatchSwipeHint() {
    if (!state.user || !state.profile || watchSwipeHintSeen()) return;
    saveJson(pkey("watchSwipeHint"), true);
    document.querySelectorAll(".swipe-track.is-swipe-hint").forEach((row) => {
      row.classList.remove("is-swipe-hint");
    });
  }

  function maybeWatchlistSwipeHint() {
    if (watchSwipeHintSeen()) return;
    if (state.screen !== "lists" || state.listTab !== "watch" || state.listsMode === "videos") return;
    const list = app.querySelector("[data-role=film-list]");
    if (!list || list.classList.contains("video-mode")) return;
    if (!list || !list.querySelector(".swipe-track")) return;
    const track = list.querySelector(".swipe-track");
    if (!track || track.classList.contains("is-swipe-hint")) return;
    track.classList.add("is-swipe-hint");
    window.setTimeout(() => dismissWatchSwipeHint(), 5200);
  }

  function openZufallSheet() {
    const origin = defaultZufallOrigin().filter((id) => zufallSourceMeta(id));
    state.zufallOrigin = origin.slice();
    state.zufallSources = origin.slice();
    state.filterMore.zufall = false;
    loadZufallFiltersFromStorage();
    if (!zufallUnionCount(state.zufallSources)) return;
    closeFilmMenus();
    teardownZufallCarousel();
    state.watchSheet = "zufall";
    paintWatchSheet();
  }

  function zufallAvailableSources() {
    const out = ["watch", "queue", "rated"];
    customTags("film").forEach((tag) => out.push(`tag:${tag.id}`));
    return out.filter((id) => zufallSourceMeta(id));
  }

  function renderZufallSourceChips() {
    const selected = new Set(state.zufallSources);
    const origin = new Set(state.zufallOrigin || []);
    const ids = zufallAvailableSources().filter((id) => zufallUnionCount([id]) > 0);
    ids.sort((a, b) => {
      const rank = (id) => (origin.has(id) ? 0 : (selected.has(id) ? 1 : 2));
      return rank(a) - rank(b);
    });
    const chips = ids.map((id) => {
      const meta = zufallSourceMeta(id);
      if (!meta) return "";
      const n = zufallUnionCount([id]);
      const on = selected.has(id);
      const lava = on && selected.size === 1 ? " is-lava" : "";
      const mark = on && selected.size > 1 ? " ✓" : "";
      const originAttr = origin.has(id) ? ` data-origin="1"` : "";
      return `<button type="button" class="chip${lava}" data-act="zufall-source" data-id="${escapeHtml(id)}" aria-pressed="${on ? "true" : "false"}"${originAttr}>${escapeHtml(meta.label)} (${n})${mark}</button>`;
    }).join("");
    const uber = zufallUberLabel(state.zufallSources);
    const expanded = !!state.filterMore.zufall;
    return `
      <p class="zufall-pool-label">Filme aus:</p>
      <div class="zufall-uber" data-role="zufall-uber"${uber ? "" : " hidden"}><span class="zufall-uber-chip is-lava">${escapeHtml(uber)}</span></div>
      <div class="zufall-chip-row">
        <div class="filter-chips${expanded ? " is-expanded" : ""}" data-chip-row="zufall">${chips}</div>
        <button type="button" class="chip-more${expanded ? " is-weniger" : ""}" data-act="zufall-more"${expanded ? "" : " hidden"}>${expanded ? "weniger" : "mehr"}</button>
      </div>
    `;
  }

  function paintZufallSources() {
    const box = watchSheetEl && watchSheetEl.querySelector("[data-role=zufall-sources]");
    if (!box) return;
    box.innerHTML = renderZufallSourceChips();
    paintChipOverflow();
  }

  function toggleZufallSource(id) {
    if (!id) return;
    const selected = state.zufallSources.slice();
    const idx = selected.indexOf(id);
    if (idx >= 0) selected.splice(idx, 1);
    else selected.push(id);
    state.zufallSources = selected;
    paintZufallSources();
    paintZufallFilterZone();
    if (!zufallUnionCount(selected)) {
      teardownZufallCarousel();
      const root = zufallSheetRoot();
      if (root) root.hidden = true;
      paintZufallActions();
      return;
    }
    refreshZufallAfterFilters();
  }

  function zufallMatchLineHtml(stats) {
    const s = stats || zufallMatchStats();
    const hidden = s.hiddenNoRuntime > 0 && state.zufallFilters.dauerOn
      ? `<span class="zufall-runtime-hint">${s.hiddenNoRuntime === 1 ? "1 Film ohne Dauer-Angabe ausgeblendet" : `${s.hiddenNoRuntime} Filme ohne Dauer-Angabe ausgeblendet`}</span>`
      : "";
    return `
      <p class="zufall-match-line" data-role="zufall-match-line">Trifft auf <strong>${s.count}</strong> von ${s.total} Filmen zu</p>
      ${hidden}
    `;
  }

  function zufallPushButtonHtml() {
    return `
      <button type="button" class="zufall-push-p2" data-act="zufall-push" aria-label="Zufallsfilm drehen">
        <svg class="zufall-push-p2__led" viewBox="0 0 120 120" aria-hidden="true">
          <g class="zufall-push-p2__led-segs">${Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * 360;
    const rad = (a - 90) * (Math.PI / 180);
    const x = 60 + Math.cos(rad) * 52;
    const y = 60 + Math.sin(rad) * 52;
    return `<rect class="zufall-push-p2__led-seg" x="${x - 1.2}" y="${y - 2.4}" width="2.4" height="4.8" rx="0.6" transform="rotate(${a} ${x} ${y})"/>`;
  }).join("")}</g>
        </svg>
        <span class="zufall-push-p2__bezel" aria-hidden="true"></span>
        <span class="zufall-push-p2__dome"><span class="zufall-push-p2__label">Push</span></span>
      </button>
    `;
  }

  function renderZufallFilterBar() {
    const expanded = !!state.filterMore.zufall;
    const count = zufallActiveFilterCount();
    const stats = zufallMatchStats();
    if (!zufallAnyFilterOn()) {
      return `
        <div class="zufall-filter-zone" data-role="zufall-filter-zone">
          <div class="zufall-filter-empty">
            <button type="button" class="zufall-filter-open-btn" data-act="zufall-filter-open"><span class="zufall-filter-open-icon" aria-hidden="true">${ICONS.filter}</span> Filter</button>
          </div>
        </div>
      `;
    }
    if (expanded) {
      return `
        <div class="zufall-filter-zone" data-role="zufall-filter-zone">
          <button type="button" class="zufall-filter-compact" data-act="zufall-filter-open">Filter · ${count} aktiv</button>
          ${zufallMatchLineHtml(stats)}
        </div>
      `;
    }
    const chips = zufallFilterChipRows();
    const chipHtml = chips.map((chip) => `
      <span class="active-chip zufall-filter-chip${chip.kind === "tag" ? " is-tag" : ""}">
        <span>${escapeHtml(chip.label)}</span>
        <button type="button" class="active-chip-x" data-act="zufall-filter-chip-remove" data-kind="${escapeHtml(chip.kind)}" data-id="${escapeHtml(chip.id)}" aria-label="${escapeHtml(chip.label)} entfernen">${ICONS.chipX}</button>
      </span>
    `).join("");
    return `
      <div class="zufall-filter-zone" data-role="zufall-filter-zone">
        <div class="zufall-filter-row">
          <button type="button" class="chip-clear-all" data-act="zufall-filter-clear-all" aria-label="Alle Filter löschen" title="Alle Filter löschen">×</button>
          <div class="zufall-filter-chips" data-chip-row="zufallFilters">
            ${chipHtml}
            <button type="button" class="chip zufall-filter-more-chip" data-act="zufall-filter-open" hidden data-role="zufall-filter-overflow">+0</button>
          </div>
          <button type="button" class="zufall-filter-open-btn has-badge" data-act="zufall-filter-open">
            <span aria-hidden="true">▾</span> Filter
            <span class="zufall-filter-badge">${count}</span>
          </button>
        </div>
        ${zufallMatchLineHtml(stats)}
      </div>
    `;
  }

  function renderZufallFilterSheetHtml() {
    const draft = zufallFiltersDraftBag();
    const stats = zufallMatchStats(draft);
    const scope = escapeHtml(zufallUberLabel(state.zufallSources) || "Auswahl");
    const zero = stats.count === 0;
    const loosen = zero ? zufallLoosenSuggestions(draft) : [];
    const loosenHtml = zero ? `
      <div class="card zufall-filter-zero card-warn">
        <p class="zufall-filter-zero-title">Trifft auf <strong>0</strong> von ${stats.total} Filmen zu – bitte Filter lockern</p>
        <p class="hint">Bitte Filter lockern – so lässt sich der Filter nicht übernehmen.</p>
        <div class="zufall-loosen-list">
          ${loosen.map((row) => `
            <button type="button" class="zufall-loosen-btn" data-act="${escapeHtml(row.act)}"${row.id ? ` data-id="${escapeHtml(row.id)}"` : ""}>
              <span>${escapeHtml(row.label)}</span>
              <span class="zufall-loosen-count">${row.count === 1 ? "1 Film" : `${row.count} Filme`}</span>
            </button>
          `).join("")}
        </div>
        <button type="button" class="linkish" data-act="zufall-filter-reset">Alle Filter zurücksetzen</button>
      </div>
    ` : "";
    const footerCount = zero
      ? `Trifft auf <strong class="is-warn">0</strong> von ${stats.total} Filmen zu – bitte Filter lockern`
      : `Trifft auf <strong>${stats.count}</strong> von ${stats.total} Filmen zu`;
    return `
      <div class="zufall-filter-sheet${state.zufallFilterSheet ? " is-open" : ""}" data-role="zufall-filter-sheet" aria-hidden="${state.zufallFilterSheet ? "false" : "true"}">
        <div class="zufall-filter-sheet-panel">
          <div class="zufall-filter-sheet-head">
            <button type="button" class="linkish" data-act="zufall-filter-back">‹ Zurück</button>
            <button type="button" class="linkish" data-act="zufall-filter-reset">Zurücksetzen</button>
          </div>
          <h3 class="zufall-filter-sheet-title">Filter für Zufall</h3>
          <p class="zufall-filter-sheet-sub">gilt für: ${scope}</p>
          <div class="zufall-filter-sheet-scroll">
            ${loosenHtml}
            ${renderDiscoverFilters("zufall")}
            <p class="hint zufall-filter-sheet-note">Gleiche Filter wie bei Vorschläge – aber nur auf Deine Auswahl angewendet.</p>
          </div>
          <div class="zufall-filter-sheet-foot">
            <p class="zufall-filter-sheet-count" data-role="zufall-sheet-count">${footerCount}</p>
            <button type="button" class="btn btn-primary" data-act="zufall-filter-apply"${zero ? " disabled" : ""}>Übernehmen</button>
          </div>
        </div>
      </div>
    `;
  }

  function paintZufallFilterOverflow() {
    const row = watchSheetEl && watchSheetEl.querySelector("[data-chip-row=zufallFilters]");
    const more = watchSheetEl && watchSheetEl.querySelector("[data-role=zufall-filter-overflow]");
    if (!row || !more) return;
    const chips = [...row.querySelectorAll(".zufall-filter-chip")];
    chips.forEach((chip) => { chip.hidden = false; });
    more.hidden = true;
    const overflows = () => row.scrollWidth > row.clientWidth + 1;
    if (!overflows()) return;
    for (let i = chips.length - 1; i >= 0; i -= 1) {
      chips[i].hidden = true;
      if (!overflows()) break;
    }
    const hidden = chips.filter((chip) => chip.hidden).length;
    if (hidden > 0) {
      more.hidden = false;
      more.textContent = `+${hidden}`;
    }
    if (chips.every((chip) => chip.hidden) && chips[0]) chips[0].hidden = false;
  }

  function paintZufallFilterZone() {
    const zone = watchSheetEl && watchSheetEl.querySelector("[data-role=zufall-filter-zone]");
    if (!zone) return;
    zone.outerHTML = renderZufallFilterBar();
    paintZufallFilterOverflow();
  }

  function paintZufallFilterSheet() {
    const host = watchSheetEl && watchSheetEl.querySelector("[data-role=zufall-filter-host]");
    if (!host) return;
    host.innerHTML = renderZufallFilterSheetHtml();
  }

  function openZufallFilterSheet() {
    state.zufallFiltersDraft = cloneFilterBag(state.zufallFilters);
    state.zufallFilterSheet = true;
    state.actorQuery = "";
    state.actorHits = [];
    state.actorStatus = "";
    paintZufallFilterSheet();
  }

  function closeZufallFilterSheet() {
    state.zufallFilterSheet = false;
    state.zufallFiltersDraft = null;
    paintZufallFilterSheet();
  }

  function applyZufallFiltersFromDraft() {
    state.zufallFilters = cloneFilterBag(zufallFiltersDraftBag());
    saveZufallFiltersToStorage();
    closeZufallFilterSheet();
    resetZufallIdle();
    refreshZufallAfterFilters();
  }

  function clearZufallFilters() {
    state.zufallFilters = emptyFilterBag();
    saveZufallFiltersToStorage();
    if (state.zufallFilterSheet) state.zufallFiltersDraft = cloneFilterBag(state.zufallFilters);
    resetZufallIdle();
    refreshZufallAfterFilters();
  }

  function refreshZufallAfterFilters() {
    paintZufallFilterZone();
    const pool = zufallPoolFilms();
    if (!pool.length) {
      teardownZufallCarousel();
      const root = zufallSheetRoot();
      if (root) {
        root.hidden = true;
        const empty = root.parentElement && root.parentElement.querySelector("[data-role=zufall-empty]");
        if (empty) empty.hidden = false;
      }
      paintZufallActions();
      return;
    }
    const root = zufallSheetRoot();
    if (root) root.hidden = false;
    const empty = root && root.parentElement && root.parentElement.querySelector("[data-role=zufall-empty]");
    if (empty) empty.hidden = true;
    mountZufallCarousel();
  }

  function renderZufallSheetHtml() {
    const stats = zufallMatchStats();
    const noMatches = stats.count < 1;
    return `
      <div class="sheet-panel zufall-panel has-sheet-bg" data-role="sheet-panel">
        ${sheetLeavesBgHtml("a")}
        <div class="sheet-head zufall-head" data-role="sheet-drag">
          <div class="sheet-handle" aria-hidden="true"></div>
          <h2 class="sheet-title">Zufallswahl</h2>
          <button type="button" class="sheet-close" data-act="watch-sheet-close" aria-label="Schließen">${ICONS.close}</button>
        </div>
        <div class="zufall-sources" data-role="zufall-sources">${renderZufallSourceChips()}</div>
        <div data-role="zufall-filter-zone">${renderZufallFilterBar()}</div>
        <div class="zufall-body">
          <div class="zufall-empty card" data-role="zufall-empty"${noMatches ? "" : " hidden"}>
            <p><strong>Kein Film passt</strong></p>
            <p class="hint">Filter lockern oder Grundgesamtheit erweitern.</p>
            <button type="button" class="btn btn-ghost" data-act="zufall-filter-open">Filter anpassen</button>
          </div>
          <div class="login-carousel zufall-carousel" data-role="zufall-carousel" aria-hidden="true">
            <div class="login-carousel-inner">
              <div class="login-carousel-stage">
                <div class="login-carousel-ring" data-role="login-ring"></div>
              </div>
              <div class="login-carousel-front">
                <div class="login-cover login-cover-side login-cover-left" data-role="cover-left"></div>
                <div class="login-cover login-cover-center" data-role="cover-center"></div>
                <div class="login-cover login-cover-side login-cover-right" data-role="cover-right"></div>
              </div>
            </div>
            <div class="zufall-cues" data-role="zufall-chevrons">
              <div class="zufall-cue is-left">
                <span class="zufall-chevron is-left" aria-hidden="true">‹‹‹‹</span>
              </div>
              <p class="zufall-swipen" data-role="zufall-swipen">Swipen</p>
              <div class="zufall-cue is-right">
                <span class="zufall-chevron is-right" aria-hidden="true">››››</span>
              </div>
            </div>
          </div>
          <div class="zufall-idle-actions" data-role="zufall-idle-actions">
            ${zufallPushButtonHtml()}
            <button type="button" class="zufall-skip" data-act="zufall-skip" hidden>Überspringen</button>
          </div>
          <div class="zufall-result" data-role="zufall-result" hidden>
            <div class="zufall-titles">
              <button type="button" class="zufall-title-side" data-act="zufall-swap" data-side="left"></button>
              <strong class="zufall-title-center" data-role="zufall-title-center"></strong>
              <button type="button" class="zufall-title-side" data-act="zufall-swap" data-side="right"></button>
            </div>
            <div class="zufall-stream" data-role="zufall-stream" hidden>
              <p class="zufall-stream-label">verfügbar auf:</p>
              <p class="zufall-providers" data-role="zufall-providers"></p>
            </div>
            ${anschauenButtonHtml("zufall-watch", `data-act="choose" data-id=""`)}
            <button type="button" class="zufall-again" data-act="zufall-again">Erneut drehen</button>
          </div>
        </div>
        <div class="zufall-filter-host" data-role="zufall-filter-host">${renderZufallFilterSheetHtml()}</div>
      </div>
    `;
  }

  function renderListSearchChip() {
    return `<button type="button" class="watch-add-chip watch-search-chip" data-act="watch-search-open"><span class="watch-search-glass" aria-hidden="true">${ICONS.search}</span> Suchen</button>`;
  }

  function renderWatchTab() {
    const rows = renderWatchRows();
    const empty = watchlist().length < 1;
    const chips = `
        <button type="button" class="watch-add-chip" data-act="watch-sheet-open">
          <span class="watch-add-plus">${ICONS.plus}</span>
          Hinzufügen
        </button>
        ${renderListSearchChip()}
        <button type="button" class="watch-add-chip watch-zufall-chip" data-act="zufall-open"${empty ? " disabled" : ""} title="${empty ? "Mind. 1 Film" : "Zufallswahl"}" aria-disabled="${empty ? "true" : "false"}">
          <span class="watch-zufall-stack" data-role="zufall-chip-icon">${zufallChipTiles()}</span>
          Zufall
        </button>
    `;
    return `
      <div class="list-toolbar">
        ${renderListChipRow("listWatch", chips)}
        <span class="watch-zufall-hint" data-role="zufall-empty-hint"${empty ? "" : " hidden"}>Mind. 1 Film</span>
      </div>
      <section class="film-list" data-role="film-list">${rows || `<p class="hint">Noch nichts auf der Watchlist.</p>`}</section>
    `;
  }

  function renderQueueRows() {
    return queueFilms().map((film) => renderListRow(film, { swipeMode: "queue" })).join("");
  }

  function renderQueueTab() {
    const rows = renderQueueRows();
    const empty = queue().length < 1;
    const chips = `
        <button type="button" class="watch-add-chip" data-act="watch-sheet-open">
          <span class="watch-add-plus">${ICONS.plus}</span>
          Hinzufügen
        </button>
        ${renderListSearchChip()}
        <button type="button" class="watch-add-chip watch-zufall-chip" data-act="zufall-open"${empty ? " disabled" : ""} title="${empty ? "Mind. 1 Film" : "Zufallswahl"}" aria-disabled="${empty ? "true" : "false"}">
          <span class="watch-zufall-stack" data-role="zufall-chip-icon">${zufallChipTiles()}</span>
          Zufall
        </button>
    `;
    return `
      <div class="list-toolbar">
        ${renderListChipRow("listQueue", chips)}
        <span class="watch-zufall-hint" data-role="zufall-empty-hint"${empty ? "" : " hidden"}>Mind. 1 Film</span>
      </div>
      <section class="film-list" data-role="film-list">${rows || `<p class="hint">Noch nichts unter Demnächst.</p>`}</section>
    `;
  }

  function renderRatedTab() {
    const chips = RATE_KEYS.map((r) => `
      <button type="button" class="watch-add-chip rated-filter-chip" data-act="rated-filter" data-id="${r.id}" aria-pressed="${state.ratedFilter === r.id}">${r.label}</button>
    `).join("");
    const films = ratedSourceFilms();
    const rows = films.map((film) => renderListRow(film, { rates: true })).join("");
    const toolbarChips = `${renderListSearchChip()}${chips}`;
    return `
      <div class="list-toolbar">
        ${renderListChipRow("listRated", toolbarChips)}
      </div>
      <section class="film-list" data-role="film-list">${rows || `<p class="hint">Keine Filme mit dieser Bewertung.</p>`}</section>
    `;
  }

  function renderTagsTab() {
    const tags = customTags("film");
    const chips = tags.map((t) => tagChipHtml(t, {
      size: "mini",
      act: "tag-filter",
      attrs: `data-id="${escapeHtml(t.id)}"`,
      pressed: state.tagFilter.includes(t.id),
      count: countFilmsWithTag(t.id),
    })).join("");
    const selected = state.tagFilter;
    const map = filmTags();
    const films = selected.length
      ? state.catalog.filter((f) => {
        const have = map[filmId(f)] || [];
        return selected.every((tagId) => have.includes(tagId));
      })
      : [];
    const rows = films.map((film) => renderListRow(film, {})).join("");
    let listBody = "";
    if (!selected.length) {
      listBody = `<p class="tags-filter-empty">Bitte mindestens einen Tag auswählen</p>`;
    } else if (!rows) {
      listBody = `<p class="tags-filter-empty">Für diese Tagkombination ist kein Film vorhanden</p>`;
    } else {
      listBody = rows;
    }
    const actionChips = `
          ${renderListSearchChip()}
          <button type="button" class="watch-add-chip tags-manage-btn" data-act="tags">Tags verwalten</button>
    `;
    return `
      <div class="list-toolbar is-tags">
        ${renderListChipRow("listTagsActions", actionChips)}
        ${renderListChipRow("listTags", chips || `<span class="hint filter-empty">Noch keine eigenen Tags</span>`)}
        ${renderTagsScopeHint("film")}
      </div>
      <section class="film-list" data-role="film-list">${listBody}</section>
    `;
  }

  function formatSeenOn(at) {
    const d = new Date(Number(at));
    if (!Number.isFinite(d.getTime()) || d.getTime() <= 0) return "";
    return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  const SEEN_UNDO_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 7H5v4"/><path d="M5 11a7 7 0 1 0 1.6-4.4"/></svg>`;

  const SEEN_FRAC_PRESETS = [
    { f: 1, label: "100 %" },
    { f: 0.75, label: "75 %" },
    { f: 0.5, label: "50 %" },
    { f: 0.25, label: "25 %" },
  ];

  function viewPercentLabel(f) {
    return `${Math.round(Number(f) * 100)} %`;
  }

  function viewPieIconHtml(f, extraClass) {
    const frac = Number(f);
    const cls = `seen-pie-icon${extraClass ? ` ${extraClass}` : ""}`;
    if (!Number.isFinite(frac) || frac >= 0.9999) {
      return `<span class="${cls} is-full" aria-hidden="true">●</span>`;
    }
    const pct = Math.max(0, Math.min(1, frac));
    const deg = pct * 360;
    const r = 6;
    const cx = 8;
    const cy = 8;
    if (deg <= 0.01) {
      return `<svg class="${cls}" viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><circle cx="${cx}" cy="${cy}" r="${r}" fill="#e8eef4" stroke="#b8c5d4" stroke-width="1"/></svg>`;
    }
    if (deg >= 359.9) {
      return `<span class="${cls} is-full" aria-hidden="true">●</span>`;
    }
    const rad = ((deg - 90) * Math.PI) / 180;
    const x = cx + r * Math.cos(rad);
    const y = cy + r * Math.sin(rad);
    const large = deg > 180 ? 1 : 0;
    const d = `M ${cx} ${cy} L ${cx} ${cy - r} A ${r} ${r} 0 ${large} 1 ${x} ${y} Z`;
    return `<svg class="${cls}" viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><circle cx="${cx}" cy="${cy}" r="${r}" fill="#e8eef4" stroke="#b8c5d4" stroke-width="1"/><path d="${d}" fill="#0066b3"/></svg>`;
  }

  function seenFracPresetIconHtml(frac) {
    if (frac >= 0.9999) return "";
    return viewPieIconHtml(frac, "seen-frac-chip-pie");
  }

  function isPresetSheetFraction(f) {
    const pct = Math.round(Number(f) * 100);
    return [100, 75, 50, 25].includes(pct);
  }

  function initSeenSheetFracFromView(view) {
    const f = view && Number.isFinite(view.f) ? view.f : 1;
    const pct = Math.round(f * 100);
    if (isPresetSheetFraction(f)) {
      return { kind: "preset", f, customPct: "", lastPreset: f };
    }
    return { kind: "custom", f, customPct: String(pct), lastPreset: 1 };
  }

  function readSeenSheetFraction() {
    const st = state.seenSheetFrac;
    if (!st) return 1;
    if (st.kind === "custom") {
      const n = Number(st.customPct);
      if (Number.isFinite(n) && n >= 1 && n <= 99) return n / 100;
      return NaN;
    }
    const f = Number(st.f);
    return Number.isFinite(f) && f > 0 && f <= 1 ? f : 1;
  }

  function seenFracHintText(runtimeMin, frac, customActive) {
    const parts = [];
    const m = Number(runtimeMin) || 0;
    const f = Number(frac);
    if (m > 0 && Number.isFinite(f) && f > 0 && f < 0.9999) {
      parts.push(`≈ ${Math.round(m * f)} von ${m} Min.`);
    } else if (m > 0) {
      parts.push(`${m} Min.`);
    }
    parts.push(customActive ? "Eigener Wert 1–99 %" : "Eigenen Wert antippen (1–99 %)");
    return parts.join(" · ");
  }

  function renderSeenFracChipsHtml() {
    const st = state.seenSheetFrac || initSeenSheetFracFromView({ f: 1 });
    const presetBtns = SEEN_FRAC_PRESETS.map((p) => {
      const selected = st.kind === "preset" && Math.abs(st.f - p.f) < 0.001;
      const icon = seenFracPresetIconHtml(p.f);
      return `<button type="button" class="seen-frac-chip${selected ? " is-selected" : ""}" data-act="seen-frac-pick" data-frac="${p.f}">${icon}${escapeHtml(p.label)}</button>`;
    }).join("");
    const customSelected = st.kind === "custom";
    const customVal = st.customPct || "";
    const customBtn = `
      <div class="seen-frac-chip seen-frac-custom${customSelected ? " is-selected" : ""}" data-act="seen-frac-custom-focus" role="button" tabindex="0">
        <input class="seen-frac-custom-input" data-act="seen-frac-custom" inputmode="numeric" pattern="[0-9]*" maxlength="2" placeholder="✎ Eigene %" value="${escapeHtml(customVal)}" aria-label="Eigener Prozentwert (1–99)">
        ${customVal ? `<span class="seen-frac-suffix" aria-hidden="true">%</span>` : ""}
      </div>`;
    return `<div class="seen-frac-chips" role="group" aria-label="Wie viel gesehen">${presetBtns}${customBtn}</div>`;
  }

  function renderSeenViewsStack(id, hid, row, scope) {
    const viewsDetailed = historyViewsDetailed(row);
    const multi = viewsDetailed.length >= 2;
    const expanded = !!state.seenViewsExpanded[hid];
    const latest = viewsDetailed[0];
    const latestF = latest ? latest.f : 1;
    const seenDate = formatSeenOn(row.at);
    const scopeAttr = scope === "video" ? "video" : "film";
    const piePill = latestF < 0.9999 ? viewPieIconHtml(latestF) : "";
    const datePill = `<button type="button" class="seen-date-pill" data-act="seen-date-open" data-scope="${scopeAttr}" data-id="${id}">Gesehen: ${escapeHtml(seenDate)}${piePill ? ` ${piePill}` : ""} <span class="seen-date-edit" aria-hidden="true">✎</span></button>`;
    const viewsBadge = multi
      ? `<button type="button" class="seen-views-badge" data-act="seen-views-toggle" data-id="${id}" aria-expanded="${expanded ? "true" : "false"}">${viewsDetailed.length}× gesehen <span aria-hidden="true">${expanded ? "▴" : "▾"}</span></button>`
      : "";
    const viewsList = multi && expanded
      ? `<ul class="seen-views-list">${viewsDetailed.map((v, i) => {
        const label = formatSeenOn(v.at);
        const latestRow = i === 0;
        const editBtn = latestRow
          ? ` <button type="button" class="seen-views-edit" data-act="seen-date-open" data-scope="${scopeAttr}" data-id="${id}" aria-label="Sichtung bearbeiten">✎</button>`
          : "";
        const zuletzt = latestRow ? ` <span class="seen-views-zuletzt">(zuletzt)</span>` : "";
        const frac = ` · ${viewPieIconHtml(v.f)} ${viewPercentLabel(v.f)}`;
        return `<li class="seen-views-item${latestRow ? " is-latest" : ""}">${escapeHtml(label)}${frac}${zuletzt}${editBtn}</li>`;
      }).join("")}</ul>`
      : "";
    return { datePill, viewsBadge, viewsList };
  }

  function syncSeenFracUI() {
    const sheet = modalEl.querySelector(".seen-date-sheet");
    if (!sheet) return;
    const st = state.seenSheetFrac || initSeenSheetFracFromView({ f: 1 });
    const runtime = Number(sheet.dataset.runtimeMin) || 0;
    const hint = sheet.querySelector(".seen-frac-hint");
    if (hint) {
      const frac = readSeenSheetFraction();
      const customActive = st.kind === "custom";
      hint.textContent = seenFracHintText(runtime, Number.isFinite(frac) ? frac : st.f, customActive);
    }
    sheet.querySelectorAll("[data-act=seen-frac-pick]").forEach((btn) => {
      const f = Number(btn.dataset.frac);
      const on = st.kind === "preset" && Math.abs(st.f - f) < 0.001;
      btn.classList.toggle("is-selected", on);
    });
    const customWrap = sheet.querySelector(".seen-frac-custom");
    if (customWrap) customWrap.classList.toggle("is-selected", st.kind === "custom");
    const input = sheet.querySelector("[data-act=seen-frac-custom]");
    if (input && document.activeElement !== input) input.value = st.customPct || "";
    if (customWrap && input) {
      let suffix = customWrap.querySelector(".seen-frac-suffix");
      if (st.customPct) {
        if (!suffix) {
          suffix = document.createElement("span");
          suffix.className = "seen-frac-suffix";
          suffix.setAttribute("aria-hidden", "true");
          suffix.textContent = "%";
          customWrap.appendChild(suffix);
        }
      } else if (suffix) suffix.remove();
    }
    syncSeenDateSaveDisabled();
  }

  function renderSeenCard(film, opts) {
    film = filmWithPoster(film) || film;
    const id = escapeHtml(filmId(film));
    const hid = filmId(film);
    const row = opts.historyRow;
    const bubble = state.seenRateFor === hid;
    const undoBtn = `<button type="button" class="seen-undo-open" data-act="seen-undo-view" data-id="${id}">${SEEN_UNDO_ICON}Rückgängig</button>`;
    const rateValue = opts.rateLabel
      ? `<span class="seen-rate-value">${escapeHtml(opts.rateLabel)}</span> ${undoBtn}`
      : `<button type="button" class="seen-rate-open" data-act="seen-rate-open" data-id="${id}" aria-expanded="${bubble ? "true" : "false"}">Bewerten</button> ${undoBtn}`;
    const bubbleHtml = bubble
      ? `<div class="seen-rate-bubble" data-role="seen-rate-bubble" role="group" aria-label="Bewertung">${renderRates(film, true)}</div>`
      : "";
    const stack = renderSeenViewsStack(id, hid, row, "film");
    const { datePill, viewsBadge, viewsList } = stack;
    return `
      <article class="film-row seen-card${opts.unrated ? " is-unrated" : ""}" data-seen="1" data-id="${id}">
        <div class="film-row-head">
          ${posterTile(film, { lazy: true, size: POSTER_SIZE_THUMB })}
          <div class="film-row-body">
            <h3 class="film-row-title">${escapeHtml(film.title)}</h3>
            <div class="seen-stack">
              ${datePill}
              ${viewsBadge}
              ${viewsList}
              <p class="seen-meta seen-rate-line">Bewertung: ${rateValue}</p>
              ${bubbleHtml}
            </div>
          </div>
        </div>
      </article>
    `;
  }

  function openSeenDateSheet(id, scope) {
    const isVideo = scope === "video";
    const hid = isVideo ? String(id) : filmId(id);
    const row = isVideo
      ? videoHistory().find((r) => String(r.id) === hid)
      : history().find((r) => String(r.id) === hid);
    const titleEntity = isVideo
      ? (findVideo(hid) || row)
      : (findFilm(hid) || (row ? { id: hid, title: row.title } : null));
    if (!row || !titleEntity) return;
    state.seenDateEditId = hid;
    state.seenDateEditScope = isVideo ? "video" : "film";
    const latest = historyViewsDetailed(row)[0] || { at: row.at, f: 1 };
    state.seenSheetFrac = initSeenSheetFracFromView(latest);
    const current = latest.at || row.at;
    const runtimeMin = isVideo
      ? (Number(titleEntity.minutes) || 0)
      : filmMinutesOf(titleEntity);
    const maxDay = todayDateInputMax();
    const fracHint = seenFracHintText(runtimeMin, latest.f, state.seenSheetFrac.kind === "custom");
    openModal(`
      <div class="card modal-card seen-date-sheet" data-runtime-min="${runtimeMin}">
        <h2>Wann gesehen?</h2>
        <p class="hint">${escapeHtml(titleEntity.title || "")}</p>
        <div class="seen-date-chips">
          <button type="button" class="chip" data-act="seen-date-pick" data-offset="0">Heute</button>
          <button type="button" class="chip" data-act="seen-date-pick" data-offset="1">Gestern</button>
          <button type="button" class="chip" data-act="seen-date-pick" data-offset="2">Vorgestern</button>
        </div>
        <input class="seen-date-field" type="date" max="${maxDay}" data-act="seen-date-input" value="${escapeHtml(dateInputValueFromTs(current))}" aria-label="Datum">
        <p class="seen-frac-label">Wie viel?</p>
        ${renderSeenFracChipsHtml()}
        <p class="hint seen-frac-hint">${escapeHtml(fracHint)}</p>
        <div class="modal-actions">
          <button type="button" class="btn btn-ghost" data-act="seen-date-cancel">Abbrechen</button>
          <button type="button" class="btn btn-primary btn-confirm" data-act="seen-date-save" data-id="${escapeHtml(hid)}" data-scope="${isVideo ? "video" : "film"}">Speichern</button>
        </div>
      </div>
    `, { bottom: true });
    syncSeenDateSaveDisabled();
  }

  function syncSeenDateSaveDisabled() {
    const input = modalEl.querySelector("[data-act=seen-date-input]");
    const save = modalEl.querySelector("[data-act=seen-date-save]");
    if (!input || !save) return;
    const max = todayDateInputMax();
    const dateOk = input.value && input.value <= max;
    const frac = readSeenSheetFraction();
    const fracOk = Number.isFinite(frac) && frac > 0 && frac <= 1;
    save.disabled = !dateOk || !fracOk;
  }

  function commitSeenDateSave(id, scope) {
    const isVideo = scope === "video" || state.seenDateEditScope === "video";
    const hid = isVideo ? String(id) : filmId(id);
    const input = modalEl.querySelector("[data-act=seen-date-input]");
    if (!input || !input.value) return;
    const max = todayDateInputMax();
    if (input.value > max) return;
    const row = isVideo
      ? videoHistory().find((r) => String(r.id) === hid)
      : history().find((r) => String(r.id) === hid);
    if (!row) return;
    const prevAt = historyViews(row)[0] || row.at;
    const before = isVideo ? videoHistory() : history();
    const saveList = isVideo ? saveVideoHistory : saveHistory;
    const newAt = tsFromDateInput(input.value, prevAt);
    const newF = readSeenSheetFraction();
    if (!Number.isFinite(newAt) || newAt > Date.now() || !Number.isFinite(newF)) return;
    if (!updateLatestViewEntry(hid, newAt, newF, isVideo ? "video" : "film")) return;
    closeModal();
    if (!isVideo && state.justWatchedId === hid && newAt < Date.now() - 60000) {
      state.justWatchedId = null;
      state.pinJustWatched = false;
    }
    render();
    const pct = Math.round(newF * 100);
    showSnack(`Gespeichert: ${pct} %`, "success", {
      undo: () => {
        saveList(before);
        render();
      },
    });
  }

  function renderSeenTab() {
    const all = ratings();
    let rows = history().slice().sort((a, b) => b.at - a.at);
    if (state.seenOnlyUnrated) rows = rows.filter((row) => !all[String(row.id)]);
    const cards = rows.map((row) => {
      const film = listFilmOrPlaceholder(row.id);
      const unrated = !all[String(row.id)];
      const rateLabel = unrated ? "" : (RATE_KEYS.find((r) => r.id === all[String(row.id)])?.label || "");
      return renderSeenCard(film, {
        unrated,
        historyRow: row,
        rateLabel,
      });
    }).join("");
    const chips = `
          <button type="button" class="watch-add-chip rated-filter-chip" data-act="seen-unrated" aria-pressed="${state.seenOnlyUnrated}">Unbewertete</button>
          <button type="button" class="watch-add-chip rated-filter-chip" data-act="seen-all" aria-pressed="${!state.seenOnlyUnrated}">Alle</button>
    `;
    const toolbarChips = `${renderListSearchChip()}${chips}`;
    return `
      <div class="list-toolbar">
        ${renderListChipRow("listSeen", toolbarChips)}
      </div>
      <section class="film-list" data-role="film-list">${cards || `<p class="hint">Noch keine gesehenen Filme.</p>`}</section>
    `;
  }

  function renderVideoInlinePlayer(video, embed, detected) {
    const id = escapeHtml(String(video.id));
    const hid = String(video.id);
    const platLabel = embed.label || detected.label || "Web";
    const blocked = videoEmbedBlocked.has(hid);
    if (blocked) {
      return `
        <div class="video-inline-wrap is-blocked" data-role="video-inline" data-id="${id}">
          <div class="video-inline-stage">
            <div class="video-embed-blocked">
              <p class="video-embed-blocked-title">Dieses Video kann nur auf ${escapeHtml(platLabel)} abgespielt werden</p>
              <p class="hint video-embed-blocked-copy">Der Kanal hat das Abspielen in anderen Apps deaktiviert.</p>
              <button class="btn video-embed-blocked-open" type="button" data-act="video-open-direct" data-id="${id}">${externalLinkSvg()} In ${escapeHtml(platLabel)} öffnen ↗</button>
            </div>
          </div>
          <div class="video-inline-bar">
            <span class="video-inline-ext" aria-hidden="true"></span>
            <button type="button" class="video-inline-close" data-act="video-inline-close" data-id="${id}">✕ Player schließen</button>
          </div>
        </div>
      `;
    }
    return `
      <div class="video-inline-wrap" data-role="video-inline" data-id="${id}">
        <div class="video-inline-stage">
          <div class="video-inline-mount" data-role="video-inline-mount" data-id="${id}"></div>
        </div>
        <div class="video-inline-bar">
          <button type="button" class="video-inline-ext" data-act="video-open-direct" data-id="${id}">In ${escapeHtml(platLabel)} öffnen ↗</button>
          <button type="button" class="video-inline-close" data-act="video-inline-close" data-id="${id}">✕ Player schließen</button>
        </div>
      </div>
    `;
  }

  function renderVideoExpandActions(video, embed, detected) {
    const id = escapeHtml(String(video.id));
    const hid = String(video.id);
    const playerOpen = state.inlineVideoPlayerId === hid;
    const embeddable = embed.kind !== "none";
    const playerHtml = playerOpen ? renderVideoInlinePlayer(video, embed, detected) : "";
    const split = embeddable && !playerOpen;
    const hierBtn = split
      ? `<button class="btn btn-ghost video-hier-btn" type="button" data-act="video-inline-open" data-id="${id}"><span aria-hidden="true">▶</span> hier anschauen</button>`
      : "";
    return `
      ${playerHtml}
      <div class="video-expand-actions${split ? " is-split" : " is-single"}">
        <button class="btn btn-primary" type="button" data-act="video-confirm" data-id="${id}">
          <span class="btn-play" aria-hidden="true">${enamelPlayIcon()}</span>Anschauen
        </button>
        ${hierBtn}
      </div>
      <div class="video-expand-secondary">
        <button class="btn btn-ghost video-edit-btn" type="button" data-act="video-edit-open" data-id="${id}">✎ Bearbeiten</button>
      </div>
    `;
  }

  // Videos rendering
  function renderVideoRow(video, opts) {
    if (!video) return "";
    const id = escapeHtml(String(video.id));
    const hid = String(video.id);
    const open = state.expandedVideoId === hid;
    const isSeen = !!opts.gesehen;
    const dateStr = isSeen && video.at ? formatSeenOn(video.at) : "";
    const detected = detectPlatform(video.url);
    const embed = embedInfo(video.url);
    const platId = video.plat || detected.id;
    const badgeLabel = platId === "generic" ? (video.customPlat || detected.label) : "";
    const badgeHtml = platformBadgeHtml(platId, badgeLabel);

    const head = `
      <div class="film-row-head v-card-head" data-act="video-expand" data-id="${id}" aria-expanded="${open}">
        <div class="v-default-thumb kv">
          ${videoCoverSvg()}
        </div>
        <div class="v-meta">
          <p class="v-title">${escapeHtml(video.title)}</p>
          ${video.desc ? `<p class="v-desc">${escapeHtml(video.desc)}</p>` : ""}
          <div class="v-foot">
            ${badgeHtml}
            ${dateStr ? `<span class="v-date">${escapeHtml(dateStr)}</span>` : ""}
            <button class="btn btn-primary v-anschauen" type="button" data-act="video-confirm" data-id="${id}" aria-label="Anschauen">
              <span class="btn-play" aria-hidden="true">${enamelPlayIcon()}</span>Anschauen
            </button>
          </div>
        </div>
        <button class="film-row-chevron" type="button" data-act="video-expand" data-id="${id}" aria-expanded="${open}" aria-label="${open ? "Zuklappen" : "Aufklappen"}">
          ${open ? ICONS.chevronUp : ICONS.chevron}
        </button>
      </div>
    `;

    const tags = renderVideoTagChips(video);
    const expand = open ? `
      <div class="film-row-expand">
        ${renderVideoExpandActions(video, embed, detected)}
        <p class="film-expand-in-label">Tags (Video)</p>
        <div class="film-expand-tags">${tags}</div>
        <p class="film-expand-in-label">Bewertung</p>
        <div class="film-expand-rates">${renderVideoRates(video)}</div>
        <div class="film-expand-collapse">
          <button type="button" class="film-row-fold" data-act="video-expand" data-id="${id}" aria-label="Zuklappen">${ICONS.chevronUp} Zuklappen</button>
        </div>
      </div>
    ` : "";

    const article = `
      <article class="film-row video-card${opts.swipeMode ? " swipe-front" : ""}${open ? " is-open" : ""}" data-id="${id}">
        ${head}
        ${expand}
      </article>
    `;

    if (!opts.swipeMode) return article;
    return wrapSwipeTrack(article, hid, opts.swipeMode);
  }

  function filterVideosBySearch(videos) {
    const q = foldSearch(state.videoSearch);
    if (!q) return videos;
    return videos.filter((v) => {
      const t = foldSearch(v.title);
      const d = foldSearch(v.desc);
      const u = foldSearch(v.url);
      const p = foldSearch(v.plat);
      return t.includes(q) || d.includes(q) || u.includes(q) || p.includes(q);
    });
  }

  function renderVideoSearchBar() {
    if (!state.videoSearchOpen) return "";
    return `
      <div class="video-search-bar">
        <span class="video-search-glass" aria-hidden="true">${ICONS.search}</span>
        <input type="text" data-act="video-search-input" placeholder="Videos filtern…" value="${escapeHtml(state.videoSearch)}" autocomplete="off" autofocus>
        ${state.videoSearch ? `<button class="video-search-clear" type="button" data-act="video-search-clear" aria-label="Filter leeren">×</button>` : ""}
      </div>
    `;
  }

  function renderVideoWatchTab() {
    let videos = videoWatchlist();
    if (state.videoSearchOpen && state.videoSearch) {
      videos = filterVideosBySearch(videos);
    }
    const empty = videoWatchlist().length < 1;
    const rows = videos.map((v) => renderVideoRow(v, { swipeMode: "watch" })).join("");

    const chips = `
      <button type="button" class="watch-add-chip" data-act="video-add-open">
        <span class="watch-add-plus">${ICONS.plus}</span>
        Video hinzufügen
      </button>
      <button type="button" class="watch-add-chip watch-search-chip" data-act="video-search-toggle" aria-pressed="${state.videoSearchOpen ? "true" : "false"}">
        <span class="watch-search-glass" aria-hidden="true">${ICONS.search}</span>
        Suchen
      </button>
      <button type="button" class="watch-add-chip watch-zufall-chip" data-act="video-zufall"${empty ? " disabled" : ""} title="${empty ? "Mind. 1 Video" : "Zufallswahl"}" aria-disabled="${empty ? "true" : "false"}">
        <span class="watch-zufall-stack" data-role="zufall-chip-icon">${zufallChipTiles()}</span>
        Zufall
      </button>
    `;

    return `
      <div class="list-toolbar">
        ${renderListChipRow("videoWatch", chips)}
        ${renderVideoSearchBar()}
      </div>
      <section class="film-list video-mode" data-role="film-list">${rows || `<p class="hint">Noch keine Videos auf der Watchlist.</p>`}</section>
    `;
  }

  function renderVideoQueueTab() {
    let videos = videoQueue();
    if (state.videoSearchOpen && state.videoSearch) {
      videos = filterVideosBySearch(videos);
    }
    const empty = videoQueue().length < 1;
    const rows = videos.map((v) => renderVideoRow(v, { swipeMode: "queue" })).join("");

    const chips = `
      <button type="button" class="watch-add-chip" data-act="video-add-open">
        <span class="watch-add-plus">${ICONS.plus}</span>
        Video hinzufügen
      </button>
      <button type="button" class="watch-add-chip watch-search-chip" data-act="video-search-toggle" aria-pressed="${state.videoSearchOpen ? "true" : "false"}">
        <span class="watch-search-glass" aria-hidden="true">${ICONS.search}</span>
        Suchen
      </button>
      <button type="button" class="watch-add-chip watch-zufall-chip" data-act="video-zufall"${empty ? " disabled" : ""} title="${empty ? "Mind. 1 Video" : "Zufallswahl"}" aria-disabled="${empty ? "true" : "false"}">
        <span class="watch-zufall-stack" data-role="zufall-chip-icon">${zufallChipTiles()}</span>
        Zufall
      </button>
    `;

    return `
      <div class="list-toolbar">
        ${renderListChipRow("videoQueue", chips)}
        ${renderVideoSearchBar()}
      </div>
      <section class="film-list video-mode" data-role="film-list">${rows || `<p class="hint">Noch keine Videos unter Demnächst.</p>`}</section>
    `;
  }

  function renderVideoSeenCard(video, opts) {
    const id = escapeHtml(String(video.id));
    const hid = String(video.id);
    const bubble = state.seenVideoRateFor === hid;
    const all = ratings();
    const unrated = !all[hid];
    const rateLabel = unrated ? "" : (RATE_KEYS.find((r) => r.id === all[hid])?.label || "");
    const undoBtn = `<button type="button" class="seen-undo-open" data-act="video-seen-undo" data-id="${id}">${SEEN_UNDO_ICON}Rückgängig</button>`;
    const rateValue = rateLabel
      ? `<span class="seen-rate-value">${escapeHtml(rateLabel)}</span> ${undoBtn}`
      : `<button type="button" class="seen-rate-open" data-act="video-seen-rate-open" data-id="${id}" aria-expanded="${bubble ? "true" : "false"}">Bewerten</button> ${undoBtn}`;
    const bubbleHtml = bubble
      ? `<div class="seen-rate-bubble" data-role="seen-rate-bubble" role="group" aria-label="Bewertung">${renderVideoRates(video)}</div>`
      : "";
    const detected = detectPlatform(video.url);
    const platId = video.plat || detected.id;
    const badgeLabel = platId === "generic" ? (video.customPlat || detected.label) : "";
    const badgeHtml = platformBadgeHtml(platId, badgeLabel);
    const stack = renderSeenViewsStack(id, hid, video, "video");
    const { datePill, viewsBadge, viewsList } = stack;
    return `
      <article class="film-row video-card seen-card video-seen-card${unrated ? " is-unrated" : ""}" data-seen="1" data-id="${id}">
        <div class="film-row-head v-card-head">
          <div class="v-default-thumb kv">${videoCoverSvg()}</div>
          <div class="v-meta">
            <p class="v-title">${escapeHtml(video.title)}</p>
            ${video.desc ? `<p class="v-desc">${escapeHtml(video.desc)}</p>` : ""}
            <div class="seen-stack">
              ${datePill}
              ${viewsBadge}
              ${viewsList}
              <div class="v-foot">${badgeHtml}</div>
              <p class="seen-meta seen-rate-line">Bewertung: ${rateValue}</p>
              ${bubbleHtml}
            </div>
          </div>
          <button class="btn btn-primary v-anschauen" type="button" data-act="video-confirm" data-id="${id}" aria-label="Anschauen">
            <span class="btn-play" aria-hidden="true">${enamelPlayIcon()}</span>Anschauen
          </button>
        </div>
      </article>
    `;
  }

  function renderVideoRatedTab() {
    const all = ratings();
    const chips = RATE_KEYS.map((r) => `
      <button type="button" class="watch-add-chip rated-filter-chip" data-act="rated-filter" data-id="${r.id}" aria-pressed="${state.ratedFilter === r.id}">${r.label}</button>
    `).join("");
    const want = state.ratedFilter || "sehr-gut";
    let videos = allKnownVideos().filter((v) => all[String(v.id)] === want);
    if (state.videoSearchOpen && state.videoSearch) videos = filterVideosBySearch(videos);
    const rows = videos.map((v) => renderVideoRow(v, {})).join("");
    const toolbarChips = `
      <button type="button" class="watch-add-chip watch-search-chip" data-act="video-search-toggle" aria-pressed="${state.videoSearchOpen ? "true" : "false"}">
        <span class="watch-search-glass" aria-hidden="true">${ICONS.search}</span>
        Suchen
      </button>
      ${chips}
    `;
    return `
      <div class="list-toolbar">
        ${renderListChipRow("videoRated", toolbarChips)}
        ${renderVideoSearchBar()}
      </div>
      <section class="film-list video-mode" data-role="film-list">${rows || `<p class="hint">Keine Videos mit dieser Bewertung.</p>`}</section>
    `;
  }

  function renderVideoTagsTab() {
    const tags = customTags("video");
    const chips = tags.map((t) => tagChipHtml(t, {
      size: "mini",
      act: "tag-filter",
      attrs: `data-id="${escapeHtml(t.id)}"`,
      pressed: state.tagFilter.includes(t.id),
      count: countVideosWithTag(t.id),
    })).join("");
    const selected = state.tagFilter;
    const map = filmTags();
    let videos = selected.length
      ? allKnownVideos().filter((v) => {
        const have = map[String(v.id)] || [];
        return selected.every((tagId) => have.includes(tagId));
      })
      : [];
    if (state.videoSearchOpen && state.videoSearch && videos.length) {
      videos = filterVideosBySearch(videos);
    }
    const rows = videos.map((v) => renderVideoRow(v, {})).join("");
    let listBody = "";
    if (!selected.length) {
      listBody = `<p class="tags-filter-empty">Bitte mindestens einen Tag auswählen</p>`;
    } else if (!rows) {
      listBody = `<p class="tags-filter-empty">Für diese Tagkombination ist kein Video vorhanden</p>`;
    } else {
      listBody = rows;
    }
    const actionChips = `
      <button type="button" class="watch-add-chip watch-search-chip" data-act="video-search-toggle" aria-pressed="${state.videoSearchOpen ? "true" : "false"}">
        <span class="watch-search-glass" aria-hidden="true">${ICONS.search}</span>
        Suchen
      </button>
      <button type="button" class="watch-add-chip tags-manage-btn" data-act="tags">Video-Tags verwalten</button>
    `;
    return `
      <div class="list-toolbar is-tags">
        ${renderListChipRow("videoTagsActions", actionChips)}
        ${renderListChipRow("videoTags", chips || `<span class="hint filter-empty">Noch keine eigenen Tags</span>`)}
        ${renderTagsScopeHint("video")}
        ${renderVideoSearchBar()}
      </div>
      <section class="film-list video-mode" data-role="film-list">${listBody}</section>
    `;
  }

  function renderVideoSeenTab() {
    let videos = videoHistory().slice().sort((a, b) => (b.at || 0) - (a.at || 0));
    const all = ratings();
    if (state.seenOnlyUnrated) videos = videos.filter((v) => !all[String(v.id)]);
    if (state.videoSearchOpen && state.videoSearch) {
      videos = filterVideosBySearch(videos);
    }
    const rows = videos.map((v) => renderVideoSeenCard(v, {})).join("");

    const chips = `
      <button type="button" class="watch-add-chip watch-search-chip" data-act="video-search-toggle" aria-pressed="${state.videoSearchOpen ? "true" : "false"}">
        <span class="watch-search-glass" aria-hidden="true">${ICONS.search}</span>
        Suchen
      </button>
      <button type="button" class="watch-add-chip rated-filter-chip" data-act="video-seen-unrated" aria-pressed="${state.seenOnlyUnrated}">Unbewertete</button>
      <button type="button" class="watch-add-chip rated-filter-chip" data-act="video-seen-all" aria-pressed="${!state.seenOnlyUnrated}">Alle</button>
    `;

    return `
      <div class="list-toolbar">
        ${renderListChipRow("videoSeen", chips)}
        ${renderVideoSearchBar()}
      </div>
      <section class="film-list video-mode" data-role="film-list">${rows || `<p class="hint">Noch keine angesehenen Videos.</p>`}</section>
    `;
  }

  function openVideoConfirmDialog(videoId) {
    const video = findVideo(videoId);
    if (!video) return;
    const html = `
      <div class="scrim" style="position:fixed;inset:0;z-index:999;background:rgba(12,24,40,.42);display:flex;align-items:center;justify-content:center;padding:22px;">
        <div class="confirm" role="dialog" aria-modal="true">
          <h2 class="confirm-title">Soll „${escapeHtml(video.title)}“ aufgerufen werden?</h2>
          <p class="confirm-copy">Das Video wird außerhalb von Cinex geöffnet.</p>
          <div class="confirm-actions">
            <button class="confirm-cancel" type="button" data-act="video-confirm-cancel">Abbrechen</button>
            <button class="confirm-open" type="button" data-act="video-confirm-open" data-id="${escapeHtml(String(video.id))}">
              <span class="btn-play" aria-hidden="true">${enamelPlayIcon()}</span>
              <span>Öffnen</span>
            </button>
          </div>
        </div>
      </div>
    `;
    openModal(html);
  }

  function snackVideoWatched(video, options) {
    if (!video || !video.id) return;
    const hid = String(video.id);
    const beforeHistory = videoHistory();
    recordVideoWatched(video);
    const inline = !!(options && options.inline);
    const message = inline
      ? "Unter Angesehen vermerkt"
      : "Video geöffnet · bleibt in der Watchlist, unter Angesehen vermerkt";
    showSnack(message, undefined, {
      undo: () => {
        saveVideoHistory(beforeHistory);
        render();
      },
    });
  }

  function launchVideo(video) {
    if (!video) return;
    snackVideoWatched(video);
    closeModal();
    if (video.url) {
      try {
        window.open(video.url, "_blank", "noopener,noreferrer");
      } catch { /* ignore */ }
    }
    state.screen = "lists";
    state.listsMode = "videos";
    render();
    burstConfetti();
  }

  function coverFromFilm(film) {
    if (!film || !film.title || !film.poster) return null;
    return normalizeCover({
      id: filmId(film),
      title: film.title,
      poster: String(film.poster),
    });
  }

  function coverDisplayTitle(cover) {
    const row = normalizeCover(cover);
    if (!row) return "Cover";
    const starter = tagStarterCovers().find((item) => item.id && item.id === row.id);
    if (starter) return starter.title;
    return row.title || "Cover";
  }

  function tagPlatePhrase(plate) {
    const id = normalizeTagPlate(plate);
    if (id === "schwarz") return "Schwarz";
    if (id === "hell-lava") return "Hell · Lava-Buchstaben";
    if (id === "schwarz-lava") return "Schwarz · Lava-Buchstaben";
    return "Hell";
  }

  function tagPlateHere(plate) {
    const id = normalizeTagPlate(plate);
    if (id === "schwarz") return "Schwarz";
    if (id === "hell-lava") return "Hell + Lava-Buchstaben";
    if (id === "schwarz-lava") return "Schwarz + Lava-Buchstaben";
    return "Hell";
  }

  function tagDraftRecord() {
    const starters = tagStarterCovers();
    return {
      id: state.tagEditId || "",
      name: clampTagName(state.editTagName) || "Tag",
      plate: normalizeTagPlate(state.editTagPlate),
      cover: normalizeCover(state.editTagCover) || starters[0] || null,
    };
  }

  function tagChipHtml(tag, opts) {
    const options = opts || {};
    const plate = normalizeTagPlate(tag && tag.plate);
    const lava = plate === "hell-lava" || plate === "schwarz-lava";
    const warm = plate === "schwarz" || plate === "schwarz-lava";
    const size = options.size || "list";
    const word = options.word != null ? String(options.word) : (clampTagName(tag && tag.name) || "Tag");
    const safeWord = escapeHtml(word);
    const src = escapeHtml(coverSrcFrom(options.cover !== undefined ? options.cover : (tag && tag.cover)));
    const letterAttr = options.draft ? ` data-role="tag-draft-letters"` : "";
    const count = options.count != null
      ? `<span class="tag-chip-count"${options.act ? ` aria-hidden="true"` : ""}>${escapeHtml(String(options.count))}${options.mark ? " ✓" : ""}</span>`
      : "";
    const pressed = !!options.pressed;
    const classes = [
      "tag-chip",
      `is-${plate}`,
      lava ? "is-lava" : "",
      warm ? "is-dark" : "",
      `is-${size}`,
      pressed ? "is-on" : "",
    ].filter(Boolean).join(" ");
    const aria = options.aria || (options.count != null ? `${word} ${options.count}` : word);
    const interactive = !!options.act;
    const tagName = interactive ? "button" : "span";
    const typeAttr = interactive ? ` type="button"` : "";
    const actAttr = interactive ? ` data-act="${escapeHtml(options.act)}"` : "";
    const pressedAttr = interactive ? ` aria-pressed="${pressed ? "true" : "false"}"` : "";
    const ariaAttr = interactive ? ` aria-label="${escapeHtml(aria)}"` : "";
    const extra = options.attrs ? ` ${options.attrs}` : "";
    const wordHidden = interactive ? ` aria-hidden="true"` : "";
    return `<${tagName} class="${classes}"${typeAttr}${actAttr}${pressedAttr}${ariaAttr}${extra}><span class="tag-chip-plate" aria-hidden="true"></span><span class="tag-chip-wave${warm ? " is-warm" : ""}" aria-hidden="true"></span><span class="tag-chip-word"${wordHidden}>${lava ? `<span class="tag-chip-stroke"${letterAttr}>${safeWord}</span>` : ""}<span class="tag-chip-fill" data-cover="${src}"${letterAttr}>${safeWord}</span></span>${count}</${tagName}>`;
  }

  function tagCoverTileHtml(cover, opts) {
    const options = opts || {};
    const on = !!options.on;
    const caption = options.caption || coverDisplayTitle(cover);
    const src = coverSrcFrom(cover);
    const act = options.act || "tag-pick-cover";
    return `
      <button type="button" class="tag-cover${on ? " is-on" : ""}${options.row ? " is-row" : ""}" data-act="${escapeHtml(act)}" data-id="${escapeHtml(cover.id || "")}" aria-pressed="${on ? "true" : "false"}" aria-label="${escapeHtml(caption)}">
        <img src="${escapeHtml(src)}" alt="" decoding="async" referrerpolicy="no-referrer">
        <span class="tag-cover-cap">${escapeHtml(caption)}</span>
        ${on ? `<span class="tag-cover-check" aria-hidden="true">✓</span>` : ""}
      </button>
    `;
  }

  function tagCoverCandidateOn(cover) {
    const picked = normalizeCover(state.tagCoverCandidate);
    return !!(picked && cover && picked.id && picked.id === cover.id);
  }

  function watchCoversForTagAdd() {
    return watchlist()
      .slice()
      .sort((a, b) => (Number(b.at) || 0) - (Number(a.at) || 0))
      .map((row) => coverFromFilm(findFilm(row.id)))
      .filter((cover) => cover && cover.poster)
      .filter((cover, index, list) => list.findIndex((item) => item.id === cover.id) === index)
      .slice(0, 12);
  }

  function tagCoverHitsHtml() {
    const query = state.coverQuery.trim();
    if (query) {
      if (state.coverStatus === "loading" && !(state.coverHits || []).length) {
        return `<p class="hint">Suche …</p>`;
      }
      const tiles = (state.coverHits || []).map((film) => {
        const cover = coverFromFilm(film);
        if (!cover) return "";
        return tagCoverTileHtml(cover, {
          on: tagCoverCandidateOn(cover),
          act: "tag-cover-candidate",
          row: true,
          caption: cover.title,
        });
      }).join("");
      if (!tiles) return `<p class="hint">Kein Film gefunden.</p>`;
      return `<div class="tag-cover-row">${tiles}</div>`;
    }
    const watch = watchCoversForTagAdd();
    if (!watch.length) return `<p class="hint">Watchlist ist leer. Oben nach einem Film suchen.</p>`;
    const tiles = watch.map((cover) => tagCoverTileHtml(cover, {
      on: tagCoverCandidateOn(cover),
      act: "tag-cover-candidate",
      row: true,
    })).join("");
    return `<div class="tag-cover-row">${tiles}</div>`;
  }

  function renderTagCoverGrid() {
    const selected = normalizeCover(state.editTagCover);
    const tiles = tagStarterCovers().concat(tagCovers()).map((cover) => {
      const on = !!(selected && cover.id && selected.id === cover.id);
      return tagCoverTileHtml(cover, { on, act: "tag-pick-cover" });
    }).join("");
    return `
      <div class="tag-cover-grid">
        ${tiles}
        <button type="button" class="tag-cover is-add" data-act="tag-cover-add" aria-expanded="${state.tagCoverSheet ? "true" : "false"}">
          <span class="tag-cover-plus" aria-hidden="true">+</span>
          <span class="tag-cover-add-lbl">Cover<br>hinzufügen</span>
        </button>
      </div>
    `;
  }

  function renderTagCoverSheet() {
    if (!state.tagCoverSheet) return "";
    return `
      <div class="tag-cover-sheet">
        <h4>Cover hinzufügen</h4>
        <p>Aus Watchlist / Suche wählen → landet in deiner Cover-Liste und ist für alle Tags nutzbar.</p>
        <input class="glow-input" data-act="tag-cover-search" value="${escapeHtml(state.coverQuery)}" placeholder="Film suchen" aria-label="Film suchen" autocomplete="off" enterkeyhint="search">
        <div data-role="tag-cover-hits">${tagCoverHitsHtml()}</div>
        <div class="tag-cover-actions">
          <button type="button" class="btn btn-ghost" data-act="tag-cover-cancel">Abbrechen</button>
          <button type="button" class="btn btn-primary" data-act="tag-cover-commit">Zur Liste</button>
        </div>
      </div>
    `;
  }

  function renderTagPlatePicks(cover) {
    return TAG_PLATE_CHOICES.map((choice) => {
      const on = normalizeTagPlate(state.editTagPlate) === choice.id;
      const sub = choice.sub ? `<em>${escapeHtml(choice.sub)}</em>` : "";
      return `
        <button type="button" class="tag-plate${on ? " is-on" : ""}" data-act="tag-pick-plate" data-id="${choice.id}" aria-pressed="${on ? "true" : "false"}">
          ${tagChipHtml({ name: "Aa", plate: choice.id, cover }, { size: "swatch", word: "Aa" })}
          <span class="tag-plate-name">${escapeHtml(choice.label)}${sub}</span>
        </button>
      `;
    }).join("");
  }

  function renderTagListPreview(draft) {
    const editScope = state.tagEditId
      ? tagScopeOf(customTags().find((tag) => tag.id === state.tagEditId))
      : activeTagManageScope();
    const others = customTags(editScope).filter((tag) => tag.id !== state.tagEditId).slice(0, 5);
    const mine = tagChipHtml(draft, { size: "mini", pressed: true, draft: true });
    const rest = others.map((tag) => tagChipHtml(tag, { size: "mini" })).join("");
    return `<div class="tag-edit-live">${mine}${rest}</div>`;
  }

  function renderTagEdit() {
    const draft = tagDraftRecord();
    const title = state.tagEditId ? "Tag bearbeiten" : "Tag hinzufügen";
    return `
      <h2 class="screen-title home-title">${title}</h2>
      <div class="tag-edit">
        <section class="card tag-edit-block tag-edit-preview">
          <p class="tag-edit-kicker">Vorschau</p>
          ${tagChipHtml(draft, { size: "preview", draft: true })}
          <p class="tag-edit-meta">${escapeHtml(tagPlatePhrase(draft.plate))} · Cover ${escapeHtml(coverDisplayTitle(draft.cover))}<br>eigene Cover landen dauerhaft in der Liste</p>
        </section>
        <section class="card tag-edit-block">
          <label class="tag-name-label">
            <span class="tag-name-label-main">Tagname</span><span class="tag-name-label-hint"> (max. 10 Zeichen)</span>
          </label>
          <input class="glow-input" data-act="edit-tag-name" maxlength="10" value="${escapeHtml(state.editTagName)}" placeholder="z. B. Omma" aria-label="Tagname (max. 10 Zeichen)">
        </section>
        <section class="card tag-edit-block">
          <h3>Cover</h3>
          <p class="tag-edit-sub">Festes Set + deine eigenen. Tippe „+“ um aus Filmen / Suche eins hinzuzufügen.</p>
          ${renderTagCoverGrid()}
          ${renderTagCoverSheet()}
        </section>
        <section class="card tag-edit-block">
          <h3>Platte</h3>
          <p class="tag-edit-sub">Nur Hell oder Schwarz — optional mit lavaumrandeten Buchstaben.</p>
          <div class="tag-plate-grid">${renderTagPlatePicks(draft.cover)}</div>
        </section>
        <section class="card tag-edit-block">
          <h3>So wirkt’s in der Liste</h3>
          <p class="tag-edit-sub">Dieselbe Platte + Cover-Spray (hier ${escapeHtml(tagPlateHere(draft.plate))}).</p>
          ${renderTagListPreview(draft)}
        </section>
        <p class="tag-edit-foot">Neue Tags starten mit Hell (ohne Lava-Buchstaben). Cover und Platte jederzeit änderbar. Eigene Cover bleiben in der Auswahlliste.</p>
        ${state.tagEditId ? `<button type="button" class="btn btn-danger-soft tag-edit-delete" data-act="ask-delete-tag" data-id="${escapeHtml(state.tagEditId)}">Tag löschen</button>` : ""}
      </div>
    `;
  }

  function paintTagDraftLetters() {
    const word = clampTagName(state.editTagName) || "Tag";
    app.querySelectorAll("[data-role=tag-draft-letters]").forEach((el) => {
      el.textContent = word;
    });
  }

  function commitTagCover() {
    const cover = normalizeCover(state.tagCoverCandidate);
    if (!cover || !cover.poster) {
      showSnack("Bitte ein Cover wählen.", "warn");
      return;
    }
    const known = tagStarterCovers().concat(tagCovers()).some((row) => row.id && row.id === cover.id);
    if (!known) {
      const next = tagCovers();
      next.push(cover);
      saveTagCovers(next);
    }
    state.editTagCover = cover;
    state.tagCoverSheet = false;
    state.tagCoverCandidate = null;
    state.coverQuery = "";
    state.coverHits = [];
    state.coverStatus = "";
    render();
  }

  function renderTagsManage() {
    const scope = activeTagManageScope();
    const tags = sortedTags(scope);
    const rows = tags.map((t) => {
      const n = scope === "video" ? countVideosWithTag(t.id) : countFilmsWithTag(t.id);
      const countLabel = scope === "video"
        ? (n === 1 ? "1 Video getaggt" : `${n} Videos getaggt`)
        : (n === 1 ? "1 Film getaggt" : `${n} Filme getaggt`);
      return `
        <article class="card tag-manage-card" data-tag-card="${t.id}">
          <div class="tag-manage-row">
            ${tagChipHtml(t, { size: "list" })}
            <button type="button" class="tag-count" data-act="tag-jump" data-id="${t.id}">
              <span>${escapeHtml(countLabel)}</span>
              ${ICONS.jump}
            </button>
            <button type="button" class="tag-edit-toggle" data-act="tag-edit-open" data-id="${t.id}">bearbeiten</button>
          </div>
        </article>
      `;
    }).join("");
    const title = scope === "video" ? "Video-Tags verwalten" : "Tags verwalten";
    return `
      <h2 class="screen-title home-title">${title}</h2>
      <section class="stack">${rows || `<p class="hint">Noch keine eigenen Tags.</p>`}</section>
      <button type="button" class="card menu-card add-entity" data-act="tag-add-open">
        <span class="plus-circle">${ICONS.plus}</span>
        <strong>Tag hinzufügen</strong>
        <span></span>
      </button>
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

  function currentListTabInDom() {
    const selected = app.querySelector('.lists-screen .tab[aria-selected="true"]');
    return selected && selected.dataset.id ? selected.dataset.id : "";
  }

  function captureSameTabListScroll() {
    if (state.screen !== "lists") return null;
    const list = app.querySelector("[data-role=film-list]");
    if (!list) return null;
    const tab = currentListTabInDom();
    if (!tab || tab !== state.listTab) return null;
    const anchorId = state.expandedFilmId ? String(state.expandedFilmId) : "";
    const anchor = anchorId
      ? [...list.querySelectorAll(".film-row")].find((row) => row.dataset.id === anchorId)
      : null;
    return {
      tab,
      top: list.scrollTop,
      anchorId: anchor ? anchorId : "",
      offset: anchor ? anchor.getBoundingClientRect().top - list.getBoundingClientRect().top : null,
    };
  }

  function restoreSameTabListScroll(saved) {
    if (!saved || state.screen !== "lists" || saved.tab !== state.listTab) return;
    const apply = () => {
      if (state.screen !== "lists" || state.listTab !== saved.tab) return;
      const list = app.querySelector("[data-role=film-list]");
      if (!list) return;
      if (Math.abs(list.scrollTop - saved.top) > 1) list.scrollTop = saved.top;
      if (!saved.anchorId || saved.offset == null) return;
      const anchor = [...list.querySelectorAll(".film-row")].find((row) => row.dataset.id === saved.anchorId);
      if (!anchor) return;
      const delta = (anchor.getBoundingClientRect().top - list.getBoundingClientRect().top) - saved.offset;
      if (Math.abs(delta) > 0.5) list.scrollTop += delta;
    };
    apply();
    window.requestAnimationFrame(() => {
      apply();
      window.requestAnimationFrame(apply);
    });
  }

  function blurAppFocus() {
    const active = document.activeElement;
    if (active && active !== document.body && app.contains(active) && typeof active.blur === "function") {
      active.blur();
    }
  }

  function setFilmRowOpen(row, open) {
    if (!open) {
      const active = document.activeElement;
      if (active && row.contains(active) && typeof active.blur === "function") active.blur();
    }
    row.classList.toggle("is-open", open);
    const head = row.querySelector(":scope > .film-row-head");
    if (head) head.setAttribute("aria-expanded", open ? "true" : "false");
    const chevron = head && head.querySelector(".film-row-chevron");
    if (chevron) {
      chevron.setAttribute("aria-expanded", open ? "true" : "false");
      chevron.setAttribute("aria-label", open ? "Zuklappen" : "Aufklappen");
      chevron.innerHTML = open ? ICONS.chevronUp : ICONS.chevron;
    }
    const panel = row.querySelector(":scope > .film-row-expand");
    if (panel) panel.hidden = !open;
  }

  // Expand only toggles the row. Rebuilding the list drops scrollTop back to 0.
  function applyListFilmExpand(openId, anchorId) {
    if (state.screen !== "lists") return false;
    const list = app.querySelector("[data-role=film-list]");
    if (!list) return false;
    const rows = [...list.querySelectorAll(".film-row.is-expandable")];
    if (!rows.length) return false;
    const openKey = openId ? String(openId) : "";
    if (openKey && !rows.some((row) => row.dataset.id === openKey)) return false;
    const anchor = rows.find((row) => row.dataset.id === String(anchorId || "")) || null;
    const offsetBefore = anchor
      ? anchor.getBoundingClientRect().top - list.getBoundingClientRect().top
      : null;
    const scrollBefore = list.scrollTop;
    rows.forEach((row) => setFilmRowOpen(row, !!openKey && row.dataset.id === openKey));
    const pin = () => {
      if (!list.isConnected) return;
      if (anchor && anchor.isConnected && offsetBefore != null) {
        const delta = (anchor.getBoundingClientRect().top - list.getBoundingClientRect().top) - offsetBefore;
        if (Math.abs(delta) > 0.5) list.scrollTop += delta;
        return;
      }
      if (Math.abs(list.scrollTop - scrollBefore) > 1) list.scrollTop = scrollBefore;
    };
    pin();
    window.requestAnimationFrame(pin);
    return true;
  }

  function render() {
    // Phase is captured before any lava wave is mounted. Rewriting --wave-phase
    // after paint restarts the header icon from the top-left of the sweep.
    syncWaveClock();
    const keepSearchOnLists = state.watchSheet === "search" && state.screen === "lists";
    if (state.watchSheet === "zufall" || (state.watchSheet === "similar" && state.screen === "discover") || keepSearchOnLists) {
      /* keep overlay */
    } else if (state.screen !== "lists" || (state.listTab !== "watch" && state.listTab !== "queue")) {
      closeWatchSheet();
    }
    updateHeader();
    updateFooter();
    const onLogin = state.screen === "login";
    document.body.classList.toggle("on-login", onLogin);
    document.body.classList.toggle("on-home", state.screen === "discover" && state.discoverView !== "results");
    document.body.classList.toggle("on-discover", state.screen === "discover");
    document.body.classList.toggle("on-lists", state.screen === "lists");
    if (!onLogin) {
      document.body.classList.remove("login-focus");
      teardownLoginCarousel();
    } else {
      window.requestAnimationFrame(syncLoginViewport);
    }
    if (onLogin) {
      const existing = app.querySelector(".login-screen");
      if (existing && loginUi.root) {
        const form = existing.querySelector("[data-role=login-form]");
        if (form) form.outerHTML = renderLoginForm();
        bindLoginChrome();
      } else {
        app.innerHTML = renderLogin();
        bindLoginChrome();
        mountLoginCarousel();
      }
    }
    else if (state.screen === "profiles") {
      app.innerHTML = renderProfiles();
      bindAccountCovers(app);
    }
    else if (state.screen === "profile-add") {
      app.innerHTML = renderProfileAdd();
      bindAccountCovers(app);
    }
    else if (state.screen === "discover") {
      app.innerHTML = renderDiscover();
      if (state.discoverView === "hub") window.requestAnimationFrame(paintChipOverflow);
      if (state.discoverView === "results") {
        observeListPostersSoon(app);
        enrichListCast(state.currentPicks);
      }
    }
    else if (state.screen === "lists") {
      const pinJust = state.pinJustWatched;
      state.pinJustWatched = false;
      const keptListScroll = pinJust ? null : captureSameTabListScroll();
      blurAppFocus();
      destroyInlineVideoPlayer();
      app.innerHTML = renderLists();
      if (pinJust) {
        const list = app.querySelector("[data-role=film-list]");
        if (list) list.scrollTop = 0;
      } else restoreSameTabListScroll(keptListScroll);
      bindFilmListScroll();
      observeListPostersSoon(app);
      if (state.listTab === "watch" && state.listsMode !== "videos") {
        window.requestAnimationFrame(() => maybeWatchlistSwipeHint());
      }
      const shown = app.querySelectorAll(".film-row");
      const films = [...shown].map((row) => findFilm(row.dataset.id)).filter(Boolean);
      if (state.listTab !== "seen") enrichListCast(films);
      if (state.expandedFilmId) enrichExpandedFilm(state.expandedFilmId);
      if (state.inlineVideoPlayerId) {
        window.requestAnimationFrame(() => {
          mountInlineVideoPlayer();
        });
      }
      window.requestAnimationFrame(paintChipOverflow);
    }
    else if (state.screen === "tags") app.innerHTML = renderTagsManage();
    else if (state.screen === "tag-edit") app.innerHTML = renderTagEdit();
    else if (state.screen === "done") app.innerHTML = renderDone();
    else if (state.screen === "settings") app.innerHTML = renderSettings();
    if (state.migrateDialog) {
      const host = app;
      if (host && !host.querySelector("[data-role=migrate-dialog]")) {
        host.insertAdjacentHTML("beforeend", renderMigrateDialog());
      }
    }
    bindAccountCovers(app);
    scheduleFooterSync();
  }

  const WAVE_MS = 4400;

  function syncWaveClock() {
    const time = performance.now() % WAVE_MS;
    document.documentElement.style.setProperty("--wave-phase", `-${Math.round(time)}ms`);
    return time;
  }

  function goBack() {
    if (state.watchSheet) {
      dismissWatchSheet();
      return;
    }
    if (state.screen === "tag-edit") {
      resetTagEditor();
      state.screen = "tags";
    } else if (state.screen === "profile-add") state.screen = "profiles";
    else if (state.screen === "settings") {
      state.screen = state.settingsReturnScreen || "lists";
      state.settingsError = "";
    } else if (state.screen === "lists" || state.screen === "tags" || state.screen === "done") {
      if (state.screen === "tags") state.tagEditId = null;
      state.screen = "discover";
      state.discoverView = "hub";
      state.expandedFilmId = null;
    }
    render();
  }

  function enterLoggedInUser(user) {
    state.user = user;
    state.loginError = "";
    const list = profilesOf(user.id);
    if (list.length === 1) {
      state.profile = list[0];
      migrateTagsScopeIfNeeded();
      migrateCastOrderIfNeeded();
      loadZufallFiltersFromStorage();
      resetSessionPicks();
      openWatchlistHome();
    } else {
      state.profile = null;
      state.screen = "profiles";
    }
    persistSession();
  }

  function submitAuthLocal(login, password) {
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
      enterLoggedInUser(user);
      render();
      return;
    }
    const user = list.find((u) => u.login.toLowerCase() === login.toLowerCase() && u.password === password);
    if (!user) {
      state.loginError = "Login oder Passwort stimmt nicht.";
      render();
      return;
    }
    enterLoggedInUser(user);
    render();
    if (state.profile) loadCatalog();
  }

  async function submitAuthCloud(login, password) {
    if (login.length < 3 || login.length > 32) {
      state.loginError = "Benutzername: 3–32 Zeichen.";
      render();
      return;
    }
    state.authBusy = true;
    state.loginError = "";
    render();
    try {
      const path = state.authMode === "register" ? "/register" : "/login";
      const { ok, status, data } = await syncApi(path, {
        method: "POST",
        body: { name: login, password },
      });
      if (!ok || !data || !data.token) {
        if (status === 409) state.loginError = "Dieser Login ist online schon vergeben.";
        else if (status === 401) state.loginError = "Login oder Passwort stimmt nicht.";
        else if (status === 429) state.loginError = "Zu viele Versuche. Bitte kurz warten.";
        else state.loginError = (data && (data.error || data.message)) || "Cloud-Anmeldung fehlgeschlagen.";
        return;
      }
      const user = upsertLocalCloudUser(login);
      saveCloudSession({
        token: data.token,
        name: login,
        userId: user.id,
        at: Date.now(),
      });
      state.loginPass = "";
      enterLoggedInUser(user);
      await afterCloudAuth(user);
      if (state.profile) loadCatalog();
    } catch (err) {
      state.loginError = err && err.message ? err.message : "Keine Verbindung zur Cloud.";
    } finally {
      state.authBusy = false;
      render();
    }
  }

  async function submitAuth() {
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
    if (cloudSyncAvailable() && state.cloudSyncOn) {
      await submitAuthCloud(login, password);
      return;
    }
    submitAuthLocal(login, password);
  }

  async function fetchFilmOverview(film) {
    const have = filmOverview(film);
    if (have) return have;
    if (!film || !film.tmdb || !tmdbKey()) return "";
    try {
      const data = await tmdbFetch(`/movie/${film.tmdb}`);
      const text = String((data && data.overview) || "").trim();
      if (text) {
        rememberFilm({ ...film, overview: text });
        return text;
      }
    } catch {
      /* keep empty plot */
    }
    return "";
  }

  async function enrichExpandedFilm(id) {
    const film = findFilm(id);
    if (!film || state.expandedFilmId !== filmId(film) || state.screen !== "lists") return;
    const box = app.querySelector(".film-row.is-open .film-row-expand");
    if (!box) return;
    if (!filmOverview(film)) {
      const text = await fetchFilmOverview(film);
      if (text && state.expandedFilmId === filmId(film) && !box.querySelector(".film-expand-plot")) {
        const plotHtml = `<p class="film-expand-plot">${escapeHtml(clipPlot(text))}</p>`;
        const watchBtn = box.querySelector(".film-expand-watch");
        if (watchBtn) watchBtn.insertAdjacentHTML("afterend", plotHtml);
        else box.insertAdjacentHTML("afterbegin", plotHtml);
      }
    }
    const names = await loadFilmProviders(film);
    if (state.expandedFilmId !== filmId(film)) return;
    const stream = box.querySelector("[data-role=film-expand-stream]");
    if (!stream) return;
    const line = formatProviderLine(names);
    if (!line.text) {
      stream.hidden = true;
      stream.innerHTML = "";
      return;
    }
    stream.hidden = false;
    stream.innerHTML = `<p class="film-expand-stream-label">verfügbar auf:</p><p class="film-expand-stream-names">${escapeHtml(line.text)}${line.extra ? `<span class="zufall-mehr">+ mehr</span>` : ""}</p>`;
  }

  async function enrichFilm(film) {
    if (!film || !film.tmdb) return film;
    if (film.runtime && film.poster && film.genres && film.genres.length) return film;
    try {
      const data = await tmdbFetch(`/movie/${film.tmdb}`);
      const next = fromTmdbMovie(data);
      if (next && data && data.overview) next.overview = String(data.overview).trim();
      return rememberFilm(next) || film;
    } catch {
      return film;
    }
  }

  let enrichPicksSeq = 0;

  async function enrichPicks() {
    const seq = ++enrichPicksSeq;
    const snapshot = state.currentPicks.slice();
    const next = [];
    for (const film of snapshot) {
      if (seq !== enrichPicksSeq) return;
      next.push(await enrichFilm(film));
    }
    if (seq !== enrichPicksSeq) return;
    const fresh = new Map(next.map((film) => [filmId(film), film]));
    state.currentPicks = state.currentPicks.map((film) => fresh.get(filmId(film)) || film);
    if (state.screen === "discover" && state.discoverView === "results") render();
  }

  async function startSuggestions(opts) {
    const refresh = !!(opts && opts.refresh);
    closeWatchSheet();
    await settleActorFilmographies();
    if (refresh) {
      for (const film of state.currentPicks) state.sessionSkip.add(filmId(film));
    }
    state.screen = "discover";
    state.discoverView = "results";
    state.expandedFilmId = null;
    await loadCatalog();
    await ensureDiscoverPool(80);
    if (!state.catalog.length) state.catalog = cloneFilms(offlineFilms);
    state.currentPicks = pickThree();
    rememberSuggestGenres(state.currentPicks);
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
    const keep = state.currentPicks.filter((film) => filmId(film) !== filmId(oldId));
    const next = pickFilms(1, exclude, keep)[0];
    if (next) rememberSuggestGenres([next]);
    state.currentPicks = state.currentPicks.map((film) => (
      filmId(film) === filmId(oldId) ? (next || film) : film
    ));
    enrichPicks();
  }

  function addWatch(film) {
    if (!film) return false;
    rememberFilm(film);
    scheduleLiveDetails(film);
    const list = watchlist();
    if (list.some((row) => String(row.id) === filmId(film))) return false;
    list.unshift({ id: filmId(film), at: Date.now() });
    saveWatchlist(list);
    return true;
  }

  function isOnWatchlist(film) {
    if (!film) return false;
    return watchlist().some((row) => String(row.id) === filmId(film));
  }

  function addQueue(film) {
    if (!film) return false;
    addWatch(film);
    rememberFilm(film);
    scheduleLiveDetails(film);
    const list = queue();
    if (list.some((row) => String(row.id) === filmId(film))) return false;
    list.unshift({ id: filmId(film), at: Date.now() });
    saveQueue(list);
    return true;
  }

  function isOnQueue(film) {
    if (!film) return false;
    return queue().some((row) => String(row.id) === filmId(film));
  }

  function removeQueueId(id) {
    const hid = String(id);
    const next = queue().filter((row) => String(row.id) !== hid);
    if (next.length === queue().length) return false;
    saveQueue(next);
    return true;
  }

  function removeFromWatchlist(id) {
    const hid = filmId(id);
    const before = watchlist();
    const next = before.filter((row) => String(row.id) !== hid);
    const removed = next.length !== before.length;
    if (removed) {
      if (state.user && state.profile) markTombstone(state.user.id, state.profile.id, "watchlist", id);
      saveWatchlist(next);
    }
    removeQueueId(hid);
    return removed;
  }

  function applyWatchSearchContext(film) {
    const ctx = state.watchSearchContext;
    if (!ctx || !film) return null;
    const id = filmId(film);
    if (ctx.kind === "tags") {
      const map = filmTags();
      const have = new Set(map[id] || []);
      (ctx.tagIds || []).forEach((tagId) => have.add(tagId));
      map[id] = Array.from(have);
      saveFilmTags(map);
      const labels = (ctx.tagIds || []).map((tagId) => customTags().find((row) => row.id === tagId)?.name).filter(Boolean);
      return { message: "Zur Watchlist + Tag", tags: labels, context: true };
    }
    if (ctx.kind === "rated") {
      setRating(id, ctx.rating);
      const label = ctx.label || (RATE_KEYS.find((r) => r.id === ctx.rating)?.label || "");
      return { message: "Zur Watchlist + Bewertung", tags: label ? [label] : [], context: true };
    }
    if (ctx.kind === "seen") {
      recordFilmWatched(film);
      return { message: "Zur Watchlist + Angesehen", tags: ["Angesehen"], context: true };
    }
    return null;
  }

  function rememberSearchContextAdd(id) {
    const hid = String(id);
    if (!state.searchContextAddedIds.includes(hid)) {
      state.searchContextAddedIds = state.searchContextAddedIds.concat(hid);
    }
  }

  function jumpToWatchlistFilm(film) {
    if (!film) return;
    const hid = filmId(film);
    state.screen = "lists";
    state.listTab = "watch";
    state.expandedFilmId = hid;
    state.highlightWatchlistId = hid;
    closeWatchSheet();
    render();
    window.requestAnimationFrame(() => {
      enrichExpandedFilm(hid);
      const list = app.querySelector("[data-role=film-list]");
      const row = list && list.querySelector(`.film-row[data-id="${CSS.escape(hid)}"]`);
      if (row) {
        row.scrollIntoView({ block: "center", behavior: "smooth" });
        row.classList.add("is-watchlist-flash");
        window.setTimeout(() => {
          row.classList.remove("is-watchlist-flash");
          if (state.highlightWatchlistId === hid) state.highlightWatchlistId = "";
        }, 2200);
      } else {
        state.highlightWatchlistId = "";
      }
    });
  }

  function toggleWatchFilm(film) {
    if (!film) return;
    rememberFilm(film);
    if (isOnWatchlist(film)) {
      removeFromWatchlist(film);
      state.searchContextAddedIds = state.searchContextAddedIds.filter((id) => id !== filmId(film));
      paintWatchToggles();
      refreshWatchList();
      if (state.watchSheet) paintWatchSheetList();
      showSnack(`${film.title} von Watchlist entfernt`, "danger");
      return;
    }
    addWatch(film);
    let queued = false;
    if (state.listTab === "queue") queued = addQueue(film);
    const ctxSnack = state.watchSheet === "search" ? applyWatchSearchContext(film) : null;
    if (ctxSnack) rememberSearchContextAdd(filmId(film));
    paintWatchToggles();
    refreshWatchList();
    if (state.watchSheet) paintWatchSheetList();
    if (ctxSnack) {
      showSnack(ctxSnack.message, "success", { tags: ctxSnack.tags, context: true });
      return;
    }
    showSnack(queued ? "Zu Watchlist und Demnächst hinzugefügt" : `${film.title} zur Watchlist hinzugefügt`);
  }

  function chooseFilm(film) {
    if (!film) return;
    rememberFilm(film);
    scheduleLiveDetails(film);
    const hid = filmId(film);
    recordFilmWatched(film);
    resetSessionPicks();
    state.chosen = film;
    state.justWatchedId = hid;
    state.screen = "lists";
    state.listTab = "seen";
    state.seenOnlyUnrated = false;
    state.expandedFilmId = hid;
    state.discoverView = "hub";
    state.pinJustWatched = true;
    closeWatchSheet();
    render();
    burstConfetti();
    showSnack("Angesehen");
  }

  function handleWatchUiClick(event) {
    const t = event.target.closest("[data-act]");
    if (!t) return false;
    const act = t.dataset.act;
    if (act === "watch-sheet-open") {
      openWatchAddSheet();
      return true;
    }
    if (act === "zufall-open") {
      openZufallSheet();
      return true;
    }
    if (act === "watch-sheet-close") {
      dismissWatchSheet();
      return true;
    }
    if (act === "zufall-push") {
      startZufallAutoSpin();
      return true;
    }
    if (act === "zufall-skip") {
      skipZufallSpin();
      return true;
    }
    if (act === "zufall-again") {
      startZufallAutoSpin();
      return true;
    }
    if (act === "zufall-source") {
      toggleZufallSource(t.dataset.id);
      return true;
    }
    if (act === "zufall-more") {
      state.filterMore.zufall = !state.filterMore.zufall;
      paintZufallSources();
      paintZufallFilterZone();
      return true;
    }
    if (act === "zufall-filter-open") {
      openZufallFilterSheet();
      return true;
    }
    if (act === "zufall-filter-back") {
      closeZufallFilterSheet();
      return true;
    }
    if (act === "zufall-filter-apply") {
      const stats = zufallMatchStats(zufallFiltersDraftBag());
      if (!stats.count) return true;
      applyZufallFiltersFromDraft();
      return true;
    }
    if (act === "zufall-filter-reset") {
      if (state.zufallFilterSheet) {
        state.zufallFiltersDraft = emptyFilterBag();
        paintZufallFilterSheet();
      } else {
        clearZufallFilters();
        paintZufallFilterZone();
      }
      return true;
    }
    if (act === "zufall-filter-clear-all") {
      clearZufallFilters();
      paintZufallFilterZone();
      return true;
    }
    if (act === "zufall-filter-chip-remove") {
      const kind = t.dataset.kind;
      const id = t.dataset.id;
      const bag = state.zufallFilters;
      if (kind === "dauer") bag.dauerOn = false;
      if (kind === "genre") bag.genres = bag.genres.filter((x) => x !== id);
      if (kind === "tag") bag.tags = bag.tags.filter((x) => x !== id);
      if (kind === "type") bag.types = bag.types.filter((x) => x !== id);
      if (kind === "actor") bag.actors = (bag.actors || []).filter((x) => x.id !== id);
      saveZufallFiltersToStorage();
      refreshZufallAfterFilters();
      return true;
    }
    if (act === "zufall-loosen-dauer") {
      const bag = zufallFiltersDraftBag();
      bag.dauerOn = false;
      paintZufallFilterSheet();
      return true;
    }
    if (act === "zufall-loosen-genre") {
      const bag = zufallFiltersDraftBag();
      bag.genres = bag.genres.filter((g) => g !== t.dataset.id);
      paintZufallFilterSheet();
      return true;
    }
    if (act === "zufall-swap") {
      swapZufallFront(t.dataset.side);
      return true;
    }
    if (act === "choose") {
      chooseFilm(findFilm(t.dataset.id));
      return true;
    }
    if (act === "search-ctx-tag") {
      const film = findFilm(t.dataset.id);
      const ctx = state.watchSearchContext;
      if (!film || !ctx || ctx.kind !== "tags") return true;
      rememberFilm(film);
      const map = filmTags();
      const have = new Set(map[filmId(film)] || []);
      (ctx.tagIds || []).forEach((tagId) => have.add(tagId));
      map[filmId(film)] = Array.from(have);
      saveFilmTags(map);
      const labels = (ctx.tagIds || []).map((tagId) => customTags().find((row) => row.id === tagId)?.name).filter(Boolean);
      showSnack("Getaggt", "success", { tags: labels, context: true });
      return true;
    }
    if (act === "search-ctx-rate") {
      const film = findFilm(t.dataset.id);
      const ctx = state.watchSearchContext;
      if (!film || !ctx || ctx.kind !== "rated") return true;
      rememberFilm(film);
      setRating(filmId(film), ctx.rating);
      const label = ctx.label || (RATE_KEYS.find((r) => r.id === ctx.rating)?.label || "");
      showSnack("Bewertet", "success", { tags: label ? [label] : [], context: true });
      return true;
    }
    if (act === "watch-search-open") {
      openWatchSearchSheet();
      return true;
    }
    if (act === "watch-search-goto") {
      jumpToWatchlistFilm(findFilm(t.dataset.id));
      return true;
    }
    if (act === "watch-cat") {
      if (state.watchCat === t.dataset.id) return true;
      state.watchCat = t.dataset.id;
      resetWatchSheetPage();
      watchSheetEl.querySelectorAll("[data-act=watch-cat]").forEach((btn) => {
        btn.setAttribute("aria-pressed", btn.dataset.id === state.watchCat ? "true" : "false");
      });
      paintWatchSheetList();
      return true;
    }
    if (act === "watch-more") {
      loadMoreWatchSheetFilms();
      return true;
    }
    if (act === "watch-toggle") {
      toggleWatchFilm(findFilm(t.dataset.id));
      return true;
    }
    if (act === "similar-toggle") {
      toggleSimilarDraft(t.dataset.id);
      return true;
    }
    if (act === "similar-draft-remove") {
      state.similarDraft = (state.similarDraft || []).filter((row) => row.id !== t.dataset.id);
      paintSimilarSelection();
      return true;
    }
    if (act === "similar-more") {
      state.similarVisible = (state.similarVisible || 20) + 20;
      paintSimilarList();
      return true;
    }
    if (act === "similar-apply") {
      state.filters.similar = (state.similarDraft || []).map((row) => ({ ...row }));
      similarFetchedKey = "";
      similarSeedCacheKey = "";
      closeWatchSheet();
      render();
      return true;
    }
    if (act === "video-add-open") {
      openVideoAddSheet();
      return true;
    }
    if (act === "video-save") {
      saveVideoFromForm();
      return true;
    }
    if (act === "video-edit-remove") {
      removeVideoWithUndo(findVideo(t.dataset.id));
      return true;
    }
    if (act === "video-pick-plat") {
      const platId = t.dataset.plat || "";
      state.videoFormPlatId = platId;
      state.videoFormPlat = platLabelFromId(platId);
      state.videoFormCustomPlat = true;
      const platInput = watchSheetEl.querySelector("#video-plat");
      if (platInput) platInput.value = state.videoFormPlat;
      watchSheetEl.querySelectorAll(".video-plat-chip").forEach((chip) => {
        chip.setAttribute("aria-pressed", chip.dataset.plat === platId ? "true" : "false");
      });
      return true;
    }
    if (handleZufallFilterSheetClick(event)) return true;
    return false;
  }

  function handleZufallFilterSheetClick(event) {
    const t = event.target.closest("[data-act]");
    if (!t || filterCtxFrom(t) !== "zufall") return false;
    const act = t.dataset.act;
    const bag = zufallFiltersDraftBag();
    if (act === "genre") {
      const g = t.dataset.genre;
      if (bag.genres.includes(g)) bag.genres = bag.genres.filter((x) => x !== g);
      else bag.genres.push(g);
      paintZufallFilterSheet();
      return true;
    }
    if (act === "filter-tag") {
      const id = t.dataset.id;
      if (bag.tags.includes(id)) bag.tags = bag.tags.filter((x) => x !== id);
      else bag.tags.push(id);
      paintZufallFilterSheet();
      return true;
    }
    if (act === "filter-type") {
      const id = t.dataset.id;
      if (bag.types.includes(id)) bag.types = bag.types.filter((x) => x !== id);
      else bag.types.push(id);
      paintZufallFilterSheet();
      return true;
    }
    if (act === "actor-pick") {
      const name = t.dataset.name || "";
      const id = t.dataset.id || name;
      const tmdb = Number(t.dataset.tmdb) || 0;
      const hit = (state.actorHits || []).find((row) => String(row.id) === String(id) || foldSearch(row.name) === foldSearch(name));
      if (name && !(bag.actors || []).some((actor) => foldSearch(actor.name) === foldSearch(name))) {
        const actor = {
          id,
          name,
          tmdb: tmdb || (hit && hit.tmdb) || 0,
          count: hit ? hit.count : 0,
        };
        if (!bag.actors) bag.actors = [];
        bag.actors.push(actor);
        actor.filmPromise = loadActorFilmography(actor);
      }
      state.actorQuery = "";
      state.actorHits = [];
      state.actorStatus = "";
      paintZufallFilterSheet();
      return true;
    }
    if (act === "actor-remove") {
      bag.actors = (bag.actors || []).filter((actor) => actor.id !== t.dataset.id);
      paintZufallFilterSheet();
      return true;
    }
    if (act === "filter-more") {
      const key = t.dataset.key;
      if (key) state.filterMore[key] = !state.filterMore[key];
      paintZufallFilterSheet();
      return true;
    }
    return false;
  }

  app.addEventListener("click", async (event) => {
    if (handleWatchUiClick(event)) return;
    const inSeenBubble = event.target.closest(".seen-rate-bubble, [data-act=seen-rate-open], [data-act=video-seen-rate-open]");
    const seenBubbleWas = state.seenRateFor;
    const seenVideoBubbleWas = state.seenVideoRateFor;
    if (state.seenRateFor && !inSeenBubble) state.seenRateFor = "";
    if (state.seenVideoRateFor && !inSeenBubble) state.seenVideoRateFor = "";
    const t = event.target.closest("[data-act]");
    if (!t) {
      closeFilmMenus();
      if ((seenBubbleWas || seenVideoBubbleWas) && !inSeenBubble) render();
      return;
    }
    const act = t.dataset.act;
    if (act !== "film-menu" && !t.closest(".film-menu-pop")) closeFilmMenus();

    if (act === "toggle-pass") {
      const input = app.querySelector("[data-act=login-pass]");
      if (!input) return;
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      t.setAttribute("aria-label", show ? "Passwort verbergen" : "Passwort anzeigen");
      t.setAttribute("aria-pressed", show ? "true" : "false");
      t.innerHTML = show ? ICONS.eyeOff : ICONS.eye;
      return;
    }
    if (act === "auth-toggle") {
      state.authMode = state.authMode === "login" ? "register" : "login";
      state.loginError = "";
      render();
      return;
    }
    if (act === "cloud-toggle") {
      if (!cloudSyncAvailable() || state.authBusy) return;
      state.cloudSyncOn = !state.cloudSyncOn;
      saveCloudPref(state.cloudSyncOn);
      state.loginError = "";
      render();
      return;
    }
    if (act === "backup-export") {
      const nameInput = app.querySelector("[data-act=login-name]");
      if (nameInput) state.loginName = nameInput.value;
      exportAccountBackupForLogin(state.loginName);
      return;
    }
    if (act === "backup-import") {
      pickBackupFile();
      return;
    }
    if (act === "migrate-upload") {
      runMigrationUpload();
      return;
    }
    if (act === "migrate-later") {
      deferMigration();
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
      invalidateKnownFilmsCache();
      migrateTagsScopeIfNeeded();
      migrateCastOrderIfNeeded();
      loadZufallFiltersFromStorage();
      resetSessionPicks();
      openWatchlistHome();
      persistSession();
      try {
        render();
      } catch (err) {
        console.error(err);
        showSnack("Fehler beim Öffnen", "warn");
      }
      loadCatalog();
      return;
    }
    if (act === "settings-backup") {
      const user = state.user;
      if (!user || state.settingsBusy) return;
      if (downloadAccountBackup(user, "settings")) {
        const stamp = new Date().toISOString().slice(0, 10);
        const safe = String(user.login).replace(/[^\w.-]+/g, "_");
        showSnack(`Sicherung gespeichert: cinex-backup-${safe}-${stamp}.json`);
      }
      return;
    }
    if (act === "settings-enable-sync") {
      openEnableSyncPasswordSheet();
      return;
    }
    if (act === "settings-sync-now") {
      const user = state.user;
      if (!user || state.settingsBusy || !cloudAccountLinked()) return;
      state.settingsBusy = true;
      render();
      if (state._syncTimer) {
        clearTimeout(state._syncTimer);
        state._syncTimer = null;
      }
      syncAccount(user, { reason: "manual" })
        .then((res) => {
          if (res && res.ok) showSnack("Synchronisierung abgeschlossen.");
          else showSnack("Synchronisierung fehlgeschlagen.", "warn");
        })
        .catch(() => showSnack("Synchronisierung fehlgeschlagen.", "warn"))
        .finally(() => {
          state.settingsBusy = false;
          render();
        });
      return;
    }
    if (act === "add-profile") {
      openProfileEditor(null);
      return;
    }
    if (act === "edit-profile") {
      const profile = profilesOf(state.user.id).find((row) => row.id === t.dataset.id);
      if (!profile) return;
      openProfileEditor(profile);
      return;
    }
    if (act === "pick-plate") {
      state.addPlate = normalizePlate(t.dataset.id);
      render();
      return;
    }
    if (act === "pick-cover") {
      const film = filmForCoverPick(t.dataset.id);
      if (!film) return;
      state.addCover = {
        id: filmId(film),
        title: film.title || "",
        poster: posterUrl(film, "w342") || film.poster || "",
      };
      render();
      return;
    }
    if (act === "save-profile") {
      saveProfileEditor();
      return;
    }
    if (act === "ask-delete-profile") {
      const id = t.dataset.id;
      openConfirm({
        title: "Profil löschen",
        text: `Bitte das Passwort von ${escapeHtml(state.user.login)} bestätigen.`,
        extra: `<label class="field"><span>Passwort</span><input data-act="del-pass" type="password"></label>`,
        confirmLabel: "Löschen",
        confirmAct: "delete-profile",
        id,
      });
      return;
    }
    if (act === "modal-close") {
      closeModal();
      return;
    }
    if (act === "toggle-filters") {
      state.filtersOpen = !state.filtersOpen;
      if (state.filtersOpen) state.shinePaused = false;
      else {
        state.filterMore = {
          genre: false,
          tags: false,
          streaming: false,
          types: false,
          zufall: false,
          listWatch: false,
          listQueue: false,
          listRated: false,
          listTags: false,
          listTagsActions: false,
          listSeen: false,
          videoWatch: false,
          videoQueue: false,
          videoSeen: false,
          videoRated: false,
          videoTags: false,
          videoTagsActions: false,
        };
      }
      render();
      return;
    }
    if (act === "filter-more") {
      const key = t.dataset.key;
      if (key) state.filterMore[key] = !state.filterMore[key];
      render();
      return;
    }
    if (act === "remove-filter") {
      const kind = t.dataset.kind;
      const id = t.dataset.id;
      if (kind === "dauer") state.filters.dauerOn = false;
      if (kind === "genre") state.filters.genres = state.filters.genres.filter((x) => x !== id);
      if (kind === "tag") state.filters.tags = state.filters.tags.filter((x) => x !== id);
      if (kind === "streaming") state.filters.streaming = state.filters.streaming.filter((x) => x !== id);
      if (kind === "type") state.filters.types = state.filters.types.filter((x) => x !== id);
      if (kind === "actor") state.filters.actors = state.filters.actors.filter((x) => x.id !== id);
      if (kind === "similar") {
        state.filters.similar = (state.filters.similar || []).filter((x) => x.id !== id);
        similarFetchedKey = "";
        similarSeedCacheKey = "";
      }
      render();
      return;
    }
    if (act === "ask-clear-filters") {
      openConfirm({
        title: "Filter löschen?",
        text: "Alle aktiven Filter wirklich entfernen?",
        confirmLabel: "Löschen",
        confirmAct: "clear-filters",
      });
      return;
    }
    if (act === "genre") {
      const g = t.dataset.genre;
      const ctx = filterCtxFrom(t);
      const bag = filtersBagForCtx(ctx);
      if (bag.genres.includes(g)) bag.genres = bag.genres.filter((x) => x !== g);
      else bag.genres.push(g);
      if (ctx === "zufall") {
        paintZufallFilterSheet();
        return;
      }
      render();
      return;
    }
    if (act === "filter-tag") {
      const id = t.dataset.id;
      const ctx = filterCtxFrom(t);
      const bag = filtersBagForCtx(ctx);
      if (bag.tags.includes(id)) bag.tags = bag.tags.filter((x) => x !== id);
      else bag.tags.push(id);
      if (ctx === "zufall") {
        paintZufallFilterSheet();
        return;
      }
      render();
      return;
    }
    if (act === "filter-stream") {
      const id = t.dataset.id;
      if (state.filters.streaming.includes(id)) {
        state.filters.streaming = state.filters.streaming.filter((x) => x !== id);
      } else {
        state.filters.streaming.push(id);
      }
      render();
      return;
    }
    if (act === "suggest") {
      await startSuggestions();
      return;
    }
    if (act === "discover-filters") {
      state.discoverView = "hub";
      state.expandedFilmId = null;
      render();
      return;
    }
    if (act === "discover-refresh") {
      await startSuggestions({ refresh: true });
      return;
    }
    if (act === "discover-cat") {
      const id = t.dataset.id;
      state.discoverCat = state.discoverCat === id ? "" : id;
      render();
      return;
    }
    if (act === "dauer-off") {
      state.filters.dauerOn = false;
      render();
      return;
    }
    if (act === "filter-type") {
      const id = t.dataset.id;
      const ctx = filterCtxFrom(t);
      const bag = filtersBagForCtx(ctx);
      if (bag.types.includes(id)) bag.types = bag.types.filter((x) => x !== id);
      else bag.types.push(id);
      if (ctx === "zufall") {
        paintZufallFilterSheet();
        return;
      }
      render();
      return;
    }
    if (act === "actor-pick") {
      const name = t.dataset.name || "";
      const id = t.dataset.id || name;
      const tmdb = Number(t.dataset.tmdb) || 0;
      const ctx = filterCtxFrom(t);
      const bag = filtersBagForCtx(ctx);
      const hit = (state.actorHits || []).find((row) => String(row.id) === String(id) || foldSearch(row.name) === foldSearch(name));
      if (name && !(bag.actors || []).some((actor) => foldSearch(actor.name) === foldSearch(name))) {
        const actor = {
          id,
          name,
          tmdb: tmdb || (hit && hit.tmdb) || 0,
          count: hit ? hit.count : 0,
        };
        if (!bag.actors) bag.actors = [];
        bag.actors.push(actor);
        actor.filmPromise = loadActorFilmography(actor);
      }
      state.actorQuery = "";
      state.actorHits = [];
      state.actorStatus = "";
      if (ctx === "zufall") {
        paintZufallFilterSheet();
        return;
      }
      render();
      return;
    }
    if (act === "actor-remove") {
      const ctx = filterCtxFrom(t);
      const bag = filtersBagForCtx(ctx);
      bag.actors = (bag.actors || []).filter((actor) => actor.id !== t.dataset.id);
      if (ctx === "zufall") {
        paintZufallFilterSheet();
        return;
      }
      render();
      return;
    }
    if (act === "similar-open") {
      openSimilarSheet();
      return;
    }
    if (act === "similar-remove") {
      state.filters.similar = (state.filters.similar || []).filter((film) => film.id !== t.dataset.id);
      similarFetchedKey = "";
      similarSeedCacheKey = "";
      render();
      return;
    }
    if (act === "suggest-tag") {
      const box = t.closest(".film-row-expand");
      const tagsEl = box && box.querySelector("[data-role=suggest-tags]");
      if (!customTags("film").length) {
        showSnack("Noch keine eigenen Tags", "warn");
        return;
      }
      if (tagsEl) {
        tagsEl.classList.add("is-focus");
        tagsEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
      return;
    }
    if (act === "suggest-watch") {
      const film = findFilm(t.dataset.id);
      if (!film) return;
      if (isOnWatchlist(film)) {
        removeFromWatchlist(film);
        showSnack(`${film.title} von Watchlist entfernt`, "danger");
      } else if (addWatch(film)) {
        showSnack(`${film.title} zur Watchlist hinzugefügt`);
      }
      render();
      updateFooter();
      return;
    }
    if (act === "lists") {
      state.listTab = "watch";
      state.search = "";
      state.searchHits = [];
      state.searchStatus = "";
      state.screen = "lists";
      state.expandedFilmId = null;
      render();
      return;
    }
    if (act === "tags") {
      state.tagEditId = null;
      state.tagManageScope = state.listsMode === "videos" ? "video" : "film";
      state.screen = "tags";
      render();
      return;
    }
    if (act === "back") {
      goBack();
      return;
    }
    if (act === "switch" || act === "account-switch") {
      switchToProfiles();
      return;
    }
    if (act === "set-favorite") {
      const film = findFilm(t.dataset.id);
      if (!film) return;
      saveFavorite(film);
      render();
      showSnack(`Lieblingsfilm: ${film.title}`);
      return;
    }
    if (act === "logout") {
      askLogout();
      return;
    }
    if (act === "seen-rate-open") {
      const id = filmId(t.dataset.id);
      state.seenRateFor = state.seenRateFor === id ? "" : id;
      render();
      return;
    }
    if (act === "seen-date-open") {
      openSeenDateSheet(t.dataset.id, t.dataset.scope === "video" ? "video" : "film");
      return;
    }
    if (act === "seen-views-toggle") {
      const id = filmId(t.dataset.id);
      state.seenViewsExpanded[id] = !state.seenViewsExpanded[id];
      render();
      return;
    }
    if (act === "seen-undo-view") {
      const film = findFilm(t.dataset.id);
      const hid = filmId(t.dataset.id);
      const result = removeLatestView(hid);
      if (!result) return;
      if (state.justWatchedId === hid) {
        state.justWatchedId = null;
        state.pinJustWatched = false;
      }
      if (state.expandedFilmId === hid) state.expandedFilmId = null;
      render();
      const label = formatSeenShort(result.removedAt);
      const title = film ? film.title : hid;
      showSnack(`Sichtung vom ${label} entfernt`, "success", {
        undo: () => {
          saveHistory(result.before);
          render();
        },
      });
      return;
    }
    if (act === "rate") {
      setRating(t.dataset.id, t.dataset.n);
      state.seenRateFor = "";
      state.seenVideoRateFor = "";
      const ratedVideo = findVideo(t.dataset.id);
      render();
      if (ratedVideo) showSnack(`${ratedVideo.title} bewertet`);
      return;
    }
    if (act === "richtung") {
      const film = findFilm(t.dataset.id);
      if (film) rememberDirection(film);
      state.sessionBlocked.add(filmId(t.dataset.id));
      await replacePick(t.dataset.id);
      render();
      showSnack("Richtung gemerkt");
      return;
    }
    if (act === "engere") {
      const film = findFilm(t.dataset.id);
      if (!film) return;
      if (!state.shortlist.some((x) => filmId(x) === filmId(film))) state.shortlist.push(film);
      state.sessionBlocked.add(filmId(film));
      await replacePick(film.id);
      render();
      showSnack(`${film.title} ist jetzt in der engeren Auswahl`);
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
        showSnack(`${film.title} zur Watchlist hinzugefügt`);
      }
      return;
    }
    if (act === "film-tag") {
      const map = filmTags();
      const id = String(t.dataset.id);
      const tag = t.dataset.tag;
      const row = customTags().find((r) => r.id === tag);
      if (!row) return;
      const onVideo = isVideoEntityId(id);
      if ((tagScopeOf(row) === "video") !== onVideo) return;
      const have = new Set(map[id] || []);
      if (have.has(tag)) have.delete(tag);
      else have.add(tag);
      map[id] = Array.from(have);
      saveFilmTags(map);
      render();
      return;
    }
    if (act === "film-expand") {
      const hid = filmId(t.dataset.id);
      state.expandedFilmId = state.expandedFilmId === hid ? null : hid;
      closeFilmMenus();
      if (applyListFilmExpand(state.expandedFilmId, hid)) {
        if (state.expandedFilmId) enrichExpandedFilm(state.expandedFilmId);
        return;
      }
      render();
      return;
    }
    if (act === "film-menu") {
      const row = t.closest(".film-row");
      const pop = row ? row.querySelector(".film-menu-pop") : null;
      const willOpen = !!(pop && pop.hidden);
      closeFilmMenus();
      if (pop && willOpen) {
        pop.hidden = false;
        t.setAttribute("aria-expanded", "true");
        placeFilmMenu(t, pop);
      }
      return;
    }
    if (act === "watch-remove") {
      const film = findFilm(t.dataset.id);
      removeFromWatchlist(t.dataset.id);
      render();
      if (film) showSnack(`${film.title} von Watchlist entfernt`, "danger");
      return;
    }
    if (act === "queue-remove") {
      const film = findFilm(t.dataset.id);
      removeQueueId(t.dataset.id);
      render();
      if (film) showSnack(`${film.title} von Demnächst entfernt`, "danger");
      return;
    }
    if (act === "choose") {
      chooseFilm(findFilm(t.dataset.id));
      return;
    }
    if (act === "new-round") {
      resetSessionPicks();
      state.chosen = null;
      state.screen = "discover";
      state.discoverView = "hub";
      render();
      return;
    }
    if (act === "list-tab") {
      dismissWatchSwipeHint();
      state.listTab = t.dataset.id;
      state.expandedFilmId = null;
      state.expandedVideoId = null;
      state.inlineVideoPlayerId = null;
      destroyInlineVideoPlayer();
      state.seenRateFor = "";
      state.seenVideoRateFor = "";
      render();
      return;
    }
    if (act === "toggle-lists-mode") {
      state.listsMode = state.listsMode === "videos" ? "filme" : "videos";
      state.expandedFilmId = null;
      state.expandedVideoId = null;
      state.inlineVideoPlayerId = null;
      destroyInlineVideoPlayer();
      state.seenRateFor = "";
      state.seenVideoRateFor = "";
      state.videoSearchOpen = false;
      state.videoSearch = "";
      render();
      return;
    }
    if (act === "video-add-open") {
      openVideoAddSheet();
      return;
    }
    if (act === "video-save") {
      saveVideoFromForm();
      return;
    }
    if (act === "video-pick-plat") {
      const platId = t.dataset.plat || "";
      state.videoFormPlatId = platId;
      state.videoFormPlat = platLabelFromId(platId);
      state.videoFormCustomPlat = true;
      const platInput = watchSheetEl.querySelector("#video-plat");
      if (platInput) platInput.value = state.videoFormPlat;
      watchSheetEl.querySelectorAll(".video-plat-chip").forEach((chip) => {
        chip.setAttribute("aria-pressed", chip.dataset.plat === platId ? "true" : "false");
      });
      return;
    }
    if (act === "video-expand") {
      const hid = String(t.dataset.id || "");
      const closing = state.expandedVideoId === hid;
      if (closing) {
        if (state.inlineVideoPlayerId === hid) {
          state.inlineVideoPlayerId = null;
          destroyInlineVideoPlayer();
        }
      } else if (state.inlineVideoPlayerId && state.inlineVideoPlayerId !== hid) {
        state.inlineVideoPlayerId = null;
        destroyInlineVideoPlayer();
      }
      state.expandedVideoId = closing ? null : hid;
      render();
      return;
    }
    if (act === "video-edit-open") {
      openVideoEditSheet(t.dataset.id);
      return;
    }
    if (act === "video-inline-open") {
      const hid = String(t.dataset.id || "");
      const video = findVideo(hid);
      if (video) snackVideoWatched(video, { inline: true });
      state.inlineVideoPlayerId = hid;
      render();
      return;
    }
    if (act === "video-inline-close") {
      state.inlineVideoPlayerId = null;
      destroyInlineVideoPlayer();
      render();
      return;
    }
    if (act === "video-confirm") {
      openVideoConfirmDialog(t.dataset.id);
      return;
    }
    if (act === "video-open-direct") {
      const video = findVideo(t.dataset.id);
      if (!video || !video.url) return;
      try {
        window.open(video.url, "_blank", "noopener,noreferrer");
      } catch { /* ignore */ }
      return;
    }
    if (act === "video-search-toggle") {
      state.videoSearchOpen = !state.videoSearchOpen;
      if (!state.videoSearchOpen) state.videoSearch = "";
      render();
      return;
    }
    if (act === "video-search-clear") {
      state.videoSearch = "";
      render();
      return;
    }
    if (act === "video-zufall") {
      const pool = state.listTab === "queue" ? videoQueue() : videoWatchlist();
      if (!pool.length) return;
      const pick = pool[Math.floor(Math.random() * pool.length)];
      state.expandedVideoId = String(pick.id);
      render();
      showSnack(`Zufall: ${pick.title}`);
      return;
    }
    if (act === "video-seen-unrated") {
      state.seenOnlyUnrated = true;
      render();
      return;
    }
    if (act === "video-seen-all") {
      state.seenOnlyUnrated = false;
      render();
      return;
    }
    if (act === "video-seen-rate-open") {
      const hid = String(t.dataset.id || "");
      state.seenVideoRateFor = state.seenVideoRateFor === hid ? "" : hid;
      render();
      return;
    }
    if (act === "video-seen-undo") {
      const video = findVideo(t.dataset.id);
      const hid = String(t.dataset.id || "");
      const result = removeLatestVideoView(hid);
      if (!result) return;
      state.seenVideoRateFor = "";
      render();
      const label = formatSeenShort(result.removedAt);
      const title = video ? video.title : hid;
      showSnack(`Sichtung vom ${label} entfernt`, "success", {
        undo: () => {
          saveVideoHistory(result.before);
          render();
        },
      });
      return;
    }
    if (act === "search-clear") {
      state.search = "";
      state.searchHits = [];
      state.searchStatus = "";
      window.clearTimeout(searchTimer);
      searchSeq += 1;
      resetWatchSheetPage();
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
    if (act === "tag-add-open") {
      if (state.listsMode === "videos" || state.screen === "tags" && activeTagManageScope() === "video") {
        state.tagManageScope = "video";
      } else if (state.screen !== "tags") {
        state.tagManageScope = "film";
      }
      openAddTagModal();
      return;
    }
    if (act === "tag-add-save") {
      saveNewTag();
      return;
    }
    if (act === "tag-edit-open") {
      const tag = customTags().find((x) => x.id === t.dataset.id);
      if (!tag) return;
      state.tagManageScope = tagScopeOf(tag);
      openTagEditor(tag);
      return;
    }
    if (act === "tag-edit-close") {
      resetTagEditor();
      state.screen = "tags";
      render();
      return;
    }
    if (act === "tag-edit-save") {
      saveEditedTag();
      return;
    }
    if (act === "tag-pick-plate") {
      state.editTagPlate = normalizeTagPlate(t.dataset.id);
      render();
      return;
    }
    if (act === "tag-pick-cover") {
      const cover = tagStarterCovers().concat(tagCovers()).find((row) => row.id === t.dataset.id);
      if (cover) state.editTagCover = cover;
      render();
      return;
    }
    if (act === "tag-cover-add") {
      state.tagCoverSheet = !state.tagCoverSheet;
      if (!state.tagCoverSheet) {
        state.tagCoverCandidate = null;
        state.coverQuery = "";
        state.coverHits = [];
        state.coverStatus = "";
      }
      render();
      return;
    }
    if (act === "tag-cover-cancel") {
      state.tagCoverSheet = false;
      state.tagCoverCandidate = null;
      state.coverQuery = "";
      state.coverHits = [];
      state.coverStatus = "";
      render();
      return;
    }
    if (act === "tag-cover-commit") {
      commitTagCover();
      return;
    }
    if (act === "tag-cover-candidate") {
      const fromHit = (state.coverHits || []).map(coverFromFilm).find((row) => row && row.id === t.dataset.id);
      const fromWatch = watchCoversForTagAdd().find((row) => row.id === t.dataset.id);
      const cover = fromHit || fromWatch;
      if (!cover) return;
      state.tagCoverCandidate = cover;
      const box = app.querySelector("[data-role=tag-cover-hits]");
      if (box) box.innerHTML = tagCoverHitsHtml();
      return;
    }
    if (act === "tag-jump") {
      jumpToExactTag(t.dataset.id);
      return;
    }
    if (act === "ask-delete-tag") {
      askDeleteTag(t.dataset.id);
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
    if (event.key === "Enter" && act === "edit-tag-name") {
      event.preventDefault();
      saveEditedTag();
    }
  });

  app.addEventListener("blur", (event) => {
    const t = event.target;
    if (!t || !t.dataset || t.dataset.act !== "login-name") return;
    state.loginName = t.value;
    validateLoginNameBlur();
  }, true);

  app.addEventListener("input", (event) => {
    const t = event.target;
    const act = t.dataset.act;
    if (act === "login-name") {
      state.loginName = t.value;
      if (state.loginError) {
        state.loginError = "";
        paintLoginError();
      }
    }
    if (act === "login-pass") state.loginPass = t.value;
    if (act === "add-name") {
      state.addName = t.value;
      paintProfileLetters();
    }
    if (act === "cover-search") {
      state.coverQuery = t.value;
      scheduleCoverSearch(t.value);
    }
    if (act === "tag-name") state.newTagName = t.value.slice(0, 10);
    if (act === "edit-tag-name") {
      state.editTagName = t.value.slice(0, 10);
      paintTagDraftLetters();
    }
    if (act === "tag-cover-search") {
      state.coverQuery = t.value;
      scheduleCoverSearch(t.value);
    }
    if (act === "spectrum-hue" || act === "spectrum-sat") onSpectrumInput(t);
    if (act === "search") {
      state.search = t.value;
      scheduleTitleSearch(t.value);
    }
    if (act === "watch-search") {
      state.watchSearch = t.value;
      scheduleTitleSearch(t.value);
    }
    handleFilterFieldInput(t);
  });

  function handleFilterFieldInput(t) {
    if (!t || !t.dataset) return;
    const act = t.dataset.act;
    if (act === "dauer") {
      const ctx = filterCtxFrom(t);
      const bag = filtersBagForCtx(ctx);
      bag.dauer = Number(t.value);
      bag.dauerOn = true;
      t.style.setProperty("--fill", `${dauerFill(bag.dauer)}%`);
      t.classList.remove("idle");
      const value = t.parentElement.querySelector("[data-role=dauer-value]");
      if (value) value.textContent = dauerLabel(bag.dauer);
      if (ctx === "zufall") paintZufallFilterSheet();
      else paintDiscoverActiveChips();
      return;
    }
    if (act === "actor-search") {
      state.actorQuery = t.value;
      scheduleActorSearch(t.value);
    }
  }

  headerActions.addEventListener("click", (event) => {
    const t = event.target.closest("[data-act]");
    if (!t) return;
    if (t.dataset.act === "back") goBack();
    if (t.dataset.act === "tag-edit-save") saveEditedTag();
    if (t.dataset.act === "switch" || t.dataset.act === "account-switch") switchToProfiles();
    if (t.dataset.act === "account-menu") toggleAccountMenu();
    if (t.dataset.act === "account-settings") {
      openSettingsScreen();
    }
    if (t.dataset.act === "account-logout" || t.dataset.act === "logout") {
      closeAccountMenu();
      askLogout();
    }
  });

  modalEl.addEventListener("input", (event) => {
    const t = event.target;
    const act = t && t.dataset ? t.dataset.act : "";
    if (act === "tag-name") state.newTagName = t.value.slice(0, 10);
    if (act === "spectrum-hue" || act === "spectrum-sat") onSpectrumInput(t);
    if (act === "seen-date-input") syncSeenDateSaveDisabled();
    if (act === "seen-frac-custom") {
      const raw = String(t.value || "").replace(/\D/g, "").slice(0, 2);
      t.value = raw;
      const n = Number(raw);
      if (raw === "100") {
        state.seenSheetFrac = { kind: "preset", f: 1, customPct: "", lastPreset: 1 };
      } else if (raw && Number.isFinite(n) && n >= 1 && n <= 99) {
        state.seenSheetFrac = Object.assign({}, state.seenSheetFrac, { kind: "custom", customPct: raw, f: n / 100 });
      } else {
        state.seenSheetFrac = Object.assign({}, state.seenSheetFrac, { kind: "custom", customPct: raw });
      }
      syncSeenFracUI();
    }
  });

  modalEl.addEventListener("focusin", (event) => {
    const t = event.target;
    if (!t || !t.dataset || t.dataset.act !== "seen-frac-custom") return;
    state.seenSheetFrac = Object.assign({}, state.seenSheetFrac, { kind: "custom" });
    syncSeenFracUI();
  });

  modalEl.addEventListener("focusout", (event) => {
    const t = event.target;
    if (!t || !t.dataset || t.dataset.act !== "seen-frac-custom") return;
    const st = state.seenSheetFrac;
    if (!st || st.kind !== "custom") return;
    const raw = String(st.customPct || "").trim();
    if (!raw) {
      const back = st.lastPreset != null ? st.lastPreset : 1;
      state.seenSheetFrac = { kind: "preset", f: back, customPct: "", lastPreset: back };
      syncSeenFracUI();
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
    if (t.dataset.act === "video-confirm-cancel") {
      closeModal();
      return;
    }
    if (t.dataset.act === "video-confirm-open") {
      launchVideo(findVideo(t.dataset.id));
      return;
    }
    if (t.dataset.act === "seen-date-cancel") {
      closeModal();
      return;
    }
    if (t.dataset.act === "seen-date-save") {
      commitSeenDateSave(t.dataset.id, t.dataset.scope);
      return;
    }
    if (t.dataset.act === "seen-date-pick") {
      const input = modalEl.querySelector("[data-act=seen-date-input]");
      if (!input) return;
      const offset = Number(t.dataset.offset);
      if (!Number.isFinite(offset)) return;
      const d = new Date();
      d.setHours(12, 0, 0, 0);
      d.setDate(d.getDate() - offset);
      input.value = dateInputValueFromTs(d.getTime());
      syncSeenDateSaveDisabled();
      return;
    }
    if (t.dataset.act === "seen-frac-pick") {
      const f = Number(t.dataset.frac);
      if (!Number.isFinite(f)) return;
      state.seenSheetFrac = { kind: "preset", f, customPct: "", lastPreset: f };
      syncSeenFracUI();
      return;
    }
    const fracCustomWrap = t.closest("[data-act=seen-frac-custom-focus]");
    if (fracCustomWrap) {
      const input = fracCustomWrap.querySelector("[data-act=seen-frac-custom]") || modalEl.querySelector("[data-act=seen-frac-custom]");
      state.seenSheetFrac = Object.assign({}, state.seenSheetFrac, { kind: "custom" });
      syncSeenFracUI();
      if (input) input.focus();
      return;
    }
    if (t.dataset.act === "settings-sync-confirm") {
      confirmEnableCloudSync();
      return;
    }
    if (t.dataset.act === "delete-profile") {
      const input = modalEl.querySelector("[data-act=del-pass]");
      const value = input ? input.value : "";
      const localPass = state.user && state.user.password;
      if (localPass !== undefined && localPass !== null && value !== localPass) {
        const hint = modalEl.querySelector(".hint");
        if (hint) hint.textContent = "Passwort stimmt nicht.";
        return;
      }
      if ((localPass === undefined || localPass === null) && state.user && state.user.cloud) {
        // Cloud accounts no longer keep a local plaintext password; require a non-empty confirmation.
        if (!value) {
          const hint = modalEl.querySelector(".hint");
          if (hint) hint.textContent = "Passwort eingeben.";
          return;
        }
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
    if (t.dataset.act === "tag-add-save") {
      saveNewTag();
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
      if (state.tagEditId === id || state.screen === "tag-edit") {
        resetTagEditor();
        state.screen = "tags";
      }
      closeModal();
      render();
      return;
    }
    if (t.dataset.act === "confirm-logout") {
      doLogout();
      return;
    }
    if (t.dataset.act === "swipe-remove") {
      const mode = pendingSwipeRemove && pendingSwipeRemove.mode;
      const pendingId = pendingSwipeRemove && pendingSwipeRemove.id;
      pendingSwipeRemove = null;
      closeModal();
      const film = findFilm(t.dataset.id || pendingId);
      const video = !film ? findVideo(t.dataset.id || pendingId) : null;
      if (video) {
        if (mode === "queue") removeVideoQueueId(video.id);
        else removeVideoFromWatchlist(video.id);
        render();
        showSnack(`${video.title} von Liste entfernt`, "danger");
        return;
      }
      if (!film) return;
      if (mode === "queue") {
        removeQueueId(filmId(film));
        render();
        showSnack(`${film.title} von Demnächst entfernt`, "danger");
      } else {
        removeFromWatchlist(film);
        render();
        showSnack(`${film.title} von Watchlist entfernt`, "danger");
      }
      return;
    }
    if (t.dataset.act === "clear-filters") {
      clearAllFilters();
      closeModal();
      render();
    }
  });

  footer.addEventListener("click", async (event) => {
    const btn = event.target.closest("[data-nav]");
    if (!btn || !state.profile) return;
    const nav = btn.dataset.nav;
    if (nav === "zufall") {
      openZufallSheet();
      updateFooter();
      return;
    }
    if (nav === "entdecken") {
      closeWatchSheet();
      state.screen = "discover";
      state.discoverView = "hub";
      state.expandedFilmId = null;
      render();
      return;
    }
    if (nav === "lists") {
      closeWatchSheet();
      state.listTab = "watch";
      state.search = "";
      state.searchHits = [];
      state.searchStatus = "";
      state.screen = "lists";
      state.expandedFilmId = null;
      render();
      return;
    }
  });

  let lastTouchY = null;
  let swipeDrag = null;
  let swipeIgnoreClick = false;

  function swipeFront(row) {
    return row.querySelector(".swipe-front") || row;
  }

  function resetSwipeRow(row) {
    if (!row) return;
    const front = swipeFront(row);
    front.style.transition = "transform 0.18s ease";
    front.style.transform = "";
    window.setTimeout(() => {
      if (front) front.style.transition = "";
    }, 200);
  }

  function dismissSuggestRow(row, film) {
    const id = filmId(film);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finish = () => {
      state.sessionSkip.add(id);
      state.currentPicks = state.currentPicks.filter((item) => filmId(item) !== id);
      if (state.expandedFilmId === id) state.expandedFilmId = null;
      refillSuggestionStack();
      if (state.screen === "discover" && state.discoverView === "results") {
        render();
        enrichPicks();
      }
    };
    if (reduce) {
      finish();
      return;
    }
    const front = swipeFront(row);
    front.classList.add("is-dismissing");
    front.style.transition = "transform 0.24s ease, opacity 0.24s ease";
    front.style.transform = "translateX(-120%)";
    front.style.opacity = "0";
    window.setTimeout(finish, 240);
  }

  function commitSwipe(row, dir) {
    const mode = row.dataset.swipeMode;
    const film = findFilm(row.dataset.id);
    const video = !film ? findVideo(row.dataset.id) : null;
    if ((!film && !video) || !mode) {
      resetSwipeRow(row);
      return;
    }
    if (video) {
      resetSwipeRow(row);
      if (dir === "right" && mode === "watch") {
        if (!addVideoQueue(video)) showSnack("Bereits in Demnächst enthalten", "info");
        else showSnack(`${video.title} → Demnächst`);
        render();
        return;
      }
      if (dir === "left" && (mode === "watch" || mode === "queue")) {
        pendingSwipeRemove = { id: String(video.id), mode, kind: "video" };
        openConfirm({
          title: "Wirklich aus Liste entfernen?",
          confirmLabel: "Entfernen",
          confirmAct: "swipe-remove",
          id: String(video.id),
          danger: true,
          center: true,
        });
      }
      return;
    }
    if (mode === "suggest" && dir === "left") {
      dismissSuggestRow(row, film);
      return;
    }
    resetSwipeRow(row);
    if (dir === "right") {
      if (mode === "suggest") {
        const watched = addWatch(film);
        const queued = addQueue(film);
        if (watched || queued) showSnack("Zu Watchlist und Demnächst hinzugefügt");
        else showSnack("Bereits in Watchlist und Demnächst", "info");
        updateFooter();
        if (state.expandedFilmId === filmId(film)) render();
        return;
      }
      if (mode === "watch") {
        if (!addQueue(film)) {
          showSnack("Bereits in Demnächst enthalten", "info");
          return;
        }
        showSnack(`${film.title} → Demnächst`);
        paintZufallChip();
        updateFooter();
        return;
      }
      if (mode === "search") {
        addWatch(film);
        addQueue(film);
        paintWatchToggles();
        refreshWatchList();
        if (state.watchSheet) paintWatchSheetList();
        showSnack("Zu Watchlist und Demnächst hinzugefügt");
        updateFooter();
      }
      return;
    }
    if (dir === "left" && (mode === "watch" || mode === "queue")) {
      pendingSwipeRemove = { id: filmId(film), mode };
      openConfirm({
        title: "Wirklich aus Liste entfernen?",
        confirmLabel: "Entfernen",
        confirmAct: "swipe-remove",
        id: filmId(film),
        danger: true,
        center: true,
      });
    }
  }

  function beginRowSwipe(event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dismissWatchSwipeHint();
    const row = event.target.closest("[data-swipe-row]");
    if (!row || !row.dataset.swipeMode) return;
    if (event.target.closest("[data-act=film-menu], .film-menu-pop, [data-act=watch-toggle], .film-row-expand, [data-act=rate], [data-act=film-tag], [data-act=choose], .suggest-inline-watch, [data-act=video-confirm], [data-act=video-expand], [data-act=video-inline-open], [data-act=video-inline-close], [data-act=video-edit-open], .v-anschauen, .video-expand-actions, .video-inline-wrap, .seen-rate-bubble, [data-act=video-seen-rate-open], [data-act=video-seen-undo]")) return;
    if (event.target.closest(".film-row.is-open")) return;
    if (swipeDrag) return;
    swipeDrag = {
      id: event.pointerId,
      row,
      x: event.clientX,
      y: event.clientY,
      dx: 0,
      moved: false,
    };
    if (row.setPointerCapture) {
      try { row.setPointerCapture(event.pointerId); } catch { /* ignore */ }
    }
  }

  function moveRowSwipe(event) {
    if (!swipeDrag || event.pointerId !== swipeDrag.id) return;
    const dx = event.clientX - swipeDrag.x;
    const dy = event.clientY - swipeDrag.y;
    if (!swipeDrag.moved) {
      if (Math.abs(dx) < 8) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        swipeDrag = null;
        return;
      }
      swipeDrag.moved = true;
      closeFilmMenus();
    }
    swipeDrag.dx = dx;
    const mode = swipeDrag.row.dataset.swipeMode;
    let x = dx;
    if (x > 0 && mode !== "watch" && mode !== "search" && mode !== "suggest") x = 0;
    if (x < 0 && mode !== "watch" && mode !== "queue" && mode !== "suggest") x = 0;
    x = Math.max(-96, Math.min(96, x));
    const front = swipeFront(swipeDrag.row);
    front.style.transition = "none";
    front.style.transform = `translateX(${x}px)`;
    if (event.cancelable) event.preventDefault();
  }

  function endRowSwipe(event) {
    if (!swipeDrag || (event && event.pointerId != null && event.pointerId !== swipeDrag.id)) return;
    const { row, dx, moved } = swipeDrag;
    swipeDrag = null;
    if (!moved) {
      resetSwipeRow(row);
      return;
    }
    swipeIgnoreClick = true;
    window.setTimeout(() => { swipeIgnoreClick = false; }, 320);
    if (dx > 56) commitSwipe(row, "right");
    else if (dx < -56) commitSwipe(row, "left");
    else resetSwipeRow(row);
  }

  function listAtEdge(list) {
    if (!list) return false;
    if (list.scrollTop <= 2) return true;
    return list.scrollTop + list.clientHeight >= list.scrollHeight - 2;
  }

  function revealListsFooterSoon() {
    window.clearTimeout(listsFooterTimer);
    listsFooterTimer = window.setTimeout(() => {
      if (state.screen !== "lists" || isDesktopNav() || !state.profile || footer.hidden) return;
      setPhoneFooterOpen(true);
    }, 180);
  }

  function onScrollDir(delta, scroller) {
    if (!state.profile || footer.hidden || isDesktopNav() || phoneFooterLocked) return;
    if (state.screen === "lists") {
      const list = scroller || app.querySelector("[data-role=film-list]");
      if (listAtEdge(list) || delta < -6) setPhoneFooterOpen(true);
      else if (delta > 6) setPhoneFooterOpen(false);
      revealListsFooterSoon();
      return;
    }
    if (delta < -6) setPhoneFooterOpen(true);
    else if (delta > 6) setPhoneFooterOpen(false);
  }

  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    onScrollDir(y - lastScrollY);
    lastScrollY = y;
    placeAccountMenu();
  }, { passive: true });

  window.addEventListener("resize", () => {
    placeAccountMenu();
  });

  document.addEventListener("click", (event) => {
    const pop = headerActions.querySelector(".acct-menu");
    if (!pop || pop.hidden) return;
    if (event.target.closest(".acct-menu, [data-act=account-menu]")) return;
    closeAccountMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!modalEl.hidden) return;
    if (state.watchSheet) {
      event.preventDefault();
      dismissWatchSheet();
      return;
    }
    closeAccountMenu();
  });

  window.addEventListener("touchstart", (event) => {
    lastTouchY = event.touches[0] ? event.touches[0].clientY : null;
  }, { passive: true });

  window.addEventListener("touchmove", (event) => {
    if (lastTouchY == null || !event.touches[0]) return;
    if (footer.contains(event.target)) return;
    const y = event.touches[0].clientY;
    const list = state.screen === "lists" ? app.querySelector("[data-role=film-list]") : null;
    onScrollDir(lastTouchY - y, list);
    lastTouchY = y;
  }, { passive: true });

  document.addEventListener("pointerdown", beginRowSwipe);
  document.addEventListener("pointermove", moveRowSwipe, { passive: false });
  document.addEventListener("pointerup", endRowSwipe);
  document.addEventListener("pointercancel", endRowSwipe);
  document.addEventListener("click", (event) => {
    if (!swipeIgnoreClick) return;
    if (!event.target.closest("[data-swipe-row]")) return;
    event.preventDefault();
    event.stopPropagation();
  }, true);

  watchSheetEl.addEventListener("click", (event) => {
    handleWatchUiClick(event);
  });

  snackbar.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-act=snack-undo]");
    if (!btn || snackbar.hidden || !showSnack.undoFn) return;
    const fn = showSnack.undoFn;
    hideSnack();
    fn();
  });

  watchSheetEl.addEventListener("input", (event) => {
    const t = event.target;
    if (!t) return;
    if (t.id === "video-url") {
      state.videoFormUrl = t.value;
      const detected = detectPlatform(t.value);
      if (!state.videoFormCustomPlat) {
        state.videoFormPlatId = detected.id !== "generic" ? detected.id : "";
        state.videoFormPlat = state.videoFormPlatId ? platLabelFromId(state.videoFormPlatId) : "";
        const platInput = watchSheetEl.querySelector("#video-plat");
        if (platInput) platInput.value = state.videoFormPlat;
        watchSheetEl.querySelectorAll(".video-plat-chip").forEach((chip) => {
          const p = chip.dataset.plat || "";
          chip.setAttribute("aria-pressed", p === state.videoFormPlatId ? "true" : "false");
        });
      }
      const hint = watchSheetEl.querySelector(".video-plat-detect-hint");
      if (hint && state.videoFormEditId) {
        const embed = embedInfo(t.value);
        const platLabel = platLabelFromId(state.videoFormPlatId) || detected.label || "Web";
        hint.textContent = embed.kind !== "none"
          ? `✓ Aus dem Link erkannt: ${platLabel} – auch „hier anschauen“ möglich`
          : `✓ Aus dem Link erkannt: ${platLabel}`;
      }
    }
    if (t.id === "video-title") {
      state.videoFormTitle = t.value;
    }
    if (t.id === "video-desc") {
      state.videoFormDesc = t.value;
    }
    if (t.id === "video-plat") {
      state.videoFormPlat = t.value;
      state.videoFormCustomPlat = !!t.value.trim();
      const lower = t.value.trim().toLowerCase();
      if (!lower) state.videoFormPlatId = "";
      else if (lower.includes("youtube")) state.videoFormPlatId = "yt";
      else if (lower.includes("instagram")) state.videoFormPlatId = "ig";
      else if (lower.includes("facebook")) state.videoFormPlatId = "fb";
      else state.videoFormPlatId = "generic";
      watchSheetEl.querySelectorAll(".video-plat-chip").forEach((chip) => {
        const p = chip.dataset.plat || "";
        chip.setAttribute("aria-pressed", p === state.videoFormPlatId ? "true" : "false");
      });
    }
    if (t.dataset && t.dataset.act === "video-search-input") {
      state.videoSearch = t.value;
      render();
      return;
    }
    if (!t.dataset) return;
    if (t.dataset.act === "watch-search") {
      state.watchSearch = t.value;
      scheduleTitleSearch(t.value);
    }
    if (t.dataset.act === "similar-search") {
      state.similarQuery = t.value;
      const wrap = t.closest(".sheet-search-wrap");
      if (wrap) wrap.classList.toggle("is-active", !!t.value.trim() || (state.similarDraft || []).length > 0);
      scheduleSimilarSearch(t.value);
    }
    handleFilterFieldInput(t);
  });

  let sheetDrag = null;

  function sheetEventPoint(event) {
    const touch = (event.touches && event.touches[0]) || (event.changedTouches && event.changedTouches[0]);
    if (touch) return { x: touch.clientX, y: touch.clientY };
    return { x: event.clientX, y: event.clientY };
  }

  function sheetDragBlocked(event) {
    if (!state.watchSheet || !watchSheetEl || watchSheetEl.hidden) return true;
    if (event.target.closest("[data-act=watch-sheet-close]")) return true;
    if (event.target.closest("[data-role=sheet-drag]")) return false;
    if (state.watchSheet === "search" && event.target.closest("[data-act=watch-search], .sheet-search-wrap")) return false;
    if (event.target.closest("button, a, input, [data-role=zufall-carousel], [data-act=watch-toggle], [data-act=watch-cat], [data-act=watch-search-open], [data-act=watch-search-goto], [data-act=search-ctx-tag], [data-act=search-ctx-rate], [data-act=watch-more], [data-role=watch-more], [data-swipe-row], [data-act=zufall-source], [data-act=zufall-more], [data-act=zufall-filter-open], [data-act=zufall-filter-back], [data-act=zufall-filter-apply], [data-act=zufall-filter-reset], [data-act=zufall-filter-clear-all], [data-act=zufall-filter-chip-remove], [data-role=zufall-filter-zone], .zufall-filter-sheet")) return true;
    const list = event.target.closest("[data-role=watch-sheet-list], [data-role=similar-list]");
    if (list && list.scrollTop > 2) return true;
    return false;
  }

  function unbindSheetDragWindow() {
    window.removeEventListener("pointermove", onSheetPointerMove);
    window.removeEventListener("pointerup", onSheetPointerUp);
    window.removeEventListener("pointercancel", onSheetPointerUp);
    window.removeEventListener("touchmove", onSheetTouchMove);
    window.removeEventListener("touchend", onSheetTouchEnd);
    window.removeEventListener("touchcancel", onSheetTouchEnd);
  }

  function bindSheetDragWindow() {
    window.addEventListener("pointermove", onSheetPointerMove, { passive: false });
    window.addEventListener("pointerup", onSheetPointerUp);
    window.addEventListener("pointercancel", onSheetPointerUp);
    window.addEventListener("touchmove", onSheetTouchMove, { passive: false });
    window.addEventListener("touchend", onSheetTouchEnd);
    window.addEventListener("touchcancel", onSheetTouchEnd);
  }

  function beginSheetDrag(event) {
    if (event.button && event.button !== 0) return;
    if (sheetDrag) {
      if (event.pointerId != null) sheetDrag.id = event.pointerId;
      return;
    }
    if (sheetDragBlocked(event)) return;
    if (!event.target.closest("[data-role=sheet-panel]")) return;
    const panel = watchSheetEl.querySelector("[data-role=sheet-panel]");
    if (!panel) return;
    const pt = sheetEventPoint(event);
    const now = performance.now();
    sheetDrag = {
      id: event.pointerId,
      startX: pt.x,
      startY: pt.y,
      lastY: pt.y,
      lastT: now,
      velocity: 0,
      panel,
      dragging: false,
    };
    bindSheetDragWindow();
  }

  function moveSheetDrag(event) {
    if (!sheetDrag) return;
    if (event.pointerId != null && sheetDrag.id != null && event.pointerId !== sheetDrag.id) return;
    const pt = sheetEventPoint(event);
    const dy = pt.y - sheetDrag.startY;
    const dx = pt.x - sheetDrag.startX;
    const now = performance.now();
    const dt = now - sheetDrag.lastT;
    if (dt > 0 && dt < 80) {
      const instant = (pt.y - sheetDrag.lastY) / dt;
      sheetDrag.velocity = sheetDrag.velocity * 0.45 + instant * 0.55;
    }
    sheetDrag.lastY = pt.y;
    sheetDrag.lastT = now;
    if (!sheetDrag.dragging) {
      if (Math.abs(dy) < 12) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        finishSheetDrag(0, false, 0);
        return;
      }
      sheetDrag.dragging = true;
      const active = document.activeElement;
      if (active && watchSheetEl.contains(active) && typeof active.blur === "function") active.blur();
    }
    const y = dy >= 0 ? dy : dy * 0.34;
    sheetDrag.panel.style.transition = "none";
    sheetDrag.panel.style.transform = `translateY(${y}px)`;
    if (event.cancelable) event.preventDefault();
  }

  function finishSheetDrag(dy, dragging, velocity) {
    const panel = sheetDrag && sheetDrag.panel;
    sheetDrag = null;
    unbindSheetDragWindow();
    if (!panel) return;
    const fling = dragging && velocity > 0.55 && dy > 18;
    if (!dragging || (dy <= 72 && !fling)) {
      panel.style.transition = "transform 0.2s ease";
      panel.style.transform = "translateY(0)";
      window.setTimeout(() => {
        panel.style.transition = "";
        panel.style.transform = "";
      }, 200);
      return;
    }
    dismissWatchSheet();
  }

  function endSheetDrag(event) {
    if (!sheetDrag) return;
    if (event && event.pointerId != null && sheetDrag.id != null && event.pointerId !== sheetDrag.id) return;
    const pt = event ? sheetEventPoint(event) : { y: sheetDrag.startY };
    const dy = pt.y - sheetDrag.startY;
    const dragging = sheetDrag.dragging;
    const velocity = sheetDrag.velocity || 0;
    finishSheetDrag(dy, dragging, velocity);
  }

  function onSheetPointerMove(event) {
    moveSheetDrag(event);
  }

  function onSheetPointerUp(event) {
    endSheetDrag(event);
  }

  function onSheetTouchMove(event) {
    moveSheetDrag(event);
  }

  function onSheetTouchEnd(event) {
    endSheetDrag(event);
  }

  watchSheetEl.addEventListener("pointerdown", beginSheetDrag);
  watchSheetEl.addEventListener("touchstart", beginSheetDrag, { passive: true });

  desktopNavMq.addEventListener("change", () => {
    scheduleFooterSync({ reset: !isDesktopNav() });
  });

  window.addEventListener("resize", () => {
    scheduleFooterSync();
    paintChipOverflow();
    if (state.watchSheet) syncWatchSheetTop();
  });

  app.addEventListener("pointerdown", (event) => {
    const hero = event.target.closest(".suggest-hero");
    if (hero && !hero.classList.contains("discover-hero") && state.filtersOpen && !event.target.closest("[data-act=toggle-filters]")) {
      state.shinePaused = true;
      hero.classList.remove("is-shining");
      hero.classList.add("is-paused");
    }
  });

    seedIfNeeded();
  state.cloudSyncOn = cloudSyncAvailable() && loadCloudPref();
  restoreSession();
  bindCloudLifecycle();
  if (state.user && loadCloudSession()) {
    if (!isNetworkOnline() || hasPendingSync(state.user.id)) {
      state.cloudStatus = !isNetworkOnline() ? "offline" : "syncing";
    } else {
      state.cloudStatus = "ok";
    }
  }
  ensureLoginPostersPreloaded();
  render();
  scheduleCatalogLoad();
  if (state.user && loadCloudSession()) {
    afterCloudAuth(state.user).then(() => {
      if (state.profile) loadCatalog();
      render();
    });
  }

  window.CinexTmdb = {
    url: tmdbUrl,
    movie: fromTmdbMovie,
    key: tmdbKey,
    proxy: searchProxyBase,
    titleSearchThin: localTitleSearchIsThin,
    actorSearchThin: localActorSearchIsThin,
  };

  const cinexTestExpose = typeof location !== "undefined" && /(?:\?|&)cinex_test=1/.test(location.search);
  if (cinexTestExpose) {
    window.__CINEX_TEST__ = {
      parseViewsList,
      compactViewsList,
      historyViews,
      historyViewsDetailed,
      viewAtOf,
      viewFractionOf,
      mergeProfileBags,
      mergeKnownMaps,
      normalizeKnownMap,
      watchlistFilms,
      listFilmsFromRows,
      listFilmOrPlaceholder,
      filmListResolved,
      findFilm,
      rememberFilm,
      persistKnownFilms,
      loadKnownFilms,
      queueFilmHydration,
      hydrateMissingListFilms,
      canonicalListFilmId,
      searchProxyBase,
      getListHydrateStats() {
        return {
          queued: listHydrateQueue.length,
          inflight: listHydrateInflight.size,
          persistBatch: listHydratePersistBatch.length,
          active: listHydrateActive,
        };
      },
      getSyncPushDebounceMs() {
        return SYNC_PUSH_DEBOUNCE_MS;
      },
      TAG_SCOPE_MIGRATION_VERSION,
      isVideoEntityId,
      tagScopeOf,
      migrateTagsScopeForStorage,
      profileStoragePrefix,
    };
  }
})();
