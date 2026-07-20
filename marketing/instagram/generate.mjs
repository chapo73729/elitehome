/* ============================================================
   ARDLABS® — Instagram visual kit generator
   Renders every asset as HTML in headless Chromium and captures
   pixel-exact PNGs into ./assets. The visual language is the
   site's « Compile » signature: void canvas, blueprint grid,
   dashed frame, corner brackets, mono annotations, one azure.

   Run:  node marketing/instagram/generate.mjs
   Deps: playwright-core (any install; set NODE_PATH if global)
         Chromium binary via PLAYWRIGHT_BROWSERS_PATH or CHROMIUM_PATH
   ============================================================ */

import { chromium } from "playwright-core";
import { mkdirSync, readdirSync, existsSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, "assets");
mkdirSync(OUT, { recursive: true });

/* ---------- palette (mirrors src/app/globals.css) ---------- */
const C = {
  void: "#050505",
  ink: "#101216",
  smoke: "#16181e",
  fog: "#8b93a0",
  mist: "#9ba3af",
  chalk: "#f4f6f8",
  accent: "#4f8cff",
  accent2: "#6b9dff",
};

const fontURL = (f) => pathToFileURL(join(ROOT, "fonts", f)).href;

const BASE_CSS = `
  @font-face { font-family: "Geist"; font-weight: 300; src: url("${fontURL("geist-300.woff2")}") format("woff2"); }
  @font-face { font-family: "Geist"; font-weight: 400; src: url("${fontURL("geist-400.woff2")}") format("woff2"); }
  @font-face { font-family: "Geist"; font-weight: 500; src: url("${fontURL("geist-500.woff2")}") format("woff2"); }
  @font-face { font-family: "Geist"; font-weight: 600; src: url("${fontURL("geist-600.woff2")}") format("woff2"); }
  @font-face { font-family: "Geist"; font-weight: 700; src: url("${fontURL("geist-700.woff2")}") format("woff2"); }
  @font-face { font-family: "Geist"; font-weight: 800; src: url("${fontURL("geist-800.woff2")}") format("woff2"); }
  @font-face { font-family: "Geist Mono"; font-weight: 300; src: url("${fontURL("geistmono-300.woff2")}") format("woff2"); }
  @font-face { font-family: "Geist Mono"; font-weight: 400; src: url("${fontURL("geistmono-400.woff2")}") format("woff2"); }
  @font-face { font-family: "Geist Mono"; font-weight: 500; src: url("${fontURL("geistmono-500.woff2")}") format("woff2"); }
  @font-face { font-family: "Geist Mono"; font-weight: 600; src: url("${fontURL("geistmono-600.woff2")}") format("woff2"); }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { background: ${C.void}; }
  body {
    font-family: "Geist", sans-serif;
    color: ${C.chalk};
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    font-kerning: normal;
    overflow: hidden;
  }
  .mono { font-family: "Geist Mono", monospace; }
`;

/* faint modular blueprint grid + low azure bloom */
const ground = (w, h, glow = 0.20) => `
  .ground { position: absolute; inset: 0; background: ${C.void}; }
  .ground::before {
    content: ""; position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(139,147,160,0.055) 1px, transparent 1px),
      linear-gradient(90deg, rgba(139,147,160,0.055) 1px, transparent 1px),
      linear-gradient(rgba(139,147,160,0.028) 1px, transparent 1px),
      linear-gradient(90deg, rgba(139,147,160,0.028) 1px, transparent 1px);
    background-size: 135px 135px, 135px 135px, 27px 27px, 27px 27px;
    background-position: center top;
  }
  .ground::after {
    content: ""; position: absolute; inset: 0;
    background: radial-gradient(62% 44% at 50% 112%, rgba(79,140,255,${glow}), transparent 72%);
  }
`;

/* the Compile chrome: dashed frame, brackets, registration marks */
function chrome({ inset, bracket = 44, bw = 3 }) {
  const b = inset - 18;
  return `
  <div class="frame"></div>
  <div class="bk" style="top:${b}px;left:${b}px;border-top:${bw}px solid rgba(79,140,255,.92);border-left:${bw}px solid rgba(79,140,255,.92)"></div>
  <div class="bk" style="top:${b}px;right:${b}px;border-top:${bw}px solid rgba(79,140,255,.92);border-right:${bw}px solid rgba(79,140,255,.92)"></div>
  <div class="bk" style="bottom:${b}px;left:${b}px;border-bottom:${bw}px solid rgba(79,140,255,.92);border-left:${bw}px solid rgba(79,140,255,.92)"></div>
  <div class="bk" style="bottom:${b}px;right:${b}px;border-bottom:${bw}px solid rgba(79,140,255,.92);border-right:${bw}px solid rgba(79,140,255,.92)"></div>
  <div class="reg reg-t"></div><div class="reg reg-b"></div>
  <div class="reg reg-l"></div><div class="reg reg-r"></div>
  <style>
    .frame { position:absolute; inset:${inset}px; border:1px dashed rgba(79,140,255,.32); }
    .bk { position:absolute; width:${bracket}px; height:${bracket}px; }
    .reg { position:absolute; width:14px; height:14px; opacity:.38;
           background:
             linear-gradient(rgba(139,147,160,.9), rgba(139,147,160,.9)) center/1px 14px no-repeat,
             linear-gradient(rgba(139,147,160,.9), rgba(139,147,160,.9)) center/14px 1px no-repeat; }
    .reg-t { top:${inset - 7}px; left:calc(50% - 7px); }
    .reg-b { bottom:${inset - 7}px; left:calc(50% - 7px); }
    .reg-l { left:${inset - 7}px; top:calc(50% - 7px); }
    .reg-r { right:${inset - 7}px; top:calc(50% - 7px); }
  </style>`;
}

