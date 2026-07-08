"use client";

import { useEffect, useRef } from "react";

/* ============================================================
   CyberDefense — a holographic defence-dome explainer for the
   studio's security practice. A single 2D canvas (no WebGL context)
   renders a rotating wireframe shield-sphere in perspective around a
   guarded core, and narrates defence-in-depth as a near-wordless,
   looping story:

     MONITOR    — the dome turns slowly in space, telemetry ticks.
     DETECT     — threats streak in from deep space; reticles lock on.
     INTERCEPT  — the dome deflects a wave; each impact sends a ripple
                  racing across the sphere; the counter climbs.
     RESPOND    — a stronger threat pierces the dome; the core fires a
                  tracking beam that neutralises it before it reaches
                  the centre; a red alert washes the edges.
     SECURED    — the whole dome flashes azure — all clear. Loop.

   Threats are red and never reach the core; the dome + core stay azure
   and hold. Perspective projection, mouse parallax, impact ripples on
   the sphere surface, threat trails, bloom/vignette. DPR-aware,
   IntersectionObserver-gated (paused offscreen), single rAF owner.
   Reduced-motion / perf mode paints a calm static dome. aria-hidden.
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
  { key: "respond", dur: 4200 },
  { key: "secured", dur: 2600 },
];

// world/design units
const RS = 150; // shield-sphere radius
const CAM = 640; // camera distance
const FOCAL = 640;
const SPAWN = 340; // threat spawn radius

type Vec3 = [number, number, number];

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
      unit = Math.min(W, H) / 460;
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
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    // --- 3D helpers ---
    let yaw = 0;
    let pitch = -0.34;
    let zoom = 1;
    const rot = (p: Vec3): Vec3 => {
      const cyaw = Math.cos(yaw);
      const syaw = Math.sin(yaw);
      const x1 = p[0] * cyaw + p[2] * syaw;
      const z1 = -p[0] * syaw + p[2] * cyaw;
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      const y2 = p[1] * cp - z1 * sp;
      const z2 = p[1] * sp + z1 * cp;
      return [x1, y2, z2];
    };
    type Proj = { x: number; y: number; z: number; s: number; vis: boolean };
    const project = (p: Vec3): Proj => {
      const denom = CAM - p[2];
      if (denom < 60) return { x: 0, y: 0, z: p[2], s: 0, vis: false };
      const s = (FOCAL / denom) * zoom;
      return { x: cx + p[0] * s * unit, y: cy + p[1] * s * unit, z: p[2], s, vis: true };
    };
    const norm = (v: Vec3): Vec3 => {
      const m = Math.hypot(v[0], v[1], v[2]) || 1;
      return [v[0] / m, v[1] / m, v[2] / m];
    };

    // --- sphere wireframe base points (unit sphere) ---
    const SEG = 54;
    const lons: Vec3[][] = [];
    for (let i = 0; i < 14; i++) {
      const lon = (i / 14) * Math.PI * 2;
      const line: Vec3[] = [];
      for (let j = 0; j <= SEG; j++) {
        const lat = -Math.PI / 2 + (j / SEG) * Math.PI;
        line.push([Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon)]);
      }
      lons.push(line);
    }
    const lats: Vec3[][] = [];
    for (let i = 1; i < 7; i++) {
      const lat = -Math.PI / 2 + (i / 7) * Math.PI;
      const line: Vec3[] = [];
      for (let j = 0; j <= SEG; j++) {
        const lon = (j / SEG) * Math.PI * 2;
        line.push([Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon)]);
      }
      lats.push(line);
    }

    const HEX = "0123456789ABCDEF<>/{}[]".split("");

    /** the guarded core: an azure padlock billboard at the centre */
    const drawCore = (glow: number, whiteHot: number, hexScroll: number, alive: boolean) => {
      const s = (FOCAL / CAM) * zoom * unit; // core sits at z=0
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(s, s);
      const tint = mix(ACCENT, [255, 255, 255], whiteHot * 0.6);
      const bodyW = 96;
      const bodyH = 74;
      const bodyTop = 6;
      const rad = 16;
      const shR = 28;

      ctx.lineCap = "round";
      ctx.shadowBlur = 26 * glow;
      ctx.shadowColor = rgba(tint, 0.9);
      ctx.strokeStyle = rgba(mix(tint, ICE, 0.35), 0.95);
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(-shR, bodyTop + 3);
      ctx.lineTo(-shR, bodyTop - 13);
      ctx.arc(0, bodyTop - 13, shR, Math.PI, 0, false);
      ctx.lineTo(shR, bodyTop + 3);
      ctx.stroke();

      const g = ctx.createLinearGradient(0, bodyTop, 0, bodyTop + bodyH);
      g.addColorStop(0, rgba(mix([10, 14, 22], tint, 0.28 + 0.24 * glow), 1));
      g.addColorStop(1, rgba([8, 10, 16], 1));
      ctx.shadowBlur = 44 * glow;
      ctx.shadowColor = rgba(tint, 0.75);
      ctx.fillStyle = g;
      roundRect(-bodyW / 2, bodyTop, bodyW, bodyH, rad);
      ctx.fill();

      ctx.lineWidth = 1.6;
      ctx.strokeStyle = rgba(mix(tint, ICE, 0.5), 0.92);
      ctx.shadowBlur = 16 * glow;
      roundRect(-bodyW / 2, bodyTop, bodyW, bodyH, rad);
      ctx.stroke();

      if (alive) {
        ctx.save();
        roundRect(-bodyW / 2 + 2, bodyTop + 2, bodyW - 4, bodyH - 4, rad - 2);
        ctx.clip();
        ctx.font = "8px 'Geist Mono', monospace";
        ctx.textAlign = "center";
        ctx.shadowBlur = 0;
        for (let i = 0; i < 4; i++) {
          const x = -bodyW / 2 + 16 + (i * (bodyW - 30)) / 3;
          for (let j = 0; j < 5; j++) {
            const y = bodyTop + ((j * 18 + hexScroll * (22 + i * 6)) % (bodyH + 18)) - 3;
            const ch = HEX[((i * 5 + j) * 131 + ((hexScroll * 6) | 0)) % HEX.length];
            ctx.fillStyle = rgba(mix(tint, ICE, 0.5), 0.12);
            ctx.fillText(ch, x, y);
          }
        }
        ctx.restore();
      }

      const khY = bodyTop + bodyH * 0.5;
      ctx.shadowBlur = 14 * glow;
      ctx.shadowColor = rgba(mix(tint, ICE, 0.5), 0.95);
      ctx.fillStyle = rgba(mix(tint, ICE, 0.62), 0.96);
      ctx.beginPath();
      ctx.arc(0, khY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-4, khY + 1);
      ctx.lineTo(4, khY + 1);
      ctx.lineTo(7, khY + 21);
      ctx.lineTo(-7, khY + 21);
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

    /** draw the rotating wireframe dome; front hemisphere brighter */
    const drawDome = (baseTint: number[], pulse: number) => {
      const draw = (lines: Vec3[][], baseAlpha: number) => {
        for (const line of lines) {
          let started = false;
          ctx.beginPath();
          let prevVis = false;
          for (let k = 0; k < line.length; k++) {
            const wp: Vec3 = [line[k][0] * RS, line[k][1] * RS, line[k][2] * RS];
            const rp = rot(wp);
            const pr = project(rp);
            if (!pr.vis) {
              prevVis = false;
              continue;
            }
            if (!started || !prevVis) {
              ctx.moveTo(pr.x, pr.y);
              started = true;
            } else {
              ctx.lineTo(pr.x, pr.y);
            }
            prevVis = true;
          }
          // alpha keyed to average depth handled by a second pass per-seg would
          // be costly; use a single stroke with mid alpha + a front overlay.
          ctx.strokeStyle = rgba(baseTint, baseAlpha);
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      };

      // depth-shaded: draw each segment individually so the front glows and the
      // back recedes — gives the sphere real volume.
      const shade = (lines: Vec3[][]) => {
        for (const line of lines) {
          for (let k = 0; k < line.length - 1; k++) {
            const a: Vec3 = [line[k][0] * RS, line[k][1] * RS, line[k][2] * RS];
            const b: Vec3 = [line[k + 1][0] * RS, line[k + 1][1] * RS, line[k + 1][2] * RS];
            const ra = rot(a);
            const rb = rot(b);
            const pa = project(ra);
            const pb = project(rb);
            if (!pa.vis || !pb.vis) continue;
            const zMid = (ra[2] + rb[2]) / 2;
            const front = (zMid + RS) / (2 * RS); // 0 back → 1 front
            const alpha = (0.06 + front * 0.32) * (0.7 + pulse * 0.6);
            ctx.strokeStyle = rgba(mix(baseTint, ICE, front * 0.4), alpha);
            ctx.lineWidth = 0.6 + front * 0.9;
            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
            ctx.stroke();
          }
        }
      };
      void draw;
      shade(lons);
      shade(lats);
    };

    /* ---------------- static fallback ---------------- */
    if (still) {
      const paint = () => {
        ctx.clearRect(0, 0, W, H);
        yaw = 0.6;
        pitch = -0.34;
        zoom = 1;
        const bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.6);
        bloom.addColorStop(0, rgba(ACCENT, 0.12));
        bloom.addColorStop(1, rgba(ACCENT, 0));
        ctx.fillStyle = bloom;
        ctx.fillRect(0, 0, W, H);
        drawDome(ACCENT, 0.5);
        drawCore(0.8, 0, 0, false);
        ctx.font = "600 11px 'Geist Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = rgba(ICE, 0.85);
        ctx.fillText(labels.secured.toUpperCase().split("").join(" "), cx, H - 30);
        vignette();
      };
      const vignette = () => {
        const vg = ctx.createRadialGradient(cx, cy, Math.min(W, H) * 0.3, cx, cy, Math.max(W, H) * 0.62);
        vg.addColorStop(0, "rgba(0,0,0,0)");
        vg.addColorStop(1, "rgba(0,0,0,0.55)");
        ctx.fillStyle = vg;
        ctx.fillRect(0, 0, W, H);
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
    type Threat = { pos: Vec3; dir: Vec3; spd: number; strong: boolean; responded: boolean; det: number; trail: Vec3[] };
    type Ripple = { axis: Vec3; age: number; danger: boolean };
    type Spark = { x: number; y: number; vx: number; vy: number; life: number; hot: number; danger: boolean };

    const threats: Threat[] = [];
    const ripples: Ripple[] = [];
    const sparks: Spark[] = [];

    let counter = 1284507 + Math.floor(Math.random() * 60000);
    let alert = 0;
    let flash = 0;
    let whiteHot = 0;
    let domePulse = 0; // all-clear flash

    let stageI = 0;
    let stageT = 0;
    let spawnAcc = 0;
    let respondSpawned = 0;

    // pointer parallax
    let tmx = 0;
    let tmy = 0;
    let mx = 0;
    let my = 0;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      tmx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      tmy = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onLeave = () => {
      tmx = 0;
      tmy = 0;
    };
    canvas.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("pointerleave", onLeave, { passive: true });

    const randDir = (): Vec3 => {
      const u = Math.random() * 2 - 1;
      const th = Math.random() * Math.PI * 2;
      const r = Math.sqrt(1 - u * u);
      return [r * Math.cos(th), u * 0.7, r * Math.sin(th)];
    };
    const spawnThreat = (strong: boolean) => {
      if (threats.length > 40) return;
      const d = randDir();
      threats.push({
        pos: [d[0] * SPAWN, d[1] * SPAWN, d[2] * SPAWN],
        dir: [-d[0], -d[1], -d[2]],
        spd: strong ? 70 + Math.random() * 16 : 120 + Math.random() * 70,
        strong,
        responded: false,
        det: 0,
        trail: [],
      });
    };

    const burstAt = (proj: Proj, n: number, danger: boolean) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 50 + Math.random() * 200;
        sparks.push({ x: proj.x, y: proj.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, hot: Math.random(), danger });
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

    const stageAlpha = (sp: number) => Math.max(0, Math.min(Math.min(1, sp / 0.14), Math.min(1, (1 - sp) / 0.14)));

    // orthonormal basis around an axis (for ripple circles)
    const basis = (n: Vec3): [Vec3, Vec3] => {
      const up: Vec3 = Math.abs(n[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
      const u = norm([n[1] * up[2] - n[2] * up[1], n[2] * up[0] - n[0] * up[2], n[0] * up[1] - n[1] * up[0]]);
      const v = norm([n[1] * u[2] - n[2] * u[1], n[2] * u[0] - n[0] * u[2], n[0] * u[1] - n[1] * u[0]]);
      return [u, v];
    };

    const loop = (now: number) => {
      raf = 0;
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;

      // parallax easing + slow auto-rotation + breathing zoom
      mx += (tmx - mx) * Math.min(1, dt * 3);
      my += (tmy - my) * Math.min(1, dt * 3);
      yaw = t * 0.16 + mx * 0.5;
      pitch = -0.34 + my * 0.28;
      zoom = 1 + 0.02 * Math.sin(t * 0.5);

      stageT += dt * 1000;
      const stage = STAGES[stageI];
      const sp = Math.min(1, stageT / stage.dur);
      if (stageT >= stage.dur) {
        stageI = (stageI + 1) % STAGES.length;
        stageT = 0;
        respondSpawned = 0;
        if (STAGES[stageI].key === "secured") {
          domePulse = 1;
          flash = 0.5;
        }
      }
      const key = stage.key;

      const rate = key === "monitor" ? 0.35 : key === "detect" ? 1.15 : key === "intercept" ? 3.3 : key === "respond" ? 0.7 : 0;
      spawnAcc += dt * rate;
      while (spawnAcc >= 1) {
        spawnAcc -= 1;
        spawnThreat(false);
      }
      if (key === "respond" && respondSpawned < 2 && stageT > respondSpawned * 1200 + 300) {
        spawnThreat(true);
        respondSpawned++;
      }

      counter += dt * (key === "intercept" ? 300 : 76);

      ctx.clearRect(0, 0, W, H);

      // background bloom
      const btint = mix(ACCENT, DANGER, alert * 0.5);
      const bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.62);
      bloom.addColorStop(0, rgba(btint, 0.1 + 0.05 * Math.sin(t * 2) + alert * 0.07 + domePulse * 0.1));
      bloom.addColorStop(1, rgba(btint, 0));
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, W, H);

      // dome (tinted slightly by alert / pulse)
      const domeTint = mix(ACCENT, DANGER, alert * 0.35);
      drawDome(domeTint, 0.5 + domePulse * 0.5);
      domePulse = Math.max(0, domePulse - dt * 1.4);

      // ripples on the sphere surface
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.age += dt;
        const alpha = Math.max(0, 1 - rp.age / 1.1);
        if (alpha <= 0) {
          ripples.splice(i, 1);
          continue;
        }
        const ang = rp.age * 2.2; // angular radius grows
        const [u, v] = basis(rp.axis);
        const col = rp.danger ? mix(DANGER, ICE, 0.2) : mix(ICE, ACCENT, 0.25);
        ctx.strokeStyle = rgba(col, alpha * 0.8);
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        let move = true;
        const N = 40;
        for (let k = 0; k <= N; k++) {
          const phi = (k / N) * Math.PI * 2;
          const ca = Math.cos(ang);
          const sa = Math.sin(ang);
          const dirp: Vec3 = [
            ca * rp.axis[0] + sa * (Math.cos(phi) * u[0] + Math.sin(phi) * v[0]),
            ca * rp.axis[1] + sa * (Math.cos(phi) * u[1] + Math.sin(phi) * v[1]),
            ca * rp.axis[2] + sa * (Math.cos(phi) * u[2] + Math.sin(phi) * v[2]),
          ];
          const rpt = rot([dirp[0] * RS, dirp[1] * RS, dirp[2] * RS]);
          const pr = project(rpt);
          if (!pr.vis || rpt[2] < -RS * 0.3) {
            move = true;
            continue;
          }
          if (move) {
            ctx.moveTo(pr.x, pr.y);
            move = false;
          } else ctx.lineTo(pr.x, pr.y);
        }
        ctx.stroke();
      }

      // threats — split into behind / front of core by depth
      const drawThreat = (th: Threat) => {
        const rp = rot(th.pos);
        const pr = project(rp);
        if (!pr.vis) return;
        // trail
        ctx.lineWidth = 1.4;
        for (let k = 1; k < th.trail.length; k++) {
          const a = project(rot(th.trail[k - 1]));
          const b = project(rot(th.trail[k]));
          if (!a.vis || !b.vis) continue;
          const fade = (k / th.trail.length) * 0.5;
          ctx.strokeStyle = rgba(DANGER, fade);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        // head
        const size = (th.strong ? 3.4 : 2.4) * pr.s;
        ctx.save();
        ctx.shadowBlur = 12;
        ctx.shadowColor = rgba(DANGER, 0.9);
        ctx.fillStyle = rgba(th.strong ? [255, 130, 130] : DANGER, 0.95);
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, Math.max(1.2, size), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        // reticle
        if (th.det > 0.03) {
          const b = (10 + (1 - th.det) * 22) * pr.s;
          ctx.strokeStyle = rgba(mix(ACCENT, ICE, 0.4), th.det * 0.85);
          ctx.lineWidth = 1;
          for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]] as const) {
            ctx.beginPath();
            ctx.moveTo(pr.x + sx * b, pr.y + sy * b - sy * 5);
            ctx.lineTo(pr.x + sx * b, pr.y + sy * b);
            ctx.lineTo(pr.x + sx * b - sx * 5, pr.y + sy * b);
            ctx.stroke();
          }
        }
      };

      // update threats
      const behind: Threat[] = [];
      const front: Threat[] = [];
      for (let i = threats.length - 1; i >= 0; i--) {
        const th = threats[i];
        th.pos[0] += th.dir[0] * th.spd * dt;
        th.pos[1] += th.dir[1] * th.spd * dt;
        th.pos[2] += th.dir[2] * th.spd * dt;
        th.trail.push([th.pos[0], th.pos[1], th.pos[2]]);
        if (th.trail.length > 9) th.trail.shift();
        const dist = Math.hypot(th.pos[0], th.pos[1], th.pos[2]);
        if (dist < SPAWN * 0.86) th.det = Math.min(1, th.det + dt * 3.2);

        // weak threat deflected at the dome
        if (!th.strong && dist <= RS) {
          ripples.push({ axis: norm(th.pos), age: 0, danger: true });
          burstAt(project(rot(th.pos)), 8, true);
          counter += 1;
          threats.splice(i, 1);
          continue;
        }
        // strong threat pierces → core responds
        if (th.strong && !th.responded && dist <= RS) {
          th.responded = true;
          ripples.push({ axis: norm(th.pos), age: 0, danger: true });
          alert = 1;
          whiteHot = 1;
        }
        // neutralise a pierced threat before it reaches the core
        if (th.strong && dist <= RS * 0.5) {
          burstAt(project(rot(th.pos)), 20, false);
          whiteHot = 1;
          counter += 1;
          threats.splice(i, 1);
          continue;
        }
        (rot(th.pos)[2] < 0 ? behind : front).push(th);
      }

      // response beams (core → pierced threats)
      const beam = (th: Threat) => {
        const pr = project(rot(th.pos));
        const core = project(rot([0, 0, 0]));
        if (!pr.vis) return;
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = rgba(ICE, 0.9);
        ctx.strokeStyle = rgba(mix(ACCENT, ICE, 0.5), 0.8);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(core.x, core.y);
        ctx.lineTo(pr.x, pr.y);
        ctx.stroke();
        ctx.restore();
      };

      behind.forEach(drawThreat);

      // core (between back and front hemisphere threats)
      const coreGlow = 0.8 + 0.14 * Math.sin(t * 2.2) + (key === "secured" ? 0.3 * (1 - sp) : 0) + alert * 0.15 + domePulse * 0.3;
      drawCore(coreGlow, whiteHot, t * 0.4, true);
      whiteHot = Math.max(0, whiteHot - dt * 2.2);

      front.forEach(drawThreat);
      threats.forEach((th) => {
        if (th.strong && th.responded) beam(th);
      });

      // sparks (screen space)
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx * unit * dt;
        s.y += s.vy * unit * dt;
        s.vy += 100 * dt;
        s.life -= dt * 1.6;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        const base = s.danger ? [255, 150, 150] : ICE;
        ctx.fillStyle = rgba(mix(base, [255, 255, 255], s.hot), s.life);
        ctx.fillRect(s.x, s.y, 2, 2);
      }

      // alert edge wash
      if (alert > 0) {
        const eg = ctx.createRadialGradient(cx, cy, Math.min(W, H) * 0.3, cx, cy, Math.max(W, H) * 0.62);
        eg.addColorStop(0, rgba(DANGER, 0));
        eg.addColorStop(1, rgba(DANGER, alert * 0.17));
        ctx.fillStyle = eg;
        ctx.fillRect(0, 0, W, H);
        alert = Math.max(0, alert - dt * 0.65);
      }
      if (flash > 0) {
        ctx.fillStyle = rgba([255, 255, 255], flash * 0.12);
        ctx.fillRect(0, 0, W, H);
        flash -= dt * 2;
      }

      // vignette
      const vg = ctx.createRadialGradient(cx, cy, Math.min(W, H) * 0.32, cx, cy, Math.max(W, H) * 0.62);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(0,0,0,0.5)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);

      // HUD — live counter + stage caption. Scale + declutter on narrow canvases.
      const hud = Math.max(0.66, Math.min(1, W / 640));
      const narrow = W < 540;
      ctx.textAlign = "right";
      ctx.font = `${9 * hud}px 'Geist Mono', monospace`;
      ctx.fillStyle = rgba([139, 147, 160], 0.85);
      ctx.fillText(labels.counter.toUpperCase(), W - 20, H - 42 * hud);
      ctx.font = `600 ${15 * hud}px 'Geist Mono', monospace`;
      ctx.fillStyle = rgba(ICE, 0.92);
      ctx.fillText(fmt(counter), W - 20, H - 24 * hud);

      const caption = narrow ? labels[key].toUpperCase() : labels[key].toUpperCase().split("").join(" ");
      const ca = stageAlpha(sp);
      ctx.textAlign = narrow ? "left" : "center";
      ctx.font = `600 ${13 * hud}px 'Geist Mono', monospace`;
      const capColor = key === "respond" ? mix(DANGER, ICE, 0.25) : ICE;
      const capX = narrow ? 20 : cx;
      ctx.fillStyle = rgba(capColor, ca * 0.95);
      ctx.fillText(caption, capX, H - 26 * hud);
      const w = Math.min(narrow ? 150 : 240, ctx.measureText(caption).width);
      const ux = narrow ? 20 : cx - w / 2;
      ctx.strokeStyle = rgba(capColor, ca * 0.5);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(ux, H - 16 * hud);
      ctx.lineTo(ux + w * sp, H - 16 * hud);
      ctx.stroke();

      raf = requestAnimationFrame(loop);
    };

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [still, labels]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
