"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useContent } from "@/lib/content";
import { LOCATIONS } from "@/lib/site";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

const W = 1000;
const H = 620;
const PAD = 90;

/**
 * Geneva & Europe — a living map stub. The served locations are projected onto
 * a simple SVG plane; champagne routes trace out from the Geneva hub. A lighter
 * stand-in for the spec's WebGL/canvas map.
 */
export function RouteMap() {
  const r = useContent().routes;
  const reduced = useSafeReducedMotion();

  const { nodes, hub } = useMemo(() => {
    const lons = LOCATIONS.map((l) => l.lon);
    const lats = LOCATIONS.map((l) => l.lat);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const project = (lon: number, lat: number) => ({
      x: PAD + ((lon - minLon) / (maxLon - minLon)) * (W - PAD * 2),
      y: PAD + ((maxLat - lat) / (maxLat - minLat)) * (H - PAD * 2),
    });
    const nodes = LOCATIONS.map((l) => ({ ...l, ...project(l.lon, l.lat) }));
    const hub = nodes.find((n) => n.hub) ?? nodes[0];
    return { nodes, hub };
  }, []);

  return (
    <Section id="routes">
      <SectionHeading index="04" eyebrow={r.eyebrow} title={r.title} intro={r.intro} />

      <div className="container-x mt-12 md:mt-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl hairline bg-[radial-gradient(120%_120%_at_30%_-10%,#0c0d11,#050505)] p-2">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={r.hint}>
              {/* graticule */}
              <g stroke="rgba(255,255,255,0.04)" strokeWidth="1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <line key={`v${i}`} x1={(W / 7) * (i + 1)} y1="0" x2={(W / 7) * (i + 1)} y2={H} />
                ))}
                {Array.from({ length: 5 }).map((_, i) => (
                  <line key={`h${i}`} x1="0" y1={(H / 5) * (i + 1)} x2={W} y2={(H / 5) * (i + 1)} />
                ))}
              </g>

              {/* routes from hub */}
              {nodes
                .filter((n) => !n.hub)
                .map((n, i) => {
                  const mx = (hub.x + n.x) / 2;
                  const my = Math.min(hub.y, n.y) - 60;
                  const d = `M ${hub.x} ${hub.y} Q ${mx} ${my} ${n.x} ${n.y}`;
                  return (
                    <g key={n.id}>
                      <path d={d} fill="none" stroke="rgba(198,161,91,0.18)" strokeWidth="1.5" />
                      {!reduced && (
                        <motion.path
                          d={d}
                          fill="none"
                          stroke="var(--color-accent)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeDasharray="6 220"
                          initial={{ strokeDashoffset: 226 }}
                          whileInView={{ strokeDashoffset: 0 }}
                          viewport={{ once: false }}
                          transition={{ duration: 3.2, repeat: Infinity, ease: "linear", delay: i * 0.4 }}
                        />
                      )}
                    </g>
                  );
                })}

              {/* nodes */}
              {nodes.map((n) => (
                <g key={n.id}>
                  {n.hub && (
                    <circle cx={n.x} cy={n.y} r="16" fill="none" stroke="rgba(198,161,91,0.4)" strokeWidth="1">
                      {!reduced && (
                        <animate attributeName="r" values="10;22;10" dur="3s" repeatCount="indefinite" />
                      )}
                    </circle>
                  )}
                  <circle cx={n.x} cy={n.y} r={n.hub ? 5 : 3.5} fill={n.hub ? "var(--color-accent-2)" : "var(--color-platinum)"} />
                  <text
                    x={n.x}
                    y={n.y - 14}
                    textAnchor="middle"
                    className="font-mono"
                    fontSize="15"
                    fill={n.hub ? "var(--color-chalk)" : "var(--color-mist)"}
                    letterSpacing="1"
                  >
                    {n.name}
                  </text>
                </g>
              ))}
            </svg>

            <div className="pointer-events-none absolute bottom-4 left-5 font-mono text-[0.62rem] tracking-[0.3em] text-fog">
              {r.hint}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
