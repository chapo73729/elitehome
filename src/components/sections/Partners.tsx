"use client";

import { useContent } from "@/lib/content";

/** Scrolling strip of network partners (pill style — swap in real logos later). */
export function Partners() {
  const c = useContent().partners;
  const seq = [...c.items, ...c.items];
  return (
    <section className="relative z-10 bg-void py-20">
      <div className="container-x">
        <div className="flex items-center gap-4">
          <span className="eyebrow">{c.eyebrow}</span>
          <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
          <span className="hidden font-mono text-[0.6rem] tracking-widest text-fog sm:inline">
            {c.note}
          </span>
        </div>
        <p className="mt-6 max-w-xl text-balance text-mist">{c.title}</p>
      </div>

      <div className="group relative mt-10 flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] [-webkit-mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="marquee-track group-hover:[animation-play-state:paused]">
          {seq.map((p, i) => (
            <span
              key={i}
              className="mx-2.5 inline-flex items-center gap-2.5 whitespace-nowrap rounded-full hairline bg-ink px-6 py-3 font-mono text-sm text-mist transition-colors hover:text-chalk"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-2" />
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
