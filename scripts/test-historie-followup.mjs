import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "historie.js"), "utf8");

function extractFn(name) {
  const re = new RegExp(`function ${name}\\([^)]*\\)\\s*\\{`, "m");
  const m = src.match(re);
  if (!m) throw new Error(`missing ${name}`);
  const start = m.index;
  let depth = 0;
  let started = false;
  for (let i = start; i < src.length; i++) {
    const ch = src[i];
    if (ch === "{") {
      depth += 1;
      started = true;
    } else if (ch === "}") {
      depth -= 1;
      if (started && depth === 0) return src.slice(start, i + 1);
    }
  }
  throw new Error(`unclosed ${name}`);
}

const { viewstreak, calendarDaysInclusive, gesamtViewtimePerDayHtml, startOfDay } = new Function(`
  function fmtNum(n, decimals) {
    const d = decimals == null ? 0 : decimals;
    return Number(n).toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });
  }
  ${extractFn("startOfDay")}
  ${extractFn("addDays")}
  ${extractFn("viewstreak")}
  ${extractFn("calendarDaysInclusive")}
  ${extractFn("gesamtViewtimePerDayHtml")}
  return { viewstreak, calendarDaysInclusive, gesamtViewtimePerDayHtml, startOfDay };
`)();

test("viewstreak counts from latest view day when today is empty", () => {
  const day = startOfDay(new Date(2026, 8, 20).getTime());
  const events = [{ at: day + 3600000 }, { at: day + 7200000 }];
  assert.equal(viewstreak(events), 1);
});

test("viewstreak counts consecutive days ending on latest activity", () => {
  const d1 = startOfDay(new Date(2026, 8, 18).getTime());
  const d2 = startOfDay(new Date(2026, 8, 19).getTime());
  const d3 = startOfDay(new Date(2026, 8, 20).getTime());
  const events = [{ at: d1 }, { at: d2 }, { at: d3 }];
  assert.equal(viewstreak(events), 3);
});

test("gesamt viewtime per day uses inclusive calendar days", () => {
  const start = startOfDay(new Date(2026, 0, 1).getTime());
  assert.equal(calendarDaysInclusive(start, new Date(2026, 0, 1).getTime()), 1);
  const now = Date.now();
  const todayStart = startOfDay(now);
  assert.equal(calendarDaysInclusive(todayStart, now), 1);
  const html = gesamtViewtimePerDayHtml(3, todayStart);
  assert.match(html, /Ø 3,0 h \/ Tag/);
});

function loadHistorieModule(deps) {
  const wrapped = src.replace("let deps = {};", "let deps = __deps;");
  const fn = new Function("__deps", "window", `${wrapped}\nreturn window.CinexHistorie;`);
  const CinexHistorie = fn(deps, {});
  CinexHistorie.init(deps);
  return CinexHistorie;
}

function parseViewsList(row) {
  if (!row || typeof row !== "object") return [];
  const raw = Array.isArray(row.views) ? row.views : (row.at ? [row.at] : []);
  return raw.map((v) => {
    if (typeof v === "number") return { at: v, f: 1 };
    if (v && typeof v === "object") {
      const at = Number(v.at);
      const f = v.f != null ? Number(v.f) : 1;
      return Number.isFinite(at) ? { at, f } : null;
    }
    return null;
  }).filter(Boolean);
}

function canonicalListFilmId(id) {
  const sid = String(id);
  const n = Number(sid.replace(/^t/i, ""));
  if (Number.isFinite(n) && n > 0) return `t${n}`;
  return sid;
}

test("Filme KPI and Top 5 ignore video history views", () => {
  const filmHistory = [
    { id: "t680", title: "Pulp Fiction", at: Date.now() - 2000 },
    { id: "t550", title: "Fight Club", at: Date.now() - 4000 },
  ];
  const videoHistory = [
    { id: "v-seed-h1", title: "Recap", at: Date.now() - 1000 },
    { id: "v-seed-h2", title: "Reel", at: Date.now() - 3000 },
  ];
  const CinexHistorie = loadHistorieModule({
    history: () => filmHistory,
    videoHistory: () => videoHistory,
    findFilm: () => null,
    parseViewsList,
    canonicalListFilmId,
  });
  const model = CinexHistorie.buildModel({ historieInterval: "gesamt", historieAnchor: Date.now() });
  const stats = model.stats;
  assert.equal(stats.count, 4);
  assert.equal(stats.films.complete, 2);
  const top = [...stats.byFilm.values()].filter((row) => row.kind !== "video" && row.score > 0);
  assert.equal(top.length, 2);
});
