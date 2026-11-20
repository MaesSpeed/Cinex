// Worker entry. workerd only accepts a fetch handler from the main module.
// Helpers and the request function live in lib.js so tests can import them.
import { handle } from "./lib.js";

export default {
  async fetch(req, env) {
    try {
      return await handle(req, env);
    } catch (e) {
      return new Response(JSON.stringify({ error: "internal" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
