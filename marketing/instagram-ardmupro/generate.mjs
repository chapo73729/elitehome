/* ============================================================
   ARDMUPRO — Instagram visual kit generator
   « Niveau Juste » : charbon chaud, ivoire tracé, un seul rouge.
   Chaque visuel est une planche numérotée du carnet de chantier.

   Run:  node marketing/instagram-ardmupro/generate.mjs
   Deps: playwright-core ; Chromium via PLAYWRIGHT_BROWSERS_PATH
   ============================================================ */

import { chromium } from "playwright-core";
import { mkdirSync, readdirSync, existsSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, "assets");
mkdirSync(OUT, { recursive: true });

/* ---------- matériaux ---------- */
const C = {
  coal: "#0d0c0c",      // charbon chaud
  coal2: "#141212",
  ivory: "#f5f2ee",     // ivoire
  warm: "#a89f97",      // gris chaud (notes)
  faint: "rgba(245,242,238,.16)",
  line: "rgba(245,242,238,.55)",
  red: "#c22333",       // rouge oxblood — l'unique accent
  red2: "#d9455379",
};

const fontURL = (f) => pathToFileURL(join(ROOT, "fonts", f)).href;

const BASE_CSS = `
  @font-face { font-family: "Gloock"; src: url("${fontURL("Gloock-Regular.ttf")}"); }
  @font-face { font-family: "Instrument Sans"; font-weight: 400; src: url("${fontURL("InstrumentSans-Regular.ttf")}"); }
  @font-face { font-family: "Instrument Sans"; font-weight: 700; src: url("${fontURL("InstrumentSans-Bold.ttf")}"); }
  @font-face { font-family: "DM Mono"; src: url("${fontURL("DMMono-Regular.ttf")}"); }
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body { background:${C.coal}; }
  body { font-family:"Instrument Sans", sans-serif; color:${C.ivory};
         -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility; overflow:hidden; }
  .mono { font-family:"DM Mono", monospace; }
  .serif { font-family:"Gloock", serif; }
`;

/* fond : charbon, trame discrète, souffle rouge bas de page */
const ground = (glow = 0.10) => `
  .ground { position:absolute; inset:0; background:${C.coal}; }
  .ground::before {
    content:""; position:absolute; inset:0;
    background-image:
      linear-gradient(rgba(245,242,238,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(245,242,238,0.035) 1px, transparent 1px);
    background-size: 108px 108px, 108px 108px;
    background-position: center top;
  }
  .ground::after {
    content:""; position:absolute; inset:0;
    background: radial-gradient(58% 40% at 50% 114%, rgba(194,35,51,${glow}), transparent 74%);
  }
`;

/* squelette : cadre filaire ivoire + tirets d'angle rouges */
function chrome({ inset, tick = 30, tw = 2.5 }) {
  const t = inset - 14;
  return `
  <div class="frame"></div>
  <div class="tk" style="top:${t}px;left:${t}px;border-top:${tw}px solid ${C.red};border-left:${tw}px solid ${C.red}"></div>
  <div class="tk" style="top:${t}px;right:${t}px;border-top:${tw}px solid ${C.red};border-right:${tw}px solid ${C.red}"></div>
  <div class="tk" style="bottom:${t}px;left:${t}px;border-bottom:${tw}px solid ${C.red};border-left:${tw}px solid ${C.red}"></div>
  <div class="tk" style="bottom:${t}px;right:${t}px;border-bottom:${tw}px solid ${C.red};border-right:${tw}px solid ${C.red}"></div>
  <style>
    .frame { position:absolute; inset:${inset}px; border:1px solid rgba(245,242,238,.14); }
    .tk { position:absolute; width:${tick}px; height:${tick}px; }
  </style>`;
}

/* le motif signature : niveau à bulle, toujours de niveau */
const level = (w = 220, cls = "") => `
  <svg class="${cls}" width="${w}" height="18" viewBox="0 0 ${w} 18" fill="none">
    <line x1="0" y1="9" x2="${w}" y2="9" stroke="rgba(245,242,238,.4)" stroke-width="1"/>
    <line x1="${w / 2 - 26}" y1="2" x2="${w / 2 - 26}" y2="16" stroke="rgba(245,242,238,.4)" stroke-width="1"/>
    <line x1="${w / 2 + 26}" y1="2" x2="${w / 2 + 26}" y2="16" stroke="rgba(245,242,238,.4)" stroke-width="1"/>
    <ellipse cx="${w / 2}" cy="9" rx="9" ry="5.5" fill="${C.red}"/>
  </svg>`;

const page = (w, h, extraCss, body) => `<!doctype html><html><head><meta charset="utf-8"><style>
  ${BASE_CSS}
  body { width:${w}px; height:${h}px; position:relative; }
  ${ground()}
  ${extraCss}
</style></head><body><div class="ground"></div>${body}</body></html>`;

