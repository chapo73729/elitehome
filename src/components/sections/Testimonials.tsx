"use client";

import { SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { useContent } from "@/lib/content";

export function Testimonials() {
  const c = useContent().testimonials;
  return (
    <section className="relative z-10 bg-void py-28 md:py-36">
      <SectionHeading index="14" eyebrow={c.eyebrow} title={c.title} />
      <div className="container-x mt-14">
        <div className="grid gap-5 md:grid-cols-3">
          {c.items.map((item, i) => (
            <Reveal key={i} delay={i * 0.08} className="h-full">
              <figure className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl hairline bg-ink p-8 transition-colors duration-500 hover:border-white/15">
                <span className="pointer-events-none absolute -right-6 -top-8 font-display text-[8rem] leading-none text-white/[0.04] transition-colors duration-500 group-hover:text-white/[0.07]">
                  &ldquo;
                </span>
                <blockquote className="relative z-10 text-balance text-lg leading-relaxed text-chalk">
                  {item.quote}
                </blockquote>
                <figcaption className="relative z-10 mt-8 border-t border-white/10 pt-5">
                  <div className="font-display text-sm font-semibold text-chalk">
                    {item.author}
                  </div>
                  <div className="font-mono text-xs tracking-widest text-fog">
                    {item.role}
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 font-mono text-[0.6rem] tracking-widest text-fog">
          {c.note}
        </p>
      </div>
    </section>
  );
}
