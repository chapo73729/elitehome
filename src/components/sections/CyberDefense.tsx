"use client";

import { useEffect, useRef } from "react";

/* ============================================================
   CyberDefense — an animated explainer for the studio's security
   practice. A single 2D canvas (no extra WebGL context) narrates
   defence-in-depth as a continuous, near-wordless story:

     MONITOR    — a guarded core (padlock) inside three rotating
                  shield layers; a SOC radar sweeps; telemetry ticks.
     DETECT     — threats stream in from the edges; the radar paints
                  them and azure reticles lock on.
     INTERCEPT  — the outer shield absorbs a wave of threats, each
                  bursting harmlessly; the "neutralised" counter races.
     RESPOND    — a stronger threat pierces the first layer; the SOC
                  fires a response pulse from the core that hunts it
                  down and neutralises it before it reaches the core.
     SECURED    — the field calms, an azure all-clear rings out, the
                  core glows. Then it loops.

   The core NEVER falls — threats are red, the defence stays azure and
   holds. One-word stage captions + a live counter carry the meaning;
   everything else is motion. DPR-aware, IntersectionObserver-gated
   (fully paused offscreen), single rAF owner. Reduced-motion / perf
   mode paints a calm static shielded core. Decorative → aria-hidden.
   ============================================================ */

type Labels = {
  monitor: string;
  detect: string;
  intercept: string;
  respond: string;
  secured: string;
  counter: string;
};

const ACCENT = [79, 140, 255];
const ICE = [180, 220, 255];
const DANGER = [255, 74, 74];

type StageKey = "monitor" | "detect" | "intercept" | "respond" | "secured";
const STAGES: { key: StageKey; dur: number }[] = [
  { key: "monitor", dur: 3000 },
  { key: "detect", dur: 3000 },
  { key: "intercept", dur: 3600 },
  { key: "respond", dur: 4000 },
  { key: "secured", dur: 2400 },
];

