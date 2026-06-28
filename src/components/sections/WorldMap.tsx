"use client";

import { useEffect, useRef, useState } from "react";
import { CITIES } from "@/lib/site";
import { WORLD_DOTS } from "@/lib/worldDots";

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

export function WorldMap() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState<string | null>(null);

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
      className="relative w-full"
      style={{ aspectRatio: `${VB_W} / ${VB_CROP_H}` }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox={`0 ${Y_TOP} ${VB_W} ${VB_CROP_H}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Map of ARDLABS global hubs"
      >
        {/* routes */}
        <g>
          {ROUTES.map(([a, b], i) => {
            const pa = byName(a);
            const pb = byName(b);
            const d = arcPath(pa, pb);
            const on = active === a || active === b;
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
              </g>
            );
          })}
        </g>

        {/* city pins */}
        {cityPts.map((c, i) => {
          const lab = LABEL[c.name] ?? { dx: 9, dy: -7, anchor: "start" as const };
          const meta = META[c.name] ?? "";
          const on = active === c.name;
          // short leader line from the dot toward the label
          const lx = lab.anchor === "end" ? lab.dx + 2 : lab.dx - 2;
          return (
            <g
              key={c.name}
              transform={`translate(${c.x} ${c.y})`}
              onMouseEnter={() => setActive(c.name)}
              onMouseLeave={() => setActive(null)}
              style={{ cursor: "pointer", animation: `markerIn 0.6s ease ${0.25 + i * 0.12}s both` }}
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
              <circle r={5} fill="var(--color-accent-2)" opacity={0.16}>
                <animate attributeName="r" values="4;9;4" dur="2.6s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                <animate attributeName="opacity" values="0.22;0;0.22" dur="2.6s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
              </circle>
              {/* dot: ring + core */}
              <circle r={on ? 4 : 3.2} fill="none" stroke="var(--color-accent-2)" strokeWidth={0.8} strokeOpacity={0.6} vectorEffect="non-scaling-stroke" />
              <circle r={1.7} fill={on ? "#ffffff" : "var(--color-accent-2)"} />
              {/* label: name (display) + sub (mono) */}
              <text
                x={lab.dx}
                y={lab.dy}
                textAnchor={lab.anchor}
                className="font-display"
                style={{
                  fontSize: 12.5,
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
                y={lab.dy + 8.5}
                textAnchor={lab.anchor}
                className="font-mono"
                style={{
                  fontSize: 5.6,
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