/* ============================================================
   PLANCHES — 1080 × 1350 (4:5)
   ============================================================ */

const PLATE_CSS = `
  .head { position:absolute; top:94px; left:112px; right:112px;
          display:flex; justify-content:space-between; align-items:baseline; }
  .head .id { font-family:"Instrument Sans"; font-weight:700; font-size:20px;
              letter-spacing:.34em; color:${C.ivory}; }
  .head .id b { color:${C.red}; }
  .head .no { font-family:"DM Mono"; font-size:16px; letter-spacing:.2em; color:${C.warm}; }
  .figure { position:absolute; left:0; right:0; display:flex; justify-content:center; }
  .copy { position:absolute; left:112px; right:112px; }
  .eyebrow { font-family:"DM Mono"; font-size:18px; letter-spacing:.34em; color:${C.red};
             display:flex; align-items:center; gap:26px; }
  .eyebrow svg { flex:none; }
  .statement { font-family:"Gloock", serif; font-weight:400; font-size:86px;
               line-height:1.14; letter-spacing:.005em; color:${C.ivory}; margin-top:30px; }
  .statement .dim { color:${C.warm}; }
  .sub { margin-top:24px; font-size:25px; color:${C.warm}; line-height:1.5; letter-spacing:.01em; }
  .foot { position:absolute; bottom:94px; left:112px; right:112px;
          display:flex; justify-content:space-between; align-items:baseline;
          font-family:"DM Mono"; font-size:15px; letter-spacing:.22em; }
  .foot .l { color:${C.warm}; }
  .foot .r { color:${C.ivory}; }
`;

function plate({ n, section, figure, figureTop, copyTop, eyebrow, statement, sub }) {
  const body = `
    ${chrome({ inset: 64 })}
    <div class="head">
      <span class="id">ARDMU<b>PRO</b></span>
      <span class="no">PL.${String(n).padStart(2, "0")} — SUISSE</span>
    </div>
    <div class="figure" style="top:${figureTop}px;">${figure}</div>
    <div class="copy" style="top:${copyTop}px;">
      <div class="eyebrow"><span>${eyebrow}</span>${level(200)}</div>
      <div class="statement">${statement}</div>
      ${sub ? `<div class="sub">${sub}</div>` : ""}
    </div>
    <div class="foot">
      <span class="l">RÉNOVATION &amp; SECOND ŒUVRE — ${section}</span>
      <span class="r">ARDMUPRO.CH</span>
    </div>`;
  return page(1080, 1350, PLATE_CSS, body);
}

/* ---------- figures (encre ivoire, un point de rouge) ---------- */
const iv = "rgba(245,242,238,.72)";
const iv2 = "rgba(245,242,238,.4)";
const gd = "rgba(245,242,238,.2)";

/* PL.01 — le grand niveau, posé de niveau */
const figNiveau = `
<svg width="720" height="430" viewBox="0 0 720 430" fill="none">
  <line x1="30" y1="330" x2="690" y2="330" stroke="${gd}" stroke-width="1"/>
  ${Array.from({ length: 45 }, (_, i) => {
    const x = 30 + i * 15;
    return `<line x1="${x}" y1="330" x2="${x}" y2="${330 - (i % 5 === 0 ? 12 : 6)}" stroke="${gd}" stroke-width="1"/>`;
  }).join("")}
  <!-- le corps du niveau -->
  <rect x="80" y="196" width="560" height="76" rx="6" stroke="${iv}" stroke-width="2" fill="rgba(20,18,18,.7)"/>
  <line x1="80" y1="234" x2="640" y2="234" stroke="${gd}" stroke-width="1"/>
  <!-- fiole centrale -->
  <rect x="308" y="212" width="104" height="44" rx="22" stroke="${iv}" stroke-width="1.6" fill="none"/>
  <line x1="342" y1="212" x2="342" y2="256" stroke="${iv2}" stroke-width="1.2"/>
  <line x1="378" y1="212" x2="378" y2="256" stroke="${iv2}" stroke-width="1.2"/>
  <ellipse cx="360" cy="234" rx="15" ry="9" fill="${C.red}"/>
  <!-- fioles latérales -->
  <rect x="132" y="216" width="36" height="36" rx="18" stroke="${iv2}" stroke-width="1.4" fill="none"/>
  <rect x="552" y="216" width="36" height="36" rx="18" stroke="${iv2}" stroke-width="1.4" fill="none"/>
  <!-- cotation -->
  <line x1="80" y1="150" x2="640" y2="150" stroke="${iv2}" stroke-width="1"/>
  <line x1="80" y1="142" x2="80" y2="158" stroke="${iv2}" stroke-width="1"/>
  <line x1="640" y1="142" x2="640" y2="158" stroke="${iv2}" stroke-width="1"/>
  <text x="360" y="128" text-anchor="middle" font-family="DM Mono" font-size="15" letter-spacing="4" fill="${C.warm}">0.0 MM / M</text>
  <text x="360" y="392" text-anchor="middle" font-family="DM Mono" font-size="14" letter-spacing="4" fill="${C.warm}">DE NIVEAU — TOUJOURS</text>
</svg>`;

