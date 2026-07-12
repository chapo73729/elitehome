"use client";

import { motion } from "framer-motion";
import { useContent } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { NightDrive } from "@/components/visuals/NightDrive";
import { HeroHud } from "./HeroHud";
import { scrollToTarget } from "@/components/layout/SmoothScroll";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Arrival. The Geneva night-drive backdrop, the wordmark at hero scale, the
 * positioning line and the two primary calls to action — reserve, or ask for a
 * quote. The Executive HUD overlays the scene.
 */
export function Hero({ ready = true }: { ready?: boolean }) {
  const c = useContent();
  const h = c.hero;

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      <NightDrive />
      <HeroHud ready={ready} />

      <div className="container-x relative z-10 pb-24 pt-32">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
          className="eyebrow"
        >
          {h.eyebrow}
        </motion.p>

        {/* wordmark at hero scale — BLACK / FIRST stacked */}
        <h1 className="mt-6 leading-[0.86]">
          <span className="sr-only">{h.headline}</span>
          {h.lines.map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={ready ? { y: "0%" } : {}}
                transition={{ duration: 1.1, ease: EASE, delay: 0.4 + i * 0.12 }}
                className="text-mega block font-display font-semibold tracking-[-0.03em] text-chalk"
              >
                {line}
                {i === h.lines.length - 1 && <span className="text-accent">®</span>}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE, delay: 0.8 }}
          className="text-lead mt-8 max-w-xl"
        >
          {h.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE, delay: 0.95 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Button href="/booking">{h.book}</Button>
          <Button href="/contact" variant="ghost">
            {h.quote}
          </Button>
        </motion.div>
      </div>

      {/* scroll hint */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1.4 }}
        onClick={() => scrollToTarget("#manifesto")}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 font-mono text-[0.62rem] tracking-[0.35em] text-fog"
        aria-label={h.scroll}
      >
        <span className="hidden sm:block">{h.scrollHint}</span>
        <span className="relative block h-9 w-px overflow-hidden bg-white/15">
          <motion.span
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-accent"
          />
        </span>
      </motion.button>
    </section>
  );
}
