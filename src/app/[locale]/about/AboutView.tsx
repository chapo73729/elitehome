"use client";

import { useContent } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { CtaBanner } from "@/components/ui/CtaBanner";

export function AboutView() {
  const a = useContent().about;

  return (
    <main className="relative">
      <PageHero
        eyebrow={a.eyebrow}
        title={a.title}
        intro={a.lead}
        image="/images/garage-fleet.webp"
        imagePosition="center 60%"
      />

      {/* body */}
      <section className="relative z-10 bg-void pb-8">
        <div className="container-x max-w-3xl space-y-6">
          {a.body.map((p, i) => (
            <Reveal key={i} delay={0.05 * i}>
              <p className="text-lg leading-relaxed text-mist">{p}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* pillars */}
      <section className="relative z-10 bg-void py-20 md:py-28">
        <div className="container-x">
          <Reveal>
            <h2 className="text-section-title text-chalk max-w-2xl text-balance">{a.pillarsTitle}</h2>
          </Reveal>
          <div className="mt-12 grid gap-px overflow-hidden hairline sm:grid-cols-2">
            {a.pillars.map((p, i) => (
              <Reveal key={p.t} delay={0.05 * i} className="bg-void p-8 md:p-10">
                <span className="font-mono text-xs text-accent tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 font-display text-xl font-medium text-chalk">{p.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mist">{p.d}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <p className="text-giant text-gradient mt-20 text-balance">{a.closing}</p>
          </Reveal>
        </div>
      </section>

      <CtaBanner />
    </main>
  );
}
