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

        {/* lit-cabin panel */}
        <Reveal delay={0.15} className="lg:col-span-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl hairline bg-gradient-to-br from-ink to-void">
            {/* ambient interior light */}
            <div className="absolute -right-1/4 top-1/4 h-2/3 w-2/3 rounded-full bg-[radial-gradient(circle,rgba(198,161,91,0.22),transparent_70%)] blur-2xl" />
            <div className="absolute -left-10 bottom-0 h-1/2 w-1/2 rounded-full bg-[radial-gradient(circle,rgba(199,203,209,0.10),transparent_70%)] blur-2xl" />
            {/* leather-stitch seams */}
            <svg className="absolute inset-0 h-full w-full opacity-40" aria-hidden>
              <defs>
                <pattern id="stitch" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
                  <line x1="0" y1="13" x2="8" y2="13" stroke="rgba(198,161,91,0.25)" strokeWidth="1" strokeDasharray="3 5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#stitch)" />
            </svg>
            <div className="absolute bottom-6 left-6 font-mono text-[0.62rem] tracking-[0.3em] text-fog">
              CABIN · SILENCE · CHAMPAGNE LIGHT
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
