"use client";

import { useContent } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { LocaleLink } from "@/components/ui/LocaleLink";
import { ServiceCards } from "./ServiceCards";

/**
 * Services — le second temps clair de la page. Après la nuit du hero, de
 * l'habitacle et de la carte, ce chapitre passe en ivoire : les quatre
 * services sur fond lumineux, avant de replonger vers la flotte.
 */
export function ServicesSection() {
  const s = useContent().services;

  return (
    <section
      id="services"
      className="relative z-10 scroll-mt-24 overflow-hidden bg-gradient-to-b from-[#f8f8f6] via-[#f3f3f0] to-[#ecece8] py-28 text-[#141210] md:py-40"
    >
      {/* modelé doux */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-[15%] top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.8),transparent_70%)] blur-3xl" />
      </div>

      <div className="container-x relative">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs tabular-nums text-[#8a8578]">05</span>
            <span className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.4em] text-[#8a8578]">
              {s.eyebrow}
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-[#141210]/15 to-transparent" />
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="text-section-title mt-7 max-w-4xl text-balance text-[#141210]">
            {s.title}
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#55524b]">{s.intro}</p>
        </Reveal>

        <div className="mt-12 md:mt-16">
          <ServiceCards tone="light" />
          <Reveal delay={0.1}>
            <LocaleLink
              href="/services"
              data-cursor
              className="mt-10 inline-flex items-center gap-3 rounded-full border border-[#141210]/25 px-7 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-[#141210] transition-colors duration-300 hover:border-[#141210]/60"
            >
              {s.viewAll} <span aria-hidden>→</span>
            </LocaleLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
