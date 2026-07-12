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

    // monochrome bokeh — whites and platinums only
    const COLORS = ["255,255,255", "230,232,236", "199,203,209", "168,173,180"];
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
      grad.addColorStop(0, "rgba(255,255,255,0.08)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
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
      {/* the house's own photograph — chauffeur, black saloon, rain */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/hero-chauffeur.webp"
        alt=""
        className="kenburns absolute inset-0 h-full w-full object-cover object-[65%_30%]"
        fetchPriority="high"
        decoding="async"
        draggable={false}
      />
      {/* light night grade — keep the photograph alive and luminous */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,rgba(13,14,18,0.3)_0%,rgba(5,5,5,0.28)_55%,rgba(5,5,5,0.36)_100%)]" />
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
      {/* readability veils — only where the text sits, the rest breathes */}
      <div className="absolute inset-0 bg-gradient-to-r from-void/75 via-void/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-void/35 via-transparent to-void" />
    </div>
  );
}
