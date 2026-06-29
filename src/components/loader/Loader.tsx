"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/lang";

const T = {
  en: {
    wordmark: "ARDLABS® · Digital Engineering Studio",
    initializing: "Initializing core",
    assembling: "Assembling lattice",
    calibrating: "Calibrating",
    entering: "Entering",
  },
  fr: {
    wordmark: "ARDLABS® · Studio d’ingénierie numérique",
    initializing: "Initialisation du cœur",
    assembling: "Assemblage de la trame",
    calibrating: "Calibrage",
    entering: "Entrée",
  },
} as const;

type Phase = "ignite" | "form" | "hold" | "explode" | "done";

interface Particle {
  x: number;
  y: number;
  // home (target) position forming the logo
  hx: number;
  hy: number;
  // origin (random, near centre)
  ox: number;
  oy: number;
  // explosion vector
  ex: number;
  ey: number;
  size: number;
  hue: number;
}

/**
 * Cinematic boot sequence:
 *   ignite  — a single light point blooms at centre
 *   form    — thousands of particles converge into the ARDLABS wordmark
 *   hold    — the logo breathes
 *   explode — particles burst outward, camera "passes through"
 *   done    — overlay wipes away to reveal the hero
 */
export function Loader({ onComplete }: { onComplete: () => void }) {
  const t = T[useLang()];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("ignite");
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Respect reduced motion / repeat visits: short-circuit.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem("ardlabs-booted");
    if (reduce || seen) {
      setHidden(true);
      onComplete();
      return;
    }
    sessionStorage.setItem("ardlabs-booted", "1");

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
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
      const fontSize = Math.min(W * 0.16, 220);
      octx.fillStyle = "#fff";
      octx.font = `700 ${fontSize}px "Geist", system-ui, sans-serif`;
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.fillText("ARDLABS", W / 2, H / 2);

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
      const t = targets[i];
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * 24;
      const ea = Math.atan2(t.y - cy, t.x - cx) + (Math.random() - 0.5) * 0.6;
      const espeed = 600 + Math.random() * 900;
      return {
        x: cx + Math.cos(a) * r,
        y: cy + Math.sin(a) * r,
        hx: t.x,
        hy: t.y,
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
    const T_IGNITE = 650;
    const T_FORM = 1500;
    const T_HOLD = 650;
    const T_EXPLODE = 900;

    let raf = 0;
    let localPhase: Phase = "ignite";

    const easeOutExpo = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
    const easeInExpo = (x: number) => (x <= 0 ? 0 : Math.pow(2, 10 * x - 10));

    const frame = (now: number) => {
      const elapsed = now - start;
      ctx.clearRect(0, 0, W, H);

      // total progress for the counter
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
          // staggered arrival for an "intelligent assembly" feel
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
    let revealTimer: ReturnType<typeof setTimeout>;
    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      setPhase((localPhase = "done"));
      setProgress(100);
      // allow the wipe transition to play
      revealTimer = setTimeout(() => {
        setHidden(true);
        onComplete();
      }, 900);
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
      clearTimeout(revealTimer!);
      window.removeEventListener("resize", resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

          {/* progress + status readout */}
          <motion.div
            className="absolute bottom-10 left-0 right-0 flex items-end justify-between px-6 md:px-14 font-mono text-[0.7rem] tracking-[0.3em] text-fog"
            animate={{ opacity: phase === "explode" || phase === "done" ? 0 : 1 }}
            transition={{ duration: 0.4 }}
          >
            <span className="uppercase">{t.wordmark}</span>
            <span className="hidden text-accent-2/80 uppercase sm:inline">
              {phase === "ignite"
                ? t.initializing
                : phase === "form"
                  ? t.assembling
                  : phase === "hold"
                    ? t.calibrating
                    : t.entering}
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
