"use client";

import { useEffect, useState, type RefObject } from "react";
import { useMotionValue, type MotionValue } from "framer-motion";

/**
 * Scroll-scrub progress for a tall pinned track: 0 when the track's top
 * reaches the viewport top, 1 when its bottom reaches the viewport bottom
 * (the classic "start start" → "end end" window), plus an SSR-safe `reduced`
 * flag from `prefers-reduced-motion`.
 *
 * The progress is computed from the live getBoundingClientRect on every
 * scroll/resize frame rather than framer-motion's `useScroll`, whose cached
 * target offsets proved unreliable here: they are measured once around mount
 * and can go stale while the loader, staggered scene mounts and Lenis are all
 * shifting layout, which intermittently froze the manifesto mid-scrub. A live
 * rect read (one per frame, only while the track is near the viewport) cannot
 * go stale by construction.
 *
 * `reduced` starts `false` (so SSR/first paint match the full experience),
 * then resolves on mount. Consumers use it to render a static final-frame
 * layout instead of scrubbing the progress MotionValue.
 */
export function useScrollScrub(
  target: RefObject<HTMLElement | null>
): { progress: MotionValue<number>; reduced: boolean } {
  const progress = useMotionValue(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const el = target.current;
    if (!el) return;

    let frame = 0;
    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // skip the rect math while the track is far off-screen
      if (r.bottom < -vh || r.top > vh * 2) return;
      const range = r.height - vh;
      if (range <= 0) return;
      const p = Math.min(1, Math.max(0, -r.top / range));
      if (p !== progress.get()) progress.set(p);
    };
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      mq.removeEventListener("change", onChange);
      if (frame) cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { progress, reduced };
}
