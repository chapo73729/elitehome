"use client";

import { Reveal } from "@/components/ui/Reveal";
import { CanvasMotif } from "@/components/ui/CanvasMotif";
import { useContent } from "@/lib/content";

export function Capabilities() {
  const CAPS = useContent().capabilities.items;
  return (
    <section id="lab" className="relative z-10 scroll-mt-24 bg-void">
      {CAPS.map((c, i) => (
        <div
          key={c.n}
          className="container-x grid items-center gap-10 border-t border-white/5 py-24 md:py-32 lg:grid-cols-2"
        >
          {/* visual */}
          <div
            className={`relative order-1 h-[44vh] min-h-[300px] overflow-hidden rounded-3xl hairline bg-ink ${
              i % 2 === 1 ? "lg:order-2" : ""
            }`}
          >
            <CanvasMotif variant={c.variant} className="absolute inset-0 h-full w-full" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(95%_95%_at_50%_45%,transparent_55%,rgba(5,5,5,0.65)_100%)]" />
            <span className="absolute bottom-5 left-6 font-mono text-[0.65rem] tracking-[0.3em] text-fog">
              {c.tag.toUpperCase()}
            </span>
          </div>

          {/* copy */}
          <div className={`order-2 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-accent">{c.n}</span>
                <span className="eyebrow">{c.tag}</span>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <h3 className="text-section-title text-gradient mt-6 max-w-md text-balance">
                {c.title}
              </h3>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-md text-balance text-mist">{c.text}</p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-wrap gap-2">
                {c.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full hairline px-4 py-1.5 font-mono text-xs text-mist"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      ))}
    </section>
  );
}
