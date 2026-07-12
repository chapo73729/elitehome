"use client";

import { useContent } from "@/lib/content";
import { SERVICES } from "@/lib/site";
import { LocaleLink } from "@/components/ui/LocaleLink";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The four service cards, zipped from the localized copy (content.services) and
 * the structural data (site.SERVICES) by index. Reused on the homepage and the
 * /services index.
 */
export function ServiceCards() {
  const s = useContent().services;

  return (
    <div className="grid gap-px overflow-hidden hairline md:grid-cols-2">
      {s.items.map((item, i) => {
        const meta = SERVICES[i];
        return (
          <Reveal key={item.slug} delay={0.05 * i}>
            <LocaleLink
              href={`/services/${item.slug}`}
              data-cursor
              className="group relative flex h-full flex-col justify-between gap-10 bg-void p-8 transition-colors duration-500 hover:bg-ink md:p-12"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-accent tabular-nums">{meta.index}</span>
                  <span
                    aria-hidden
                    className="font-mono text-xs text-fog transition-transform duration-300 group-hover:translate-x-1 group-hover:text-chalk"
                  >
                    →
                  </span>
                </div>
                <h3 className="mt-8 font-display text-2xl font-medium text-chalk md:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-2 font-mono text-xs tracking-widest text-accent-2 uppercase">
                  {item.tagline}
                </p>
                <p className="mt-5 max-w-sm text-sm leading-relaxed text-mist">{item.blurb}</p>
              </div>

              <span
                aria-hidden
                className="text-xs font-mono uppercase tracking-widest text-fog transition-colors group-hover:text-chalk"
              >
                {s.explore}
              </span>

              {/* accent underline */}
              <span
                className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                style={{ background: `linear-gradient(90deg, ${meta.accent}, transparent)` }}
              />
            </LocaleLink>
          </Reveal>
        );
      })}
    </div>
  );
}
