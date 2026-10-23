import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const TAG_SCOPE_MIGRATION_VERSION = 1;

function isVideoEntityId(id) {
  return String(id || "").startsWith("v-");
}

function tagScopeOf(tag) {
  if (!tag || typeof tag !== "object") return "film";
  return tag.scope === "video" ? "video" : "film";
}

function migrateTagsScopeData(tags, filmTags) {
  const map = filmTags && typeof filmTags === "object" ? filmTags : {};
  const usedOnFilm = new Set();
  const usedOnVideo = new Set();
  Object.entries(map).forEach(([entityId, tagIds]) => {
    const ids = Array.isArray(tagIds) ? tagIds : [];
    if (isVideoEntityId(entityId)) ids.forEach((tid) => usedOnVideo.add(String(tid)));
    else ids.forEach((tid) => usedOnFilm.add(String(tid)));
  });

  const nextTags = [];
  (Array.isArray(tags) ? tags : []).forEach((tag) => {
    if (!tag || typeof tag !== "object" || tag.id == null) return;
    const id = String(tag.id);
    const onFilm = usedOnFilm.has(id);
    const onVideo = usedOnVideo.has(id);
    const scope = tagScopeOf(tag);
    let nextScope = "film";
    if (onFilm) nextScope = "film";
    else if (onVideo || scope === "video") nextScope = "video";
    nextTags.push(Object.assign({}, tag, { scope: nextScope }));
  });

  const nextMap = {};
  Object.entries(map).forEach(([entityId, tagIds]) => {
    const cleaned = (Array.isArray(tagIds) ? tagIds : []).map(String);
    if (cleaned.length) nextMap[entityId] = cleaned;
  });

  return {
    tags: nextTags,
    filmTags: nextMap,
    profileMeta: { tagsScopeMigrated: TAG_SCOPE_MIGRATION_VERSION },
  };
}

function mergeFilmTagsWithScopeGuard(localBag, remoteBag) {
  const a = localBag || {};
  const b = remoteBag || {};
  const fa = a.filmTags || {};
  const fb = b.filmTags || {};
  const keys = new Set([...Object.keys(fa), ...Object.keys(fb)]);
  const merged = {};
  keys.forEach((id) => {
    const va = fa[id];
    const vb = fb[id];
    if (Array.isArray(va) && Array.isArray(vb)) {
      merged[id] = [...new Set([...va, ...vb].map(String))];
    } else {
      merged[id] = vb !== undefined ? vb : va;
    }
  });
  return merged;
}

test("migration sets scopes and keeps video tag assignments", () => {
  const tags = [
    { id: "tag-omma", name: "Omma" },
    { id: "tag-tut", name: "Tutorial" },
  ];
  const filmTags = {
    t862: ["tag-omma"],
    "v-1": ["tag-tut"],
  };
  const out = migrateTagsScopeData(tags, filmTags);
  assert.equal(out.tags.length, 2);
  const byId = Object.fromEntries(out.tags.map((t) => [t.id, t]));
  assert.equal(byId["tag-omma"].scope, "film");
  assert.equal(byId["tag-tut"].scope, "video");
  assert.deepEqual(out.filmTags, filmTags);
  assert.equal(out.profileMeta.tagsScopeMigrated, TAG_SCOPE_MIGRATION_VERSION);
});

test("merge keeps video entity keys after scope migration", () => {
  const local = {
    profileMeta: { tagsScopeMigrated: 1 },
    filmTags: { t1: ["tag-a"], "v-local": ["tag-v"] },
  };
  const remote = {
    profileMeta: { tagsScopeMigrated: 0 },
    filmTags: { "v-remote": ["tag-old"], t1: ["tag-a"] },
  };
  const merged = mergeFilmTagsWithScopeGuard(local, remote);
  assert.deepEqual(merged, {
    t1: ["tag-a"],
    "v-local": ["tag-v"],
    "v-remote": ["tag-old"],
  });
});

test("tag saves schedule debounced cloud sync", () => {
  const src = readFileSync(new URL("../app.js", import.meta.url), "utf8");
  const fnBodies = [
    "function saveTags(list)",
    "function saveFilmTags(map)",
    "function saveTagCovers(list)",
  ];
  fnBodies.forEach((sig) => {
    const start = src.indexOf(sig);
    assert.ok(start >= 0, `missing ${sig}`);
    const slice = src.slice(start, start + 280);
    assert.match(slice, /scheduleDebouncedSync\(\)/, `${sig} must call scheduleDebouncedSync`);
  });
});
