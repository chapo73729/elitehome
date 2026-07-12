"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Wordmark } from "@/components/ui/Wordmark";
import { useLang } from "@/lib/lang";

const T = {
  fr: { sub: "Chauffeur d’exception · Genève" },
  en: { sub: "Executive Chauffeur · Geneva" },
} as const;

const EASE = [0.16, 1, 0.3, 1] as const;

type LenisLike = {
  stop?: () => void;
  start?: () => void;
  scrollTo: (y: number, o?: object) => void;
};

/** Locks the page from scrolling under the fixed opening overlay (input
 *  block + per-frame pin — see the note on Lenis momentum). */
function lockScroll() {
  const html = document.documentElement;
  const prevHtml = html.style.overflow;
  const prevBody = document.body.style.overflow;
  html.style.overflow = "hidden";
  document.body.style.overflow = "hidden";

  const block = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
  };
  window.addEventListener("wheel", block, { passive: false, capture: true });
  window.addEventListener("touchmove", block, { passive: false, capture: true });

  (window as { __lenis?: LenisLike }).__lenis?.stop?.();

  let pinned = true;
  const pin = () => {
    if (!pinned) return;
    const l = (window as { __lenis?: LenisLike }).__lenis;
    l?.stop?.();
    l?.scrollTo?.(0, { immediate: true });
    if (window.scrollY !== 0) window.scrollTo(0, 0);
    requestAnimationFrame(pin);
  };
  requestAnimationFrame(pin);

  return () => {
    pinned = false;
    html.style.overflow = prevHtml;
    document.body.style.overflow = prevBody;
    window.removeEventListener("wheel", block, { capture: true });
    window.removeEventListener("touchmove", block, { capture: true });
    const l = (window as { __lenis?: LenisLike }).__lenis;
    l?.start?.();
    window.scrollTo(0, 0);
    l?.scrollTo(0, { immediate: true });
  };
}

/**
 * Ouverture — the official BLACKFIRST wordmark, nothing else. The logotype
 * reveals itself left to right behind a passing white light, the byline
 * settles beneath it, a fine line draws — then the veil lifts.
 */
export function Loader({ onComplete }: { onComplete: () => void }) {
  const t = T[useLang()];
  const [phase, setPhase] = useState<"reveal" | "hold" | "done">("reveal");
  const [hidden, setHidden] = useState(false);
  const [reduce, setReduce] = useState(false);
  // The route template animates transform/filter on a wrapper, which turns it
  // into the containing block for any position:fixed inside. Portal the veil
  // to <body> so it truly pins to the screen.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    let reduced = false;
    let seen: string | null = null;
    try {
      reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      seen = sessionStorage.getItem("blackfirst-booted");
    } catch {
      /* storage/media blocked — treat as a fresh, full-motion visit */
    }
    setReduce(reduced);

    if (seen) {
      setHidden(true);
      onComplete();
      return;
    }
    try {
      sessionStorage.setItem("blackfirst-booted", "1");
    } catch {
      /* non-fatal */
    }

    const unlockScroll = lockScroll();
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));

    if (reduced) {
      setPhase("hold");
      at(() => setPhase("done"), 1200);
      at(() => {
        unlockScroll();
        setHidden(true);
        onComplete();
      }, 2000);
    } else {
      at(() => setPhase("hold"), 1750); // logo révélé
      at(() => setPhase("done"), 3050); // on tient le regard, puis on lève
      at(() => {
        unlockScroll();
        setHidden(true);
        onComplete();
      }, 3850);
    }

    return () => {
      timers.forEach(clearTimeout);
      unlockScroll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (hidden || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      {phase !== "done" ? (
        <motion.div
          key="veil"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-void"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.75, ease: EASE }}
        >
          {/* soupçon de lumière chaude derrière le logo */}
          <div
            aria-hidden
            className="absolute inset-0 [background:radial-gradient(46%_30%_at_50%_50%,rgba(255,255,255,0.06),transparent_70%)]"
          />

          {/* le logotype officiel, révélé de gauche à droite */}
          <div className="relative w-[min(82vw,620px)]">
            <motion.div
              initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 100% 0 0)" }}
              animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0% 0 0)" }}
              transition={
                reduce
                  ? { duration: 0.8 }
                  : { duration: 1.45, ease: [0.65, 0, 0.35, 1], delay: 0.15 }
              }
            >
              <Wordmark className="w-full" priority />
            </motion.div>
            {/* balayage de lumière qui accompagne la révélation */}
            {!reduce && (
              <motion.span
                aria-hidden
                initial={{ left: "-12%" }}
                animate={{ left: "104%" }}
                transition={{ duration: 1.45, ease: [0.65, 0, 0.35, 1], delay: 0.15 }}
                className="absolute top-1/2 h-[300%] w-16 -translate-y-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.38),transparent)] blur-md"
              />
            )}
          </div>

          {/* signature */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={phase === "hold" ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE }}
            className="mt-9 text-center"
          >
            <p className="font-mono text-[0.66rem] uppercase tracking-[0.45em] text-fog">
              {t.sub}
            </p>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={phase === "hold" ? { scaleX: 1 } : {}}
              transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
              className="mx-auto mt-6 block h-px w-40 origin-center bg-gradient-to-r from-transparent via-accent to-transparent"
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