/* PL.02 — trois fils à plomb, parfaitement verticaux */
const figPlomb = `
<svg width="620" height="460" viewBox="0 0 620 460" fill="none">
  <line x1="60" y1="40" x2="560" y2="40" stroke="${iv}" stroke-width="2"/>
  ${[160, 310, 460].map((x, i) => `
    <line x1="${x}" y1="40" x2="${x}" y2="330" stroke="${i === 1 ? iv : iv2}" stroke-width="1.2"/>
    <path d="M${x} 330 L${x - 11} 352 L${x} 396 L${x + 11} 352 Z" stroke="${i === 1 ? iv : iv2}" stroke-width="1.6" fill="${i === 1 ? "rgba(194,35,51,.9)" : "rgba(20,18,18,.7)"}"/>
    <circle cx="${x}" cy="40" r="4" fill="${i === 1 ? C.red : "none"}" stroke="${iv}" stroke-width="1.2"/>`).join("")}
  ${Array.from({ length: 3 }, (_, i) => `
    <line x1="${160 + i * 150 + 20}" y1="418" x2="${160 + i * 150 - 20 + 150 - 40 > 0 ? 160 + i * 150 + 130 : 0}" y2="418" stroke="0" />`).join("")}
  <line x1="60" y1="430" x2="560" y2="430" stroke="${gd}" stroke-width="1"/>
  <text x="310" y="24" text-anchor="middle" font-family="DM Mono" font-size="14" letter-spacing="4" fill="${C.warm}">VERTICALITÉ · CONTRÔLÉE ×3</text>
</svg>`;

/* PL.03 — gypserie : coupe de mur, passes de lissage en arcs */
const figGypse = `
<svg width="640" height="470" viewBox="0 0 640 470" fill="none">
  <!-- coupe du mur -->
  <rect x="60" y="60" width="66" height="350" stroke="${iv2}" stroke-width="1.4" fill="none"/>
  ${Array.from({ length: 12 }, (_, i) => `<line x1="60" y1="${72 + i * 28}" x2="126" y2="${60 + i * 28}" stroke="${gd}" stroke-width="1"/>`).join("")}
  <rect x="126" y="60" width="26" height="350" stroke="${iv2}" stroke-width="1.4" fill="rgba(245,242,238,.05)"/>
  <line x1="152" y1="60" x2="152" y2="410" stroke="${iv}" stroke-width="2.2"/>
  <!-- passes de la taloche : arcs concentriques -->
  ${[0, 1, 2, 3].map((i) => `
    <path d="M ${240 + i * 8} ${396 - i * 4} C ${300 + i * 10} ${300 - i * 22}, ${420 - i * 6} ${240 - i * 18}, ${560 - i * 12} ${212 - i * 10}"
          stroke="${i === 3 ? iv : iv2}" stroke-width="${1 + i * 0.35}" fill="none"/>`).join("")}
  <circle cx="560" cy="202" r="5" fill="${C.red}"/>
  <line x1="200" y1="440" x2="600" y2="440" stroke="${gd}" stroke-width="1"/>
  ${Array.from({ length: 21 }, (_, i) => `<line x1="${200 + i * 20}" y1="440" x2="${200 + i * 20}" y2="${440 - (i % 5 === 0 ? 10 : 5)}" stroke="${gd}" stroke-width="1"/>`).join("")}
  <text x="90" y="40" font-family="DM Mono" font-size="13" letter-spacing="3" fill="${C.warm}">COUPE A–A</text>
  <text x="420" y="120" text-anchor="middle" font-family="DM Mono" font-size="13" letter-spacing="3" fill="${C.warm}">PASSES DE FINITION ×4</text>
  <text x="420" y="470" text-anchor="middle" font-family="DM Mono" font-size="13" letter-spacing="3" fill="${C.warm}">ÉPAISSEUR CONSTANTE</text>
</svg>`;

