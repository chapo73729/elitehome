"use client";

import { useEffect, useState } from "react";
import { scrollToTarget } from "./SmoothScroll";
import { useLang } from "@/lib/lang";

const SECTIONS = [
  { id: "hero", label: { en: "Top", fr: "Haut" } },
  { id: "manifesto", label: { en: "Manifesto", fr: "Manifeste" } },
  { id: "core", label: { en: "AI Core", fr: "Cœur IA" } },
  { id: "network", label: { en: "Network", fr: "Réseau" } },
  { id: "services", label: { en: "Services", fr: "Services" } },
  { id: "security", label: { en: "Security", fr: "Sécurité" } },
  { id: "team", label: { en: "Team", fr: "Équipe" } },
  { id: "contact", label: { en: "Contact", fr: "Contact" } },
] as const;

/** Vertical progress rail on the right — Awwwards-style section indicator. */
export function SectionNav() {
  const [active, setActive] = useState("hero");
  const lang = useLang();

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      Boolean
    ) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-48% 0px -48% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav
      aria-label={lang === "fr" ? "Navigation des sections" : "Section navigation"}
      className="fixed right-6 top-1/2 z-[110] hidden -translate-y-1/2 flex-col items-end gap-3.5 lg:flex"
    >
      {SECTIONS.map((s) => {
        const on = active === s.id;
        return (
          <button
            key={s.id}
            onClick={() => scrollToTarget("#" + s.id)}
            aria-label={s.label[lang]}
            aria-current={on ? "true" : undefined}
            className="group flex items-center gap-3"
          >
            <span
              className={`font-mono text-[0.6rem] uppercase tracking-[0.25em] transition-all duration-300 ${
                on
                  ? "text-chalk opacity-100"
                  : "text-fog opacity-0 group-hover:opacity-100"
              }`}
            >
              {s.label[lang]}
            </span>
            <span
              className={`block rounded-full transition-all duration-300 ${
                on
                  ? "h-2 w-2 bg-accent shadow-[0_0_10px_2px_rgba(79,140,255,0.5)]"
                  : "h-1.5 w-1.5 bg-white/25 group-hover:bg-white/60"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
