"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * Connective tissue between sections — a short vertical thread with a
 * travelling node and a soft accent glow that bleeds across the seam, so
 * one section melts into the next instead of hard-cutting on black. The
 * thread draws itself as the seam crosses the viewport (scroll-linked),
 * the node rides its tip, and the whole thing is decorative + inert.
 *
 * Place between two <section>s in the homepage flow. Height is small; it
 * overlaps the seam via negative margins so it reads as one continuous line.
 */
export function Seam() {
  const ref = useRef<HTMLDivElement>(null);
  // useReducedMotion is null on the server but resolves on the client's first
  // paint; returning a different element for reduced users would then mismatch
  // the server HTML. Defer the branch until after mount so hydration is stable.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const prefersReduce = useReducedMotion();
  const reduced = mounted && prefersReduce;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // the thread draws from 0 → full as the seam passes through centre
  const draw = useTransform(scrollYProgress, [0.15, 0.5], [0, 1]);
  const glow = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 0.5, 0]);
  const nodeY = useTransform(draw, (v) => `${v * 100}%`);

  if (reduced) return <div aria-hidden className="relative z-[5] h-0" />;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none relative z-[5] -my-16 flex h-32 items-center justify-center"
    >
      {/* accent glow bleeding across the cut */}
      <motion.div
        style={{ opacity: glow }}
        className="absolute left-1/2 top-1/2 h-40 w-[36rem] max-w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--color-accent)_22%,transparent),transparent)] blur-2xl"
      />
      {/* the thread */}
      <div className="relative h-full w-px overflow-hidden bg-white/[0.06]">
        <motion.div
          style={{ scaleY: draw, transformOrigin: "top" }}
          className="absolute inset-0 origin-top bg-gradient-to-b from-transparent via-[var(--color-accent)] to-[var(--color-accent)]"
        />
        {/* travelling node at the tip */}
        <motion.span
          style={{ top: nodeY }}
          className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)] shadow-[0_0_12px_2px_color-mix(in_oklab,var(--color-accent)_70%,transparent)]"
        />
      </div>
    </div>
  );
}