/* PL.04 — peinture : nuancier tiré au cordeau */
const figPeinture = `
<svg width="640" height="450" viewBox="0 0 640 450" fill="none">
  ${[
    ["rgba(245,242,238,.10)", "BLANC MINÉRAL"],
    ["rgba(245,242,238,.22)", "PIERRE"],
    ["rgba(245,242,238,.38)", "LIN"],
    ["rgba(168,159,151,.5)", "TAUPE"],
    ["rgba(194,35,51,.85)", "OXBLOOD — 01"],
  ].map(([f, t], i) => `
    <rect x="${70 + i * 104}" y="70" width="84" height="240" fill="${f}" stroke="rgba(245,242,238,.28)" stroke-width="1"/>
    <line x1="${70 + i * 104 + 42}" y1="310" x2="${70 + i * 104 + 42}" y2="330" stroke="${gd}" stroke-width="1"/>
    <text x="${70 + i * 104 + 42}" y="356" text-anchor="middle" font-family="DM Mono" font-size="11.5" letter-spacing="1.5" fill="${i === 4 ? C.red : C.warm}">${t}</text>`).join("")}
  <line x1="70" y1="40" x2="590" y2="40" stroke="${iv2}" stroke-width="1"/>
  <line x1="70" y1="32" x2="70" y2="48" stroke="${iv2}" stroke-width="1"/>
  <line x1="590" y1="32" x2="590" y2="48" stroke="${iv2}" stroke-width="1"/>
  <text x="330" y="20" text-anchor="middle" font-family="DM Mono" font-size="13" letter-spacing="3" fill="${C.warm}">TEINTES À L'ÉCHANTILLON</text>
  <line x1="70" y1="404" x2="590" y2="404" stroke="${gd}" stroke-width="1"/>
  <text x="330" y="438" text-anchor="middle" font-family="DM Mono" font-size="13" letter-spacing="3" fill="${C.warm}">2 COUCHES + FOND DUR</text>
</svg>`;

/* PL.05 — isolation : coupe, la chaleur reste du bon côté */
const figIsolation = `
<svg width="640" height="460" viewBox="0 0 640 460" fill="none">
  <!-- coupe : ext / isolant / int -->
  <rect x="150" y="50" width="60" height="330" stroke="${iv2}" stroke-width="1.4" fill="none"/>
  ${Array.from({ length: 11 }, (_, i) => `<line x1="150" y1="${62 + i * 30}" x2="210" y2="${50 + i * 30}" stroke="${gd}" stroke-width="1"/>`).join("")}
  <rect x="210" y="50" width="110" height="330" stroke="${iv}" stroke-width="1.6" fill="rgba(245,242,238,.04)"/>
  ${Array.from({ length: 6 }, (_, i) => `
    <path d="M ${222 + i * 16} 60 q 10 20 0 40 q -10 20 0 40 q 10 20 0 40 q -10 20 0 40 q 10 20 0 40 q -10 20 0 40 q 10 20 0 30"
          stroke="${iv2}" stroke-width="1" fill="none"/>`).join("")}
  <rect x="320" y="50" width="34" height="330" stroke="${iv2}" stroke-width="1.4" fill="rgba(245,242,238,.06)"/>
  <!-- flux stoppé -->
  <line x1="470" y1="215" x2="378" y2="215" stroke="${C.red}" stroke-width="2.2"/>
  <path d="M378 215 L396 206 L396 224 Z" fill="${C.red}"/>
  <line x1="360" y1="190" x2="360" y2="240" stroke="${C.red}" stroke-width="2.4"/>
  <text x="500" y="207" font-family="DM Mono" font-size="13" letter-spacing="2" fill="${C.warm}">FROID</text>
  <text x="96" y="207" text-anchor="end" font-family="DM Mono" font-size="13" letter-spacing="2" fill="${C.warm}">CONFORT</text>
  <text x="252" y="30" font-family="DM Mono" font-size="13" letter-spacing="3" fill="${C.warm}">λ MIN.</text>
  <line x1="150" y1="412" x2="354" y2="412" stroke="${iv2}" stroke-width="1"/>
  <line x1="150" y1="404" x2="150" y2="420" stroke="${iv2}" stroke-width="1"/>
  <line x1="354" y1="404" x2="354" y2="420" stroke="${iv2}" stroke-width="1"/>
  <text x="252" y="446" text-anchor="middle" font-family="DM Mono" font-size="13" letter-spacing="3" fill="${C.warm}">THERMIQUE + PHONIQUE</text>
</svg>`;

/* PL.06 — façades : élévation, chaque baie à sa cote */
const figFacade = `
<svg width="620" height="470" viewBox="0 0 620 470" fill="none">
  <rect x="90" y="60" width="440" height="330" stroke="${iv}" stroke-width="2"/>
  <line x1="90" y1="120" x2="530" y2="120" stroke="${iv2}" stroke-width="1"/>
  ${[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => `
    <rect x="${122 + c * 108}" y="${146 + r * 78}" width="64" height="50" stroke="${r === 1 && c === 3 ? C.red : iv2}" stroke-width="${r === 1 && c === 3 ? 1.8 : 1.2}" fill="none"/>
    <line x1="${122 + c * 108}" y1="${146 + r * 78 + 25}" x2="${122 + c * 108 + 64}" y2="${146 + r * 78 + 25}" stroke="${gd}" stroke-width="1"/>`).join("")).join("")}
  <line x1="90" y1="418" x2="530" y2="418" stroke="${iv2}" stroke-width="1"/>
  ${[90, 198, 306, 414, 530].map((x) => `<line x1="${x}" y1="410" x2="${x}" y2="426" stroke="${iv2}" stroke-width="1"/>`).join("")}
  <text x="310" y="452" text-anchor="middle" font-family="DM Mono" font-size="13" letter-spacing="3" fill="${C.warm}">TRAVÉES ÉGALES ×4</text>
  <line x1="560" y1="60" x2="560" y2="390" stroke="${iv2}" stroke-width="1"/>
  <line x1="552" y1="60" x2="568" y2="60" stroke="${iv2}" stroke-width="1"/>
  <line x1="552" y1="390" x2="568" y2="390" stroke="${iv2}" stroke-width="1"/>
  <text x="588" y="230" font-family="DM Mono" font-size="13" letter-spacing="2" fill="${C.warm}" transform="rotate(90 588 230)">ÉLÉVATION SUD</text>
  <text x="90" y="40" font-family="DM Mono" font-size="13" letter-spacing="3" fill="${C.warm}">RAVALEMENT — CRÉPI FIN</text>
</svg>`;

