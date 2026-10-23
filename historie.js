(() => {
  "use strict";

  /** @type {Record<string, unknown>} */
  let deps = {};

  const INTERVALS = ["woche", "monat", "jahr", "gesamt"];
  const MONTH_NAMES = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember",
  ];
  const MONTH_SHORT = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
  const DAY_FULL = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  const DAY_SHORT = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  const GENRE_PALETTE = ["#0b3a63", "#1a4f8a", "#2d6ba8", "#5aa8d4", "#d4926a", "#7ebce0", "#3d7eb8"];

  function init(d) {
    deps = d || {};
  }

  function esc(s) {
    return deps.escapeHtml ? deps.escapeHtml(String(s)) : String(s);
  }

  function fmtNum(n, decimals) {
    const d = decimals == null ? 0 : decimals;
    const v = Number(n);
    if (!Number.isFinite(v)) return "0";
    return v.toLocaleString("de-DE", {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    });
  }

  function fmtHours(h) {
    const v = Number(h);
    if (!Number.isFinite(v)) return "0 h";
    if (v >= 10) return `${fmtNum(Math.round(v), 0)} h`;
    return `${fmtNum(v, 1)} h`;
  }

  function fmtPct(f) {
    return `${Math.round(Number(f) * 100)}`;
  }

  function startOfDay(ts) {
    const d = new Date(ts);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }

  function addDays(ts, n) {
    const d = new Date(ts);
    d.setDate(d.getDate() + n);
    return d.getTime();
  }

  function mondayOf(ts) {
    const d = new Date(ts);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }

  function isoWeek(ts) {
    const d = new Date(ts);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
    const week1 = new Date(d.getFullYear(), 0, 4);
    return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  }

  function startOfMonth(ts) {
    const d = new Date(ts);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }

  function startOfYear(ts) {
    const d = new Date(ts);
    d.setMonth(0, 1);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }

  function endOfMonth(ts) {
    const d = new Date(ts);
    d.setMonth(d.getMonth() + 1, 0);
    d.setHours(23, 59, 59, 999);
    return d.getTime();
  }

  function runtimeMinutes(meta) {
    if (!meta) return 0;
    const m = Number(meta.minutes || meta.runtime);
    if (Number.isFinite(m) && m > 0) return m;
    if (meta.kind === "video") return 45;
    return 0;
  }

  function collectEvents() {
    const out = [];
    const history = deps.history || (() => []);
    const videoHistory = deps.videoHistory || (() => []);
    const findFilm = deps.findFilm || (() => null);
    const parseViewsList = deps.parseViewsList;

    const pushRow = (row, kind) => {
      if (!row || !parseViewsList) return;
      const views = parseViewsList(row);
      const film = kind === "film" ? findFilm(row.id) : null;
      const meta = film || row;
      const genres = (film && film.genres) || [];
      const cast = (film && film.cast) || [];
      const title = (film && film.title) || row.title || "";
      const id = String(row.id || "");
      views.forEach((v) => {
        out.push({
          at: v.at,
          f: v.f >= 0.9999 ? 1 : v.f,
          id,
          title,
          genres,
          cast,
          meta,
          kind,
          minutes: runtimeMinutes({ ...meta, kind }),
        });
      });
    };

    history().forEach((row) => pushRow(row, "film"));
    videoHistory().forEach((row) => pushRow(row, "video"));
    out.sort((a, b) => b.at - a.at);
    return out;
  }

  function periodRange(interval, anchor) {
    const a = Number(anchor) || Date.now();
    if (interval === "woche") {
      const start = mondayOf(a);
      return { start, end: addDays(start, 7) - 1, label: "woche" };
    }
    if (interval === "monat") {
      const start = startOfMonth(a);
      return { start, end: endOfMonth(a), label: "monat" };
    }
    if (interval === "jahr") {
      const start = startOfYear(a);
      const end = startOfYear(a);
      const d = new Date(end);
      d.setFullYear(d.getFullYear() + 1);
      return { start, end: d.getTime() - 1, label: "jahr" };
    }
    const events = collectEvents();
    const first = events.length ? events[events.length - 1].at : a;
    return { start: startOfDay(first), end: Date.now(), label: "gesamt" };
  }

  function inRange(at, start, end) {
    return at >= start && at <= end;
  }

  function statsForEvents(events) {
    let viewMin = 0;
    let complete = 0;
    let partial = 0;
    let partialSum = 0;
    const byDay = new Map();
    const byFilm = new Map();

    events.forEach((e) => {
      const mins = e.minutes * e.f;
      viewMin += mins;
      if (e.f >= 0.9999) complete += 1;
      else {
        partial += 1;
        partialSum += e.f;
      }
      const day = startOfDay(e.at);
      const slot = byDay.get(day) || { score: 0, complete: 0, partial: 0, partialSum: 0 };
      slot.score += e.f;
      if (e.f >= 0.9999) slot.complete += 1;
      else {
        slot.partial += 1;
        slot.partialSum += e.f;
      }
      byDay.set(day, slot);

      const prev = byFilm.get(e.id) || { complete: 0, partial: 0, partialSum: 0, score: 0, title: e.title, meta: e.meta };
      if (e.f >= 0.9999) prev.complete += 1;
      else {
        prev.partial += 1;
        prev.partialSum += e.f;
      }
      prev.score += e.f;
      prev.title = e.title || prev.title;
      prev.meta = e.meta || prev.meta;
      byFilm.set(e.id, prev);
    });

    const partialAvg = partial ? partialSum / partial : 0;
    const avgFrac = events.length ? events.reduce((s, e) => s + e.f, 0) / events.length : 0;
    return {
      viewHours: viewMin / 60,
      complete,
      partial,
      partialAvg,
      avgFrac,
      byDay,
      byFilm,
      count: events.length,
    };
  }

  function bucketWeeks(all) {
    const map = new Map();
    all.forEach((e) => {
      const k = mondayOf(e.at);
      const list = map.get(k) || [];
      list.push(e);
      map.set(k, list);
    });
    return map;
  }

  function bucketMonths(all) {
    const map = new Map();
    all.forEach((e) => {
      const k = startOfMonth(e.at);
      const list = map.get(k) || [];
      list.push(e);
      map.set(k, list);
    });
    return map;
  }

  function bucketYears(all) {
    const map = new Map();
    all.forEach((e) => {
      const k = startOfYear(e.at);
      const list = map.get(k) || [];
      list.push(e);
      map.set(k, list);
    });
    return map;
  }

  function avgOfBuckets(map) {
    const vals = [...map.values()].map((ev) => statsForEvents(ev));
    if (!vals.length) return null;
    const n = vals.length;
    return {
      viewHours: vals.reduce((s, v) => s + v.viewHours, 0) / n,
      complete: vals.reduce((s, v) => s + v.complete, 0) / n,
      partial: vals.reduce((s, v) => s + v.partial, 0) / n,
      partialAvg: vals.reduce((s, v) => s + v.partialAvg, 0) / n,
    };
  }

  function trendHtml(delta, unit, invert) {
    if (!Number.isFinite(delta) || Math.abs(delta) < 0.05) return "";
    const up = delta > 0;
    const good = invert ? !up : up;
    const cls = good ? "is-up" : "is-down";
    const arrow = up ? "▲" : "▼";
    const abs = fmtNum(Math.abs(delta), unit === "h" ? 1 : 0);
    const suffix = unit === "h" ? ` ${unit}` : unit ? ` ${unit}` : "";
    const vs = up ? "über Ø" : "unter Ø";
    return `<p class="hist-trend ${cls}"><span aria-hidden="true">${arrow}</span> ${abs}${suffix} ${vs}</p>`;
  }

  function trendFilmeHtml(cur, avg) {
    const dc = cur.complete - avg.complete;
    const dp = cur.partial - avg.partial;
    if (Math.abs(dc) < 0.05 && Math.abs(dp) < 0.05) return "";
    const parts = [];
    if (Math.abs(dc) >= 0.05) {
      const up = dc > 0;
      parts.push(`<span class="${up ? "is-up" : "is-down"}">${up ? "▲" : "▼"} ${fmtNum(Math.abs(dc), 0)} kompl.</span>`);
    }
    if (Math.abs(dp) >= 0.05) {
      const up = dp > 0;
      parts.push(`<span class="${up ? "is-up" : "is-down"}">${up ? "▲" : "▼"} ${fmtNum(Math.abs(dp), 0)} teilw.</span>`);
    }
    return `<p class="hist-trend hist-trend-split">${parts.join(" ")}</p>`;
  }

  function kpiViewtime(cur, avg, intervalLabel) {
    const intervalNames = { woche: "Woche", monat: "Monat", jahr: "Jahr" };
    const name = intervalNames[intervalLabel] || "";
    const avgLine = avg && name ? `<p class="hist-kpi-sub">Ø ${name} ${fmtHours(avg.viewHours)}</p>` : "";
    const trend = avg && name ? trendHtml(cur.viewHours - avg.viewHours, "h") : "";
    return `
      <article class="hist-card hist-kpi hist-kpi-viewtime">
        <p class="hist-kpi-label">Viewtime</p>
        <p class="hist-kpi-value">${fmtHours(cur.viewHours)}</p>
        ${avgLine}
        ${trend}
      </article>
    `;
  }

  function kpiFilme(cur, avg, showTrend) {
    const partialPct = cur.partial ? fmtPct(cur.partialAvg) : "0";
    const avgPart = avg ? `Ø ${fmtNum(Math.round(avg.complete), 0)} komplett · ${fmtNum(Math.round(avg.partial), 0)} teilweise` : "";
    return `
      <article class="hist-card hist-kpi hist-kpi-filme">
        <p class="hist-kpi-label">Filme</p>
        <div class="hist-filme-main">
          <p><strong>${fmtNum(cur.complete, 0)}</strong> komplett</p>
          <p><strong>${fmtNum(cur.partial, 0)}</strong> teilweise <span class="hist-muted">zu Ø ${partialPct} %</span></p>
        </div>
        ${avgPart ? `<p class="hist-kpi-sub">${avgPart}</p>` : ""}
        ${showTrend && avg ? trendFilmeHtml(cur, avg) : ""}
      </article>
    `;
  }

  function topActivityCaption(byDay, weekStart) {
    let best = null;
    let bestScore = -1;
    byDay.forEach((slot, dayTs) => {
      if (slot.score > bestScore) {
        bestScore = slot.score;
        best = { dayTs, slot };
      }
    });
    if (!best || bestScore <= 0) return "";
    const d = new Date(best.dayTs);
    const name = DAY_FULL[d.getDay()];
    const avgP = best.slot.partial ? Math.round((best.slot.partialSum / best.slot.partial) * 100) : 0;
    const dateBit = weekStart != null ? "" : ` ${d.getDate()}.${d.getMonth() + 1}.`;
    return `Top: ${name}${dateBit} (${best.slot.complete} komplett & ${best.slot.partial} teilweise mit Ø${avgP}%)`;
  }

  function heatLevel(score, max) {
    if (!max || score <= 0) return 0;
    const r = score / max;
    if (r >= 0.75) return 4;
    if (r >= 0.5) return 3;
    if (r >= 0.25) return 2;
    if (r > 0) return 1;
    return 0;
  }

  function activityWeekHtml(stats, range) {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const ts = addDays(range.start, i);
      days.push({ ts, label: DAY_SHORT[new Date(ts).getDay()], slot: stats.byDay.get(startOfDay(ts)) });
    }
    const max = Math.max(...days.map((d) => (d.slot ? d.slot.score : 0)), 0.001);
    const cells = days.map((d) => {
      const lvl = heatLevel(d.slot ? d.slot.score : 0, max);
      return `<div class="hist-heat-cell lv-${lvl}" title="${esc(d.label)}"><span>${esc(d.label)}</span></div>`;
    }).join("");
    const kw = isoWeek(range.start);
    const end = addDays(range.start, 6);
    const endD = new Date(end);
    const startD = new Date(range.start);
    const rangeLabel = `${startD.getDate()}.–${endD.getDate()}.${endD.getMonth() + 1}.`;
    const caption = topActivityCaption(stats.byDay, range.start);
    return `
      <article class="hist-card">
        <header class="hist-card-head">
          <h3>Aktivität</h3>
          <p class="hist-card-sub">KW ${kw} · Heat nach Anteils-Score</p>
        </header>
        <div class="hist-heat-row">${cells}</div>
        <div class="hist-heat-legend" aria-hidden="true">
          <span>weniger</span>
          ${[0, 1, 2, 3, 4].map((i) => `<i class="lv-${i}"></i>`).join("")}
          <span>mehr</span>
        </div>
        ${caption ? `<p class="hist-caption">${esc(caption)}</p>` : ""}
      </article>
    `;
  }

  function activityMonthHtml(stats, range) {
    const months = [];
    for (let m = -3; m <= 0; m++) {
      const d = new Date(range.start);
      d.setMonth(d.getMonth() + m, 1);
      months.push(startOfMonth(d.getTime()));
    }
    const maxScore = Math.max(...[...stats.byDay.values()].map((s) => s.score), 0.001);
    const cells = [];
    months.forEach((monthStart) => {
      const md = new Date(monthStart);
      const label = MONTH_SHORT[md.getMonth()];
      const dim = new Date(md.getFullYear(), md.getMonth() + 1, 0).getDate();
      let grid = "";
      for (let day = 1; day <= dim; day++) {
        const ts = startOfDay(new Date(md.getFullYear(), md.getMonth(), day).getTime());
        const slot = stats.byDay.get(ts);
        const lvl = heatLevel(slot ? slot.score : 0, maxScore);
        grid += `<span class="hist-cal-day lv-${lvl}"></span>`;
      }
      cells.push(`<div class="hist-cal-month"><p>${label}</p><div class="hist-cal-grid">${grid}</div></div>`);
    });
    const caption = topActivityCaption(stats.byDay, null);
    return `
      <article class="hist-card">
        <header class="hist-card-head">
          <h3>Aktivität</h3>
          <p class="hist-card-sub">Tage · Heat nach Anteils-Score</p>
        </header>
        <div class="hist-cal-wrap">${cells.join("")}</div>
        <div class="hist-heat-legend" aria-hidden="true">
          <span>weniger</span>
          ${[0, 1, 2, 3, 4].map((i) => `<i class="lv-${i}"></i>`).join("")}
          <span>mehr</span>
        </div>
        ${caption ? `<p class="hist-caption">${esc(caption)}</p>` : ""}
      </article>
    `;
  }

  function barGroupHtml(label, complete, partial, highlight) {
    const max = Math.max(complete, partial, 1);
    const ch = 100;
    const hC = Math.round((complete / max) * ch);
    const hP = Math.round((partial / max) * ch);
    return `
      <div class="hist-bar-group${highlight ? " is-hi" : ""}">
        <div class="hist-bar-pair">
          <span class="hist-bar-val">${complete || ""}</span>
          <div class="hist-bar complete" style="height:${hC}px"></div>
          <span class="hist-bar-val light">${partial || ""}</span>
          <div class="hist-bar partial" style="height:${hP}px"></div>
        </div>
        <span class="hist-bar-label">${esc(label)}</span>
      </div>
    `;
  }

  function chartBarsWeeks(all, currentStart) {
    const buckets = bucketWeeks(all);
    const keys = [...buckets.keys()].sort((a, b) => a - b);
    const tail = keys.slice(-6);
    while (tail.length < 6 && tail.length) {
      const first = tail[0];
      tail.unshift(addDays(first, -7));
    }
    if (!tail.length) tail.push(mondayOf(currentStart));
    return tail.map((k) => {
      const ev = buckets.get(k) || [];
      const st = statsForEvents(ev);
      return barGroupHtml(`KW${isoWeek(k)}`, st.complete, st.partial, k === currentStart);
    }).join("");
  }

  function chartBarsMonths(all, currentStart) {
    const buckets = bucketMonths(all);
    const keys = [...buckets.keys()].sort((a, b) => a - b);
    const tail = keys.slice(-6);
    if (!tail.length) tail.push(startOfMonth(currentStart));
    return tail.map((k) => {
      const ev = buckets.get(k) || [];
      const st = statsForEvents(ev);
      const d = new Date(k);
      return barGroupHtml(MONTH_SHORT[d.getMonth()], st.complete, st.partial, k === currentStart);
    }).join("");
  }

  function chartBarsYearMonths(all, yearStart) {
    const end = startOfYear(yearStart);
    const d = new Date(end);
    d.setFullYear(d.getFullYear() + 1);
    const yearEnd = d.getTime();
    const inYear = all.filter((e) => e.at >= yearStart && e.at < yearEnd);
    const buckets = bucketMonths(inYear);
    const months = [];
    for (let m = 0; m < 12; m++) {
      const ts = new Date(new Date(yearStart).getFullYear(), m, 1).getTime();
      if (buckets.has(ts) || ts <= Date.now()) months.push(ts);
    }
    const show = months.slice(-6);
    return show.map((k) => {
      const st = statsForEvents(buckets.get(k) || []);
      const md = new Date(k);
      return barGroupHtml(MONTH_SHORT[md.getMonth()], st.complete, st.partial, md.getMonth() === new Date().getMonth() && md.getFullYear() === new Date().getFullYear());
    }).join("");
  }

  function chartBarsYears(all) {
    const buckets = bucketYears(all);
    const keys = [...buckets.keys()].sort((a, b) => a - b);
    return keys.map((k) => {
      const st = statsForEvents(buckets.get(k) || []);
      const y = new Date(k).getFullYear();
      return barGroupHtml(String(y), st.complete, st.partial, y === new Date().getFullYear());
    }).join("");
  }

  function genresHtml(events, periodLabel) {
    const map = new Map();
    events.forEach((e) => {
      const gs = e.genres && e.genres.length ? e.genres : ["Sonstige"];
      gs.forEach((g) => map.set(g, (map.get(g) || 0) + e.f));
    });
    const sorted = [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
    const total = sorted.reduce((s, [, v]) => s + v, 0) || 1;
    let angle = 0;
    const stops = sorted.map(([g, v], i) => {
      const pct = v / total;
      const c = GENRE_PALETTE[i % GENRE_PALETTE.length];
      const start = angle;
      angle += pct * 360;
      return `${c} ${start}deg ${angle}deg`;
    });
    const legend = sorted.map(([g, v], i) => {
      const pct = Math.round((v / total) * 100);
      const c = GENRE_PALETTE[i % GENRE_PALETTE.length];
      return `<li><span class="hist-genre-swatch" style="background:${c}"></span>${esc(g)} <strong>${pct} %</strong></li>`;
    }).join("");
    const filmCount = Math.round(events.reduce((s, e) => s + e.f, 0));
    return `
      <article class="hist-card">
        <header class="hist-card-head">
          <h3>Genres</h3>
          <p class="hist-card-sub">${esc(periodLabel)}</p>
        </header>
        <div class="hist-genre-row">
          <div class="hist-donut" style="background:conic-gradient(${stops.join(",")})" role="img" aria-label="Genre-Verteilung">
            <span class="hist-donut-center"><strong>${fmtNum(filmCount, 0)}</strong> Filme</span>
          </div>
          <ul class="hist-genre-legend">${legend}</ul>
        </div>
      </article>
    `;
  }

  function actorsHtml(events, periodLabel) {
    const map = new Map();
    events.forEach((e) => {
      if (!e.cast || !e.cast.length) return;
      e.cast.slice(0, 3).forEach((name) => {
        const row = map.get(name) || { name, score: 0 };
        row.score += e.f;
        map.set(name, row);
      });
    });
    const top = [...map.values()].sort((a, b) => b.score - a.score).slice(0, 5);
    if (!top.length) return "";
    const tiles = top.map((a, i) => {
      const initials = a.name.split(/\s+/).map((p) => p[0]).join("").slice(0, 2);
      return `
        <div class="hist-actor${i === 0 ? " is-top" : ""}">
          <div class="hist-actor-avatar" aria-hidden="true">${esc(initials)}</div>
          <p class="hist-actor-name">${esc(a.name.split(" ").pop())}</p>
          <p class="hist-actor-count">${fmtNum(Math.round(a.score), 0)} Filme</p>
        </div>
      `;
    }).join("");
    return `
      <article class="hist-card">
        <header class="hist-card-head">
          <h3>Top-Schauspieler</h3>
          <p class="hist-card-sub">${esc(periodLabel)}</p>
        </header>
        <div class="hist-actors">${tiles}</div>
      </article>
    `;
  }

  function viewstreak(events) {
    const days = new Set(events.map((e) => startOfDay(e.at)));
    if (!days.size) return 0;
    let streak = 0;
    let cursor = startOfDay(Date.now());
    while (days.has(cursor)) {
      streak += 1;
      cursor = addDays(cursor, -1);
    }
    return streak;
  }

  function favoriteDay(events, rangeStart, rangeEnd) {
    const byWd = Array.from({ length: 7 }, () => 0);
    events.forEach((e) => {
      const wd = new Date(e.at).getDay();
      byWd[wd] += e.f;
    });
    let bestIdx = 0;
    let maxScore = 0;
    byWd.forEach((score, i) => {
      if (score > maxScore) {
        maxScore = score;
        bestIdx = i;
      }
    });
    let weekdays = 0;
    if (rangeStart != null && rangeEnd != null) {
      for (let t = startOfDay(rangeStart); t <= rangeEnd; t = addDays(t, 1)) {
        if (new Date(t).getDay() === bestIdx) weekdays += 1;
      }
    } else if (events.length) {
      const min = events.reduce((m, e) => Math.min(m, e.at), events[0].at);
      const max = events.reduce((m, e) => Math.max(m, e.at), events[0].at);
      for (let t = startOfDay(min); t <= startOfDay(max); t = addDays(t, 1)) {
        if (new Date(t).getDay() === bestIdx) weekdays += 1;
      }
    }
    const avgDay = weekdays ? maxScore / weekdays : 0;
    return { name: DAY_FULL[bestIdx] || "—", avg: avgDay };
  }

  function kpiTrioHtml(events, range) {
    const streak = viewstreak(events);
    const avgFrac = events.length ? events.reduce((s, e) => s + e.f, 0) / events.length : 0;
    const fav = favoriteDay(events, range ? range.start : null, range ? range.end : null);
    return `
      <div class="hist-kpi-trio">
        <article class="hist-card hist-kpi hist-kpi-sm">
          <p class="hist-kpi-label">Viewstreak</p>
          <p class="hist-kpi-value">${fmtNum(streak, 0)} Tage</p>
        </article>
        <article class="hist-card hist-kpi hist-kpi-sm">
          <p class="hist-kpi-label">Ø-Anteil</p>
          <p class="hist-kpi-value"><span class="hist-pct-num">${fmtPct(avgFrac)}</span><span class="hist-pct-sym">%</span></p>
          <p class="hist-kpi-sub">je Film</p>
        </article>
        <article class="hist-card hist-kpi hist-kpi-sm">
          <p class="hist-kpi-label">Lieblingstag</p>
          <p class="hist-kpi-value hist-kpi-day">${esc(fav.name)}</p>
          <p class="hist-kpi-sub">Ø ${fmtNum(fav.avg, 1)}</p>
        </article>
      </div>
    `;
  }

  function topFilmsHtml(byFilm) {
    const ranked = [...byFilm.entries()]
      .map(([id, row]) => ({ id, ...row }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    if (!ranked.length) return "";
    const posterUrl = deps.posterUrl || (() => "");
    const findFilm = deps.findFilm || (() => null);
    const rows = ranked.map((row, i) => {
      const film = findFilm(row.id);
      const poster = film ? (posterUrl(film, "w92") || film.poster || "") : "";
      const rankCls = i === 0 ? "gold" : i === 1 ? "silver" : i === 2 ? "bronze" : "plain";
      const total = row.complete + row.partial;
      const completeW = total ? (row.complete / total) * 100 : 100;
      const partialW = total ? (row.partial / total) * 100 : 0;
      return `
        <li class="hist-top-film">
          <span class="hist-rank ${rankCls}">${i + 1}</span>
          ${poster ? `<img class="hist-top-poster" src="${esc(poster)}" alt="" width="40" height="60" decoding="async" referrerpolicy="no-referrer">` : `<span class="hist-top-poster is-ph"></span>`}
          <div class="hist-top-body">
            <p class="hist-top-title">${esc(row.title)}</p>
            <div class="hist-top-bar" aria-hidden="true">
              <span class="complete" style="width:${completeW}%"></span>
              <span class="partial" style="width:${partialW}%"></span>
            </div>
          </div>
          <div class="hist-top-score">
            <strong>${fmtNum(row.score, 1)}</strong>
            <span class="hist-top-meta">${row.complete} kompl. · ${row.partial} teilw.</span>
          </div>
        </li>
      `;
    }).join("");
    return `
      <article class="hist-card hist-card-top">
        <header class="hist-card-head">
          <h3>Top 5 Filme</h3>
          <p class="hist-card-sub">nach Anteils-Score</p>
        </header>
        <ol class="hist-top-list">${rows}</ol>
        <div class="hist-bar-legend" aria-hidden="true">
          <span><i class="complete"></i> komplett</span>
          <span><i class="partial"></i> teilweise</span>
        </div>
      </article>
    `;
  }

  function periodNavHtml(interval, anchor, range) {
    if (interval === "gesamt") {
      const d = new Date(range.start);
      const label = `Seit Beginn (ab ${d.getDate().toString().padStart(2, "0")}.${(d.getMonth() + 1).toString().padStart(2, "0")}.${d.getFullYear()})`;
      return `<p class="hist-period hist-period-gesamt">${esc(label)}</p>`;
    }
    const prev = interval === "woche" ? addDays(anchor, -7)
      : interval === "monat" ? new Date(new Date(anchor).getFullYear(), new Date(anchor).getMonth() - 1, 1).getTime()
      : new Date(new Date(anchor).getFullYear() - 1, 0, 1).getTime();
    const next = interval === "woche" ? addDays(anchor, 7)
      : interval === "monat" ? new Date(new Date(anchor).getFullYear(), new Date(anchor).getMonth() + 1, 1).getTime()
      : new Date(new Date(anchor).getFullYear() + 1, 0, 1).getTime();
    let center = "";
    if (interval === "woche") {
      const kw = isoWeek(range.start);
      const end = addDays(range.start, 6);
      const endD = new Date(end);
      const startD = new Date(range.start);
      center = `KW ${kw} · ${startD.getDate()}.–${endD.getDate()}.${endD.getMonth() + 1}.`;
    } else if (interval === "monat") {
      const d = new Date(range.start);
      center = `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
    } else {
      center = String(new Date(range.start).getFullYear());
    }
    const canNext = next <= Date.now();
    return `
      <div class="hist-period-nav">
        <button type="button" class="hist-nav-btn" data-act="hist-prev" data-ts="${prev}" aria-label="Vorheriger Zeitraum">‹</button>
        <p class="hist-period">${esc(center)}</p>
        <button type="button" class="hist-nav-btn" data-act="hist-next" data-ts="${next}" aria-label="Nächster Zeitraum"${canNext ? "" : " disabled"}>›</button>
      </div>
    `;
  }

  function buildModel(state) {
    const interval = state.historieInterval || "woche";
    const anchor = state.historieAnchor || Date.now();
    const all = collectEvents();
    const range = periodRange(interval, anchor);
    const periodEvents = all.filter((e) => inRange(e.at, range.start, range.end));
    const stats = statsForEvents(periodEvents);

    let avg = null;
    if (interval === "woche") avg = avgOfBuckets(bucketWeeks(all));
    else if (interval === "monat") avg = avgOfBuckets(bucketMonths(all));
    else if (interval === "jahr") avg = avgOfBuckets(bucketYears(all));

    return { interval, anchor, range, all, periodEvents, stats, avg };
  }

  function renderScreen(state) {
    const model = buildModel(state);
    const { interval, range, all, periodEvents, stats, avg } = model;
    const pills = INTERVALS.map((id) => `
      <button type="button" class="hist-pill${interval === id ? " is-on" : ""}" data-act="hist-interval" data-id="${id}">${id.charAt(0).toUpperCase() + id.slice(1)}</button>
    `).join("");

    const showTrend = interval !== "gesamt";
    const kpis = `
      <div class="hist-kpi-row">
        ${interval === "gesamt"
          ? `<article class="hist-card hist-kpi hist-kpi-viewtime"><p class="hist-kpi-label">Viewtime</p><p class="hist-kpi-value">${fmtHours(stats.viewHours)}</p></article>`
          : kpiViewtime(stats, avg, interval)}
        ${kpiFilme(stats, avg, showTrend)}
      </div>
    `;

    let body = kpis;

    if (interval === "woche") {
      body += activityWeekHtml(stats, range);
      body += `
        <article class="hist-card">
          <header class="hist-card-head"><h3>Pro Woche</h3><p class="hist-card-sub">komplett / teilweise</p></header>
          <div class="hist-bars">${chartBarsWeeks(all, range.start)}</div>
          <div class="hist-bar-legend"><span><i class="complete"></i> komplett</span><span><i class="partial"></i> teilweise</span></div>
        </article>
      `;
      const kw = isoWeek(range.start);
      body += genresHtml(periodEvents, `KW ${kw}`);
    } else if (interval === "monat") {
      body += activityMonthHtml(stats, range);
      body += `
        <article class="hist-card">
          <header class="hist-card-head"><h3>Pro Monat</h3><p class="hist-card-sub">komplett / teilweise</p></header>
          <div class="hist-bars">${chartBarsMonths(all, range.start)}</div>
          <div class="hist-bar-legend"><span><i class="complete"></i> komplett</span><span><i class="partial"></i> teilweise</span></div>
        </article>
      `;
      const d = new Date(range.start);
      body += genresHtml(periodEvents, MONTH_NAMES[d.getMonth()]);
      body += actorsHtml(periodEvents, MONTH_NAMES[d.getMonth()]);
    } else if (interval === "jahr") {
      const y = new Date(range.start).getFullYear();
      body += `
        <article class="hist-card">
          <header class="hist-card-head"><h3>Pro Jahr</h3><p class="hist-card-sub">Monate ${y} · komplett / teilweise</p></header>
          <div class="hist-bars">${chartBarsYearMonths(all, range.start)}</div>
          <div class="hist-bar-legend"><span><i class="complete"></i> komplett</span><span><i class="partial"></i> teilweise</span></div>
        </article>
      `;
      body += kpiTrioHtml(periodEvents, range);
      body += genresHtml(periodEvents, String(y));
      body += actorsHtml(periodEvents, String(y));
    } else {
      body += `
        <article class="hist-card">
          <header class="hist-card-head"><h3>Pro Jahr</h3><p class="hist-card-sub">Filme komplett / teilweise</p></header>
          <div class="hist-bars">${chartBarsYears(all)}</div>
          <div class="hist-bar-legend"><span><i class="complete"></i> komplett</span><span><i class="partial"></i> teilweise</span></div>
        </article>
      `;
      body += topFilmsHtml(stats.byFilm);
      body += kpiTrioHtml(all, range);
      const d = new Date(range.start);
      body += genresHtml(all, `Seit ${d.getFullYear()}`);
      body += actorsHtml(all, "Gesamt");
    }

    return `
      <section class="historie-screen" data-role="historie-screen">
        <h2 class="screen-title historie-title">Historie</h2>
        <div class="historie-sticky" data-role="historie-sticky">
          <div class="hist-pills" role="tablist" aria-label="Zeitraum">${pills}</div>
          ${periodNavHtml(interval, model.anchor, range)}
        </div>
        <div class="historie-body">${body}</div>
      </section>
    `;
  }

  function handleAction(act, el, state) {
    if (act === "hist-interval") {
      state.historieInterval = el.dataset.id || "woche";
      state.historieAnchor = Date.now();
      return true;
    }
    if (act === "hist-prev" || act === "hist-next") {
      const ts = Number(el.dataset.ts);
      if (Number.isFinite(ts)) state.historieAnchor = ts;
      return true;
    }
    return false;
  }

  window.CinexHistorie = {
    init,
    renderScreen,
    handleAction,
    buildModel,
  };
})();
