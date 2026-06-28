import { chromium } from "playwright-core";
const EXE = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const OUT = "/tmp/claude-0/-home-user/566ad097-daac-5b43-b178-81d85ef805bf/scratchpad/shots";
const BASE = "http://127.0.0.1:4110";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await chromium.launch({ executablePath: EXE, args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });

async function run(path, label, frames) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
  await sleep(6500);
  // dismiss cookie banner if present
  await page.evaluate(() => { for (const b of document.querySelectorAll('button')) { if (/got it|j'accepte|accepter/i.test(b.textContent||"")) { b.click(); break; } } }).catch(()=>{});
  await sleep(600);
  const total = await page.evaluate(() => document.body.scrollHeight);
  const step = Math.max(900, Math.floor((total - 900) / Math.max(1, frames - 1)));
  for (let i = 0; i < frames; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.min(i*step, total-900));
    await sleep(1300);
    await page.screenshot({ path: `${OUT}/v2-${label}-${i}.png` });
  }
  await ctx.close();
  console.log(`${label}: height=${total}`);
}
await run("/en", "en", 7);
await run("/fr", "fr", 2);
await browser.close();
console.log("DONE");