/* PL.07 — revêtements : chevrons posés au trait */
const figParquet = (() => {
  let lames = "";
  const w = 84, h2 = 30;
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 6; c++) {
      const x = 96 + c * w, y = 80 + r * 60;
      const last = r === 2 && c === 4;
      lames += `
        <path d="M${x} ${y + h2} L${x + w / 2} ${y} L${x + w / 2} ${y + h2} L${x} ${y + 2 * h2} Z" stroke="${last ? C.red : iv2}" stroke-width="${last ? 1.8 : 1.1}" fill="${last ? "rgba(194,35,51,.14)" : "none"}"/>
        <path d="M${x + w / 2} ${y} L${x + w} ${y + h2} L${x + w} ${y + 2 * h2} L${x + w / 2} ${y + h2} Z" stroke="${iv2}" stroke-width="1.1" fill="none"/>`;
    }
  }
  return `
<svg width="700" height="470" viewBox="0 0 700 470" fill="none">
  ${lames}
  <rect x="96" y="80" width="504" height="300" stroke="${iv}" stroke-width="2" fill="none"/>
  <line x1="96" y1="410" x2="600" y2="410" stroke="${iv2}" stroke-width="1"/>
  <line x1="96" y1="402" x2="96" y2="418" stroke="${iv2}" stroke-width="1"/>
  <line x1="600" y1="402" x2="600" y2="418" stroke="${iv2}" stroke-width="1"/>
  <text x="348" y="446" text-anchor="middle" font-family="DM Mono" font-size="13" letter-spacing="3" fill="${C.warm}">POSE BÂTONS ROMPUS — 45°</text>
  <text x="348" y="52" text-anchor="middle" font-family="DM Mono" font-size="13" letter-spacing="3" fill="${C.warm}">CALEPINAGE PL.07</text>
</svg>`;
})();

/* PL.08 — rénover avant de vendre : la valeur, marche par marche */
const figValeur = `
<svg width="640" height="450" viewBox="0 0 640 450" fill="none">
  <line x1="70" y1="390" x2="590" y2="390" stroke="${iv2}" stroke-width="1.4"/>
  <line x1="70" y1="390" x2="70" y2="60" stroke="${iv2}" stroke-width="1.4"/>
  ${Array.from({ length: 7 }, (_, i) => `<line x1="62" y1="${390 - i * 50}" x2="70" y2="${390 - i * 50}" stroke="${iv2}" stroke-width="1"/>`).join("")}
  ${[
    [110, 310, "ÉTAT ACTUEL", iv2, "none"],
    [230, 250, "GYPSERIE", iv2, "none"],
    [350, 200, "PEINTURE", iv2, "none"],
    [470, 120, "VALEUR DE VENTE", C.red, "rgba(194,35,51,.12)"],
  ].map(([x, y, t, s, f]) => `
    <rect x="${x}" y="${y}" width="80" height="${390 - y}" stroke="${s}" stroke-width="${s === C.red ? 2 : 1.3}" fill="${f}"/>
    <text x="${Number(x) + 40}" y="${Number(y) - 14}" text-anchor="middle" font-family="DM Mono" font-size="11.5" letter-spacing="1.5" fill="${s === C.red ? C.red : C.warm}">${t}</text>`).join("")}
  <path d="M150 290 C 240 240, 330 200, 456 132" stroke="${iv}" stroke-width="1.4" stroke-dasharray="6 6" fill="none"/>
  <path d="M456 132 L438 132 L450 118 Z" fill="${C.ivory}"/>
  <text x="330" y="436" text-anchor="middle" font-family="DM Mono" font-size="13" letter-spacing="3" fill="${C.warm}">LES BONS TRAVAUX, DANS LE BON ORDRE</text>
</svg>`;

