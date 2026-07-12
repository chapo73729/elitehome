"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/lang";

const T = {
  en: { status: "Chauffeur on call", city: "Geneva · Switzerland" },
  fr: { status: "Chauffeur disponible", city: "Genève · Suisse" },
} as const;

/**
 * Executive strip — two discreet readouts over the hero: live Geneva time on
 * the right, the operating base and availability on the left. No brackets, no
 * scan sweeps; the quiet register of a hotel lobby clock.
 */
export function HeroHud({ ready }: { ready: boolean }) {
  const t = T[useLang()];
  const [clock, setClock] = useState("--:--");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("fr-CH", {
      timeZone: "Europe/Zurich",
      hour: "2-digit",
      minute: "2-digit",
    });
    const tick = () => setClock(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);

  const fade = {
    initial: { opacity: 0 },
    animate: ready ? { opacity: 1 } : { opacity: 0 },
    transition: { duration: 1.2, delay: 1.6 },
  };

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[5] hidden font-mono text-[0.62rem] uppercase tracking-[0.3em] text-fog md:block [@media(max-height:680px)]:!hidden"
    >
      <motion.div {...fade} className="absolute left-12 top-28 space-y-2">
        <div className="flex items-center gap-2.5 normal-case tracking-[0.2em] text-accent-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-2 [animation:pulse_3s_ease-in-out_infinite]" />
          {t.status}
        </div>
        <div>{t.city}</div>
      </motion.div>

      <motion.div {...fade} className="absolute right-12 top-28 space-y-2 text-right">
        <div className="text-chalk/80 tabular-nums text-sm tracking-[0.2em]">{clock}</div>
        <div>46.2044° N · 6.1432° E</div>
      </motion.div>
    </div>
  );
}
