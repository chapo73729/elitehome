"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useContent } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

/* ============================================================
   Partners — the trust wall. Eight marques whose emblems DRAW
   THEMSELVES stroke by stroke as the wall scrolls into view
   (pathLength scrub, staggered), inside a hairline grid with a
   cursor spotlight per cell. Original in-house glyphs, one type
   voice per marque.

   A slow luminous wave travels the wall in a loop — register by
   register, like a scan across an index — on top of the draw-on
   reveal and the per-cell cursor spotlight.
   ============================================================ */

const EASE = [0.16, 1, 0.3, 1] as const;

/* One emblem = a list of stroke paths (drawn in order). `filled` paths
   fill in after their outline finishes drawing. */
type Glyph = { paths: string[]; filled?: boolean };

const GLYPHS: Glyph[] = [
  // Vltava Energo — the river, three flowing lines
  {
    paths: [
      "M3 7.5c3-2.6 6 2.6 9 0s6-2.6 9 0",
      "M3 12.5c3-2.6 6 2.6 9 0s6-2.6 9 0",
      "M3 17.5c3-2.6 6 2.6 9 0s6-2.6 9 0",
    ],
  },
  // Hradek Logistika — merlons over a forwarding baseline
  { paths: ["M5 17V9.5h2.2V7h2.2v2.5h5.2V7h2.2v2.5H19V17", "M3.5 19.5H17l3-2.5"] },
  // Koruna Capital — the crown
  { paths: ["M4.5 16.5 6 8.5l4 3.5 2-6 2 6 4-3.5 1.5 8z", "M5.5 19.5h13"] },
  // Orloj Systems — the astronomical clock
  {
    paths: [
      "M12 3.4a8.6 8.6 0 1 1 0 17.2a8.6 8.6 0 1 1 0-17.2",
      "M12 3.4v2M20.6 12h-2M12 20.6v-2M3.4 12h2",
      "M12 12V7.2M12 12l3.4 2.4",
    ],
  },
  // Letná Aero — swept delta
  { paths: ["M12 4 21 19h-4.6L12 11.4 7.6 19H3z"], filled: true },
  // Moravit — faceted mineral hexagon
  { paths: ["M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9z", "M12 3v18", "M4.2 7.5 19.8 16.5"] },
  // Kyberna — hex cell with a guarded node
  {
    paths: [
      "M12 2.8l7.4 4.3v8.6L12 20l-7.4-4.3V7.1z",
      "M12 9.3a2.2 2.2 0 1 1 0 4.4a2.2 2.2 0 1 1 0-4.4",
      "M12 13.7v3.4",
    ],
  },
  // Zdravota — care cross over a pulse
  {
    paths: [
      "M8.5 3.5h7a5 5 0 0 1 5 5v7a5 5 0 0 1-5 5h-7a5 5 0 0 1-5-5v-7a5 5 0 0 1 5-5z",
      "M6.5 12h3l1.5-3.2 2 6.4 1.5-3.2h3",
    ],
  },
];

/* The wordmark voices — one typographic identity per marque. */
const VOICES: ((name: string) => ReactNode)[] = [
  (n) => (
    <span className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.24em]">
      {n}
    </span>
  ),
  (n) => {
    const [a, ...r] = n.split(" ");
    return (
      <span className="font-display text-[0.95rem] font-medium tracking-[-0.01em]">
        {a}
        {r.length > 0 && <span className="font-light text-current/80"> {r.join(" ")}</span>}
      </span>
    );
  },
  (n) => {
    const [a, ...r] = n.split(" ");
    return (
      <span className="font-display text-[0.85rem] font-bold uppercase tracking-[0.14em]">
        {a}
        {r.length > 0 && (
          <span className="font-normal tracking-[0.2em] text-current/75"> {r.join(" ")}</span>
        )}
      </span>
    );
  },
  (n) => {
    const [a, ...r] = n.split(" ");
    return (
      <span className="font-display text-[0.95rem] font-semibold lowercase tracking-[-0.03em]">
        {a.toLowerCase()}
        {r.length > 0 && <span className="font-light"> {r.join(" ").toLowerCase()}</span>}
      </span>
    );
  },
  (n) => (
    <span className="font-display text-[0.9rem] font-medium italic tracking-[0.04em]">{n}</span>
  ),
  (n) => (
    <span className="font-display text-[0.85rem] font-extrabold uppercase tracking-[0.08em]">
      {n}
    </span>
  ),
  (n) => (
    <span className="font-mono text-[0.78rem] font-medium lowercase tracking-[0.06em]">
      {n.toLowerCase()}
      <span className="text-current/60">_</span>
    </span>
  ),
  (n) => (
    <span className="font-display text-[0.92rem] font-medium tracking-[0.1em]">
      {n}
    </span>
  ),
];