/* PL.09 — contact : le devis, vérifié ligne à ligne */
const figDevis = `
<svg width="640" height="420" viewBox="0 0 640 420" fill="none">
  <rect x="30" y="20" width="580" height="380" rx="8" stroke="${iv2}" stroke-width="1.4" fill="rgba(20,18,18,.78)"/>
  <line x1="30" y1="84" x2="610" y2="84" stroke="${gd}" stroke-width="1"/>
  <text x="64" y="60" font-family="DM Mono" font-size="16" letter-spacing="3" fill="${C.ivory}">DEVIS — N° 2026.____</text>
  <text x="576" y="60" text-anchor="end" font-family="DM Mono" font-size="15" letter-spacing="2" fill="${C.red}">GRATUIT</text>
  ${[
    ["Visite du chantier", "OFFERTE"],
    ["Métré précis", "COMPRIS"],
    ["Prix ferme, sans surprise", "GARANTI"],
    ["Délais tenus", "ENGAGÉS"],
  ].map(([l, r], i) => `
    <path d="M64 ${124 + i * 56} l8 9 l15 -17" stroke="${C.red}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="110" y="${132 + i * 56}" font-family="DM Mono" font-size="17" letter-spacing="1" fill="${C.ivory}">${l}</text>
    <text x="576" y="${132 + i * 56}" text-anchor="end" font-family="DM Mono" font-size="14" letter-spacing="2" fill="${C.warm}">${r}</text>
    <line x1="64" y1="${146 + i * 56}" x2="576" y2="${146 + i * 56}" stroke="${gd}" stroke-width="1"/>`).join("")}
  <text x="64" y="376" font-family="DM Mono" font-size="16" letter-spacing="2" fill="${C.warm}">SIGNATURE ________________</text>
  <ellipse cx="540" cy="368" rx="12" ry="7" fill="${C.red}"/>
</svg>`;

const PLATES = [
  {
    n: 1, section: "IDENTITÉ",
    figure: figNiveau, figureTop: 240, copyTop: 840,
    eyebrow: "RÉNOVATION & SECOND ŒUVRE — SUISSE",
    statement: `Rénover,<br><span class="dim">au niveau juste.</span>`,
    sub: "Gypserie · Peinture · Isolation · Façades · Revêtements — en Suisse.",
  },
  {
    n: 2, section: "MANIFESTE",
    figure: figPlomb, figureTop: 225, copyTop: 840,
    eyebrow: "NOTRE ENGAGEMENT",
    statement: `Solidité. Précision.<br><span class="dim">Sérénité.</span>`,
    sub: "Ce que nous devons à chaque client — quelles que soient les contraintes.",
  },
  {
    n: 3, section: "SERVICE 01/05",
    figure: figGypse, figureTop: 215, copyTop: 840,
    eyebrow: "GYPSERIE — PLÂTRERIE",
    statement: `Des murs<br><span class="dim">lisses comme neufs.</span>`,
    sub: "Cloisons, plafonds, enduits — une finition qui se voit à la lumière rasante.",
  },
  {
    n: 4, section: "SERVICE 02/05",
    figure: figPeinture, figureTop: 235, copyTop: 840,
    eyebrow: "PEINTURE",
    statement: `La couleur,<br><span class="dim">posée juste.</span>`,
    sub: "Intérieur & extérieur — préparation soignée, rendu régulier, teintes durables.",
  },
  {
    n: 5, section: "SERVICE 03/05",
    figure: figIsolation, figureTop: 225, copyTop: 840,
    eyebrow: "ISOLATION",
    statement: `Le confort reste,<br><span class="dim">le froid dehors.</span>`,
    sub: "Isolation thermique & phonique — performance, économies, silence.",
  },
  {
    n: 6, section: "SERVICE 04/05",
    figure: figFacade, figureTop: 215, copyTop: 840,
    eyebrow: "FAÇADES",
    statement: `Une façade<br><span class="dim">qui tient parole.</span>`,
    sub: "Ravalement, crépi, peinture extérieure — la première impression, refaite pour durer.",
  },
  {
    n: 7, section: "SERVICE 05/05",
    figure: figParquet, figureTop: 215, copyTop: 840,
    eyebrow: "REVÊTEMENTS — SOLS & MURS",
    statement: `Des sols posés<br><span class="dim">au millimètre.</span>`,
    sub: "Parquets, carrelages, sols souples — calepinage précis, pose impeccable.",
  },
  {
    n: 8, section: "CONSEIL",
    figure: figValeur, figureTop: 235, copyTop: 840,
    eyebrow: "LE CONSEIL ARDMUPRO",
    statement: `Rénover avant<br><span class="dim">de vendre.</span>`,
    sub: "Les bons travaux augmentent la valeur du bien — nous ciblons les plus rentables.",
  },
  {
    n: 9, section: "CONTACT",
    figure: figDevis, figureTop: 620, copyTop: 230,
    eyebrow: "PARLONS DE VOTRE CHANTIER",
    statement: `Un projet ?<br><span class="dim">Devis gratuit.</span>`,
    sub: "Réponse rapide — www.ardmupro.ch, ou message direct ici.",
  },
];

