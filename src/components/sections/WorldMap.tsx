"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CITIES } from "@/lib/site";
import { WORLD_DOTS } from "@/lib/worldDots";
import { audio } from "@/lib/audio";
import { useLite } from "@/hooks/useDeviceTier";

/* ------------------------------------------------------------------ *
 * Equirectangular projection shared by the dot map AND the city pins, *
 * so a city always lands exactly on its geography.                    *
 *   x = (lon + 180) / 360        (0..1)                               *
 *   y = (90 - lat) / 180         (0..1)                               *
 * The map is drawn in a 1000 x 500 space (full globe) and cropped     *
 * vertically to the populated latitude band.                          *
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

// Label placement tuned so nothing overlaps or clips at the edges.
const LABEL: Record<string, { dx: number; dy: number; anchor: "start" | "end" }> = {
  Prague: { dx: 9, dy: -7, anchor: "start" },
  Geneva: { dx: -9, dy: 15, anchor: "end" },
  Singapore: { dx: 9, dy: 14, anchor: "start" },
  Dubai: { dx: 9, dy: -7, anchor: "start" },
  Tokyo: { dx: -9, dy: -7, anchor: "end" },
  "New York": { dx: -9, dy: -7, anchor: "end" },
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

function arcPath(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dist = Math.hypot(b.x - a.x, b.y - a.y);
  const lift = Math.min(90, dist * 0.28);
  return `M ${a.x} ${a.y} Q ${mx} ${my - lift} ${b.x} ${b.y}`;
}

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

const EASE = (t: number) => {
  // cubic-bezier(0.16, 1, 0.3, 1) approximated as an easeOutExpo-ish curve.
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

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
  const lite = useLite();

  // The viewBox is animated imperatively (rAF tween) so the SVG can zoom toward
  // a hub without re-rendering on every frame.
  const vbRef = useRef<ViewBox>({ ...WORLD_VB });
  const rafRef = useRef<number | null>(null);

  const applyVb = useCallback((vb: ViewBox) => {
    const svg = svgRef.current;
    if (svg) svg.setAttribute("viewBox", `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
  }, []);

  const tweenTo = useCallback(
    (target: ViewBox) => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      // Reduced-motion / lite: snap, no tween.
      if (lite) {
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
    [applyVb, lite]
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
    tweenTo({ ...WORLD_VB });
    setSelected(null);
    onFocus?.(null);
  }, [onFocus, tweenTo]);

  // Esc returns to the world view.
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") clearFocus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, clearFocus]);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Because the SVG uses preserveAspectRatio="none", label font sizes (in
  // viewBox units) shrink with the rendered width. On a ~360px phone the map
  // is short and labels would render ~4px. Scale font sizes up as the wrapper
  // gets narrower so hub labels stay legible. Desktop is unaffected.
  const scale = Math.max(1, VB_W / Math.max(1, vw));
  const nameFont = Math.min(26, 12.5 * scale);
  const subFont = Math.min(11, 5.6 * scale);

  // Draw the dot-matrix landmass on a canvas (cheaper than ~3.9k SVG nodes).
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = rect.width;
      const h = rect.height;
      setVw(w);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const r = Math.max(0.8, (w / VB_W) * 1.25);
      ctx.fillStyle = "rgba(120, 150, 220, 0.45)";
      for (let i = 0; i < WORLD_DOTS.length; i++) {
        const dx = WORLD_DOTS[i][0]; // 0..1 of full width
        const dy = WORLD_DOTS[i][1]; // 0..1 of full height
        const px = dx * w;
        const py = ((dy * VB_H - Y_TOP) / VB_CROP_H) * h;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative w-full min-h-[280px] sm:min-h-0"
      style={{ aspectRatio: `${VB_W} / ${VB_CROP_H}` }}
      data-cursor="drag"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <svg
        ref={svgRef}
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox={`0 ${Y_TOP} ${VB_W} ${VB_CROP_H}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Map of ARDLABS global hubs"
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

        {/* routes */}
        <g>
          {ROUTES.map(([a, b], i) => {
            const pa = byName(a);
            const pb = byName(b);
            const d = arcPath(pa, pb);
            const hot = selected ?? active;
            const on = hot === a || hot === b;
            return (
              <g key={i}>
                <path
                  d={d}
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth={on ? 1.4 : 0.7}
                  strokeOpacity={on ? 0.9 : 0.32}
                  style={{ vectorEffect: "non-scaling-stroke" }}
                />
                {!lite && (
                  <circle r={on ? 3 : 2.2} fill="var(--color-accent-2)">
                    <animateMotion
                      dur={`${3.2 + i * 0.4}s`}
                      repeatCount="indefinite"
                      path={d}
                      keyPoints="0;1"
                      keyTimes="0;1"
                      calcMode="linear"
                    />
                  </circle>
                )}
              </g>
            );
          })}
        </g>

        {/* city pins */}
        {cityPts.map((c, i) => {
          const lab = LABEL[c.name] ?? { dx: 9, dy: -7, anchor: "start" as const };
          const meta = META[c.name] ?? "";
          const isHq = c.name === HQ;
          const on = (selected ?? active) === c.name;
          const isSelected = selected === c.name;
          // short leader line from the dot toward the label
          const lx = lab.anchor === "end" ? lab.dx + 2 : lab.dx - 2;
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
                animation: lite
                  ? undefined
                  : `markerIn 0.6s ease ${0.25 + i * 0.12}s both`,
              }}
            >
              {/* generous invisible hit area */}
              <circle r={16} fill="transparent" />
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
              {/* pulse halo */}
              {!lite && (
                <circle r={5} fill="var(--color-accent-2)" opacity={0.16}>
                  <animate attributeName="r" values="4;9;4" dur="2.6s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                  <animate attributeName="opacity" values="0.22;0;0.22" dur="2.6s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                </circle>
              )}
              {/* dot: ring + core. HQ (Prague) is visually primary: a larger
                  ring and the only hub with a filled azure core at rest. */}
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
              {/* label: name (display) + sub (mono) */}
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
            </g>
          );
        })}
      </svg>
    </div>
  );
}
