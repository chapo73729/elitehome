"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CITIES } from "@/lib/site";
import { WORLD_DOTS } from "@/lib/worldDots";
import { audio } from "@/lib/audio";
import { useLite } from "@/hooks/useDeviceTier";
import { onAccent, accentRGB } from "@/lib/accent";

/* ------------------------------------------------------------------ *
 * Equirectangular projection shared by the dot map AND the city pins, *
 * so a city always lands exactly on its geography.                    *
 *   x = (lon + 180) / 360        (0..1)                               *
 *   y = (90 - lat) / 180         (0..1)                               *
 * The map is drawn in a 1000 x 500 space (full globe) and cropped     *
 * vertically to the populated latitude band.                          *
 *                                                                     *
 * Everything painterly (dot matrix, graticule, arcs, traveling       *
 * pulses, hub glows, radar sweep) lives on ONE canvas driven by ONE   *
 * rAF loop; the SVG on top only carries labels and hit areas. Both    *
 * layers share the same animated viewBox transform so geography,      *
 * arcs and pins stay registered while zooming.                        *
 * ------------------------------------------------------------------ */
const VB_W = 1000;
const VB_H = 500;
const LAT_MAX = 83;
const LAT_MIN = -56;
const Y_TOP = ((90 - LAT_MAX) / 180) * VB_H; // ~19.4
const Y_BOT = ((90 - LAT_MIN) / 180) * VB_H; // ~405.5
const VB_CROP_H = Y_BOT - Y_TOP;

function project(lon: number, lat: number) {
  return {
    x: ((lon + 180) / 360) * VB_W,
    y: ((90 - lat) / 180) * VB_H,
  };
}

const cityPts = CITIES.map((c) => ({ ...c, ...project(c.lon, c.lat) }));

// Label placement tuned so nothing overlaps or clips at the edges (desktop).
const LABEL: Record<string, { dx: number; dy: number; anchor: "start" | "end" }> = {
  Prague: { dx: 9, dy: -7, anchor: "start" },
  Geneva: { dx: -9, dy: 15, anchor: "end" },
  Singapore: { dx: 9, dy: 14, anchor: "start" },
  Dubai: { dx: 9, dy: -7, anchor: "start" },
  Tokyo: { dx: -9, dy: -7, anchor: "end" },
  "New York": { dx: -9, dy: -7, anchor: "end" },
};

// Mobile label placement: hand-picked anchor sides so no two labels can
// collide at phone sizes even with the larger type. Europe is the tight
// spot — Prague goes above-right, Geneva below-left, so they diverge.
const LABEL_M: Record<string, { dx: number; dy: number; anchor: "start" | "end" }> = {
  Prague: { dx: 9, dy: -11, anchor: "start" },
  Geneva: { dx: -9, dy: 26, anchor: "end" },
  "New York": { dx: 9, dy: -11, anchor: "start" },
  Dubai: { dx: 10, dy: 5, anchor: "start" },
  Singapore: { dx: -7, dy: 26, anchor: "end" },
  Tokyo: { dx: -9, dy: -11, anchor: "end" },
};

// Country · timezone sub-label for each hub.
const META: Record<string, string> = {
  Prague: "CZ · HQ",
  Geneva: "CH · GMT+1",
  Singapore: "SG · GMT+8",
  Dubai: "AE · GMT+4",
  Tokyo: "JP · GMT+9",
  "New York": "US · GMT−5",
};

const HQ = "Prague";

const byName = (n: string) => cityPts.find((c) => c.name === n)!;

// Routes between hubs (great-circle look via a lifted quadratic control point).
const ROUTES: [string, string][] = [
  ["Prague", "New York"],
  ["Prague", "Geneva"],
  ["Prague", "Dubai"],
  ["Dubai", "Singapore"],
  ["Singapore", "Tokyo"],
  ["Prague", "Tokyo"],
  ["Geneva", "New York"],
];

// Routes that touch a given hub, expressed as the *other* endpoint.
function routesFor(name: string): string[] {
  return ROUTES.filter(([a, b]) => a === name || b === name).map(([a, b]) =>
    a === name ? b : a
  );
}

