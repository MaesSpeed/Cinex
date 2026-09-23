/**
 * Server-side TMDB search proxy. The browser never receives TMDB_API_KEY.
 * Allowlist: GET /search/movie, GET /search/person, GET /movie/:id
 */
const TMDB_API = "https://api.themoviedb.org/3";
const SEARCH_PATHS = new Set(["/search/movie", "/search/person"]);
const MOVIE_PATH = /^\/movie\/(\d+)$/;
const RATE_WINDOW_MS = 10_000;
const RATE_MAX = 30;
const buckets = new Map();

export function resetSearchProxyState() {
  buckets.clear();
}

export function isAllowedOrigin(origin, extra) {
  if (!origin) return true;
  let host = "";
  let protocol = "";
  try {
    const url = new URL(origin);
    host = url.hostname.toLowerCase();
    protocol = url.protocol;
  } catch {
    return false;
  }
  if (protocol !== "http:" && protocol !== "https:") return false;
  if (host === "localhost" || host === "127.0.0.1" || host === "::1") return true;
  if (host === "github.io" || host.endsWith(".github.io")) return true;
  const extras = String(extra || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return extras.some((item) => {
    if (item === origin) return true;
    if (item.startsWith("*.")) {
      const suffix = item.slice(1).toLowerCase();
      return host.endsWith(suffix);
    }
    try {
      return new URL(item).origin === origin;
    } catch {
      return host === item.toLowerCase();
    }
  });
}

function corsHeaders(origin) {
  const headers = {
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
  if (origin) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

function json(data, status, origin, extraHeaders) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": status === 200 ? "public, max-age=120" : "no-store",
      ...corsHeaders(origin),
      ...(extraHeaders || {}),
    },
  });
}

function scrub(text, key) {
  let out = String(text || "");
  if (key) out = out.split(key).join("");
  return out.replace(/api_key=[^&\s"']*/gi, "api_key=");
}

function allowRequest(ip) {
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || now - bucket.start >= RATE_WINDOW_MS) {
    buckets.set(ip, { start: now, count: 1 });
    if (buckets.size > 4000) buckets.clear();
    return true;
  }
  bucket.count += 1;
  return bucket.count <= RATE_MAX;
}

function useBearer(key) {
  return key.length > 64 || key.startsWith("eyJ");
}

function clampPage(raw) {
  const n = Number(raw || 1);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(3, Math.floor(n));
}

export function buildUpstream(pathname, searchParams, key) {
  const upstream = new URL(`${TMDB_API}${pathname}`);
  upstream.searchParams.set("language", "de-DE");
  upstream.searchParams.set("region", "DE");
  upstream.searchParams.set("include_adult", "false");
  if (SEARCH_PATHS.has(pathname)) {
    upstream.searchParams.set("query", String(searchParams.get("query") || "").trim().slice(0, 80));
    upstream.searchParams.set("page", String(clampPage(searchParams.get("page"))));
  }
  if (MOVIE_PATH.test(pathname) && searchParams.get("append_to_response") === "credits") {
    upstream.searchParams.set("append_to_response", "credits");
  }
  const headers = { Accept: "application/json" };
  if (useBearer(key)) headers.Authorization = `Bearer ${key}`;
  else upstream.searchParams.set("api_key", key);
  return { url: upstream, headers };
}

export async function handleSearchProxy(request, env, fetchImpl) {
  const origin = request.headers.get("Origin") || "";
  const allowedOrigin = isAllowedOrigin(origin, env && env.ALLOWED_ORIGINS);
  if (!allowedOrigin) {
    return json({ error: "forbidden" }, 403, "");
  }
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (request.method !== "GET") {
    return json({ error: "method" }, 405, origin);
  }

  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, "") || "/";
  if (path === "/" || path === "/health") {
    return json({ ok: true, service: "cinex-search" }, 200, origin);
  }

  const movie = MOVIE_PATH.test(path);
  const search = SEARCH_PATHS.has(path);
  if (!movie && !search) {
    return json({ error: "not_found" }, 404, origin);
  }

  const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("x-forwarded-for") || "local";
  if (!allowRequest(ip)) {
    return json({ error: "rate_limited", results: [] }, 429, origin);
  }

  const key = String((env && env.TMDB_API_KEY) || "").trim();
  if (!key) {
    return json({ error: "unconfigured", results: [] }, 500, origin);
  }

  if (search) {
    const query = String(url.searchParams.get("query") || "").trim();
    if (!query) return json({ results: [], total_results: 0 }, 200, origin);
    if (query.length > 80) return json({ error: "query", results: [] }, 400, origin);
  }

  const upstream = buildUpstream(path, url.searchParams, key);
  const doFetch = fetchImpl || fetch;
  let res;
  try {
    res = await doFetch(upstream.url.toString(), {
      headers: upstream.headers,
      redirect: "manual",
    });
  } catch {
    return json({ error: "upstream", results: [] }, 502, origin);
  }
  if (res.status >= 300 && res.status < 400) {
    return json({ error: "upstream", results: [] }, 502, origin);
  }
  const raw = await res.text();
  const body = scrub(raw, key);
  if (!res.ok) {
    return json({ error: "upstream", results: [] }, 502, origin);
  }
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=120",
      ...corsHeaders(origin),
    },
  });
}

export default {
  fetch(request, env) {
    return handleSearchProxy(request, env);
  },
};
