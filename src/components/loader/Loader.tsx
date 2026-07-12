"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/lang";

const T = {
  en: {
    wordmark: "BLACKFIRST® · Executive Chauffeur · Geneva",
    core: "ignition",
    lattice: "route",
    interface: "cabin",
  },
  fr: {
    wordmark: "BLACKFIRST® · Chauffeur d’exception · Genève",
    core: "démarrage",
    lattice: "trajet",
    interface: "cabine",
  },
} as const;

const EASE = [0.16, 1, 0.3, 1] as const;

/** « Compile » corner-bracket paths (mirrors ui/Compile.tsx). */
const CORNERS = [
  { d: "M17 1L1 1L1 17", cls: "left-5 top-5 md:left-8 md:top-8" },
  { d: "M7 1L23 1L23 17", cls: "right-5 top-5 md:right-8 md:top-8" },
  { d: "M1 7L1 23L17 23", cls: "bottom-5 left-5 md:bottom-8 md:left-8" },
  { d: "M23 7L23 23L7 23", cls: "bottom-5 right-5 md:bottom-8 md:right-8" },
] as const;

type Phase = "ignite" | "form" | "hold" | "explode" | "done";

interface Particle {
  x: number;
  y: number;
  hx: number;
  hy: number;
  ox: number;
  oy: number;
  ex: number;
  ey: number;
  size: number;
  hue: number;
}

const T_IGNITE = 650;
const T_FORM = 1500;
const T_HOLD = 650;
const T_EXPLODE = 900;

type LenisLike = {
  stop?: () => void;
  start?: () => void;
  scrollTo: (y: number, o?: object) => void;
};

/** Locks the page from scrolling under the fixed boot overlay. `overflow:
 *  hidden` + blocking wheel/touchmove closes the input side, but two gaps
 *  remain: the brief pre-hydration window before this effect can even run,
 *  and Lenis's own eased momentum still carrying scrollY forward from
 *  whatever it read before `.stop()` took effect (Lenis may not exist yet
 *  the instant this runs, since SmoothScroll mounts as a sibling). A
 *  per-frame pin closes both: for as long as the lock is held, scrollY is
 *  snapped back to 0 every frame no matter what moved it. */
function lockScroll() {
  const html = document.documentElement;
  const prevHtml = html.style.overflow;
  const prevBody = document.body.style.overflow;
  html.style.overflow = "hidden";
  document.body.style.overflow = "hidden";

  // preventDefault alone doesn't stop Lenis: it reads the event's deltaY
  // independent of the default action, so the capture-phase listener must
  // also stopPropagation to keep the event from ever reaching Lenis's own
  // (bubble-phase) wheel handler.
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
    // stop() alone isn't enough: Lenis keeps its own eased "target" scroll
    // internally and drives window.scrollTo() from THAT each of its own
    // raf ticks, so a bare native reset gets overwritten again next frame.
    // Re-target Lenis to 0 every frame too, so there's nothing left for it
    // to ease back toward.
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
    // belt-and-suspenders: guarantee the reveal always lands at the top
    window.scrollTo(0, 0);
    l?.scrollTo(0, { immediate: true });
  };
}

/**
 * Cinematic boot sequence:
 *   ignite  — a light point blooms at centre
 *   form    — particles converge into the BLACKFIRST wordmark
 *   hold    — the logo breathes
 *   explode — particles burst outward, we pass through
 *   done    — overlay wipes away to reveal the hero
 */
