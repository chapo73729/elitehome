"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { ChapterNumeral } from "@/components/ui/ChapterNumeral";
import { Compile } from "@/components/ui/Compile";
import { useContent } from "@/lib/content";
import { WorldMap, type FocusInfo } from "./WorldMap";

const EASE = [0.16, 1, 0.3, 1] as const;

export function GlobalNetwork() {
  const c = useContent().network;
  const reduce = useReducedMotion() ?? false;
  const [focus, setFocus] = useState<FocusInfo>(null);

  return (
    <section
      id="network"
      className="relative z-10 overflow-hidden py-28 md:py-36"
    >
      <ChapterNumeral n="02" label="NETWORK" />

      {/* full-bleed interactive stage — the map breaks out of the reading
          column so the dark sea bleeds toward the section seams and reads as
          one continuous world. */}
      <div className="relative mt-10">
        {/* edge-to-edge map */}
        <div className="relative w-full">
          {/* heading plate — in-flow ABOVE the map on mobile (no collision with
              the city labels), overlaid top-left on the map from lg up. */}
          <div className="pointer-events-none relative z-10 mb-10 max-w-md px-[clamp(1.25rem,5vw,5rem)] lg:absolute lg:top-10 lg:mb-0 lg:max-w-sm lg:px-0 lg:left-[max(clamp(1.25rem,5vw,5rem),calc((100vw-1440px)/2+clamp(1.25rem,5vw,5rem)))]">
            <Compile label="network" index="02">
              <Reveal>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-accent">02</span>
                  <span className="eyebrow">{c.eyebrow}</span>
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="text-section-title mt-5 text-balance text-chalk">
                  {c.title}
                </h2>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist">
                  {c.intro}
                </p>
              </Reveal>

              {/* mono coordinate readout — tracks the focused hub, else idles
                  on the world view. Hardcoded mono vocabulary, non-translatable. */}
              <div
                aria-hidden
                className="mt-6 font-mono text-[0.68rem] tracking-wider text-fog tabular-nums"
              >
                <span className="text-accent">▮</span>{" "}
                {focus ? (
                  <span className="text-mist">{focus.coord}</span>
                ) : (
                  <span>WORLD · 06 HUBS</span>
                )}
              </div>
            </Compile>
          </div>

          {/* the map itself */}
          <div className="relative">
            <WorldMap onFocus={setFocus} />
            {/* soft scrims at the seams so the sea melts into the page rather
                than ending on a hard rectangle */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#050505] to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#050505] to-transparent" />
          </div>

          {/* detail plate — slides in near the focused hub (which has been
              recentered toward the stage). Shows ONLY true data: name,
              country · timezone, and the hubs it connects to. */}
          <AnimatePresence>
            {focus && (
              <motion.div
                key={focus.name}
                className="absolute bottom-8 z-20 w-[15rem]"
                style={{
                  right:
                    "max(clamp(1.25rem,5vw,5rem), calc((100vw - 1440px) / 2 + clamp(1.25rem,5vw,5rem)))",
                }}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <div className="glass rounded-2xl p-5 backdrop-blur-xl">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-display text-lg leading-none text-chalk">
                      {focus.name}
                    </span>
                    <span className="font-mono text-[0.7rem] tracking-wider text-accent-2">
                      {focus.meta}
                    </span>
                  </div>

                  <div className="mt-4 border-t border-white/10 pt-4">
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-fog">
                      {c.routesLabel}
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {focus.routes.map((r) => (
                        <li
                          key={r}
                          className="flex items-center gap-2.5 text-sm text-mist"
                        >
                          <span className="inline-block h-1 w-1 rounded-full bg-accent" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="mt-4 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-fog/70">
                    {c.returnHint}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
