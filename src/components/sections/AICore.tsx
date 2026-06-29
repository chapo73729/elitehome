"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useInView } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { SceneBoundary } from "@/components/three/SceneBoundary";
import { useSceneVisibility } from "@/hooks/useSceneVisibility";
import { useContent } from "@/lib/content";

const NeuralFlow = dynamic(() => import("@/components/three/NeuralFlow"), {
  ssr: false,
  loading: () => null,
});

export function AICore() {
  const scene = useSceneVisibility<HTMLDivElement>();
  const c = useContent().core;
  const POINTS = c.points;
  const igniteRef = useRef<HTMLDivElement>(null);
  // signature "peak": fire a single bright ignition the first time the core
  // enters view — the memorable moment (peak-end rule).
  const ignited = useInView(igniteRef, { once: true, amount: 0.45 });
  return (
    <section
      id="core"
      className="relative z-10 overflow-hidden py-28 md:py-36"
    >
      {/* full-bleed neural field */}
      <div ref={scene.ref} className="absolute inset-0">
        <SceneBoundary>
          {scene.mounted && <NeuralFlow frameloop={scene.frameloop} />}
        </SceneBoundary>
      </div>

      {/* one-shot ignition burst */}
      <div ref={igniteRef} className="pointer-events-none absolute inset-0">
        <motion.div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_60%_50%,rgba(79,140,255,0.55),transparent_55%)]"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={ignited ? { opacity: [0, 0.85, 0], scale: [0.7, 1.15, 1.35] } : {}}
          transition={{ duration: 1.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      {/* legibility scrims: text reads on near-solid void at the left,
          the living field glows to the right */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050505] from-15% via-[#050505]/85 via-45% to-transparent to-80%" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_50%,transparent_55%,#050505)]" />

      <div className="container-x relative z-10 flex flex-col justify-center">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-accent">01</span>
            <span className="eyebrow">{c.eyebrow}</span>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="text-section-title text-chalk mt-7 max-w-3xl text-balance">
            {c.title}
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-6 max-w-md text-balance text-mist">
            {c.intro}
          </p>
        </Reveal>

        <div className="mt-16 grid max-w-3xl gap-px overflow-hidden rounded-2xl hairline sm:grid-cols-3">
          {POINTS.map((p, i) => (
            <Reveal key={p.k} delay={0.1 + i * 0.08}>
              <div className="glass h-full p-6">
                <div className="font-mono text-xs uppercase tracking-widest text-accent-2">
                  {p.k}
                </div>
                <p className="mt-3 text-sm text-mist">{p.v}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* peak-motivation CTA: a low-friction prompt right after the wow */}
        <Reveal delay={0.16}>
          <div className="mt-10 flex max-w-3xl flex-wrap items-center gap-x-6 gap-y-3">
            <p className="font-display text-lg text-chalk">{c.cta}</p>
            <a
              href="#contact"
              data-cursor
              className="group inline-flex items-center gap-2 text-sm font-medium text-accent-2 transition-colors hover:text-chalk"
            >
              {c.ctaButton}
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
