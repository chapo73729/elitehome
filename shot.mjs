import { chromium } from "playwright-core";

const EXE = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const OUT = "/tmp/claude-0/-home-user/566ad097-daac-5b43-b178-81d85ef805bf/scratchpad/shots";
const BASE = "http://127.0.0.1:4099";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({ executablePath: EXE, args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });

async function capture(path, label, { width, height }, frames) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
  await sleep(6500); // let loader finish + hero settle
  const total = await page.evaluate(() => document.body.scrollHeight);
  const step = Math.max(height, Math.floor((total - height) / Math.max(1, frames - 1)));
  for (let i = 0; i < frames; i++) {
    const y = Math.min(i * step, total - height);
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await sleep(1400);
    await page.screenshot({ path: `${OUT}/${label}-${i}.png` });
  }
  await ctx.close();
  console.log(`done ${label} (height=${total})`);
}

await capture("/en", "desktop-en", { width: 1440, height: 900 }, 7);
await capture("/fr", "fr-top", { width: 1440, height: 900 }, 2);
await capture("/en", "mobile-en", { width: 390, height: 844 }, 5);
await capture("/en/services/software", "svc", { width: 1440, height: 900 }, 3);
await capture("/en/work", "work", { width: 1440, height: 900 }, 2);

await browser.close();
console.log("ALL DONE");
