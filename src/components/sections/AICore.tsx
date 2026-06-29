"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { ChapterNumeral } from "@/components/ui/ChapterNumeral";
import { SceneBoundary } from "@/components/three/SceneBoundary";
import { useSceneVisibility } from "@/hooks/useSceneVisibility";
import { useContent } from "@/lib/content";
import { MODES } from "@/components/three/NeuralFlow";

const NeuralFlow = dynamic(() => import("@/components/three/NeuralFlow"), {
  ssr: false,
  loading: () => null,
});

const EASE = [0.16, 1, 0.3, 1] as const;

/** Split a title so its final word can be tinted azure — the one accent the
 *  headline gets ("…to work." / "…au travail."). Trailing punctuation rides
 *  along with the highlighted word. */
function splitTitle(title: string): [string, string] {
  const i = title.trimEnd().lastIndexOf(" ");
  if (i === -1) return ["", title];
  return [title.slice(0, i + 1), title.slice(i + 1)];
}

/** One capability row: numbered, hairline-separated, reports when it becomes
 *  the active reading row so the field can re-organize around it. */
function CapabilityRow({
  index,
  k,
  v,
  reduce,
  onActive,
}: {
  index: number;
  k: string;
  v: string;
  reduce: boolean;
  onActive: (i: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // a tight band in the middle of the viewport decides "the row you're reading"
  const active = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (active && !reduce) onActive(index);
  }, [active, reduce, index, onActive]);

  const num = String(index + 1).padStart(2, "0");

  return (
    <div
      ref={ref}
      onMouseEnter={() => {
        if (!reduce) onActive(index);
      }}
      className="group relative py-7"
    >
      {/* hairline divider — scales in from the left as the row enters */}
      <motion.span
        aria-hidden
        className="absolute left-0 top-0 h-px w-full origin-left bg-[color-mix(in_oklab,var(--color-chalk)_10%,transparent)]"
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={reduce ? undefined : { scaleX: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.9, ease: EASE }}
      />
      <div className="flex items-baseline gap-5">
        <span className="font-mono text-xs text-accent tabular-nums">
          [{num}]
        </span>
        <div className="min-w-0">
          <div className="font-display text-lg leading-tight text-chalk">
            {k}
          </div>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-mist">{v}</p>
        </div>
      </div>
    </div>
  );
}

export function AICore() {
  const scene = useSceneVisibility<HTMLDivElement>();
  const c = useContent().core;
  const POINTS = c.points;
  const reduce = useReducedMotion() ?? false;

  const [activeMode, setActiveMode] = useState(0);
  const m = MODES[activeMode] ?? MODES[0];

  const [titleHead, titleTail] = splitTitle(c.title);

  return (
    <section id="core" className="relative z-10 overflow-hidden py-28 md:py-36">
      {/* full-bleed neural field — reactive to the active capability row */}
      <div ref={scene.ref} aria-hidden className="absolute inset-0">
        <SceneBoundary>
          {scene.mounted && (
            <NeuralFlow
              frameloop={scene.frameloop}
              activeMode={reduce ? 0 : activeMode}
            />
          )}
        </SceneBoundary>
      </div>

      {/* single soft left-to-transparent scrim — keeps the reading column
          legible without burying the field across the whole width */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050505] from-25% via-[#050505]/70 via-50% to-transparent to-80%" />

      <div className="container-x relative z-10 grid grid-cols-1 gap-x-12 lg:grid-cols-[minmax(0,40%)_minmax(0,60%)]">
        {/* LEFT — sticky editorial reading column */}
        <div className="relative">
          <div className="lg:sticky lg:top-0 lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:py-24">
            <div className="relative">
              <ChapterNumeral n="01" label="INTELLIGENCE" />

              <div className="relative z-10">
                <Reveal>
                  <span className="eyebrow">{c.eyebrow}</span>
                </Reveal>

                <Reveal delay={0.08}>
                  <h2 className="text-section-title mt-7 max-w-xl text-balance text-chalk">
                    {titleHead}
                    <span className="text-accent">{titleTail}</span>
                  </h2>
                </Reveal>

                <Reveal delay={0.16}>
                  <p className="mt-6 max-w-md text-balance text-mist">
                    {c.intro}
                  </p>
                </Reveal>

                {/* vertical numbered capability list */}
                <div className="mt-12 max-w-xl border-b border-[color-mix(in_oklab,var(--color-chalk)_10%,transparent)]">
                  {POINTS.map((p, i) => (
                    <CapabilityRow
                      key={p.k}
                      index={i}
                      k={p.k}
                      v={p.v}
                      reduce={reduce}
                      onActive={setActiveMode}
                    />
                  ))}
                </div>

                {/* live instrument readout — reflects the field's current
                    targets; hardcoded mono, non-translatable */}
                <div
                  aria-hidden
                  className="mt-5 font-mono text-[0.68rem] tracking-wider text-fog tabular-nums"
                >
                  <span className="text-accent">▮</span> freq{" "}
                  {m.uFreq.toFixed(2)} · speed {m.uSpeed.toFixed(2)} · drift{" "}
                  {m.uDrift.toFixed(3)}
                </div>

                {/* CTA — a single mono → display line, not a card */}
                <Reveal delay={0.16}>
                  <div className="mt-14 max-w-xl">
                    <p className="font-display text-lg leading-snug text-chalk">
                      {c.cta}
                    </p>
                    <a
                      href="#contact"
                      data-cursor
                      className="group mt-3 inline-flex items-baseline gap-3 text-accent transition-colors hover:text-chalk"
                    >
                      <span className="font-mono text-xs uppercase tracking-[0.3em]">
                        →
                      </span>
                      <span className="font-display text-base">
                        {c.ctaButton}
                      </span>
                    </a>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — the field lives here; the scrim above already gives it air.
            This spacer column reserves the 60% track in the split layout. */}
        <div aria-hidden className="hidden lg:block" />
      </div>
    </section>
  );
}
