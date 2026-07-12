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
   Core Defense — an opt-in arcade interlude before Contact that
   extends the Cyber Security story. Wave-based tower-defense-lite:
   red threats converge on the studio's accent core; click/tap to
   neutralise them. Depth: four threat classes, a combo multiplier,
   a Pulse shockwave ability, repair drops, escalating waves, and a
   clearance rank at the end. Game over feeds the Contact CTA.

   One IO-paused 2D canvas, single rAF, DPR-capped, accent-driven.
   Nothing runs until Initialize; reduced motion shows invite + CTA.
   ============================================================ */

const RED = { r: 255, g: 80, b: 64 };
const RED2 = { r: 255, g: 150, b: 60 }; // fast
const MAG = { r: 255, g: 70, b: 150 }; // splitter
const REPAIR = { r: 70, g: 230, b: 150 };

type Kind = "basic" | "fast" | "armor" | "split";
type Threat = {
  x: number; y: number; vx: number; vy: number; r: number;
  hp: number; kind: Kind; seed: number; born: number;
};
type Particle = { x: number; y: number; vx: number; vy: number; life: number; c: { r: number; g: number; b: number } };
type Popup = { x: number; y: number; life: number; text: string; big: boolean };
type Pickup = { x: number; y: number; vx: number; vy: number; life: number };

type Phase = "idle" | "playing" | "over";

const PULSE_CD = 6; // seconds
const COMBO_WINDOW = 2.2;

