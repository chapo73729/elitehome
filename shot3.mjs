import { chromium } from "playwright-core";
const EXE = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const OUT = "/tmp/claude-0/-home-user/566ad097-daac-5b43-b178-81d85ef805bf/scratchpad/shots";
const BASE = "http://127.0.0.1:4130";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await chromium.launch({ executablePath: EXE, args: ["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist"] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(BASE + "/en", { waitUntil: "networkidle", timeout: 60000 }).catch(()=>{});
await sleep(6500);
await page.evaluate(() => { for (const b of document.querySelectorAll('button')) { if (/got it/i.test(b.textContent||"")) { b.click(); break; } } }).catch(()=>{});
// capture through the manifesto pinned track (hero=100vh, manifesto track ~320vh after)
const ys = [950, 1500, 2100, 2700, 3300];
for (let i = 0; i < ys.length; i++) {
  await page.evaluate((y) => window.scrollTo(0, y), ys[i]);
  await sleep(1500);
  await page.screenshot({ path: `${OUT}/m-${i}.png` });
}
await browser.close();
console.log("DONE");
