"use client";

import { LocaleLink } from "@/components/ui/LocaleLink";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { ChapterNumeral } from "@/components/ui/ChapterNumeral";
import { Compile } from "@/components/ui/Compile";
import { CanvasMotif } from "@/components/ui/CanvasMotif";
import { SceneBoundary } from "@/components/three/SceneBoundary";
import { useSceneVisibility } from "@/hooks/useSceneVisibility";
import { useContent } from "@/lib/content";
import { useLang } from "@/lib/lang";
import { usePerf } from "@/lib/perf";
import { WORK, localizeCase } from "@/lib/work";

const NeuralFlow = dynamic(() => import("@/components/three/NeuralFlow"), { ssr: false });
const DataStream3D = dynamic(() => import("@/components/three/DataStream3D"), { ssr: false });

const SCENE_BY_ID: Record<string, any> = {
  ai: NeuralFlow,
  strategy: NeuralFlow,
  software: DataStream3D,
  cloud: DataStream3D,
};

const EASE = [0.16, 1, 0.3, 1] as const;

/** Mono section register — index numeral, eyebrow, hairline running out. */
function SectionMark({ index, label }: { index: string; label?: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="font-mono text-xs text-accent tabular-nums">{index}</span>
      {label && <span className="eyebrow">{label}</span>}
      <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
    </div>
  );
}

