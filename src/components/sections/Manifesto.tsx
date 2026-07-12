"use client";

import { useContent } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Reveal, SplitWords } from "@/components/ui/Reveal";

/**
 * Manifesto — the cinematic positioning beat. "More than a journey. An
 * experience." followed by the four house values.
 */
export function Manifesto() {
  const m = useContent().manifesto;

  return (
    <Section id="manifesto" className="overflow-hidden">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">{m.tag}</p>
        </Reveal>

        <div className="mt-10 space-y-2 md:mt-14">
          {m.lines.map((line, i) => (
            <SplitWords
              key={line}
              text={line}
              as="p"
              delay={i * 0.15}
              className="text-giant text-gradient max-w-4xl"
            />
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="text-lead mt-10 max-w-xl">{m.outro}</p>
        </Reveal>

        {/* values */}
        <div className="mt-16 grid gap-px overflow-hidden hairline sm:grid-cols-2 lg:grid-cols-4 md:mt-24">
          {m.values.map((v, i) => (
            <Reveal
              key={v.k}
              delay={0.06 * i}
              className="group relative bg-void p-7 transition-colors duration-500 hover:bg-ink md:p-9"
            >
              <span className="font-mono text-xs text-accent tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 font-display text-xl font-medium text-chalk">{v.k}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mist">{v.v}</p>
              <span className="absolute inset-x-7 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-accent to-transparent transition-transform duration-500 group-hover:scale-x-100" />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
