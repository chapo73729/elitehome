"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Wordmark } from "@/components/ui/Wordmark";
import { useLang } from "@/lib/lang";

const T = {
  en: { sub: "Executive Chauffeur · Geneva" },
  fr: { sub: "Chauffeur d’exception · Genève" },
} as const;

const EASE = [0.16, 1, 0.3, 1] as const;

type LenisLike = {
  stop?: () => void;
  start?: () => void;
  scrollTo: (y: number, o?: object) => void;
};

/** Locks the page from scrolling under the fixed opening overlay. `overflow:
 *  hidden` + blocking wheel/touchmove closes the input side, but two gaps
 *  remain: the brief pre-hydration window before this effect can even run,
 *  and Lenis's own eased momentum still carrying scrollY forward from
 *  whatever it read before `.stop()` took effect. A per-frame pin closes
 *  both: for as long as the lock is held, scrollY is snapped back to 0. */
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

/* « Black Motion » — the opening signature from the brief: a luminous line
   crosses the black screen and becomes the silhouette of a car, drawn in one
   champagne stroke; the wordmark settles beneath it; the veil lifts. */

/* One continuous saloon profile, rear bumper → roof → nose (viewBox 560×150). */
const CAR_PROFILE =
  "M18 118 C36 116 52 112 64 104 L96 76 C112 62 140 52 178 48 C232 41 300 42 342 52 C372 59 396 72 420 88 L446 104 C468 112 500 114 542 118";
/* Glasshouse line — drawn after the body. */
const CAR_GLASS =
  "M116 76 C132 64 158 56 190 53 L300 54 C324 56 344 62 360 72 L382 86";
/* Ground line between and around the wheels. */
const CAR_GROUND = "M10 118 H98 M206 118 H384 M492 118 H550";

export function Loader({ onComplete }: { onComplete: () => void }) {
  const t = T[useLang()];
  const [phase, setPhase] = useState<"draw" | "brand" | "done">("draw");
  const [hidden, setHidden] = useState(false);
  const [reduce, setReduce] = useState(false);
  // The route template animates transform/filter on a wrapper, which turns it
  // into the containing block for any position:fixed inside — a fixed veil
  // rendered in place would size itself to the whole document, not the
  // viewport. Portal the veil to <body> so it truly pins to the screen.
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

    // Repeat visit this session: reveal at once, don't replay every nav.
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
      // A brief brand beat, then reveal — no drawing choreography.
      setPhase("brand");
      at(() => setPhase("done"), 1100);
      at(() => {
        unlockScroll();
        setHidden(true);
        onComplete();
      }, 1900);
    } else {
      at(() => setPhase("brand"), 1900); // silhouette finished drawing
      at(() => setPhase("done"), 3300); // hold the mark, then lift the veil
      at(() => {
        unlockScroll();
        setHidden(true);
        onComplete();
      }, 4100);
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
          {/* the luminous line → car silhouette */}
          {!reduce && (
            <svg
              viewBox="0 0 560 150"
              className="w-[min(78vw,540px)]"
              fill="none"
              aria-hidden
            >
              <defs>
                <linearGradient id="bf-stroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#e4c88a" />
                  <stop offset="0.5" stopColor="#c6a15b" />
                  <stop offset="1" stopColor="#a8843f" />
                </linearGradient>
              </defs>
              <motion.path
                d={CAR_PROFILE}
                stroke="url(#bf-stroke)"
                strokeWidth={2.2}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0.9 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.35, ease: [0.65, 0, 0.35, 1] }}
              />
              <motion.path
                d={CAR_GLASS}
                stroke="rgba(199,203,209,0.55)"
                strokeWidth={1.4}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, delay: 0.9, ease: "easeOut" }}
              />
              <motion.path
                d={CAR_GROUND}
                stroke="rgba(246,243,236,0.35)"
                strokeWidth={1.4}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 1.1, ease: "easeOut" }}
              />
              {/* wheels — two fine platinum circles */}
              {[152, 438].map((cx) => (
                <motion.circle
                  key={cx}
                  cx={cx}
                  cy={118}
                  r={26}
                  stroke="rgba(199,203,209,0.6)"
                  strokeWidth={1.6}
                  initial={{ pathLength: 0, rotate: -90 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7, delay: 1.15, ease: "easeOut" }}
                />
              ))}
            </svg>
          )}

          {/* wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={phase === "brand" ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE }}
            className="mt-10 text-center"
          >
            <Wordmark className="mx-auto h-7 w-auto md:h-9" priority />
            <p className="mt-4 font-mono text-[0.66rem] uppercase tracking-[0.45em] text-fog">
              {t.sub}
            </p>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={phase === "brand" ? { scaleX: 1 } : {}}
              transition={{ duration: 1, ease: EASE, delay: 0.2 }}
              className="mx-auto mt-6 block h-px w-40 origin-center bg-gradient-to-r from-transparent via-accent to-transparent"
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
