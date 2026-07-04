"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { stripLocale } from "@/lib/i18n";

const EASE = [0.16, 1, 0.3, 1] as const;
/** How long the void holds fully covering while the new route paints. */
const HOLD_MS = 250;
/** Sweep-away duration — total choreography ≈ 250 + 550 = 800ms (≤ 900ms). */
const REVEAL_S = 0.55;

/** useLayoutEffect on the client (cover before the new route's first paint),
 *  useEffect during SSR to avoid the hydration warning. */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Phase = "idle" | "cover" | "reveal";

/**
 * « Compile » page transition — an overlay cover in the site's blueprint
 * language. App Router swaps content on frame 1 of a navigation, so instead
 * of faking an exit animation we play the robust "reveal" variant: on
 * pathname change a full-screen void overlay appears INSTANTLY (already
 * fully covering the freshly swapped route), holds ~250ms while the page
 * paints — thin azure leading edge + mono `// compile: route … ok`
 * annotation — then sweeps up and away (translateY 0 → -100%) to reveal
 * the new page.
 *
 * Skipped entirely on first mount and under prefers-reduced-motion
 * (instant swap). While covered the window is snapped to top (unless a
 * #hash is present). Sits at z-[150]: above all content, below the
 * first-visit Loader (z-[200]).
 */
export function PageTransition() {
  const pathname = usePathname();
  const reduce = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<Phase>("idle");
  const prevPath = useRef<string | null>(null);
  // freeze the annotation label for the whole sweep
  const [label, setLabel] = useState("/");

  useIsomorphicLayoutEffect(() => {
    // first mount — record and do nothing (the Loader owns first arrival)
    if (prevPath.current === null) {
      prevPath.current = pathname;
      return;
    }
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;

    // snap to top instantly while covered — through Lenis when present so
    // its internal scroll position stays in sync — unless targeting a #hash
    if (!window.location.hash) {
      const lenis = (
        window as unknown as {
          __lenis?: { scrollTo: (t: number, o: object) => void } | null;
        }
      ).__lenis;
      lenis?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    }

    if (reduce) return; // instant swap, no choreography

    const { rest } = stripLocale(pathname);
    setLabel(rest === "/" ? "/index" : rest);
    setPhase("cover"); // overlay appears instantly, fully covering
    const t = window.setTimeout(() => setPhase("reveal"), HOLD_MS);
    return () => window.clearTimeout(t);
  }, [pathname, reduce]);

  if (phase === "idle") return null;

  return (
    <motion.div
      aria-hidden
      className={
        "fixed inset-0 z-[150] select-none bg-void " +
        (phase === "cover" ? "pointer-events-auto" : "pointer-events-none")
      }
      initial={{ y: "0%" }}
      animate={phase === "reveal" ? { y: "-101%" } : { y: "0%" }}
      transition={
        phase === "reveal"
          ? { duration: REVEAL_S, ease: EASE }
          : { duration: 0 }
      }
      onAnimationComplete={() => {
        if (phase === "reveal") setPhase("idle");
      }}
    >
      {/* thin azure leading edge — the line that passes over the content
          as the cover sweeps up */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
      {/* mono annotation, same register as the Loader's bottom strip */}
      <div className="absolute inset-x-0 bottom-10 flex items-end justify-between px-6 font-mono text-[0.7rem] tracking-[0.3em] text-fog md:px-14">
        <span>{`// compile: route ${label} … ok`}</span>
        <span className="hidden uppercase text-accent-2/80 sm:inline">
          ARDLABS®
        </span>
      </div>
    </motion.div>
  );
}
