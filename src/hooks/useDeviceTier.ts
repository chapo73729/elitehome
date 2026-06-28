"use client";

import { useEffect, useState } from "react";
import { usePerf } from "@/lib/perf";

export type Tier = "low" | "mid" | "high";

/**
 * Coarse device capability estimate used to scale particle counts and
 * post-processing so the experience stays fluid on phones and laptops alike.
 */
export function useDeviceTier(): Tier {
  const [tier, setTier] = useState<Tier>("high");
  const perf = usePerf();

  useEffect(() => {
    const cores = navigator.hardwareConcurrency || 4;
    const mem = (navigator as any).deviceMemory || 4;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const narrow = window.innerWidth < 768;

    if (coarse || narrow || cores <= 4 || mem <= 4) {
      setTier(cores <= 4 || mem <= 4 ? "low" : "mid");
    } else if (cores >= 8 && mem >= 8) {
      setTier("high");
    } else {
      setTier("mid");
    }
  }, []);

  // Performance mode always forces the lightest tier.
  return perf ? "low" : tier;
}

/**
 * Multiplier applied to particle / instance counts in a "lite" context so the
 * heavy scenes stay smooth on mid-range phones. Roughly half the desktop work.
 */
export const LITE_FACTOR = 0.5;

/**
 * Detects a "lite" rendering context — phones, low-power devices, users who
 * asked for reduced motion, or constrained data plans. The heavy 3D scenes
 * read this to cap DPR, cut particle counts and relax post-processing.
 *
 * SSR-safe: returns `false` on the server and on the first client render
 * (so the markup matches and the full experience is the default), then
 * resolves to the real value once mounted to avoid a hydration mismatch.
 */
export function useLite(): boolean {
  const [lite, setLite] = useState(false);
  const perf = usePerf();

  useEffect(() => {
    const cores = navigator.hardwareConcurrency || 8;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const narrow = window.innerWidth < 768;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = Boolean((navigator as any).connection?.saveData);

    setLite(coarse || narrow || cores <= 4 || reduced || saveData);
  }, []);

  // Performance mode is an explicit opt-in to the lightest path.
  return perf || lite;
}
