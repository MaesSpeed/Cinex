import assert from "node:assert/strict";
import test from "node:test";
import {
  buildUpstream,
  handleSearchProxy,
  isAllowedOrigin,
  resetSearchProxyState,
} from "../src/index.js";

const KEY = "test-v3-key-not-real";
const BEARER = `eyJ${"a".repeat(80)}`;

function envWith(key, extra) {
  return { TMDB_API_KEY: key, ALLOWED_ORIGINS: extra || "" };
}

function call(path, { origin = "https://maesspeed.github.io", key = KEY, headers = {}, fetchImpl } = {}) {
  const request = new Request(`https://cinex-search.example${path}`, {
    headers: { Origin: origin, ...headers },
  });
  return handleSearchProxy(request, envWith(key), fetchImpl);
}

test.beforeEach(() => {
  resetSearchProxyState();
});

test("allows GitHub Pages and localhost, rejects other sites", () => {
  assert.equal(isAllowedOrigin("https://maesspeed.github.io"), true);
  assert.equal(isAllowedOrigin("http://127.0.0.1:4173"), true);
  assert.equal(isAllowedOrigin("http://localhost:8787"), true);
  assert.equal(isAllowedOrigin(""), true);
  assert.equal(isAllowedOrigin("https://evil.example"), false);
  assert.equal(isAllowedOrigin("https://preview.example.com", "*.example.com"), true);
});

test("health check does not call TMDB", async () => {
  let called = false;
  const res = await call("/health", {
    fetchImpl() {
      called = true;
      return Promise.resolve(new Response("nope"));
    },
  });
  assert.equal(res.status, 200);
  assert.equal(called, false);
  const body = await res.json();
  assert.equal(body.ok, true);
  assert.equal(res.headers.get("Access-Control-Allow-Origin"), "https://maesspeed.github.io");
});

test("movie search forwards a server key and drops a client key", async () => {
  let seen = "";
  const res = await call("/search/movie?query=Gladiator&api_key=browser-secret&page=9", {
    fetchImpl(url) {
      seen = String(url);
      return Promise.resolve(new Response(JSON.stringify({
        results: [{ id: 98, title: "Gladiator", api_key: KEY }],
      }), { status: 200, headers: { "Content-Type": "application/json" } }));
    },
  });
  assert.equal(res.status, 200);
  const upstream = new URL(seen);
  assert.equal(upstream.pathname, "/3/search/movie");
  assert.equal(upstream.searchParams.get("query"), "Gladiator");
  assert.equal(upstream.searchParams.get("api_key"), KEY);
  assert.equal(upstream.searchParams.get("api_key") === "browser-secret", false);
  assert.equal(upstream.searchParams.get("language"), "de-DE");
  assert.equal(upstream.searchParams.get("region"), "DE");
  assert.equal(upstream.searchParams.get("include_adult"), "false");
  assert.equal(upstream.searchParams.get("page"), "3");
  const text = await res.text();
  assert.equal(text.includes(KEY), false);
  assert.equal(text.includes("browser-secret"), false);
  assert.equal(text.includes("Gladiator"), true);
});

test("v4 token is sent as Bearer and not in the query", () => {
  const built = buildUpstream("/search/person", new URLSearchParams("query=Russell+Crowe"), BEARER);
  assert.equal(built.headers.Authorization, `Bearer ${BEARER}`);
  assert.equal(built.url.searchParams.has("api_key"), false);
  assert.equal(built.url.searchParams.get("query"), "Russell Crowe");
});

test("person search and movie details stay on the allowlist", async () => {
  const paths = [];
  const fetchImpl = (url) => {
    paths.push(new URL(url).pathname);
    return Promise.resolve(new Response(JSON.stringify({ results: [], id: 98 }), { status: 200 }));
  };
  assert.equal((await call("/search/person?query=Crowe", { fetchImpl })).status, 200);
  assert.equal((await call("/movie/98?append_to_response=credits&append_to_response=videos", { fetchImpl })).status, 200);
  assert.equal((await call("/movie/98/credits", { fetchImpl })).status, 404);
  assert.equal((await call("/discover/movie?page=1", { fetchImpl })).status, 404);
  assert.deepEqual(paths, ["/3/search/person", "/3/movie/98"]);
  const detail = buildUpstream("/movie/98", new URLSearchParams("append_to_response=credits"), KEY);
  assert.equal(detail.url.searchParams.get("append_to_response"), "credits");
  const blocked = buildUpstream("/movie/98", new URLSearchParams("append_to_response=videos"), KEY);
  assert.equal(blocked.url.searchParams.has("append_to_response"), false);
});

test("empty search does not call TMDB", async () => {
  let called = false;
  const res = await call("/search/movie?query=", {
    fetchImpl() {
      called = true;
      return Promise.resolve(new Response("{}"));
    },
  });
  assert.equal(called, false);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { results: [], total_results: 0 });
});

test("upstream failures and redirects do not leak the key", async () => {
  const leak = await call("/search/movie?query=Gladiator", {
    fetchImpl() {
      return Promise.resolve(new Response(
        JSON.stringify({ status_message: `bad key ${KEY}`, request: `https://api.themoviedb.org/3/search/movie?api_key=${KEY}` }),
        { status: 401 }
      ));
    },
  });
  assert.equal(leak.status, 502);
  const text = await leak.text();
  assert.equal(text.includes(KEY), false);
  assert.equal(text.includes("api_key=" + KEY), false);

  const redirect = await call("/search/movie?query=Gladiator", {
    fetchImpl() {
      return Promise.resolve(new Response(null, {
        status: 302,
        headers: { Location: `https://api.themoviedb.org/3/search/movie?api_key=${KEY}` },
      }));
    },
  });
  assert.equal(redirect.status, 502);
  assert.equal((await redirect.text()).includes(KEY), false);
});

test("missing secret is a generic error", async () => {
  const res = await call("/search/movie?query=Gladiator", { key: "  " });
  assert.equal(res.status, 500);
  const body = await res.json();
  assert.equal(body.error, "unconfigured");
  assert.equal(JSON.stringify(body).includes("TMDB"), false);
});

test("rejects foreign origins before calling TMDB", async () => {
  let called = false;
  const res = await call("/search/movie?query=Gladiator", {
    origin: "https://evil.example",
    fetchImpl() {
      called = true;
      return Promise.resolve(new Response("{}"));
    },
  });
  assert.equal(res.status, 403);
  assert.equal(called, false);
});

test("rate limit trips without calling TMDB further", async () => {
  let calls = 0;
  const fetchImpl = () => {
    calls += 1;
    return Promise.resolve(new Response(JSON.stringify({ results: [] }), { status: 200 }));
  };
  const headers = { "CF-Connecting-IP": "203.0.113.5" };
  for (let i = 0; i < 30; i += 1) {
    const res = await call("/search/movie?query=Gladiator", { fetchImpl, headers });
    assert.equal(res.status, 200);
  }
  const blocked = await call("/search/movie?query=Gladiator", { fetchImpl, headers });
  assert.equal(blocked.status, 429);
  assert.equal(calls, 30);
});
