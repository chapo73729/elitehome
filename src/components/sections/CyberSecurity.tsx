"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useContent } from "@/lib/content";
import { usePerf } from "@/lib/perf";
import { audio } from "@/lib/audio";
import { Reveal } from "@/components/ui/Reveal";
import { SpotlightGroup } from "@/components/ui/SpotlightGroup";
import { Decode } from "@/components/ui/Decode";
import { SceneBoundary } from "@/components/three/SceneBoundary";
import { useSceneVisibility, webglSupported } from "@/hooks/useSceneVisibility";
import { useScrollScrub } from "@/hooks/useScrollScrub";

const CyberSiege = dynamic(() => import("@/components/three/CyberSiege"), {
  ssr: false,
  loading: () => <div className="absolute inset-0" />,
});

type Item = { id: string; title: string; tag: string };

/** Calm static emblem — reduced motion / perf / no-WebGL / lost context:
 *  the shield dome in its final, formed state. */
function StaticShield() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(60%_60%_at_50%_50%,rgba(34,224,255,0.10),transparent_70%)]">
      <svg
        width="220"
        height="220"
        viewBox="0 0 220 220"
        fill="none"
        className="text-[#22e0ff] [filter:drop-shadow(0_0_18px_rgba(34,224,255,0.45))]"
      >
        <circle cx="110" cy="110" r="86" stroke="currentColor" strokeOpacity="0.75" strokeWidth="1.4" />
        <ellipse cx="110" cy="110" rx="86" ry="34" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1" />
        <ellipse cx="110" cy="110" rx="34" ry="86" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1" />
        <ellipse cx="110" cy="110" rx="66" ry="66" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" transform="rotate(45 110 110)" />
        <circle cx="110" cy="110" r="14" fill="currentColor" fillOpacity="0.8" />
      </svg>
    </div>
  );
}

/**
 * The siege stage: a 300vh scroll track pinning a full-viewport stage.
 * Scroll drives the three-act story (swarm → analysis → capture); the
 * title holds the left, act captions relay bottom-left, and a progress
 * rail mirrors the page's gutter idiom.
 */
