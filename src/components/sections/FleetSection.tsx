"use client";

import { useContent } from "@/lib/content";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { FleetCards } from "./FleetCards";

/** Fleet — a quiet, immaculately kept set of Mercedes-Benz. */
export function FleetSection() {
  const f = useContent().fleet;

  return (
    <Section id="fleet">
      <SectionHeading index="06" eyebrow={f.eyebrow} title={f.title} intro={f.intro} />

      <div className="container-x mt-12 md:mt-16">
        {/* la maison au travail — Classe S et Classe V devant l'hôtel */}
        <Reveal className="mb-10">
          <div className="group relative h-64 overflow-hidden rounded-2xl hairline md:h-96">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/duo-hotel.webp"
              alt="Mercedes Classe S et Classe V BLACKFIRST devant un hôtel de nuit"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-[center_62%] transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void/60 via-transparent to-void/20" />
          </div>
        </Reveal>
        <FleetCards />
        <Reveal delay={0.1} className="mt-10">
          <Button href="/fleet" variant="ghost">
            {f.viewAll} <span aria-hidden>→</span>
          </Button>
        </Reveal>
      </div>
    </Section>
  );
}
