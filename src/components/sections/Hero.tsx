"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Decode } from "@/components/ui/Decode";
import { HeroHud } from "./HeroHud";
import { SceneBoundary } from "@/components/three/SceneBoundary";
import { useSceneVisibility } from "@/hooks/useSceneVisibility";
import { useContent } from "@/lib/content";
import { audio } from "@/lib/audio";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-void" />,
});

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero({ ready }: { ready: boolean }) {
  const scene = useSceneVisibility<HTMLDivElement>({ mountMargin: "800px 0px" });
  const c = useContent().hero;

  // cinematic entrance cue, timed to the wordmark assembling (opt-in sound)
  useEffect(() => {
    if (ready) audio.arrival();
  }, [ready]);
  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
    >
      {/* 3D field */}
      <div ref={scene.ref} aria-hidden className="absolute inset-0">
        <SceneBoundary>
          {scene.mounted && <HeroScene frameloop={scene.frameloop} ready={ready} />}
        </SceneBoundary>
      </div>

      {/* radial floor glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_115%,rgba(79,140,255,0.18),transparent_70%)]" />

      {/* diegetic HUD */}
      <HeroHud ready={ready} />

      {/* legibility scrim — a soft dark bloom behind the headline/subtitle so
          the copy detaches cleanly from the particle sphere without hiding it */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(46%_30%_at_50%_60%,rgba(2,3,6,0.78),rgba(2,3,6,0.32)_55%,transparent_74%)]"
      />

      {/* content */}
      <div className="container-x relative z-10 flex flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={ready ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.7, ease: EASE, delay: 0.12 }}
          className="eyebrow mb-8 [@media(max-height:680px)]:mb-3"
        >
          <Decode text={c.eyebrow} duration={1200} />
        </motion.span>

        <Wordmark ready={ready} />

        <motion.p
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          animate={ready ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, ease: EASE, delay: 0.42 }}
          className="mt-7 max-w-2xl text-balance font-display text-xl font-medium leading-snug text-chalk md:text-2xl [@media(max-height:680px)]:mt-3 [@media(max-height:680px)]:text-lg"
        >
          {c.headline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={ready ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, ease: EASE, delay: 0.56 }}
          className="mt-5 max-w-xl text-balance text-sm text-mist md:text-base [@media(max-height:680px)]:mt-2 [@media(max-height:680px)]:text-xs"
        >
          {c.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={ready ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.7, ease: EASE, delay: 0.7 }}
          className="mt-11 flex flex-wrap items-center justify-center gap-4 [@media(max-height:680px)]:mt-5"
        >
          <Button href="#services" variant="primary">
            {c.explore}
            <span aria-hidden>→</span>
          </Button>
          <Button href="#contact" variant="ghost">
            {c.engage}
          </Button>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.95 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 [@media(max-height:680px)]:hidden"
      >
        <span className="font-display text-xs text-mist">{c.scrollHint}</span>
        <span className="font-mono text-[0.62rem] tracking-[0.34em] text-fog">
          {c.scroll}
        </span>
        <span className="relative block h-10 w-px overflow-hidden bg-white/10">
          <motion.span
            className="absolute left-0 top-0 block h-3 w-px bg-accent-2"
            animate={{ y: [-12, 40] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}

/**
 * The hero wordmark — ARDLABS assembling letter by letter out of a masked
 * rise (blur + tilt resolving to sharp), then crossed by a luminous sweep;
 * the ® snaps in last on a spring. It settles into the permanent gradient
 * wordmark between the eyebrow and the headline.
 *
 * The gradient is applied PER LETTER (each animated span owns its own
 * background-clip) — putting it on the parent h1 breaks paint in Chromium
 * once children live on their own composited layers, which is exactly why
 * the previous wordmark rendered invisible.
 */
function Wordmark({ ready }: { ready: boolean }) {
  const reduced = useReducedMotion();
  const letters = "ARDLABS".split("");

  if (reduced) {
    return (
      <h1 className="text-mega select-none">
        <span className="text-gradient">ARDLABS</span>
        <span className="align-top text-[0.32em] text-accent">®</span>
      </h1>
    );
  }

  return (
    <h1 className="text-mega select-none" aria-label="ARDLABS®">
      <span aria-hidden className="relative flex items-start justify-center">
        {/* the letters rise inside their own mask… */}
        <span className="relative block overflow-hidden pb-[0.08em]">
          <span className="flex items-baseline">
            {letters.map((ch, i) => (
              <motion.span
                key={i}
                className="text-gradient inline-block will-change-transform"
                initial={{ y: "115%", opacity: 0, filter: "blur(14px)", rotateX: 50 }}
                animate={
                  ready
                    ? { y: "0%", opacity: 1, filter: "blur(0px)", rotateX: 0 }
                    : {}
                }
                transition={{ duration: 1.05, ease: EASE, delay: 0.22 + i * 0.07 }}
              >
                {ch}
              </motion.span>
            ))}
          </span>
          {/* luminous sweep across the letters as they lock */}
          <motion.span
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg, transparent 32%, rgba(255,255,255,0.75) 50%, transparent 68%)",
              mixBlendMode: "overlay",
            }}
            initial={{ x: "-130%" }}
            animate={ready ? { x: "130%" } : {}}
            transition={{ duration: 1.15, ease: "easeInOut", delay: 1.05 }}
          />
        </span>
        {/* …the ® lives OUTSIDE the mask (it scales in, so a clipping
            container would slice it) — superscript via self-start */}
        <motion.span
          className="mt-[0.14em] text-[0.32em] text-accent"
          initial={{ opacity: 0, scale: 0 }}
          animate={ready ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.95, type: "spring", stiffness: 320, damping: 16 }}
        >
          ®
        </motion.span>
      </span>
    </h1>
  );
}
