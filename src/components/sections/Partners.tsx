"use client";

import { useReducedMotion } from "framer-motion";
import { useContent } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

/* ============================================================
   Partners — rebuilt from zero as a cinematic reference band.

   Two counter-scrolling marquee rows of large marques glide under
   soft edge fades, each carrying its sector register; a row pauses
   the moment it is hovered and its marque lifts to full light.
   Reduced motion (and touch devices without hover) degrade to a
   clean static wall.

   REAL LOGOS: drop files into /public/partners/ and reference them
   in LOGO_SRC below (name -> file). Until a marque has its file it
   renders as a refined uniform wordmark — the swap is one line.
   ============================================================ */

/** Official logo files, self-hosted in /public/partners/.
 *  e.g. `"ČEZ Group": "/partners/cez.svg"` — null falls back to the
 *  wordmark treatment. */
const LOGO_SRC: Record<string, string | null> = {
  "ČEZ Group": null,
  Packeta: null,
  "Česká spořitelna": null,
  "Kiwi.com": null,
  "Devolli Corporation": null,
  "Alza.cz": null,
  "Seznam.cz": null,
  "YTC Group": null,
};

type Item = { name: string; sector: string };

function Marque({ item, index }: { item: Item; index: number }) {
  const src = LOGO_SRC[item.name] ?? null;
  return (
    <div className="group/m flex shrink-0 flex-col items-center gap-3 px-12 py-2 md:px-16">
      <div className="flex h-10 items-center">
        {src ? (
          /* real logo: rendered white-on-void at rest, full colour on hover */
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={item.name}
            className="h-8 w-auto opacity-60 [filter:brightness(0)_invert(0.92)] transition-all duration-500 group-hover/m:opacity-100 group-hover/m:[filter:none] md:h-9"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="whitespace-nowrap font-display text-2xl font-semibold tracking-tight text-chalk/60 transition-colors duration-500 group-hover/m:text-chalk md:text-[1.7rem]">
            {item.name}
          </span>
        )}
      </div>
      <span className="flex items-center gap-2 whitespace-nowrap font-mono text-[0.58rem] uppercase tracking-[0.22em] text-fog/55 transition-colors duration-500 group-hover/m:text-fog">
        <span aria-hidden className="text-accent/70">{`[${String(index + 1).padStart(2, "0")}]`}</span>
        {item.sector}
      </span>
    </div>
  );
}

function Row({
  items,
  offset,
  reverse,
  duration,
}: {
  items: Item[];
  offset: number;
  reverse?: boolean;
  duration: number;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className="flex flex-wrap items-start justify-center gap-y-6">
        {items.map((p, i) => (
          <Marque key={p.name} item={p} index={offset + i} />
        ))}
      </div>
    );
  }

  return (
    <div
      className="marquee-mask relative overflow-hidden"
      // the row pauses while the visitor inspects it
      style={{ ["--marquee-duration" as string]: `${duration}s` }}
    >
      <div
        className={`marquee-track flex w-max items-start ${reverse ? "marquee-reverse" : ""}`}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            className="flex items-start"
          >
            {items.map((p, i) => (
              <Marque key={`${copy}-${p.name}`} item={p} index={offset + i} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Partners() {
  const c = useContent().partners;
  const items = c.items as unknown as Item[];
  const rowA = items.slice(0, 4);
  const rowB = items.slice(4);

  return (
    <section aria-label={c.eyebrow} className="relative z-10 overflow-hidden bg-void">
      <div className="py-24 md:py-32">
        {/* editorial header, on the page grid */}
        <div className="container-x">
          <Reveal>
            <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3">
              <span className="eyebrow">{c.eyebrow}</span>
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-fog/70">
                {c.note}
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="text-section-title text-gradient mt-5 max-w-2xl">
              {c.title}
            </h2>
          </Reveal>
        </div>

        {/* the band bleeds full width, framed by hairlines */}
        <Reveal delay={0.16} className="mt-14">
          <div className="hairline-t" />
          <div className="space-y-2 py-10">
            <Row items={rowA} offset={0} duration={48} />
            <Row items={rowB} offset={4} duration={40} reverse />
          </div>
          <div className="hairline-t" />
        </Reveal>

        {/* registry line — the studio's mono idiom */}
        <div className="container-x">
          <Reveal delay={0.22}>
            <p className="mt-6 text-right font-mono text-[0.6rem] uppercase tracking-[0.25em] text-fog/50">
              {"08 · CZ — XK — AL — EU"}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