const page = (w, h, extraCss, body) => `<!doctype html><html><head><meta charset="utf-8"><style>
  ${BASE_CSS}
  body { width:${w}px; height:${h}px; position:relative; }
  ${ground(w, h)}
  ${extraCss}
</style></head><body><div class="ground"></div>${body}</body></html>`;

/* ============================================================
   FEED PLATES — 1080 × 1350 (4:5)
   Shared skeleton: header annotation, central figure,
   monumental statement, footer registration line.
   ============================================================ */

const PLATE_CSS = `
  .head { position:absolute; top:92px; left:112px; right:112px;
          display:flex; justify-content:space-between; align-items:baseline; }
  .head .id { font-family:"Geist Mono"; font-size:17px; font-weight:500;
              letter-spacing:.18em; color:${C.mist}; }
  .head .cmp { font-family:"Geist Mono"; font-size:17px; font-weight:400;
               letter-spacing:.06em; color:${C.fog}; }
  .head .cmp b { color:${C.accent}; font-weight:500; }
  .dim { position:absolute; font-family:"Geist Mono"; font-size:13px;
         letter-spacing:.14em; color:rgba(139,147,160,.55); }
  .figure { position:absolute; left:0; right:0; display:flex; justify-content:center; }
  .ghost { position:absolute; left:0; right:0; text-align:center;
           font-weight:200; color:transparent;
           -webkit-text-stroke:1px rgba(244,246,248,.07); letter-spacing:-.02em; }
  .copy { position:absolute; left:112px; right:112px; }
  .eyebrow { font-family:"Geist Mono"; font-size:19px; font-weight:500;
             letter-spacing:.34em; color:${C.accent}; margin-bottom:30px; }
  .statement { font-weight:300; font-size:84px; line-height:1.06;
               letter-spacing:-.03em; color:${C.chalk}; }
  .statement .thin { color:${C.fog}; }
  .sub { margin-top:26px; font-size:25px; font-weight:400; color:${C.fog};
         letter-spacing:.005em; line-height:1.5; }
  .foot { position:absolute; bottom:92px; left:112px; right:112px;
          display:flex; justify-content:space-between; align-items:baseline;
          font-family:"Geist Mono"; font-size:16px; letter-spacing:.16em; }
  .foot .pl { color:${C.accent}; font-weight:500; }
  .foot .pl span { color:${C.fog}; font-weight:400; }
  .foot .site { color:${C.mist}; }
`;

function plate({ n, label, section, figure, figureTop, ghost, copyTop, eyebrow, statement, sub }) {
  const body = `
    ${chrome({ inset: 64 })}
    <div class="head">
      <span class="id">ARDLABS®</span>
      <span class="cmp">// compile: ${label} … <b>ok</b></span>
    </div>
    <div class="dim" style="top:33px; left:50%; transform:translateX(-50%);">1080</div>
    <div class="dim" style="left:38px; top:50%; transform:translate(-50%,-50%) rotate(-90deg);">1350</div>
    ${ghost ? `<div class="ghost" style="top:${ghost.top}px; font-size:${ghost.size}px;">${ghost.text}</div>` : ""}
    <div class="figure" style="top:${figureTop}px;">${figure}</div>
    <div class="copy" style="top:${copyTop}px;">
      <div class="eyebrow">${eyebrow}</div>
      <div class="statement">${statement}</div>
      ${sub ? `<div class="sub">${sub}</div>` : ""}
    </div>
    <div class="foot">
      <span class="pl">PL.${String(n).padStart(2, "0")} <span>/ 09 — ${section}</span></span>
      <span class="site">ARDLABS.EU</span>
    </div>`;
  return page(1080, 1350, PLATE_CSS, body);
}

/* ---------- SVG figure helpers ---------- */
const az = C.accent;
const ln = "rgba(244,246,248,.55)"; // chalk line
const gd = "rgba(139,147,160,.35)"; // guide
const gd2 = "rgba(139,147,160,.18)";

