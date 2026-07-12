"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useContent } from "@/lib/content";
import { useLang } from "@/lib/lang";
import { LOCATIONS } from "@/lib/site";
import { MAP_W, MAP_H, PX_PER_KM, projectMap, COUNTRIES, BORDERS_D } from "@/lib/mapGeo";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

/* ---- Plans d'eau (tracés lon/lat, projetés à l'affichage) ---------------- */
const LAKES: { id: string; pts: [number, number][] }[] = [
  {
    id: "leman",
    pts: [
      [6.148, 46.206], [6.24, 46.25], [6.33, 46.30], [6.48, 46.35], [6.60, 46.395],
      [6.72, 46.40], [6.85, 46.39], [6.93, 46.395], [6.92, 46.44], [6.80, 46.452],
      [6.66, 46.50], [6.50, 46.505], [6.35, 46.46], [6.25, 46.36], [6.17, 46.27],
    ],
  },
  {
    id: "neuchatel",
    pts: [
      [6.63, 46.78], [6.73, 46.83], [6.90, 46.92], [7.03, 46.99], [6.96, 47.03],
      [6.80, 46.95], [6.65, 46.86], [6.56, 46.80],
    ],
  },
  {
    id: "annecy",
    pts: [[6.12, 45.87], [6.18, 45.83], [6.21, 45.79], [6.16, 45.80], [6.11, 45.85]],
  },
  {
    id: "bourget",
    pts: [[5.85, 45.64], [5.88, 45.72], [5.87, 45.80], [5.83, 45.76], [5.83, 45.67]],
  },
  {
    id: "maggiore",
    pts: [
      [8.49, 45.90], [8.55, 45.78], [8.62, 45.77], [8.60, 45.92], [8.70, 46.07],
      [8.63, 46.12], [8.53, 45.99],
    ],
  },
  {
    id: "como",
    pts: [
      [9.05, 45.81], [9.11, 45.85], [9.20, 46.02], [9.30, 46.16], [9.25, 46.17],
      [9.13, 46.00], [9.03, 45.84],
    ],
  },
  {
    id: "zurichsee",
    pts: [[8.53, 47.37], [8.66, 47.28], [8.80, 47.22], [8.76, 47.19], [8.60, 47.26], [8.52, 47.33]],
  },
];

/* ---- Relief alpin (chevrons discrets) ------------------------------------ */
const PEAKS: [number, number][] = [
  [6.87, 45.83], [7.30, 45.94], [7.66, 45.98], [7.87, 45.94], [7.96, 46.54],
  [8.56, 46.56], [9.25, 46.45], [9.91, 46.38], [6.80, 45.40], [6.36, 44.92],
  [7.25, 45.45], [8.10, 46.10], [9.60, 46.55], [10.20, 46.85], [6.10, 45.15],
];

/* ---- Habillage localisé --------------------------------------------------- */
const T = {
  fr: {
    countries: { FR: "FRANCE", CH: "SUISSE", IT: "ITALIE", DE: "ALLEMAGNE", AT: "AUTRICHE" },
    leman: "Lac Léman",
    scale: "50 km",
    register: "46.2044° N · 6.1432° E — Genève",
  },
  en: {
    countries: { FR: "FRANCE", CH: "SWITZERLAND", IT: "ITALY", DE: "GERMANY", AT: "AUSTRIA" },
    leman: "Lake Geneva",
    scale: "50 km",
    register: "46.2044° N · 6.1432° E — Geneva",
  },
} as const;

/* positions des libellés pays (lon/lat) */
const COUNTRY_LABELS: { id: keyof (typeof T)["fr"]["countries"]; lon: number; lat: number }[] = [
  { id: "FR", lon: 5.15, lat: 45.35 },
  { id: "CH", lon: 7.68, lat: 46.86 },
  { id: "IT", lon: 9.55, lat: 45.12 },
  { id: "DE", lon: 9.35, lat: 48.12 },
  { id: "AT", lon: 10.32, lat: 47.32 },
];

