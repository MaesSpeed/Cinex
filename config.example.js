// Copy to config.js. Do not commit a real TMDB key — GitHub Pages would expose it.
// Live title and actor search use SEARCH_PROXY (a Cloudflare Worker that holds the key).
// Leave SEARCH_PROXY empty to search the local catalog only (films.json / in-memory).
window.TMDB_KEY = "";
window.SEARCH_PROXY = "";
// Example: "https://cinex-search.iammrspeed.workers.dev"
// Local wrangler dev: "http://127.0.0.1:8787"
