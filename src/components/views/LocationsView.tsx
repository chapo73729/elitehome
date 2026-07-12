"use client";

import { useContent } from "@/lib/content";
import { useLang } from "@/lib/lang";
import { LOCATIONS } from "@/lib/site";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { LocaleLink } from "@/components/ui/LocaleLink";
import { RouteMap } from "@/components/sections/RouteMap";
import { CtaBanner } from "@/components/ui/CtaBanner";

const T = {
  fr: { discover: "Découvrir" },
  en: { discover: "Discover" },
} as const;

export function LocationsView() {
  const l = useContent().locations;
  const t = T[useLang()];

  return (
    <main className="relative">
      <PageHero eyebrow={l.eyebrow} title={l.title} intro={l.intro} />

      <section className="relative z-10 bg-void pb-16">
        <div className="container-x grid gap-px overflow-hidden hairline sm:grid-cols-2 lg:grid-cols-3">
          {l.items.map((item, i) => {
            const spec = LOCATIONS.find((x) => x.id === item.id);
            return (
              <Reveal key={item.id} delay={0.04 * i}>
                <LocaleLink
                  href={`/locations/${item.id}`}
                  data-cursor
                  className="group flex h-full flex-col bg-void p-7 transition-colors duration-500 hover:bg-ink md:p-9"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-xl font-medium text-chalk">{item.name}</h2>
                    {spec?.hub && (
                      <span className="rounded-full border border-accent/40 px-2.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest text-accent">
                        {l.hubLabel}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.25em] text-fog">
                    {spec?.country}
                  </p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-mist">{item.blurb}</p>
                  <span className="mt-6 font-mono text-[0.62rem] uppercase tracking-[0.25em] text-fog transition-colors group-hover:text-chalk">
                    {t.discover} <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </LocaleLink>
              </Reveal>
            );
          })}
        </div>
        <div className="container-x mt-10">
          <Reveal>
            <p className="max-w-xl text-sm leading-relaxed text-fog">{l.note}</p>
          </Reveal>
        </div>
      </section>

      <RouteMap />
      <CtaBanner />
    </main>
  );
}
