"use client";

import { useEffect, useState, type RefObject } from "react";
import { useScroll, type MotionValue } from "framer-motion";

/**
 * Wraps framer-motion's `useScroll` for a target ref and adds an SSR-safe
 * `reduced` flag from `prefers-reduced-motion`.
 *
 * `reduced` starts `false` (so SSR/first paint match the full experience),
 * then resolves on mount. Consumers use it to render a static final-frame
 * layout instead of scrubbing the progress MotionValue.
 */
export function useScrollScrub(
  target: RefObject<HTMLElement | null>,
  offset: ["start start", "end end"] | [string, string] = [
    "start start",
    "end end",
  ]
): { progress: MotionValue<number>; reduced: boolean } {
  const { scrollYProgress } = useScroll({
    target: target as RefObject<HTMLElement>,
    // framer-motion's typing for offset is permissive at runtime
    offset: offset as never,
  });

  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return { progress: scrollYProgress, reduced };
}
