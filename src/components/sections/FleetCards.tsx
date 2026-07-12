"use client";

import { useContent } from "@/lib/content";
import { FLEET } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { MercedesStar } from "@/components/ui/MercedesStar";

type Silhouette = "sedan" | "van" | "onebow";

const SILHOUETTE: Record<string, Silhouette> = {
  "s-class": "sedan",
  "e-class": "sedan",
  "v-class": "van",
  eqs: "onebow",
};

/* Engraved-line vehicle drawings — one fine champagne stroke per body style,
   in the register of luxury print illustration (viewBox 280×110, ground 88). */
const DRAWINGS: Record<
  Silhouette,
  { profile: string; glass: string; ground: string; wheels: [number, number] }
> = {
  sedan: {
    profile:
      "M14 88 C24 84 34 80 44 74 L74 54 C88 44 112 38 142 37 L180 38 C202 40 220 47 234 58 L252 70 C262 74 266 80 266 86",
    glass:
      "M80 54 C92 46 112 42 138 41 L172 42 C186 44 198 48 208 55 L220 63",
    ground: "M8 88 H62 M102 88 H206 M246 88 H272",
    wheels: [82, 226],
  },
  van: {
    profile:
      "M20 88 L18 50 Q18 34 34 34 L152 34 Q198 36 226 56 L246 70 Q252 76 250 84 L248 88",
    glass: "M32 46 H148 M162 46 C186 50 206 58 220 68",
    ground: "M8 88 H52 M92 88 H196 M236 88 H272",
    wheels: [72, 216],
  },
  onebow: {
    profile:
      "M14 88 C22 74 36 60 58 50 C86 37 122 33 152 36 C186 40 214 52 236 68 C246 74 252 80 254 86",
    glass:
      "M64 52 C88 41 122 37 150 40 C176 43 198 52 216 64",
    ground: "M8 88 H56 M96 88 H198 M238 88 H272",
    wheels: [76, 218],
  },
};

function VehicleDrawing({ kind }: { kind: Silhouette }) {
  const d = DRAWINGS[kind];
  return (
    <svg
      viewBox="0 0 280 110"
      className="h-full w-full"
      fill="none"
      aria-hidden
    >
      <path
        d={d.profile}
        stroke="var(--color-accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
        className="transition-opacity duration-500"
      />
      <path
        d={d.glass}
        stroke="rgba(199,203,209,0.55)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path d={d.ground} stroke="rgba(246,243,236,0.25)" strokeWidth="1.2" strokeLinecap="round" />
      {d.wheels.map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="88" r="16" stroke="rgba(199,203,209,0.65)" strokeWidth="1.4" />
          <circle cx={cx} cy="88" r="5.5" stroke="rgba(199,203,209,0.4)" strokeWidth="1" />
        </g>
      ))}
    </svg>
  );
}

/**
 * The fleet cards, zipped from localized copy (content.fleet) and specs
 * (site.FLEET). Marque marked by the three-pointed star; each body style
 * drawn as a fine engraved line over a lit stage. Reused on the homepage
 * and the /fleet page.
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
            className="group flex flex-col bg-void p-8 transition-colors duration-500 hover:bg-ink md:p-10"
          >
            {/* marque + line */}
            <div className="flex items-center justify-between">
              <MercedesStar size={30} className="text-platinum transition-colors duration-500 group-hover:text-chalk" />
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-fog">
                {spec.line}
              </p>
            </div>

            {/* the stage — engraved drawing over a soft champagne light */}
            <div className="relative mt-8 h-40 overflow-hidden rounded-xl md:h-44">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-transparent to-white/[0.02]" />
              <div className="absolute inset-x-8 bottom-0 h-24 rounded-full bg-[radial-gradient(closest-side,rgba(198,161,91,0.14),transparent)] blur-xl opacity-70 transition-opacity duration-700 group-hover:opacity-100" />
              <div className="absolute inset-x-6 inset-y-4 opacity-90 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]">
                <VehicleDrawing kind={SILHOUETTE[spec.id]} />
              </div>
            </div>

            {/* identity */}
            <h3 className="mt-8 font-display text-2xl font-semibold text-chalk md:text-3xl">
              {item.name}
            </h3>
            <p className="mt-1.5 font-mono text-[0.66rem] uppercase tracking-[0.28em] text-accent-2">
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
              {spec.electric && <span className="text-accent">◇ {f.electricLabel}</span>}
            </div>

            <ul className="mt-5 flex flex-wrap gap-2">
              {item.features.map((feat) => (
                <li key={feat} className="rounded-full hairline px-3.5 py-1.5 text-[0.7rem] text-mist">
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
