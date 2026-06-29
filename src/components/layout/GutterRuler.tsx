"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

/** Home chapters, in document order. Index doubles as the readout number. */
const CHAPTERS = ["hero", "manifesto", "core", "network", "services", "contact"] as const;
const LAST = CHAPTERS.length - 1; // "/ 04"-style denominator over chapters 00..05

/**
 * A fixed, hairline measure pinned to the left gutter. The filled azure
 * segment tracks overall page scroll progress; a live mono readout names the
 * nearest chapter in view and a faint coordinate mark anchors the studio.
 *
 * Subtle by design — desktop only, sits below the navbar, never intercepts
 * pointer events. Reduced-motion renders the segment statically.
 */
export function GutterRuler() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const fill = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 30,
    mass: 0.3,
  });
  const scaleY = reduced ? scrollYProgress : fill;

  const [active, setActive] = useState(0);

  useEffect(() => {
    const els = CHAPTERS.map((id) => document.getElementById(id)).filter(
      Boolean
    ) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = CHAPTERS.indexOf(e.target.id as (typeof CHAPTERS)[number]);
            if (i >= 0) setActive(i);
          }
        });
      },
      { rootMargin: "-48% 0px -48% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-6 top-1/2 z-[100] hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex"
    >
      {/* chapter readout */}
      <span className="font-mono text-[0.6rem] tabular-nums tracking-[0.3em] text-chalk/80">
        {pad(active)}
        <span className="text-fog/50"> / {pad(LAST)}</span>
      </span>

      {/* hairline measure with azure fill */}
      <div className="relative h-[42vh] w-px overflow-hidden bg-white/10">
        <motion.div
          style={{ scaleY, transformOrigin: "top" }}
          className="absolute inset-0 origin-top bg-[var(--color-accent)]"
        />
      </div>

      {/* coordinate mark */}
      <span className="font-mono text-[0.55rem] leading-relaxed tracking-[0.18em] text-fog/45 [writing-mode:vertical-rl]">
        N 50.07° · E 14.43°
      </span>
    </div>
  );
}
