"use client";

import { useContent } from "@/lib/content";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The Cabin — the interior experience. A calm two-column beat: the four
 * comfort points on the left, a soft "lit cabin" glass panel on the right.
 */
export function ExperienceSection() {
  const e = useContent().experience;

  return (
    <Section id="experience">
      <SectionHeading index="03" eyebrow={e.eyebrow} title={e.title} intro={e.intro} />

      <div className="container-x mt-14 grid gap-12 md:mt-20 lg:grid-cols-12 lg:gap-16">
        {/* points */}
        <ul className="lg:col-span-6">
          {e.points.map((p, i) => (
            <Reveal
              as="li"
              key={p.k}
              delay={0.05 * i}
              className="flex items-baseline gap-6 hairline-t py-6"
            >
              <span className="font-mono text-xs text-accent tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-lg font-medium text-chalk">{p.k}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-mist">{p.v}</p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={0.3}>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-fog">{e.note}</p>
          </Reveal>
        </ul>

        {/* the cabin itself — our V-Class VIP, photographed as it rides */}
        <Reveal delay={0.15} className="lg:col-span-6">
          <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl hairline sm:aspect-[4/3] lg:aspect-[4/5]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/cabin-vclass.webp"
              alt="Cabine VIP de la Mercedes-Benz V-Class BLACKFIRST — sièges cuir et éclairage d'ambiance"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            />
            {/* night grade + caption */}
            <div className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-void/20" />
            <div className="absolute bottom-6 left-6 font-mono text-[0.62rem] uppercase tracking-[0.3em] text-chalk/80">
              V-Class VIP · Cabine première classe
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
