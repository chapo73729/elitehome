"use client";

import type { ReactNode } from "react";
import { useContent } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

/* ============================================================
   Partners — a quiet interlude between the Network and Services
   chapters: a hairline wall of client marques. Every logotype is
   an original in-house SVG (no external assets, currentColor
   throughout) so the wall renders as one grayscale system that
   individual marks brighten out of on hover.
   ============================================================ */

/** Shared glyph frame: 24×24, stroke-drawn, inherits currentColor. */
function G({ children, filled }: { children: ReactNode; filled?: boolean }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="shrink-0"
    >
      {children}
    </svg>
  );
}

/* One logotype per marque: a distinctive glyph + its own type voice.
   The wordmarks deliberately use different cases/tracking/weights so the
   wall reads as eight independent identities, not one repeated template. */
const LOGOS: { glyph: ReactNode; word: ReactNode }[] = [
  {
    // Vltava Energo — the river as three flowing lines
    glyph: (
      <G>
        <path d="M3 7.5c3-2.6 6 2.6 9 0s6-2.6 9 0" />
        <path d="M3 12.5c3-2.6 6 2.6 9 0s6-2.6 9 0" />
        <path d="M3 17.5c3-2.6 6 2.6 9 0s6-2.6 9 0" />
      </G>
    ),
    word: (
      <span className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.24em]">
        Vltava&nbsp;Energo
      </span>
    ),
  },
  {
    // Hradek Logistika — merlons over a forwarding baseline
    glyph: (
      <G>
        <path d="M5 17V9.5h2.2V7h2.2v2.5h5.2V7h2.2v2.5H19V17" />
        <path d="M3.5 19.5H17l3-2.5" />
      </G>
    ),
    word: (
      <span className="font-display text-[0.95rem] font-medium tracking-[-0.01em]">
        Hradek<span className="font-light text-current/80">&nbsp;Logistika</span>
      </span>
    ),
  },
  {
    // Koruna Capital — the crown, stroke-drawn
    glyph: (
      <G>
        <path d="M4.5 16.5 6 8.5l4 3.5 2-6 2 6 4-3.5 1.5 8z" />
        <path d="M5.5 19.5h13" />
      </G>
    ),
    word: (
      <span className="font-display text-[0.85rem] font-bold uppercase tracking-[0.14em]">
        Koruna
        <span className="font-normal tracking-[0.2em] text-current/75">
          &nbsp;Capital
        </span>
      </span>
    ),
  },
  {
    // Orloj Systems — the astronomical clock, one hand set
    glyph: (
      <G>
        <circle cx="12" cy="12" r="8.6" />
        <path d="M12 3.4v2M20.6 12h-2M12 20.6v-2M3.4 12h2" />
        <path d="M12 12V7.2M12 12l3.4 2.4" />
      </G>
    ),
    word: (
      <span className="font-display text-[0.95rem] font-semibold lowercase tracking-[-0.03em]">
        orloj<span className="font-light">&nbsp;systems</span>
      </span>
    ),
  },
  {
    // Letná Aero — swept delta
    glyph: (
      <G filled>
        <path d="M12 4 21 19h-4.6L12 11.4 7.6 19H3z" />
      </G>
    ),
    word: (
      <span className="font-display text-[0.9rem] font-medium italic tracking-[0.04em]">
        Letná&nbsp;Aero
      </span>
    ),
  },
  {
    // Moravit — faceted mineral hexagon
    glyph: (
      <G>
        <path d="M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9z" />
        <path d="M12 3v18M4.2 7.5 19.8 16.5" />
      </G>
    ),
    word: (
      <span className="font-display text-[0.85rem] font-extrabold uppercase tracking-[0.08em]">
        Moravit
      </span>
    ),
  },
  {
    // Kyberna — hex cell with a guarded node
    glyph: (
      <G>
        <path d="M12 2.8l7.4 4.3v8.6L12 20l-7.4-4.3V7.1z" />
        <circle cx="12" cy="11.5" r="2.2" />
        <path d="M12 13.7v3.4" />
      </G>
    ),
    word: (
      <span className="font-mono text-[0.78rem] font-medium lowercase tracking-[0.06em]">
        kyberna<span className="text-current/60">_</span>
      </span>
    ),
  },
  {
    // Zdravota — care cross over a pulse
    glyph: (
      <G>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <path d="M6.5 12h3l1.5-3.2 2 6.4 1.5-3.2h3" />
      </G>
    ),
    word: (
      <span className="font-display text-[0.92rem] font-medium tracking-[0.1em]">
        Zdravota<span className="text-current/60">+</span>
      </span>
    ),
  },
];

export function Partners() {
  const c = useContent().partners;

  return (
    <section aria-label={c.eyebrow} className="relative z-10 bg-void">
      <div className="container-x py-20 md:py-28">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3">
            <span className="eyebrow">{c.eyebrow}</span>
            <span className="font-mono text-[0.62rem] tracking-[0.2em] text-fog/70 uppercase">
              {c.note}
            </span>
          </div>
        </Reveal>

        <ul className="mt-10 grid grid-cols-2 lg:grid-cols-4" role="list">
          {c.items.map((p, i) => (
            <Reveal
              as="li"
              key={p.name}
              delay={0.05 * i}
              y={16}
              className={`group hairline-t ${i % 2 === 1 ? "border-l border-[color-mix(in_oklab,var(--color-chalk)_7%,transparent)]" : ""} ${i % 4 !== 0 ? "lg:border-l lg:border-[color-mix(in_oklab,var(--color-chalk)_7%,transparent)]" : "lg:border-l-0"}`}
            >
              <div className="flex h-28 flex-col items-center justify-center gap-2.5 px-4 text-mist/55 transition-colors duration-500 group-hover:text-chalk md:h-32">
                <div className="flex items-center gap-2.5">
                  {LOGOS[i]?.glyph}
                  {LOGOS[i]?.word ?? (
                    <span className="font-display text-sm font-medium">{p.name}</span>
                  )}
                </div>
                <span className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-fog/60 transition-colors duration-500 group-hover:text-fog">
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
