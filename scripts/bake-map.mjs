import { readFileSync, writeFileSync } from "node:fs";
import * as topojson from "topojson-client";

const topo = JSON.parse(readFileSync("node_modules/world-atlas/countries-10m.json", "utf8"));

// fenêtre: arc lémanique + Alpes + Lyon + Milan + Zurich
const LON0 = 4.4, LON1 = 10.6, LAT0 = 44.55, LAT1 = 48.35;
const W = 1000;
const mercY = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
const X = (lon) => ((lon - LON0) / (LON1 - LON0)) * W;
const yTop = mercY(LAT1), yBot = mercY(LAT0);
const H = Math.round(W * ((yTop - yBot) / (((LON1 - LON0) * Math.PI) / 180)));
const Y = (lat) => ((yTop - mercY(lat)) / (yTop - yBot)) * H;

// Sutherland–Hodgman contre le rectangle de vue
function clipRing(ring) {
  const edges = [
    (p) => p[0] >= 0, (p) => p[0] <= W, (p) => p[1] >= 0, (p) => p[1] <= H,
  ];
  const inter = [
    (a, b) => { const t = (0 - a[0]) / (b[0] - a[0]); return [0, a[1] + t * (b[1] - a[1])]; },
    (a, b) => { const t = (W - a[0]) / (b[0] - a[0]); return [W, a[1] + t * (b[1] - a[1])]; },
    (a, b) => { const t = (0 - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), 0]; },
    (a, b) => { const t = (H - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), H]; },
  ];
  let poly = ring;
  for (let e = 0; e < 4; e++) {
    const out = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      const ain = edges[e](a), bin = edges[e](b);
      if (ain && bin) out.push(b);
      else if (ain && !bin) out.push(inter[e](a, b));
      else if (!ain && bin) { out.push(inter[e](a, b)); out.push(b); }
    }
    poly = out;
    if (!poly.length) return [];
  }
  return poly;
}

const project = ([lon, lat]) => [X(lon), Y(lat)];
const fmt = (n) => Math.round(n * 10) / 10;

function geomToPath(geom) {
  const polys = geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates;
  let d = "";
  for (const poly of polys) {
    for (const ring of poly) {
      const projected = ring.map(project);
      const clipped = clipRing(projected);
      if (clipped.length < 3) continue;
      d += "M" + clipped.map((p) => `${fmt(p[0])} ${fmt(p[1])}`).join("L") + "Z";
    }
  }
  return d;
}

const fc = topojson.feature(topo, topo.objects.countries);
const WANT = { France: "FR", Switzerland: "CH", Italy: "IT", Germany: "DE", Austria: "AT", Liechtenstein: "LI" };
const countries = [];
for (const f of fc.features) {
  const name = f.properties.name;
  if (!(name in WANT)) continue;
  const d = geomToPath(f.geometry);
  if (d) countries.push({ id: WANT[name], d });
}

// frontières intérieures (mesh a!==b), coupées à la vue
const mesh = topojson.mesh(topo, topo.objects.countries, (a, b) => a !== b);
let borders = "";
for (const line of mesh.coordinates) {
  let seg = [];
  const flush = () => {
    if (seg.length > 1) borders += "M" + seg.map((p) => `${fmt(p[0])} ${fmt(p[1])}`).join("L");
    seg = [];
  };
  for (const c of line) {
    const p = project(c);
    if (p[0] >= -2 && p[0] <= W + 2 && p[1] >= -2 && p[1] <= H + 2) seg.push(p);
    else flush();
  }
  flush();
}

// échelle: km par pixel à la latitude de Genève
const kmPerDegLon = 111.32 * Math.cos((46.2 * Math.PI) / 180);
const pxPerKm = (W / (LON1 - LON0)) / kmPerDegLon;

const out = `/* ============================================================
   Carte — géométrie réelle (Natural Earth 10 m via world-atlas),
   générée par scripts: frontières FR/CH/IT/DE/AT/LI projetées en
   Mercator et coupées à la fenêtre [${LON0}..${LON1}]×[${LAT0}..${LAT1}].
   Ne pas éditer à la main — régénérer via le script de bake.
   ============================================================ */

export const MAP_W = ${W};
export const MAP_H = ${H};
export const PX_PER_KM = ${pxPerKm.toFixed(4)};

const LON0 = ${LON0}, LON1 = ${LON1}, LAT1 = ${LAT1}, LAT0 = ${LAT0};
const mercY = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
const yTop = mercY(LAT1), yBot = mercY(LAT0);
/** Projette lon/lat vers les coordonnées SVG de la carte. */
export function projectMap(lon: number, lat: number): { x: number; y: number } {
  return {
    x: ((lon - LON0) / (LON1 - LON0)) * MAP_W,
    y: ((yTop - mercY(lat)) / (yTop - yBot)) * MAP_H,
  };
}

export const COUNTRIES: { id: string; d: string }[] = ${JSON.stringify(countries)};

export const BORDERS_D = ${JSON.stringify(borders)};
`;
writeFileSync("src/lib/mapGeo.ts", out);
console.log(`ok: ${countries.map(c => c.id).join(",")} — ${W}x${H} — borders ${(borders.length/1024).toFixed(1)}kB — total ${(out.length/1024).toFixed(1)}kB`);
