"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/lang";
import { audio } from "@/lib/audio";

const T = {
  en: {
    wordmark: "ARDLABS® · Digital Engineering Studio",
    core: "core",
    lattice: "lattice",
    interface: "interface",
    gateEyebrow: "the studio awaits",
    gateCta: "Enter ARDLABS",
    gateHint: "Sound is part of the experience — best with the volume on",
  },
  fr: {
    wordmark: "ARDLABS® · Studio d’ingénierie numérique",
    core: "cœur",
    lattice: "trame",
    interface: "interface",
    gateEyebrow: "le studio vous attend",
    gateCta: "Découvrez ARDLABS",
    gateHint: "Le son fait partie de l’expérience — activez le volume",
  },
} as const;

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * « Compile » visual vocabulary — the same corner-bracket paths as
 * ui/Compile.tsx. Each path starts at a leg tip and runs through the corner,
 * so the draw-on reads as the bracket snapping into the corner.
 */
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
  const [gateReady, setGateReady] = useState(false);

  /**
   * The visitor crosses the threshold. This runs INSIDE the click/keydown
   * gesture, so audio.enable() is a guaranteed user activation — the one
   * moment every browser (iOS included) will honour to unlock sound. From
   * here the bed is primed and the wipe reveals the site.
   */
  const enterSite = () => {
    audio.enable();
    setGateReady(false);
    setPhase("done"); // triggers the clip-path wipe
    window.setTimeout(() => {
      setHidden(true);
      onComplete();
    }, 900);
  };

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem("ardlabs-booted");

    // Repeat visit this session: don't re-gate every navigation — reveal at
    // once. (Any prior sound preference resumes on the first interaction via
    // audio.init's gesture listener.)
    if (seen) {
      setHidden(true);
      onComplete();
      return;
    }
    sessionStorage.setItem("ardlabs-booted", "1");

    // Reduced motion: skip the particle sequence but still present the entry
    // gate, so a keyboard/click can unlock sound on a calm, static stage.
    if (reduce) {
      setPhase("hold");
      setProgress(100);
      setGateReady(true);
      return;
    }

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
    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      // The particles have passed through; hold the stage and raise the
      // entry gate. We wait here for the visitor's click — that gesture is
      // what unlocks audio everywhere — rather than auto-revealing.
      setPhase((localPhase = "hold"));
      setProgress(100);
      setGateReady(true);
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
      window.removeEventListener("resize", resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // compile annotation vocabulary, phase by phase
  const compileWord =
    phase === "ignite" ? t.core : phase === "form" ? t.lattice : t.interface;
  // "ok" lands once the lattice holds; the chrome fades as we pass through
  const compiled = phase === "hold" || phase === "explode" || phase === "done";
  const fading = phase === "explode" || phase === "done";
  // the boot readout gives way to the entry gate
  const readoutHidden = fading || gateReady;

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
                animate={{
                  pathLength: 1,
                  opacity: fading ? 0 : gateReady ? 0.45 : 0.3,
                }}
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
            animate={{ opacity: readoutHidden ? 0 : 1 }}
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
            animate={{ scaleX: gateReady ? 0 : progress / 100, opacity: gateReady ? 0 : 1 }}
            transition={{ ease: "linear" }}
          />

          {/* ── Entry gate ──────────────────────────────────────────────
              The click here is a genuine user gesture, so audio.enable()
              unlocks sound on every device (iOS included). It is the one
              guaranteed moment to start the experience with sound. */}
          <AnimatePresence>
            {gateReady && (
              <motion.div
                className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.span
                  className="font-mono text-[0.62rem] uppercase tracking-[0.42em] text-accent/80"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.6, ease: EASE }}
                >
                  {`// ${t.gateEyebrow}`}
                </motion.span>

                <motion.button
                  type="button"
                  onClick={enterSite}
                  autoFocus
                  className="group relative mt-6 inline-flex items-center gap-4 rounded-full border border-chalk/15 bg-chalk/[0.03] px-9 py-4 backdrop-blur-sm transition-colors duration-500 hover:border-accent/60 hover:bg-accent/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-void md:px-11 md:py-5"
                  initial={{ opacity: 0, y: 18, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.28, duration: 0.7, ease: EASE }}
                >
                  {/* soft accent halo on hover */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background:radial-gradient(circle_at_center,rgba(79,140,255,0.22),transparent_70%)]"
                  />
                  {/* animated sound glyph — three bars */}
                  <span aria-hidden className="relative flex h-4 items-end gap-[3px]">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-[2px] rounded-full bg-accent"
                        initial={{ height: 4 }}
                        animate={{ height: [4, 14, 6, 12, 4] }}
                        transition={{
                          duration: 1.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.18,
                        }}
                      />
                    ))}
                  </span>
                  <span className="font-display text-lg font-semibold tracking-tight text-chalk md:text-xl">
                    {t.gateCta}
                  </span>
                  <span
                    aria-hidden
                    className="font-mono text-base leading-none text-accent transition-transform duration-500 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </motion.button>

                <motion.span
                  className="mt-6 max-w-xs font-mono text-[0.6rem] uppercase leading-relaxed tracking-[0.22em] text-fog/70"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                >
                  {t.gateHint}
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
