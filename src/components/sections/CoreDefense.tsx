"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { track } from "@vercel/analytics";
import { useContent } from "@/lib/content";
import { usePerf } from "@/lib/perf";
import { audio } from "@/lib/audio";
import { accentRGB, onAccent } from "@/lib/accent";
import { toast, copyText } from "@/lib/toast";
import { SITE } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { ChapterNumeral } from "@/components/ui/ChapterNumeral";
import { scrollToTarget } from "@/components/layout/SmoothScroll";

/* ============================================================
   Core Defense — the flagship opt-in arcade interlude before
   Contact. Wave-based defense with real depth: four threat
   classes + bosses, an auto-turret, two abilities (Pulse /
   Overclock), a combo multiplier, repair drops, roguelite
   between-wave upgrades, and a clearance rank. All on one
   IO-paused 2D canvas, single rAF, DPR-capped, accent-driven.
   Nothing runs until Initialize; reduced motion → invite + CTA.
   ============================================================ */

const RED = { r: 255, g: 80, b: 64 };
const RED2 = { r: 255, g: 150, b: 60 };
const MAG = { r: 255, g: 70, b: 150 };
const BOSSC = { r: 255, g: 60, b: 100 };
const SHOOT = { r: 255, g: 210, b: 70 };
const REPAIR = { r: 70, g: 230, b: 150 };
type RGB = { r: number; g: number; b: number };

type Kind = "basic" | "fast" | "armor" | "split" | "shooter" | "boss";
type Threat = {
  x: number; y: number; px: number; py: number; vx: number; vy: number;
  r: number; hp: number; maxHp: number; kind: Kind; seed: number; ft: number;
};
type Particle = { x: number; y: number; vx: number; vy: number; life: number; c: RGB };
type Popup = { x: number; y: number; life: number; text: string; big: boolean };
type Pickup = { x: number; vx: number; baseY: number };
type Beam = { x1: number; y1: number; x2: number; y2: number; life: number };
type Proj = { x: number; y: number; vx: number; vy: number };
type Star = { x: number; y: number; z: number };

type Phase = "idle" | "playing" | "upgrade" | "over";

/** Tiny haptic tap on supporting devices — no-op elsewhere. */
const buzz = (pattern: number | number[]) => {
  try { navigator.vibrate?.(pattern); } catch {}
};

const PULSE_CD = 6;
const OC_CD = 12;
const PURGE_CD = 26;
const COMBO_WINDOW = 2.2;
const WAVE_TIME = 14;
const MILESTONES: [number, string][] = [[5, "RAMPAGE"], [10, "OVERLOAD"], [18, "UNSTOPPABLE"], [30, "GODLIKE"]];