/* PL.01 — the mark, drawn as a construction plate */
const figMark = `
<svg width="620" height="540" viewBox="0 0 620 540" fill="none">
  <circle cx="310" cy="270" r="228" stroke="${gd2}" stroke-width="1"/>
  <circle cx="310" cy="270" r="164" stroke="${gd2}" stroke-width="1" stroke-dasharray="3 7"/>
  <line x1="310" y1="10" x2="310" y2="530" stroke="${gd2}" stroke-width="1" stroke-dasharray="2 8"/>
  <line x1="50" y1="270" x2="570" y2="270" stroke="${gd2}" stroke-width="1" stroke-dasharray="2 8"/>
  <!-- construction guides through the apex and feet -->
  <line x1="152" y1="452" x2="322" y2="52" stroke="${gd}" stroke-width="1" stroke-dasharray="5 6"/>
  <line x1="298" y1="52" x2="468" y2="452" stroke="${gd}" stroke-width="1" stroke-dasharray="5 6"/>
  <!-- the glyph -->
  <path d="M186 424 L310 100 L434 424" stroke="${C.chalk}" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M240 292 H404" stroke="${az}" stroke-width="13" stroke-linecap="round"/>
  <circle cx="436" cy="292" r="9" fill="${az}"/>
  <!-- dimension: crossbar -->
  <line x1="240" y1="482" x2="434" y2="482" stroke="${gd}" stroke-width="1"/>
  <line x1="240" y1="474" x2="240" y2="490" stroke="${gd}" stroke-width="1"/>
  <line x1="434" y1="474" x2="434" y2="490" stroke="${gd}" stroke-width="1"/>
  <text x="337" y="510" text-anchor="middle" font-family="Geist Mono" font-size="14" letter-spacing="2" fill="${C.fog}">Δ 0.618</text>
  <!-- dimension: apex height -->
  <line x1="520" y1="100" x2="520" y2="424" stroke="${gd}" stroke-width="1"/>
  <line x1="512" y1="100" x2="528" y2="100" stroke="${gd}" stroke-width="1"/>
  <line x1="512" y1="424" x2="528" y2="424" stroke="${gd}" stroke-width="1"/>
  <text x="536" y="268" font-family="Geist Mono" font-size="14" letter-spacing="2" fill="${C.fog}">H</text>
  <!-- apex marker -->
  <circle cx="310" cy="100" r="4" fill="none" stroke="${az}" stroke-width="1.5"/>
  <text x="310" y="76" text-anchor="middle" font-family="Geist Mono" font-size="13" letter-spacing="3" fill="${C.fog}">APEX</text>
</svg>`;

/* PL.02 — manifesto: a caret advancing along a measured baseline */
const figManifesto = `
<svg width="700" height="240" viewBox="0 0 700 240" fill="none">
  <line x1="20" y1="170" x2="680" y2="170" stroke="${gd}" stroke-width="1"/>
  ${Array.from({ length: 34 }, (_, i) => {
    const x = 20 + i * 20;
    const h = i % 5 === 0 ? 14 : 7;
    return `<line x1="${x}" y1="170" x2="${x}" y2="${170 - h}" stroke="${gd}" stroke-width="1"/>`;
  }).join("")}
  <rect x="20" y="166" width="404" height="4" fill="${az}" opacity=".85"/>
  <rect x="418" y="120" width="4" height="64" fill="${C.chalk}"/>
  <text x="20" y="215" font-family="Geist Mono" font-size="14" letter-spacing="2" fill="${C.fog}">FEATURES</text>
  <text x="680" y="215" text-anchor="end" font-family="Geist Mono" font-size="14" letter-spacing="2" fill="${az}">PRODUCTS</text>
  <text x="424" y="100" text-anchor="middle" font-family="Geist Mono" font-size="13" letter-spacing="3" fill="${C.mist}">WE ARE HERE</text>
</svg>`;

/* PL.03 — strategy: target frame, the bet plotted before the build */
const figStrategy = `
<svg width="620" height="500" viewBox="0 0 620 500" fill="none">
  <circle cx="310" cy="250" r="204" stroke="${gd2}" stroke-width="1"/>
  <circle cx="310" cy="250" r="146" stroke="${gd}" stroke-width="1" stroke-dasharray="4 8"/>
  <circle cx="310" cy="250" r="88" stroke="${gd}" stroke-width="1"/>
  <line x1="310" y1="22" x2="310" y2="478" stroke="${gd2}" stroke-width="1"/>
  <line x1="82" y1="250" x2="538" y2="250" stroke="${gd2}" stroke-width="1"/>
  ${Array.from({ length: 24 }, (_, i) => {
    const a = (i * Math.PI) / 12;
    const x1 = 310 + Math.cos(a) * 196, y1 = 250 + Math.sin(a) * 196;
    const x2 = 310 + Math.cos(a) * 204, y2 = 250 + Math.sin(a) * 204;
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${gd}" stroke-width="1"/>`;
  }).join("")}
  <!-- the plotted path: idea → validated plan -->
  <path d="M132 396 C 210 330, 240 330, 292 268" stroke="${ln}" stroke-width="1.5" stroke-dasharray="6 6"/>
  <path d="M292 268 L 310 250" stroke="${az}" stroke-width="2.5"/>
  <circle cx="132" cy="396" r="5" fill="none" stroke="${ln}" stroke-width="1.5"/>
  <circle cx="310" cy="250" r="7" fill="${az}"/>
  <circle cx="310" cy="250" r="16" stroke="${az}" stroke-width="1" opacity=".5"/>
  <text x="118" y="428" font-family="Geist Mono" font-size="14" letter-spacing="2" fill="${C.fog}">IDEA</text>
  <text x="336" y="238" font-family="Geist Mono" font-size="14" letter-spacing="2" fill="${az}">VALIDATED PLAN</text>
  <text x="310" y="14" text-anchor="middle" font-family="Geist Mono" font-size="13" letter-spacing="3" fill="${C.fog}">N</text>
