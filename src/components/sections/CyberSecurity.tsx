"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useContent } from "@/lib/content";
import { usePerf } from "@/lib/perf";
import { audio } from "@/lib/audio";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";
import { Compile } from "@/components/ui/Compile";
import { ChapterNumeral } from "@/components/ui/ChapterNumeral";
import { SceneBoundary } from "@/components/three/SceneBoundary";
import { useSceneVisibility, webglSupported } from "@/hooks/useSceneVisibility";

const CyberVault = dynamic(() => import("@/components/three/CyberVault"), {
  ssr: false,
  loading: () => <div className="absolute inset-0" />,
});

type Item = { id: string; title: string; tag: string };

const EASE = [0.16, 1, 0.3, 1] as const;

/** Blueprint corner bracket, matched to the « Compile » idiom. */
const STAGE_CORNERS = [
  "left-4 top-4 border-l border-t",
  "right-4 top-4 border-r border-t",
  "bottom-4 left-4 border-b border-l",
  "bottom-4 right-4 border-b border-r",
] as const;

/** Calm static emblem — reduced motion / perf / no-WebGL / lost context. */
function StaticLock() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(60%_60%_at_50%_50%,rgba(34,224,255,0.12),transparent_70%)]">
      <svg width="132" height="150" viewBox="0 0 132 150" fill="none" className="text-[#22e0ff] [filter:drop-shadow(0_0_16px_rgba(34,224,255,0.55))]">
        <path d="M38 62 V44 a28 28 0 0 1 56 0 V62" stroke="currentColor" strokeWidth="7" strokeLinecap="round" fill="none" />
        <rect x="26" y="62" width="80" height="70" rx="14" stroke="currentColor" strokeWidth="5" fill="rgba(34,224,255,0.06)" />
        <circle cx="66" cy="92" r="9" fill="currentColor" />
        <path d="M62 98 h8 l3 22 h-14 z" fill="currentColor" />
      </svg>
    </div>
  );
}

/**
 * The cyber-protection centrepiece — a living Three.js system
 * (singularity → big-bang → padlock formation → protection → implosion).
 * Falls back to a calm static emblem when WebGL is unavailable or motion
 * is reduced.
 */
function LockStage({ reduced }: { reduced: boolean }) {
  const [webgl, setWebgl] = useState(true);
  useEffect(() => setWebgl(webglSupported()), []);
  const use3D = !reduced && webgl;
  const scene = useSceneVisibility<HTMLDivElement>({ mountMargin: "600px 0px" });

  return (
    <Reveal delay={0.12}>
      <div
        ref={scene.ref}
        className="relative mx-auto h-[clamp(360px,56vh,560px)] w-full max-w-4xl overflow-hidden rounded-2xl border border-chalk/10 bg-[radial-gradient(130%_130%_at_50%_45%,#080b12_0%,#030406_72%)]"
      >
        {use3D ? (
          <SceneBoundary fallback={<StaticLock />}>
            {scene.mounted && <CyberVault frameloop={scene.frameloop} />}
          </SceneBoundary>
        ) : (
          <StaticLock />
        )}

        {/* blueprint corner brackets */}
        {STAGE_CORNERS.map((cls) => (
          <span key={cls} aria-hidden className={`pointer-events-none absolute h-5 w-5 border-[#22e0ff]/40 ${cls}`} />
        ))}

        {/* minimal HUD — premium restraint */}
        <span aria-hidden className="pointer-events-none absolute left-6 top-5 font-mono text-[0.55rem] uppercase tracking-[0.3em] text-fog/70">
          {"// secure.core"}
        </span>
        <span aria-hidden className="pointer-events-none absolute right-6 top-5 flex items-center gap-2 font-mono text-[0.55rem] uppercase tracking-[0.3em] text-[#22e0ff]/85">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22e0ff]/70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#22e0ff]" />
          </span>
          active
        </span>
      </div>
    </Reveal>
  );
}

/* ============================================================
   Cyber Security — a SOC-floor section. A live network/radar
   canvas breathes behind a grid of ten domain cards spanning the
   offensive→defensive spectrum. Each card is a real focusable
   surface with blueprint corner brackets that ignite on hover /
   focus. Reduced motion / perf mode drops the canvas for a calm
   static wall.
   ============================================================ */

/** Compact visual chip — tag + title, brackets that ignite. No paragraphs. */
function DomainCard({ item, index }: { item: Item; index: number }) {
  return (
    <Reveal delay={Math.min(index * 0.04, 0.24)}>
      <div
        tabIndex={0}
        onMouseEnter={() => audio.hover()}
        className="group relative h-full overflow-hidden rounded-lg border border-chalk/10 bg-chalk/[0.02] px-4 py-4 transition-colors duration-500 hover:border-accent/40 hover:bg-accent/[0.05] focus:outline-none focus-visible:border-accent/60 focus-visible:ring-1 focus-visible:ring-accent/50 md:px-5 md:py-5"
      >
        {/* blueprint corner brackets — ignite on hover/focus */}
        <span aria-hidden className="pointer-events-none absolute left-2 top-2 h-2.5 w-2.5 border-l border-t border-accent/0 transition-colors duration-500 group-hover:border-accent/70 group-focus-visible:border-accent/70" />
        <span aria-hidden className="pointer-events-none absolute bottom-2 right-2 h-2.5 w-2.5 border-b border-r border-accent/0 transition-colors duration-500 group-hover:border-accent/70 group-focus-visible:border-accent/70" />

        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-accent/80">
            {item.tag}
          </span>
          <span aria-hidden className="font-mono text-[0.55rem] tabular-nums text-fog">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h3 className="mt-3 font-display text-[0.95rem] font-semibold leading-snug tracking-tight text-chalk md:text-base">
          {item.title}
        </h3>

        {/* baseline trace that draws across on hover */}
        <span
          aria-hidden
          className="mt-3 block h-px w-full origin-left scale-x-0 bg-gradient-to-r from-accent/70 to-transparent transition-transform duration-500 group-hover:scale-x-100 group-focus-visible:scale-x-100"
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

  return (
    <section id="security" className="relative z-10 scroll-mt-24 overflow-hidden bg-void py-28 md:py-40">
      <div className="container-x relative">
        <ChapterNumeral n="04" label="SECURITY" />
      </div>

      <div className="container-x relative">
        <Compile label="security" index="04" disabled={perf}>
          <SectionHeading flush index="04" eyebrow={c.eyebrow} title={c.title} intro={c.intro} />
        </Compile>
      </div>

      {/* the animated-padlock centrepiece */}
      <div className="container-x relative mt-14">
        <LockStage reduced={reduced} />
      </div>

      <div className="container-x relative mt-14">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
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
