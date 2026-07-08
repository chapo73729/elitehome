"use client";

import { useEffect, useRef } from "react";

/* ============================================================
   CyberLock — the Cyber Security centrepiece, reimagined as a
   cosmic particle formation: thousands of points of light erupt
   from a singularity in a big-bang burst and crystallise into the
   silhouette of a padlock, hold shimmering, then implode back to
   the seed and reform — on a loop.

   The lock shape is sampled from an offscreen render, so the
   particles land on a real padlock (body + shackle, hollow keyhole).
   Additive blending + soft bokeh depth gives the glittering,
   nebula-like light of the reference. Single 2D canvas (no WebGL),
   DPR-aware, IntersectionObserver-gated. A static formed lock is
   drawn for reduced-motion / perf. Decorative → aria-hidden.
   ============================================================ */

const AZURE = 212;
const CYAN = 188;

type Particle = {
  hx: number; // home (lock target), screen space
  hy: number;
  ax: number; // current
  ay: number;
  px: number; // previous (for motion trails)
  py: number;
  ang: number; // burst direction bias
  size: number;
  bokeh: boolean;
  hue: number;
  light: number;
  delay: number; // formation stagger 0..0.45
  jitter: number;
};

type Phase = "seed" | "bang" | "hold" | "collapse";
const T_SEED = 460;
const T_BANG = 1700;
const T_HOLD = 3600;
const T_COLLAPSE = 1050;

