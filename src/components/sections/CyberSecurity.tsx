"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useContent } from "@/lib/content";
import { usePerf } from "@/lib/perf";
import { audio } from "@/lib/audio";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";
import { Compile } from "@/components/ui/Compile";
import { ChapterNumeral } from "@/components/ui/ChapterNumeral";
import { CanvasMotif } from "@/components/ui/CanvasMotif";

type Item = { id: string; title: string; tag: string; blurb: string };

const EASE = [0.16, 1, 0.3, 1] as const;

/* ============================================================
   Cyber Security — a SOC-floor section. A live network/radar
   canvas breathes behind a grid of ten domain cards spanning the
   offensive→defensive spectrum. Each card is a real focusable
   surface with blueprint corner brackets that ignite on hover /
   focus. Reduced motion / perf mode drops the canvas for a calm
   static wall.
   ============================================================ */

function DomainCard({ item, index }: { item: Item; index: number }) {
  return (
    <Reveal delay={Math.min(index * 0.05, 0.3)}>
      <div
        tabIndex={0}
        onMouseEnter={() => audio.hover()}
        className="group relative h-full overflow-hidden rounded-lg border border-chalk/10 bg-chalk/[0.02] p-6 transition-colors duration-500 hover:border-accent/40 hover:bg-accent/[0.04] focus:outline-none focus-visible:border-accent/60 focus-visible:ring-1 focus-visible:ring-accent/50 md:p-7"
      >
        {/* blueprint corner brackets — ignite on hover/focus */}
        <span aria-hidden className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-accent/0 transition-colors duration-500 group-hover:border-accent/70 group-focus-visible:border-accent/70" />
        <span aria-hidden className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-accent/0 transition-colors duration-500 group-hover:border-accent/70 group-focus-visible:border-accent/70" />

        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-accent/80">
            {item.tag}
          </span>
          <span aria-hidden className="font-mono text-[0.58rem] tabular-nums text-fog">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-chalk md:text-xl">
          {item.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-mist">{item.blurb}</p>

        {/* baseline trace that draws across on hover */}
        <span
          aria-hidden
          className="mt-6 block h-px w-full origin-left scale-x-0 bg-gradient-to-r from-accent/70 to-transparent transition-transform duration-500 group-hover:scale-x-100 group-focus-visible:scale-x-100"
        />
      </div>
    </Reveal>
  );
}

export function CyberSecurity() {
  const c = useContent().security;
  const reducedPref = useReducedMotion();
  const perf = usePerf();
  const reduced = !!reducedPref || perf;
  const items = c.items as unknown as Item[];
  const [alive] = useState(!reduced);

  return (
    <section id="security" className="relative z-10 scroll-mt-24 overflow-hidden bg-void py-28 md:py-40">
      {/* SOC ambiance — live network + radar, or a calm static field */}
      {alive && (
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.5]">
          <CanvasMotif variant="cyber" className="h-full w-full" />
        </div>
      )}
      {/* legibility scrim */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 40%, transparent 30%, rgba(5,5,5,0.55) 100%), linear-gradient(180deg, rgba(5,5,5,0.5), transparent 20%, transparent 80%, rgba(5,5,5,0.6))",
        }}
      />

      <div className="container-x relative">
        <ChapterNumeral n="04" label="SECURITY" />
      </div>

      <div className="container-x relative">
        <Compile label="security" index="04" disabled={perf}>
          <SectionHeading flush index="04" eyebrow={c.eyebrow} title={c.title} intro={c.intro} />
        </Compile>
      </div>

      <div className="container-x relative mt-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item, i) => (
            <DomainCard key={item.id} item={item} index={i} />
          ))}
        </div>

        {/* registry line — the studio's mono idiom */}
        <Reveal delay={0.1}>
          <motion.p
            className="mt-8 text-right font-mono text-[0.6rem] uppercase tracking-[0.25em] text-fog"
            initial={reduced ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {c.registry}
          </motion.p>
        </Reveal>
      </div>
    </section>
  );
}
