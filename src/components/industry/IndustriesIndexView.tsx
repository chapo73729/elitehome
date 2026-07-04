"use client";

import { LocaleLink } from "@/components/ui/LocaleLink";
import { Reveal } from "@/components/ui/Reveal";
import { ChapterNumeral } from "@/components/ui/ChapterNumeral";
import { Compile } from "@/components/ui/Compile";
import { useContent } from "@/lib/content";
import { usePerf } from "@/lib/perf";

export function IndustriesIndexView() {
  const c = useContent().industries;
  const L = useContent().industry;
  const perf = usePerf();

  return (
    <main className="relative">
      {/* ---------- HEADER — mega title on the void, ghost numeral ---------- */}
      <section className="relative overflow-hidden pb-10 pt-44">
        <div className="container-x relative">
          <ChapterNumeral n="04" label="SERVICES" />

          <div className="relative z-10">
            <Reveal>
              <LocaleLink
                href="/"
                data-cursor
                className="link-underline font-mono text-xs tracking-widest text-mist"
              >
                {L.home}
              </LocaleLink>
            </Reveal>
            <Reveal delay={0.06}>
              <span className="eyebrow mt-8 block">{c.eyebrow} · 04</span>
            </Reveal>
            <Reveal delay={0.12}>
              <h1 className="text-mega text-gradient mt-5 max-w-4xl text-balance">
                {c.indexEyebrow}
              </h1>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mt-6 max-w-xl text-balance text-lg text-mist">{c.indexIntro}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- THE INDEX — numbered hairline rows, no cards ---------- */}
      <section className="relative z-10 bg-void py-16 md:py-24">
        <div className="container-x">
          <Compile label="services-index" index="04" disabled={perf}>
            <ul className="border-b border-white/[0.07]">
              {c.items.map((ind, i) => (
                <Reveal as="li" key={ind.id} delay={i * 0.06} className="hairline-t">
                  <LocaleLink
                    href={`/services/${ind.id}`}
                    data-cursor
                    aria-label={`${ind.title} — ${c.explore}`}
                    className="group flex items-baseline gap-5 py-10 outline-none sm:gap-8 md:gap-12 md:py-12"
                  >
                    <span className="w-[2.2ch] shrink-0 font-mono text-base text-fog tabular-nums transition-colors duration-500 group-hover:text-accent sm:text-xl">
                      {ind.index}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="text-section-title block text-balance text-chalk transition-transform duration-500 group-hover:translate-x-2">
                        {ind.title}
                      </span>
                      <span className="mt-3 block max-w-xl text-sm text-mist sm:text-base">
                        {ind.blurb}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className="hidden shrink-0 self-center font-mono text-xs tracking-widest text-fog opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:text-chalk group-hover:opacity-100 sm:block"
                    >
                      {c.explore}
                    </span>
                  </LocaleLink>
                </Reveal>
              ))}
            </ul>
          </Compile>
        </div>
      </section>
    </main>
  );
}
