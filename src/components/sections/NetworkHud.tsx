"use client";

import { useEffect, useRef, useState } from "react";
import { CITIES } from "@/lib/site";

type Hub = { name: string; load: number; latency: number };

// Stable seed values so SSR and first client render match (no hydration drift);
// the random walk only begins after mount.
const SEED: Hub[] = CITIES.map((c, i) => ({
  name: c.name,
  load: 54 + ((i * 7) % 30),
  latency: 8 + ((i * 5) % 22),
}));

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

/**
 * A live-style operations readout overlaid on the globe — hub load/latency on a
 * gentle random walk plus an ever-climbing throughput counter. Decorative, so
 * it never blocks the globe's drag interaction.
 */
export function NetworkHud() {
  const [hubs, setHubs] = useState<Hub[]>(SEED);
  const [routed, setRouted] = useState(248_910);
  const throughput = useRef(312);
  const [tp, setTp] = useState(312);

  useEffect(() => {
    const id = setInterval(() => {
      setHubs((prev) =>
        prev.map((h) => ({
          ...h,
          load: clamp(h.load + (Math.random() - 0.5) * 9, 31, 96),
          latency: clamp(h.latency + (Math.random() - 0.5) * 5, 4, 38),
        }))
      );
      throughput.current = clamp(
        throughput.current + (Math.random() - 0.45) * 24,
        180,
        540
      );
      setTp(throughput.current);
      setRouted((r) => r + Math.floor(40 + Math.random() * 220));
    }, 1300);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="glass pointer-events-none w-[15rem] rounded-2xl p-4 font-mono text-[0.7rem] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-chalk">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent-2 shadow-[0_0_8px_2px_rgba(122,242,224,0.6)]" />
          LIVE · GLOBAL FABRIC
        </span>
      </div>

      <ul className="mt-3 space-y-2">
        {hubs.map((h) => (
          <li key={h.name} className="flex items-center gap-2">
            <span className="w-[4.5rem] shrink-0 truncate text-mist">
              {h.name}
            </span>
            <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/10">
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent to-accent-2 transition-[width] duration-1000 ease-out"
                style={{ width: `${h.load}%` }}
              />
            </span>
            <span className="w-[2.6rem] shrink-0 text-right tabular-nums text-fog">
              {Math.round(h.latency)}ms
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-fog">
        <span>
          THROUGHPUT{" "}
          <span className="text-accent-2 tabular-nums">{Math.round(tp)}</span> Gb/s
        </span>
      </div>
      <div className="mt-1 text-fog">
        ROUTED{" "}
        <span className="text-chalk tabular-nums">
          {routed.toLocaleString("en-US")}
        </span>
      </div>
    </div>
  );
}
