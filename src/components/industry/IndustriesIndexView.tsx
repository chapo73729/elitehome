"use client";

import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { useContent } from "@/lib/content";

export function IndustriesIndexView() {
  const c = useContent().industries;
  const L = useContent().industry;
  return (
    <main className="relative">
      <section className="relative overflow-hidden pb-10 pt-44">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[55vh] w-[55vh] -translate-x-1/2 rounded-full bg-accent/15 blur-[140px]" />
        <div className="container-x relative">
          <Reveal>
            <Link href="/" className="link-underline font-mono text-xs tracking-widest text-mist">
              {L.home}
            </Link>
          </Reveal>
          <Reveal delay={0.06}>
            <span className="eyebrow mt-8 block">{c.eyebrow} · 06</span>
          </Reveal>
          <Reveal delay={0.12}>
            <h1 className="text-mega text-gradient mt-5 max-w-4xl text-balance">
              {c.indexEyebrow}
            </h1>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-6 max-w-xl text-balance text-lg text-mist">{c.indexIntro}</p>
          </Reveal>
        </div>
      </section>

      <section className="relative z-10 bg-void py-16 md:py-24">
        <div className="container-x">
          <div className="grid gap-px overflow-hidden rounded-3xl hairline md:grid-cols-2">
            {c.items.map((ind, i) => (
              <Reveal key={ind.id} delay={(i % 2) * 0.08}>
                <Link
                  href={`/industries/${ind.id}`}
                  className="group relative flex h-full flex-col justify-between bg-ink p-8 transition-colors duration-500 hover:bg-smoke md:p-12"
                >
                  <span
                    className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full opacity-20 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-50"
                    style={{ background: ind.accent }}
                  />
                  <div className="relative flex items-center justify-between">
                    <span className="font-mono text-sm" style={{ color: ind.accent }}>
                      {ind.index}
                    </span>
                    <span className="font-mono text-xs tracking-widest text-fog opacity-0 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:text-chalk group-hover:opacity-100">
                      {c.explore}
                    </span>
                  </div>
                  <div className="relative mt-16">
                    <h2 className="font-display text-3xl font-semibold tracking-tight text-chalk md:text-4xl">
                      {ind.title}
                    </h2>
                    <p className="mt-4 max-w-md text-sm text-mist">{ind.blurb}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
