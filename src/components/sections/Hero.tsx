"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { HeroHud } from "./HeroHud";
import { SceneBoundary } from "@/components/three/SceneBoundary";
import { useSceneVisibility } from "@/hooks/useSceneVisibility";
import { useContent } from "@/lib/content";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-void" />,
});

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero({ ready }: { ready: boolean }) {
  const scene = useSceneVisibility<HTMLDivElement>({ mountMargin: "800px 0px" });
  const c = useContent().hero;
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

      {/* content */}
      <div className="container-x relative z-10 flex flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={ready ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1.1, ease: EASE, delay: 0.45 }}
          className="eyebrow mb-8 [@media(max-height:680px)]:mb-3"
        >
          {c.eyebrow}
        </motion.span>

        <h1 className="text-mega text-gradient select-none">
          <Line ready={ready} delay={0.4}>
            ARDLABS
            <span className="align-top text-[0.32em] text-accent">®</span>
          </Line>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          animate={ready ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1.1, ease: EASE, delay: 1.05 }}
          className="mt-7 max-w-2xl text-balance font-display text-xl font-medium leading-snug text-chalk md:text-2xl [@media(max-height:680px)]:mt-3 [@media(max-height:680px)]:text-lg"
        >
          {c.headline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={ready ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1.1, ease: EASE, delay: 1.3 }}
          className="mt-5 max-w-xl text-balance text-sm text-mist md:text-base [@media(max-height:680px)]:mt-2 [@media(max-height:680px)]:text-xs"
        >
          {c.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={ready ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1, ease: EASE, delay: 1.4 }}
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
        transition={{ duration: 1, delay: 1.6 }}
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

function Line({
  children,
  ready,
  delay,
}: {
  children: React.ReactNode;
  ready: boolean;
  delay: number;
}) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className="block"
        initial={{ y: "118%", scale: 1.06, filter: "blur(10px)" }}
        animate={ready ? { y: "0%", scale: 1, filter: "blur(0px)" } : {}}
        transition={{ duration: 1.35, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}