</svg>`;

/* PL.04 — design & development: exploded interface, three drawn layers */
const figBuild = `
<svg width="620" height="520" viewBox="0 0 620 520" fill="none">
  <!-- iso layers bottom → top: infra / logic / interface -->
  <g stroke="${gd}" stroke-width="1">
    <path d="M310 402 L470 322 L310 242 L150 322 Z" fill="rgba(16,18,22,.6)"/>
  </g>
  <g stroke="${ln}" stroke-width="1.2">
    <path d="M310 322 L470 242 L310 162 L150 242 Z" fill="rgba(16,18,22,.75)"/>
  </g>
  <g stroke="${az}" stroke-width="1.6">
    <path d="M310 242 L470 162 L310 82 L150 242 Z" fill="none" opacity="0"/>
    <path d="M310 242 L470 162 L310 82 L150 162 Z" fill="rgba(79,140,255,.06)"/>
  </g>
  <!-- interface details on top plane -->
  <g stroke="${az}" stroke-width="1.2" opacity=".85">
    <path d="M250 152 L310 122 L370 152" fill="none"/>
    <path d="M228 172 L310 213 L392 172" fill="none" stroke-dasharray="3 5"/>
  </g>
  <!-- plumb lines -->
  <line x1="150" y1="162" x2="150" y2="322" stroke="${gd}" stroke-width="1" stroke-dasharray="2 6"/>
  <line x1="470" y1="162" x2="470" y2="322" stroke="${gd}" stroke-width="1" stroke-dasharray="2 6"/>
  <line x1="310" y1="82" x2="310" y2="120" stroke="${gd}" stroke-width="1" stroke-dasharray="2 6"/>
  <!-- callouts -->
  <line x1="470" y1="162" x2="548" y2="162" stroke="${gd}" stroke-width="1"/>
  <text x="556" y="167" font-family="Geist Mono" font-size="14" letter-spacing="1.5" fill="${az}">UI</text>
  <line x1="470" y1="242" x2="548" y2="242" stroke="${gd}" stroke-width="1"/>
  <text x="556" y="247" font-family="Geist Mono" font-size="14" letter-spacing="1.5" fill="${C.fog}">LOGIC</text>
  <line x1="470" y1="322" x2="548" y2="322" stroke="${gd}" stroke-width="1"/>
  <text x="556" y="327" font-family="Geist Mono" font-size="14" letter-spacing="1.5" fill="${C.fog}">INFRA</text>
  <text x="310" y="470" text-anchor="middle" font-family="Geist Mono" font-size="13" letter-spacing="3" fill="${C.fog}">EXPLODED VIEW · ×3</text>
</svg>`;

/* PL.05 — data & AI: a field of observations, one legible signal */
const figAI = (() => {
  let dots = "";
  const rnd = (i) => {
    // deterministic pseudo-random
    const x = Math.sin(i * 127.1) * 43758.5453;
    return x - Math.floor(x);
  };
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 13; c++) {
      const i = r * 13 + c;
      const x = 50 + c * 43 + (rnd(i) - 0.5) * 10;
      const y = 60 + r * 43 + (rnd(i + 99) - 0.5) * 10;
      const o = 0.14 + rnd(i + 7) * 0.3;
      dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.2" fill="rgba(244,246,248,${o.toFixed(2)})"/>`;
    }
  }
  return `
<svg width="620" height="470" viewBox="0 0 620 470" fill="none">
  ${dots}
  <path d="M60 330 C 160 300, 200 220, 300 208 C 390 198, 430 150, 556 118"
        stroke="${az}" stroke-width="2.4" fill="none"/>
  <circle cx="300" cy="208" r="6" fill="${az}"/>
  <circle cx="300" cy="208" r="14" stroke="${az}" stroke-width="1" opacity=".5" fill="none"/>
  <circle cx="556" cy="118" r="4.5" fill="${C.chalk}"/>
  <line x1="300" y1="208" x2="300" y2="404" stroke="${gd}" stroke-width="1" stroke-dasharray="3 6"/>
  <text x="300" y="432" text-anchor="middle" font-family="Geist Mono" font-size="14" letter-spacing="2" fill="${C.fog}">SIGNAL</text>
  <text x="556" y="94" text-anchor="middle" font-family="Geist Mono" font-size="14" letter-spacing="2" fill="${C.mist}">DECISION</text>
</svg>`;
})();

/* PL.06 — cloud: three load-bearing columns, forces resolved */
const figCloud = `
<svg width="620" height="500" viewBox="0 0 620 500" fill="none">
  <!-- deck -->
  <line x1="90" y1="120" x2="530" y2="120" stroke="${C.chalk}" stroke-width="2.5"/>
  <line x1="90" y1="132" x2="530" y2="132" stroke="${gd}" stroke-width="1"/>
  <!-- load arrows onto the deck -->
  ${[150, 250, 350, 450].map((x) => `
    <line x1="${x + 10}" y1="58" x2="${x + 10}" y2="104" stroke="${gd}" stroke-width="1.4"/>
    <path d="M${x + 10} 112 L${x + 4} 98 L${x + 16} 98 Z" fill="${C.fog}"/>`).join("")}
  <!-- columns -->
  ${[170, 310, 450].map((x) => `
    <line x1="${x - 16}" y1="132" x2="${x - 16}" y2="368" stroke="${ln}" stroke-width="1.4"/>
    <line x1="${x + 16}" y1="132" x2="${x + 16}" y2="368" stroke="${ln}" stroke-width="1.4"/>
    <path d="M${x - 16} 180 L${x + 16} 228 M${x + 16} 180 L${x - 16} 228 M${x - 16} 228 L${x + 16} 276 M${x + 16} 228 L${x - 16} 276 M${x - 16} 276 L${x + 16} 324 M${x + 16} 276 L${x - 16} 324" stroke="${gd}" stroke-width="1"/>
    <line x1="${x - 30}" y1="368" x2="${x + 30}" y2="368" stroke="${C.chalk}" stroke-width="2"/>`).join("")}
  <!-- ground -->
  <line x1="90" y1="392" x2="530" y2="392" stroke="${az}" stroke-width="2"/>
  ${Array.from({ length: 22 }, (_, i) => {
    const x = 96 + i * 20;
    return `<line x1="${x}" y1="392" x2="${x - 10}" y2="404" stroke="rgba(79,140,255,.5)" stroke-width="1"/>`;
  }).join("")}
  <text x="310" y="444" text-anchor="middle" font-family="Geist Mono" font-size="14" letter-spacing="3" fill="${C.fog}">LOAD, RESOLVED · 99.9</text>
  <text x="556" y="125" font-family="Geist Mono" font-size="13" letter-spacing="1.5" fill="${C.fog}">DECK</text>
</svg>`;