export function IndustryDetail({
  id,
  prevId,
  nextId,
}: {
  id: string;
  prevId: string;
  nextId: string;
}) {
  const c = useContent();
  const L = c.industry;
  const items = c.industries.items;
  const industry = items.find((x) => x.id === id) ?? items[0];
  const prev = items.find((x) => x.id === prevId) ?? items[0];
  const next = items.find((x) => x.id === nextId) ?? items[0];

  const reduce = useReducedMotion() ?? false;
  const perf = usePerf();
  const scene = useSceneVisibility<HTMLDivElement>({ mountMargin: "600px 0px" });
  const Scene3D = SCENE_BY_ID[industry.id] ?? null;
  const poleCount = String(items.length).padStart(2, "0");

  const lang = useLang();
  const relatedSlugs: readonly string[] = industry.relatedWork ?? [];
  const relatedWork = relatedSlugs
    .map((slug) => WORK.find((w) => w.slug === slug))
    .filter((w): w is (typeof WORK)[number] => Boolean(w))
    .map((w) => localizeCase(w, lang));

  return (
    <main className="relative">
      {/* ---------- HERO — full-bleed scene, left-anchored reading column ---------- */}
      <section className="relative flex min-h-[92svh] flex-col overflow-hidden pb-16 pt-32 [@media(max-height:680px)]:pt-24">
        {/* the pole's own field, edge to edge */}
        <div ref={scene.ref} aria-hidden className="absolute inset-0">
          {Scene3D ? (
            <SceneBoundary
              fallback={<CanvasMotif variant={industry.motif} className="h-full w-full" />}
            >
              {scene.mounted && <Scene3D frameloop={scene.frameloop} />}
            </SceneBoundary>
          ) : (
            <CanvasMotif variant={industry.motif} className="h-full w-full" />
          )}
        </div>

        {/* left scrim keeps the reading column legible without burying the
            field; bottom scrim melts the scene into the void seam */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050505] from-15% via-[#050505]/65 via-45% to-transparent to-80%" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#050505] to-transparent" />

        {/* breadcrumb — small mono, top */}
        <div className="container-x relative z-10">
          <Reveal>
            <LocaleLink
              href="/services"
              data-cursor
              className="link-underline inline-flex items-center gap-2 font-mono text-xs tracking-widest text-mist"
            >
              {L.all}
            </LocaleLink>
          </Reveal>
        </div>

        {/* bottom-anchored editorial column, ghost numeral behind it */}
        <div className="container-x relative z-10 mt-auto pt-28">
          <div className="relative">
            {/* no register label here — the eyebrow already reads "01 SERVICE"
                and the label would land on the tagline line */}
            <ChapterNumeral n={industry.index} />

            <div className="relative z-10">
              <div className="flex items-center gap-4">
                <motion.span
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
                  className="font-mono text-xs text-accent tabular-nums"
                >
                  {industry.index}
                </motion.span>
                <motion.span
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
                  className="eyebrow"
                >
                  {L.label}
                </motion.span>
              </div>

              <h1 className="text-giant text-gradient mt-6 max-w-4xl text-balance">
                <span className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={reduce ? false : { y: "115%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
                  >
                    {industry.title}
                  </motion.span>
                </span>
              </h1>

              <motion.p
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}
                className="mt-5 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-mist sm:text-xs"
              >
                {industry.tagline}
              </motion.p>

              {/* overview — the editorial column, right here under the title */}
              <motion.p
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}
                className="mt-8 max-w-xl text-balance text-lg leading-relaxed text-mist"
              >
                {industry.overview}
              </motion.p>

              {/* mono instrument readout — hardcoded, non-translatable */}
              <motion.div
                aria-hidden
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.8 }}
                className="mt-8 font-mono text-[0.68rem] tracking-wider text-fog tabular-nums"
              >
                <span className="text-accent">▮</span> pole {industry.index} /{" "}
                {poleCount} · scene: {industry.id}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- METRICS — bare hairline strip, no boxes ---------- */}
      <section className="relative z-10 bg-void py-8">
        <div className="container-x">
          <ul className="grid sm:grid-cols-3 sm:gap-x-12">
            {industry.metrics.map((m, i) => (
              <Reveal as="li" key={m.label} delay={i * 0.08} className="hairline-t py-7">
                <div className="font-display text-3xl font-semibold tracking-tight text-chalk md:text-4xl">
                  {m.value}
                </div>
                <div className="mt-2 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-fog">
                  {m.label}
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- CAPABILITIES — two-column hairline index ---------- */}
      <section className="relative z-10 bg-void py-24 md:py-32">
        <div className="container-x">
          <Reveal>
            <SectionMark index="01" label={L.capabilities} />
          </Reveal>
          <ul className="mt-12 grid border-b border-white/[0.07] sm:grid-cols-2 sm:gap-x-14">
            {industry.capabilities.map((cap, i) => (
              <Reveal as="li" key={cap} delay={(i % 2) * 0.06} className="hairline-t">
                <div className="flex items-baseline gap-5 py-5">
                  <span className="font-mono text-xs text-accent tabular-nums">
                    [{String(i + 1).padStart(2, "0")}]
                  </span>
                  <span className="font-display text-lg leading-tight text-chalk">
                    {cap}
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- APPROACH — numbered editorial rows ---------- */}
      <section className="relative z-10 bg-void py-24 md:py-32">
        <div className="container-x">
          <Reveal>
            <SectionMark index="02" />
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="text-section-title mt-7 max-w-2xl text-balance text-chalk">
              {L.howWeOperate}
            </h2>
          </Reveal>
          <ol className="mt-14 border-b border-white/[0.07]">
            {industry.approach.map((step, i) => (
              <Reveal as="li" key={step.t} delay={i * 0.06} className="hairline-t">
                <div className="grid items-baseline gap-x-6 gap-y-2 py-8 md:grid-cols-12">
                  <span className="font-mono text-xs text-accent tabular-nums md:col-span-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-chalk md:col-span-4 md:text-3xl">
                    {step.t}
                  </h3>
                  <p className="max-w-md text-mist md:col-span-7">{step.d}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- WHAT YOU GET — compiled checklist ---------- */}
      <section className="relative z-10 bg-void py-24 md:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <SectionMark index="03" label={L.deliverables} />
              <p className="mt-6 max-w-xs text-balance text-mist">{L.deliverablesIntro}</p>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <Compile label="deliverables" index="03" disabled={perf}>
              <ul className="border-b border-white/[0.07]">
                {industry.deliverables.map((d, i) => (
                  <Reveal as="li" key={d} delay={i * 0.04} className="hairline-t">
                    <div className="flex items-baseline gap-5 py-5">
                      <span className="font-mono text-xs text-accent" aria-hidden>
                        ✓
                      </span>
                      <span className="flex-1 text-chalk">{d}</span>
                      <span
                        className="hidden font-mono text-[0.65rem] text-fog tabular-nums sm:inline"
                        aria-hidden
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </Compile>
          </div>
        </div>
      </section>

      {/* ---------- HOW WE ENGAGE — three numbered editorial columns ---------- */}
      <section className="relative z-10 bg-void py-24 md:py-32">
        <div className="container-x">
          <Compile label="engage" index="04" disabled={perf}>
            <Reveal>
              <SectionMark index="04" label={L.engagement} />
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-6 max-w-xl text-balance text-mist">{L.engagementIntro}</p>
            </Reveal>
            <ol className="mt-14 grid gap-y-10 md:grid-cols-3 md:gap-x-12">
              {industry.engagement.map((step, i) => (
                <Reveal as="li" key={step.t} delay={i * 0.1} className="hairline-t">
                  <div className="pt-6">
                    <span className="font-mono text-3xl text-accent tabular-nums md:text-4xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-chalk md:text-2xl">
                      {step.t}
                    </h3>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-mist">
                      {step.d}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </Compile>
        </div>
      </section>

      {/* ---------- TYPICAL STACK — refined mono pills ---------- */}
      <section className="relative z-10 bg-void pb-24 md:pb-32">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <SectionMark index="05" label={L.stack} />
              <p className="mt-6 max-w-xs text-balance text-mist">{L.stackIntro}</p>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <Compile label="stack" index="05" disabled={perf}>
              <ul className="flex flex-wrap gap-2">
                {industry.stack.map((t) => (
                  <li
                    key={t}
                    className="rounded-full hairline px-3.5 py-1.5 font-mono text-[0.65rem] tracking-widest text-mist"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </Compile>
          </div>
        </div>
      </section>

      {/* ---------- RELATED WORK — editorial index rows ---------- */}
      {relatedWork.length > 0 && (
        <section className="relative z-10 bg-void pb-24 md:pb-32">
          <div className="container-x">
            <Reveal>
              <SectionMark index="06" label={L.relatedWork} />
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-6 max-w-xl text-balance text-mist">{L.relatedWorkIntro}</p>
            </Reveal>
            <ul className="mt-12 border-b border-white/[0.07]">
              {relatedWork.map((w, i) => (
                <Reveal as="li" key={w.slug} delay={i * 0.06} className="hairline-t">
                  <LocaleLink
                    href={`/work/${w.slug}`}
                    data-cursor
                    aria-label={`${w.name} — ${L.viewCase}`}
                    className="group grid items-baseline gap-x-6 gap-y-2 py-8 md:grid-cols-12"
                  >
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-accent md:col-span-2">
                      {w.field}
                    </span>
                    <span className="font-display text-2xl font-semibold tracking-tight text-chalk transition-transform duration-500 group-hover:translate-x-1 md:col-span-4 md:text-3xl">
                      {w.name}
                    </span>
                    <span className="max-w-md text-sm text-mist md:col-span-5">
                      {w.summary}
                    </span>
                    <span
                      aria-hidden
                      className="hidden font-mono text-xs text-fog transition-all duration-500 group-hover:translate-x-1 group-hover:text-chalk md:col-span-1 md:block md:justify-self-end"
                    >
                      →
                    </span>
                  </LocaleLink>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------- CTA — bare statement on the void, one azure link ---------- */}
      <section className="relative z-10 bg-void py-28 md:py-40">
        <div className="container-x">
          <Reveal>
            <h2 className="text-giant text-gradient max-w-4xl text-balance">
              {L.ctaPrefix} {industry.title.toLowerCase()} {L.ctaSuffix}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-8 max-w-xl text-balance text-lg text-mist">{L.ctaBody}</p>
          </Reveal>
          <Reveal delay={0.16}>
            <LocaleLink
              href="/contact"
              data-cursor
              className="group mt-10 inline-flex items-baseline gap-3 text-accent transition-colors hover:text-chalk"
            >
              <span
                aria-hidden
                className="font-mono text-xs uppercase tracking-[0.3em] transition-transform duration-500 group-hover:translate-x-1"
              >
                →
              </span>
              <span className="font-display text-lg">{L.startProject}</span>
            </LocaleLink>
          </Reveal>
        </div>
      </section>

      {/* ---------- PREV / NEXT — two huge display links on a hairline ---------- */}
      <section className="relative z-10 bg-void">
        <div className="hairline-t">
          <nav className="container-x grid sm:grid-cols-2">
            <LocaleLink
              href={`/services/${prev.id}`}
              data-cursor
              className="group py-14 sm:py-20 sm:pr-10"
            >
              <span className="font-mono text-xs tracking-widest text-fog transition-colors duration-500 group-hover:text-accent">
                {L.prev}
              </span>
              <span className="mt-4 block font-display text-3xl font-semibold tracking-tight text-mist transition-all duration-500 group-hover:-translate-x-1 group-hover:text-chalk md:text-5xl">
                {prev.title}
              </span>
            </LocaleLink>
            <LocaleLink
              href={`/services/${next.id}`}
              data-cursor
              className="group border-t border-white/[0.07] py-14 text-right sm:border-l sm:border-t-0 sm:py-20 sm:pl-10"
            >
              <span className="font-mono text-xs tracking-widest text-fog transition-colors duration-500 group-hover:text-accent">
                {L.next}
              </span>
              <span className="mt-4 block font-display text-3xl font-semibold tracking-tight text-mist transition-all duration-500 group-hover:translate-x-1 group-hover:text-chalk md:text-5xl">
                {next.title}
              </span>
            </LocaleLink>
          </nav>
        </div>
      </section>
    </main>
  );
}
