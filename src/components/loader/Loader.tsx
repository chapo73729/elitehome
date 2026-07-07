"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/lang";
import { audio } from "@/lib/audio";

const T = {
  en: {
    wordmark: "ARDLABS® · Digital Engineering Studio",
    tagline: "Digital Engineering Studio",
    booting: "initialising",
    core: "core",
    lattice: "lattice",
    interface: "interface",
    gateEyebrow: "the studio awaits",
    gateCta: "Enter ARDLABS",
    gateHint: "Sound is part of the experience — best with the volume on",
  },
  fr: {
    wordmark: "ARDLABS® · Studio d’ingénierie numérique",
    tagline: "Studio d’ingénierie numérique",
    booting: "initialisation",
    core: "cœur",
    lattice: "trame",
    interface: "interface",
    gateEyebrow: "le studio vous attend",
    gateCta: "Découvrez ARDLABS",
    gateHint: "Le son fait partie de l’expérience — activez le volume",
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

type Phase = "preload" | "ignite" | "form" | "hold" | "explode" | "done";

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
interface Dust {
  x: number;
  y: number;
  z: number; // depth 0..1 → parallax + size + alpha
  vy: number;
  r: number;
}

// preload timing
const T_PRELOAD_MIN = 1100; // let the mark bloom, even on a warm cache
const T_PRELOAD_MAX = 3000; // never wait longer than this on the font promise
// intro timing
const T_IGNITE = 650;
const T_FORM = 1500;
const T_HOLD = 650;
const T_EXPLODE = 900;
// reveal bounding — the gate is an invitation, never a gesture lock
const AUTO_REVEAL_MS = 7000;

/**
 * Cinematic boot:
 *   preload — the ARDLABS mark draws on and blooms while real assets load
 *             (fonts) over a field of drifting light dust; progress is real.
 *   ignite  — a light point blooms at centre
 *   form    — particles converge into the ARDLABS wordmark
 *   hold    — the logo breathes
 *   explode — particles burst outward, we pass through
 *   → the entry gate rises (a click unlocks sound everywhere); if the visitor
 *     never clicks, it auto-reveals so nothing is ever gesture-locked.
 *   done    — overlay wipes away to reveal the hero
 */
export function Loader({ onComplete }: { onComplete: () => void }) {
  const t = T[useLang()];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("preload");
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [gateReady, setGateReady] = useState(false);
  const revealedRef = useRef(false);

  /**
   * Cross the threshold. When `gesture` is true this runs inside the click/
   * keydown, so audio.enable() is a guaranteed user activation — the one
   * moment every browser (iOS included) honours to unlock sound. On an
   * auto/scroll reveal we deliberately do NOT force audio on (the visitor
   * didn't opt in); it unlocks later on their first real gesture.
   */
  const reveal = (gesture: boolean) => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    if (gesture) audio.enable();
    setGateReady(false);
    setPhase("done"); // triggers the clip-path wipe
    window.setTimeout(() => {
      setHidden(true);
      onComplete();
    }, 900);
  };
  const enterSite = () => reveal(true);

  // The gate never traps: reveal after a beat, or on the first scroll.
  useEffect(() => {
    if (!gateReady) return;
    const auto = window.setTimeout(() => reveal(false), AUTO_REVEAL_MS);
    const onGesture = () => reveal(false);
    window.addEventListener("wheel", onGesture, { once: true, passive: true });
    window.addEventListener("touchmove", onGesture, { once: true, passive: true });
    return () => {
      clearTimeout(auto);
      window.removeEventListener("wheel", onGesture);
      window.removeEventListener("touchmove", onGesture);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gateReady]);

  useEffect(() => {
    let reduce = false;
    let seen: string | null = null;
    try {
      reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      seen = sessionStorage.getItem("ardlabs-booted");
    } catch {
      /* storage/media blocked — treat as a fresh, full-motion visit */
    }

    // Repeat visit this session: reveal at once, don't re-gate every nav.
    if (seen) {
      setHidden(true);
      onComplete();
      return;
    }
    try {
      sessionStorage.setItem("ardlabs-booted", "1");
    } catch {
      /* non-fatal */
    }

    // Reduced motion: a calm, brief brand moment, then reveal directly — no
    // particle storm, no gesture gate.
    if (reduce) {
      setPhase("preload");
      const started = performance.now();
      let rrq = 0;
      const tick = (now: number) => {
        const p = Math.min(100, ((now - started) / 1200) * 100);
        setProgress(Math.round(p));
        if (p < 100) rrq = requestAnimationFrame(tick);
      };
      rrq = requestAnimationFrame(tick);
      const to = window.setTimeout(() => reveal(false), 1500);
      return () => {
        cancelAnimationFrame(rrq);
        clearTimeout(to);
      };
    }

    // ── Full cinematic path ────────────────────────────────────────────────
    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext("2d", { alpha: true }) : null;
    // A null canvas/context must never freeze the boot screen.
    if (!canvas || !ctx) {
      setGateReady(true);
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const lite =
      (typeof navigator !== "undefined" && (navigator.hardwareConcurrency || 8) <= 4) ||
      window.matchMedia("(max-width: 768px)").matches;

    let W = window.innerWidth;
    let H = window.innerHeight;
    let cx = W / 2;
    let cy = H / 2;
    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      cx = W / 2;
      cy = H / 2;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // drifting light dust for the preload (depth + life, cheaply)
    const DUST = lite ? 42 : 84;
    const dust: Dust[] = new Array(DUST).fill(0).map(() => {
      const z = Math.random();
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        z,
        vy: 6 + z * 22,
        r: 0.5 + z * 1.6,
      };
    });

    // Particles for the wordmark — built lazily once fonts are ready so the
    // Geist sampling is crisp.
    let particles: Particle[] = [];
    let count = 0;
    const buildParticles = () => {
      const off = document.createElement("canvas");
      const octx = off.getContext("2d");
      if (!octx) return;
      off.width = W;
      off.height = H;
      const fontSize = Math.min(W * 0.16, 220);
      octx.fillStyle = "#fff";
      octx.font = `700 ${fontSize}px "Geist", system-ui, sans-serif`;
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.fillText("ARDLABS", W / 2, H / 2);
      const img = octx.getImageData(0, 0, W, H).data;
      const targets: { x: number; y: number }[] = [];
      const gap = lite ? 7 : W < 640 ? 5 : 6;
      for (let y = 0; y < H; y += gap) {
        for (let x = 0; x < W; x += gap) {
          if (img[(y * W + x) * 4 + 3] > 128) targets.push({ x, y });
        }
      }
      count = targets.length;
      particles = new Array(count).fill(0).map((_, i) => {
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
    };

    // real load signal — the font that the wordmark is sampled from
    let fontsReady = false;
    try {
      const f = (document as Document & { fonts?: FontFaceSet }).fonts;
      if (f && f.ready) f.ready.then(() => (fontsReady = true));
      else fontsReady = true;
    } catch {
      fontsReady = true;
    }

    const start = performance.now();
    let last = start;
    let introStart: number | null = null;
    let prog = 0;
    let raf = 0;
    let localPhase: Phase = "preload";

    const easeOutExpo = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
    const easeInExpo = (x: number) => (x <= 0 ? 0 : Math.pow(2, 10 * x - 10));

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, W, H);

      // ---------- PRELOAD ----------
      if (introStart === null) {
        const el = now - start;
        // soft breathing bloom (depth + light)
        const pulse = 0.5 + 0.5 * Math.sin(el / 520);
        const bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.42);
        bloom.addColorStop(0, `rgba(79,140,255,${0.1 + 0.06 * pulse})`);
        bloom.addColorStop(1, "rgba(79,140,255,0)");
        ctx.fillStyle = bloom;
        ctx.fillRect(0, 0, W, H);
        // drifting dust
        for (const d of dust) {
          d.y -= d.vy * dt;
          if (d.y < -4) {
            d.y = H + 4;
            d.x = Math.random() * W;
          }
          ctx.fillStyle = `rgba(${210 + d.z * 40 | 0},${225},255,${0.06 + d.z * 0.22})`;
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r, 0, 6.2831853);
          ctx.fill();
        }
        // real-ish progress: eases to 100 once the font resolves (min hold),
        // otherwise creeps toward a ceiling until the max wait.
        const target = fontsReady && el >= T_PRELOAD_MIN * 0.6 ? 100 : Math.min(88, (el / T_PRELOAD_MAX) * 100);
        prog += (target - prog) * Math.min(1, dt * 5);
        setProgress(Math.round(prog));

        const done = (el >= T_PRELOAD_MIN && fontsReady) || el >= T_PRELOAD_MAX;
        if (done) {
          buildParticles();
          introStart = now;
          prog = 100;
          setProgress(100);
          setPhase((localPhase = "ignite"));
        }
        raf = requestAnimationFrame(safeFrame);
        return;
      }

      const elapsed = now - introStart;

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

      // ---------- HOLD ----------
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

      finish();
    };

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      setPhase((localPhase = "hold"));
      setProgress(100);
      setGateReady(true);
    };

    const safeFrame = (now: number) => {
      try {
        frame(now);
      } catch {
        finish();
      }
    };

    raf = requestAnimationFrame(safeFrame);
    // hard safety net — the experience reveals no matter what
    const safety = window.setTimeout(
      finish,
      T_PRELOAD_MAX + T_IGNITE + T_FORM + T_HOLD + T_EXPLODE + 1200
    );

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(safety);
      window.removeEventListener("resize", resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const compileWord =
    phase === "ignite" ? t.core : phase === "form" ? t.lattice : t.interface;
  const compiled = phase === "hold" || phase === "explode" || phase === "done";
  const fading = phase === "explode" || phase === "done";
  const isPreload = phase === "preload";
  const readoutHidden = isPreload || fading || gateReady;

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

          {/* corner brackets */}
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
                animate={{ pathLength: 1, opacity: fading ? 0 : gateReady ? 0.45 : 0.3 }}
                transition={{
                  pathLength: { delay: 0.05 + i * 0.07, duration: 0.5, ease: EASE },
                  opacity: fading
                    ? { duration: 0.4, ease: "easeOut" }
                    : { delay: 0.7, duration: 0.45, ease: "easeOut" },
                }}
              />
            </svg>
          ))}

          {/* ── PRELOAD: the mark draws on, blooms, and reports real progress ── */}
          <AnimatePresence>
            {isPreload && (
              <motion.div
                className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.06, transition: { duration: 0.5, ease: EASE } }}
              >
                <motion.svg
                  width={112}
                  height={112}
                  viewBox="0 0 64 64"
                  fill="none"
                  className="text-chalk [filter:drop-shadow(0_0_18px_rgba(79,140,255,0.45))]"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: EASE }}
                >
                  <motion.path
                    d="M18 48 L32 15 L46 48"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={4.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, ease: EASE }}
                  />
                  <motion.path
                    d="M24.2 34.5 H42.5"
                    fill="none"
                    stroke="var(--color-accent, #4f8cff)"
                    strokeWidth={4}
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.55 }}
                  />
                  <motion.circle
                    cx="46"
                    cy="34.5"
                    r="2.5"
                    fill="var(--color-accent, #4f8cff)"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: EASE, delay: 1 }}
                  />
                </motion.svg>

                <motion.p
                  className="mt-7 font-mono text-[0.6rem] uppercase tracking-[0.5em] text-fog"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.6 }}
                >
                  {t.tagline}
                </motion.p>

                {/* elegant progress rail + count */}
                <div className="mt-6 flex w-[min(66vw,320px)] items-center gap-3">
                  <div className="relative h-px flex-1 overflow-hidden bg-chalk/10">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent/50 to-accent"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="font-mono text-[0.62rem] tabular-nums text-chalk">
                    {String(progress).padStart(3, "0")}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* intro compile readout */}
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
            animate={{
              scaleX: isPreload || gateReady ? 0 : progress / 100,
              opacity: isPreload || gateReady ? 0 : 1,
            }}
            transition={{ ease: "linear" }}
          />

          {/* ── Entry gate — a click unlocks sound everywhere ── */}
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
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background:radial-gradient(circle_at_center,rgba(79,140,255,0.22),transparent_70%)]"
                  />
                  <span aria-hidden className="relative flex h-4 items-end gap-[3px]">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-[2px] rounded-full bg-accent"
                        initial={{ height: 4 }}
                        animate={{ height: [4, 14, 6, 12, 4] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.18 }}
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
                  className="mt-6 max-w-xs font-mono text-[0.6rem] uppercase leading-relaxed tracking-[0.22em] text-fog"
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