export function CyberDefense({
  className,
  still = false,
  labels,
}: {
  className?: string;
  still?: boolean;
  labels: Labels;
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
    let unit = 1;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = Math.max(1, Math.round(W * dpr));
      canvas.height = Math.max(1, Math.round(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2;
      cy = H / 2;
      unit = Math.min(W, H) / 440;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const rgba = (c: number[], a: number) =>
      `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${Math.max(0, Math.min(1, a))})`;
    const mix = (a: number[], b: number[], t: number) => [
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t,
    ];
    const fmt = (n: number) =>
      Math.floor(n)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };

    const HEX = "0123456789ABCDEF<>/{}[]".split("");

    // three defensive layers, inner → outer (design space)
    const R = [138, 184, 230];
    const R_DET = R[2] + 74;

    /** the guarded core: an azure padlock, always closed and holding */
    const drawCore = (glow: number, whiteHot: number, hexScroll: number, alive: boolean) => {
      const tint = mix(ACCENT, [255, 255, 255], whiteHot * 0.6);
      const bodyW = 128;
      const bodyH = 100;
      const bodyTop = 8;
      const rad = 22;
      const shR = 38;

      // shackle
      ctx.save();
      ctx.lineCap = "round";
      ctx.shadowBlur = 22 * glow;
      ctx.shadowColor = rgba(tint, 0.9);
      ctx.strokeStyle = rgba(mix(tint, ICE, 0.35), 0.95);
      ctx.lineWidth = 13;
      ctx.beginPath();
      ctx.moveTo(-shR, bodyTop + 4);
      ctx.lineTo(-shR, bodyTop - 18);
      ctx.arc(0, bodyTop - 18, shR, Math.PI, 0, false);
      ctx.lineTo(shR, bodyTop + 4);
      ctx.stroke();
      ctx.restore();

      // body
      ctx.save();
      const g = ctx.createLinearGradient(0, bodyTop, 0, bodyTop + bodyH);
      g.addColorStop(0, rgba(mix([10, 14, 22], tint, 0.22 + 0.22 * glow), 1));
      g.addColorStop(1, rgba([8, 10, 16], 1));
      ctx.shadowBlur = 38 * glow;
      ctx.shadowColor = rgba(tint, 0.7);
      ctx.fillStyle = g;
      roundRect(-bodyW / 2, bodyTop, bodyW, bodyH, rad);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.lineWidth = 2;
      ctx.strokeStyle = rgba(mix(tint, ICE, 0.45), 0.9);
      ctx.shadowBlur = 14 * glow;
      ctx.shadowColor = rgba(tint, 0.8);
      roundRect(-bodyW / 2, bodyTop, bodyW, bodyH, rad);
      ctx.stroke();
      ctx.restore();

      // hex data streaming inside
      if (alive) {
        ctx.save();
        roundRect(-bodyW / 2 + 3, bodyTop + 3, bodyW - 6, bodyH - 6, rad - 3);
        ctx.clip();
        ctx.font = "10px 'Geist Mono', monospace";
        ctx.textAlign = "center";
        const cols = 5;
        for (let i = 0; i < cols; i++) {
          const x = -bodyW / 2 + 18 + (i * (bodyW - 34)) / (cols - 1);
          for (let j = 0; j < 6; j++) {
            const y = bodyTop + ((j * 20 + hexScroll * (26 + i * 7)) % (bodyH + 20)) - 4;
            const ch = HEX[((i * 6 + j) * 131 + ((hexScroll * 6) | 0)) % HEX.length];
            const fade = 0.09 + 0.2 * (1 - Math.abs((y - bodyTop) / bodyH - 0.5) * 1.6);
            ctx.fillStyle = rgba(mix(tint, ICE, 0.5), fade);
            ctx.fillText(ch, x, y);
          }
        }
        ctx.restore();
      }

      // keyhole
      const khY = bodyTop + bodyH * 0.5;
      ctx.save();
      ctx.shadowBlur = 16 * glow;
      ctx.shadowColor = rgba(mix(tint, ICE, 0.5), 0.95);
      ctx.fillStyle = rgba(mix(tint, ICE, 0.6), 0.95);
      ctx.beginPath();
      ctx.arc(0, khY, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-5, khY + 2);
      ctx.lineTo(5, khY + 2);
      ctx.lineTo(9, khY + 28);
      ctx.lineTo(-9, khY + 28);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const drawShields = (t: number, flareList: Flare[]) => {
      const defs = [
        { r: R[2], seg: 8, sp: 0.12, w: 1.1 },
        { r: R[1], seg: 5, sp: -0.17, w: 1.2 },
        { r: R[0], seg: 6, sp: 0.24, w: 1.4 },
      ];
      for (const rd of defs) {
        ctx.strokeStyle = rgba(ACCENT, 0.2);
        ctx.lineWidth = rd.w;
        for (let s = 0; s < rd.seg; s++) {
          const a0 = (s / rd.seg) * Math.PI * 2 + t * rd.sp;
          const a1 = a0 + ((Math.PI * 2) / rd.seg) * 0.62;
          ctx.beginPath();
          ctx.arc(0, 0, rd.r, a0, a1);
          ctx.stroke();
        }
      }
      // flares where threats struck a layer
      for (const f of flareList) {
        const col = f.danger ? mix(DANGER, ICE, 0.2) : mix(ACCENT, ICE, 0.4);
        ctx.save();
        ctx.shadowBlur = 16 * f.life;
        ctx.shadowColor = rgba(col, f.life);
        ctx.strokeStyle = rgba(col, f.life);
        ctx.lineWidth = 3 * f.life + 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, R[f.ring], f.ang - 0.32, f.ang + 0.32);
        ctx.stroke();
        ctx.restore();
      }
    };

    /* ---------------- static fallback ---------------- */
    if (still) {
      const paint = () => {
        ctx.clearRect(0, 0, W, H);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(unit, unit);
        drawShields(0, []);
        drawCore(0.75, 0, 0, false);
        ctx.restore();
        ctx.font = "600 11px 'Geist Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = rgba(ICE, 0.8);
        ctx.fillText(labels.secured.toUpperCase(), cx, H - 34);
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
    type Threat = { ang: number; dist: number; spd: number; strong: boolean; responded: boolean; det: number };
    type Pulse = { r: number; spd: number; target: Threat | null; ang: number };
    type Flare = { ring: number; ang: number; life: number; danger: boolean };
    type Shock = { r: number; life: number; danger: boolean };
    type Spark = { x: number; y: number; vx: number; vy: number; life: number; hot: number; danger: boolean };

    const threats: Threat[] = [];
    const pulses: Pulse[] = [];
    const flares: Flare[] = [];
    const shocks: Shock[] = [];
    const sparks: Spark[] = [];

    let counter = 1284507 + Math.floor(Math.random() * 40000);
    let alert = 0;
    let flash = 0;
    let whiteHot = 0;

    let stageI = 0;
    let stageT = 0;
    let spawnAcc = 0;
    let respondSpawned = 0;

    const spawnThreat = (strong: boolean) => {
      if (threats.length > 44) return;
      const halfDiag = Math.hypot(W, H) / 2 / unit;
      threats.push({
        ang: Math.random() * Math.PI * 2,
        dist: halfDiag + 24,
        spd: strong ? 66 + Math.random() * 16 : 118 + Math.random() * 78,
        strong,
        responded: false,
        det: 0,
      });
    };

    // (x, y) are DESIGN-space coords (inside the translate/scale); sparks are
    // drawn later in screen space, so convert here once.
    const burst = (x: number, y: number, n: number, danger: boolean) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 60 + Math.random() * 220;
        sparks.push({
          x: cx + x * unit,
          y: cy + y * unit,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 1,
          hot: Math.random(),
          danger,
        });
      }
    };

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

    const stageAlpha = (sp: number) => {
      const fin = Math.min(1, sp / 0.14);
      const fout = Math.min(1, (1 - sp) / 0.14);
      return Math.max(0, Math.min(fin, fout));
    };

    const loop = (now: number) => {
      raf = 0;
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;

      stageT += dt * 1000;
      const stage = STAGES[stageI];
      const sp = Math.min(1, stageT / stage.dur);
      if (stageT >= stage.dur) {
        stageI = (stageI + 1) % STAGES.length;
        stageT = 0;
        respondSpawned = 0;
        if (STAGES[stageI].key === "secured") {
          shocks.push({ r: R[0], life: 1, danger: false });
          flash = 0.5;
        }
      }
      const key = stage.key;

      // spawn cadence per stage
      const rate = key === "monitor" ? 0.35 : key === "detect" ? 1.1 : key === "intercept" ? 3.3 : key === "respond" ? 0.7 : 0;
      spawnAcc += dt * rate;
      while (spawnAcc >= 1) {
        spawnAcc -= 1;
        spawnThreat(false);
      }
      if (key === "respond" && respondSpawned < 2 && stageT > respondSpawned * 1100 + 250) {
        spawnThreat(true);
        respondSpawned++;
      }

      counter += dt * (key === "intercept" ? 280 : 74);

      ctx.clearRect(0, 0, W, H);

      // background bloom, tinted toward danger with alert
      const btint = mix(ACCENT, DANGER, alert * 0.55);
      const bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.62);
      bloom.addColorStop(0, rgba(btint, 0.1 + 0.05 * Math.sin(t * 2) + alert * 0.07));
      bloom.addColorStop(1, rgba(btint, 0));
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(unit, unit);

      // flares decay
      for (let i = flares.length - 1; i >= 0; i--) {
        flares[i].life -= dt * 2.4;
        if (flares[i].life <= 0) flares.splice(i, 1);
      }
      drawShields(t, flares);

      // radar sweep
      const grad = ctx.createConicGradient ? ctx.createConicGradient(t * 0.9, 0, 0) : null;
      if (grad) {
        grad.addColorStop(0, rgba(ACCENT, 0.15));
        grad.addColorStop(0.07, rgba(ACCENT, 0));
        grad.addColorStop(1, rgba(ACCENT, 0));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, R[2] + 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // threats
      for (let i = threats.length - 1; i >= 0; i--) {
        const th = threats[i];
        th.dist -= th.spd * dt;
        th.ang += Math.sin(t + th.dist * 0.01) * 0.0016;
        if (th.dist < R_DET) th.det = Math.min(1, th.det + dt * 3.5);

        const x = Math.cos(th.ang) * th.dist;
        const y = Math.sin(th.ang) * th.dist;

        // weak threat: absorbed at the outer layer
        if (!th.strong && th.dist <= R[2]) {
          flares.push({ ring: 2, ang: th.ang, life: 1, danger: true });
          burst(x, y, 8, true);
          counter += 1;
          threats.splice(i, 1);
          continue;
        }
        // strong threat pierces the outer layer → SOC responds
        if (th.strong && !th.responded && th.dist <= R[2]) {
          th.responded = true;
          flares.push({ ring: 2, ang: th.ang, life: 1, danger: true });
          pulses.push({ r: 30, spd: 340, target: th, ang: th.ang });
          alert = 1;
          whiteHot = 1;
        }
        // safety net: never let a threat touch the core
        if (th.strong && th.dist <= R[0]) {
          burst(x, y, 18, true);
          shocks.push({ r: th.dist, life: 1, danger: false });
          counter += 1;
          threats.splice(i, 1);
          continue;
        }

        // draw threat — a red dart pointing at the core
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(th.ang + Math.PI);
        const size = th.strong ? 6 : 4;
        ctx.shadowBlur = 12;
        ctx.shadowColor = rgba(DANGER, 0.9);
        ctx.fillStyle = rgba(th.strong ? [255, 120, 120] : DANGER, 0.95);
        ctx.beginPath();
        ctx.moveTo(size * 1.8, 0);
        ctx.lineTo(-size, size);
        ctx.lineTo(-size * 0.4, 0);
        ctx.lineTo(-size, -size);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // reticle lock-on
        if (th.det > 0.02) {
          const b = 10 + (1 - th.det) * 20;
          ctx.strokeStyle = rgba(mix(ACCENT, ICE, 0.4), th.det * 0.9);
          ctx.lineWidth = 1;
          const corners = [
            [-1, -1],
            [1, -1],
            [1, 1],
            [-1, 1],
          ];
          for (const [sx, sy] of corners) {
            ctx.beginPath();
            ctx.moveTo(x + sx * b, y + sy * b - sy * 5);
            ctx.lineTo(x + sx * b, y + sy * b);
            ctx.lineTo(x + sx * b - sx * 5, y + sy * b);
            ctx.stroke();
          }
        }
      }

      // response pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.r += p.spd * dt;
        const tgt = p.target;
        const alive = tgt && threats.indexOf(tgt) !== -1;
        if (alive && p.r >= tgt!.dist) {
          const x = Math.cos(tgt!.ang) * tgt!.dist;
          const y = Math.sin(tgt!.ang) * tgt!.dist;
          burst(x, y, 22, false);
          shocks.push({ r: tgt!.dist, life: 1, danger: false });
          counter += 1;
          threats.splice(threats.indexOf(tgt!), 1);
          pulses.splice(i, 1);
          continue;
        }
        if (p.r > R[2] + 30 || !tgt) {
          pulses.splice(i, 1);
          continue;
        }
        // draw the outward-racing pulse arc, centred on the target bearing
        ctx.save();
        ctx.shadowBlur = 14;
        ctx.shadowColor = rgba(ICE, 0.9);
        ctx.strokeStyle = rgba(mix(ACCENT, ICE, 0.5), 0.9);
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.arc(0, 0, p.r, p.ang - 0.6, p.ang + 0.6);
        ctx.stroke();
        ctx.restore();
      }

      // shock rings
      for (let i = shocks.length - 1; i >= 0; i--) {
        const s = shocks[i];
        s.r += 460 * dt;
        s.life -= dt * 1.5;
        if (s.life <= 0) {
          shocks.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = rgba(s.danger ? DANGER : mix(ICE, ACCENT, 0.3), s.life * 0.8);
        ctx.lineWidth = 2.5 * s.life + 0.4;
        ctx.beginPath();
        ctx.arc(0, 0, s.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // the guarded core
      const coreGlow = 0.78 + 0.16 * Math.sin(t * 2.2) + (key === "secured" ? 0.25 * (1 - sp) : 0) + alert * 0.15;
      drawCore(coreGlow, whiteHot, t * 0.4, true);
      whiteHot = Math.max(0, whiteHot - dt * 2.2);

      ctx.restore();

      // sparks (screen space)
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx * unit * dt;
        s.y += s.vy * unit * dt;
        s.vy += 120 * dt;
        s.life -= dt * 1.6;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        const base = s.danger ? [255, 150, 150] : ICE;
        ctx.fillStyle = rgba(mix(base, [255, 255, 255], s.hot), s.life);
        ctx.fillRect(s.x, s.y, 2, 2);
      }

      // alert edge vignette
      if (alert > 0) {
        const eg = ctx.createRadialGradient(cx, cy, Math.min(W, H) * 0.32, cx, cy, Math.max(W, H) * 0.62);
        eg.addColorStop(0, rgba(DANGER, 0));
        eg.addColorStop(1, rgba(DANGER, alert * 0.16));
        ctx.fillStyle = eg;
        ctx.fillRect(0, 0, W, H);
        alert = Math.max(0, alert - dt * 0.7);
      }
      if (flash > 0) {
        ctx.fillStyle = rgba([255, 255, 255], flash * 0.12);
        ctx.fillRect(0, 0, W, H);
        flash -= dt * 2;
      }

      // HUD — live counter (top-right) + stage caption (bottom-centre)
      ctx.textAlign = "right";
      ctx.font = "9px 'Geist Mono', monospace";
      ctx.fillStyle = rgba([139, 147, 160], 0.85);
      ctx.fillText(labels.counter.toUpperCase(), W - 24, H - 44);
      ctx.font = "600 15px 'Geist Mono', monospace";
      ctx.fillStyle = rgba(ICE, 0.92);
      ctx.fillText(fmt(counter), W - 24, H - 26);

      const caption = labels[key].toUpperCase();
      const ca = stageAlpha(sp);
      ctx.textAlign = "center";
      ctx.font = "600 13px 'Geist Mono', monospace";
      const capColor = key === "respond" ? mix(DANGER, ICE, 0.25) : ICE;
      // letter-spaced caption
      const spaced = caption.split("").join(" ");
      ctx.fillStyle = rgba(capColor, ca * 0.95);
      ctx.fillText(spaced, cx, H - 30);
      // progress underline
      const w = Math.min(220, ctx.measureText(spaced).width);
      ctx.strokeStyle = rgba(capColor, ca * 0.5);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - w / 2, H - 20);
      ctx.lineTo(cx - w / 2 + w * sp, H - 20);
      ctx.stroke();

      raf = requestAnimationFrame(loop);
    };

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [still, labels]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
