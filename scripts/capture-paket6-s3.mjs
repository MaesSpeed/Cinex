import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import fs from "node:fs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = "/opt/cursor/artifacts/screenshots";
fs.mkdirSync(outDir, { recursive: true });

const server = spawn("python3", ["-m", "http.server", "8766", "-d", root], {
  stdio: "ignore",
});
await new Promise((r) => setTimeout(r, 400));

const base = "http://127.0.0.1:8766/index.html?cinex_test=1";

async function loginUser1(page) {
  await page.goto(base);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.fill("[data-act=login-name]", "Test");
  await page.fill("[data-act=login-pass]", "1234");
  await page.click("[data-act=auth-submit]");
  await page.waitForSelector('[data-act=pick-profile]');
  await page.click('[data-act=pick-profile][data-id="user1"]');
  await page.waitForSelector(".list-toolbar");
}

async function seedLegacyVideoTags(page) {
  await page.evaluate(() => {
    const prefix = "wdq.p.u-test.user1.";
    if (!localStorage.getItem(`${prefix}videoWatchlist`)) {
      localStorage.setItem(`${prefix}videoWatchlist`, JSON.stringify([
        { id: "v-seed-2", title: "Behind the Scenes: Interstellar", desc: "Nolan erklärt die Docking-Szene", plat: "yt", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", at: Date.now() - 40000 },
      ]));
    }
    const tags = JSON.parse(localStorage.getItem(`${prefix}tags`) || "[]");
    tags.push({ id: "tag-tut", name: "Tutorial", color: "#ef6c00", plate: "hell" });
    localStorage.setItem(`${prefix}tags`, JSON.stringify(tags));
    const map = JSON.parse(localStorage.getItem(`${prefix}filmTags`) || "{}");
    map["v-seed-2"] = ["tag-tut"];
    localStorage.setItem(`${prefix}filmTags`, JSON.stringify(map));
    localStorage.removeItem(`${prefix}profileMeta`);
  });
  await page.reload();
  await page.waitForSelector(".list-toolbar");
}

const browser = await chromium.launch();
try {
  for (const [label, width] of [["mobile", 375], ["desktop", 1280]]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await loginUser1(page);
    await seedLegacyVideoTags(page);

    await page.click('[data-act="toggle-lists-mode"]');
    await page.click('[data-act="list-tab"][data-id="tags"]');
    await page.waitForSelector(".tags-scope-hint");
    await page.screenshot({ path: path.join(outDir, `paket6-s3-video-tags-tab-${label}.png`), fullPage: true });

    await page.click(".tags-manage-btn");
    await page.waitForSelector("h2.home-title");
    await page.screenshot({ path: path.join(outDir, `paket6-s3-video-tags-manage-empty-${label}.png`), fullPage: true });

    await page.click('[data-act="tag-add-open"]');
    await page.fill("[data-act=edit-tag-name]", "Tutorial");
    await page.click('[data-act="tag-edit-save"]');
    await page.waitForSelector('[data-act="tag-jump"]');

    await page.click('[data-nav="lists"]');
    const modeTitle = await page.textContent(".title-row-switch h2");
    if (!modeTitle || !modeTitle.includes("Videos")) {
      await page.click('[data-act="toggle-lists-mode"]');
    }
    await page.waitForSelector('.title-row-switch h2', { hasText: "Videos" });
    await page.click('[data-act="list-tab"][data-id="watch"]');
    await page.waitForSelector('.film-row.video-card');
    await page.locator('.film-row.video-card').first().click();
    await page.waitForSelector(".tag-chip-new");
    await page.screenshot({ path: path.join(outDir, `paket6-s3-video-card-taggen-${label}.png`), fullPage: true });

    await page.close();
  }
} finally {
  await browser.close();
  server.kill();
}

console.log("Screenshots in", outDir);