export function CyberLock({ className, still = false }: { className?: string; still?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas ? canvas.getContext("2d") : null;
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let cx = 0;
    let cy = 0;
    let particles: Particle[] = [];

    /* ---- sample the padlock silhouette into target points ---- */
    const sampleLock = (): { x: number; y: number }[] => {
      const off = document.createElement("canvas");
      off.width = Math.max(1, Math.round(W));
      off.height = Math.max(1, Math.round(H));
      const o = off.getContext("2d");
      if (!o) return [];

      const S = Math.min(W, H);
      const lockH = S * 0.5;
      const bodyW = lockH * 0.62;
      const bodyH = lockH * 0.5;
      const rad = bodyW * 0.18;
      const bx = cx - bodyW / 2;
      const by = cy - bodyH * 0.28;
      const shR = bodyW * 0.32;
      const shTop = by - lockH * 0.34;
      const shW = lockH * 0.11;

      o.fillStyle = "#fff";
      o.strokeStyle = "#fff";
      // body (rounded rect)
      o.beginPath();
      o.moveTo(bx + rad, by);
      o.arcTo(bx + bodyW, by, bx + bodyW, by + bodyH, rad);
      o.arcTo(bx + bodyW, by + bodyH, bx, by + bodyH, rad);
      o.arcTo(bx, by + bodyH, bx, by, rad);
      o.arcTo(bx, by, bx + bodyW, by, rad);
      o.closePath();
      o.fill();
      // shackle (thick arc + posts)
      o.lineCap = "round";
      o.lineJoin = "round";
      o.lineWidth = shW;
      o.beginPath();
      o.moveTo(cx - shR, by + 6);
      o.lineTo(cx - shR, shTop);
      o.arc(cx, shTop, shR, Math.PI, 0, false);
      o.lineTo(cx + shR, by + 6);
      o.stroke();
      // hollow keyhole
      o.globalCompositeOperation = "destination-out";
      const khY = by + bodyH * 0.52;
      o.beginPath();
      o.arc(cx, khY, bodyW * 0.09, 0, Math.PI * 2);
      o.fill();
      o.beginPath();
      o.moveTo(cx - bodyW * 0.05, khY);
      o.lineTo(cx + bodyW * 0.05, khY);
      o.lineTo(cx + bodyW * 0.08, khY + bodyH * 0.34);
      o.lineTo(cx - bodyW * 0.08, khY + bodyH * 0.34);
      o.closePath();
      o.fill();
      o.globalCompositeOperation = "source-over";

      const img = o.getImageData(0, 0, off.width, off.height).data;
      const gap = S < 420 ? 5 : 4;
      const pts: { x: number; y: number }[] = [];
      for (let y = 0; y < off.height; y += gap) {
        for (let x = 0; x < off.width; x += gap) {
          if (img[(y * off.width + x) * 4 + 3] > 128) {
            // slight sub-cell jitter so it isn't a rigid grid
            pts.push({ x: x + (Math.random() - 0.5) * gap, y: y + (Math.random() - 0.5) * gap });
          }
        }
      }
      // cap for perf — keep a random subset if very dense
      const MAX = S < 420 ? 1500 : 2600;
      if (pts.length > MAX) {
        for (let i = pts.length - 1; i > 0; i--) {
          const j = (Math.random() * (i + 1)) | 0;
          [pts[i], pts[j]] = [pts[j], pts[i]];
        }
        pts.length = MAX;
      }
      return pts;
    };

    const build = () => {
      const targets = sampleLock();
      particles = targets.map((t) => {
        const a = Math.atan2(t.y - cy, t.x - cx) + (Math.random() - 0.5) * 0.5;
        const bokeh = Math.random() < 0.12;
        const cyan = Math.random() < 0.28;
        return {
          hx: t.x,
          hy: t.y,
          ax: cx,
          ay: cy,
          px: cx,
          py: cy,
          ang: a,
          size: bokeh ? 2.4 + Math.random() * 3.2 : 0.7 + Math.random() * 1.3,
          bokeh,
          hue: (cyan ? CYAN : AZURE) + (Math.random() - 0.5) * 14,
          light: 62 + Math.random() * 30,
          delay: Math.random() * 0.42,
          jitter: Math.random() * Math.PI * 2,
        };
      });
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = Math.max(1, Math.round(W * dpr));
      canvas.height = Math.max(1, Math.round(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2;
      cy = H / 2;
      build();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const easeOutBack = (x: number) => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    };
    const easeIn = (x: number) => x * x * x;
    const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

    /* faint nebula backdrop for cosmic depth */
    const nebula = (t: number, energy: number) => {
      const blobs = [
        { x: 0.3, y: 0.32, r: 0.6, h: AZURE, a: 0.09 },
        { x: 0.72, y: 0.68, r: 0.55, h: CYAN, a: 0.07 },
        { x: 0.5, y: 0.5, r: 0.42, h: AZURE, a: 0.05 + energy * 0.12 },
      ];
      for (const b of blobs) {
        const dx = Math.sin(t * 0.12 + b.x * 6) * 12;
        const dy = Math.cos(t * 0.1 + b.y * 6) * 12;
        const g = ctx.createRadialGradient(
          W * b.x + dx,
          H * b.y + dy,
          0,
          W * b.x + dx,
          H * b.y + dy,
          Math.min(W, H) * b.r
        );
        g.addColorStop(0, `hsla(${b.h}, 90%, 60%, ${b.a})`);
        g.addColorStop(1, "hsla(0,0%,0%,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }
    };

    const drawParticles = (assembleFor: (p: Particle) => { x: number; y: number }, coreFlash: number, shimmer: number) => {
      ctx.globalCompositeOperation = "lighter";
      // trails first (thin additive lines from previous position)
      for (const p of particles) {
        const pos = assembleFor(p);
        if (!p.bokeh) {
          const dx = pos.x - p.px;
          const dy = pos.y - p.py;
          const sp = dx * dx + dy * dy;
          if (sp > 6) {
            ctx.strokeStyle = `hsla(${p.hue}, 95%, ${p.light}%, 0.22)`;
            ctx.lineWidth = p.size * 0.8;
            ctx.beginPath();
            ctx.moveTo(p.px, p.py);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
          }
        }
        p.px = pos.x;
        p.py = pos.y;
      }
      // heads
      for (const p of particles) {
        const x = p.px;
        const y = p.py;
        const s = p.size * (p.bokeh ? 1 : 1 + shimmer * 0.3);
        const alpha = p.bokeh ? 0.16 : 0.85;
        // soft halo
        ctx.fillStyle = `hsla(${p.hue}, 95%, ${p.light}%, ${alpha * 0.4})`;
        ctx.beginPath();
        ctx.arc(x, y, s * 2.2, 0, 6.2831853);
        ctx.fill();
        // bright core
        ctx.fillStyle = `hsla(${p.hue}, 90%, ${Math.min(96, p.light + 25)}%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, s, 0, 6.2831853);
        ctx.fill();
      }
      // singularity core flash
      if (coreFlash > 0.001) {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.4 * coreFlash);
        g.addColorStop(0, `hsla(200, 100%, 92%, ${0.9 * coreFlash})`);
        g.addColorStop(0.4, `hsla(${AZURE}, 100%, 70%, ${0.4 * coreFlash})`);
        g.addColorStop(1, "hsla(0,0%,0%,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, Math.min(W, H) * 0.4 * coreFlash, 0, 6.2831853);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    };

    /* ---------------- static (reduced motion / perf) ---------------- */
    if (still) {
      const paint = () => {
        ctx.clearRect(0, 0, W, H);
        nebula(0, 0.2);
        drawParticles((p) => ({ x: p.hx, y: p.hy }), 0, 0);
      };
      const ro2 = new ResizeObserver(() => {
        resize();
        paint();
      });
      ro2.observe(canvas);
      paint();
      return () => {
        ro.disconnect();
        ro2.disconnect();
      };
    }

    /* ---------------- animated ---------------- */
    let phase: Phase = "seed";
    let phaseT = 0;
    let last = performance.now();
    let raf = 0;
    let running = false;

    const durFor = { seed: T_SEED, bang: T_BANG, hold: T_HOLD, collapse: T_COLLAPSE };

    const loop = (now: number) => {
      raf = 0;
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      phaseT += dt * 1000;
      const t = now / 1000;

      const p = clamp01(phaseT / durFor[phase]);
      if (phaseT >= durFor[phase]) {
        phase = phase === "seed" ? "bang" : phase === "bang" ? "hold" : phase === "hold" ? "collapse" : "seed";
        phaseT = 0;
      }

      // energy drives the nebula brightness (peaks at the bang)
      const energy = phase === "bang" ? 1 - p * 0.6 : phase === "seed" ? p : phase === "collapse" ? p * 0.4 : 0.2;
      let coreFlash = 0;
      let shimmer = 0;

      // per-phase particle position function
      let assembleFor: (pt: Particle) => { x: number; y: number };
      if (phase === "seed") {
        // collapsed near centre, tightening — a bright seed of light
        coreFlash = 0.2 + p * 0.7;
        const spread = (1 - p) * 26 + 3;
        assembleFor = (pt) => ({
          x: cx + Math.cos(pt.ang + t) * spread * (0.3 + pt.jitter * 0.1),
          y: cy + Math.sin(pt.ang + t) * spread * (0.3 + pt.jitter * 0.1),
        });
      } else if (phase === "bang") {
        // explode outward and rush to the lock targets (staggered, overshoot)
        coreFlash = Math.max(0, 0.9 - p * 3);
        assembleFor = (pt) => {
          const local = clamp01((p - pt.delay) / (1 - pt.delay));
          const a = easeOutBack(local);
          return { x: cx + (pt.hx - cx) * a, y: cy + (pt.hy - cy) * a };
        };
      } else if (phase === "hold") {
        // formed lock, shimmering; a slow luminous breath
        shimmer = 0.5 + 0.5 * Math.sin(t * 2.2);
        assembleFor = (pt) => {
          const j = 1.2;
          return {
            x: pt.hx + Math.sin(t * 1.6 + pt.jitter) * j,
            y: pt.hy + Math.cos(t * 1.4 + pt.jitter) * j,
          };
        };
      } else {
        // implode back toward the seed
        const a = 1 - easeIn(p);
        assembleFor = (pt) => ({ x: cx + (pt.hx - cx) * a, y: cy + (pt.hy - cy) * a });
      }

      ctx.clearRect(0, 0, W, H);
      nebula(t, energy);
      drawParticles(assembleFor, coreFlash, shimmer);

      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        running = e.isIntersecting;
        if (running) {
          last = performance.now();
          if (!raf) raf = requestAnimationFrame(loop);
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [still]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
