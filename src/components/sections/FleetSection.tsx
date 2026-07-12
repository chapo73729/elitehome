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