function SiegeStage({
  reduced,
  c,
}: {
  reduced: boolean;
  c: { eyebrow: string; title: string; intro: string; registry: string; acts: string[] };
}) {
  const [webgl, setWebgl] = useState(true);
  useEffect(() => setWebgl(webglSupported()), []);
  const use3D = !reduced && webgl;

  const trackRef = useRef<HTMLDivElement>(null);
  const { progress } = useScrollScrub(trackRef);
  const progressRef = useRef(0);
  useMotionValueEvent(progress, "change", (v) => {
    progressRef.current = v;
  });
  const scene = useSceneVisibility<HTMLDivElement>({ mountMargin: "600px 0px" });

  // act captions relay as the story advances
  const act1 = useTransform(progress, [0.0, 0.05, 0.24, 0.31], [0, 1, 1, 0]);
  const act2 = useTransform(progress, [0.31, 0.38, 0.52, 0.6], [0, 1, 1, 0]);
  const act3 = useTransform(progress, [0.62, 0.72, 1, 1], [0, 1, 1, 1]);
  const rail = progress;

  if (!use3D) {
    // static, unpinned rendition — same words, final frame
    return (
      <div className="relative min-h-[92svh] w-full overflow-hidden bg-[radial-gradient(120%_100%_at_70%_45%,#0a0e17_0%,#030406_70%)]">
        <StaticShield />
        <div className="container-x relative z-10 flex min-h-[92svh] flex-col justify-between py-24 md:py-28">
          <div className="max-w-xl">
            <span className="eyebrow">{c.eyebrow}</span>
            <h2 className="text-section-title text-gradient mt-5">{c.title}</h2>
            <p className="mt-5 text-mist md:text-lg">{c.intro}</p>
          </div>
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.25em] text-fog/70">
            {c.registry}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div ref={trackRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-[radial-gradient(120%_100%_at_60%_40%,#070a12_0%,#030406_72%)]">
        {/* the stage */}
        <div ref={scene.ref} className="absolute inset-0">
          <SceneBoundary fallback={<StaticShield />}>
            {scene.mounted && (
              <CyberSiege frameloop={scene.frameloop} progressRef={progressRef} />
            )}
          </SceneBoundary>
        </div>

        {/* legibility scrims */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-void via-void/40 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-void via-void/40 to-transparent" />
        {/* the storm is bright — the headline column gets a firm scrim plus a
            corner well so white type stays readable at every act */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-[62%] bg-gradient-to-r from-[#030406]/95 via-[#030406]/60 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute left-0 top-0 h-[70%] w-[55%] bg-[radial-gradient(80%_80%_at_18%_28%,rgba(3,4,6,0.9),transparent_70%)]" />

        {/* persistent title, in-scene */}
        <div className="container-x pointer-events-none relative z-10 flex h-screen flex-col justify-between py-24 md:py-28">
          <div className="max-w-xl">
            <Reveal>
              <Decode text={c.eyebrow} className="eyebrow" />
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="text-section-title text-gradient mt-5 [filter:drop-shadow(0_2px_16px_rgba(3,4,6,0.95))_drop-shadow(0_0_36px_rgba(3,4,6,0.8))]">
                {c.title}
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-5 text-mist [filter:drop-shadow(0_1px_10px_rgba(3,4,6,0.95))] md:text-lg">
                {c.intro}
              </p>
            </Reveal>
          </div>

          <div className="flex items-end justify-between gap-6">
            {/* act captions — one live line, relayed by scroll */}
            <div className="relative h-10 min-w-0 flex-1">
              {[act1, act2, act3].map((op, i) => (
                <motion.span
                  key={i}
                  style={{ opacity: op }}
                  className={`absolute bottom-0 left-0 flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.24em] md:text-[0.66rem] ${
                    i === 0 ? "text-[#ff5040]" : "text-[#22e0ff]"
                  }`}
                >
                  <span
                    className={`inline-block h-1.5 w-1.5 rounded-full ${
                      i === 0 ? "bg-[#ff5040]" : "bg-[#22e0ff]"
                    } ${i < 2 ? "animate-pulse" : ""}`}
                  />
                  {c.acts[i]}
                </motion.span>
              ))}
            </div>
            <span aria-hidden className="hidden shrink-0 font-mono text-[0.58rem] uppercase tracking-[0.25em] text-fog/70 sm:block">
              {c.registry}
            </span>
          </div>
        </div>

        {/* story progress rail — right edge, echoes the page gutter */}
        <div aria-hidden className="pointer-events-none absolute right-6 top-1/2 hidden h-[30vh] w-px -translate-y-1/2 overflow-hidden bg-white/10 lg:block">
          <motion.div
            style={{ scaleY: rail, transformOrigin: "top" }}
            className="absolute inset-0 bg-[#22e0ff]/80"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Field footage — the studio's threat-response motion piece, framed as an
 * editorial media panel. Muted loop that only plays while on screen;
 * reduced motion gets the poster with native controls instead.
 */
function FootageReel({ reel, reduced }: { reel: { label: string; caption: string }; reduced: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduced) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.35 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <Reveal>
      <figure className="group relative">
        <div className="lit-top relative overflow-hidden rounded-xl border border-chalk/10 bg-[#05070c]">
          {/* corner brackets — the section's blueprint idiom */}
          <span aria-hidden className="pointer-events-none absolute left-3 top-3 z-10 h-4 w-4 border-l border-t border-accent/50" />
          <span aria-hidden className="pointer-events-none absolute right-3 top-3 z-10 h-4 w-4 border-r border-t border-accent/50" />
          <span aria-hidden className="pointer-events-none absolute bottom-3 left-3 z-10 h-4 w-4 border-b border-l border-accent/50" />
          <span aria-hidden className="pointer-events-none absolute bottom-3 right-3 z-10 h-4 w-4 border-b border-r border-accent/50" />

          <video
            ref={videoRef}
            className="aspect-video w-full object-cover"
            poster="/media/threat-response-poster.jpg"
            muted
            loop
            playsInline
            preload="none"
            controls={reduced}
            aria-label={reel.caption}
          >
            <source src="/media/threat-response.mp4" type="video/mp4" />
            <source src="/media/threat-response.webm" type="video/webm" />
          </video>
          {/* soft vignette so the panel sits in the page's light language */}
          <div aria-hidden className="pointer-events-none absolute inset-0 rounded-xl [box-shadow:inset_0_0_80px_rgba(0,0,0,0.55)]" />
        </div>
        <figcaption className="mt-3 flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.28em] text-fog">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#22e0ff]" />
            {`// ${reel.label}`}
          </span>
          <span className="text-right text-xs text-mist">{reel.caption}</span>
        </figcaption>
      </figure>
    </Reveal>
  );
}

/** Compact visual chip — tag + title, brackets that ignite. */
function DomainCard({ item, index }: { item: Item; index: number }) {
  return (
    <Reveal delay={Math.min(index * 0.04, 0.24)}>
      <div
        tabIndex={0}
        onMouseEnter={() => audio.hover()}
        className="spot-card lit-top group relative h-full rounded-lg border border-chalk/10 bg-chalk/[0.02] px-4 py-4 transition-colors duration-500 hover:bg-accent/[0.04] focus:outline-none focus-visible:border-accent/60 focus-visible:ring-1 focus-visible:ring-accent/50 md:px-5 md:py-5"
      >
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
    // no overflow-hidden on the section — it would unstick the pinned stage
    <section id="security" className="relative z-10 scroll-mt-24 bg-void">
      {/* the siege — a scroll-driven three-act story */}
      <SiegeStage reduced={reduced} c={c} />

      {/* domain chips, a slim band under the stage */}
      <div className="container-x relative py-16 md:py-20">
        <SpotlightGroup className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          {items.map((item, i) => (
            <DomainCard key={item.id} item={item} index={i} />
          ))}
        </SpotlightGroup>

        {/* the studio's threat-response motion piece closes the chapter */}
        <div className="mt-14 md:mt-16">
          <FootageReel reel={c.reel} reduced={reduced} />
        </div>
      </div>
    </section>
  );
}
