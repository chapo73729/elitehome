"use client";

import { SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Marquee } from "@/components/ui/Marquee";
import { TECH } from "@/lib/site";
import { useContent } from "@/lib/content";

export function TechStack() {
  const c = useContent().stack;
  return (
    <section id="stack" className="relative z-10 scroll-mt-24 overflow-hidden bg-void py-28 md:py-40">
      <SectionHeading index="11" eyebrow={c.eyebrow} title={c.title} intro={c.intro} />

      <div className="container-x mt-16">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl hairline sm:grid-cols-3 lg:grid-cols-4">
          {TECH.map((t, i) => (
            <Reveal key={t} delay={(i % 4) * 0.05}>
              <div
                data-cursor
                className="group relative flex h-28 items-center justify-center overflow-hidden bg-ink transition-colors duration-500 hover:bg-smoke"
              >
                <span className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(120%_120%_at_50%_120%,rgba(91,140,255,0.18),transparent_60%)]" />
                <span className="relative font-display text-xl font-medium text-mist transition-all duration-500 group-hover:-translate-y-1 group-hover:text-chalk">
                  {t}
                </span>
                <span className="absolute bottom-3 left-1/2 h-px w-0 -translate-x-1/2 bg-accent transition-all duration-500 group-hover:w-10" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-24 select-none opacity-90">
        <Marquee items={c.marquee} />
      </div>
    </section>
  );
}