/* PL.07 — network: six stations, great-circle arcs above a horizon */
const figNetwork = (() => {
  const cities = [
    ["PRG", 310, true],
    ["GVA", 190, false],
    ["NYC", 70, false],
    ["DXB", 415, false],
    ["SIN", 500, false],
    ["TYO", 566, false],
  ];
  const base = 330;
  const arcs = cities
    .filter(([, , p]) => !p)
    .map(([, x]) => {
      const mx = (310 + x) / 2;
      const h = Math.min(200, Math.abs(x - 310) * 0.62);
      return `<path d="M310 ${base} Q ${mx} ${base - h}, ${x} ${base}" stroke="rgba(79,140,255,.55)" stroke-width="1.4" fill="none"/>
              <circle cx="${(310 + x) / 2}" cy="${base - h / 2 - (h > 100 ? 22 : 8)}" r="0" fill="none"/>`;
    })
    .join("");
  const stations = cities
    .map(([n, x, p]) => `
      <line x1="${x}" y1="${base}" x2="${x}" y2="${base + 14}" stroke="${p ? az : ln}" stroke-width="1.4"/>
      <circle cx="${x}" cy="${base}" r="${p ? 6 : 3.5}" fill="${p ? az : C.chalk}"/>
      ${p ? `<circle cx="${x}" cy="${base}" r="15" stroke="${az}" stroke-width="1" opacity=".55" fill="none"/>
             <circle cx="${x}" cy="${base}" r="26" stroke="${az}" stroke-width="1" opacity=".25" fill="none"/>` : ""}
      <text x="${x}" y="${base + 44}" text-anchor="middle" font-family="Geist Mono" font-size="14" letter-spacing="2" fill="${p ? az : C.fog}">${n}</text>`)
    .join("");
  return `
<svg width="620" height="440" viewBox="0 0 620 440" fill="none">
  <line x1="30" y1="${base}" x2="590" y2="${base}" stroke="${gd}" stroke-width="1"/>
  ${Array.from({ length: 56 }, (_, i) => {
    const x = 34 + i * 10;
    return `<line x1="${x}" y1="${base}" x2="${x}" y2="${base - (i % 7 === 0 ? 8 : 4)}" stroke="${gd2}" stroke-width="1"/>`;
  }).join("")}
  ${arcs}
  ${stations}
  <text x="310" y="66" text-anchor="middle" font-family="Geist Mono" font-size="13" letter-spacing="3" fill="${C.fog}">CONNECTED ROUTES · ASYNC</text>
</svg>`;
})();

/* PL.08 — security: perimeter rings, measured, nothing enters unread */
const figSecurity = `
<svg width="620" height="500" viewBox="0 0 620 500" fill="none">
  ${[204, 158, 112].map((r, i) => `
    <circle cx="310" cy="250" r="${r}" stroke="${i === 2 ? ln : gd}" stroke-width="1" ${i === 1 ? 'stroke-dasharray="5 8"' : ""}/>`).join("")}
  ${Array.from({ length: 36 }, (_, i) => {
    const a = (i * Math.PI) / 18;
    const x1 = 310 + Math.cos(a) * 204, y1 = 250 + Math.sin(a) * 204;
    const x2 = 310 + Math.cos(a) * 214, y2 = 250 + Math.sin(a) * 214;
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${gd}" stroke-width="1"/>`;
  }).join("")}
  <!-- an attempted path, stopped at the perimeter -->
  <path d="M44 96 C 130 140, 160 160, 208 194" stroke="${ln}" stroke-width="1.4" stroke-dasharray="6 6" fill="none"/>
  <circle cx="208" cy="194" r="5" fill="none" stroke="${C.chalk}" stroke-width="1.5"/>
  <line x1="196" y1="182" x2="220" y2="206" stroke="${C.chalk}" stroke-width="1.5"/>
  <text x="40" y="76" font-family="Geist Mono" font-size="14" letter-spacing="2" fill="${C.fog}">UNREAD</text>
  <!-- the shield core -->
  <path d="M310 174 L378 204 V262 C 378 312, 348 344, 310 360 C 272 344, 242 312, 242 262 V204 Z"
        stroke="${az}" stroke-width="2.2" fill="rgba(79,140,255,.05)"/>
  <path d="M282 264 L304 288 L344 234" stroke="${az}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="310" y="26" text-anchor="middle" font-family="Geist Mono" font-size="13" letter-spacing="3" fill="${C.fog}">PERIMETER · 24/7</text>
  <text x="310" y="492" text-anchor="middle" font-family="Geist Mono" font-size="13" letter-spacing="3" fill="${C.fog}">SOC · PENTEST · DFIR</text>
