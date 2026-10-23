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
