import { chromium } from "playwright-core";
const EXE = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const OUT = "/tmp/claude-0/-home-user/566ad097-daac-5b43-b178-81d85ef805bf/scratchpad/shots";
const BASE = "http://127.0.0.1:4170";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await chromium.launch({ executablePath: EXE, args: ["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist"] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
await page.goto(BASE + "/en", { waitUntil: "networkidle", timeout: 60000 }).catch(()=>{});
await sleep(6500);
await page.evaluate(() => { for (const b of document.querySelectorAll('button')) { if (/got it/i.test(b.textContent||"")) { b.click(); break; } } }).catch(()=>{});
const total = await page.evaluate(() => document.body.scrollHeight);
console.log("mobile height", total);
const n = 12;
const step = Math.max(844, Math.floor((total-844)/(n-1)));
for (let i=0;i<n;i++){
  await page.evaluate((y)=>window.scrollTo(0,y), Math.min(i*step, total-844));
  await sleep(1300);
  await page.screenshot({ path: `${OUT}/mob-${i}.png` });
}
await browser.close();
console.log("DONE");
