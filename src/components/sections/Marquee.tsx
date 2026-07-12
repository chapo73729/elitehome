"use client";

import { useLang } from "@/lib/lang";

const STOPS = {
  fr: ["Genève", "Aéroport GVA", "Lausanne", "Montreux", "Verbier", "Courchevel", "Lyon", "Milan", "Zurich"],
  en: ["Geneva", "GVA Airport", "Lausanne", "Montreux", "Verbier", "Courchevel", "Lyon", "Milan", "Zurich"],
} as const;

/**
 * Ruban des destinations — une ligne de villes à l'échelle display qui glisse
 * lentement entre deux chapitres. Deux copies de la piste pour une boucle
 * parfaite ; figé (une seule copie visible) sous reduced-motion.
 */
export function Marquee() {
  const stops = STOPS[useLang()];

  const Track = ({ hidden = false }: { hidden?: boolean }) => (
    <span aria-hidden={hidden || undefined} className="flex shrink-0 items-baseline">
      {stops.map((s) => (
        <span key={s} className="flex items-baseline">
          <span className="font-display text-5xl font-medium text-chalk/90 md:text-7xl">{s}</span>
          <span className="mx-6 text-2xl text-fog/60 md:mx-10 md:text-3xl">·</span>
        </span>
      ))}
    </span>
  );

  return (
    <div
      aria-hidden
      className="relative z-10 select-none overflow-hidden border-y border-white/[0.06] bg-void py-8 md:py-10"
    >
      <div className="marquee-track flex w-max">
        <Track />
        <Track hidden />
      </div>
      {/* fondu latéral pour l'entrée/sortie */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-void to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-void to-transparent" />
    </div>
  );
}
