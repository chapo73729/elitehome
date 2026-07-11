"use client";

import { useEffect, useRef } from "react";

type Variant = "code" | "ai" | "industrial" | "ocean" | "cyber";

/**
 * Lightweight 2D-canvas motifs — one per capability — giving each section a
 * distinct living visual without spawning additional WebGL contexts. A single
 * rAF owner (guarded by the `raf` handle) means the loop is never double-run,
 * and it pauses entirely while offscreen.
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
    const canvas = ref.current;
    const ctx = canvas ? canvas.getContext("2d") : null;
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let raf = 0;
    let running = false;

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

    // single-owner scheduler — start() is a no-op if a frame is already queued
    const start = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        running = e.isIntersecting;
        if (running) start();
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    // ---- per-variant state ----
    const cols: number[] = [];
    const glyphs = "01<>{}[]#$/\\=+*ABCDEF".split("");
    const sparks: { x: number; y: number; vx: number; vy: number; life: number }[] = [];
    // cyber: network graph + travelling packets + radar sweep
    const nodes: { x: number; y: number; phase: number }[] = [];
    const links: [number, number][] = [];
    const packets: { l: number; p: number; speed: number }[] = [];
    let cyberInit = false;
    const initCyber = () => {
      nodes.length = 0;
      links.length = 0;
      packets.length = 0;
      const n = Math.max(10, Math.min(20, Math.round((W * H) / 26000)));
      for (let i = 0; i < n; i++) {
        nodes.push({
          x: 40 + Math.random() * Math.max(1, W - 80),
          y: 30 + Math.random() * Math.max(1, H - 60),
          phase: Math.random() * Math.PI * 2,
        });
      }
      // connect each node to its 2 nearest neighbours
      for (let i = 0; i < nodes.length; i++) {
        const d = nodes
          .map((m, j) => ({ j, dist: (m.x - nodes[i].x) ** 2 + (m.y - nodes[i].y) ** 2 }))
          .filter((o) => o.j !== i)
          .sort((a, b) => a.dist - b.dist);
        for (let k = 0; k < 2 && k < d.length; k++) {
          const a = i;
          const b = d[k].j;
          if (!links.some(([x, y]) => (x === a && y === b) || (x === b && y === a))) {
            links.push([a, b]);
          }
        }
      }
      for (let i = 0; i < Math.min(links.length, 10); i++) {
        packets.push({ l: (Math.random() * links.length) | 0, p: Math.random(), speed: 0.3 + Math.random() * 0.5 });
      }
      cyberInit = true;
    };

    // ai: an organic cortex — drifting neurons, thoughts cascading node to node
    const aiNodes: { bx: number; by: number; ph: number; act: number }[] = [];
    const aiLinks: [number, number][] = [];
    const aiPulses: { l: number; p: number; speed: number; from: number }[] = [];
    let aiInit = false;
    let aiLastFire = 0;
    let aiPrevT = 0;
    const initAi = () => {
      aiNodes.length = 0;
      aiLinks.length = 0;
      aiPulses.length = 0;
      const n = Math.max(26, Math.min(48, Math.round((W * H) / 16000)));
      for (let i = 0; i < n; i++) {
        aiNodes.push({
          bx: 30 + Math.random() * Math.max(1, W - 60),
          by: 26 + Math.random() * Math.max(1, H - 52),
          ph: Math.random() * Math.PI * 2,
          act: 0,
        });
      }
      // each neuron reaches its 3 nearest peers
      for (let i = 0; i < aiNodes.length; i++) {
        const d = aiNodes
          .map((m, j) => ({ j, dist: (m.bx - aiNodes[i].bx) ** 2 + (m.by - aiNodes[i].by) ** 2 }))
          .filter((o) => o.j !== i)
          .sort((a, b) => a.dist - b.dist);
        for (let k = 0; k < 3 && k < d.length; k++) {
          const a = i;
          const b = d[k].j;
          if (!aiLinks.some(([x, y]) => (x === a && y === b) || (x === b && y === a))) {
            aiLinks.push([a, b]);
          }
        }
      }
      aiInit = true;
    };

    const startT = performance.now();
    const loop = (now: number) => {
      raf = 0;
      if (!running) return;
      const t = (now - startT) / 1000;
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
        if (!aiInit || aiNodes.length === 0) initAi();
        // real frame delta so pulse speed is framerate-independent
        const dtl = Math.min(0.08, Math.max(0.001, t - aiPrevT));
        aiPrevT = t;
        ctx.globalCompositeOperation = "lighter";

        // live positions: each neuron wanders gently around its seat
        const px: number[] = [];
        const py: number[] = [];
        for (let i = 0; i < aiNodes.length; i++) {
          const nd = aiNodes[i];
          px[i] = nd.bx + Math.sin(t * 0.4 + nd.ph) * 9;
          py[i] = nd.by + Math.cos(t * 0.33 + nd.ph * 1.7) * 7;
          nd.act *= 0.955; // afterglow decays
        }

        // a thought fires every ~0.5s from a random neuron
        if (t - aiLastFire > 0.5 && aiLinks.length) {
          aiLastFire = t;
          const l = (Math.random() * aiLinks.length) | 0;
          aiPulses.push({ l, p: 0, speed: 0.9 + Math.random() * 0.9, from: aiLinks[l][0] });
          if (aiPulses.length > 14) aiPulses.shift();
        }

        // synapses — brightened briefly where a pulse recently passed
        ctx.lineWidth = 1;
        for (let li = 0; li < aiLinks.length; li++) {
          const [a, b] = aiLinks[li];
          const heat = Math.max(aiNodes[a].act, aiNodes[b].act);
          ctx.strokeStyle = `rgba(130,180,255,${0.17 + heat * 0.33})`;
          ctx.beginPath();
          ctx.moveTo(px[a], py[a]);
          ctx.lineTo(px[b], py[b]);
          ctx.stroke();
        }

        // travelling pulses — thoughts hopping neuron to neuron in cascades
        for (let k = aiPulses.length - 1; k >= 0; k--) {
          const pu = aiPulses[k];
          pu.p += pu.speed * dtl;
          const [a, b] = aiLinks[pu.l];
          const to = pu.from === a ? b : a;
          const fr = pu.from;
          const x = px[fr] + (px[to] - px[fr]) * Math.min(1, pu.p);
          const y = py[fr] + (py[to] - py[fr]) * Math.min(1, pu.p);
          ctx.fillStyle = "rgba(190,240,255,0.95)";
          ctx.beginPath();
          ctx.arc(x, y, 1.8, 0, Math.PI * 2);
          ctx.fill();
          if (pu.p >= 1) {
            aiNodes[to].act = 1; // the neuron fires…
            aiPulses.splice(k, 1);
            if (Math.random() < 0.65) {
              // …and the thought cascades onward
              const nexts = aiLinks
                .map((lk, idx) => ({ lk, idx }))
                .filter(({ lk }) => (lk[0] === to || lk[1] === to) && lk[0] !== fr && lk[1] !== fr);
              if (nexts.length) {
                const nx = nexts[(Math.random() * nexts.length) | 0];
                aiPulses.push({ l: nx.idx, p: 0, speed: 0.9 + Math.random() * 0.9, from: to });
              }
            }
          }
        }

        // neurons — resting glow, flaring white as a thought arrives
        for (let i = 0; i < aiNodes.length; i++) {
          const act = aiNodes[i].act;
          const rr = 1.9 + act * 2.6;
          if (act > 0.12) {
            ctx.fillStyle = `rgba(200,235,255,${act * 0.22})`;
            ctx.beginPath();
            ctx.arc(px[i], py[i], rr * 3.4, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = `rgba(${170 + act * 85},${215 + act * 40},255,${0.55 + act * 0.45})`;
          ctx.beginPath();
          ctx.arc(px[i], py[i], rr, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";
      } else if (variant === "industrial") {
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
          sparks.push({ x: cx + (Math.random() - 0.5) * 40, y: cy, vx: (Math.random() - 0.5) * 3, vy: -Math.random() * 3 - 1, life: 1 });
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
            const y = yBase + Math.sin(x * 0.012 + t * (1 + layer * 0.3)) * (8 + layer * 4) + Math.sin(x * 0.03 - t * 1.5) * 3;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      } else if (variant === "cyber") {
        if (!cyberInit || nodes.length === 0) initCyber();
        // faint blueprint grid
        ctx.strokeStyle = "rgba(79,140,255,0.06)";
        ctx.lineWidth = 1;
        const step = 34;
        for (let x = (t * 6) % step; x < W; x += step) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, H);
          ctx.stroke();
        }
        for (let y = 0; y < H; y += step) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(W, y);
          ctx.stroke();
        }
        // radar sweep from centre
        const cx = W / 2;
        const cy = H / 2;
        const sweep = t * 0.9;
        const rMax = Math.hypot(W, H) / 2;
        const grad = ctx.createConicGradient ? ctx.createConicGradient(sweep, cx, cy) : null;
        if (grad) {
          grad.addColorStop(0, "rgba(79,140,255,0.14)");
          grad.addColorStop(0.08, "rgba(79,140,255,0)");
          grad.addColorStop(1, "rgba(79,140,255,0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, rMax, 0, Math.PI * 2);
          ctx.fill();
        }
        // links
        ctx.strokeStyle = "rgba(107,157,255,0.22)";
        ctx.lineWidth = 1;
        for (const [a, b] of links) {
          ctx.beginPath();
          ctx.moveTo(nodes[a].x, nodes[a].y);
          ctx.lineTo(nodes[b].x, nodes[b].y);
          ctx.stroke();
        }
        // travelling packets
        ctx.globalCompositeOperation = "lighter";
        for (const pk of packets) {
          pk.p += pk.speed * 0.008;
          if (pk.p > 1) {
            pk.p = 0;
            pk.l = (Math.random() * links.length) | 0;
          }
          const [a, b] = links[pk.l] ?? [0, 0];
          const x = nodes[a].x + (nodes[b].x - nodes[a].x) * pk.p;
          const y = nodes[a].y + (nodes[b].y - nodes[a].y) * pk.p;
          ctx.fillStyle = "rgba(180,220,255,0.95)";
          ctx.beginPath();
          ctx.arc(x, y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
        // nodes
        for (const nd of nodes) {
          const pulse = 0.6 + 0.4 * Math.sin(t * 2 + nd.phase);
          ctx.fillStyle = `rgba(150,190,255,${0.5 + 0.4 * pulse})`;
          ctx.beginPath();
          ctx.arc(nd.x, nd.y, 2.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = `rgba(79,140,255,${0.25 * pulse})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(nd.x, nd.y, 5 + pulse * 3, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.globalCompositeOperation = "source-over";
      }

      raf = requestAnimationFrame(loop);
    };

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [variant]);

  return <canvas ref={ref} className={className} />;
}
