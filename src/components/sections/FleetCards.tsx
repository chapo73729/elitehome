"use client";

import { useContent } from "@/lib/content";
import { FLEET } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";

/** Silhouette of a saloon / van — a light mark, tinted per vehicle accent. */
function CarMark({ van, color }: { van: boolean; color: string }) {
  return (
    <svg viewBox="0 0 200 80" className="h-16 w-40" aria-hidden fill="none">
      {van ? (
        <path
          d="M12 58 L12 30 Q14 20 26 20 L150 20 Q168 22 180 40 L188 52 Q190 58 184 58 Z"
          stroke={color}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M10 58 Q20 40 40 38 L64 26 Q80 20 108 20 L138 22 Q160 26 178 44 L188 52 Q190 58 182 58 Z"
          stroke={color}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      )}
      <circle cx="52" cy="58" r="11" stroke={color} strokeWidth="1.6" />
      <circle cx="150" cy="58" r="11" stroke={color} strokeWidth="1.6" />
    </svg>
  );
}

/**
 * The fleet cards, zipped from localized copy (content.fleet) and specs
 * (site.FLEET). Reused on the homepage and the /fleet page.
 */
export function FleetCards() {
  const f = useContent().fleet;

  return (
    <div className="grid gap-px overflow-hidden hairline md:grid-cols-2">
      {f.items.map((item, i) => {
        const spec = FLEET[i];
        return (
          <Reveal
            key={spec.id}
            delay={0.05 * i}
            className="group flex flex-col justify-between gap-8 bg-void p-8 transition-colors duration-500 hover:bg-ink md:p-10"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-[0.62rem] tracking-[0.3em] text-fog uppercase">{spec.line}</p>
                <h3 className="mt-3 font-display text-xl font-medium text-chalk md:text-2xl">{item.name}</h3>
                <p className="mt-1.5 text-sm text-accent-2">{item.tagline}</p>
              </div>
              <CarMark van={spec.id === "v-class"} color={spec.accent} />
            </div>

            <p className="text-sm leading-relaxed text-mist">{item.blurb}</p>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 hairline-t pt-6 font-mono text-xs text-fog">
              <span>
                <span className="text-chalk tabular-nums">{spec.seats}</span> · {f.seatsLabel}
              </span>
              <span>
                <span className="text-chalk tabular-nums">{spec.luggage}</span> · {f.luggageLabel}
              </span>
              {spec.electric && (
                <span className="text-accent">◇ {f.electricLabel}</span>
              )}
            </div>

            <ul className="flex flex-wrap gap-2">
              {item.features.map((feat) => (
                <li key={feat} className="rounded-full hairline px-3 py-1 text-[0.7rem] text-mist">
                  {feat}
                </li>
              ))}
            </ul>
          </Reveal>
        );
      })}
    </div>
  );
}