export function CoreDefense() {
  const c = useContent().game;
  const reducedPref = useReducedMotion();
  const perf = usePerf();
  const disabled = !!reducedPref || perf;

  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState({ score: 0, wave: 1, rank: 0 });
  const [best, setBest] = useState(0);
  const [bestWave, setBestWave] = useState(1);
  const [runs, setRuns] = useState<{ s: number; w: number }[]>([]);
  const [choices, setChoices] = useState<number[]>([]);
  const [hard, setHard] = useState(false);
  const hardRef = useRef(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scoreElRef = useRef<HTMLSpanElement>(null);
  const comboElRef = useRef<HTMLSpanElement>(null);
  const waveElRef = useRef<HTMLSpanElement>(null);
  const barElRef = useRef<HTMLDivElement>(null);
  const pulseFillRef = useRef<HTMLSpanElement>(null);
  const ocFillRef = useRef<HTMLSpanElement>(null);
  const purgeFillRef = useRef<HTMLSpanElement>(null);
  // duplicate cooldown gauges for the floating touch controls on the canvas
  const pulseFillMRef = useRef<HTMLSpanElement>(null);
  const ocFillMRef = useRef<HTMLSpanElement>(null);
  const purgeFillMRef = useRef<HTMLSpanElement>(null);
  const phaseRef = useRef<Phase>("idle");
  const doPulseRef = useRef<() => void>(() => {});
  const doOcRef = useRef<() => void>(() => {});
  const doPurgeRef = useRef<() => void>(() => {});
  const applyUpgradeRef = useRef<(i: number) => void>(() => {});

  useEffect(() => {
    try {
      const b = parseInt(localStorage.getItem("ardlabs-coredef-best") || "0", 10);
      if (!Number.isNaN(b)) setBest(b);
      const w = parseInt(localStorage.getItem("ardlabs-coredef-wave") || "1", 10);
      if (!Number.isNaN(w)) setBestWave(w);
      const r = JSON.parse(localStorage.getItem("ardlabs-coredef-runs") || "[]");
      if (Array.isArray(r)) setRuns(r.filter((x) => typeof x?.s === "number" && typeof x?.w === "number").slice(0, 5));
    } catch {}
  }, []);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  useEffect(() => {
    hardRef.current = hard;
  }, [hard]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0, cx = 0, cy = 0, coreR = 26;
    const stars: Star[] = [];

    const seedStars = () => {
      stars.length = 0;
      const n = Math.round((W * H) / 9000);
      for (let i = 0; i < n; i++) stars.push({ x: Math.random() * W, y: Math.random() * H, z: 0.2 + Math.random() * 0.8 });
    };
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height; cx = W / 2; cy = H / 2;
      coreR = Math.max(20, Math.min(30, Math.min(W, H) * 0.06));
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedStars();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let A = accentRGB();
    const unsubAccent = onAccent(() => (A = accentRGB()));

    // --- state ---
    const threats: Threat[] = [];
    const particles: Particle[] = [];
    const popups: Popup[] = [];
    const pickups: Pickup[] = [];
    const beams: Beam[] = [];
    const projs: Proj[] = [];
    let integrity = 100;
    let score = 0, combo = 0, comboT = 0, comboTier = 0;
    let wave = 1, waveT = 0, waveDmg = false;
    let elapsed = 0, spawnAcc = 0, pickupAcc = 0, turretT = 0, bossMinT = 0;
    let shake = 0, coreFlash = 0, slowT = 0, flashT = 0;
    let pulseCd = 0, ocCd = 0, purgeCd = 0;
    let shock: { r: number; life: number } | null = null;
    let countdown = 0;
    let banner = { t: 0, text: "" };
    let raf = 0, last = 0, onScreen = true;
    let dmgMul = 1, spawnMul = 1, scoreMul = 1;
    const mouse = { x: -999, y: -999 };
    // upgradeable params
    const P = { maxInteg: 100, cdMul: 1, turretBase: 2.4, hitR: 34, pulseScale: 1 };

    const reset = () => {
      threats.length = particles.length = popups.length = pickups.length = beams.length = projs.length = 0;
      integrity = 100; score = 0; combo = 0; comboT = 0; comboTier = 0; wave = 1; waveT = 0; waveDmg = false;
      elapsed = 0; spawnAcc = 0; pickupAcc = 0; turretT = 0; bossMinT = 0;
      shake = 0; coreFlash = 0; slowT = 0; flashT = 0; pulseCd = 0; ocCd = 0; purgeCd = 0; shock = null;
      countdown = 3.2; banner = { t: 0, text: "" };
      P.maxInteg = 100; P.cdMul = 1; P.turretBase = 2.4; P.hitR = 34; P.pulseScale = 1;
      const h = hardRef.current;
      dmgMul = h ? 1.5 : 1; spawnMul = h ? 1.35 : 1; scoreMul = h ? 1.5 : 1;
    };

    const setHud = () => {
      if (scoreElRef.current) scoreElRef.current.textContent = String(score);
      if (comboElRef.current) comboElRef.current.textContent = combo > 3 ? `×${1 + Math.floor(combo / 4)}` : "—";
      if (waveElRef.current) waveElRef.current.textContent = String(wave);
      if (barElRef.current) barElRef.current.style.width = `${Math.max(0, (integrity / P.maxInteg) * 100)}%`;
    };
    const mult = () => 1 + Math.floor(combo / 4);
    const addScore = (n: number, x: number, y: number, withCombo: boolean) => {
      if (withCombo) {
        combo++; comboT = COMBO_WINDOW;
        // milestone shout + flash
        for (let i = MILESTONES.length - 1; i >= 0; i--) {
          if (combo === MILESTONES[i][0] && MILESTONES[i][0] > comboTier) {
            comboTier = MILESTONES[i][0];
            banner = { t: 1.3, text: MILESTONES[i][1] };
            flashT = 0.5;
            audio.success();
            buzz([15, 30, 15]);
            break;
          }
        }
      }
      const m = withCombo ? mult() : 1;
      const gain = Math.round(n * m * scoreMul);
      score += gain;
      popups.push({ x, y, life: 1, text: `+${gain}${m > 1 ? ` ×${m}` : ""}`, big: m > 1 });
    };
    const burst = (x: number, y: number, col: RGB, n: number, spread = 150) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * 6.2832;
        const s = 40 + Math.random() * spread;
        particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, c: col });
      }
    };
    const colOf = (k: Kind): RGB => (k === "fast" ? RED2 : k === "split" ? MAG : k === "shooter" ? SHOOT : k === "boss" ? BOSSC : RED);

    const spawnThreat = (kind?: Kind) => {
      if (!kind) {
        const pool: Kind[] = ["basic"];
        if (wave >= 2) pool.push("fast");
        if (wave >= 3) { pool.push("armor"); pool.push("shooter"); }
        if (wave >= 4) pool.push("split");
        kind = pool[(Math.random() * pool.length) | 0];
      }
      const edge = Math.random();
      let x, y;
      if (edge < 0.5) { x = Math.random() * W; y = Math.random() < 0.5 ? -14 : H + 14; }
      else { x = Math.random() < 0.5 ? -14 : W + 14; y = Math.random() * H; }
      const ang = Math.atan2(cy - y, cx - x) + (Math.random() - 0.5) * 0.22;
      const isBoss = kind === "boss";
      const base = isBoss ? 26 + wave * 1.5 : 42 + wave * 6 + Math.min(40, elapsed * 1.4);
      const km = kind === "fast" ? 1.7 : kind === "armor" ? 0.72 : kind === "shooter" ? 0.85 : 1;
      const sp = base * km * (isBoss ? 1 : 0.85 + Math.random() * 0.4);
      const hp = isBoss ? 10 + wave * 2 : kind === "armor" ? 2 : kind === "shooter" ? 2 : 1;
      threats.push({
        x, y, px: x, py: y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
        r: isBoss ? 30 : kind === "armor" ? 12 : kind === "fast" ? 6 : kind === "split" ? 10 : kind === "shooter" ? 9 : 8,
        hp, maxHp: hp, kind, seed: Math.random() * 6.28, ft: 1.4,
      });
    };
    const bossAlive = () => threats.some((t) => t.kind === "boss");

    const killThreat = (i: number, byPulse = false) => {
      const t = threats[i];
      if (t.kind === "boss") {
        score += 200;
        integrity = Math.min(P.maxInteg, integrity + 25);
        banner = { t: 1.6, text: c.bossDown };
        burst(t.x, t.y, BOSSC, 60, 240);
        shake = 18;
        audio.success();
        buzz([20, 40, 60]);
        threats.splice(i, 1);
        setHud();
        return;
      }
      const col = colOf(t.kind);
      burst(t.x, t.y, byPulse ? A : col, t.kind === "armor" ? 16 : 10);
      addScore(t.kind === "armor" ? 30 : t.kind === "fast" ? 15 : t.kind === "split" ? 20 : 10, t.x, t.y, !byPulse);
      if (t.kind === "split") {
        for (let s = 0; s < 2; s++) {
          const a = Math.atan2(cy - t.y, cx - t.x) + (s === 0 ? -0.6 : 0.6);
          threats.push({ x: t.x, y: t.y, px: t.x, py: t.y, vx: Math.cos(a) * 120, vy: Math.sin(a) * 120, r: 6, hp: 1, maxHp: 1, kind: "fast", seed: Math.random() * 6.28, ft: 1.4 });
        }
      }
      threats.splice(i, 1);
    };

    const hitAt = (px: number, py: number, touch = false) => {
      if (phaseRef.current !== "playing" || countdown > 0) return;
      // fingers are less precise than cursors — widen every hit window
      const TB = touch ? 14 : 0;
      // repair pickups first
      for (let i = pickups.length - 1; i >= 0; i--) {
        const p = pickups[i];
        if ((p.x - px) ** 2 + (p.baseY - py) ** 2 < (28 + TB) ** 2) {
          integrity = Math.min(P.maxInteg, integrity + 18);
          burst(p.x, p.baseY, REPAIR, 14);
          popups.push({ x: p.x, y: p.baseY, life: 1, text: "+REPAIR", big: true });
          pickups.splice(i, 1);
          audio.success();
          setHud();
          return;
        }
      }
      // shooter projectiles are clickable to shoot down
      for (let i = projs.length - 1; i >= 0; i--) {
        const q = projs[i];
        if ((q.x - px) ** 2 + (q.y - py) ** 2 < (22 + TB) ** 2) {
          burst(q.x, q.y, SHOOT, 6, 60);
          addScore(5, q.x, q.y, true);
          projs.splice(i, 1);
          audio.click();
          setHud();
          return;
        }
      }
      const HR = P.hitR + TB;
      let bi = -1, bd = HR * HR;
      for (let i = 0; i < threats.length; i++) {
        const t = threats[i];
        const rr = Math.max(t.r + 8, HR);
        const d = (t.x - px) ** 2 + (t.y - py) ** 2;
        if (d < rr * rr && d < bd + t.r * t.r) { bd = d; bi = i; }
      }
      if (bi >= 0) {
        const t = threats[bi];
        beams.push({ x1: px, y1: py, x2: t.x, y2: t.y, life: 1 });
        t.hp--;
        if (t.hp > 0) {
          burst(t.x, t.y, colOf(t.kind), t.kind === "boss" ? 6 : 5, 60);
          shake = Math.max(shake, t.kind === "boss" ? 5 : 3);
          audio.hover();
        } else {
          killThreat(bi);
          audio.click();
          if (touch) buzz(8);
        }
        setHud();
      }
    };

    const doPulse = () => {
      if (phaseRef.current !== "playing" || countdown > 0 || pulseCd > 0) return;
      shock = { r: coreR, life: 1 };
      pulseCd = PULSE_CD * P.cdMul;
      shake = Math.max(shake, 6);
      audio.whoosh();
    };
    const doOc = () => {
      if (phaseRef.current !== "playing" || countdown > 0 || ocCd > 0) return;
      slowT = 3;
      ocCd = OC_CD * P.cdMul;
      banner = { t: 1.1, text: c.overclock.toUpperCase() };
      audio.arrival();
    };
    const doPurge = () => {
      if (phaseRef.current !== "playing" || countdown > 0 || purgeCd > 0) return;
      // vaporise everything on screen (bosses take heavy damage instead)
      for (let i = threats.length - 1; i >= 0; i--) {
        if (threats[i].kind === "boss") { threats[i].hp -= 6; if (threats[i].hp <= 0) killThreat(i, true); }
        else { burst(threats[i].x, threats[i].y, A, 6, 80); threats.splice(i, 1); score += Math.round(8 * scoreMul); }
      }
      projs.length = 0;
      purgeCd = PURGE_CD * P.cdMul;
      flashT = 0.7; shake = 12;
      banner = { t: 1.2, text: c.purge.toUpperCase() };
      audio.whoosh();
      buzz(50);
      setHud();
    };
    doPulseRef.current = doPulse;
    doOcRef.current = doOc;
    doPurgeRef.current = doPurge;

    applyUpgradeRef.current = (idx: number) => {
      if (idx === 0) { P.maxInteg += 25; integrity = P.maxInteg; }
      else if (idx === 1) P.cdMul *= 0.7;
      else if (idx === 2) P.turretBase *= 0.6;
      else if (idx === 3) P.hitR *= 1.35;
      else if (idx === 4) P.pulseScale *= 1.4;
      setHud();
    };

    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      hitAt(e.clientX - r.left, e.clientY - r.top, e.pointerType === "touch");
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
      burst(cx, cy, RED, 50, 240);
      shake = 18;
      buzz([60, 50, 120]);
      track("game_over", { score, wave, hard: hardRef.current });
      const RANKS = [20, 55, 110, 190];
      let rank = 0;
      while (rank < RANKS.length && score >= RANKS[rank]) rank++;
      setResult({ score, wave, rank });
      setRuns((prev) => {
        const next = [...prev, { s: score, w: wave }].sort((a, b) => b.s - a.s).slice(0, 5);
        try { localStorage.setItem("ardlabs-coredef-runs", JSON.stringify(next)); } catch {}
        return next;
      });
      setBest((prev) => {
        const nb = Math.max(prev, score);
        try { localStorage.setItem("ardlabs-coredef-best", String(nb)); } catch {}
        return nb;
      });
      setBestWave((prev) => {
        const nw = Math.max(prev, wave);
        try { localStorage.setItem("ardlabs-coredef-wave", String(nw)); } catch {}
        return nw;
      });
      setPhase("over");
    };

    const nextWave = () => {
      // perfect-wave bonus
      if (!waveDmg && wave > 1) {
        score += 25;
        banner = { t: 1.6, text: c.perfect };
      }
      wave++; waveT = 0; waveDmg = false;
      if (wave % 5 === 0) { spawnThreat("boss"); banner = { t: 1.8, text: c.bossIn }; }
      else banner = { t: 1.4, text: `${c.hudWave.toUpperCase()} ${wave}` };
      setHud();
      // roguelite upgrade every 3 waves (not on boss waves)
      if (wave % 3 === 0 && wave % 5 !== 0) {
        const pool = [0, 1, 2, 3, 4];
        for (let i = pool.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [pool[i], pool[j]] = [pool[j], pool[i]]; }
        setChoices([pool[0], pool[1]]);
        setPhase("upgrade");
      }
    };

    const update = (dt: number) => {
      elapsed += dt;
      if (countdown > 0) {
        countdown -= dt;
        if (countdown <= 0) banner = { t: 1.1, text: c.countdownGo.toUpperCase() };
        return;
      }
      waveT += dt;
      if (waveT > WAVE_TIME) nextWave();
      if (phaseRef.current !== "playing") return; // upgrade modal paused us

      if (comboT > 0) { comboT -= dt; if (comboT <= 0) { combo = 0; setHud(); } }

      const boss = bossAlive();
      spawnAcc += dt;
      const rate = (Math.max(0.32, 0.95 - wave * 0.055 - elapsed * 0.005) * (boss ? 1.8 : 1)) / spawnMul;
      while (spawnAcc >= rate) { spawnAcc -= rate; spawnThreat(); if (!boss && wave >= 3 && Math.random() < 0.25) spawnThreat(); }
      if (boss) { bossMinT += dt; if (bossMinT > 2.4) { bossMinT = 0; spawnThreat("fast"); } }

      pickupAcc += dt;
      if (pickupAcc > 12 && integrity < P.maxInteg * 0.85 && pickups.length === 0) {
        pickupAcc = 0;
        const fromLeft = Math.random() < 0.5;
        pickups.push({ x: fromLeft ? -20 : W + 20, vx: (fromLeft ? 1 : -1) * (40 + Math.random() * 20), baseY: 40 + Math.random() * (H - 80) });
      }

      // cooldowns — mirror each gauge onto the floating touch controls
      if (pulseCd > 0) {
        pulseCd = Math.max(0, pulseCd - dt);
        const h = `${(1 - pulseCd / (PULSE_CD * P.cdMul)) * 100}%`;
        if (pulseFillRef.current) pulseFillRef.current.style.height = h;
        if (pulseFillMRef.current) pulseFillMRef.current.style.height = h;
      }
      if (ocCd > 0) {
        ocCd = Math.max(0, ocCd - dt);
        const h = `${(1 - ocCd / (OC_CD * P.cdMul)) * 100}%`;
        if (ocFillRef.current) ocFillRef.current.style.height = h;
        if (ocFillMRef.current) ocFillMRef.current.style.height = h;
      }
      if (purgeCd > 0) {
        purgeCd = Math.max(0, purgeCd - dt);
        const h = `${(1 - purgeCd / (PURGE_CD * P.cdMul)) * 100}%`;
        if (purgeFillRef.current) purgeFillRef.current.style.height = h;
        if (purgeFillMRef.current) purgeFillMRef.current.style.height = h;
      }
      if (slowT > 0) slowT -= dt;
      if (flashT > 0) flashT -= dt;

      // auto-turret
      turretT += dt;
      if (turretT > P.turretBase && threats.length) {
        turretT = 0;
        let ni = -1, nd = Infinity;
        for (let i = 0; i < threats.length; i++) {
          const d = (threats[i].x - cx) ** 2 + (threats[i].y - cy) ** 2;
          if (d < nd) { nd = d; ni = i; }
        }
        if (ni >= 0) {
          const t = threats[ni];
          beams.push({ x1: cx, y1: cy, x2: t.x, y2: t.y, life: 1 });
          t.hp--;
          if (t.hp <= 0) killThreat(ni, true);
          else burst(t.x, t.y, A, 4, 50);
        }
      }

      // shockwave
      if (shock) {
        shock.r += 520 * P.pulseScale * dt;
        shock.life -= dt * 1.05;
        for (let i = threats.length - 1; i >= 0; i--) {
          const d = Math.hypot(threats[i].x - cx, threats[i].y - cy);
          if (Math.abs(d - shock.r) < 26 && threats[i].kind !== "boss") killThreat(i, true);
          else if (Math.abs(d - shock.r) < 26 && threats[i].kind === "boss") { threats[i].hp -= 2; if (threats[i].hp <= 0) killThreat(i, true); }
        }
        if (shock.life <= 0) shock = null;
      }

      // move threats (overclock slows them)
      const tm = slowT > 0 ? 0.35 : 1;
      for (let i = threats.length - 1; i >= 0; i--) {
        const t = threats[i];
        t.px = t.x; t.py = t.y;
        // shooters hover at standoff range and fire glowing projectiles at the core
        if (t.kind === "shooter") {
          const dxc = cx - t.x, dyc = cy - t.y;
          const dist = Math.hypot(dxc, dyc) || 1;
          const STAND = 190;
          if (dist > STAND + 8) { t.x += (dxc / dist) * 120 * dt * tm; t.y += (dyc / dist) * 120 * dt * tm; }
          else {
            // strafe around the core while in range
            const px = -dyc / dist, py = dxc / dist;
            t.x += px * 55 * dt * tm; t.y += py * 55 * dt * tm;
            t.ft -= dt * tm;
            if (t.ft <= 0) {
              t.ft = 1.6;
              const ps = 180;
              projs.push({ x: t.x, y: t.y, vx: (dxc / dist) * ps, vy: (dyc / dist) * ps });
              audio.hover();
            }
          }
          continue;
        }
        t.x += t.vx * dt * tm; t.y += t.vy * dt * tm;
        if ((t.x - cx) ** 2 + (t.y - cy) ** 2 < (coreR + t.r) ** 2) {
          const raw = t.kind === "boss" ? 45 : t.kind === "armor" ? 16 : 11;
          const dmg = raw * dmgMul;
          threats.splice(i, 1);
          integrity -= dmg; combo = 0; comboT = 0; shake = t.kind === "boss" ? 20 : 13; coreFlash = 1; waveDmg = true;
          burst(t.x, t.y, RED, 12);
          audio.whoosh();
          buzz(45);
          setHud();
          if (integrity <= 0) { endGame(); return; }
        }
      }
      // shooter projectiles travel to the core and chip integrity
      for (let i = projs.length - 1; i >= 0; i--) {
        const q = projs[i];
        q.x += q.vx * dt * tm; q.y += q.vy * dt * tm;
        if ((q.x - cx) ** 2 + (q.y - cy) ** 2 < (coreR + 6) ** 2) {
          projs.splice(i, 1);
          integrity -= 6 * dmgMul; combo = 0; comboT = 0; shake = Math.max(shake, 8); coreFlash = 0.8; waveDmg = true;
          burst(cx, cy, SHOOT, 8, 80);
          audio.whoosh();
          buzz(25);
          setHud();
          if (integrity <= 0) { endGame(); return; }
        } else if (q.x < -30 || q.x > W + 30 || q.y < -30 || q.y > H + 30) {
          projs.splice(i, 1);
        }
      }
      for (let i = pickups.length - 1; i >= 0; i--) { pickups[i].x += pickups[i].vx * dt; if (pickups[i].x < -40 || pickups[i].x > W + 40) pickups.splice(i, 1); }
      for (let i = particles.length - 1; i >= 0; i--) { const p = particles[i]; p.life -= dt * 1.7; if (p.life <= 0) { particles.splice(i, 1); continue; } p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.92; p.vy *= 0.92; }
      for (let i = popups.length - 1; i >= 0; i--) { const p = popups[i]; p.life -= dt * 1.1; p.y -= 26 * dt; if (p.life <= 0) popups.splice(i, 1); }
      for (let i = beams.length - 1; i >= 0; i--) { beams[i].life -= dt * 6; if (beams[i].life <= 0) beams.splice(i, 1); }
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

      // starfield parallax
      ctx.globalCompositeOperation = "lighter";
      for (const s of stars) {
        s.x -= s.z * 8 * 0.016;
        if (s.x < 0) s.x = W;
        ctx.fillStyle = `rgba(${A.r},${A.g},${A.b},${0.05 + s.z * 0.12})`;
        ctx.fillRect(s.x, s.y, s.z * 1.6, s.z * 1.6);
      }
      ctx.globalCompositeOperation = "source-over";

      // grid
      ctx.strokeStyle = `rgba(${A.r},${A.g},${A.b},0.05)`;
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = (elapsed * 8) % step; x < W; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      // combo edge glow
      if (combo > 3) {
        const g = Math.min(0.5, combo * 0.03);
        ctx.strokeStyle = `rgba(${A.r},${A.g},${A.b},${g})`;
        ctx.lineWidth = 6;
        ctx.strokeRect(3, 3, W - 6, H - 6);
      }

      // core glow
      ctx.globalCompositeOperation = "lighter";
      const gcol = coreFlash > 0.1 ? RED : slowT > 0 ? { r: 120, g: 200, b: 255 } : A;
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 3.4);
      cg.addColorStop(0, `rgba(${gcol.r},${gcol.g},${gcol.b},${0.5 + coreFlash * 0.4})`);
      cg.addColorStop(1, `rgba(${gcol.r},${gcol.g},${gcol.b},0)`);
      ctx.fillStyle = cg;
      ctx.beginPath(); ctx.arc(cx, cy, coreR * 3.4, 0, 6.2832); ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      if (shock) { ctx.strokeStyle = `rgba(${A.r},${A.g},${A.b},${0.5 * shock.life})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, shock.r, 0, 6.2832); ctx.stroke(); }

      // beams (turret + muzzle)
      ctx.globalCompositeOperation = "lighter";
      for (const b of beams) {
        ctx.strokeStyle = `rgba(${A.r},${A.g},${A.b},${b.life})`;
        ctx.lineWidth = 1.5 + b.life;
        ctx.beginPath(); ctx.moveTo(b.x1, b.y1); ctx.lineTo(b.x2, b.y2); ctx.stroke();
      }
      ctx.globalCompositeOperation = "source-over";

      // core body + rotating shield ticks
      const pulse = 1 + Math.sin(elapsed * 3) * 0.06;
      ctx.fillStyle = coreFlash > 0.1 ? `rgb(${RED.r},${RED.g},${RED.b})` : `rgb(${A.r},${A.g},${A.b})`;
      ctx.beginPath(); ctx.arc(cx, cy, coreR * pulse, 0, 6.2832); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.beginPath(); ctx.arc(cx, cy, coreR * 0.42, 0, 6.2832); ctx.fill();
      const ip = Math.max(0, integrity) / P.maxInteg;
      ctx.strokeStyle = ip < 0.3 ? `rgb(${RED.r},${RED.g},${RED.b})` : `rgba(${A.r},${A.g},${A.b},0.85)`;
      ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(cx, cy, coreR + 9, -1.5708, -1.5708 + 6.2832 * ip); ctx.stroke();
      // rotating sentry ring
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(elapsed * 0.6);
      ctx.strokeStyle = `rgba(${A.r},${A.g},${A.b},0.4)`; ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) { const a = (i / 3) * 6.2832; ctx.beginPath(); ctx.moveTo(Math.cos(a) * (coreR + 5), Math.sin(a) * (coreR + 5)); ctx.lineTo(Math.cos(a) * (coreR + 13), Math.sin(a) * (coreR + 13)); ctx.stroke(); }
      ctx.restore();

      // pickups
      for (const p of pickups) {
        const py = p.baseY;
        ctx.globalCompositeOperation = "lighter";
        const pg = ctx.createRadialGradient(p.x, py, 0, p.x, py, 20);
        pg.addColorStop(0, `rgba(${REPAIR.r},${REPAIR.g},${REPAIR.b},0.6)`); pg.addColorStop(1, `rgba(${REPAIR.r},${REPAIR.g},${REPAIR.b},0)`);
        ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(p.x, py, 20, 0, 6.2832); ctx.fill();
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = `rgb(${REPAIR.r},${REPAIR.g},${REPAIR.b})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.x, py, 8, 0, 6.2832); ctx.stroke();
        ctx.fillStyle = `rgb(${REPAIR.r},${REPAIR.g},${REPAIR.b})`; ctx.fillRect(p.x - 5, py - 1, 10, 2); ctx.fillRect(p.x - 1, py - 5, 2, 10);
      }

      // threats + trails
      for (const t of threats) {
        const col = colOf(t.kind);
        ctx.strokeStyle = `rgba(${col.r},${col.g},${col.b},0.12)`; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(t.x, t.y); ctx.lineTo(cx, cy); ctx.stroke();
        // motion trail
        ctx.strokeStyle = `rgba(${col.r},${col.g},${col.b},0.3)`; ctx.lineWidth = t.r * 0.7;
        ctx.beginPath(); ctx.moveTo(t.px, t.py); ctx.lineTo(t.x, t.y); ctx.stroke();
        const tw = 0.72 + 0.28 * Math.sin(elapsed * 8 + t.seed);
        ctx.fillStyle = `rgba(${col.r},${col.g},${col.b},${tw})`;
        ctx.beginPath(); ctx.arc(t.x, t.y, t.r, 0, 6.2832); ctx.fill();
        if (t.kind === "armor" && t.hp > 1) { ctx.strokeStyle = "rgba(255,255,255,0.7)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(t.x, t.y, t.r + 4, 0, 6.2832); ctx.stroke(); }
        if (t.kind === "split") { ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(t.x - 4, t.y); ctx.lineTo(t.x + 4, t.y); ctx.moveTo(t.x, t.y - 4); ctx.lineTo(t.x, t.y + 4); ctx.stroke(); }
        if (t.kind === "shooter") {
          // diamond turret ring — reads as a ranged attacker
          ctx.save(); ctx.translate(t.x, t.y); ctx.rotate(elapsed * 1.4 + t.seed);
          ctx.strokeStyle = "rgba(255,255,255,0.75)"; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(0, -t.r - 4); ctx.lineTo(t.r + 4, 0); ctx.lineTo(0, t.r + 4); ctx.lineTo(-t.r - 4, 0); ctx.closePath(); ctx.stroke();
          ctx.restore();
        }
        if (t.kind === "boss") {
          // hp bar above the boss
          const bw = 60, hp = Math.max(0, t.hp) / t.maxHp;
          ctx.fillStyle = "rgba(255,255,255,0.14)"; ctx.fillRect(t.x - bw / 2, t.y - t.r - 14, bw, 4);
          ctx.fillStyle = `rgb(${BOSSC.r},${BOSSC.g},${BOSSC.b})`; ctx.fillRect(t.x - bw / 2, t.y - t.r - 14, bw * hp, 4);
          ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(t.x, t.y, t.r + 5, 0, 6.2832); ctx.stroke();
        }
      }

      // shooter projectiles — glowing tracers aimed at the core
      ctx.globalCompositeOperation = "lighter";
      for (const q of projs) {
        const pg = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, 12);
        pg.addColorStop(0, `rgba(${SHOOT.r},${SHOOT.g},${SHOOT.b},0.9)`); pg.addColorStop(1, `rgba(${SHOOT.r},${SHOOT.g},${SHOOT.b},0)`);
        ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(q.x, q.y, 12, 0, 6.2832); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.95)"; ctx.beginPath(); ctx.arc(q.x, q.y, 2.6, 0, 6.2832); ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      // particles
      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) { ctx.fillStyle = `rgba(${p.c.r},${p.c.g},${p.c.b},${p.life})`; ctx.beginPath(); ctx.arc(p.x, p.y, 2.2 * p.life + 0.5, 0, 6.2832); ctx.fill(); }
      ctx.globalCompositeOperation = "source-over";

      // popups
      ctx.textAlign = "center";
      for (const p of popups) {
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.big ? `rgb(${A.r},${A.g},${A.b})` : "rgba(244,246,248,0.9)";
        ctx.font = `${p.big ? 600 : 500} ${p.big ? 15 : 12}px "Geist Mono", monospace`;
        ctx.fillText(p.text, p.x, p.y);
      }
      ctx.globalAlpha = 1;

      // reticle
      if (mouse.x > 0 && phaseRef.current === "playing") {
        ctx.strokeStyle = `rgba(${A.r},${A.g},${A.b},0.6)`; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 12, 0, 6.2832); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(mouse.x - 18, mouse.y); ctx.lineTo(mouse.x - 6, mouse.y);
        ctx.moveTo(mouse.x + 6, mouse.y); ctx.lineTo(mouse.x + 18, mouse.y);
        ctx.moveTo(mouse.x, mouse.y - 18); ctx.lineTo(mouse.x, mouse.y - 6);
        ctx.moveTo(mouse.x, mouse.y + 6); ctx.lineTo(mouse.x, mouse.y + 18); ctx.stroke();
      }

      // damage vignette
      if (coreFlash > 0.05) {
        const vg = ctx.createRadialGradient(cx, cy, Math.min(W, H) * 0.2, cx, cy, Math.max(W, H) * 0.7);
        vg.addColorStop(0, "rgba(255,60,50,0)");
        vg.addColorStop(1, `rgba(255,60,50,${coreFlash * 0.35})`);
        ctx.fillStyle = vg; ctx.fillRect(-sx, -sy, W, H);
      }

      // full-screen accent flash — milestone shout / purge detonation
      if (flashT > 0) {
        ctx.fillStyle = `rgba(${A.r},${A.g},${A.b},${Math.min(0.4, flashT * 0.45)})`;
        ctx.fillRect(-sx, -sy, W, H);
      }

      // countdown / banner
      if (countdown > 0) {
        ctx.textAlign = "center"; ctx.fillStyle = `rgba(${A.r},${A.g},${A.b},0.9)`;
        ctx.font = `700 64px "Geist", sans-serif`;
        ctx.fillText(String(Math.max(1, Math.ceil(countdown - 0.2))), cx, cy - coreR * 3);
      } else if (banner.t > 0) {
        ctx.textAlign = "center"; ctx.globalAlpha = Math.min(1, banner.t);
        ctx.fillStyle = "rgba(244,246,248,0.95)"; ctx.font = `600 22px "Geist Mono", monospace`;
        ctx.fillText(banner.text, cx, 42); ctx.globalAlpha = 1;
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

    (canvas as unknown as { __reset?: () => void }).__reset = () => {
      reset(); setHud();
      for (const ref of [pulseFillRef, ocFillRef, purgeFillRef, pulseFillMRef, ocFillMRef, purgeFillMRef]) {
        if (ref.current) ref.current.style.height = "0%";
      }
    };

    last = performance.now();
    raf = requestAnimationFrame(loop);

    const onKey = (e: KeyboardEvent) => {
      if (phaseRef.current !== "playing") return;
      if (e.code === "Space" || e.code === "Digit1") { e.preventDefault(); doPulse(); }
      else if (e.code === "Digit2") { e.preventDefault(); doOc(); }
      else if (e.code === "Digit3") { e.preventDefault(); doPurge(); }
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
  }, [c]);

  const start = () => {
    (canvasRef.current as unknown as { __reset?: () => void } | null)?.__reset?.();
    setPhase("playing");
    audio.whoosh();
    track("game_start", { hard, replay: phase === "over" });
  };
  const pick = (i: number) => { applyUpgradeRef.current(i); setPhase("playing"); };

  const shareChallenge = async () => {
    const text = c.challengeText
      .replace("{wave}", String(result.wave))
      .replace("{score}", String(result.score))
      .replace("{url}", `${SITE.url}/#arcade`);
    const ok = await copyText(text);
    if (ok) toast(c.challengeCopied, "⚔");
    track("game_challenge", { score: result.score, wave: result.wave });
  };
  const goContact = () => {
    track("game_cta", { from: phase });
    scrollToTarget("#contact");
  };

  const overlay = phase === "idle" || phase === "over" || disabled;
  const up = c.upgrades as unknown as { name: string; desc: string }[];

  return (
    <section id="arcade" className="relative z-10 scroll-mt-24 bg-void py-28 md:py-36">
      <div className="container-x relative">
        <ChapterNumeral n="06" label="INTERLUDE" />
      </div>

      <div className="container-x relative grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,36%)_minmax(0,64%)]">
        <div className="relative">
          <Reveal><span className="eyebrow">{c.eyebrow}</span></Reveal>
          <Reveal delay={0.08}><h2 className="text-section-title text-chalk mt-5">{c.title}</h2></Reveal>
          <Reveal delay={0.16}><p className="text-lead mt-5 max-w-md">{c.intro}</p></Reveal>

          <Reveal delay={0.22}>
            <div className="mt-8 grid max-w-md grid-cols-3 gap-x-6 gap-y-6">
              <Stat label={c.hudScore}><span ref={scoreElRef}>0</span></Stat>
              <Stat label={c.hudCombo} accent><span ref={comboElRef}>—</span></Stat>
              <Stat label={c.hudWave}><span ref={waveElRef}>1</span></Stat>
              <div className="col-span-3">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div ref={barElRef} className="h-full rounded-full bg-accent" style={{ width: "100%" }} />
                </div>
                <p className="mt-2 font-mono text-[0.55rem] uppercase tracking-[0.24em] text-fog">{c.hudIntegrity}</p>
              </div>
              <AbilityBtn label={c.pulse} k="1 / Space" fillRef={pulseFillRef} onClick={() => doPulseRef.current()} disabled={phase !== "playing"} />
              <AbilityBtn label={c.overclock} k="2" fillRef={ocFillRef} onClick={() => doOcRef.current()} disabled={phase !== "playing"} />
              <AbilityBtn label={c.purge} k="3" fillRef={purgeFillRef} onClick={() => doPurgeRef.current()} disabled={phase !== "playing"} />
              <div className="col-span-3 flex items-end justify-between gap-4">
                <div className="flex items-baseline gap-6">
                  <Stat label={c.best}><span className="text-mist">{best}</span></Stat>
                  <Stat label={c.bestWaveLabel}><span className="text-mist">{bestWave}</span></Stat>
                </div>
                {/* difficulty toggle — disabled once a run is live */}
                <div className="flex flex-col items-end gap-1.5">
                  <div className="inline-flex overflow-hidden rounded-full border border-white/12" role="group" aria-label={c.diffLabel}>
                    <button
                      onClick={() => phase !== "playing" && setHard(false)}
                      disabled={phase === "playing"}
                      aria-pressed={!hard}
                      className={`px-3 py-1 font-mono text-[0.55rem] uppercase tracking-[0.16em] transition-colors ${!hard ? "bg-accent/20 text-accent" : "text-fog hover:text-mist"} disabled:opacity-50`}
                    >
                      {c.diffNormal}
                    </button>
                    <button
                      onClick={() => phase !== "playing" && setHard(true)}
                      disabled={phase === "playing"}
                      aria-pressed={hard}
                      className={`px-3 py-1 font-mono text-[0.55rem] uppercase tracking-[0.16em] transition-colors ${hard ? "bg-[#ff5040]/20 text-[#ff5040]" : "text-fog hover:text-mist"} disabled:opacity-50`}
                    >
                      {c.diffHard}
                    </button>
                  </div>
                  <p className="font-mono text-[0.5rem] uppercase tracking-[0.16em] text-fog/70">{c.diffLabel}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="relative overflow-hidden rounded-xl border border-chalk/10 bg-[#05070c] lit-top">
            <span aria-hidden className="pointer-events-none absolute left-3 top-3 z-10 h-4 w-4 border-l border-t border-accent/50" />
            <span aria-hidden className="pointer-events-none absolute right-3 top-3 z-10 h-4 w-4 border-r border-t border-accent/50" />
            <span aria-hidden className="pointer-events-none absolute bottom-3 left-3 z-10 h-4 w-4 border-b border-l border-accent/50" />
            <span aria-hidden className="pointer-events-none absolute bottom-3 right-3 z-10 h-4 w-4 border-b border-r border-accent/50" />

            <canvas ref={canvasRef} className="block h-[clamp(360px,60vh,560px)] w-full touch-none [cursor:crosshair]" />

            {/* floating touch controls — thumbs never leave the arena on mobile */}
            {phase === "playing" && !disabled && (
              <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-2 lg:hidden">
                <TouchBtn label={c.pulse} fillRef={pulseFillMRef} onClick={() => doPulseRef.current()} />
                <TouchBtn label={c.overclock} fillRef={ocFillMRef} onClick={() => doOcRef.current()} />
                <TouchBtn label={c.purge} fillRef={purgeFillMRef} onClick={() => doPurgeRef.current()} />
              </div>
            )}

            {/* upgrade choice */}
            {phase === "upgrade" && !disabled && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 bg-[#05070c]/85 p-6 text-center backdrop-blur-sm">
                <div>
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-accent">{c.upgradeTitle}</p>
                  <p className="mt-2 text-sm text-mist">{c.upgradeSub}</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  {choices.map((i) => (
                    <button key={i} onClick={() => pick(i)} className="spot-card lit-top group w-56 rounded-lg border border-accent/25 bg-accent/[0.04] p-4 text-left transition-colors hover:border-accent/60 hover:bg-accent/[0.09]">
                      <p className="font-display text-base font-semibold text-chalk">{up[i]?.name}</p>
                      <p className="mt-1.5 text-xs text-mist">{up[i]?.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {overlay && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 bg-[#05070c]/70 p-6 text-center backdrop-blur-sm">
                {phase === "over" && !disabled && (
                  <>
                    <p className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-[#ff5040]">{c.over}</p>
                    <p className="font-display text-5xl font-semibold tabular-nums text-chalk">{result.score}</p>
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-fog">
                      {c.rankLabel} · <span className="text-accent">{(c.ranks as string[])[result.rank]}</span> · {c.hudWave} {result.wave}
                    </p>
                    {runs.length > 1 && (
                      <div className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-fog">
                        <p className="text-accent">{c.topRuns}</p>
                        {runs.slice(0, 3).map((r, i) => (
                          <p key={i} className="mt-1 tabular-nums">
                            {String(i + 1).padStart(2, "0")} · {r.s} · {c.hudWave} {r.w}
                          </p>
                        ))}
                      </div>
                    )}
                  </>
                )}
                <p className="max-w-xs text-sm text-mist">{c.ctaLine}</p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {!disabled && (
                    <button onClick={start} className="rounded-full bg-chalk px-6 py-2.5 text-sm font-medium text-void transition-transform duration-300 active:scale-[0.97]">
                      {phase === "over" ? c.replay : c.play}
                    </button>
                  )}
                  {phase === "over" && !disabled && (
                    <button onClick={shareChallenge} className="rounded-full border border-accent/40 px-6 py-2.5 text-sm text-accent transition-colors duration-300 hover:border-accent hover:bg-accent/[0.08]">
                      {c.challenge}
                    </button>
                  )}
                  <button onClick={goContact} className="rounded-full border border-white/15 px-6 py-2.5 text-sm text-chalk transition-colors duration-300 hover:border-accent/50 hover:text-accent-2">
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
      <div className={`font-display text-3xl font-semibold tabular-nums ${accent ? "text-accent" : "text-chalk"}`}>{children}</div>
      <p className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.22em] text-fog">{label}</p>
    </div>
  );
}

/** Floating in-arena ability button for touch play — big target, translucent,
 *  cooldown gauge mirrored from the engine. */
function TouchBtn({ label, fillRef, onClick }: { label: string; fillRef: React.RefObject<HTMLSpanElement | null>; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative min-w-[5.2rem] overflow-hidden rounded-full border border-accent/40 bg-[#05070c]/70 px-4 py-2.5 backdrop-blur-sm transition-transform active:scale-95"
    >
      <span ref={fillRef} aria-hidden className="absolute inset-x-0 bottom-0 block bg-accent/25" style={{ height: "0%" }} />
      <span className="relative font-mono text-[0.6rem] uppercase tracking-[0.16em] text-accent">{label}</span>
    </button>
  );
}

function AbilityBtn({ label, k, fillRef, onClick, disabled }: { label: string; k: string; fillRef: React.RefObject<HTMLSpanElement | null>; onClick: () => void; disabled: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} className="group relative col-span-1 flex min-h-[3.2rem] flex-col items-center justify-center overflow-hidden rounded-lg border border-accent/30 bg-accent/[0.06] px-2 text-center transition-colors hover:bg-accent/[0.12] disabled:opacity-40">
      <span ref={fillRef} aria-hidden className="absolute inset-x-0 bottom-0 block bg-accent/25" style={{ height: "0%" }} />
      <span className="relative font-mono text-[0.6rem] uppercase tracking-[0.16em] text-accent">{label}</span>
      <span className="relative mt-0.5 font-mono text-[0.5rem] tracking-[0.1em] text-fog/70">{k}</span>
    </button>
  );
}
