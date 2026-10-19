import test from "node:test";
import assert from "node:assert/strict";

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

  const removedTagIds = new Set();
  const nextTags = [];
  (Array.isArray(tags) ? tags : []).forEach((tag) => {
    if (!tag || typeof tag !== "object" || tag.id == null) return;
    const id = String(tag.id);
    const onFilm = usedOnFilm.has(id);
    const onVideo = usedOnVideo.has(id);
    const scope = tagScopeOf(tag);
    if (scope === "video" || (onVideo && !onFilm)) {
      removedTagIds.add(id);
      return;
    }
    nextTags.push(Object.assign({}, tag, { scope: "film" }));
  });

  const nextMap = {};
  Object.entries(map).forEach(([entityId, tagIds]) => {
    if (isVideoEntityId(entityId)) return;
    const cleaned = (Array.isArray(tagIds) ? tagIds : [])
      .map(String)
      .filter((tid) => !removedTagIds.has(tid));
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
  const migA = Number((a.profileMeta || {}).tagsScopeMigrated) || 0;
  const migB = Number((b.profileMeta || {}).tagsScopeMigrated) || 0;
  if (Math.max(migA, migB) >= TAG_SCOPE_MIGRATION_VERSION) {
    Object.keys(merged).forEach((id) => {
      if (isVideoEntityId(id)) delete merged[id];
    });
  }
  return merged;
}

test("migration keeps film tags and strips video-only tags", () => {
  const tags = [
    { id: "tag-omma", name: "Omma" },
    { id: "tag-tut", name: "Tutorial" },
  ];
  const filmTags = {
    t862: ["tag-omma"],
    "v-1": ["tag-tut"],
  };
  const out = migrateTagsScopeData(tags, filmTags);
  assert.equal(out.tags.length, 1);
  assert.equal(out.tags[0].id, "tag-omma");
  assert.equal(out.tags[0].scope, "film");
  assert.deepEqual(out.filmTags, { t862: ["tag-omma"] });
  assert.equal(out.profileMeta.tagsScopeMigrated, TAG_SCOPE_MIGRATION_VERSION);
});

test("merge does not resurrect video tag assignments after migration", () => {
  const local = {
    profileMeta: { tagsScopeMigrated: 1 },
    filmTags: { t1: ["tag-a"] },
  };
  const remote = {
    profileMeta: { tagsScopeMigrated: 0 },
    filmTags: { "v-remote": ["tag-old"], t1: ["tag-a"] },
  };
  const merged = mergeFilmTagsWithScopeGuard(local, remote);
  assert.deepEqual(merged, { t1: ["tag-a"] });
});
