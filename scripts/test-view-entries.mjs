import test from "node:test";
import assert from "node:assert/strict";

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

test("parseViewsList accepts mixed legacy and {at,f} entries", () => {
  const row = {
    id: "t1",
    at: 2000,
    views: [{ at: 3000, f: 0.4 }, 2000, { at: 1000, f: 0.25 }],
  };
  const detailed = parseViewsList(row);
  assert.equal(detailed.length, 3);
  assert.equal(detailed[0].at, 3000);
  assert.equal(detailed[0].f, 0.4);
  assert.equal(detailed[1].at, 2000);
  assert.equal(detailed[1].f, 1);
  assert.equal(detailed[2].f, 0.25);
  const compact = compactViewsList(detailed);
  assert.equal(compact[0].f, 0.4);
  assert.equal(compact[1], 2000);
  assert.equal(compact[2].f, 0.25);
  assert.deepEqual(parseViewsList(row).map((v) => v.at), [3000, 2000, 1000]);
});
