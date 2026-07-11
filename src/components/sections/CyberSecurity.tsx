"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useContent } from "@/lib/content";
import { usePerf } from "@/lib/perf";
import { audio } from "@/lib/audio";
import { Reveal } from "@/components/ui/Reveal";
import { SpotlightGroup } from "@/components/ui/SpotlightGroup";
import { SceneBoundary } from "@/components/three/SceneBoundary";
import { useSceneVisibility, webglSupported } from "@/hooks/useSceneVisibility";

const CyberField = dynamic(() => import("@/components/three/CyberField"), {
  ssr: false,
  loading: () => <div className="absolute inset-0" />,
});

type Item = { id: string; title: string; tag: string };

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
 * Full-bleed immersive stage — the scene owns the entire viewport of the
 * section and the title lives INSIDE it (no framed card, no widget). The
 * lock drifts right on wide screens so the type breathes on the left.
 */
function VaultStage({ reduced, c }: { reduced: boolean; c: { eyebrow: string; title: string; intro: string; registry: string } }) {
  const [webgl, setWebgl] = useState(true);
  useEffect(() => setWebgl(webglSupported()), []);
  const use3D = !reduced && webgl;
  const scene = useSceneVisibility<HTMLDivElement>({ mountMargin: "600px 0px" });

  return (
    <div
      ref={scene.ref}
      className="relative min-h-[92svh] w-full overflow-hidden bg-[radial-gradient(120%_100%_at_70%_45%,#0a0e17_0%,#030406_70%)]"
    >
      {/* the scene — full bleed */}
      <div className="absolute inset-0">
        {use3D ? (
          <SceneBoundary fallback={<StaticLock />}>
            {scene.mounted && <CyberField frameloop={scene.frameloop} />}
          </SceneBoundary>
        ) : (
          <StaticLock />
        )}
      </div>

      {/* legibility scrims — light-handed, the scene stays the hero */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-void via-void/50 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-void via-void/50 to-transparent" />

      {/* type lives in the scene */}
      <div className="container-x pointer-events-none relative z-10 flex min-h-[92svh] flex-col justify-between py-24 md:py-28">
        <div className="max-w-xl">
          <Reveal>
            <span className="eyebrow">{c.eyebrow}</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="text-section-title text-gradient mt-5">{c.title}</h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 text-mist md:text-lg">{c.intro}</p>
          </Reveal>
        </div>

        <div className="flex items-end justify-between gap-6">
          <span aria-hidden className="flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.3em] text-[#22e0ff]/85">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22e0ff]/70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#22e0ff]" />
            </span>
            {"secure.core · active"}
          </span>
          <span aria-hidden className="hidden font-mono text-[0.58rem] uppercase tracking-[0.25em] text-fog/70 sm:block">
            {c.registry}
          </span>
        </div>
      </div>
    </div>
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
        className="spot-card lit-top group relative h-full rounded-lg border border-chalk/10 bg-chalk/[0.02] px-4 py-4 transition-colors duration-500 hover:bg-accent/[0.04] focus:outline-none focus-visible:border-accent/60 focus-visible:ring-1 focus-visible:ring-accent/50 md:px-5 md:py-5"
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
    <section id="security" className="relative z-10 scroll-mt-24 overflow-hidden bg-void">
      {/* full-bleed immersive stage — the scene IS the section */}
      <VaultStage reduced={reduced} c={c} />

      {/* domain chips, a slim band under the stage */}
      <div className="container-x relative py-16 md:py-20">
        <SpotlightGroup className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          {items.map((item, i) => (
            <DomainCard key={item.id} item={item} index={i} />
          ))}
        </SpotlightGroup>
      </div>
    </section>
  );
}