function Emblem({ glyph, delay }: { glyph: Glyph; delay: number }) {
  const reduced = useReducedMotion();
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="shrink-0"
    >
      {glyph.paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          initial={reduced ? false : { pathLength: 0, opacity: 0.2 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{
            pathLength: { duration: 0.9, ease: EASE, delay: delay + i * 0.22 },
            opacity: { duration: 0.3, delay: delay + i * 0.22 },
          }}
          {...(glyph.filled
            ? {
                animate: undefined,
                style: {},
              }
            : {})}
        />
      ))}
      {glyph.filled && (
        <motion.path
          d={glyph.paths[0]}
          stroke="none"
          fill="currentColor"
          initial={reduced ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.5, delay: delay + 0.85 }}
        />
      )}
    </svg>
  );
}

export function Partners() {
  const c = useContent().partners;
  const items = c.items;

  return (
    <section aria-label={c.eyebrow} className="relative z-10 bg-void">
      <div className="container-x py-20 md:py-28">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3">
            <span className="eyebrow">{c.eyebrow}</span>
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-fog/70">
              {c.note}
            </span>
          </div>
        </Reveal>

        <ul className="mt-10 grid grid-cols-2 lg:grid-cols-4" role="list">
          {items.map((p, i) => (
            <Reveal
              as="li"
              key={p.name}
              delay={0.05 * i}
              y={16}
              className={`group hairline-t ${i % 2 === 1 ? "border-l border-[color-mix(in_oklab,var(--color-chalk)_7%,transparent)]" : ""} ${i % 4 !== 0 ? "lg:border-l lg:border-[color-mix(in_oklab,var(--color-chalk)_7%,transparent)]" : "lg:border-l-0"}`}
            >
              <div
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                }}
                className="relative flex h-32 flex-col items-center justify-center gap-2.5 overflow-hidden px-4 text-mist/55 transition-colors duration-500 group-hover:text-chalk md:h-36"
              >
                {/* cursor spotlight — lives only while hovered */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(200px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklab, var(--color-accent) 9%, transparent), transparent 70%)",
                  }}
                />
                {/* travelling wave — a slow scan crossing the wall in a loop */}
                <div
                  aria-hidden
                  className="partner-wave pointer-events-none absolute inset-0"
                  style={{
                    ["--wi" as string]: i,
                    background:
                      "radial-gradient(180px circle at 50% 45%, color-mix(in oklab, var(--color-accent) 11%, transparent), transparent 70%)",
                  }}
                />
                {/* register numeral, the site's index idiom */}
                <span
                  aria-hidden
                  className="absolute left-3 top-2.5 font-mono text-[0.58rem] tracking-[0.18em] text-fog/45 transition-colors duration-500 group-hover:text-accent/80"
                >
                  {`[${String(i + 1).padStart(2, "0")}]`}
                </span>
                <div className="relative flex items-center gap-2.5 transition-transform duration-500 group-hover:-translate-y-0.5">
                  <span className="text-current transition-colors duration-500 group-hover:text-accent">
                    <Emblem glyph={GLYPHS[i % GLYPHS.length]} delay={0.15 + i * 0.12} />
                  </span>
                  {VOICES[i % VOICES.length](p.name)}
                </div>
                <span className="relative font-mono text-[0.58rem] uppercase tracking-[0.22em] text-fog/60 transition-colors duration-500 group-hover:text-fog">
                  {p.sector}
                </span>
              </div>
            </Reveal>
          ))}
        </ul>
        <div className="hairline-t" />
      </div>
    </section>
  );
}
