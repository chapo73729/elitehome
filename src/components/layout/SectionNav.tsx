"use client";

import { useEffect, useState } from "react";
import { scrollToTarget } from "./SmoothScroll";

const SECTIONS = [
  { id: "hero", label: "Top" },
  { id: "manifesto", label: "Manifesto" },
  { id: "core", label: "AI Core" },
  { id: "network", label: "Network" },
  { id: "industries", label: "Industries" },
  { id: "contact", label: "Contact" },
] as const;

/** Vertical progress rail on the right — Awwwards-style section indicator. */
export function SectionNav() {
  const [active, setActive] = useState("hero");

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
      aria-label="Section navigation"
      className="fixed right-6 top-1/2 z-[110] hidden -translate-y-1/2 flex-col items-end gap-3.5 lg:flex"
    >
      {SECTIONS.map((s) => {
        const on = active === s.id;
        return (
          <button
            key={s.id}
            onClick={() => scrollToTarget("#" + s.id)}
            aria-label={s.label}
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
              {s.label}
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
