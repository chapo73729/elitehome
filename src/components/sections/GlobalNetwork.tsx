"use client";

import { Reveal } from "@/components/ui/Reveal";
import { CITIES } from "@/lib/site";
import { useContent } from "@/lib/content";
import { WorldMap } from "./WorldMap";
import { NetworkHud } from "./NetworkHud";

export function GlobalNetwork() {
  const c = useContent().network;
  return (
    <section
      id="network"
      className="relative z-10 overflow-hidden bg-void py-28 md:py-36"
    >
      <div className="container-x">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-accent">03</span>
            <span className="eyebrow">{c.eyebrow}</span>
            <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
          </div>
        </Reveal>

        <div className="mt-10 max-w-2xl">
          <Reveal delay={0.08}>
            <h2 className="text-section-title text-gradient text-balance">
              {c.title}
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-md text-balance text-mist">{c.intro}</p>
          </Reveal>
        </div>

        {/* flat world map — cities placed on a real equirectangular projection */}
        <Reveal delay={0.1}>
          <div className="relative mt-14">
            <WorldMap />
            <div className="absolute -bottom-2 left-0 hidden md:block lg:-bottom-4">
              <NetworkHud />
            </div>
          </div>
        </Reveal>

        {/* legend */}
        <ul className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl hairline sm:grid-cols-3 lg:grid-cols-6">
          {CITIES.map((city, i) => (
            <Reveal key={city.name} delay={0.04 * i}>
              <li className="glass flex items-center gap-2.5 p-4">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent-2" />
                <span className="text-sm text-chalk">{city.name}</span>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