</svg>`;

/* PL.09 — contact: the brief, compiling */
const figContact = `
<svg width="640" height="380" viewBox="0 0 640 380" fill="none">
  <rect x="20" y="20" width="600" height="340" rx="10" stroke="${gd}" stroke-width="1" fill="rgba(16,18,22,.72)"/>
  <line x1="20" y1="74" x2="620" y2="74" stroke="${gd2}" stroke-width="1"/>
  <circle cx="52" cy="47" r="6" stroke="${gd}" fill="none" stroke-width="1.2"/>
  <circle cx="76" cy="47" r="6" stroke="${gd}" fill="none" stroke-width="1.2"/>
  <circle cx="100" cy="47" r="6" stroke="${az}" fill="none" stroke-width="1.2"/>
  <text x="596" y="52" text-anchor="end" font-family="Geist Mono" font-size="14" letter-spacing="2" fill="${C.fog}">BRIEF.SH</text>
  <g font-family="Geist Mono" font-size="19" letter-spacing="1">
    <text x="56" y="122" fill="${C.fog}">$ ardlabs brief --new</text>
    <text x="56" y="162" fill="${C.mist}">→ name <tspan fill="rgba(244,246,248,.4)">………………………………</tspan> <tspan fill="${az}">ok</tspan></text>
    <text x="56" y="202" fill="${C.mist}">→ email <tspan fill="rgba(244,246,248,.4)">……………………………</tspan> <tspan fill="${az}">ok</tspan></text>
    <text x="56" y="242" fill="${C.mist}">→ idea <tspan fill="rgba(244,246,248,.4)">………………………………</tspan> <tspan fill="${az}">ok</tspan></text>
    <text x="56" y="282" fill="${C.chalk}">compiling brief …</text>
    <text x="56" y="322" fill="${az}">✓ transmitted — reply &lt; 24h</text>
  </g>
  <rect x="382" y="306" width="11" height="22" fill="${C.chalk}"/>
</svg>`;

const PLATES = [
  {
    n: 1, label: "the_mark", section: "IDENTITY",
    figure: figMark, figureTop: 190,
    copyTop: 1005, eyebrow: "DIGITAL ENGINEERING STUDIO",
    statement: `ARDLABS<span style="color:${az}">®</span>`,
    sub: "Software, platforms and AI — engineered in Prague, shipped worldwide.",
  },
  {
    n: 2, label: "manifesto", section: "MANIFESTO",
    figure: figManifesto, figureTop: 700,
    copyTop: 260, eyebrow: "MANIFESTO",
    statement: `Most studios<br>ship features.<br><span class="thin">We engineer</span><br>products.`,
    sub: null,
  },
  {
    n: 3, label: "pole_01_strategy", section: "SERVICES 01/04",
    figure: figStrategy, figureTop: 205, ghost: { text: "01", size: 560, top: 120 },
    copyTop: 900, eyebrow: "POLE 01 — STRATEGY & CONSULTING",
    statement: `Clarity<br><span class="thin">before code.</span>`,
    sub: "From idea to validated plan.",
  },
  {
    n: 4, label: "pole_02_build", section: "SERVICES 02/04",
    figure: figBuild, figureTop: 195, ghost: { text: "02", size: 560, top: 120 },
    copyTop: 900, eyebrow: "POLE 02 — DESIGN & DEVELOPMENT",
    statement: `Built<br><span class="thin">to the detail.</span>`,
    sub: "Web, mobile, SaaS — end to end.",
  },
  {
    n: 5, label: "pole_03_ai", section: "SERVICES 03/04",
    figure: figAI, figureTop: 225, ghost: { text: "03", size: 560, top: 120 },
    copyTop: 900, eyebrow: "POLE 03 — DATA & AI",
    statement: `Operations,<br><span class="thin">made legible.</span>`,
    sub: "Automation, data and AI at work.",
  },
  {
    n: 6, label: "pole_04_cloud", section: "SERVICES 04/04",
    figure: figCloud, figureTop: 210, ghost: { text: "04", size: 560, top: 120 },
    copyTop: 900, eyebrow: "POLE 04 — CLOUD & INFRASTRUCTURE",
    statement: `Foundations<br><span class="thin">that hold.</span>`,
    sub: "Built for uptime, ready for scale.",
  },
  {
    n: 7, label: "network", section: "GLOBAL NETWORK",
    figure: figNetwork, figureTop: 250,
    copyTop: 800, eyebrow: "GLOBAL NETWORK",
    statement: `One studio.<br><span class="thin">Working</span><br>worldwide.`,
    sub: "Prague-based. Async by default, precise in delivery.",
  },
  {
    n: 8, label: "security", section: "SECURITY",
    figure: figSecurity, figureTop: 200,
    copyTop: 900, eyebrow: "SECURITY",
    statement: `Defence,<br><span class="thin">engineered in.</span>`,
    sub: "From first commit to production.",
  },
  {
    n: 9, label: "contact", section: "CONTACT",
    figure: figContact, figureTop: 620,
    copyTop: 245, eyebrow: "START A PROJECT",
    statement: `Got something<br><span class="thin">worth building?</span>`,
    sub: "Compile your brief — ardlabs.eu/contact",
  },
];

/* ============================================================
   STORIES — 1080 × 1920
   ============================================================ */

const STORY_CSS = `
  .head { position:absolute; top:150px; left:112px; right:112px;
          display:flex; justify-content:space-between; align-items:baseline; }
  .head .id { font-family:"Geist Mono"; font-size:20px; font-weight:500; letter-spacing:.2em; color:${C.mist}; }
  .head .cmp { font-family:"Geist Mono"; font-size:20px; letter-spacing:.06em; color:${C.fog}; }
  .head .cmp b { color:${C.accent}; font-weight:500; }
  .eyebrow { font-family:"Geist Mono"; font-size:24px; font-weight:500; letter-spacing:.4em; color:${C.accent}; }
  .statement { font-weight:300; font-size:112px; line-height:1.05; letter-spacing:-.03em; color:${C.chalk}; }
  .statement .thin { color:${C.fog}; }
  .sub { font-size:31px; color:${C.fog}; line-height:1.5; }
  .chip { display:inline-flex; align-items:center; gap:18px;
          border:1px solid rgba(79,140,255,.5); border-radius:999px;
          padding:26px 44px; font-family:"Geist Mono"; font-size:24px;
          letter-spacing:.18em; color:${C.chalk}; background:rgba(79,140,255,.07); }
  .chip b { color:${C.accent}; font-weight:500; }
  .foot { position:absolute; bottom:150px; left:112px; right:112px;
          display:flex; justify-content:space-between;
          font-family:"Geist Mono"; font-size:19px; letter-spacing:.18em; color:${C.mist}; }
  .foot .pl { color:${C.accent}; }
