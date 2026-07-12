"use client";

import { useContent } from "@/lib/content";
import { FLEET } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { MercedesStar } from "@/components/ui/MercedesStar";

/* Photographies de la maison, par véhicule. */
const PHOTOS: Record<string, { src: string; pos: string; alt: string }> = {
  "s-class": {
    src: "/images/fleet-s.webp",
    pos: "center 62%",
    alt: "Mercedes Classe S BLACKFIRST — berline noire, calandre chromée",
  },
  "v-class": {
    src: "/images/fleet-v.webp",
    pos: "center 55%",
    alt: "Mercedes Classe V BLACKFIRST devant un palace",
  },
};

/**
 * The fleet cards, zipped from localized copy (content.fleet) and specs
 * (site.FLEET). Each vehicle leads with the house's own photograph and the
 * three-pointed star of the marque. Reused on the homepage and /fleet.
 */
export function FleetCards() {
  const f = useContent().fleet;

  return (
    <div className="grid gap-px overflow-hidden hairline md:grid-cols-2">
      {f.items.map((item, i) => {
        const spec = FLEET[i];
        const photo = PHOTOS[spec.id];
        return (
          <Reveal
            key={spec.id}
            delay={0.05 * i}
            className="group flex flex-col bg-void transition-colors duration-500 hover:bg-ink"
          >
            {/* la photographie du véhicule */}
            <div className="relative h-64 overflow-hidden md:h-72">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                style={{ objectPosition: photo.pos }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-void/10" />
              {/* la marque, posée sur la photo */}
              <div className="absolute bottom-4 left-6 flex items-center gap-3">
                <MercedesStar size={26} className="text-chalk/90" />
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-chalk/80">
                  {spec.line}
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-8 pt-7 md:p-10 md:pt-8">
              {/* identity */}
              <h3 className="text-xl font-medium tracking-[0.06em] text-chalk md:text-2xl">
                {item.name}
              </h3>
              <p className="mt-1.5 font-mono text-[0.66rem] uppercase tracking-[0.28em] text-accent-3">
                {item.tagline}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-mist">{item.blurb}</p>

              {/* specs */}
              <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3 hairline-t pt-6 font-mono text-xs text-fog">
                <span>
                  <span className="text-chalk tabular-nums">{spec.seats}</span> · {f.seatsLabel}
                </span>
                <span>
                  <span className="text-chalk tabular-nums">{spec.luggage}</span> · {f.luggageLabel}
                </span>
              </div>

              <ul className="mt-5 flex flex-wrap gap-2">
                {item.features.map((feat) => (
                  <li key={feat} className="rounded-full hairline px-3.5 py-1.5 text-[0.7rem] text-mist">
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
