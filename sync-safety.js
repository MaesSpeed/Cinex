// Pure helpers for Cinex cloud sync. Classic script (window.WDQSync) and CJS.
(function (root, factory) {
  var api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.WDQSync = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  var AUTH_EXPIRED_NOTICE = "Bitte neu anmelden – deine Änderungen sind gerade nur auf diesem Gerät.";
  var LIST_SUFFIXES = {
    watchlist: "watchlist",
    queue: "queue",
    history: "history",
    tags: "tags",
    videoWatchlist: "videoWatchlist",
    videoQueue: "videoQueue",
    videoHistory: "videoHistory",
  };
  var FILM_TAG_META = { updatedAt: 1, deleted: 1, id: 1, at: 1 };

  function tsOf(value) {
    if (value == null) return 0;
    if (typeof value === "number" && isFinite(value)) return value;
    var n = Date.parse(String(value));
    return isFinite(n) ? n : 0;
  }

  function rowFingerprint(row) {
    if (!row || typeof row !== "object") return JSON.stringify(row);
    var keys = Object.keys(row).filter(function (key) { return key !== "updatedAt"; }).sort();
    var slim = {};
    keys.forEach(function (key) { slim[key] = row[key]; });
    return JSON.stringify(slim);
  }

  function stampChangedRows(prev, next, now) {
    var prevList = Array.isArray(prev) ? prev : [];
    var byId = new Map();
    prevList.forEach(function (row) {
      if (row && typeof row === "object" && row.id != null) byId.set(String(row.id), row);
    });
    return (Array.isArray(next) ? next : []).map(function (row) {
      if (!row || typeof row !== "object") return row;
      var old = row.id != null ? byId.get(String(row.id)) : null;
      if (old && rowFingerprint(old) === rowFingerprint(row)) {
        var keep = old.updatedAt || row.updatedAt;
        if (keep) return Object.assign({}, row, { updatedAt: keep });
        return Object.assign({}, row, { updatedAt: now });
      }
      return Object.assign({}, row, { updatedAt: now });
    });
  }

  function sanitizeFilmTagsMap(raw) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
    var out = {};
    Object.keys(raw).forEach(function (key) {
      if (FILM_TAG_META[key]) return;
      var val = raw[key];
      if (!Array.isArray(val)) return;
      out[key] = val.map(function (id) { return String(id); });
    });
    return out;
  }

  function stableStringify(value) {
    if (value === null || typeof value !== "object") return JSON.stringify(value);
    if (Array.isArray(value)) {
      return "[" + value.map(stableStringify).join(",") + "]";
    }
    var keys = Object.keys(value).sort();
    return "{" + keys.map(function (key) {
      return JSON.stringify(key) + ":" + stableStringify(value[key]);
    }).join(",") + "}";
  }

  function stripVolatile(value) {
    if (Array.isArray(value)) return value.map(stripVolatile);
    if (!value || typeof value !== "object") return value;
    var out = {};
    Object.keys(value).forEach(function (key) {
      if (key === "collectedAt" || key === "updatedAt") return;
      out[key] = stripVolatile(value[key]);
    });
    return out;
  }

  function syncPayloadEqual(a, b) {
    return stableStringify(stripVolatile(a)) === stableStringify(stripVolatile(b));
  }

  function newerWins(a, b) {
    var ta = tsOf(a && a.updatedAt) || tsOf(a && a.at) || 0;
    var tb = tsOf(b && b.updatedAt) || tsOf(b && b.at) || 0;
    if (ta === tb) return b;
    return ta > tb ? a : b;
  }

  function mergeArrayById(localArr, remoteArr) {
    var map = new Map();
    (Array.isArray(localArr) ? localArr : []).forEach(function (row) {
      if (!row || row.id == null) return;
      map.set(String(row.id), row);
    });
    (Array.isArray(remoteArr) ? remoteArr : []).forEach(function (row) {
      if (!row || row.id == null) return;
      var key = String(row.id);
      if (!map.has(key)) map.set(key, row);
      else map.set(key, newerWins(map.get(key), row));
    });
    return Array.from(map.values()).filter(function (row) { return row && !row.deleted; });
  }

  function asProfileTomb(row) {
    if (!row || row.id == null || row.deleted === false) return null;
    if (row.kind && row.kind !== "profile") return null;
    return {
      id: String(row.id),
      kind: "profile",
      deleted: true,
      updatedAt: row.updatedAt || new Date(0).toISOString(),
    };
  }

  function mergeProfileTombstones(localRows, remoteRows) {
    var map = new Map();
    []
      .concat(Array.isArray(localRows) ? localRows : [])
      .concat(Array.isArray(remoteRows) ? remoteRows : [])
      .forEach(function (row) {
        var tomb = asProfileTomb(row);
        if (!tomb) return;
        var prev = map.get(tomb.id);
        if (!prev || tsOf(tomb.updatedAt) >= tsOf(prev.updatedAt)) map.set(tomb.id, tomb);
      });
    return Array.from(map.values());
  }

  function mergeProfilesWithTombstones(localProfiles, remoteProfiles, localTombs, remoteTombs) {
    var tombs = mergeProfileTombstones(localTombs, remoteTombs);
    var byId = new Map(tombs.map(function (row) { return [row.id, row]; }));
    var profiles = mergeArrayById(localProfiles, remoteProfiles).filter(function (p) {
      if (!p || p.id == null) return false;
      var tomb = byId.get(String(p.id));
      if (!tomb) return true;
      return tsOf(p.updatedAt) > tsOf(tomb.updatedAt);
    });
    var kept = new Set(profiles.map(function (p) { return String(p.id); }));
    var droppedIds = tombs.map(function (row) { return row.id; }).filter(function (id) {
      return !kept.has(id);
    });
    return { profiles: profiles, profileTombstones: tombs, droppedIds: droppedIds };
  }

  function parseJson(raw) {
    try { return JSON.parse(raw); } catch (err) { return undefined; }
  }

  function profileKeyParts(key) {
    var m = /^wdq\.p\.([^.]+)\.([^.]+)\.([^.]+)$/.exec(key);
    if (!m) return null;
    return { userId: m[1], pid: m[2], suf: m[3] };
  }

  function restampBackupKeys(keys, now) {
    var source = keys && typeof keys === "object" ? keys : {};
    var out = {};
    Object.keys(source).forEach(function (key) { out[key] = source[key]; });
    var kept = {};
    Object.keys(out).forEach(function (key) {
      var parts = profileKeyParts(key);
      if (!parts || !LIST_SUFFIXES[parts.suf]) return;
      var parsed = parseJson(out[key]);
      if (!Array.isArray(parsed)) return;
      var bucket = parts.userId + "\n" + parts.pid;
      if (!kept[bucket]) kept[bucket] = {};
      if (!kept[bucket][parts.suf]) kept[bucket][parts.suf] = new Set();
      var next = parsed.map(function (row) {
        if (!row || typeof row !== "object") return row;
        if (row.id != null) kept[bucket][parts.suf].add(String(row.id));
        return Object.assign({}, row, { updatedAt: now });
      });
      out[key] = JSON.stringify(next);
    });
    Object.keys(out).forEach(function (key) {
      var parts = profileKeyParts(key);
      if (!parts || parts.suf !== "_tombstones") return;
      var parsed = parseJson(out[key]);
      if (!Array.isArray(parsed)) return;
      var bucket = kept[parts.userId + "\n" + parts.pid] || {};
      var next = parsed.filter(function (row) {
        if (!row || row.id == null || !row.kind) return true;
        var ids = bucket[row.kind];
        if (!ids) return true;
        return !ids.has(String(row.id));
      });
      out[key] = JSON.stringify(next);
    });
    var restoredProfiles = {};
    Object.keys(out).forEach(function (key) {
      var m = /^wdq\.profiles\.([^.]+)$/.exec(key);
      if (!m) return;
      var parsed = parseJson(out[key]);
      if (!Array.isArray(parsed)) return;
      restoredProfiles[m[1]] = new Set();
      var next = parsed.map(function (row) {
        if (!row || typeof row !== "object") return row;
        if (row.id != null) restoredProfiles[m[1]].add(String(row.id));
        return Object.assign({}, row, { updatedAt: now });
      });
      out[key] = JSON.stringify(next);
    });
    Object.keys(out).forEach(function (key) {
      var m = /^wdq\.profileTombstones\.([^.]+)$/.exec(key);
      if (!m) return;
      var parsed = parseJson(out[key]);
      if (!Array.isArray(parsed)) return;
      var ids = restoredProfiles[m[1]] || new Set();
      var next = parsed.filter(function (row) {
        if (!row || row.id == null) return true;
        return !ids.has(String(row.id));
      });
      out[key] = JSON.stringify(next);
    });
    Object.keys(out).forEach(function (key) {
      var parts = profileKeyParts(key);
      if (!parts || (parts.suf !== "ratings" && parts.suf !== "ratingsSync")) return;
      var parsed = parseJson(out[key]);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return;
      var next = {};
      Object.keys(parsed).forEach(function (id) {
        var cell = parsed[id];
        if (cell && typeof cell === "object") next[id] = Object.assign({}, cell, { updatedAt: now });
        else next[id] = { value: cell, updatedAt: now };
      });
      if (parts.suf === "ratings") out[key] = JSON.stringify(parsed);
      var syncKey = "wdq.p." + parts.userId + "." + parts.pid + ".ratingsSync";
      if (parts.suf === "ratingsSync" || !out[syncKey]) out[syncKey] = JSON.stringify(next);
      else if (parts.suf === "ratingsSync") out[key] = JSON.stringify(next);
    });
    return out;
  }

  function lossPhrase(loss) {
    var n = Number(loss && loss.lost) || 0;
    var field = loss && loss.field;
    if (field === "watchlist") return n === 1 ? "1 Film" : n + " Filme";
    if (field === "history") return n === 1 ? "1 gesehener Film" : n + " gesehene Filme";
    if (field === "ratings") return n === 1 ? "1 Bewertung" : n + " Bewertungen";
    if (field === "profiles") return n === 1 ? "1 Profil" : n + " Profile";
    return n + " Einträge";
  }

  function joinGerman(parts) {
    if (parts.length <= 1) return parts[0] || "";
    if (parts.length === 2) return parts[0] + " und " + parts[1];
    return parts.slice(0, -1).join(", ") + " und " + parts[parts.length - 1];
  }

  function shrinkDialogCopy(losses) {
    var list = Array.isArray(losses) ? losses : [];
    var wiped = list.some(function (loss) { return loss && loss.nullData; });
    if (wiped) {
      return {
        title: "Wirklich so speichern?",
        text: "Auf diesem Gerät fehlen die Kontodaten. Wirklich so speichern?",
      };
    }
    if (list.length === 1) {
      var loss = list[0];
      var n = Number(loss.lost) || 0;
      var noun = lossPhrase(loss);
      var verb = n === 1 ? "fehlt" : "fehlen";
      return {
        title: "Wirklich so speichern?",
        text: "Auf diesem Gerät " + verb + " " + noun + ". Wirklich so speichern?",
      };
    }
    var parts = list.map(lossPhrase).filter(Boolean);
    return {
      title: "Wirklich so speichern?",
      text: "Auf diesem Gerät fehlen " + joinGerman(parts) + ". Wirklich so speichern?",
    };
  }

  return {
    AUTH_EXPIRED_NOTICE: AUTH_EXPIRED_NOTICE,
    stampChangedRows: stampChangedRows,
    sanitizeFilmTagsMap: sanitizeFilmTagsMap,
    syncPayloadEqual: syncPayloadEqual,
    mergeProfilesWithTombstones: mergeProfilesWithTombstones,
    restampBackupKeys: restampBackupKeys,
    shrinkDialogCopy: shrinkDialogCopy,
    rowFingerprint: rowFingerprint,
  };
});