`;

function storyShipped() {
  const body = `
    ${chrome({ inset: 72, bracket: 52 })}
    <div class="head">
      <span class="id">ARDLABS®</span>
      <span class="cmp">// compile: release … <b>ok</b></span>
    </div>
    <div style="position:absolute; top:410px; left:112px; right:112px;">
      <div class="eyebrow">SHIPPED</div>
      <div class="statement" style="margin-top:44px;">Project,<br><span class="thin">compiled &</span><br>delivered.</div>
      <div class="sub" style="margin-top:52px;">Strategy → design → code → production.<br>Another idea, engineered into a precise product.</div>
    </div>
    <div style="position:absolute; top:1235px; left:112px;">${figManifesto.replace('width="700" height="240"', 'width="820" height="280"')}</div>
    <div style="position:absolute; bottom:305px; left:112px;">
      <span class="chip">CASE STUDY — <b>ARDLABS.EU/WORK</b></span>
    </div>
    <div class="foot">
      <span class="pl">ST.01 — RELEASE</span>
      <span>PRAGUE · WORLDWIDE</span>
    </div>`;
  return page(1080, 1920, STORY_CSS, body);
}

function storyInsight() {
  const body = `
    ${chrome({ inset: 72, bracket: 52 })}
    <div class="head">
      <span class="id">ARDLABS®</span>
      <span class="cmp">// compile: insight … <b>ok</b></span>
    </div>
    <div style="position:absolute; top:430px; left:112px; right:112px;">
      <div class="eyebrow">FIELD NOTE — 01</div>
      <div class="statement" style="margin-top:48px; font-size:100px;">“Ship less.<br><span class="thin">Engineer</span><br>more.”</div>
    </div>
    <div style="position:absolute; top:1170px; left:112px; right:112px;">
      <div style="height:1px; background:rgba(139,147,160,.3);"></div>
      <div class="sub" style="margin-top:44px;">A feature is a promise. A product is a proof.<br>We build the proof — to the detail, made to last.</div>
    </div>
    <div style="position:absolute; bottom:305px; left:112px;">
      <span class="chip">MORE — <b>ARDLABS.EU/INSIGHTS</b></span>
    </div>
    <div class="foot">
      <span class="pl">ST.02 — INSIGHT</span>
      <span>ARDLABS.EU</span>
    </div>`;
  return page(1080, 1920, STORY_CSS, body);
}

/* ============================================================
   AVATAR — 1000 × 1000 (safe in circle crop)
   ============================================================ */

function avatar() {
  const body = `
    <svg style="position:absolute; top:50%; left:50%; transform:translate(-50%,-54%);"
         width="560" height="560" viewBox="0 0 64 64" fill="none">
      <path d="M18 48 L32 15 L46 48" stroke="#F4F6FB" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M24.2 34.5 H42.5" stroke="${az}" stroke-width="4" stroke-linecap="round"/>
      <circle cx="46" cy="34.5" r="2.5" fill="${az}"/>
    </svg>
    <div class="mono" style="position:absolute; left:50%; bottom:160px; transform:translateX(-50%);
         font-size:34px; font-weight:500; letter-spacing:.42em; color:${C.mist}; padding-left:.42em;">ARDLABS</div>
    <style>
      .ground::after { background: radial-gradient(70% 55% at 50% 118%, rgba(79,140,255,.34), transparent 72%); }
    </style>`;
  return page(1000, 1000, "", body);
}

/* ============================================================
   HIGHLIGHT COVERS — 1080 × 1080 (icon inside circle-safe zone)
   ============================================================ */

const HL_ICONS = {
  work: `<path d="M20 34 L44 22 L68 34 L44 46 Z" stroke="${C.chalk}" stroke-width="2" fill="none"/>
         <path d="M20 46 L44 58 L68 46" stroke="${az}" stroke-width="2" fill="none"/>
         <path d="M20 58 L44 70 L68 58" stroke="rgba(139,147,160,.7)" stroke-width="2" fill="none"/>`,
  studio: `<path d="M26 62 L44 20 L62 62" stroke="${C.chalk}" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
           <path d="M33 45 H55" stroke="${az}" stroke-width="4" stroke-linecap="round"/>`,
  ai: `<circle cx="44" cy="44" r="5" fill="${az}"/>
       ${[[44, 18], [70, 44], [44, 70], [18, 44], [26, 26], [62, 26], [62, 62], [26, 62]]
         .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="rgba(244,246,248,.75)"/>
            <line x1="44" y1="44" x2="${x}" y2="${y}" stroke="rgba(139,147,160,.45)" stroke-width="1.2"/>`).join("")}`,
  process: `<circle cx="44" cy="44" r="26" stroke="rgba(139,147,160,.6)" stroke-width="1.6" stroke-dasharray="5 7" fill="none"/>
            <circle cx="44" cy="44" r="14" stroke="${C.chalk}" stroke-width="2" fill="none"/>
            <line x1="44" y1="10" x2="44" y2="22" stroke="${az}" stroke-width="2.4"/>
            <circle cx="44" cy="44" r="3.4" fill="${az}"/>`,
  contact: `<path d="M22 30 L36 44 L22 58" stroke="${az}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <line x1="44" y1="58" x2="66" y2="58" stroke="${C.chalk}" stroke-width="4" stroke-linecap="round"/>`,
};

