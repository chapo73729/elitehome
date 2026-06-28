"use client";

import { Reveal } from "@/components/ui/Reveal";
import { useContent } from "@/lib/content";

export function Stats() {
  const STATS = useContent().stats.items;
  return (
    <section className="relative z-10 bg-void py-24 md:py-32">
      <div className="container-x">
        <div className="grid gap-px overflow-hidden rounded-3xl hairline sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="group relative bg-ink p-8 md:p-10">
                <div className="font-display text-5xl font-bold tracking-tight text-gradient md:text-6xl">
                  {s.value}
                </div>
                <div className="mt-4 max-w-[16ch] text-sm text-mist">{s.label}</div>
                <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-accent to-transparent transition-all duration-700 group-hover:w-full" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