/* ============================================================
   STORIES — 1080 × 1920
   ============================================================ */

const STORY_CSS = `
  .head { position:absolute; top:150px; left:112px; right:112px;
          display:flex; justify-content:space-between; align-items:baseline; }
  .head .id { font-family:"Instrument Sans"; font-weight:700; font-size:24px; letter-spacing:.34em; color:${C.ivory}; }
  .head .id b { color:${C.red}; }
  .head .no { font-family:"DM Mono"; font-size:18px; letter-spacing:.2em; color:${C.warm}; }
  .eyebrow { font-family:"DM Mono"; font-size:23px; letter-spacing:.4em; color:${C.red}; }
  .statement { font-family:"Gloock", serif; font-size:120px; line-height:1.1; color:${C.ivory}; }
  .statement .dim { color:${C.warm}; }
  .sub { font-size:31px; color:${C.warm}; line-height:1.5; }
  .chip { display:inline-flex; align-items:center; gap:20px;
          border:1px solid rgba(194,35,51,.6); border-radius:999px;
          padding:26px 46px; font-family:"DM Mono"; font-size:24px;
          letter-spacing:.2em; color:${C.ivory}; background:rgba(194,35,51,.08); }
  .chip b { color:${C.red}; }
  .foot { position:absolute; bottom:150px; left:112px; right:112px;
          display:flex; justify-content:space-between;
          font-family:"DM Mono"; font-size:19px; letter-spacing:.2em; color:${C.warm}; }
  .foot .l { color:${C.red}; }
  .zone { border:1px dashed rgba(245,242,238,.28); display:flex;
          align-items:center; justify-content:center;
          font-family:"DM Mono"; font-size:22px; letter-spacing:.3em; color:${C.warm}; }
`;

function storyAvantApres() {
  const body = `
    ${chrome({ inset: 72, tick: 36 })}
    <div class="head">
      <span class="id">ARDMU<b>PRO</b></span>
      <span class="no">ST.01</span>
    </div>
    <div style="position:absolute; top:300px; left:112px; right:112px;">
      <div class="eyebrow">CHANTIER — SEMAINE __</div>
      <div class="statement" style="margin-top:40px;">Avant<span class="dim"> / </span>Après</div>
    </div>
    <div class="zone" style="position:absolute; top:640px; left:112px; right:112px; height:420px;">PHOTO — AVANT</div>
    <div style="position:absolute; top:1088px; left:112px; right:112px; display:flex; align-items:center; gap:28px;">
      ${level(320)}
      <span class="mono" style="font-size:19px; letter-spacing:.3em; color:${C.warm};">MÊME CADRAGE</span>
    </div>
    <div class="zone" style="position:absolute; top:1150px; left:112px; right:112px; height:420px; border-color:rgba(194,35,51,.55); color:${C.ivory};">PHOTO — APRÈS</div>
    <div class="foot">
      <span class="l">GYPSERIE · PEINTURE</span>
      <span>ARDMUPRO.CH</span>
    </div>`;
  return page(1080, 1920, STORY_CSS, body);
}

function storyConseil() {
  const body = `
    ${chrome({ inset: 72, tick: 36 })}
    <div class="head">
      <span class="id">ARDMU<b>PRO</b></span>
      <span class="no">ST.02</span>
    </div>
    <div style="position:absolute; top:430px; left:112px; right:112px;">
      <div class="eyebrow">LE CONSEIL DU LUNDI — N° __</div>
      <div class="statement" style="margin-top:48px; font-size:104px;">« Peignez le plafond<br><span class="dim">avant les murs. »</span></div>
    </div>
    <div style="position:absolute; top:1130px; left:112px; right:112px;">
      ${level(856)}
      <div class="sub" style="margin-top:44px;">L'ordre des travaux fait la moitié de la qualité.<br>L'autre moitié, c'est la patience.</div>
    </div>
    <div style="position:absolute; bottom:300px; left:112px;">
      <span class="chip">TOUS LES CONSEILS — <b>@ARDMUPRO</b></span>
    </div>
    <div class="foot">
      <span class="l">CONSEILS</span>
      <span>ARDMUPRO.CH</span>
    </div>`;
  return page(1080, 1920, STORY_CSS, body);
}

/* ============================================================
   AVATAR — 1000 × 1000
   ============================================================ */

function avatar() {
  const body = `
    <div style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:34px; padding-bottom:30px;">
      <div style="font-family:'Instrument Sans'; font-weight:700; font-size:170px; letter-spacing:.06em; color:${C.ivory}; line-height:1;">ARDMU</div>
      <div style="display:flex; align-items:center; gap:30px;">
        <div style="height:2px; width:120px; background:rgba(245,242,238,.35);"></div>
        <div style="font-family:'Instrument Sans'; font-weight:700; font-size:96px; letter-spacing:.1em; color:${C.red}; line-height:1;">PRO</div>
        <div style="height:2px; width:120px; background:rgba(245,242,238,.35);"></div>
      </div>
      ${level(300)}
    </div>
    <style>.ground::after { background: radial-gradient(70% 55% at 50% 118%, rgba(194,35,51,.22), transparent 72%); }</style>`;
  return page(1000, 1000, "", body);
}

