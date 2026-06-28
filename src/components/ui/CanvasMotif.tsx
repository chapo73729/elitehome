"use client";

import { useEffect, useRef } from "react";

type Variant = "code" | "ai" | "industrial" | "ocean";

/**
 * Lightweight 2D-canvas motifs — one per capability — giving each section a
 * distinct living visual without spawning additional WebGL contexts.
 */
export function CanvasMotif({
  variant,
  className,
}: {
  variant: Variant;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let raf = 0;
    let running = true;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // pause when offscreen
    const io = new IntersectionObserver(
      ([e]) => {
        running = e.isIntersecting;
        if (running) raf = requestAnimationFrame(loop);
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    // ---- per-variant state ----
    const cols: number[] = [];
    const glyphs = "01<>{}[]#$/\\=+*ABCDEF".split("");
    const sparks: { x: number; y: number; vx: number; vy: number; life: number }[] = [];

    const start = performance.now();
    const loop = (now: number) => {
      if (!running) return;
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, W, H);

      if (variant === "code") {
        ctx.fillStyle = "rgba(5,5,5,0.25)";
        ctx.fillRect(0, 0, W, H);
        const fs = 14;
        const count = Math.floor(W / fs);
        while (cols.length < count) cols.push(Math.random() * -H);
        ctx.font = `${fs}px "Geist Mono", monospace`;
        for (let i = 0; i < count; i++) {
          const x = i * fs;
          const y = cols[i];
          ctx.fillStyle = "rgba(150,185,255,0.95)";
          ctx.fillText(glyphs[(Math.random() * glyphs.length) | 0], x, y);
          ctx.fillStyle = "rgba(120,165,255,0.45)";
          ctx.fillText(glyphs[(Math.random() * glyphs.length) | 0], x, y - fs * 4);
          cols[i] = y > H + Math.random() * 200 ? Math.random() * -60 : y + fs;
        }
      } else if (variant === "ai") {
        // pulsing radial node web with travelling signals
        const cx = W / 2;
        const cy = H / 2;
        const nodes = 38;
        ctx.globalCompositeOperation = "lighter";
        for (let i = 0; i < nodes; i++) {
          const a = (i / nodes) * Math.PI * 2 + t * 0.15;
          const r = (Math.min(W, H) / 2) * (0.32 + 0.55 * (0.5 + 0.5 * Math.sin(t + i)));
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r * 0.72;
          ctx.strokeStyle = "rgba(120,170,255,0.3)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(x, y);
          ctx.stroke();
          // travelling signal along the spoke
          const sp = (t * 0.6 + i * 0.13) % 1;
          ctx.fillStyle = "rgba(180,240,255,0.9)";
          ctx.beginPath();
          ctx.arc(cx + (x - cx) * sp, cy + (y - cy) * sp, 1.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "rgba(180,238,255,0.95)";
          ctx.beginPath();
          ctx.arc(x, y, 2.0 + Math.sin(t * 2 + i) * 1.0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = "rgba(255,255,255,1.0)";
        ctx.beginPath();
        ctx.arc(cx, cy, 4 + Math.sin(t * 3) * 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      } else if (variant === "industrial") {
        // rotating gear-like rings + sparks
        const cx = W * 0.5;
        const cy = H * 0.55;
        ctx.save();
        ctx.translate(cx, cy);
        for (let ring = 0; ring < 3; ring++) {
          const rad = 40 + ring * 36;
          const teeth = 18 + ring * 6;
          ctx.strokeStyle = `rgba(107,157,255,${0.75 - ring * 0.14})`;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          for (let i = 0; i <= teeth; i++) {
            const a = (i / teeth) * Math.PI * 2 + t * (ring % 2 ? -0.4 : 0.4);
            const rr = rad + (i % 2 ? 6 : 0);
            const x = Math.cos(a) * rr;
            const y = Math.sin(a) * rr;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        ctx.restore();
        if (Math.random() > 0.6)
          sparks.push({
            x: cx + (Math.random() - 0.5) * 40,
            y: cy,
            vx: (Math.random() - 0.5) * 3,
            vy: -Math.random() * 3 - 1,
            life: 1,
          });
        for (let i = sparks.length - 1; i >= 0; i--) {
          const s = sparks[i];
          s.x += s.vx;
          s.y += s.vy;
          s.vy += 0.12;
          s.life -= 0.02;
          ctx.fillStyle = `rgba(150,185,255,${s.life})`;
          ctx.fillRect(s.x, s.y, 2, 2);
          if (s.life <= 0) sparks.splice(i, 1);
        }
      } else if (variant === "ocean") {
        // layered sine waves + horizon glow
        const glow = ctx.createLinearGradient(0, 0, 0, H);
        glow.addColorStop(0, "rgba(150,185,255,0.18)");
        glow.addColorStop(0.5, "rgba(107,157,255,0.07)");
        glow.addColorStop(1, "rgba(5,5,5,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, W, H);
        for (let layer = 0; layer < 6; layer++) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(107,157,255,${0.12 + layer * 0.05})`;
          ctx.lineWidth = 1.4;
          const yBase = H * (0.45 + layer * 0.1);
          for (let x = 0; x <= W; x += 6) {
            const y =
              yBase +
              Math.sin(x * 0.012 + t * (1 + layer * 0.3)) * (8 + layer * 4) +
              Math.sin(x * 0.03 - t * 1.5) * 3;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [variant]);

  return <canvas ref={ref} className={className} />;
}
