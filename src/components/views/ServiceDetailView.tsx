"use client";

import { useContent } from "@/lib/content";
import { SERVICES } from "@/lib/site";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { LocaleLink } from "@/components/ui/LocaleLink";
import { CtaBanner } from "@/components/ui/CtaBanner";

export function ServiceDetailView({
  slug,
  prevSlug,
  nextSlug,
}: {
  slug: string;
  prevSlug: string;
  nextSlug: string;
}) {
  const c = useContent();
  const s = c.service;
  const item = c.services.items.find((it) => it.slug === slug);
  const meta = SERVICES.find((m) => m.slug === slug);
  if (!item || !meta) return null;

  const prev = c.services.items.find((it) => it.slug === prevSlug);
  const next = c.services.items.find((it) => it.slug === nextSlug);

  return (
    <main className="relative">
      <PageHero
        eyebrow={`${s.label} · ${meta.index}`}
        title={item.title}
        intro={item.overview}
        accent={meta.accent}
        backHref="/services"
      >
        <Reveal delay={0.24}>
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-accent-2">
            {item.tagline}
          </p>
        </Reveal>
      </PageHero>

      <section className="relative z-10 bg-void pb-8">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          {/* highlights */}
          <div className="lg:col-span-7">
            <Reveal>
              <h2 className="eyebrow">{s.highlights}</h2>
            </Reveal>
            <ul className="mt-6">
              {item.highlights.map((h, i) => (
                <Reveal as="li" key={h} delay={0.04 * i} className="flex gap-5 hairline-t py-5">
                  <span className="mt-1 font-mono text-xs text-accent tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-mist">{h}</span>
                </Reveal>
              ))}
            </ul>
          </div>

          {/* destinations + includes */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="rounded-2xl hairline bg-ink/40 p-7 md:p-8">
                <h2 className="eyebrow">{s.destinations}</h2>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {item.destinations.map((d) => (
                    <li key={d} className="rounded-full hairline px-3 py-1.5 text-xs text-mist">
                      {d}
                    </li>
                  ))}
                </ul>
                <h2 className="eyebrow mt-9">{s.includes}</h2>
                <ul className="mt-5 space-y-3">
                  {item.includes.map((inc) => (
                    <li key={inc} className="flex gap-3 text-sm text-mist">
                      <span className="mt-1 text-accent">◇</span>
                      {inc}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* process */}
      <section className="relative z-10 bg-void py-20 md:py-28">
        <div className="container-x">
          <Reveal>
            <h2 className="text-section-title text-chalk max-w-2xl text-balance">{s.process}</h2>
          </Reveal>
          <div className="mt-12 grid gap-px overflow-hidden hairline sm:grid-cols-2 lg:grid-cols-4">
            {item.process.map((p, i) => (
              <Reveal key={p.t} delay={0.05 * i} className="bg-void p-7 md:p-8">
                <span className="font-mono text-xs text-accent tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 font-display text-lg font-medium text-chalk">{p.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">{p.d}</p>
              </Reveal>
            ))}
          </div>

          {/* prev / next */}
          <div className="mt-16 flex items-center justify-between hairline-t pt-8 font-mono text-xs tracking-widest text-mist">
            {prev ? (
              <LocaleLink href={`/services/${prev.slug}`} className="transition-colors hover:text-chalk">
                {s.prev}
                <span className="mt-1 block text-fog">{prev.title}</span>
              </LocaleLink>
            ) : (
              <span />
            )}
            {next && (
              <LocaleLink
                href={`/services/${next.slug}`}
                className="text-right transition-colors hover:text-chalk"
              >
                {s.next}
                <span className="mt-1 block text-fog">{next.title}</span>
              </LocaleLink>
            )}
          </div>
        </div>
      </section>

      <CtaBanner />
    </main>
  );
}