function highlight(key, label) {
  const body = `
    <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center;">
      <div style="position:relative; width:660px; height:660px; display:flex; align-items:center; justify-content:center;">
        <div style="position:absolute; inset:0; border:1px dashed rgba(79,140,255,.35); border-radius:50%;"></div>
        <div style="position:absolute; inset:60px; border:1px solid rgba(139,147,160,.2); border-radius:50%;"></div>
        <svg width="330" height="330" viewBox="0 0 88 88" fill="none" style="margin-top:-40px;">${HL_ICONS[key]}</svg>
        <div class="mono" style="position:absolute; bottom:140px; left:0; right:0; text-align:center;
             font-size:30px; font-weight:500; letter-spacing:.44em; color:${C.mist}; padding-left:.44em;">${label}</div>
      </div>
    </div>
    <style>.ground::after { background: radial-gradient(70% 55% at 50% 118%, rgba(79,140,255,.30), transparent 72%); }</style>`;
  return page(1080, 1080, "", body);
}

/* ============================================================
   GRID PREVIEW — how the nine plates read on the profile
   (3:4 centre crop per tile, like the Instagram grid)
   ============================================================ */

function gridPreview() {
  const tiles = PLATES.map((p) => {
    const src = pathToFileURL(join(OUT, `post-0${p.n}.png`)).href;
    return `<div class="tile"><img src="${src}"></div>`;
  }).join("");
  const css = `
    body { background:#000; display:flex; align-items:center; justify-content:center; }
    .grid { display:grid; grid-template-columns:repeat(3, 356px); gap:4px; }
    .tile { width:356px; height:475px; overflow:hidden; position:relative; }
    .tile img { position:absolute; width:390px; left:-17px; top:-6px; }
  `;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${BASE_CSS}
    body { width:1080px; height:1440px; } ${css}
  </style></head><body><div class="grid">${tiles}</div></body></html>`;
}

/* ============================================================
   Render
   ============================================================ */

function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  for (const d of readdirSync(base)) {
    if (d.startsWith("chromium-")) {
      for (const rel of ["chrome-linux/chrome", "chrome-linux/headless_shell"]) {
        const p = join(base, d, rel);
        if (existsSync(p)) return p;
      }
    }
  }
  const flat = join(base, "chromium");
  if (existsSync(flat)) return flat;
  throw new Error("Chromium binary not found — set CHROMIUM_PATH");
}

const browser = await chromium.launch({
  executablePath: findChromium(),
  args: ["--force-color-profile=srgb", "--font-render-hinting=none"],
});

const BUILD = join(process.env.SCRATCHPAD_DIR || tmpdir(), "ig-build");
mkdirSync(BUILD, { recursive: true });

async function shoot(html, w, h, file) {
  const pg = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const tmp = join(BUILD, file.replace(/\.png$/, ".html"));
  writeFileSync(tmp, html);
  await pg.goto(pathToFileURL(tmp).href, { waitUntil: "networkidle" });
  await pg.evaluate(() => document.fonts.ready);
  await pg.waitForTimeout(120);
  await pg.screenshot({ path: join(OUT, file) });
  await pg.close();
  console.log("✓", file);
}

for (const p of PLATES) await shoot(plate(p), 1080, 1350, `post-0${p.n}.png`);
await shoot(storyShipped(), 1080, 1920, "story-01-shipped.png");
await shoot(storyInsight(), 1080, 1920, "story-02-insight.png");
await shoot(avatar(), 1000, 1000, "avatar.png");
await shoot(highlight("work", "WORK"), 1080, 1080, "highlight-work.png");
await shoot(highlight("studio", "STUDIO"), 1080, 1080, "highlight-studio.png");
await shoot(highlight("ai", "AI"), 1080, 1080, "highlight-ai.png");
await shoot(highlight("process", "PROCESS"), 1080, 1080, "highlight-process.png");
await shoot(highlight("contact", "CONTACT"), 1080, 1080, "highlight-contact.png");
await shoot(gridPreview(), 1080, 1440, "grid-preview.png");

await browser.close();
console.log("done →", OUT);