// Convert a lat/lon back into the mono N../E.. vocabulary used elsewhere.
function coordLabel(lat: number, lon: number) {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lon >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(2)}°${ns} · ${Math.abs(lon).toFixed(2)}°${ew}`;
}

type ViewBox = { x: number; y: number; w: number; h: number };
const WORLD_VB: ViewBox = { x: 0, y: Y_TOP, w: VB_W, h: VB_CROP_H };
// On phones we crop the empty Pacific margins so the same screen width buys
// a ~23% bigger map. All six hubs stay comfortably inside with label room.
const MOBILE_VB: ViewBox = { x: 130, y: Y_TOP, w: 810, h: VB_CROP_H };

const EASE = (t: number) => {
  // cubic-bezier(0.16, 1, 0.3, 1) approximated as an easeOutExpo-ish curve.
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

/* ---------------- precomputed geometry (module scope, zero per-frame ----
 * allocations): sampled arc polylines, per-dot twinkle parameters and
 * distance-from-HQ for the radar sweep. `rnd` is a deterministic hash so
 * the texture is identical on every mount. ------------------------------ */
const TAU = Math.PI * 2;
const rnd = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const ARC_SAMPLES = 48;
const ROUTE_PTS: Float32Array[] = ROUTES.map(([a, b]) => {
  const pa = byName(a);
  const pb = byName(b);
  const dist = Math.hypot(pb.x - pa.x, pb.y - pa.y);
  const lift = Math.min(90, dist * 0.28);
  const cx = (pa.x + pb.x) / 2;
  const cy = (pa.y + pb.y) / 2 - lift;
  const pts = new Float32Array(ARC_SAMPLES * 2);
  for (let j = 0; j < ARC_SAMPLES; j++) {
    const t = j / (ARC_SAMPLES - 1);
    const mt = 1 - t;
    pts[j * 2] = mt * mt * pa.x + 2 * mt * t * cx + t * t * pb.x;
    pts[j * 2 + 1] = mt * mt * pa.y + 2 * mt * t * cy + t * t * pb.y;
  }
  return pts;
});
// Staggered pulse timing so the network reads as live traffic, not a loop.
const PULSE_DUR = ROUTES.map((_, i) => 3.8 + (i % 3) * 1.1 + i * 0.35);
const PULSE_OFF = ROUTES.map((_, i) => rnd(i * 13 + 3));
const HUB_PH = cityPts.map((_, i) => rnd(i * 29 + 11));

const DOT_N = WORLD_DOTS.length;
const DOT_X = new Float32Array(DOT_N);
const DOT_Y = new Float32Array(DOT_N);
const DOT_HQ = new Float32Array(DOT_N); // distance from Prague (radar sweep)
const DOT_TW_AMP = new Float32Array(DOT_N); // twinkle amplitude near hubs
const DOT_TW_SPD = new Float32Array(DOT_N);
const DOT_TW_PH = new Float32Array(DOT_N);
{
  const hq = byName(HQ);
  const NEAR = 55; // world units within which continents twinkle around a hub
  for (let i = 0; i < DOT_N; i++) {
    const x = WORLD_DOTS[i][0] * VB_W;
    const y = WORLD_DOTS[i][1] * VB_H;
    DOT_X[i] = x;
    DOT_Y[i] = y;
    DOT_HQ[i] = Math.hypot(x - hq.x, y - hq.y);
    let best = Infinity;
    for (let c = 0; c < cityPts.length; c++) {
      const d = Math.hypot(x - cityPts[c].x, y - cityPts[c].y);
      if (d < best) best = d;
    }
    if (best < NEAR) {
      DOT_TW_AMP[i] = (1 - best / NEAR) * 0.3;
      DOT_TW_SPD[i] = 1.2 + rnd(i) * 1.8;
      DOT_TW_PH[i] = rnd(i + 7) * TAU;
    }
  }
}

// Radar sweep from Prague: an expanding wavefront every SWEEP_PERIOD seconds
// that briefly lifts the dots it passes over.
const SWEEP_PERIOD = 8;
const SWEEP_DUR = 4.5;
const SWEEP_MAX = 340; // world units — reaches Tokyo/Singapore before fading
const SWEEP_BAND = 24;

// Canvas ink — canvas can't read CSS variables per frame, so we mirror the
// live site accent into a mutable object and refresh it when the footer
// switcher changes (see refreshInk / onAccent wiring in the render effect).
const DOT_BASE_A = 0.45;
const ink = {
  accent: "#4f8cff",
  accent2: "#6b9dff",
  dot: "rgb(120, 150, 220)",
  dot0: "rgba(120, 150, 220, 0)",
  grid: "rgba(107, 157, 255, 0.05)",
  rgb: { r: 79, g: 140, b: 255 },
};
function refreshInk() {
  const a = accentRGB();
  ink.rgb = a;
  ink.accent = `rgb(${a.r},${a.g},${a.b})`;
  // lighter hover tint — lifted toward white
  const l = {
    r: Math.round(a.r * 0.55 + 255 * 0.45),
    g: Math.round(a.g * 0.55 + 255 * 0.45),
    b: Math.round(a.b * 0.55 + 255 * 0.45),
  };
  ink.accent2 = `rgb(${l.r},${l.g},${l.b})`;
  // land dots: a desaturated, dimmer shade of the accent
  const d = {
    r: Math.round(a.r * 0.6 + 150 * 0.4),
    g: Math.round(a.g * 0.6 + 160 * 0.4),
    b: Math.round(a.b * 0.6 + 200 * 0.4),
  };
  ink.dot = `rgb(${d.r},${d.g},${d.b})`;
  ink.dot0 = `rgba(${d.r},${d.g},${d.b},0)`;
  ink.grid = `rgba(${a.r},${a.g},${a.b},0.05)`;
}

// Tiny offscreen sprites (a soft dot, a radial hub glow) so the per-frame
// hot loop is pure drawImage — far cheaper than 3.9k arc/fill pairs.
function makeDotSprite() {
  const s = document.createElement("canvas");
  s.width = s.height = 16;
  const g = s.getContext("2d")!;
  const grad = g.createRadialGradient(8, 8, 0, 8, 8, 8);
  grad.addColorStop(0, ink.dot);
  grad.addColorStop(0.7, ink.dot);
  grad.addColorStop(1, ink.dot0);
  g.fillStyle = grad;
  g.fillRect(0, 0, 16, 16);
  return s;
}
function makeGlowSprite() {
  const s = document.createElement("canvas");
  s.width = s.height = 64;
  const g = s.getContext("2d")!;
  const { r, g: gg, b } = ink.rgb;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, `rgba(${r}, ${gg}, ${b}, 0.4)`);
  grad.addColorStop(0.4, `rgba(${r}, ${gg}, ${b}, 0.13)`);
  grad.addColorStop(1, `rgba(${r}, ${gg}, ${b}, 0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return s;
}

