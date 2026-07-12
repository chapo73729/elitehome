"use client";

import { useEffect, useRef } from "react";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

/**
 * Geneva Night Drive — a lightweight 2D-canvas stand-in for the heavier WebGL
 * hero scene in the spec. Rain-streaked glass, drifting headlight bokeh and a
 * wet-road reflection, layered under a CSS skyline. Deliberately cheap: one
 * canvas, capped DPR, paused off-screen and fully static under reduced motion.
 */
export function NightDrive() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useSafeReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // champagne / platinum / cool-street palette for the bokeh
    const COLORS = ["198,161,91", "228,200,138", "199,203,209", "150,170,200"];
    type Bokeh = { x: number; y: number; r: number; vx: number; vy: number; a: number; c: string };
    type Drop = { x: number; y: number; len: number; v: number };

    const N_BOKEH = 26;
    const N_DROPS = 70;
    const bokeh: Bokeh[] = [];
    const drops: Drop[] = [];
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    for (let i = 0; i < N_BOKEH; i++) {
      bokeh.push({
        x: rnd(0, w),
        y: rnd(h * 0.15, h * 0.85),
        r: rnd(2, 9),
        vx: rnd(-0.25, 0.25),
        vy: rnd(-0.06, 0.06),
        a: rnd(0.05, 0.35),
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
    for (let i = 0; i < N_DROPS; i++) {
      drops.push({ x: rnd(0, w), y: rnd(0, h), len: rnd(8, 26), v: rnd(4, 9) });
    }

    let raf = 0;
    let running = true;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // wet-road glow near the bottom
      const grad = ctx.createRadialGradient(w * 0.5, h * 1.02, 0, w * 0.5, h * 1.02, h * 0.9);
      grad.addColorStop(0, "rgba(198,161,91,0.10)");
      grad.addColorStop(1, "rgba(198,161,91,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // drifting headlight bokeh
      for (const b of bokeh) {
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < -20) b.x = w + 20;
        if (b.x > w + 20) b.x = -20;
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r * 3);
        g.addColorStop(0, `rgba(${b.c},${b.a})`);
        g.addColorStop(1, `rgba(${b.c},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // rain
      ctx.strokeStyle = "rgba(199,203,209,0.16)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const d of drops) {
        d.y += d.v;
        d.x += d.v * 0.18;
        if (d.y > h) {
          d.y = -d.len;
          d.x = rnd(0, w);
        }
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - d.len * 0.18, d.y - d.len);
      }
      ctx.stroke();

      if (running) raf = requestAnimationFrame(draw);
    };

    if (reduced) {
      // one static frame — no animation loop
      draw();
      running = false;
      cancelAnimationFrame(raf);
    } else {
      draw();
    }

    // pause when the tab is hidden
    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reduced) {
        running = true;
        draw();
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduced]);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {/* night sky + street gradient base */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,#0d0e12_0%,#050505_55%,#050505_100%)]" />
      {/* faint Geneva skyline + Jet d'eau silhouette */}
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 h-[38%] w-full opacity-[0.5]"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#14161c" />
            <stop offset="1" stopColor="#070708" />
          </linearGradient>
        </defs>
        <path
          fill="url(#sky)"
          d="M0 260 L60 250 L60 210 L96 210 L96 250 L150 244 L150 180 L190 180 L190 244 L250 236 L250 150 L300 150 L300 236 L360 232 L360 196 L410 196 L410 232 L470 226 L470 168 L520 168 L520 226 L600 222 L600 120 L640 120 L640 222 L720 216 L720 176 L770 176 L770 216 L840 212 L840 150 L890 150 L890 212 L980 210 L980 186 L1030 186 L1030 210 L1120 206 L1120 158 L1170 158 L1170 206 L1260 204 L1260 190 L1320 190 L1320 204 L1440 200 L1440 320 L0 320 Z"
        />
        {/* Jet d'eau */}
        <path d="M708 230 C 712 120, 726 120, 730 40" stroke="rgba(199,203,209,0.35)" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
      {/* readability veil */}
      <div className="absolute inset-0 bg-gradient-to-b from-void/40 via-transparent to-void" />
    </div>
  );
}
