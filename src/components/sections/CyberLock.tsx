"use client";

import { useEffect, useRef } from "react";

/* ============================================================
   CyberLock — the Cyber Security centrepiece. A single 2D canvas
   (no extra WebGL context) drives a cinematic padlock that lives
   a continuous security story on a loop:

     SECURE   → concentric scanner rings turn, orbiting sentries
                sweep, hex data rises through the body, the keyhole
                breathes a soft beam.
     BREACH   → an intrusion probe streaks in; the lock flares red,
                the shackle springs open, glitch shards scatter.
     RESEAL   → the shackle slams shut; on impact a white-hot
                shockwave rings out and the field snaps back to azure.

   Frame-driven, DPR-aware, IntersectionObserver-gated (pauses fully
   offscreen). A static locked emblem is drawn once for reduced-motion
   / perf mode. Purely decorative → aria-hidden by the caller.
   ============================================================ */

type Spark = { x: number; y: number; vx: number; vy: number; life: number; hot: number };
type Shard = { a: number; r: number; vr: number; life: number };
type Ring = { r: number; life: number };

const ACCENT = [79, 140, 255]; // azure
const ICE = [180, 220, 255];
const DANGER = [255, 74, 74];

/** phase machine */
type Phase = "secure" | "breach" | "open" | "reseal";
const T_SECURE = 5200;
const T_BREACH = 620;
const T_OPEN = 1000;
const T_RESEAL = 460;

