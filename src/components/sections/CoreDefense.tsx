"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useContent } from "@/lib/content";
import { usePerf } from "@/lib/perf";
import { audio } from "@/lib/audio";
import { accentRGB, onAccent } from "@/lib/accent";
import { Reveal } from "@/components/ui/Reveal";
import { ChapterNumeral } from "@/components/ui/ChapterNumeral";
import { scrollToTarget } from "@/components/layout/SmoothScroll";

/* ============================================================
   Core Defense — an opt-in interlude before Contact. It extends
   the Cyber Security story: red threats converge on the studio's
   core; click/tap to neutralise them before they land. Survive as
   long as you can; integrity drops on every hit that reaches the
   core. Game over feeds straight into the Contact CTA.

   One 2D canvas, single rAF, IO-paused, accent-driven. Nothing
   runs until the visitor presses Initialize — you can scroll right
   past it. Reduced motion / perf mode shows the invite + CTA only.
   ============================================================ */

const THREAT = { r: 255, g: 80, b: 64 };

type Threat = { x: number; y: number; vx: number; vy: number; r: number; seed: number };
type Particle = { x: number; y: number; vx: number; vy: number; life: number; hot: boolean };

type Phase = "idle" | "playing" | "over";

export function CoreDefense() {
  const c = useContent().game;
  const reducedPref = useReducedMotion();
  const perf = usePerf();
  const disabled = !!reducedPref || perf;

  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scoreElRef = useRef<HTMLSpanElement>(null);
  const barElRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<Phase>("idle");

  // load best score
  useEffect(() => {
    try {
      const b = parseInt(localStorage.getItem("ardlabs-coredef-best") || "0", 10);
      if (!Number.isNaN(b)) setBest(b);
    } catch {}
  }, []);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // the game engine — set up once; reads phaseRef so start/stop don't rebuild it
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let cx = 0;
    let cy = 0;
    let coreR = 26;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      cx = W / 2;
      cy = H / 2;
      coreR = Math.max(20, Math.min(30, Math.min(W, H) * 0.06));
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let A = accentRGB();
    const unsubAccent = onAccent(() => (A = accentRGB()));

    const threats: Threat[] = [];
    const particles: Particle[] = [];
    let integrity = 100;
    let localScore = 0;
    let elapsed = 0;
    let spawnAcc = 0;
    let shake = 0;
    let raf = 0;
    let last = 0;
    let onScreen = true;

    const reset = () => {
      threats.length = 0;
      particles.length = 0;
      integrity = 100;
      localScore = 0;
      elapsed = 0;
      spawnAcc = 0;
      shake = 0;
    };

    const spawn = () => {
      // enter from a random edge, aimed at the core with slight jitter
      const edge = Math.random();
      let x, y;
      if (edge < 0.5) {
        x = Math.random() * W;
        y = Math.random() < 0.5 ? -12 : H + 12;
      } else {
        x = Math.random() < 0.5 ? -12 : W + 12;
        y = Math.random() * H;
      }
      const ang = Math.atan2(cy - y, cx - x) + (Math.random() - 0.5) * 0.25;
      // speed ramps with elapsed time
      const sp = (46 + Math.min(70, elapsed * 3.2)) * (0.8 + Math.random() * 0.5);
      threats.push({
        x,
        y,
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp,
        r: 7 + Math.random() * 4,
        seed: Math.random() * 6.28,
      });
    };

    const burst = (x: number, y: number, hot: boolean, n: number) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * 6.28;
        const s = 40 + Math.random() * 140;
        particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, hot });
      }
    };

    const endGame = () => {
      burst(cx, cy, false, 40);
      setScore(localScore);
      setBest((prev) => {
        const nb = Math.max(prev, localScore);
        try {
          localStorage.setItem("ardlabs-coredef-best", String(nb));
        } catch {}
        return nb;
      });
      setPhase("over");
    };

    const hit = (px: number, py: number) => {
      if (phaseRef.current !== "playing") return;
      // nearest threat within a forgiving radius (bigger on touch)
      let bi = -1;
      let bd = 34 * 34;
      for (let i = 0; i < threats.length; i++) {
        const t = threats[i];
        const d = (t.x - px) ** 2 + (t.y - py) ** 2;
        if (d < bd) {
          bd = d;
          bi = i;
        }
      }
      if (bi >= 0) {
        const t = threats[bi];
        burst(t.x, t.y, true, 10);
        threats.splice(bi, 1);
        localScore++;
        if (scoreElRef.current) scoreElRef.current.textContent = String(localScore);
        audio.click();
      }
    };

    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      hit(e.clientX - r.left, e.clientY - r.top);
    };
    canvas.addEventListener("pointerdown", onPointer);

    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting));
    io.observe(canvas);

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, W, H);

      const sx = shake ? (Math.random() - 0.5) * shake : 0;
      const sy = shake ? (Math.random() - 0.5) * shake : 0;
      shake *= 0.86;
      ctx.save();
      ctx.translate(sx, sy);

      // faint blueprint grid
      ctx.strokeStyle = `rgba(${A.r},${A.g},${A.b},0.05)`;
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = (elapsed * 8) % step; x < W; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      const playing = phaseRef.current === "playing";

      // core — accent, breathing; ring shows integrity
      const pulse = 1 + Math.sin(elapsed * 3) * 0.06;
      ctx.globalCompositeOperation = "lighter";
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 3);
      cg.addColorStop(0, `rgba(${A.r},${A.g},${A.b},0.5)`);
      cg.addColorStop(1, `rgba(${A.r},${A.g},${A.b},0)`);
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 3, 0, 6.2832);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      ctx.fillStyle = `rgb(${A.r},${A.g},${A.b})`;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * pulse, 0, 6.2832);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 0.42, 0, 6.2832);
      ctx.fill();
      // integrity ring
      ctx.strokeStyle = `rgba(${A.r},${A.g},${A.b},0.8)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR + 8, -1.5708, -1.5708 + 6.2832 * (integrity / 100));
      ctx.stroke();

      // threats
      for (let i = threats.length - 1; i >= 0; i--) {
        const t = threats[i];
        if (playing) {
          t.x += t.vx * dt;
          t.y += t.vy * dt;
        }
        // reached the core?
        if ((t.x - cx) ** 2 + (t.y - cy) ** 2 < (coreR + t.r) ** 2) {
          threats.splice(i, 1);
          if (playing) {
            integrity -= 12;
            shake = 12;
            burst(t.x, t.y, false, 8);
            audio.whoosh();
            if (barElRef.current) barElRef.current.style.width = `${Math.max(0, integrity)}%`;
            if (integrity <= 0) endGame();
          }
          continue;
        }
        const tw = 0.7 + 0.3 * Math.sin(elapsed * 8 + t.seed);
        ctx.fillStyle = `rgba(${THREAT.r},${THREAT.g},${THREAT.b},${tw})`;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r, 0, 6.2832);
        ctx.fill();
        // aiming line
        ctx.strokeStyle = `rgba(${THREAT.r},${THREAT.g},${THREAT.b},0.12)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(t.x, t.y);
        ctx.lineTo(cx, cy);
        ctx.stroke();
      }

      // particles
      ctx.globalCompositeOperation = "lighter";
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= dt * 1.8;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 0.92;
        p.vy *= 0.92;
        const col = p.hot ? A : THREAT;
        ctx.fillStyle = `rgba(${col.r},${col.g},${col.b},${p.life})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.2 * p.life + 0.5, 0, 6.2832);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.restore();
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!onScreen) return; // pause drawing when off-screen

      if (phaseRef.current === "playing") {
        elapsed += dt;
        spawnAcc += dt;
        const rate = 0.9 - Math.min(0.62, elapsed * 0.02); // seconds between spawns
        while (spawnAcc >= rate) {
          spawnAcc -= rate;
          spawn();
        }
      }
      draw(dt);
    };

    // expose a start hook via the canvas dataset so the button can trigger it
    (canvas as unknown as { __start?: () => void }).__start = () => {
      reset();
      if (scoreElRef.current) scoreElRef.current.textContent = "0";
      if (barElRef.current) barElRef.current.style.width = "100%";
    };

    last = performance.now();
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      unsubAccent();
      canvas.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  const start = () => {
    const canvas = canvasRef.current as unknown as { __start?: () => void } | null;
    canvas?.__start?.();
    setScore(0);
    setPhase("playing");
    audio.whoosh();
  };

  return (
    <section id="arcade" className="relative z-10 scroll-mt-24 bg-void py-28 md:py-36">
      <div className="container-x relative">
        <ChapterNumeral n="06" label="INTERLUDE" />
      </div>

      <div className="container-x relative grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,38%)_minmax(0,62%)]">
        {/* copy */}
        <div className="relative">
          <Reveal>
            <span className="eyebrow">{c.eyebrow}</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="text-section-title text-chalk mt-5">{c.title}</h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="text-lead mt-5 max-w-md">{c.intro}</p>
          </Reveal>
          {/* live HUD */}
          <Reveal delay={0.22}>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <div>
                <div className="font-display text-3xl font-semibold tabular-nums text-chalk">
                  <span ref={scoreElRef}>0</span>
                </div>
                <p className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.24em] text-fog">
                  {c.hudScore}
                </p>
              </div>
              <div className="min-w-[9rem]">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    ref={barElRef}
                    className="h-full rounded-full bg-accent transition-none"
                    style={{ width: "100%" }}
                  />
                </div>
                <p className="mt-2 font-mono text-[0.55rem] uppercase tracking-[0.24em] text-fog">
                  {c.hudIntegrity}
                </p>
              </div>
              <div>
                <div className="font-display text-3xl font-semibold tabular-nums text-mist">
                  {best}
                </div>
                <p className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.24em] text-fog">
                  {c.best}
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* the arena */}
        <Reveal delay={0.1}>
          <div className="relative overflow-hidden rounded-xl border border-chalk/10 bg-[#05070c] lit-top">
            <span aria-hidden className="pointer-events-none absolute left-3 top-3 z-10 h-4 w-4 border-l border-t border-accent/50" />
            <span aria-hidden className="pointer-events-none absolute right-3 top-3 z-10 h-4 w-4 border-r border-t border-accent/50" />
            <span aria-hidden className="pointer-events-none absolute bottom-3 left-3 z-10 h-4 w-4 border-b border-l border-accent/50" />
            <span aria-hidden className="pointer-events-none absolute bottom-3 right-3 z-10 h-4 w-4 border-b border-r border-accent/50" />

            <canvas
              ref={canvasRef}
              className="block h-[clamp(340px,58vh,540px)] w-full touch-none [cursor:crosshair]"
            />

            {/* idle / over overlays */}
            {(phase !== "playing" || disabled) && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 bg-[#05070c]/70 p-6 text-center backdrop-blur-sm">
                {phase === "over" && !disabled && (
                  <>
                    <p className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-[#ff5040]">
                      {c.over}
                    </p>
                    <p className="font-display text-5xl font-semibold tabular-nums text-chalk">
                      {score}
                    </p>
                  </>
                )}
                <p className="max-w-xs text-sm text-mist">{c.ctaLine}</p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {!disabled && (
                    <button
                      onClick={start}
                      className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-chalk px-6 py-2.5 text-sm font-medium text-void transition-transform duration-300 active:scale-[0.97]"
                    >
                      {phase === "over" ? c.replay : c.play}
                    </button>
                  )}
                  <button
                    onClick={() => scrollToTarget("#contact")}
                    className="rounded-full border border-white/15 px-6 py-2.5 text-sm text-chalk transition-colors duration-300 hover:border-accent/50 hover:text-accent-2"
                  >
                    {c.cta}
                  </button>
                </div>
                {phase === "idle" && !disabled && (
                  <p className="font-mono text-[0.55rem] uppercase tracking-[0.24em] text-fog/70">
                    {c.hint}
                  </p>
                )}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
