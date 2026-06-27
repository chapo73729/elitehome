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
