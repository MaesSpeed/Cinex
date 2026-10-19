import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import fs from "node:fs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = "/opt/cursor/artifacts/screenshots";
fs.mkdirSync(outDir, { recursive: true });

const server = spawn("python3", ["-m", "http.server", "8765", "-d", root], {
  stdio: "ignore",
});
await new Promise((r) => setTimeout(r, 400));

const base = "http://127.0.0.1:8765/index.html";

async function loginAndProfile(page) {
  await page.goto(base);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.fill("[data-act=login-name]", "Test");
  await page.fill("[data-act=login-pass]", "1234");
  await page.click("[data-act=auth-submit]");
  await page.waitForSelector('[data-act=pick-profile]');
  await page.click('[data-act=pick-profile][data-id="user1"]');
  await page.waitForSelector("[data-role=film-list], .list-toolbar");
}

async function seedDemoData(page) {
  await page.evaluate(() => {
    const prefix = "wdq.p.u-test.user1.";
    const at1 = new Date(2026, 9, 18, 20, 0).getTime();
    const at2 = new Date(2026, 8, 16, 19, 0).getTime();
    const history = [
      {
        id: "t27205",
        title: "Inception",
        at: at1,
        views: [{ at: at1, f: 0.4 }, at2],
      },
      { id: "t157336", title: "Interstellar", at: new Date(2026, 9, 2, 20, 0).getTime(), views: [new Date(2026, 9, 2, 20, 0).getTime()] },
    ];
    localStorage.setItem(`${prefix}history`, JSON.stringify(history));
    const vAt1 = new Date(2026, 9, 19, 18, 0).getTime();
    const vAt2 = new Date(2026, 8, 21, 17, 0).getTime();
    const videoHistory = [
      {
        id: "v-demo-1",
        title: "Soundtrack live: Zimmer Konzert",
        desc: "Mitschnitt – Time, Cornfield Chase",
        plat: "yt",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        at: vAt1,
        views: [{ at: vAt1, f: 0.5 }, vAt2],
      },
      {
        id: "v-demo-2",
        title: "Recap: Endgame",
        desc: "Plot-Punkte in 8 Minuten",
        plat: "yt",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        at: new Date(2026, 9, 12, 20, 0).getTime(),
        views: [new Date(2026, 9, 12, 20, 0).getTime()],
      },
    ];
    localStorage.setItem(`${prefix}videoHistory`, JSON.stringify(videoHistory));
  });
  await page.reload();
  await page.waitForSelector("[data-role=film-list], .list-toolbar");
}

const browser = await chromium.launch();
try {
  for (const width of [375, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 800 } });
    await loginAndProfile(page);
    await seedDemoData(page);

    await page.click('[data-act="list-tab"][data-id="seen"]');
    await page.waitForTimeout(300);
    await page.click('[data-act="seen-views-toggle"]');
    await page.screenshot({ path: path.join(outDir, `film-seen-historie-${width}px.png`), fullPage: true });

    await page.click('[data-act="seen-date-open"]');
    await page.waitForSelector(".seen-date-sheet");
    await page.screenshot({ path: path.join(outDir, `film-wann-gesehen-sheet-${width}px.png`), fullPage: true });
    await page.click('[data-act="seen-date-cancel"]');

    await page.click('[data-act="toggle-lists-mode"]');
    await page.waitForTimeout(200);
    await page.click('[data-act="list-tab"][data-id="seen"]');
    await page.waitForTimeout(300);
    const toggle = page.locator('[data-act="seen-views-toggle"]').first();
    if (await toggle.count()) await toggle.click();
    await page.screenshot({ path: path.join(outDir, `video-seen-historie-${width}px.png`), fullPage: true });

    await page.locator('[data-act="seen-date-open"]').first().click();
    await page.waitForSelector(".seen-date-sheet");
    await page.screenshot({ path: path.join(outDir, `video-wann-gesehen-sheet-${width}px.png`), fullPage: true });

    await page.close();
  }
} finally {
  await browser.close();
  server.kill();
}

console.log("Screenshots written to", outDir);
