"use client";

import { SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { useContent } from "@/lib/content";

/** Bento grid — a multi-size feature board summarising what makes ARDLABS different. */
export function Bento() {
  const c = useContent().bento;
  const cells = c.cells;
  return (
    <section className="relative z-10 bg-void py-28 md:py-36">
      <SectionHeading index="06" eyebrow={c.eyebrow} title={c.title} />
      <div className="container-x mt-14">
        <div className="grid auto-rows-[200px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cells.map((cell, i) => (
            <Reveal
              key={cell.title}
              delay={(i % 3) * 0.06}
              className={i === 0 ? "sm:col-span-2 sm:row-span-2" : ""}
            >
              <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl hairline bg-ink p-7 transition-colors duration-500 hover:border-white/15">
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-20 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-40"
                  style={{ background: i === 0 ? "#5b8cff" : i % 2 ? "#7af2e0" : "#b48cff" }}
                />
                <div className="relative z-10">
                  <span className="font-mono text-xs text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="relative z-10">
                  <h3
                    className={`font-display font-semibold tracking-tight text-chalk ${
                      i === 0 ? "text-3xl md:text-4xl" : "text-xl"
                    }`}
                  >
                    {cell.title}
                  </h3>
                  <p
                    className={`mt-3 leading-relaxed text-mist ${
                      i === 0 ? "max-w-md text-base" : "text-sm"
                    }`}
                  >
                    {cell.body}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
