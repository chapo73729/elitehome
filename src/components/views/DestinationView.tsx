"use client";

import { useContent } from "@/lib/content";
import { useLang } from "@/lib/lang";
import { getDestination } from "@/lib/destinations";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { LocaleLink } from "@/components/ui/LocaleLink";
import { CtaBanner } from "@/components/ui/CtaBanner";

const T = {
  fr: {
    eyebrow: "Destination",
    bookRoute: "Réserver ce trajet",
    duration: "Durée indicative",
    note: "Durées données à titre indicatif, selon trafic et conditions. Le tarif fixe vous est confirmé avant chaque trajet.",
    relatedService: "Service associé",
    allDestinations: "← Toutes les destinations",
  },
  en: {
    eyebrow: "Destination",
    bookRoute: "Book this journey",
    duration: "Indicative time",
    note: "Times are indicative, depending on traffic and conditions. Your fixed fare is confirmed before every journey.",
    relatedService: "Related service",
    allDestinations: "← All destinations",
  },
} as const;

export function DestinationView({ slug }: { slug: string }) {
  const lang = useLang();
  const t = T[lang];
  const c = useContent();
  const dest = getDestination(slug);
  if (!dest) return null;

  const copy = dest[lang];
  const routes = dest.routes[lang];
  const service = c.services.items.find((s) => s.slug === dest.service);

  return (
    <main className="relative">
      <PageHero
        eyebrow={t.eyebrow}
        title={copy.h1}
        intro={copy.intro}
        backHref="/locations"
        image={slug === "geneva" ? "/images/jet-sclass.webp" : undefined}
        imagePosition="center 35%"
      />

      {/* points forts + trajets signature */}
      <section className="relative z-10 bg-void pb-8">
        <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="max-w-md text-lg leading-relaxed text-mist">{copy.body}</p>
            </Reveal>
            <ul className="mt-9">
              {copy.highlights.map((h, i) => (
                <Reveal as="li" key={h} delay={0.05 * i} className="flex gap-5 hairline-t py-5">
                  <span className="mt-1 font-mono text-xs text-accent-3 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm leading-relaxed text-mist">{h}</span>
                </Reveal>
              ))}
            </ul>
            {service && (
              <Reveal delay={0.2}>
                <LocaleLink
                  href={`/services/${dest.service}`}
                  className="group mt-6 inline-flex items-baseline gap-3 text-chalk transition-colors hover:text-white"
                >
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-fog">
                    {t.relatedService}
                  </span>
                  <span className="font-display text-xl">{service.title}</span>
                  <span aria-hidden className="font-mono text-xs text-fog transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </LocaleLink>
              </Reveal>
            )}
          </div>

          {/* trajets signature */}
          <div className="lg:col-span-7">
            <Reveal>
              <div className="rounded-2xl hairline bg-ink/40 p-7 md:p-9">
                <h2 className="font-display text-2xl font-medium text-chalk md:text-3xl">
                  {copy.routesTitle}
                </h2>
                <ul className="mt-7">
                  {routes.map((r) => (
                    <li
                      key={`${r.from}-${r.to}`}
                      className="flex flex-col gap-3 hairline-t py-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="text-sm text-chalk">
                          {r.from} <span className="mx-1.5 text-fog">→</span> {r.to}
                        </p>
                        <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.25em] text-fog">
                          {t.duration} · <span className="text-accent-3">{r.time}</span>
                        </p>
                      </div>
                      <LocaleLink
                        href={`/booking?from=${encodeURIComponent(r.from)}&to=${encodeURIComponent(r.to)}`}
                        className="shrink-0 rounded-full hairline px-5 py-2.5 text-[0.66rem] font-medium uppercase tracking-[0.2em] text-chalk transition-colors duration-300 hover:border-white/40 hover:bg-white/5"
                      >
                        {t.bookRoute}
                      </LocaleLink>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-xs leading-relaxed text-fog">{t.note}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaBanner />
    </main>
  );
}