/* ============================================================
   HIGHLIGHTS — 1080 × 1080
   ============================================================ */

const HL_ICONS = {
  services: `<rect x="14" y="38" width="60" height="14" rx="3" stroke="${C.ivory}" stroke-width="2" fill="none"/>
             <rect x="36" y="41" width="16" height="8" rx="4" stroke="${C.ivory}" stroke-width="1.4" fill="none"/>
             <ellipse cx="44" cy="45" rx="4" ry="2.4" fill="${C.red}"/>`,
  projets: `<rect x="18" y="18" width="52" height="52" stroke="${C.ivory}" stroke-width="2" fill="none"/>
            <line x1="18" y1="34" x2="70" y2="34" stroke="rgba(245,242,238,.5)" stroke-width="1.4"/>
            <rect x="28" y="44" width="14" height="12" stroke="rgba(245,242,238,.6)" stroke-width="1.4" fill="none"/>
            <rect x="48" y="44" width="14" height="12" stroke="${C.red}" stroke-width="1.6" fill="none"/>`,
  avantapres: `<circle cx="44" cy="44" r="27" stroke="${C.ivory}" stroke-width="2" fill="none"/>
               <line x1="44" y1="17" x2="44" y2="71" stroke="${C.ivory}" stroke-width="1.6"/>
               <path d="M44 17 A27 27 0 0 1 44 71 Z" fill="rgba(194,35,51,.55)"/>`,
  conseils: `<line x1="44" y1="16" x2="44" y2="72" stroke="rgba(245,242,238,.0)"/>
             <path d="M44 20 v22 M44 20 l-17 10 M44 20 l17 10 M44 42 l-17 -12 M44 42 l17 -12" stroke="${C.ivory}" stroke-width="2" stroke-linecap="round"/>
             <line x1="27" y1="58" x2="61" y2="58" stroke="${C.ivory}" stroke-width="2"/>
             <ellipse cx="44" cy="58" rx="6" ry="3.6" fill="${C.red}"/>
             <line x1="35" y1="52" x2="35" y2="64" stroke="rgba(245,242,238,.5)" stroke-width="1.2"/>
             <line x1="53" y1="52" x2="53" y2="64" stroke="rgba(245,242,238,.5)" stroke-width="1.2"/>`,
  contact: `<rect x="18" y="24" width="52" height="40" rx="4" stroke="${C.ivory}" stroke-width="2" fill="none"/>
            <path d="M20 28 L44 48 L68 28" stroke="${C.red}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
};

function highlight(key, label) {
  const body = `
    <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center;">
      <div style="position:relative; width:660px; height:660px; display:flex; align-items:center; justify-content:center;">
        <div style="position:absolute; inset:0; border:1px solid rgba(245,242,238,.22); border-radius:50%;"></div>
        <div style="position:absolute; inset:56px; border:1px dashed rgba(194,35,51,.4); border-radius:50%;"></div>
        <svg width="320" height="320" viewBox="0 0 88 88" fill="none" style="margin-top:-46px;">${HL_ICONS[key]}</svg>
        <div class="mono" style="position:absolute; bottom:138px; left:0; right:0; text-align:center;
             font-size:29px; letter-spacing:.42em; color:${C.warm}; padding-left:.42em;">${label}</div>
      </div>
    </div>
    <style>.ground::after { background: radial-gradient(70% 55% at 50% 118%, rgba(194,35,51,.18), transparent 72%); }</style>`;
  return page(1080, 1080, "", body);
}

/* ============================================================
   APERÇU GRILLE — recadrage 3:4 façon profil Instagram
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
   Rendu
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

const BUILD = join(process.env.SCRATCHPAD_DIR || tmpdir(), "ig-ardmupro-build");
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
await shoot(storyAvantApres(), 1080, 1920, "story-01-avant-apres.png");
await shoot(storyConseil(), 1080, 1920, "story-02-conseil.png");
await shoot(avatar(), 1000, 1000, "avatar.png");
await shoot(highlight("services", "SERVICES"), 1080, 1080, "highlight-services.png");
await shoot(highlight("projets", "PROJETS"), 1080, 1080, "highlight-projets.png");
await shoot(highlight("avantapres", "AVANT / APRÈS"), 1080, 1080, "highlight-avant-apres.png");
await shoot(highlight("conseils", "CONSEILS"), 1080, 1080, "highlight-conseils.png");
await shoot(highlight("contact", "CONTACT"), 1080, 1080, "highlight-contact.png");
await shoot(gridPreview(), 1080, 1440, "grid-preview.png");

await browser.close();
console.log("done →", OUT);