export function CyberLock({
  className,
  still = false,
}: {
  className?: string;
  still?: boolean;
}) {
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
    let unit = 1; // scale factor from the lock's design space

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = Math.max(1, Math.round(W * dpr));
      canvas.height = Math.max(1, Math.round(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2;
      cy = H / 2 + Math.min(W, H) * 0.03;
      unit = Math.min(W, H) / 420; // design tuned around a 420px stage
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const rgba = (c: number[], a: number) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
    const mix = (a: number[], b: number[], t: number) => [
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t,
    ];

    /* ---- draw the padlock in design space, centred at (0,0) ---- */
    const drawLock = (
      shackleLift: number, // 0 = closed, 1 = fully open
      tint: number[],
      glow: number,
      hexScroll: number,
      alive: boolean
    ) => {
      const bodyW = 150;
      const bodyH = 118;
      const bodyTop = 6;
      const bodyBottom = bodyTop + bodyH;
      const rad = 26;

      // ---- shackle (behind the body) ----
      const shR = 46;
      const shTopBase = bodyTop - 20;
      const lift = shackleLift * 46;
      ctx.save();
      ctx.lineCap = "round";
      ctx.shadowBlur = 24 * glow;
      ctx.shadowColor = rgba(tint, 0.9);
      ctx.strokeStyle = rgba(mix(tint, ICE, 0.35), 0.95);
      ctx.lineWidth = 15;
      ctx.beginPath();
      // left post
      ctx.moveTo(-shR, bodyTop + 6);
      ctx.lineTo(-shR, shTopBase - lift);
      // arc over the top
      ctx.arc(0, shTopBase - lift, shR, Math.PI, 0, false);
      // right post (lifts less → the open lock swings on the right)
      const rightPostLen = bodyTop + 6 - (shTopBase - lift);
      ctx.lineTo(shR, (shTopBase - lift) + rightPostLen * (1 - shackleLift * 0.65));
      ctx.stroke();
      ctx.restore();

      // ---- body ----
      ctx.save();
      const bodyGrad = ctx.createLinearGradient(0, bodyTop, 0, bodyBottom);
      bodyGrad.addColorStop(0, rgba(mix([10, 14, 22], tint, 0.22 + 0.2 * glow), 1));
      bodyGrad.addColorStop(1, rgba([8, 10, 16], 1));
      ctx.shadowBlur = 40 * glow;
      ctx.shadowColor = rgba(tint, 0.7);
      ctx.fillStyle = bodyGrad;
      roundRect(-bodyW / 2, bodyTop, bodyW, bodyH, rad);
      ctx.fill();
      ctx.restore();

      // body edge
      ctx.save();
      ctx.lineWidth = 2;
      ctx.strokeStyle = rgba(mix(tint, ICE, 0.4), 0.85);
      ctx.shadowBlur = 16 * glow;
      ctx.shadowColor = rgba(tint, 0.8);
      roundRect(-bodyW / 2, bodyTop, bodyW, bodyH, rad);
      ctx.stroke();
      ctx.restore();

      // ---- hex data streaming inside the body (clipped) ----
      if (alive) {
        ctx.save();
        roundRect(-bodyW / 2 + 3, bodyTop + 3, bodyW - 6, bodyH - 6, rad - 3);
        ctx.clip();
        ctx.font = "11px 'Geist Mono', monospace";
        ctx.textAlign = "center";
        const cols = 5;
        for (let i = 0; i < cols; i++) {
          const x = -bodyW / 2 + 22 + (i * (bodyW - 40)) / (cols - 1);
          for (let j = 0; j < 7; j++) {
            const y =
              bodyTop +
              ((j * 20 + hexScroll * (30 + i * 8)) % (bodyH + 20)) -
              4;
            const ch = HEX[(((i * 7 + j) * 131 + ((hexScroll * 6) | 0)) % HEX.length + HEX.length) % HEX.length];
            const fade = 0.10 + 0.22 * (1 - Math.abs((y - bodyTop) / bodyH - 0.5) * 1.6);
            ctx.fillStyle = rgba(mix(tint, ICE, 0.5), Math.max(0, fade));
            ctx.fillText(ch, x, y);
          }
        }
        ctx.restore();
      }

      // ---- keyhole ----
      const khY = bodyTop + bodyH * 0.5;
      ctx.save();
      ctx.shadowBlur = 18 * glow;
      ctx.shadowColor = rgba(mix(tint, ICE, 0.5), 0.95);
      ctx.fillStyle = rgba(mix(tint, ICE, 0.6), 0.95);
      ctx.beginPath();
      ctx.arc(0, khY, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-6, khY + 2);
      ctx.lineTo(6, khY + 2);
      ctx.lineTo(11, khY + 34);
      ctx.lineTo(-11, khY + 34);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };

    /* ---------------- static (reduced-motion) ---------------- */
    if (still) {
      const paint = () => {
        ctx.clearRect(0, 0, W, H);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(unit, unit);
        // one calm ring
        ctx.strokeStyle = rgba(ACCENT, 0.25);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, 150, 0, Math.PI * 2);
        ctx.stroke();
        drawLock(0, ACCENT, 0.7, 0, false);
        ctx.restore();
      };
      // repaint on resize so it stays crisp
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
    const sparks: Spark[] = [];
    const shards: Shard[] = [];
    const rings: Ring[] = [];
    let probe = -1; // breach probe progress 0..1 (‑1 = inactive)
    let flash = 0;

    let phase: Phase = "secure";
    let phaseT = 0;
    let last = performance.now();
    let raf = 0;
    let running = false;

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

    const nextPhase = () => {
      if (phase === "secure") {
        phase = "breach";
        probe = 0;
      } else if (phase === "breach") {
        phase = "open";
        // glitch shards burst
        for (let i = 0; i < 26; i++) {
          shards.push({
            a: Math.random() * Math.PI * 2,
            r: 60 + Math.random() * 30,
            vr: 120 + Math.random() * 220,
            life: 1,
          });
        }
      } else if (phase === "open") {
        phase = "reseal";
      } else {
        phase = "secure";
      }
      phaseT = 0;
    };

    const easeOutBack = (x: number) => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    };
    const easeInCubic = (x: number) => x * x * x;
    const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

    const loop = (now: number) => {
      raf = 0;
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      phaseT += dt * 1000;

      const t = now / 1000;
      ctx.clearRect(0, 0, W, H);

      // phase-driven state
      let shackle = 0;
      let tint = ACCENT.slice();
      let glow = 0.85;

      const durFor = { secure: T_SECURE, breach: T_BREACH, open: T_OPEN, reseal: T_RESEAL }[phase];
      const p = Math.min(1, phaseT / durFor);

      if (phase === "secure") {
        glow = 0.8 + 0.18 * Math.sin(t * 2.2);
      } else if (phase === "breach") {
        probe = p;
        // ramp toward danger as the probe reaches the core
        tint = mix(ACCENT, DANGER, Math.min(1, p * 1.15));
        glow = 0.9 + 0.5 * p;
        shackle = easeInCubic(Math.max(0, p - 0.55) / 0.45) * 0.15;
      } else if (phase === "open") {
        tint = mix(DANGER, ACCENT, easeOutCubic(p) * 0.35);
        shackle = 0.6 + 0.4 * easeOutBack(Math.min(1, p * 1.3));
        glow = 1.1 - 0.2 * p;
        // scanning red alarm shimmer
        glow += 0.15 * Math.sin(t * 22);
      } else if (phase === "reseal") {
        const e = easeInCubic(p);
        shackle = 1 - e;
        tint = mix(DANGER, ACCENT, e);
        glow = 0.9;
        if (p >= 1) {
          // IMPACT — shockwave + sparks + flash
          rings.push({ r: 60, life: 1 }, { r: 30, life: 1 });
          flash = 1;
          for (let i = 0; i < 40; i++) {
            const a = Math.random() * Math.PI * 2;
            const sp = 120 + Math.random() * 340;
            sparks.push({
              x: cx,
              y: cy - 30 * unit,
              vx: Math.cos(a) * sp,
              vy: Math.sin(a) * sp - 40,
              life: 1,
              hot: Math.random(),
            });
          }
        }
      }

      if (phaseT >= durFor) nextPhase();

      // ---------- background vignette bloom ----------
      const bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.6);
      bloom.addColorStop(0, rgba(tint, 0.10 + 0.06 * glow));
      bloom.addColorStop(1, rgba(tint, 0));
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(unit, unit);

      // ---------- concentric scanner rings + orbiting sentries ----------
      const ringDefs = [
        { r: 150, w: 1.4, seg: 5, speed: 0.25, gap: 0.55 },
        { r: 186, w: 1.1, seg: 3, speed: -0.17, gap: 0.85 },
        { r: 224, w: 1.0, seg: 7, speed: 0.12, gap: 0.4 },
      ];
      for (const rd of ringDefs) {
        ctx.strokeStyle = rgba(tint, 0.22);
        ctx.lineWidth = rd.w;
        for (let s = 0; s < rd.seg; s++) {
          const a0 = (s / rd.seg) * Math.PI * 2 + t * rd.speed;
          const a1 = a0 + ((Math.PI * 2) / rd.seg) * rd.gap;
          ctx.beginPath();
          ctx.arc(0, 0, rd.r, a0, a1);
          ctx.stroke();
        }
        // sentry node riding the ring
        const sa = t * rd.speed * 2.4;
        const sx = Math.cos(sa) * rd.r;
        const sy = Math.sin(sa) * rd.r;
        ctx.save();
        ctx.shadowBlur = 12;
        ctx.shadowColor = rgba(mix(tint, ICE, 0.5), 1);
        ctx.fillStyle = rgba(mix(tint, ICE, 0.6), 0.95);
        ctx.beginPath();
        ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // radar sweep line (secure only)
      if (phase === "secure") {
        const sweep = t * 0.9;
        const grad = ctx.createConicGradient ? ctx.createConicGradient(sweep, 0, 0) : null;
        if (grad) {
          grad.addColorStop(0, rgba(tint, 0.16));
          grad.addColorStop(0.07, rgba(tint, 0));
          grad.addColorStop(1, rgba(tint, 0));
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, 232, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ---------- breach probe streak ----------
      if (probe >= 0 && phase === "breach") {
        const from = 300;
        const px = Math.cos(-0.7) * from * (1 - probe);
        const py = Math.sin(-0.7) * from * (1 - probe) - 30;
        const tailN = 8;
        for (let i = 0; i < tailN; i++) {
          const tp = Math.max(0, probe - i * 0.02);
          const tx = Math.cos(-0.7) * from * (1 - tp);
          const ty = Math.sin(-0.7) * from * (1 - tp) - 30;
          ctx.fillStyle = rgba(DANGER, (0.9 * (1 - i / tailN)));
          ctx.beginPath();
          ctx.arc(tx, ty, 3.2 * (1 - i / tailN) + 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.save();
        ctx.shadowBlur = 20;
        ctx.shadowColor = rgba(DANGER, 1);
        ctx.fillStyle = rgba([255, 210, 210], 1);
        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ---------- shock rings ----------
      for (let i = rings.length - 1; i >= 0; i--) {
        const rg = rings[i];
        rg.r += 520 * dt;
        rg.life -= dt * 1.6;
        if (rg.life <= 0) {
          rings.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = rgba(mix(ICE, ACCENT, 0.3), rg.life * 0.8);
        ctx.lineWidth = 2.5 * rg.life + 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, rg.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // ---------- glitch shards (open) ----------
      for (let i = shards.length - 1; i >= 0; i--) {
        const sh = shards[i];
        sh.r += sh.vr * dt;
        sh.life -= dt * 1.1;
        if (sh.life <= 0) {
          shards.splice(i, 1);
          continue;
        }
        const x = Math.cos(sh.a) * sh.r;
        const y = Math.sin(sh.a) * sh.r - 30;
        ctx.fillStyle = rgba(DANGER, sh.life * 0.8);
        ctx.fillRect(x, y, 3 + sh.life * 3, 1.5);
      }

      // ---------- the padlock ----------
      drawLock(shackle, tint, glow, t * 0.4, true);

      ctx.restore();

      // ---------- sparks (screen space) ----------
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vy += 260 * dt; // gravity
        s.life -= dt * 1.5;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        const col = mix(ICE, [255, 255, 255], s.hot);
        ctx.fillStyle = rgba(col, s.life);
        ctx.fillRect(s.x, s.y, 2, 2);
      }

      // ---------- impact flash ----------
      if (flash > 0) {
        ctx.fillStyle = rgba([255, 255, 255], flash * 0.14);
        ctx.fillRect(0, 0, W, H);
        flash -= dt * 2.2;
      }

      raf = requestAnimationFrame(loop);
    };

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [still]);

  return <canvas ref={ref} className={className} aria-hidden />;
}

const HEX = "0123456789ABCDEF<>/{}[]#$".split("");
