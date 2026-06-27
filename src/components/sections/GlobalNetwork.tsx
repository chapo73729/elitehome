"use client";

import dynamic from "next/dynamic";
import { Reveal } from "@/components/ui/Reveal";
import { CITIES } from "@/lib/site";

const Globe = dynamic(() => import("@/components/three/Globe"), {
  ssr: false,
  loading: () => null,
});

export function GlobalNetwork() {
  return (
    <section
      id="network"
      className="relative z-10 overflow-hidden bg-void py-28 md:py-36"
    >
      <div className="container-x">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-accent">03</span>
            <span className="eyebrow">Global Network</span>
            <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
          </div>
        </Reveal>
      </div>

      <div className="relative mt-10 grid items-center gap-8 lg:grid-cols-2">
        <div className="container-x lg:pr-0">
          <Reveal delay={0.08}>
            <h2 className="text-section-title text-gradient max-w-xl text-balance">
              One operating fabric. Six anchors. Every timezone.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-md text-balance text-mist">
              Data, capital and talent move continuously between our hubs —
              routed, optimised and secured in real time.
            </p>
          </Reveal>

          <ul className="mt-10 grid max-w-md grid-cols-2 gap-px overflow-hidden rounded-xl hairline">
            {CITIES.map((c, i) => (
              <Reveal key={c.name} delay={0.05 * i}>
                <li className="glass flex items-center gap-3 p-4">
                  <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent-2" />
                  <span className="text-sm text-chalk">{c.name}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>

        {/* globe canvas */}
        <div className="relative h-[60vh] min-h-[420px] w-full lg:h-[78vh]">
          <Globe />
        </div>
      </div>
    </section>
  );
}
