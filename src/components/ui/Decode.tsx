"use client";

import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#0123456789";

/**
 * Scramble-decode text: the string appears at its final length immediately
 * (zero layout shift) with unresolved characters cycling through a glyph
 * set, resolving left to right. One rAF loop, one-shot on first view,
 * textContent writes only — no re-renders. Mono/uppercase strings only;
 * skipped entirely under reduced motion.
 */
export function Decode({
  text,
  className,
  as: Tag = "span",
  duration = 900,
}: {
  text: string;
  className?: string;
  as?: "span" | "p";
  duration?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref as React.RefObject<Element>, {
    once: true,
    margin: "-10% 0px",
  });

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduced) return;
    let raf = 0;
    const start = performance.now();
    const n = text.length;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // resolve front sweeps left→right slightly ahead of the clock so the
      // reader only ever chases already-legible characters
      const solved = Math.floor(t * t * (2 - t) * n + t * 2);
      let out = "";
      for (let i = 0; i < n; i++) {
        const ch = text[i];
        out +=
          i < solved || ch === " " || ch === "·"
            ? ch
            : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
      if (t < 1) raf = requestAnimationFrame(tick);
      else el.textContent = text;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, text, duration]);

  return (
    <Tag ref={ref as React.RefObject<HTMLSpanElement & HTMLParagraphElement>} className={className} aria-label={text}>
      {text}
    </Tag>
  );
}