export function CoreDefense() {
  const c = useContent().game;
  const reducedPref = useReducedMotion();
  const perf = usePerf();
  const disabled = !!reducedPref || perf;

  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState({ score: 0, wave: 1, rank: 0 });
  const [best, setBest] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scoreElRef = useRef<HTMLSpanElement>(null);
  const comboElRef = useRef<HTMLSpanElement>(null);
  const waveElRef = useRef<HTMLSpanElement>(null);
  const barElRef = useRef<HTMLDivElement>(null);
  const pulseBtnRef = useRef<HTMLButtonElement>(null);
  const pulseFillRef = useRef<HTMLSpanElement>(null);
  const phaseRef = useRef<Phase>("idle");
  const doPulseRef = useRef<() => void>(() => {});

  useEffect(() => {
    try {
      const b = parseInt(localStorage.getItem("ardlabs-coredef-best") || "0", 10);
      if (!Number.isNaN(b)) setBest(b);
    } catch {}
  }, []);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0, cx = 0, cy = 0, coreR = 26;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height; cx = W / 2; cy = H / 2;
      coreR = Math.max(20, Math.min(30, Math.min(W, H) * 0.06));
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let A = accentRGB();
    const unsubAccent = onAccent(() => (A = accentRGB()));

    // --- game state ---
    const threats: Threat[] = [];
    const particles: Particle[] = [];
    const popups: Popup[] = [];
    const pickups: Pickup[] = [];
    let integrity = 100;
    let score = 0;
    let combo = 0;
    let comboT = 0;
    let wave = 1;
    let waveT = 0;
    let elapsed = 0;
    let spawnAcc = 0;
    let pickupAcc = 0;
    let shake = 0;
    let coreFlash = 0;
    let pulseCd = 0;
    let shock: { r: number; life: number } | null = null;
    let countdown = 0;
    let banner = { t: 0, text: "" };
    let raf = 0, last = 0, onScreen = true;
    const mouse = { x: -999, y: -999 };

    const reset = () => {
      threats.length = 0; particles.length = 0; popups.length = 0; pickups.length = 0;
      integrity = 100; score = 0; combo = 0; comboT = 0; wave = 1; waveT = 0;
      elapsed = 0; spawnAcc = 0; pickupAcc = 0; shake = 0; coreFlash = 0;
      pulseCd = 0; shock = null; countdown = 3.2; banner = { t: 0, text: "" };
    };

    const setHud = () => {
      if (scoreElRef.current) scoreElRef.current.textContent = String(score);
      if (comboElRef.current) comboElRef.current.textContent = combo > 1 ? `×${1 + Math.floor(combo / 4)}` : "—";
      if (waveElRef.current) waveElRef.current.textContent = String(wave);
      if (barElRef.current) barElRef.current.style.width = `${Math.max(0, integrity)}%`;
    };

    const mult = () => 1 + Math.floor(combo / 4);

    const addScore = (n: number, x: number, y: number, withCombo: boolean) => {
      const m = withCombo ? mult() : 1;
      const gain = n * m;
      score += gain;
      popups.push({ x, y, life: 1, text: `+${gain}${m > 1 ? ` ×${m}` : ""}`, big: m > 1 });
      if (withCombo) { combo++; comboT = COMBO_WINDOW; }
    };

    const burst = (x: number, y: number, col: { r: number; g: number; b: number }, n: number, spread = 150) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * 6.2832;
        const s = 40 + Math.random() * spread;
        particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, c: col });
      }
    };

    const colOf = (k: Kind) => (k === "fast" ? RED2 : k === "split" ? MAG : RED);

    const spawnThreat = (kind?: Kind) => {
      // pick a class allowed by the current wave
      if (!kind) {
        const pool: Kind[] = ["basic"];
        if (wave >= 2) pool.push("fast");
        if (wave >= 3) pool.push("armor");
        if (wave >= 4) pool.push("split");
        kind = pool[(Math.random() * pool.length) | 0];
      }
      const edge = Math.random();
      let x, y;
      if (edge < 0.5) { x = Math.random() * W; y = Math.random() < 0.5 ? -14 : H + 14; }
      else { x = Math.random() < 0.5 ? -14 : W + 14; y = Math.random() * H; }
      const ang = Math.atan2(cy - y, cx - x) + (Math.random() - 0.5) * 0.22;
      const base = 42 + wave * 6 + Math.min(40, elapsed * 1.5);
      const km = kind === "fast" ? 1.7 : kind === "armor" ? 0.72 : 1;
      const sp = base * km * (0.85 + Math.random() * 0.4);
      threats.push({
        x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
        r: kind === "armor" ? 12 : kind === "fast" ? 6 : kind === "split" ? 10 : 8,
        hp: kind === "armor" ? 2 : 1, kind, seed: Math.random() * 6.28, born: elapsed,
      });
    };

    const killThreat = (i: number, byPulse = false) => {
      const t = threats[i];
      const col = colOf(t.kind);
      burst(t.x, t.y, byPulse ? A : col, t.kind === "armor" ? 16 : 10);
      addScore(t.kind === "armor" ? 30 : t.kind === "fast" ? 15 : t.kind === "split" ? 20 : 10, t.x, t.y, !byPulse);
      if (t.kind === "split") {
        // fragment into two fast shards aimed back at the core
        for (let s = 0; s < 2; s++) {
          const a = Math.atan2(cy - t.y, cx - t.x) + (s === 0 ? -0.6 : 0.6);
          const sp = 120;
          threats.push({ x: t.x, y: t.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: 6, hp: 1, kind: "fast", seed: Math.random() * 6.28, born: elapsed });
        }
      }
      threats.splice(i, 1);
    };

    const hitAt = (px: number, py: number) => {
      if (phaseRef.current !== "playing" || countdown > 0) return;
      // repair pickups first
      for (let i = pickups.length - 1; i >= 0; i--) {
        const p = pickups[i];
        if ((p.x - px) ** 2 + (p.y - py) ** 2 < 26 * 26) {
          integrity = Math.min(100, integrity + 18);
          burst(p.x, p.y, REPAIR, 14);
          popups.push({ x: p.x, y: p.y, life: 1, text: "+REPAIR", big: true });
          pickups.splice(i, 1);
          audio.success();
          setHud();
          return;
        }
      }
      let bi = -1, bd = 34 * 34;
      for (let i = 0; i < threats.length; i++) {
        const t = threats[i];
        const d = (t.x - px) ** 2 + (t.y - py) ** 2;
        if (d < bd) { bd = d; bi = i; }
      }
      if (bi >= 0) {
        const t = threats[bi];
        t.hp--;
        if (t.hp > 0) {
          // armor shrug — shield crack
          burst(t.x, t.y, colOf(t.kind), 5, 60);
          shake = Math.max(shake, 3);
          audio.hover();
        } else {
          killThreat(bi);
          audio.click();
        }
        setHud();
      }
    };

    const doPulse = () => {
      if (phaseRef.current !== "playing" || countdown > 0 || pulseCd > 0) return;
      shock = { r: coreR, life: 1 };
      pulseCd = PULSE_CD;
      shake = Math.max(shake, 6);
      audio.whoosh();
    };
    doPulseRef.current = doPulse;

    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      hitAt(e.clientX - r.left, e.clientY - r.top);
    };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    };
    const onLeave = () => { mouse.x = -999; mouse.y = -999; };
    canvas.addEventListener("pointerdown", onPointer);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting));
    io.observe(canvas);

    const endGame = () => {
      burst(cx, cy, RED, 50, 220);
      shake = 16;
      const RANKS = [20, 55, 110, 190];
      let rank = 0;
      while (rank < RANKS.length && score >= RANKS[rank]) rank++;
      setResult({ score, wave, rank });
      setBest((prev) => {
        const nb = Math.max(prev, score);
        try { localStorage.setItem("ardlabs-coredef-best", String(nb)); } catch {}
        return nb;
      });
      setPhase("over");
    };

    const update = (dt: number) => {
      elapsed += dt;

      if (countdown > 0) {
        countdown -= dt;
        if (countdown <= 0) { banner = { t: 1.1, text: "GO" }; }
        return;
      }

      // waves
      waveT += dt;
      if (waveT > 16) {
        waveT = 0; wave++;
        banner = { t: 1.4, text: `WAVE ${wave}` };
        setHud();
      }

      // combo decay
      if (comboT > 0) { comboT -= dt; if (comboT <= 0) { combo = 0; setHud(); } }

      // spawns
      spawnAcc += dt;
      const rate = Math.max(0.32, 0.95 - wave * 0.06 - elapsed * 0.006);
      while (spawnAcc >= rate) { spawnAcc -= rate; spawnThreat(); if (wave >= 3 && Math.random() < 0.25) spawnThreat(); }

      // repair drops
      pickupAcc += dt;
      if (pickupAcc > 12 && integrity < 85 && pickups.length === 0) {
        pickupAcc = 0;
        const fromLeft = Math.random() < 0.5;
        pickups.push({ x: fromLeft ? -20 : W + 20, y: 40 + Math.random() * (H - 80), vx: (fromLeft ? 1 : -1) * (36 + Math.random() * 20), vy: 0, life: 1 });
      }

      // pulse cooldown
      if (pulseCd > 0) {
        pulseCd = Math.max(0, pulseCd - dt);
        if (pulseFillRef.current) pulseFillRef.current.style.height = `${(1 - pulseCd / PULSE_CD) * 100}%`;
        if (pulseBtnRef.current) pulseBtnRef.current.dataset.ready = pulseCd === 0 ? "1" : "0";
      }

      // shockwave
      if (shock) {
        shock.r += 520 * dt;
        shock.life -= dt * 1.1;
        for (let i = threats.length - 1; i >= 0; i--) {
          const t = threats[i];
          const d = Math.hypot(t.x - cx, t.y - cy);
          if (Math.abs(d - shock.r) < 26) killThreat(i, true);
        }
        if (shock.life <= 0) shock = null;
      }

      // move threats + core collision
      for (let i = threats.length - 1; i >= 0; i--) {
        const t = threats[i];
        t.x += t.vx * dt; t.y += t.vy * dt;
        if ((t.x - cx) ** 2 + (t.y - cy) ** 2 < (coreR + t.r) ** 2) {
          threats.splice(i, 1);
          integrity -= t.kind === "armor" ? 16 : 11;
          combo = 0; comboT = 0; shake = 13; coreFlash = 1;
          burst(t.x, t.y, RED, 10);
          audio.whoosh();
          setHud();
          if (integrity <= 0) { endGame(); return; }
        }
      }

      // move pickups
      for (let i = pickups.length - 1; i >= 0; i--) {
        const p = pickups[i];
        p.x += p.vx * dt;
        if (p.x < -40 || p.x > W + 40) pickups.splice(i, 1);
      }

      // particles / popups
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= dt * 1.7;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.92; p.vy *= 0.92;
      }
      for (let i = popups.length - 1; i >= 0; i--) {
        const p = popups[i];
        p.life -= dt * 1.1; p.y -= 26 * dt;
        if (p.life <= 0) popups.splice(i, 1);
      }
      if (banner.t > 0) banner.t -= dt;
      coreFlash = Math.max(0, coreFlash - dt * 2.5);
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const sx = shake ? (Math.random() - 0.5) * shake : 0;
      const sy = shake ? (Math.random() - 0.5) * shake : 0;
      shake *= 0.86;
      ctx.save();
      ctx.translate(sx, sy);

      // grid
      ctx.strokeStyle = `rgba(${A.r},${A.g},${A.b},0.05)`;
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = (elapsed * 8) % step; x < W; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      // core glow
      ctx.globalCompositeOperation = "lighter";
      const gcol = coreFlash > 0.1 ? RED : A;
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 3.2);
      cg.addColorStop(0, `rgba(${gcol.r},${gcol.g},${gcol.b},${0.5 + coreFlash * 0.4})`);
      cg.addColorStop(1, `rgba(${gcol.r},${gcol.g},${gcol.b},0)`);
      ctx.fillStyle = cg;
      ctx.beginPath(); ctx.arc(cx, cy, coreR * 3.2, 0, 6.2832); ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      // shockwave ring
      if (shock) {
        ctx.strokeStyle = `rgba(${A.r},${A.g},${A.b},${0.5 * shock.life})`;
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(cx, cy, shock.r, 0, 6.2832); ctx.stroke();
      }

      // core body
      const pulse = 1 + Math.sin(elapsed * 3) * 0.06;
      ctx.fillStyle = coreFlash > 0.1 ? `rgb(${RED.r},${RED.g},${RED.b})` : `rgb(${A.r},${A.g},${A.b})`;
      ctx.beginPath(); ctx.arc(cx, cy, coreR * pulse, 0, 6.2832); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.beginPath(); ctx.arc(cx, cy, coreR * 0.42, 0, 6.2832); ctx.fill();
      // integrity ring
      const ip = Math.max(0, integrity) / 100;
      ctx.strokeStyle = ip < 0.3 ? `rgb(${RED.r},${RED.g},${RED.b})` : `rgba(${A.r},${A.g},${A.b},0.85)`;
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(cx, cy, coreR + 9, -1.5708, -1.5708 + 6.2832 * ip); ctx.stroke();

      // pickups
      for (const p of pickups) {
        ctx.globalCompositeOperation = "lighter";
        const pg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 20);
        pg.addColorStop(0, `rgba(${REPAIR.r},${REPAIR.g},${REPAIR.b},0.6)`);
        pg.addColorStop(1, `rgba(${REPAIR.r},${REPAIR.g},${REPAIR.b},0)`);
        ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(p.x, p.y, 20, 0, 6.2832); ctx.fill();
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = `rgb(${REPAIR.r},${REPAIR.g},${REPAIR.b})`; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, 6.2832); ctx.stroke();
        ctx.fillStyle = `rgb(${REPAIR.r},${REPAIR.g},${REPAIR.b})`;
        ctx.fillRect(p.x - 5, p.y - 1, 10, 2); ctx.fillRect(p.x - 1, p.y - 5, 2, 10);
      }

      // threats
      for (const t of threats) {
        const col = colOf(t.kind);
        const tw = 0.72 + 0.28 * Math.sin(elapsed * 8 + t.seed);
        // aim line
        ctx.strokeStyle = `rgba(${col.r},${col.g},${col.b},0.12)`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(t.x, t.y); ctx.lineTo(cx, cy); ctx.stroke();
        // body
        ctx.fillStyle = `rgba(${col.r},${col.g},${col.b},${tw})`;
        ctx.beginPath(); ctx.arc(t.x, t.y, t.r, 0, 6.2832); ctx.fill();
        // armor shield ring (while hp>1)
        if (t.kind === "armor" && t.hp > 1) {
          ctx.strokeStyle = `rgba(255,255,255,0.7)`; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(t.x, t.y, t.r + 4, 0, 6.2832); ctx.stroke();
        }
        // splitter marker
        if (t.kind === "split") {
          ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(t.x - 4, t.y); ctx.lineTo(t.x + 4, t.y); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(t.x, t.y - 4); ctx.lineTo(t.x, t.y + 4); ctx.stroke();
        }
      }

      // particles
      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) {
        ctx.fillStyle = `rgba(${p.c.r},${p.c.g},${p.c.b},${p.life})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, 2.2 * p.life + 0.5, 0, 6.2832); ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      // score popups
      ctx.textAlign = "center";
      for (const p of popups) {
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.big ? `rgb(${A.r},${A.g},${A.b})` : "rgba(244,246,248,0.9)";
        ctx.font = `${p.big ? 600 : 500} ${p.big ? 15 : 12}px "Geist Mono", monospace`;
        ctx.fillText(p.text, p.x, p.y);
      }
      ctx.globalAlpha = 1;

      // reticle (desktop)
      if (mouse.x > 0 && phaseRef.current === "playing") {
        ctx.strokeStyle = `rgba(${A.r},${A.g},${A.b},0.6)`; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 12, 0, 6.2832); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(mouse.x - 18, mouse.y); ctx.lineTo(mouse.x - 6, mouse.y);
        ctx.moveTo(mouse.x + 6, mouse.y); ctx.lineTo(mouse.x + 18, mouse.y);
        ctx.moveTo(mouse.x, mouse.y - 18); ctx.lineTo(mouse.x, mouse.y - 6);
        ctx.moveTo(mouse.x, mouse.y + 6); ctx.lineTo(mouse.x, mouse.y + 18); ctx.stroke();
      }

      // countdown / banner
      if (countdown > 0) {
        const n = Math.ceil(countdown - 0.2);
        ctx.textAlign = "center";
        ctx.fillStyle = `rgba(${A.r},${A.g},${A.b},0.9)`;
        ctx.font = `700 64px "Geist", sans-serif`;
        ctx.fillText(String(Math.max(1, n)), cx, cy - coreR * 3);
      } else if (banner.t > 0) {
        ctx.textAlign = "center";
        ctx.globalAlpha = Math.min(1, banner.t);
        ctx.fillStyle = "rgba(244,246,248,0.95)";
        ctx.font = `600 22px "Geist Mono", monospace`;
        ctx.fillText(banner.text, cx, 40);
        ctx.globalAlpha = 1;
      }

      ctx.restore();
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!onScreen) return;
      if (phaseRef.current === "playing") update(dt);
      draw();
    };

    (canvas as unknown as { __reset?: () => void }).__reset = () => { reset(); setHud(); if (pulseFillRef.current) pulseFillRef.current.style.height = "0%"; };

    last = performance.now();
    raf = requestAnimationFrame(loop);

    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" && phaseRef.current === "playing") { e.preventDefault(); doPulse(); }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect(); unsubAccent();
      canvas.removeEventListener("pointerdown", onPointer);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const start = () => {
    (canvasRef.current as unknown as { __reset?: () => void } | null)?.__reset?.();
    setPhase("playing");
    audio.whoosh();
  };

  const overlay = phase !== "playing" || disabled;

  return (
    <section id="arcade" className="relative z-10 scroll-mt-24 bg-void py-28 md:py-36">
      <div className="container-x relative">
        <ChapterNumeral n="06" label="INTERLUDE" />
      </div>

      <div className="container-x relative grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,36%)_minmax(0,64%)]">
        {/* copy + HUD */}
        <div className="relative">
          <Reveal><span className="eyebrow">{c.eyebrow}</span></Reveal>
          <Reveal delay={0.08}><h2 className="text-section-title text-chalk mt-5">{c.title}</h2></Reveal>
          <Reveal delay={0.16}><p className="text-lead mt-5 max-w-md">{c.intro}</p></Reveal>

          <Reveal delay={0.22}>
            <div className="mt-8 grid max-w-md grid-cols-3 gap-x-6 gap-y-6">
              <Stat label={c.hudScore}><span ref={scoreElRef}>0</span></Stat>
              <Stat label={c.hudCombo} accent><span ref={comboElRef}>—</span></Stat>
              <Stat label={c.hudWave}><span ref={waveElRef}>1</span></Stat>
              <div className="col-span-2">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div ref={barElRef} className="h-full rounded-full bg-accent" style={{ width: "100%" }} />
                </div>
                <p className="mt-2 font-mono text-[0.55rem] uppercase tracking-[0.24em] text-fog">{c.hudIntegrity}</p>
              </div>
              {/* pulse ability */}
              <button
                ref={pulseBtnRef}
                onClick={() => doPulseRef.current()}
                disabled={overlay}
                title={c.pulseHint}
                className="group relative flex h-full min-h-[3rem] items-center justify-center overflow-hidden rounded-lg border border-accent/30 bg-accent/[0.06] font-mono text-[0.6rem] uppercase tracking-[0.2em] text-accent transition-colors hover:bg-accent/[0.12] disabled:opacity-40"
              >
                <span ref={pulseFillRef} aria-hidden className="absolute inset-x-0 bottom-0 block bg-accent/25" style={{ height: "0%" }} />
                <span className="relative">{c.pulse}</span>
              </button>
            </div>
          </Reveal>

          <Reveal delay={0.28}>
            <p className="mt-4 flex items-center gap-2 font-mono text-[0.55rem] uppercase tracking-[0.22em] text-fog/70">
              <span className="text-mist">{c.best}</span> {best}
            </p>
          </Reveal>
        </div>

        {/* arena */}
        <Reveal delay={0.1}>
          <div className="relative overflow-hidden rounded-xl border border-chalk/10 bg-[#05070c] lit-top">
            <span aria-hidden className="pointer-events-none absolute left-3 top-3 z-10 h-4 w-4 border-l border-t border-accent/50" />
            <span aria-hidden className="pointer-events-none absolute right-3 top-3 z-10 h-4 w-4 border-r border-t border-accent/50" />
            <span aria-hidden className="pointer-events-none absolute bottom-3 left-3 z-10 h-4 w-4 border-b border-l border-accent/50" />
            <span aria-hidden className="pointer-events-none absolute bottom-3 right-3 z-10 h-4 w-4 border-b border-r border-accent/50" />

            <canvas ref={canvasRef} className="block h-[clamp(360px,60vh,560px)] w-full touch-none [cursor:crosshair]" />

            {overlay && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 bg-[#05070c]/70 p-6 text-center backdrop-blur-sm">
                {phase === "over" && !disabled && (
                  <>
                    <p className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-[#ff5040]">{c.over}</p>
                    <p className="font-display text-5xl font-semibold tabular-nums text-chalk">{result.score}</p>
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-fog">
                      {c.rankLabel} · <span className="text-accent">{(c.ranks as string[])[result.rank]}</span> · {c.hudWave} {result.wave}
                    </p>
                  </>
                )}
                <p className="max-w-xs text-sm text-mist">{c.ctaLine}</p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {!disabled && (
                    <button onClick={start} className="rounded-full bg-chalk px-6 py-2.5 text-sm font-medium text-void transition-transform duration-300 active:scale-[0.97]">
                      {phase === "over" ? c.replay : c.play}
                    </button>
                  )}
                  <button onClick={() => scrollToTarget("#contact")} className="rounded-full border border-white/15 px-6 py-2.5 text-sm text-chalk transition-colors duration-300 hover:border-accent/50 hover:text-accent-2">
                    {c.cta}
                  </button>
                </div>
                {phase === "idle" && !disabled && (
                  <p className="max-w-xs font-mono text-[0.55rem] uppercase leading-relaxed tracking-[0.22em] text-fog/70">{c.hint}</p>
                )}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Stat({ label, accent, children }: { label: string; accent?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <div className={`font-display text-3xl font-semibold tabular-nums ${accent ? "text-accent" : "text-chalk"}`}>
        {children}
      </div>
      <p className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.22em] text-fog">{label}</p>
    </div>
  );
}