export type FocusInfo = {
  name: string;
  meta: string;
  coord: string;
  routes: string[];
} | null;

export function WorldMap({ onFocus }: { onFocus?: (info: FocusInfo) => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState<string | null>(null); // hover preview
  const [selected, setSelected] = useState<string | null>(null); // click focus
  const [vw, setVw] = useState(VB_W);
  const [vh, setVh] = useState(VB_CROP_H);
  const lite = useLite();

  const isMobile = vw < 768;
  const worldVbRef = useRef<ViewBox>(WORLD_VB);

  // The viewBox is animated imperatively (rAF tween) so the SVG can zoom toward
  // a hub without re-rendering on every frame. The canvas render loop reads the
  // same vbRef each frame, so both layers zoom in lockstep.
  const vbRef = useRef<ViewBox>({ ...WORLD_VB });
  const rafRef = useRef<number | null>(null);

  /* ------- refs shared with the render loop (never re-subscribes) ------- */
  const sizeRef = useRef({ w: 0, h: 0 });
  const hotRef = useRef<string | null>(null); // selected ?? hovered
  const selRef = useRef<string | null>(null);
  const liteRef = useRef(false);
  const reducedRef = useRef(false);
  const loopRef = useRef<number | null>(null); // the ONE canvas rAF loop
  const redrawRef = useRef<() => void>(() => {}); // one static frame on demand
  const routeA = useRef(new Float32Array(ROUTES.length).fill(0.42)); // eased arc alpha
  const hubA = useRef(new Float32Array(cityPts.length).fill(1)); // eased hub dim

  useEffect(() => {
    liteRef.current = lite;
  }, [lite]);

  const applyVb = useCallback((vb: ViewBox) => {
    const svg = svgRef.current;
    if (svg) svg.setAttribute("viewBox", `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
    // Reduced-motion (loop parked): repaint the canvas for the new framing.
    if (loopRef.current == null) redrawRef.current();
  }, []);

  const tweenTo = useCallback(
    (target: ViewBox) => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      // Reduced-motion / lite: snap, no tween.
      if (liteRef.current) {
        vbRef.current = { ...target };
        applyVb(target);
        return;
      }
      const from = { ...vbRef.current };
      const dur = 800;
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        const e = EASE(t);
        const cur: ViewBox = {
          x: from.x + (target.x - from.x) * e,
          y: from.y + (target.y - from.y) * e,
          w: from.w + (target.w - from.w) * e,
          h: from.h + (target.h - from.h) * e,
        };
        vbRef.current = cur;
        applyVb(cur);
        if (t < 1) rafRef.current = requestAnimationFrame(step);
        else rafRef.current = null;
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [applyVb]
  );

  // Focus a hub: recenter/zoom the viewBox on it and report its true data up.
  const focusHub = useCallback(
    (name: string) => {
      const c = byName(name);
      const w = VB_W * 0.42;
      const h = VB_CROP_H * 0.42;
      tweenTo({
        x: c.x - w / 2,
        y: c.y - h / 2,
        w,
        h,
      });
      setSelected(name);
      onFocus?.({
        name,
        meta: META[name] ?? "",
        coord: coordLabel(c.lat, c.lon),
        routes: routesFor(name),
      });
    },
    [onFocus, tweenTo]
  );

  const clearFocus = useCallback(() => {
    tweenTo({ ...worldVbRef.current });
    setSelected(null);
    onFocus?.(null);
  }, [onFocus, tweenTo]);

  // Keep the resting frame in sync with the breakpoint (mobile crops oceans).
  useEffect(() => {
    worldVbRef.current = isMobile ? MOBILE_VB : WORLD_VB;
    if (!selRef.current) tweenTo({ ...worldVbRef.current });
  }, [isMobile, tweenTo]);

  // Esc returns to the world view.
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") clearFocus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, clearFocus]);

  // Mirror interaction state into the render loop; repaint if it's parked.
  useEffect(() => {
    hotRef.current = selected ?? active;
    selRef.current = selected;
    if (loopRef.current == null) redrawRef.current();
  }, [selected, active]);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* ------------------- the living canvas (one rAF loop) ------------------ *
   * Layers, back to front: graticule → dot-matrix continents (twinkle near
   * hubs, brightened by the radar wavefront) → sweep ring → route arcs →
   * traveling comet pulses → breathing hub glows. The loop pauses when the
   * section leaves the viewport or the tab hides, and never runs at all
   * under prefers-reduced-motion (static frames are drawn on demand).
   * ---------------------------------------------------------------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    refreshInk();
    let dotSprite = makeDotSprite();
    let glowSprite = makeGlowSprite();
    // repaint the accent into the sprites + a fresh frame when the footer
    // switcher changes the site colour
    const unsubAccent = onAccent(() => {
      refreshInk();
      dotSprite = makeDotSprite();
      glowSprite = makeGlowSprite();
      if (loopRef.current == null) redrawRef.current();
    });
    const hq = byName(HQ);

    let visible = false;

    const draw = (tSec: number, dt: number) => {
      const { w, h } = sizeRef.current;
      if (!w || !h) return;
      const vb = vbRef.current;
      const sx = w / vb.w;
      const sy = h / vb.h;
      const ox = -vb.x * sx;
      const oy = -vb.y * sy;
      const reduced = reducedRef.current;
      const liteNow = liteRef.current;
      const hot = hotRef.current;
      const sel = selRef.current;

      ctx.clearRect(0, 0, w, h);

      // --- graticule: whisper-quiet engineering grid ---
      ctx.strokeStyle = ink.grid;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      for (let lat = -40; lat <= 80; lat += 20) {
        const y = ((90 - lat) / 180) * VB_H * sy + oy;
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      for (let lon = -150; lon <= 180; lon += 30) {
        const x = ((lon + 180) / 360) * VB_W * sx + ox;
        ctx.moveTo(x, Y_TOP * sy + oy);
        ctx.lineTo(x, Y_BOT * sy + oy);
      }
      ctx.stroke();

      // --- ease focus dimming (snap under reduced motion) ---
      const k = reduced ? 1 : Math.min(1, dt * 7);
      const ra = routeA.current;
      for (let i = 0; i < ROUTES.length; i++) {
        const touches = hot != null && (ROUTES[i][0] === hot || ROUTES[i][1] === hot);
        // rest 0.32 · highlighted 0.9 · dimmed harder when click-focused
        const target = hot == null ? 0.32 : touches ? 0.9 : sel ? 0.1 : 0.18;
        ra[i] += (target - ra[i]) * k;
      }
      const ha = hubA.current;
      for (let i = 0; i < cityPts.length; i++) {
        const target = hot == null || cityPts[i].name === hot ? 1 : sel ? 0.3 : 0.55;
        ha[i] += (target - ha[i]) * k;
      }

      // --- radar sweep state (Prague wavefront every ~8s) ---
      let sweepR = -1;
      let sweepFade = 0;
      if (!reduced && !liteNow) {
        const st = tSec % SWEEP_PERIOD;
        if (st < SWEEP_DUR) {
          const e = st / SWEEP_DUR;
          sweepR = e * SWEEP_MAX;
          sweepFade = (1 - e) * (1 - e);
        }
      }

      // --- dot-matrix continents ---
      const r = Math.max(0.8, sx * 1.25);
      const d2 = r * 2;
      ctx.globalAlpha = DOT_BASE_A;
      for (let i = 0; i < DOT_N; i++) {
        const px = DOT_X[i] * sx + ox;
        if (px < -4 || px > w + 4) continue;
        const py = DOT_Y[i] * sy + oy;
        if (py < -4 || py > h + 4) continue;
        let a = DOT_BASE_A;
        const amp = DOT_TW_AMP[i];
        if (amp > 0 && !reduced && !liteNow)
          a += amp * Math.sin(tSec * DOT_TW_SPD[i] + DOT_TW_PH[i]);
        if (sweepR >= 0) {
          const dd = sweepR - DOT_HQ[i];
          if (dd >= 0 && dd < SWEEP_BAND) a += (1 - dd / SWEEP_BAND) * 0.5 * sweepFade;
        }
        if (a !== DOT_BASE_A) {
          ctx.globalAlpha = a < 0.1 ? 0.1 : a > 1 ? 1 : a;
          ctx.drawImage(dotSprite, px - r, py - r, d2, d2);
          ctx.globalAlpha = DOT_BASE_A;
        } else {
          ctx.drawImage(dotSprite, px - r, py - r, d2, d2);
        }
      }

      // --- sweep wavefront ring (an ellipse: the view scale is anisotropic) ---
      if (sweepR > 0) {
        ctx.strokeStyle = ink.accent2;
        ctx.globalAlpha = 0.1 * sweepFade;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(hq.x * sx + ox, hq.y * sy + oy, sweepR * sx, sweepR * sy, 0, 0, TAU);
        ctx.stroke();
      }

      // --- route arcs + traveling comet pulses ---
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      const pw = Math.max(0.8, Math.min(1.6, sx)); // pulse size, gently zoom-aware
      for (let i = 0; i < ROUTES.length; i++) {
        const pts = ROUTE_PTS[i];
        const a = ra[i];
        ctx.strokeStyle = ink.accent;
        ctx.globalAlpha = a;
        ctx.lineWidth = 0.6 + a * 0.9;
        ctx.beginPath();
        ctx.moveTo(pts[0] * sx + ox, pts[1] * sy + oy);
        for (let j = 1; j < ARC_SAMPLES; j++)
          ctx.lineTo(pts[j * 2] * sx + ox, pts[j * 2 + 1] * sy + oy);
        ctx.stroke();

        if (reduced) continue;
        // Comet: a bright head with a fading tail, easing in/out at the ends.
        const touches = hot != null && (ROUTES[i][0] === hot || ROUTES[i][1] === hot);
        const dur = PULSE_DUR[i] * (touches ? 0.6 : 1); // focused routes run hot
        const p = (tSec / dur + PULSE_OFF[i]) % 1;
        const endFade = Math.min(1, p * 6, (1 - p) * 6);
        const headA = Math.min(1, a * 2.2) * endFade;
        if (headA < 0.04) continue;
        const fi = p * (ARC_SAMPLES - 1);
        const i0 = Math.floor(fi);
        const fr = fi - i0;
        const i1 = Math.min(ARC_SAMPLES - 1, i0 + 1);
        const hx = (pts[i0 * 2] + (pts[i1 * 2] - pts[i0 * 2]) * fr) * sx + ox;
        const hy = (pts[i0 * 2 + 1] + (pts[i1 * 2 + 1] - pts[i0 * 2 + 1]) * fr) * sy + oy;
        // tail: segments behind the head with quadratic falloff
        const TAIL = 12;
        ctx.strokeStyle = ink.accent2;
        for (let t = 0; t < TAIL; t++) {
          const j1 = i0 - t;
          const j0 = j1 - 1;
          if (j0 < 0) break;
          const f = 1 - t / TAIL;
          ctx.globalAlpha = headA * 0.5 * f * f;
          ctx.lineWidth = (touches ? 1.8 : 1.3) * pw * (0.4 + 0.6 * f);
          ctx.beginPath();
          ctx.moveTo(pts[j0 * 2] * sx + ox, pts[j0 * 2 + 1] * sy + oy);
          ctx.lineTo(pts[j1 * 2] * sx + ox, pts[j1 * 2 + 1] * sy + oy);
          ctx.stroke();
        }
        // head: soft halo + hot core
        const hr = (touches ? 2.4 : 1.9) * pw;
        ctx.fillStyle = ink.accent;
        ctx.globalAlpha = headA * 0.25;
        ctx.beginPath();
        ctx.arc(hx, hy, hr * 2.4, 0, TAU);
        ctx.fill();
        ctx.fillStyle = ink.accent2;
        ctx.globalAlpha = headA;
        ctx.beginPath();
        ctx.arc(hx, hy, hr, 0, TAU);
        ctx.fill();
      }

      // --- breathing hubs: ambient glow + an expanding, fading ring ---
      for (let i = 0; i < cityPts.length; i++) {
        const c = cityPts[i];
        const isHq = c.name === HQ;
        const px = c.x * sx + ox;
        const py = c.y * sy + oy;
        const m = ha[i];
        const gw = (isHq ? 46 : 30) * sx;
        const gh = (isHq ? 46 : 30) * sy;
        ctx.globalAlpha = (isHq ? 0.55 : 0.34) * m;
        ctx.drawImage(glowSprite, px - gw / 2, py - gh / 2, gw, gh);
        if (reduced) continue;
        const period = isHq ? 3.2 : 4.0; // HQ breathes stronger and faster
        const ph = (tSec / period + HUB_PH[i]) % 1;
        const rr = 3 + ph * (isHq ? 24 : 16);
        ctx.strokeStyle = ink.accent2;
        ctx.globalAlpha = Math.pow(1 - ph, 1.8) * (isHq ? 0.5 : 0.3) * m;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(px, py, rr * sx, rr * sy, 0, 0, TAU);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    /* ----- loop lifecycle: run only while visible, tab shown, motion ok ----- */
    let lastNow = 0;
    const loop = (now: number) => {
      loopRef.current = requestAnimationFrame(loop);
      const dt = Math.min(0.1, (now - lastNow) / 1000);
      lastNow = now;
      draw(now / 1000, dt);
    };
    const start = () => {
      if (loopRef.current != null) return;
      lastNow = performance.now();
      loopRef.current = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (loopRef.current != null) cancelAnimationFrame(loopRef.current);
      loopRef.current = null;
    };
    const syncPlay = () => {
      if (visible && !document.hidden && !reducedRef.current) start();
      else {
        stop();
        // parked but on screen (reduced motion): show a correct still frame
        if (visible) draw(0, 1);
      }
    };
    redrawRef.current = () => draw(0, 1);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedRef.current = mq.matches;
    const onMq = () => {
      reducedRef.current = mq.matches;
      syncPlay();
    };
    mq.addEventListener("change", onMq);

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        syncPlay();
      },
      { threshold: 0.01 }
    );
    io.observe(wrap);

    const onVis = () => syncPlay();
    document.addEventListener("visibilitychange", onVis);

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = rect.width;
      const h = rect.height;
      setVw(w);
      setVh(h);
      sizeRef.current = { w, h };
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(performance.now() / 1000, 1); // no blank frame while parked
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      mq.removeEventListener("change", onMq);
      document.removeEventListener("visibilitychange", onVis);
      unsubAccent();
      redrawRef.current = () => {};
    };
  }, []);

  /* ----------------------------- SVG overlay ----------------------------- *
   * Because the SVG uses preserveAspectRatio="none", label font sizes (in
   * viewBox units) shrink with the rendered size. Desktop keeps the original
   * width-driven scaling; on mobile the name size is derived from the
   * rendered HEIGHT so labels land at a legible ~11.5px regardless of the
   * ocean crop, and the mono sub-labels are dropped entirely.
   * ----------------------------------------------------------------------- */
  const scale = Math.max(1, VB_W / Math.max(1, vw));
  const nameFont = isMobile
    ? 11.5 * (VB_CROP_H / Math.max(1, vh))
    : Math.min(26, 12.5 * scale);
  const subFont = Math.min(11, 5.6 * scale);
  // Hub hit area sized so the tap target is at least ~24px on screen.
  const hScale = vw / worldVbRef.current.w;
  const vScale = vh / VB_CROP_H;
  const hitR = Math.max(16, 13 / Math.max(0.05, Math.min(hScale, vScale)));

  const hot = selected ?? active;

  return (
    <div
      ref={wrapRef}
      className="relative w-full min-h-[280px] sm:min-h-0"
      // Mobile trades the cinematic letterbox for a taller, bigger map.
      style={{ aspectRatio: isMobile ? "810 / 620" : `${VB_W} / ${VB_CROP_H}` }}
      data-cursor="drag"
    >
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />

      {/* gentle vignette so the sea dissolves at the stage edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(115% 100% at 50% 45%, transparent 55%, rgba(5,5,5,0.6) 100%)",
        }}
      />

      <svg
        ref={svgRef}
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox={`0 ${Y_TOP} ${VB_W} ${VB_CROP_H}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Map of the time zones ARDLABS works across"
      >
        {/* sea: clicking empty water returns to the world view */}
        <rect
          x={0}
          y={Y_TOP}
          width={VB_W}
          height={VB_CROP_H}
          fill="transparent"
          onClick={() => selected && clearFocus()}
          style={{ cursor: selected ? "zoom-out" : "default" }}
        />

        {/* city pins — dots/arcs/glows live on the canvas; the SVG carries
            hit areas and labels so text stays crisp while zooming. */}
        {cityPts.map((c, i) => {
          const lab =
            (isMobile ? LABEL_M[c.name] : LABEL[c.name]) ??
            ({ dx: 9, dy: -7, anchor: "start" } as const);
          const meta = META[c.name] ?? "";
          const isHq = c.name === HQ;
          const on = hot === c.name;
          const isSelected = selected === c.name;
          // focus mode: everything but the focused hub steps back
          const dimmed = hot != null && !on;
          // short leader line from the dot toward the label
          const lx = lab.anchor === "end" ? lab.dx + 2 : lab.dx - 2;
          // mobile: a dark plate behind the name keeps it legible over land
          const plateW = c.name.length * nameFont * 0.62 + nameFont * 0.9;
          const plateH = nameFont * 1.35;
          const plateX =
            lab.anchor === "start"
              ? lab.dx - nameFont * 0.45
              : lab.dx - plateW + nameFont * 0.45;
          const plateY = lab.dy - nameFont * 1.02;
          return (
            <g
              key={c.name}
              transform={`translate(${c.x} ${c.y})`}
              role="button"
              tabIndex={0}
              aria-label={`${c.name} — ${meta}`}
              aria-pressed={isSelected}
              onMouseEnter={() => {
                setActive(c.name);
                audio.hover();
              }}
              onMouseLeave={() => setActive(null)}
              onClick={(e) => {
                e.stopPropagation();
                audio.click();
                if (isSelected) clearFocus();
                else focusHub(c.name);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  audio.click();
                  if (isSelected) clearFocus();
                  else focusHub(c.name);
                }
              }}
              style={{
                cursor: "pointer",
                opacity: dimmed ? (selected ? 0.35 : 0.65) : 1,
                transition: "opacity 0.45s ease",
                animation: lite
                  ? undefined
                  : `markerIn 0.6s ease ${0.25 + i * 0.12}s both`,
              }}
            >
              {/* generous invisible hit area (≥24px tap target on phones) */}
              <circle r={hitR} fill="transparent" />
              {/* leader line */}
              <line
                x1={0}
                y1={0}
                x2={lx}
                y2={lab.dy + 1}
                stroke="var(--color-accent-2)"
                strokeWidth={0.6}
                strokeOpacity={on ? 0.7 : 0.3}
                vectorEffect="non-scaling-stroke"
              />
              {/* dot: ring + core. HQ (Prague) is visually primary: a larger
                  ring and the only hub with a filled azure core at rest.
                  (The breathing glow ring is painted on the canvas below.) */}
              <circle
                r={isHq ? (on ? 5.2 : 4.4) : on ? 4 : 3.2}
                fill="none"
                stroke="var(--color-accent-2)"
                strokeWidth={isHq ? 1.1 : 0.8}
                strokeOpacity={isHq ? 0.85 : 0.6}
                vectorEffect="non-scaling-stroke"
              />
              <circle
                r={isHq ? 2.2 : 1.7}
                fill={
                  isHq
                    ? "var(--color-accent)"
                    : on
                      ? "#ffffff"
                      : "var(--color-accent-2)"
                }
              />
              {/* label: name (display) + sub (mono, desktop only) */}
              {isMobile && (
                <rect
                  x={plateX}
                  y={plateY}
                  width={plateW}
                  height={plateH}
                  rx={nameFont * 0.22}
                  fill="rgba(5, 5, 5, 0.72)"
                />
              )}
              <text
                x={lab.dx}
                y={lab.dy}
                textAnchor={lab.anchor}
                className="font-display"
                style={{
                  fontSize: nameFont,
                  fontWeight: 600,
                  letterSpacing: -0.2,
                  fill: on ? "#ffffff" : "#e8e8ec",
                  paintOrder: "stroke",
                  stroke: "#050505",
                  strokeWidth: 2.6,
                  strokeLinejoin: "round",
                }}
              >
                {c.name}
              </text>
              {!isMobile && (
                <text
                  x={lab.dx}
                  y={lab.dy + nameFont * 0.68}
                  textAnchor={lab.anchor}
                  className="font-mono"
                  style={{
                    fontSize: subFont,
                    letterSpacing: 1.4,
                    fill: on ? "var(--color-accent-2)" : "#8a8a93",
                    paintOrder: "stroke",
                    stroke: "#050505",
                    strokeWidth: 1.8,
                    strokeLinejoin: "round",
                  }}
                >
                  {meta}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
