"use client";

import clsx from "clsx";
import { useContent } from "@/lib/content";
import { SERVICES } from "@/lib/site";
import { LocaleLink } from "@/components/ui/LocaleLink";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The four service cards, zipped from the localized copy (content.services)
 * and the structural data (site.SERVICES) by index. `tone` switches between
 * the dark cards (inner pages) and the ivory variant (homepage light beat).
 */
export function ServiceCards({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const s = useContent().services;
  const light = tone === "light";

  return (
    <div
      className={clsx(
        "grid gap-px overflow-hidden md:grid-cols-2",
        light ? "border border-[#141210]/10 bg-[#141210]/10" : "hairline"
      )}
    >
      {s.items.map((item, i) => {
        const meta = SERVICES[i];
        return (
          <Reveal key={item.slug} delay={0.05 * i}>
            <LocaleLink
              href={`/services/${item.slug}`}
              data-cursor
              className={clsx(
                "group relative flex h-full flex-col justify-between gap-10 p-8 transition-colors duration-500 md:p-12",
                light
                  ? "bg-[#f6f6f3] hover:bg-white"
                  : "bg-void hover:bg-ink"
              )}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={clsx(
                      "font-mono text-xs tabular-nums",
                      light ? "text-[#8a8578]" : "text-accent"
                    )}
                  >
                    {meta.index}
                  </span>
                  <span
                    aria-hidden
                    className={clsx(
                      "font-mono text-xs transition-transform duration-300 group-hover:translate-x-1",
                      light ? "text-[#8a8578] group-hover:text-[#141210]" : "text-fog group-hover:text-chalk"
                    )}
                  >
                    →
                  </span>
                </div>
                <h3
                  className={clsx(
                    "mt-8 font-display text-2xl font-medium md:text-3xl",
                    light ? "text-[#141210]" : "text-chalk"
                  )}
                >
                  {item.title}
                </h3>
                <p
                  className={clsx(
                    "mt-2 font-mono text-xs uppercase tracking-widest",
                    light ? "text-[#8a8578]" : "text-accent-3"
                  )}
                >
                  {item.tagline}
                </p>
                <p
                  className={clsx(
                    "mt-5 max-w-sm text-sm leading-relaxed",
                    light ? "text-[#55524b]" : "text-mist"
                  )}
                >
                  {item.blurb}
                </p>
              </div>

              <span
                aria-hidden
                className={clsx(
                  "font-mono text-xs uppercase tracking-widest transition-colors",
                  light ? "text-[#8a8578] group-hover:text-[#141210]" : "text-fog group-hover:text-chalk"
                )}
              >
                {s.explore}
              </span>

              {/* underline */}
              <span
                className={clsx(
                  "absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100",
                  light
                    ? "bg-gradient-to-r from-[#141210] to-transparent"
                    : "bg-gradient-to-r from-white to-transparent"
                )}
              />
            </LocaleLink>
          </Reveal>
        );
      })}
    </div>
  );
}
