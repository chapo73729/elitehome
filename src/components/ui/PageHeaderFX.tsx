"use client";

import { useEffect, useRef } from "react";

/**
 * A subtle drifting "constellation" behind a page header — slow particles with
 * faint links, tinted by the page accent, fading out toward the bottom. Light
 * 2D canvas (no WebGL context), paused offscreen, and respectful of
 * prefers-reduced-motion. Purely decorative.
 */
export function PageHeaderFX({
  accent = "#5b8cff",
  className,
}: {
  accent?: string;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let raf = 0;
    let running = true;

    const rgb = hexToRgb(accent);

    type P = { x: number; y: number; vx: number; vy: number; r: number; tw: number };
    let pts: P[] = [];

    const seed = () => {
      const count = Math.min(80, Math.floor((W * H) / 16000));
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: Math.random() * 1.4 + 0.4,
        tw: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([e]) => {
        running = e.isIntersecting;
        if (running && !reduce) raf = requestAnimationFrame(loop);
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      // links
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 130 * 130) {
            const al = (1 - d2 / (130 * 130)) * 0.12;
            ctx.strokeStyle = `rgba(${rgb},${al})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      // nodes
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;
        const tw = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 0.001 + p.tw));
        ctx.fillStyle = `rgba(${rgb},${0.5 * tw})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (t: number) => {
      if (!running) return;
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    if (reduce) draw(0);
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [accent]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className ?? ""}`}
      style={{
        maskImage: "linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.35) 55%, transparent 85%)",
        WebkitMaskImage: "linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.35) 55%, transparent 85%)",
      }}
    />
  );
}

function hexToRgb(hex: string): string {
  const m = hex.replace("#", "");
  const n = parseInt(m.length === 3 ? m.split("").map((c) => c + c).join("") : m, 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}