/* décalage des libellés de villes pour éviter les collisions */
const LABEL_OFFSET: Record<string, { dx: number; dy: number; anchor?: "start" | "end" | "middle" }> = {
  geneva: { dx: -14, dy: 5, anchor: "end" },
  lausanne: { dx: 0, dy: -14, anchor: "middle" },
  montreux: { dx: 13, dy: 4, anchor: "start" },
  verbier: { dx: 12, dy: 12, anchor: "start" },
  zurich: { dx: 0, dy: -14, anchor: "middle" },
  courchevel: { dx: 0, dy: 20, anchor: "middle" },
  lyon: { dx: -14, dy: 4, anchor: "end" },
  milan: { dx: 14, dy: 5, anchor: "start" },
};

const toPath = (pts: [number, number][]) =>
  "M" +
  pts
    .map(([lon, lat]) => {
      const { x, y } = projectMap(lon, lat);
      return `${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join("L") +
  "Z";

/**
 * Genève & Europe — la vraie carte de la maison : frontières réelles
 * (Natural Earth 10 m), lacs alpins, relief suggéré, et les liaisons
 * BLACKFIRST qui rayonnent depuis Genève en lumière blanche.
 */
export function RouteMap() {
  const r = useContent().routes;
  const locNames = useContent().locations.items;
  const lang = useLang();
  const t = T[lang];
  const reduced = useSafeReducedMotion();

  const { nodes, hub, lakePaths, peakPts, labels } = useMemo(() => {
    const nameOf = (id: string) => locNames.find((l) => l.id === id)?.name;
    const nodes = LOCATIONS.map((l) => ({
      ...l,
      ...projectMap(l.lon, l.lat),
      label: nameOf(l.id) ?? l.name,
    }));
    const hub = nodes.find((n) => n.hub) ?? nodes[0];
    const lakePaths = LAKES.map((l) => ({ id: l.id, d: toPath(l.pts) }));
    const peakPts = PEAKS.map(([lon, lat]) => projectMap(lon, lat));
    const labels = COUNTRY_LABELS.map((c) => ({ ...c, ...projectMap(c.lon, c.lat) }));
    return { nodes, hub, lakePaths, peakPts, labels };
    // locNames est stable par langue
  }, [locNames]);

  const lemanLabel = projectMap(6.55, 46.47);
  const scalePx = PX_PER_KM * 50;

  return (
    <Section id="routes">
      <SectionHeading index="04" eyebrow={r.eyebrow} title={r.title} intro={r.intro} />

      <div className="container-x mt-12 md:mt-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl hairline bg-[#07080b] p-1.5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
            <svg
              viewBox={`0 0 ${MAP_W} ${MAP_H}`}
              className="w-full rounded-[1.25rem]"
              role="img"
              aria-label={r.hint}
            >
              <defs>
                <radialGradient id="map-night" cx="38%" cy="30%" r="90%">
                  <stop offset="0%" stopColor="#11131a" />
                  <stop offset="60%" stopColor="#0a0b10" />
                  <stop offset="100%" stopColor="#06070a" />
                </radialGradient>
                <linearGradient id="map-water" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#12222f" />
                  <stop offset="100%" stopColor="#0b1722" />
                </linearGradient>
                <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.30)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </radialGradient>
                <filter id="route-glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="2.2" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* fond nuit */}
              <rect width={MAP_W} height={MAP_H} fill="url(#map-night)" />

              {/* terres — la Suisse, pays hôte, légèrement éclairée */}
              {COUNTRIES.map((c) => (
                <path
                  key={c.id}
                  d={c.d}
                  fill={c.id === "CH" ? "#14161d" : "#0e1015"}
                  stroke="none"
                />
              ))}

              {/* relief alpin suggéré */}
              <g stroke="rgba(199,203,209,0.14)" strokeWidth="1.4" fill="none" strokeLinecap="round">
                {peakPts.map((p, i) => (
                  <path key={i} d={`M${p.x - 7} ${p.y + 4} L${p.x} ${p.y - 5} L${p.x + 7} ${p.y + 4}`} />
                ))}
              </g>

              {/* frontières réelles */}
              <path
                d={BORDERS_D}
                fill="none"
                stroke="rgba(199,203,209,0.28)"
                strokeWidth="1"
                strokeDasharray="5 4"
                strokeLinejoin="round"
              />

              {/* lacs */}
              {lakePaths.map((l) => (
                <path
                  key={l.id}
                  d={l.d}
                  fill="url(#map-water)"
                  stroke="rgba(120,168,205,0.35)"
                  strokeWidth="1"
                />
              ))}
              <text
                x={lemanLabel.x}
                y={lemanLabel.y}
                textAnchor="middle"
                fontSize="13"
                fontStyle="italic"
                fill="rgba(140,180,210,0.55)"
              >
                {t.leman}
              </text>

              {/* libellés pays */}
              {labels.map((l) => (
                <text
                  key={l.id}
                  x={l.x}
                  y={l.y}
                  textAnchor="middle"
                  fontSize={l.id === "CH" ? 20 : 16}
                  letterSpacing="7"
                  fill={l.id === "CH" ? "rgba(246,243,236,0.28)" : "rgba(246,243,236,0.15)"}
                >
                  {t.countries[l.id]}
                </text>
              ))}

              {/* halo autour de la base */}
              <circle cx={hub.x} cy={hub.y} r="70" fill="url(#hub-glow)" />

              {/* liaisons depuis Genève */}
              {nodes
                .filter((n) => !n.hub)
                .map((n, i) => {
                  const mx = (hub.x + n.x) / 2;
                  const my = Math.min(hub.y, n.y) - Math.max(26, Math.abs(hub.x - n.x) * 0.16);
                  const d = `M ${hub.x} ${hub.y} Q ${mx} ${my} ${n.x} ${n.y}`;
                  return (
                    <g key={n.id}>
                      <path d={d} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
                      {!reduced && (
                        <motion.path
                          d={d}
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeDasharray="12 260"
                          filter="url(#route-glow)"
                          initial={{ strokeDashoffset: 272 }}
                          whileInView={{ strokeDashoffset: 0 }}
                          viewport={{ once: false }}
                          transition={{ duration: 3.4, repeat: Infinity, ease: "linear", delay: i * 0.45 }}
                        />
                      )}
                    </g>
                  );
                })}

              {/* villes */}
              {nodes.map((n) => {
                const off = LABEL_OFFSET[n.id] ?? { dx: 0, dy: -12, anchor: "middle" as const };
                return (
                  <g key={n.id}>
                    {n.hub && (
                      <circle cx={n.x} cy={n.y} r="14" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2">
                        {!reduced && (
                          <animate attributeName="r" values="9;20;9" dur="3.2s" repeatCount="indefinite" />
                        )}
                      </circle>
                    )}
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={n.hub ? 5.5 : 3.6}
                      fill={n.hub ? "#ffffff" : "#c7cbd1"}
                      stroke="#07080b"
                      strokeWidth="1.5"
                    />
                    <text
                      x={n.x + off.dx}
                      y={n.y + off.dy}
                      textAnchor={off.anchor ?? "middle"}
                      fontSize={n.hub ? 17 : 13.5}
                      fontWeight={n.hub ? 600 : 400}
                      letterSpacing="1.5"
                      fill={n.hub ? "#f6f3ec" : "rgba(246,243,236,0.75)"}
                    >
                      {n.label.toUpperCase()}
                    </text>
                  </g>
                );
              })}

              {/* échelle */}
              <g transform={`translate(30 ${MAP_H - 34})`} fill="rgba(246,243,236,0.5)">
                <line x1="0" y1="0" x2={scalePx} y2="0" stroke="rgba(246,243,236,0.5)" strokeWidth="1.5" />
                <line x1="0" y1="-5" x2="0" y2="5" stroke="rgba(246,243,236,0.5)" strokeWidth="1.5" />
                <line x1={scalePx} y1="-5" x2={scalePx} y2="5" stroke="rgba(246,243,236,0.5)" strokeWidth="1.5" />
                <text x={scalePx / 2} y="-9" textAnchor="middle" fontSize="12" letterSpacing="2">
                  {t.scale}
                </text>
              </g>

              {/* registre */}
              <text
                x={MAP_W - 30}
                y={MAP_H - 28}
                textAnchor="end"
                fontSize="12"
                letterSpacing="2"
                fill="rgba(246,243,236,0.45)"
              >
                {t.register}
              </text>
            </svg>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-5 text-center font-mono text-[0.62rem] uppercase tracking-[0.3em] text-fog">
            {r.hint}
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
