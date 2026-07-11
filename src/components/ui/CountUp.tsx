"use client";

import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "framer-motion";

/**
 * Count-up number, tabular-figured so the width never jitters. Fires once
 * the first time it scrolls into view (own IntersectionObserver + an
 * immediate rect check so it also runs if already on screen at mount).
 * Writes to a ref — no re-renders; reduced motion shows the final value.
 */
export function CountUp({
  to,
  duration = 1.4,
  className,
  pad = 2,
}: {
  to: number;
  duration?: number;
  className?: string;
  pad?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let fired = false;
    const fmt = (v: number) => String(Math.round(v)).padStart(pad, "0");

    const run = () => {
      if (fired) return;
      fired = true;
      if (reduced) {
        el.textContent = fmt(to);
        return;
      }
      animate(0, to, {
        duration,
        ease: [0.23, 1, 0.32, 1],
        onUpdate: (v) => {
          el.textContent = fmt(v);
        },
      });
    };

    // already visible? go now
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      run();
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration, pad, reduced]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {String(0).padStart(pad, "0")}
    </span>
  );
}
