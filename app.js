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

  const liveDetailTried = new Set();

  function needsLiveDetails(film) {
    if (!film || !remoteSearchAvailable()) return false;
    const tmdb = Number(film.tmdb);
    if (!Number.isFinite(tmdb) || tmdb <= 0) return false;
    if (Number(film.minutes || film.runtime) > 0) return false;
    const id = filmId(film);
    if ((offlineFilms || []).some((row) => filmId(row) === id)) return false;
    return true;
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

  function scheduleLiveDetails(film) {
    if (!needsLiveDetails(film)) return;
    const id = filmId(film);
    if (!id || liveDetailTried.has(id)) return;
    liveDetailTried.add(id);
    const tmdb = Number(film.tmdb);
    proxyFetch(`/movie/${tmdb}`, { append_to_response: "credits" }).then((data) => {
      const next = fromTmdbMovie(data);
      if (!next) return;
      const names = ((data && data.credits && data.credits.cast) || [])
        .slice()
        .sort((a, b) => (Number(a.order) || 99) - (Number(b.order) || 99))
        .map((row) => String((row && (row.name || row.original_name)) || "").trim())
        .filter(Boolean)
        .slice(0, 4);
      if (names.length) next.cast = names;
      if (!applyLiveFilm(next)) return;
      if (state.watchSheet) paintWatchSheetList();
      if (state.screen === "lists") refreshWatchList();
      else if (state.screen === "done") render();
    }).catch(() => {
      /* Search hit already has title and poster. */
    });
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
    person: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="8.1" r="3.1"/><path d="M5.4 19.2c.9-3.3 3.3-5.1 6.6-5.1s5.7 1.8 6.6 5.1"/></svg>`,
    lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="6" y="10.2" width="12" height="9.3" rx="2"/><path d="M8.2 10.2V8.1a3.8 3.8 0 0 1 7.6 0v2.1"/></svg>`,
    eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2.7 12S6.1 6.6 12 6.6 21.3 12 21.3 12 17.9 17.4 12 17.4 2.7 12 2.7 12z"/><circle cx="12" cy="12" r="2.35"/></svg>`,
    eyeOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 5.1 19.4 20.5"/><path d="M10.1 10.4a2.35 2.35 0 0 0 3.4 3.3"/><path d="M7.1 7.6C5 8.9 3.4 11.1 2.7 12c0 0 3.4 5.4 9.3 5.4 1.6 0 3-.3 4.2-.8"/><path d="M16.8 16.1c1.8-1.2 3.2-3 3.8-4.1 0 0-1.6-2.6-4.5-4.2"/></svg>`,
    menu: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5.5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="18.5" cy="12" r="1.7"/></svg>`,
    chevron: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`,
    chevronUp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg>`,
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
    catalog: [],
    filtersOpen: false,
    discoverView: "hub",
    discoverCat: "",
    filters: { dauerOn: false, dauer: 120, genres: [], tags: [], streaming: [], types: [], actors: [] },
    actorQuery: "",
    actorHits: [],
    actorStatus: "",
    filterMore: { genre: false, tags: false, streaming: false, types: false, zufall: false },
    shinePaused: false,
    currentPicks: [],
    shortlist: [],
    sessionBlocked: new Set(),
    sessionSkip: new Set(),
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
    watchVisibleCount: WATCH_PAGE_SIZE,
    discoverPage: 0,
    discoverTotalPages: 1,
    catalogLive: false,
    ratedFilter: "sehr-gut",
    tagFilter: [],
    seenOnlyUnrated: false,
    chosen: null,
    addName: "",
    addAvatar: "cowboy",
    loginName: "",
    loginPass: "",
    loginError: "",
    newTagName: "",
    newTagColor: "#0066B3",
    tagEditId: null,
    editTagName: "",
    editTagColor: "#0066B3",
    expandedFilmId: null,
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

  // Demnächst core API
  // QueueRow = { id: string, at: number }
  // stored at pkey("queue") — copy into this list, never a move from watchlist.
  // ZufallSourceId = "watch" | "queue" | "rated" | `tag:${tagId}`
  // state.zufallSources = selected source ids (multi-select)
  // state.zufallOrigin = sources selected when the sheet opened (ember)
  function queue() {
    return loadJson(pkey("queue"), []);
  }

  function saveQueue(list) {
    saveJson(pkey("queue"), list);
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

  function restoreSession() {
    const session = loadJson("wdq.session", null);
    if (!session) return;
    const user = users().find((u) => u.id === session.userId);
    if (!user) return;
    state.user = user;
    const profile = profilesOf(user.id).find((p) => p.id === session.profileId) || null;
    state.profile = profile;
    state.discoverView = "hub";
    if (profile) openWatchlistHome();
    else state.screen = "profiles";
  }

  function openWatchlistHome() {
    state.listTab = "watch";
    state.screen = "lists";
    state.discoverView = "hub";
    state.expandedFilmId = null;
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

  function pickRuntime(next, prev) {
    const a = Number(next) || 0;
    const b = Number(prev) || 0;
    if (a && b && a === 120 && b !== 120) return b;
    return a || b;
  }

  function rememberFilm(film) {
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
    const lists = [state.currentPicks, state.shortlist, state.searchHits, state.catalog, offlineFilms, FILMS, LOGIN_POSTERS];
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
          .sort((a, b) => (Number(a.order) || 99) - (Number(b.order) || 99))
          .map((row) => String(row.name || row.original_name || "").trim())
          .filter(Boolean)
          .slice(0, 3);
        if (names.length) {
          rememberFilm({ ...film, cast: names });
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

  function countFilmsWithTag(tagId) {
    const map = filmTags();
    let n = 0;
    for (const ids of Object.values(map)) {
      if ((ids || []).includes(tagId)) n += 1;
    }
    return n;
  }

  function sortedTags() {
    return customTags().slice().sort((a, b) => {
      const diff = countFilmsWithTag(b.id) - countFilmsWithTag(a.id);
      if (diff) return diff;
      return String(a.name).localeCompare(b.name, "de", { sensitivity: "base" });
    });
  }

  function tagPillHtml(tag) {
    const name = String(tag && tag.name ? tag.name : "").slice(0, 10);
    const color = (tag && tag.color) || "#0066B3";
    return `<span class="tag-pill" style="--tag-color:${escapeHtml(color)}">${escapeHtml(name)}</span>`;
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

  let tagWaveTimer = 0;
  let tagWaveTimeouts = [];

  function clearTagWave() {
    window.clearInterval(tagWaveTimer);
    tagWaveTimer = 0;
    tagWaveTimeouts.forEach((id) => window.clearTimeout(id));
    tagWaveTimeouts = [];
    app.querySelectorAll(".tag-manage-card.is-waving").forEach((card) => {
      card.classList.remove("is-waving");
    });
  }

  function runTagWave() {
    if (state.screen !== "tags") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = [...app.querySelectorAll("[data-tag-card]")];
    cards.forEach((card, i) => {
      const startId = window.setTimeout(() => {
        card.classList.remove("is-waving");
        void card.offsetWidth;
        card.classList.add("is-waving");
        const doneId = window.setTimeout(() => card.classList.remove("is-waving"), 1000);
        tagWaveTimeouts.push(doneId);
      }, i * 240);
      tagWaveTimeouts.push(startId);
    });
  }

  function scheduleTagWave() {
    clearTagWave();
    if (state.screen !== "tags") return;
    const first = window.setTimeout(runTagWave, 320);
    tagWaveTimeouts.push(first);
    tagWaveTimer = window.setInterval(runTagWave, 6000);
  }

  function showSnack(text, tone) {
    snackbar.hidden = false;
    snackbar.classList.toggle("is-danger", tone === "danger");
    document.body.classList.add("snack-on");
    const mark = tone === "danger" ? "✕" : "✓";
    snackbar.innerHTML = `<span aria-hidden="true">${mark}</span><span>${escapeHtml(text)}</span>`;
    window.clearTimeout(showSnack.tid);
    showSnack.tid = window.setTimeout(() => {
      snackbar.hidden = true;
      snackbar.classList.remove("is-danger");
      document.body.classList.remove("snack-on");
    }, 2600);
  }

  let pendingSwipeRemove = null;

  function closeModal() {
    pendingSwipeRemove = null;
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
    if (state.filters.streaming.length) {
      const have = Array.isArray(film.providers) ? film.providers : film.streaming;
      if (Array.isArray(have) && have.length) {
        const match = state.filters.streaming.some((id) => have.includes(id));
        score += match ? 1.6 : -0.15;
      }
    }
    if (state.filters.types.length && filmMatchesType(film)) score += 1.4;
    if (state.filters.actors.length && filmMatchesActors(film)) score += 2.4;
    score += Math.random() * 0.85;
    return score;
  }

  function filmMatchesType(film) {
    const wanted = state.filters.types || [];
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

  function filmMatchesActors(film) {
    const wanted = state.filters.actors || [];
    if (!wanted.length) return true;
    const names = filmCastNames(film).map((name) => foldSearch(name));
    if (!names.length) return false;
    return wanted.some((actor) => {
      const q = foldSearch(actor && actor.name);
      if (!q) return false;
      return names.some((name) => name === q || name.includes(q));
    });
  }

  function hasHardFilters() {
    return (state.filters.types && state.filters.types.length > 0)
      || (state.filters.actors && state.filters.actors.length > 0);
  }

  function passesHardFilters(film) {
    return filmMatchesType(film) && filmMatchesActors(film);
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
    if (!hasHardFilters() && out.length < count) {
      for (const film of shuffle(state.catalog)) {
        if (!passesHardFilters(film)) continue;
        if (out.some((x) => filmId(x) === filmId(film))) continue;
        out.push(film);
        if (out.length >= count) break;
      }
    }
    if (!out.length && state.catalog.length && !hasHardFilters()) {
      return shuffle(state.catalog).slice(0, Math.max(count, 1));
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
      }
    } catch {
      offlineFilms = cloneFilms(FILMS);
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
      rebuildGenres();
      renderGenrePicks();
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
      || state.filters.actors.length > 0;
  }

  function discoverCatOn(id) {
    if (id === "dauer") return !!state.filters.dauerOn;
    if (id === "genre") return state.filters.genres.length > 0;
    if (id === "tags") return state.filters.tags.length > 0;
    if (id === "streaming") return state.filters.streaming.length > 0;
    if (id === "typ") return state.filters.types.length > 0;
    if (id === "actor") return state.filters.actors.length > 0;
    return false;
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
    const tags = customTags();
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
      chips.push({ kind: "actor", id: actor.id, label: actor.name });
    }
    return chips;
  }

  function renderActiveFilterChips() {
    const chips = filterChipRows();
    if (!chips.length) return "";
    const items = chips.map((chip) => `
      <span class="active-chip">
        <span>${escapeHtml(chip.label)}</span>
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

  function renderOverflowChips(key, items) {
    if (!items.length) {
      return `<span class="hint filter-empty">${key === "tags" ? "Noch keine eigenen Tags" : ""}</span>`;
    }
    const chips = items.map((item) => (
      `<button type="button" class="chip" data-act="${item.act}" ${item.attrs} aria-pressed="${item.on}">${escapeHtml(item.label)}</button>`
    )).join("");
    const expanded = !!state.filterMore[key];
    return `
      <div class="filter-chips${expanded ? " is-expanded" : ""}" data-chip-row="${key}">
        ${chips}
      </div>
      <button type="button" class="chip-more${expanded ? " is-weniger" : ""}" data-act="filter-more" data-key="${key}" ${expanded ? "" : "hidden"}>${expanded ? "weniger" : "mehr"}</button>
    `;
  }

  function paintChipOverflow() {
    const roots = [];
    if (state.screen === "discover" && state.discoverView === "hub") roots.push(app);
    if (state.watchSheet === "zufall") roots.push(watchSheetEl);
    roots.forEach((root) => {
      if (!root) return;
      root.querySelectorAll("[data-chip-row]").forEach((row) => {
      const key = row.dataset.chipRow;
      const wrap = row.closest(".filter-card, .zufall-chip-row") || row.parentElement;
      const moreBtn = wrap ? wrap.querySelector("[data-act=filter-more], [data-act=zufall-more]") : null;
      const chips = [...row.querySelectorAll(".chip")];
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
      for (let i = chips.length - 1; i >= 0; i -= 1) {
        chips[i].hidden = true;
        if (!overflows()) break;
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
    state.actorQuery = "";
    state.actorHits = [];
    state.actorStatus = "";
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
    state.newTagName = "";
    state.newTagColor = "#0066B3";
    openModal(`
      <div class="card modal-card is-center tag-add-modal">
        <h2>Tag hinzufügen</h2>
        <input class="glow-input" data-act="tag-name" maxlength="10" placeholder="Tagname (max. 10 Zeichen)" value="" aria-label="Tagname">
        ${colorSpectrumHtml("add", state.newTagColor)}
        <div class="modal-actions">
          <button type="button" class="btn btn-primary btn-confirm" data-act="tag-add-save">speichern</button>
          <button type="button" class="btn btn-ghost" data-act="modal-close">Abbrechen</button>
        </div>
      </div>
    `);
  }

  function askDeleteTag(id) {
    const tag = customTags().find((t) => t.id === id);
    if (!tag) return;
    const n = countFilmsWithTag(id);
    const html = n > 0
      ? `<p class="hint hint-with-pill">Es gibt mit ${tagPillHtml(tag)} getaggte Filme. Willst Du wirklich löschen?</p>`
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
    const name = clampTagName(state.newTagName);
    if (!name) return;
    const list = customTags();
    list.push({ id: `tag-${Date.now()}`, name, color: state.newTagColor || "#0066B3" });
    saveTags(list);
    state.newTagName = "";
    closeModal();
    render();
  }

  function saveEditedTag() {
    const id = state.tagEditId;
    const name = clampTagName(state.editTagName);
    if (!id || !name) return;
    saveTags(customTags().map((tag) => (
      tag.id === id ? { ...tag, name, color: state.editTagColor || tag.color } : tag
    )));
    state.tagEditId = null;
    render();
  }

  function jumpToExactTag(id) {
    state.listTab = "tags";
    state.tagFilter = [id];
    state.screen = "lists";
    state.tagEditId = null;
    state.expandedFilmId = null;
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

  function doLogout() {
    closeWatchSheet();
    closeModal();
    state.user = null;
    state.profile = null;
    state.expandedFilmId = null;
    state.screen = "login";
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
    const items = [];
    if (["tags", "done", "profile-add"].includes(state.screen)) {
      items.push(`<button type="button" class="icon-btn" data-act="back" aria-label="Zurück" title="Zurück">${ICONS.back}</button>`);
    }
    if (state.screen === "discover" || state.screen === "lists") {
      items.push(`<button type="button" class="icon-btn" data-act="switch" aria-label="Account wechseln" title="Account wechseln">${ICONS.switch}</button>`);
      items.push(`<button type="button" class="icon-btn" data-act="logout" aria-label="Ausloggen" title="Ausloggen">${ICONS.logout}</button>`);
    }
    if (state.screen === "profiles") {
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
      const y = list.scrollTop;
      onScrollDir(y - last);
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

  function renderLoginForm() {
    const register = state.authMode === "register";
    return `
      <form class="login-form" data-act="auth-form" data-role="login-form">
        <label class="login-field">
          <span class="login-field-icon">${ICONS.person}</span>
          <input data-act="login-name" name="login" autocomplete="username" placeholder="Benutzername" value="${escapeHtml(state.loginName)}" enterkeyhint="next">
        </label>
        <label class="login-field">
          <span class="login-field-icon">${ICONS.lock}</span>
          <input data-act="login-pass" name="password" type="password" autocomplete="${register ? "new-password" : "current-password"}" placeholder="Passwort" value="${escapeHtml(state.loginPass)}" enterkeyhint="go">
          <button type="button" class="login-eye" data-act="toggle-pass" aria-label="Passwort anzeigen" aria-pressed="false">${ICONS.eye}</button>
        </label>
        <p class="error" data-role="login-error"${state.loginError ? "" : " hidden"}>${escapeHtml(state.loginError)}</p>
        <div class="login-actions">
          <button type="submit" class="btn btn-primary login-submit" data-act="auth-submit">
            ${register ? "Konto anlegen" : "Anmelden"}
          </button>
          <button type="button" class="login-alt" data-act="auth-toggle">
            ${register ? "Anmelden" : "Registrieren"}
          </button>
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
        <button type="button" class="avatar-hit" data-act="pick-profile" data-id="${p.id}" aria-label="${escapeHtml(p.name)}">${avatarMarkup(p.avatar)}</button>
        <button type="button" data-act="pick-profile" data-id="${p.id}" style="all:unset;cursor:pointer">
          <strong>${escapeHtml(p.name)}</strong>
        </button>
        <button type="button" class="menu-side danger" data-act="ask-delete-profile" data-id="${p.id}" aria-label="Profil löschen" title="Löschen">×</button>
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

  function renderProfileAdd() {
    const picks = EMOJI_AVATARS.map((av) => `
      <button type="button" class="avatar-pick" data-act="add-avatar" data-id="${av.id}" aria-pressed="${state.addAvatar === av.id}" aria-label="${av.id}">
        <span aria-hidden="true">${av.emoji}</span>
      </button>
    `).join("");
    return `
      <h2 class="screen-title home-title">Profil hinzufügen</h2>
      <section class="card auth-card profile-add-card">
        <input class="glow-input" data-act="add-name" value="${escapeHtml(state.addName)}" maxlength="40" placeholder="Name" aria-label="Name">
        <p class="hint avatar-pick-label">Avatar wählen</p>
        <div class="avatar-grid">${picks}</div>
        <button type="button" class="btn btn-primary btn-save-center" data-act="save-profile">speichern</button>
      </section>
    `;
  }

  function filterCardClass(id, extra) {
    return `card filter-card${extra ? ` ${extra}` : ""}${discoverCatOn(id) ? " is-on" : ""}`;
  }

  function renderDiscoverFilters() {
    const fill = dauerFill(state.filters.dauer);
    const genreItems = genrePicks.map((g) => ({
      act: "genre",
      attrs: `data-genre="${escapeHtml(g)}"`,
      label: g,
      on: state.filters.genres.includes(g),
    }));
    const tagItems = customTags().map((t) => ({
      act: "filter-tag",
      attrs: `data-id="${t.id}"`,
      label: t.name,
      on: state.filters.tags.includes(t.id),
    }));
    const streamItems = STREAMING_CHIPS.map((s) => ({
      act: "filter-stream",
      attrs: `data-id="${s.id}"`,
      label: s.label,
      on: state.filters.streaming.includes(s.id),
    }));
    const typeItems = TYPE_CHIPS.map((row) => ({
      act: "filter-type",
      attrs: `data-id="${row.id}"`,
      label: row.label,
      on: state.filters.types.includes(row.id),
    }));
    const selectedActors = state.filters.actors.map((actor) => `
      <span class="active-chip">
        <span>${escapeHtml(actor.name)}</span>
        <button type="button" class="active-chip-x" data-act="actor-remove" data-id="${escapeHtml(actor.id)}" aria-label="${escapeHtml(actor.name)} entfernen">${ICONS.chipX}</button>
      </span>
    `).join("");
    return `
      <div class="filter-stack">
        <div class="${filterCardClass("dauer", "is-dauer")}" data-cat="dauer">
          <span class="filter-label">Dauer</span>
          <div class="dauer-controls">
            <input class="filigree${state.filters.dauerOn ? "" : " idle"}" data-act="dauer" type="range" min="60" max="210" step="5" value="${state.filters.dauer}" style="--fill:${fill}%" aria-label="Maximale Dauer">
            <span class="dauer-value" data-role="dauer-value">${dauerLabel(state.filters.dauer)}</span>
          </div>
        </div>
        <div class="${filterCardClass("genre")}" data-cat="genre">
          <span class="filter-label">Genre</span>
          ${renderOverflowChips("genre", genreItems)}
        </div>
        <div class="${filterCardClass("tags")}" data-cat="tags">
          <span class="filter-label">Tags</span>
          ${renderOverflowChips("tags", tagItems)}
        </div>
        <div class="${filterCardClass("streaming")}" data-cat="streaming">
          <span class="filter-label">Stream</span>
          ${renderOverflowChips("streaming", streamItems)}
        </div>
        <div class="${filterCardClass("typ")}" data-cat="typ">
          <span class="filter-label">Typ</span>
          ${renderOverflowChips("types", typeItems)}
        </div>
        <div class="${filterCardClass("actor", "is-actor")}" data-cat="actor">
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
      </div>
    `;
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
              <span class="menu-sub">Drei Treffer · Filter greifen mit</span>
            </span>
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
      : `<button type="button" class="btn btn-primary suggest-inline-watch" data-act="choose" data-id="${id}">Anschauen</button>`;
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
        <button type="button" class="btn btn-primary suggest-watch-btn" data-act="choose" data-id="${id}">Anschauen</button>
        <div class="suggest-split">
          <button type="button" class="btn btn-compact" data-act="suggest-tag" data-id="${id}">Taggen</button>
          <button type="button" class="btn btn-compact" data-act="suggest-watch" data-id="${id}" aria-pressed="${onWatch}">Watchlist</button>
        </div>
        <button type="button" class="btn btn-compact suggest-richtung" data-act="richtung" data-id="${id}">passende Richtung</button>
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
          <h2 class="screen-title home-title">Entdeckungen</h2>
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
    return watchlist()
      .map((row) => filmWithPoster(findFilm(row.id)))
      .filter(Boolean);
  }

  function queueFilms() {
    return queue()
      .map((row) => filmWithPoster(findFilm(row.id)))
      .filter(Boolean);
  }

  function ratedSourceFilms() {
    const all = ratings();
    const want = state.ratedFilter || "sehr-gut";
    return state.catalog
      .filter((film) => all[filmId(film)] === want)
      .map(filmWithPoster)
      .filter(Boolean);
  }

  function tagSourceFilms(tagId) {
    const map = filmTags();
    const out = [];
    for (const [id, ids] of Object.entries(map)) {
      if (!(ids || []).includes(tagId)) continue;
      const film = filmWithPoster(findFilm(id));
      if (film) out.push(film);
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
      <article class="film-row${unrated ? " is-unrated" : ""}${opts.swipeMode ? " swipe-front" : ""}${expandable ? " is-expandable" : ""}${open ? " is-open" : ""}"${opts.swipeMode ? "" : " data-swipe-row"} data-id="${id}"${opts.gesehen ? ' data-seen="1"' : ""}>
        <div class="film-row-head"${expandable ? ` data-act="film-expand" data-id="${id}" aria-expanded="${open}"` : ""}>
          ${posterTile(film, { lazy: true, size: POSTER_SIZE_THUMB })}
          <div class="film-row-body">
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
    const badge = unratedCount();
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
    return `
      <div class="lists-screen">
        <h2 class="screen-title home-title">Meine Filmlisten</h2>
        <div class="tabs">${tabs}</div>
        ${state.listTab === "watch" ? renderWatchTab() : ""}
        ${state.listTab === "queue" ? renderQueueTab() : ""}
        ${state.listTab === "rated" ? renderRatedTab() : ""}
        ${state.listTab === "tags" ? renderTagsTab() : ""}
        ${state.listTab === "seen" ? renderSeenTab() : ""}
      </div>
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
      visible: withoutWatchlisted(ranked),
      thin: localTitleSearchIsThin(ranked, query),
    };
  }

  function catalogTitleHits(query) {
    return titleSearchLocal(query).visible;
  }

  function watchSheetAllFilms() {
    if (state.watchSheet === "search") {
      if (!state.watchSearch.trim()) return [];
      return withoutWatchlisted(state.searchHits || []);
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
    const html = extra.map((film) => renderListRow(film, { toggle: true })).join("");
    if (moreWrap) moreWrap.insertAdjacentHTML("beforebegin", html);
    else list.insertAdjacentHTML("beforeend", html);
    if (to >= all.length) {
      if (moreWrap) moreWrap.remove();
    }
    observeListPostersSoon(list);
    enrichListCast(extra);
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

  function renderWatchSheetRows(films) {
    if (!films.length) return `<p class="hint">${escapeHtml(watchSheetEmptyText())}</p>`;
    return films.map((film) => renderListRow(film, { toggle: true, swipeMode: "search" })).join("");
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
    return watchlistFilms().map((film) => renderListRow(film, { swipeMode: "watch" })).join("");
  }

  function refreshWatchList() {
    if (state.screen !== "lists" || (state.listTab !== "watch" && state.listTab !== "queue")) return;
    const list = app.querySelector("[data-role=film-list]");
    if (!list) return;
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
    paintZufallChip();
    updateFooter();
    scheduleFooterSync();
    if (state.expandedFilmId) enrichExpandedFilm(state.expandedFilmId);
  }

  function renderWatchSheetHtml() {
    if (state.watchSheet === "zufall") return renderZufallSheetHtml();
    const searching = state.watchSheet === "search";
    if (searching) {
      return `
        <div class="sheet-panel is-search" data-role="sheet-panel">
          <div class="sheet-head" data-role="sheet-drag">
            <div class="sheet-handle" aria-hidden="true"></div>
          </div>
          <div class="sheet-search-wrap">
            <span class="sheet-search-icon">${ICONS.search}</span>
            <input data-act="watch-search" placeholder="Film suchen" value="${escapeHtml(state.watchSearch)}" autocomplete="off" enterkeyhint="search">
          </div>
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
      mountZufallCarousel();
      paintChipOverflow();
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
    if (!state.watchSheetBaselineIds) captureWatchSheetBaseline();
    state.watchSheet = "search";
    resetWatchSheetPage();
    paintWatchSheet();
    if (state.watchSearch.trim()) scheduleTitleSearch(state.watchSearch);
  }

  function closeWatchSheet() {
    window.clearTimeout(searchTimer);
    searchSeq += 1;
    unbindWatchMoreSentinel();
    teardownZufallCarousel();
    state.watchSheet = null;
    state.zufallSources = [];
    state.zufallOrigin = [];
    state.filterMore.zufall = false;
    clearWatchSheetBaseline();
    state.watchSearch = "";
    state.searchHits = [];
    state.searchStatus = "";
    resetWatchSheetPage();
    document.body.classList.remove("watch-sheet-open");
    document.body.classList.remove("zufall-sheet-open");
    if (watchSheetEl) {
      watchSheetEl.hidden = true;
      watchSheetEl.innerHTML = "";
    }
    updateFooter();
  }

  function dismissWatchSheet() {
    const panel = watchSheetEl && watchSheetEl.querySelector("[data-role=sheet-panel]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finish = () => {
      if (state.watchSheet === "search") {
        state.watchSheet = "add";
        resetWatchSheetPage();
        paintWatchSheet();
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
      const count = actorCountLabel(row.count);
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
    const box = app.querySelector("[data-role=actor-hits]");
    if (!box) return;
    box.innerHTML = actorHitsHtml();
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

  function scheduleTitleSearch(query) {
    window.clearTimeout(searchTimer);
    searchSeq += 1;
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
      const remote = withoutWatchlisted((data.results || []).map(fromTmdbMovie).filter((film) => film && film.title));
      const merged = [];
      const seen = new Set();
      for (const film of local.concat(remote)) {
        const id = filmId(film);
        if (!id || seen.has(id)) continue;
        seen.add(id);
        merged.push(film);
      }
      state.searchHits = withoutWatchlisted(rankSearchFilms(merged, query, true));
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
    if (film.poster) return film;
    const id = filmId(film);
    const loginHit = LOGIN_POSTERS.find((row) => filmId(row) === id);
    if (loginHit && loginHit.poster) return Object.assign({}, film, { poster: loginHit.poster });
    const known = findFilm(id);
    if (known && known.poster) return Object.assign({}, film, { poster: known.poster });
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
    const ids = (state.zufallSources && state.zufallSources.length)
      ? state.zufallSources
      : defaultZufallOrigin();
    return zufallUnionFilms(ids).map(filmWithPoster).filter(Boolean);
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
      push.hidden = spinning || done;
      push.disabled = !zufallUi.pool.length;
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
      closeWatchSheet();
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

  function openZufallSheet() {
    const origin = defaultZufallOrigin().filter((id) => zufallSourceMeta(id));
    state.zufallOrigin = origin.slice();
    state.zufallSources = origin.slice();
    state.filterMore.zufall = false;
    if (!zufallUnionCount(state.zufallSources)) return;
    closeFilmMenus();
    teardownZufallCarousel();
    state.watchSheet = "zufall";
    paintWatchSheet();
  }

  function zufallAvailableSources() {
    const out = ["watch", "queue", "rated"];
    customTags().forEach((tag) => out.push(`tag:${tag.id}`));
    return out.filter((id) => zufallSourceMeta(id));
  }

  function renderZufallSourceChips() {
    const selected = new Set(state.zufallSources);
    const chips = zufallAvailableSources().map((id) => {
      const meta = zufallSourceMeta(id);
      if (!meta) return "";
      const n = zufallUnionCount([id]);
      if (!n) return "";
      const on = selected.has(id);
      return `<button type="button" class="chip${on && selected.size === 1 ? " is-lava" : ""}" data-act="zufall-source" data-id="${escapeHtml(id)}" aria-pressed="${on}">${escapeHtml(meta.label)} (${n})${on && selected.size > 1 ? " ✓" : ""}</button>`;
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
    const root = zufallSheetRoot();
    if (!zufallUnionCount(selected)) {
      teardownZufallCarousel();
      if (root) root.hidden = true;
      paintZufallActions();
      return;
    }
    if (root) root.hidden = false;
    mountZufallCarousel();
  }

  function renderZufallSheetHtml() {
    return `
      <div class="sheet-panel zufall-panel" data-role="sheet-panel">
        <div class="sheet-head zufall-head" data-role="sheet-drag">
          <div class="sheet-handle" aria-hidden="true"></div>
          <h2 class="sheet-title">Zufallswahl</h2>
          <button type="button" class="zufall-close" data-act="watch-sheet-close" aria-label="Schließen">${ICONS.close}</button>
        </div>
        <div class="zufall-sources" data-role="zufall-sources">${renderZufallSourceChips()}</div>
        <div class="zufall-body">
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
            <button type="button" class="zufall-push" data-act="zufall-push">Push</button>
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
            <button type="button" class="btn btn-primary zufall-watch" data-act="choose" data-id="">Anschauen</button>
            <button type="button" class="zufall-again" data-act="zufall-again">Erneut drehen</button>
          </div>
        </div>
      </div>
    `;
  }

  function renderWatchTab() {
    const rows = renderWatchRows();
    const empty = watchlist().length < 1;
    return `
      <div class="list-toolbar">
        <button type="button" class="watch-add-chip" data-act="watch-sheet-open">
          <span class="watch-add-plus">${ICONS.plus}</span>
          Hinzufügen
        </button>
        <button type="button" class="watch-add-chip watch-zufall-chip" data-act="zufall-open"${empty ? " disabled" : ""} title="${empty ? "Mind. 1 Film" : "Zufallswahl"}" aria-disabled="${empty ? "true" : "false"}">
          <span class="watch-zufall-stack" data-role="zufall-chip-icon">${zufallChipTiles()}</span>
          Zufall
        </button>
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
    return `
      <div class="list-toolbar">
        <button type="button" class="watch-add-chip" data-act="watch-sheet-open">
          <span class="watch-add-plus">${ICONS.plus}</span>
          Hinzufügen
        </button>
        <button type="button" class="watch-add-chip watch-zufall-chip" data-act="zufall-open"${empty ? " disabled" : ""} title="${empty ? "Mind. 1 Film" : "Zufallswahl"}" aria-disabled="${empty ? "true" : "false"}">
          <span class="watch-zufall-stack" data-role="zufall-chip-icon">${zufallChipTiles()}</span>
          Zufall
        </button>
        <span class="watch-zufall-hint" data-role="zufall-empty-hint"${empty ? "" : " hidden"}>Mind. 1 Film</span>
      </div>
      <section class="film-list" data-role="film-list">${rows || `<p class="hint">Noch nichts unter Demnächst.</p>`}</section>
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
      <div class="list-toolbar">
        <div class="suggest-chips">${chips}</div>
      </div>
      <section class="film-list" data-role="film-list">${rows || `<p class="hint">Keine Filme mit dieser Bewertung.</p>`}</section>
    `;
  }

  function renderTagsTab() {
    const tags = customTags();
    const chips = tags.map((t) => `
      <button type="button" class="chip" data-act="tag-filter" data-id="${t.id}" aria-pressed="${state.tagFilter.includes(t.id)}">${escapeHtml(t.name)} ${countFilmsWithTag(t.id)}</button>
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
    const exactTag = selected.length === 1 ? tags.find((t) => t.id === selected[0]) : null;
    const exactHint = exactTag
      ? `<p class="hint hint-with-pill" style="margin-top:12px">Genau dieser Tag: ${tagPillHtml(exactTag)}</p>`
      : "";
    return `
      ${exactHint}
      <div class="list-toolbar is-tags">
        <button type="button" class="tags-manage-btn" data-act="tags">Tags verwalten</button>
        <div class="suggest-chips">${chips || `<span class="hint">Noch keine eigenen Tags</span>`}</div>
      </div>
      <section class="film-list" data-role="film-list">${selected.length ? (rows || `<p class="hint">Keine Filme mit genau diesen Tags.</p>`) : `<p class="hint">Tags wählen, um Filme zu sehen.</p>`}</section>
    `;
  }

  function formatSeenOn(at) {
    const d = new Date(Number(at));
    if (!Number.isFinite(d.getTime()) || d.getTime() <= 0) return "";
    return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  function renderSeenTab() {
    const all = ratings();
    let rows = history().slice().sort((a, b) => b.at - a.at);
    if (state.seenOnlyUnrated) rows = rows.filter((row) => !all[String(row.id)]);
    const cards = rows.map((row) => {
      const film = findFilm(row.id) || { id: row.id, title: row.title, genre: "Film", minutes: 0, poster: "", color: "#1d4f91" };
      const unrated = !all[String(row.id)];
      const rateLabel = unrated ? "" : (RATE_KEYS.find((r) => r.id === all[String(row.id)])?.label || "");
      const extra = [formatSeenOn(row.at), rateLabel].filter(Boolean).join(" · ");
      return renderListRow(film, {
        gesehen: true,
        unrated,
        hideCast: true,
        extra,
      });
    }).join("");
    return `
      <div class="list-toolbar">
        <div class="suggest-chips">
          <button type="button" class="chip" data-act="seen-unrated" aria-pressed="${state.seenOnlyUnrated}">nur unbewertet</button>
          <button type="button" class="chip" data-act="seen-all" aria-pressed="${!state.seenOnlyUnrated}">alle</button>
        </div>
      </div>
      <section class="film-list" data-role="film-list">${cards || `<p class="hint">Noch keine gesehenen Filme.</p>`}</section>
    `;
  }

  function renderTagsManage() {
    const tags = sortedTags();
    const rows = tags.map((t) => {
      const n = countFilmsWithTag(t.id);
      const editing = state.tagEditId === t.id;
      const countLabel = n === 1 ? "1 Film getaggt" : `${n} Filme getaggt`;
      const pill = editing
        ? tagPillHtml({ ...t, name: clampTagName(state.editTagName) || t.name, color: state.editTagColor || t.color })
        : tagPillHtml(t);
      return `
        <article class="card tag-manage-card" data-tag-card="${t.id}">
          <div class="tag-manage-row">
            ${pill}
            <button type="button" class="tag-count" data-act="tag-jump" data-id="${t.id}">
              <span>${escapeHtml(countLabel)}</span>
              ${ICONS.jump}
            </button>
            <button type="button" class="tag-edit-toggle" data-act="${editing ? "tag-edit-close" : "tag-edit-open"}" data-id="${t.id}">
              ${editing ? "fertig" : "bearbeiten"}
            </button>
          </div>
          ${editing ? `
            <div class="tag-manage-editor">
              <label class="field">
                <span>Name</span>
                <input class="glow-input" data-act="edit-tag-name" maxlength="10" value="${escapeHtml(state.editTagName)}" placeholder="Tagname (max. 10 Zeichen)" aria-label="Tagname">
              </label>
              ${colorSpectrumHtml("edit", state.editTagColor || t.color)}
              <div class="tag-edit-actions">
                <button type="button" class="btn btn-danger-soft" data-act="ask-delete-tag" data-id="${t.id}">löschen</button>
                <button type="button" class="btn btn-primary" data-act="tag-edit-save" data-id="${t.id}">speichern</button>
              </div>
            </div>
          ` : ""}
        </article>
      `;
    }).join("");
    return `
      <h2 class="screen-title home-title">Tags verwalten</h2>
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

  function render() {
    if (state.watchSheet === "zufall") {
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
    else if (state.screen === "profiles") app.innerHTML = renderProfiles();
    else if (state.screen === "profile-add") app.innerHTML = renderProfileAdd();
    else if (state.screen === "discover") {
      app.innerHTML = renderDiscover();
      if (state.discoverView === "hub") window.requestAnimationFrame(paintChipOverflow);
      if (state.discoverView === "results") {
        observeListPostersSoon(app);
        enrichListCast(state.currentPicks);
      }
    }
    else if (state.screen === "lists") {
      app.innerHTML = renderLists();
      bindFilmListScroll();
      observeListPostersSoon(app);
      const shown = app.querySelectorAll(".film-row");
      const films = [...shown].map((row) => findFilm(row.dataset.id)).filter(Boolean);
      if (state.listTab !== "seen") enrichListCast(films);
      if (state.expandedFilmId) enrichExpandedFilm(state.expandedFilmId);
    }
    else if (state.screen === "tags") app.innerHTML = renderTagsManage();
    else if (state.screen === "done") app.innerHTML = renderDone();
    if (state.screen === "tags") scheduleTagWave();
    else clearTagWave();
    scheduleFooterSync();
  }

  function goBack() {
    if (state.watchSheet) {
      dismissWatchSheet();
      return;
    }
    if (state.screen === "profile-add") state.screen = "profiles";
    else if (state.screen === "lists" || state.screen === "tags" || state.screen === "done") {
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
      resetSessionPicks();
      openWatchlistHome();
    } else {
      state.profile = null;
      state.screen = "profiles";
    }
    persistSession();
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
        box.insertAdjacentHTML("afterbegin", `<p class="film-expand-plot">${escapeHtml(clipPlot(text))}</p>`);
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

  async function enrichPicks() {
    const next = [];
    for (const film of state.currentPicks) {
      next.push(await enrichFilm(film));
    }
    state.currentPicks = next;
    if (state.screen === "discover" && state.discoverView === "results") render();
  }

  async function startSuggestions(opts) {
    const refresh = !!(opts && opts.refresh);
    closeWatchSheet();
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

  function toggleWatchFilm(film) {
    if (!film) return;
    rememberFilm(film);
    if (isOnWatchlist(film)) {
      saveWatchlist(watchlist().filter((row) => String(row.id) !== filmId(film)));
      paintWatchToggles();
      refreshWatchList();
      if (state.watchSheet) paintWatchSheetList();
      showSnack(`${film.title} von Watchlist entfernt`, "danger");
      return;
    }
    addWatch(film);
    let queued = false;
    if (state.listTab === "queue") queued = addQueue(film);
    paintWatchToggles();
    refreshWatchList();
    if (state.watchSheet) paintWatchSheetList();
    showSnack(queued ? "Zu Watchlist und Demnächst hinzugefügt" : `${film.title} zur Watchlist hinzugefügt`);
  }

  function chooseFilm(film) {
    if (!film) return;
    rememberFilm(film);
    scheduleLiveDetails(film);
    const hid = filmId(film);
    const rows = history().filter((row) => String(row.id) !== hid);
    rows.unshift({ id: hid, title: film.title, at: Date.now() });
    saveHistory(rows.slice(0, 300));
    saveWatchlist(watchlist().filter((row) => String(row.id) !== hid));
    saveQueue(queue().filter((row) => String(row.id) !== hid));
    resetSessionPicks();
    state.chosen = film;
    state.screen = "done";
    state.discoverView = "hub";
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
      return true;
    }
    if (act === "zufall-swap") {
      swapZufallFront(t.dataset.side);
      return true;
    }
    if (act === "choose" && state.watchSheet === "zufall") {
      chooseFilm(findFilm(t.dataset.id));
      return true;
    }
    if (act === "watch-search-open") {
      openWatchSearchSheet();
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
    return false;
  }

  app.addEventListener("click", async (event) => {
    if (handleWatchUiClick(event)) return;
    const t = event.target.closest("[data-act]");
    if (!t) {
      closeFilmMenus();
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
    if (act === "auth-submit") {
      submitAuth();
      return;
    }
    if (act === "pick-profile") {
      const profile = profilesOf(state.user.id).find((p) => p.id === t.dataset.id);
      if (!profile) return;
      state.profile = profile;
      resetSessionPicks();
      openWatchlistHome();
      persistSession();
      render();
      loadCatalog();
      return;
    }
    if (act === "add-profile") {
      state.addName = "";
      state.addAvatar = "cowboy";
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
      else state.filterMore = { genre: false, tags: false, streaming: false, types: false, zufall: false };
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
      if (state.filters.types.includes(id)) {
        state.filters.types = state.filters.types.filter((x) => x !== id);
      } else {
        state.filters.types.push(id);
      }
      render();
      return;
    }
    if (act === "actor-pick") {
      const name = t.dataset.name || "";
      const id = t.dataset.id || name;
      const tmdb = Number(t.dataset.tmdb) || 0;
      if (name && !state.filters.actors.some((actor) => foldSearch(actor.name) === foldSearch(name))) {
        state.filters.actors.push({ id, name, tmdb });
      }
      state.actorQuery = "";
      state.actorHits = [];
      state.actorStatus = "";
      render();
      return;
    }
    if (act === "actor-remove") {
      state.filters.actors = state.filters.actors.filter((actor) => actor.id !== t.dataset.id);
      render();
      return;
    }
    if (act === "suggest-tag") {
      const box = t.closest(".film-row-expand");
      const tagsEl = box && box.querySelector("[data-role=suggest-tags]");
      if (!customTags().length) {
        showSnack("Noch keine eigenen Tags");
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
        saveWatchlist(watchlist().filter((row) => String(row.id) !== filmId(film)));
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
      state.expandedFilmId = null;
      state.screen = "profiles";
      persistSession();
      render();
      return;
    }
    if (act === "logout") {
      askLogout();
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
      render();
      if (state.expandedFilmId) enrichExpandedFilm(state.expandedFilmId);
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
      saveWatchlist(watchlist().filter((row) => String(row.id) !== filmId(t.dataset.id)));
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
      state.listTab = t.dataset.id;
      state.expandedFilmId = null;
      render();
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
      state.tagEditId = tag.id;
      state.editTagName = tag.name;
      state.editTagColor = tag.color;
      render();
      return;
    }
    if (act === "tag-edit-close") {
      state.tagEditId = null;
      render();
      return;
    }
    if (act === "tag-edit-save") {
      saveEditedTag();
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
    if (act === "add-name") state.addName = t.value;
    if (act === "tag-name") state.newTagName = t.value.slice(0, 10);
    if (act === "edit-tag-name") {
      state.editTagName = t.value.slice(0, 10);
      const pill = t.closest("[data-tag-card]") && t.closest("[data-tag-card]").querySelector(".tag-pill");
      if (pill) pill.textContent = clampTagName(t.value) || pill.textContent;
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
    if (act === "dauer") {
      state.filters.dauer = Number(t.value);
      state.filters.dauerOn = true;
      t.style.setProperty("--fill", `${dauerFill(state.filters.dauer)}%`);
      t.classList.remove("idle");
      const value = t.parentElement.querySelector("[data-role=dauer-value]");
      if (value) value.textContent = dauerLabel(state.filters.dauer);
      paintDiscoverActiveChips();
    }
    if (act === "actor-search") {
      state.actorQuery = t.value;
      scheduleActorSearch(t.value);
    }
  });

  headerActions.addEventListener("click", (event) => {
    const t = event.target.closest("[data-act]");
    if (!t) return;
    if (t.dataset.act === "back") goBack();
    if (t.dataset.act === "switch") {
      state.profile = null;
      state.expandedFilmId = null;
      state.screen = "profiles";
      persistSession();
      render();
    }
    if (t.dataset.act === "logout") {
      askLogout();
    }
  });

  modalEl.addEventListener("input", (event) => {
    const t = event.target;
    const act = t && t.dataset ? t.dataset.act : "";
    if (act === "tag-name") state.newTagName = t.value.slice(0, 10);
    if (act === "spectrum-hue" || act === "spectrum-sat") onSpectrumInput(t);
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
      if (state.tagEditId === id) state.tagEditId = null;
      closeModal();
      render();
      return;
    }
    if (t.dataset.act === "confirm-logout") {
      doLogout();
      return;
    }
    if (t.dataset.act === "swipe-remove") {
      const film = findFilm(t.dataset.id);
      const mode = pendingSwipeRemove && pendingSwipeRemove.mode;
      pendingSwipeRemove = null;
      closeModal();
      if (!film) return;
      if (mode === "queue") {
        removeQueueId(filmId(film));
        render();
        showSnack(`${film.title} von Demnächst entfernt`, "danger");
      } else {
        saveWatchlist(watchlist().filter((row) => String(row.id) !== filmId(film)));
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
      if (state.screen === "discover" && state.discoverView === "results") render();
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
    if (!film || !mode) {
      resetSwipeRow(row);
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
        showSnack((watched || queued) ? "Zu Watchlist und Demnächst hinzugefügt" : "Bereits in Watchlist und Demnächst");
        updateFooter();
        if (state.expandedFilmId === filmId(film)) render();
        return;
      }
      if (mode === "watch") {
        if (!addQueue(film)) {
          showSnack("Bereits in Demnächst enthalten");
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
    const row = event.target.closest("[data-swipe-row]");
    if (!row || !row.dataset.swipeMode) return;
    if (event.target.closest("[data-act=film-menu], .film-menu-pop, [data-act=watch-toggle], .film-row-expand, [data-act=rate], [data-act=film-tag], [data-act=choose], .suggest-inline-watch")) return;
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

  watchSheetEl.addEventListener("input", (event) => {
    const t = event.target;
    if (!t || t.dataset.act !== "watch-search") return;
    state.watchSearch = t.value;
    scheduleTitleSearch(t.value);
  });

  let sheetDrag = null;

  function sheetEventPoint(event) {
    const touch = (event.touches && event.touches[0]) || (event.changedTouches && event.changedTouches[0]);
    if (touch) return { x: touch.clientX, y: touch.clientY };
    return { x: event.clientX, y: event.clientY };
  }

  function sheetDragBlocked(event) {
    if (!state.watchSheet || !watchSheetEl || watchSheetEl.hidden) return true;
    if (event.target.closest("button, a, input, [data-role=zufall-carousel], [data-act=watch-toggle], [data-act=watch-cat], [data-act=watch-search-open], [data-act=watch-more], [data-role=watch-more], [data-swipe-row], [data-act=zufall-source], [data-act=zufall-more]")) return true;
    const list = event.target.closest("[data-role=watch-sheet-list]");
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
    sheetDrag = {
      id: event.pointerId,
      startX: pt.x,
      startY: pt.y,
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
    if (!sheetDrag.dragging) {
      if (dy < 12) return;
      if (Math.abs(dx) > dy) {
        finishSheetDrag(0, false);
        return;
      }
      sheetDrag.dragging = true;
      const active = document.activeElement;
      if (active && watchSheetEl.contains(active) && typeof active.blur === "function") active.blur();
    }
    if (dy < 0) {
      sheetDrag.panel.style.transform = "";
      return;
    }
    sheetDrag.panel.style.transition = "none";
    sheetDrag.panel.style.transform = `translateY(${dy}px)`;
    if (event.cancelable) event.preventDefault();
  }

  function finishSheetDrag(dy, dragging) {
    const panel = sheetDrag && sheetDrag.panel;
    sheetDrag = null;
    unbindSheetDragWindow();
    if (!panel) return;
    if (!dragging || dy <= 72) {
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
    finishSheetDrag(dy, dragging);
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
  restoreSession();
  ensureLoginPostersPreloaded();
  render();
  scheduleCatalogLoad();

  window.CinexTmdb = {
    url: tmdbUrl,
    movie: fromTmdbMovie,
    key: tmdbKey,
    proxy: searchProxyBase,
    titleSearchThin: localTitleSearchIsThin,
    actorSearchThin: localActorSearchIsThin,
  };
})();
