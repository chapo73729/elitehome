"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useLite } from "@/hooks/useDeviceTier";

/**
 * The persistent, site-wide atmosphere layer. Sits behind all content
 * (-z-10, fixed, pointer-events-none) and gives the void real depth: a
 * drifting azure nebula plus a sparse depth-parallax mote field, with a
 * touch of bloom + vignette.
 *
 * Cheapness is the whole point — this runs behind every page, so:
 *  - DPR is capped in the scene (lite:1, else ≤1.5)
 *  - lite tier / reduced-motion render NOTHING here; AmbientBackdrop's rich
 *    CSS gradient is the (animated or static) fallback underneath
 *  - the frameloop pauses when the tab is hidden or the pointer-coarse user
 *    isn't interacting — no GPU spent on an unseen background
 *  - pointer + scroll velocity are fed in via refs (no React re-renders)
 */

// the heavy R3F/three/postprocessing bundle is client-only and lazy
const AtmosphereScene = dynamic(() => import("@/components/three/AtmosphereScene"), {
  ssr: false,
});

export function Atmosphere() {
  const lite = useLite();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);

  // shared state, mutated outside React for a steady 60fps
  const pointer = useRef(new THREE.Vector2(0, 0));
  const scroll = useRef(0);
  const vel = useRef(0);

  // mount only after first paint so the canvas never blocks initial content
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // pause the frameloop when the tab is hidden — no work on an unseen bg
  useEffect(() => {
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    onVis();
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // feed pointer (normalised -1..1) — passive, throttled to rAF cadence
  useEffect(() => {
    if (lite) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        pointer.current.set(
          (e.clientX / window.innerWidth) * 2 - 1,
          -((e.clientY / window.innerHeight) * 2 - 1)
        );
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [lite]);

  // feed scroll offset + velocity from Lenis (falls back to native scroll)
  useEffect(() => {
    if (lite) return;
    const lenis = (window as any).__lenis;
    let raf = 0;
    let lastY = window.scrollY;

    const onLenis = (e: { scroll: number; velocity: number }) => {
      scroll.current = e.scroll * 0.001;
      // normalise velocity to a gentle 0..1 reaction
      vel.current = Math.min(1, Math.abs(e.velocity) * 0.03);
    };

    if (lenis?.on) {
      lenis.on("scroll", onLenis);
    } else {
      // native fallback: derive velocity from frame-to-frame delta
      const loop = () => {
        const y = window.scrollY;
        scroll.current = y * 0.001;
        vel.current = Math.min(1, Math.abs(y - lastY) * 0.02);
        lastY = y;
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    // velocity decays toward rest so the world settles when scrolling stops
    let decayRaf = 0;
    const decay = () => {
      vel.current *= 0.94;
      decayRaf = requestAnimationFrame(decay);
    };
    decayRaf = requestAnimationFrame(decay);

    return () => {
      if (lenis?.off) lenis.off("scroll", onLenis);
      if (raf) cancelAnimationFrame(raf);
      if (decayRaf) cancelAnimationFrame(decayRaf);
    };
  }, [lite]);

  // lite tier and reduced-motion users get the CSS gradient only (no canvas)
  if (lite || !mounted) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ contain: "strict" }}
    >
      <AtmosphereScene
        frameloop={visible ? "always" : "never"}
        pointer={pointer}
        scroll={scroll}
        vel={vel}
      />
    </div>
  );
}
