"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { useContent } from "@/lib/content";
import { SceneBoundary } from "@/components/three/SceneBoundary";
import { useSceneVisibility } from "@/hooks/useSceneVisibility";

const WarpField = dynamic(() => import("@/components/three/WarpField"), {
  ssr: false,
  loading: () => null,
});

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Scroll-pinned cinematic chapter. A tall track drives a particle warp whose
 * speed scales with scroll progress, while manifesto lines crossfade in the
 * sticky viewport — an Apple/Lusion-style dive between content acts.
 */
export function Cinematic() {
  const c = useContent().cinematic;
  const lines = c.lines;

  const trackRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const scene = useSceneVisibility<HTMLDivElement>();

  const [active, setActive] = useState(0);
  const [entered, setEntered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progress.current = v;
    setEntered(v > 0.04 && v < 0.97);
    const n = lines.length;
    const t = Math.min(0.9999, Math.max(0, (v - 0.1) / 0.78));
    setActive(Math.floor(t * n));
  });

  return (
    <section
      id="manifesto"
      ref={trackRef}
      aria-label="Manifesto"
      className="relative z-10 h-[320vh] bg-void"
    >
      <div
        ref={scene.ref}
        className="sticky top-0 flex h-screen items-center justify-center overflow-hidden"
      >
        {/* warp backdrop */}
        <div className="pointer-events-none absolute inset-0">
          <SceneBoundary>
            {scene.mounted && (
              <WarpField progress={progress} frameloop={scene.frameloop} />
            )}
          </SceneBoundary>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_50%,transparent_30%,#050505_88%)]" />

        {/* manifesto */}
        <div className="container-x relative flex min-h-screen flex-col items-center justify-center text-center">
          <motion.span
            className="eyebrow mb-8 block"
            initial={{ opacity: 0 }}
            animate={{ opacity: entered ? 1 : 0.25 }}
            transition={{ duration: 0.6 }}
          >
            {c.tag}
          </motion.span>

          <div className="relative flex h-[4.5em] items-center justify-center md:h-[3.2em]">
            <AnimatePresence mode="wait">
              <motion.h2
                key={active}
                className="text-giant text-gradient mx-auto max-w-4xl text-balance"
                initial={{ opacity: 0, y: 36, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -28, filter: "blur(8px)" }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                {lines[Math.min(active, lines.length - 1)]}
              </motion.h2>
            </AnimatePresence>
          </div>

          <motion.p
            className="mt-10 font-mono text-xs uppercase tracking-[0.3em] text-accent-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: active >= lines.length - 1 ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          >
            {c.outro}
          </motion.p>

          {/* progress rail */}
          <div className="mt-12 flex items-center gap-2">
            {lines.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i <= active ? "w-8 bg-accent" : "w-3 bg-white/15"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