export function Loader({ onComplete }: { onComplete: () => void }) {
  const t = T[useLang()];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("ignite");
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let reduce = false;
    let seen: string | null = null;
    try {
      reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      seen = sessionStorage.getItem("blackfirst-booted");
    } catch {
      /* storage/media blocked — treat as a fresh, full-motion visit */
    }

    // Repeat visit this session: reveal at once, don't re-boot every nav.
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
    let revealTimer: ReturnType<typeof setTimeout>;
    const reveal = () => {
      setPhase("done");
      unlockScroll();
      revealTimer = setTimeout(() => {
        setHidden(true);
        onComplete();
      }, 900);
    };

    // Reduced motion: a brief brand beat, then reveal — no particle storm.
    if (reduce) {
      setPhase("hold");
      setProgress(100);
      const to = setTimeout(reveal, 900);
      return () => {
        clearTimeout(to);
        clearTimeout(revealTimer);
        unlockScroll();
      };
    }

    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext("2d", { alpha: true }) : null;
    // A null canvas/context must never freeze the boot screen.
    if (!canvas || !ctx) {
      reveal();
      return () => {
        clearTimeout(revealTimer);
        unlockScroll();
      };
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let W = window.innerWidth;
    let H = window.innerHeight;
    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // --- sample target points from the wordmark ---
    const sampleText = (): { x: number; y: number }[] => {
      const off = document.createElement("canvas");
      const octx = off.getContext("2d")!;
      off.width = W;
      off.height = H;
      const fontSize = Math.min(W * 0.115, 150);
      octx.fillStyle = "#fff";
      octx.font = `700 ${fontSize}px "Geist", system-ui, sans-serif`;
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.fillText("BLACKFIRST", W / 2, H / 2);

      const img = octx.getImageData(0, 0, W, H).data;
      const pts: { x: number; y: number }[] = [];
      const gap = W < 640 ? 5 : 6;
      for (let y = 0; y < H; y += gap) {
        for (let x = 0; x < W; x += gap) {
          if (img[(y * W + x) * 4 + 3] > 128) {
            pts.push({ x, y });
          }
        }
      }
      return pts;
    };

    const targets = sampleText();
    const count = targets.length;
    const cx = W / 2;
    const cy = H / 2;

    const particles: Particle[] = new Array(count).fill(0).map((_, i) => {
      const tt = targets[i];
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * 24;
      const ea = Math.atan2(tt.y - cy, tt.x - cx) + (Math.random() - 0.5) * 0.6;
      const espeed = 600 + Math.random() * 900;
      return {
        x: cx + Math.cos(a) * r,
        y: cy + Math.sin(a) * r,
        hx: tt.x,
        hy: tt.y,
        ox: cx + Math.cos(a) * r,
        oy: cy + Math.sin(a) * r,
        ex: Math.cos(ea) * espeed,
        ey: Math.sin(ea) * espeed,
        size: Math.random() * 1.4 + 0.6,
        hue: 210 + Math.random() * 60,
      };
    });

    window.addEventListener("resize", resize);

    const start = performance.now();
    let raf = 0;
    let localPhase: Phase = "ignite";

    const easeOutExpo = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
    const easeInExpo = (x: number) => (x <= 0 ? 0 : Math.pow(2, 10 * x - 10));

    const frame = (now: number) => {
      const elapsed = now - start;
      ctx.clearRect(0, 0, W, H);

      const total = T_IGNITE + T_FORM + T_HOLD + T_EXPLODE;
      setProgress(Math.min(100, Math.round((elapsed / total) * 100)));

      // ---------- IGNITE ----------
      if (elapsed < T_IGNITE) {
        if (localPhase !== "ignite") setPhase((localPhase = "ignite"));
        const p = easeOutExpo(elapsed / T_IGNITE);
        const radius = p * 90;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(1, radius));
        g.addColorStop(0, `rgba(150,185,255,${0.9 * p})`);
        g.addColorStop(0.4, `rgba(79,140,255,${0.5 * p})`);
        g.addColorStop(1, "rgba(79,140,255,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = `rgba(255,255,255,${p})`;
        ctx.beginPath();
        ctx.arc(cx, cy, 2 + p * 2, 0, Math.PI * 2);
        ctx.fill();
        raf = requestAnimationFrame(safeFrame);
        return;
      }

      // ---------- FORM ----------
      if (elapsed < T_IGNITE + T_FORM) {
        if (localPhase !== "form") setPhase((localPhase = "form"));
        const p = easeOutExpo((elapsed - T_IGNITE) / T_FORM);
        ctx.globalCompositeOperation = "lighter";
        for (let i = 0; i < count; i++) {
          const pt = particles[i];
          const stagger = (i % 60) / 600;
          const lp = Math.max(0, Math.min(1, (p - stagger) / (1 - stagger)));
          pt.x = pt.ox + (pt.hx - pt.ox) * lp;
          pt.y = pt.oy + (pt.hy - pt.oy) * lp;
          const alpha = 0.35 + 0.65 * lp;
          ctx.fillStyle = `hsla(${pt.hue}, 90%, ${70 + lp * 20}%, ${alpha})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, (pt.size + 0.5) * 0.7, 0, 6.2831853);
          ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";
        raf = requestAnimationFrame(safeFrame);
        return;
      }

      // ---------- HOLD (breathing) ----------
      if (elapsed < T_IGNITE + T_FORM + T_HOLD) {
        if (localPhase !== "hold") setPhase((localPhase = "hold"));
        const breathe = Math.sin(elapsed / 120) * 0.6;
        ctx.globalCompositeOperation = "lighter";
        for (let i = 0; i < count; i++) {
          const pt = particles[i];
          const jx = pt.hx + (Math.random() - 0.5) * 0.5 + breathe;
          const jy = pt.hy + (Math.random() - 0.5) * 0.5;
          ctx.fillStyle = `hsla(${pt.hue}, 95%, 86%, 0.95)`;
          ctx.beginPath();
          ctx.arc(jx, jy, (pt.size + 0.6) * 0.7, 0, 6.2831853);
          ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";
        raf = requestAnimationFrame(safeFrame);
        return;
      }

      // ---------- EXPLODE ----------
      if (elapsed < T_IGNITE + T_FORM + T_HOLD + T_EXPLODE) {
        if (localPhase !== "explode") setPhase((localPhase = "explode"));
        const p = easeInExpo((elapsed - T_IGNITE - T_FORM - T_HOLD) / T_EXPLODE);
        ctx.globalCompositeOperation = "lighter";
        for (let i = 0; i < count; i++) {
          const pt = particles[i];
          const x = pt.hx + pt.ex * p;
          const y = pt.hy + pt.ey * p;
          const alpha = 1 - p;
          const trail = pt.size + p * 3;
          ctx.fillStyle = `hsla(${pt.hue}, 95%, 85%, ${alpha})`;
          ctx.fillRect(x, y, trail, trail);
        }
        ctx.globalCompositeOperation = "source-over";
        raf = requestAnimationFrame(safeFrame);
        return;
      }

      // ---------- DONE ----------
      finish();
    };

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      setProgress(100);
      reveal();
    };

    // resilient loop: a thrown frame can never freeze the boot screen
    const safeFrame = (now: number) => {
      try {
        frame(now);
      } catch {
        finish();
      }
    };

    raf = requestAnimationFrame(safeFrame);
    // hard safety net — guarantee the experience reveals no matter what
    const safety = setTimeout(finish, T_IGNITE + T_FORM + T_HOLD + T_EXPLODE + 1200);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(safety);
      clearTimeout(revealTimer);
      window.removeEventListener("resize", resize);
      unlockScroll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // compile annotation vocabulary, phase by phase
  const compileWord =
    phase === "ignite" ? t.core : phase === "form" ? t.lattice : t.interface;
  // "ok" lands once the lattice holds; the chrome fades as we pass through
  const compiled = phase === "hold" || phase === "explode" || phase === "done";
  const fading = phase === "explode" || phase === "done";

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-void"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          animate={
            phase === "done"
              ? { clipPath: "inset(0 0 100% 0)" }
              : { clipPath: "inset(0 0 0% 0)" }
          }
          transition={{ duration: 0.9, ease: [0.83, 0, 0.17, 1] }}
        >
          <canvas ref={canvasRef} className="absolute inset-0" />

          {/* « Compile » corner brackets — draw on during ignite, rest faint */}
          {CORNERS.map((cn, i) => (
            <svg
              key={cn.cls}
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              className={`pointer-events-none absolute h-5 w-5 select-none text-accent ${cn.cls}`}
            >
              <motion.path
                d={cn.d}
                stroke="currentColor"
                strokeWidth={1.5}
                initial={{ pathLength: 0, opacity: 0.9 }}
                animate={{ pathLength: 1, opacity: fading ? 0 : 0.3 }}
                transition={{
                  pathLength: {
                    delay: 0.05 + i * 0.07,
                    duration: 0.5,
                    ease: EASE,
                  },
                  opacity: fading
                    ? { duration: 0.4, ease: "easeOut" }
                    : { delay: 0.7, duration: 0.45, ease: "easeOut" },
                }}
              />
            </svg>
          ))}

          {/* progress + compile-annotation readout */}
          <motion.div
            className="absolute bottom-10 left-0 right-0 flex items-end justify-between px-6 md:px-14 font-mono text-[0.7rem] tracking-[0.3em] text-fog"
            animate={{ opacity: fading ? 0 : 1 }}
            transition={{ duration: 0.4 }}
          >
            <span className="uppercase">{t.wordmark}</span>
            <span className="hidden items-baseline normal-case tracking-wider text-accent/80 sm:inline-flex">
              <motion.span
                key={compileWord}
                className="inline-block whitespace-nowrap"
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: 0.45, ease: "linear" }}
              >
                {`// compile: ${compileWord} …`}
              </motion.span>
              <motion.span
                className="inline-block"
                initial={{ opacity: 0 }}
                animate={{ opacity: compiled ? 1 : 0 }}
                transition={{ duration: 0.2, ease: "linear" }}
              >
                &nbsp;ok
              </motion.span>
            </span>
            <span className="text-chalk tabular-nums">
              {String(progress).padStart(3, "0")}
            </span>
          </motion.div>

          <motion.div
            className="absolute left-0 right-0 top-[58%] mx-auto h-px max-w-[min(80vw,640px)] origin-left bg-gradient-to-r from-transparent via-accent/50 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress / 100 }}
            transition={{ ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
