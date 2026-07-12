"use client";

import { useContent } from "@/lib/content";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ServiceCards } from "./ServiceCards";

/** Services — the four ways we move you, as linked cards. */
export function ServicesSection() {
  const s = useContent().services;

  return (
    <Section id="services">
      <SectionHeading index="05" eyebrow={s.eyebrow} title={s.title} intro={s.intro} />

      <div className="container-x mt-12 md:mt-16">
        <ServiceCards />
        <Reveal delay={0.1} className="mt-10">
          <Button href="/services" variant="ghost">
            {s.viewAll} <span aria-hidden>→</span>
          </Button>
        </Reveal>
      </div>
    </Section>
  );
}
