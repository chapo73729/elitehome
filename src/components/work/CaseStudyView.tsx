"use client";

import { LocaleLink } from "@/components/ui/LocaleLink";
import { WORK, getCase, localizeCase } from "@/lib/work";
import { INDUSTRIES } from "@/lib/site";
import { PageHeaderFX } from "@/components/ui/PageHeaderFX";
import { Reveal } from "@/components/ui/Reveal";
import { ChapterNumeral } from "@/components/ui/ChapterNumeral";
import { Compile } from "@/components/ui/Compile";
import { useLang } from "@/lib/lang";
import { usePerf } from "@/lib/perf";

const T = {
  en: {
    back: "← Work",
    representative: "Demonstration case",
    ourRole: "Our role",
    stack: "Stack",
    challenge: "The challenge",
    approach: "Our approach",
    outcome: "The outcome",
    ctaTitle: "Have a project like this?",
    ctaBody:
      "Tell us what you're trying to build — we'll tell you how we'd approach it.",
    startProject: "Start a project",
    moreWork: "More work",
    prev: "Previous",
    next: "Next",
    poleTitles: {
      strategy: "Strategy & Consulting",
      software: "Design & Development",
      ai: "Data & AI",
      cloud: "Cloud & Infrastructure",
    } as Record<string, string>,
  },
  fr: {
    back: "← Réalisations",
    representative: "Étude démonstrative",
    ourRole: "Notre rôle",
    stack: "Stack",
    challenge: "Le défi",
    approach: "Notre approche",
    outcome: "Le résultat",
    ctaTitle: "Un projet de ce type ?",
    ctaBody:
      "Dites-nous ce que vous cherchez à construire — nous vous dirons comment nous l'aborderions.",
    startProject: "Démarrer un projet",
    moreWork: "Plus de réalisations",
    prev: "Précédent",
    next: "Suivant",
    poleTitles: {
      strategy: "Conseil & stratégie",
      software: "Conception & développement",
      ai: "Données & IA",
      cloud: "Cloud & infrastructure",
    } as Record<string, string>,
  },
};

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

export function CaseStudyView({ slug }: { slug: string }) {
  const lang = useLang();
  const t = T[lang];
  const perf = usePerf();

  const base = getCase(slug);
  if (!base) return null;
  const w = localizeCase(base, lang);

  const idx = WORK.findIndex((x) => x.slug === w.slug);
  const count = WORK.length;
  const caseIndex = String(idx + 1).padStart(2, "0");
  const prev = localizeCase(WORK[(idx - 1 + count) % count], lang);
  const next = localizeCase(WORK[(idx + 1) % count], lang);

  const pole = INDUSTRIES.find((i) => i.id === w.pole);
  const poleTitle = pole ? t.poleTitles[pole.id] ?? pole.title : null;

  return (
    <main className="relative">
      {/* ---------- HERO — giant title on the void, ghost numeral ---------- */}
      <section className="relative overflow-hidden pb-12 pt-40">
        <PageHeaderFX accent={w.accent} />
        <div className="container-x relative">
          <ChapterNumeral n={caseIndex} label="CASE" />

          <div className="relative z-10 max-w-3xl">
            <Reveal>
              <LocaleLink
                href="/work"
                data-cursor
                className="link-underline font-mono text-xs tracking-widest text-mist"
              >
                {t.back}
              </LocaleLink>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs tracking-widest text-fog">
                <span style={{ color: w.accent }}>{w.code}</span>
                <span className="text-mist">{w.client}</span>
                <span>{w.field}</span>
                <span>{w.stage}</span>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <h1 className="text-giant text-gradient mt-5 text-balance">{w.name}</h1>
            </Reveal>

            <Reveal delay={0.18}>
              <p className="mt-4 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-fog">
                {t.representative} · {caseIndex} / {String(count).padStart(2, "0")}
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <p className="mt-6 max-w-xl text-balance text-lg text-mist">{w.summary}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- ROLE / STACK — bare hairline checklists, no pills ---------- */}
      <section className="relative z-10 bg-void py-14">
        <div className="container-x">
          <dl className="grid gap-x-14 gap-y-10 md:grid-cols-2">
            <Reveal>
              <dt>
                <SectionMark index="R" label={t.ourRole} />
              </dt>
              <dd className="mt-6">
                <ul className="border-b border-white/[0.07]">
                  {w.roles.map((r, i) => (
                    <li key={r} className="hairline-t flex items-baseline gap-5 py-4">
                      <span className="font-mono text-xs text-accent tabular-nums">
                        [{String(i + 1).padStart(2, "0")}]
                      </span>
                      <span className="font-display text-lg leading-tight text-chalk">
                        {r}
                      </span>
                    </li>
                  ))}
                </ul>
              </dd>
            </Reveal>
            <Reveal delay={0.08}>
              <dt>
                <SectionMark index="S" label={t.stack} />
              </dt>
              <dd className="mt-6">
                <ul className="flex flex-wrap gap-x-6 gap-y-3 pt-1">
                  {w.tech.map((tech) => (
                    <li
                      key={tech}
                      className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-mist"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </dd>
            </Reveal>
          </dl>
        </div>
      </section>

      {/* ---------- CHALLENGE — editorial column ---------- */}
      <article className="relative z-10 bg-void">
        <section className="py-20 md:py-28">
          <div className="container-x grid gap-x-12 gap-y-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Reveal>
                <SectionMark index="01" label={t.challenge} />
              </Reveal>
            </div>
            <div className="max-w-xl space-y-5 lg:col-span-8">
              {w.challenge.map((p, i) => (
                <Reveal key={i} delay={0.06 + i * 0.06}>
                  <p className="text-lg leading-relaxed text-mist">{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- APPROACH — numbered editorial rows, compiled ---------- */}
        <section className="py-20 md:py-28">
          <div className="container-x">
            <Reveal>
              <SectionMark index="02" label={t.approach} />
            </Reveal>
            <Compile label="approach" index="02" disabled={perf} className="mt-12">
              <ol className="border-b border-white/[0.07]">
                {w.approach.map((a, i) => (
                  <Reveal as="li" key={a.title} delay={i * 0.06} className="hairline-t">
                    <div className="grid items-baseline gap-x-6 gap-y-2 py-8 md:grid-cols-12">
                      <span className="font-mono text-xs text-accent tabular-nums md:col-span-1">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-display text-2xl font-semibold tracking-tight text-chalk md:col-span-4 md:text-3xl">
                        {a.title}
                      </h3>
                      <p className="max-w-md leading-relaxed text-mist md:col-span-7">
                        {a.body}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </Compile>
          </div>
        </section>

        {/* ---------- OUTCOME — column + compiled highlight checklist ---------- */}
        <section className="py-20 md:py-28">
          <div className="container-x grid gap-x-12 gap-y-12 lg:grid-cols-12">
            <div className="max-w-xl lg:col-span-7">
              <Reveal>
                <SectionMark index="03" label={t.outcome} />
              </Reveal>
              <div className="mt-8 space-y-5">
                {w.outcome.map((p, i) => (
                  <Reveal key={i} delay={0.06 + i * 0.06}>
                    <p className="text-lg leading-relaxed text-mist">{p}</p>
                  </Reveal>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5">
              <Compile label="outcome" index="03" disabled={perf}>
                <ul className="border-b border-white/[0.07]">
                  {w.highlights.map((h, i) => (
                    <Reveal as="li" key={h} delay={i * 0.04} className="hairline-t">
                      <div className="flex items-baseline gap-5 py-4">
                        <span className="font-mono text-xs text-accent" aria-hidden>
                          ✓
                        </span>
                        <span className="flex-1 text-chalk">{h}</span>
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
      </article>

      {/* ---------- CTA — bare statement on the void, one azure link ---------- */}
      <section className="relative z-10 bg-void py-24 md:py-36">
        <div className="container-x">
          <Reveal>
            <h2 className="text-giant text-gradient max-w-4xl text-balance">
              {t.ctaTitle}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-8 max-w-xl text-balance text-lg text-mist">{t.ctaBody}</p>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-10 flex flex-wrap items-baseline gap-x-10 gap-y-5">
              <LocaleLink
                href="/contact"
                data-cursor
                className="group inline-flex items-baseline gap-3 text-accent transition-colors hover:text-chalk"
              >
                <span
                  aria-hidden
                  className="font-mono text-xs uppercase tracking-[0.3em] transition-transform duration-500 group-hover:translate-x-1"
                >
                  →
                </span>
                <span className="font-display text-lg">{t.startProject}</span>
              </LocaleLink>
              {pole && (
                <LocaleLink
                  href={`/services/${pole.id}`}
                  data-cursor
                  className="link-underline font-mono text-xs uppercase tracking-[0.22em] text-mist transition-colors hover:text-chalk"
                >
                  {poleTitle} →
                </LocaleLink>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- PREV / NEXT — two huge display links on a hairline ---------- */}
      <section className="relative z-10 bg-void">
        <div className="hairline-t">
          <nav aria-label={t.moreWork} className="container-x grid sm:grid-cols-2">
            <LocaleLink
              href={`/work/${prev.slug}`}
              data-cursor
              className="group py-14 sm:py-20 sm:pr-10"
            >
              <span className="font-mono text-xs tracking-widest text-fog transition-colors duration-500 group-hover:text-accent">
                {t.prev} · {prev.field}
              </span>
              <span className="mt-4 block font-display text-3xl font-semibold tracking-tight text-mist transition-all duration-500 group-hover:-translate-x-1 group-hover:text-chalk md:text-5xl">
                {prev.name}
              </span>
            </LocaleLink>
            <LocaleLink
              href={`/work/${next.slug}`}
              data-cursor
              className="group border-t border-white/[0.07] py-14 text-right sm:border-l sm:border-t-0 sm:py-20 sm:pl-10"
            >
              <span className="font-mono text-xs tracking-widest text-fog transition-colors duration-500 group-hover:text-accent">
                {t.next} · {next.field}
              </span>
              <span className="mt-4 block font-display text-3xl font-semibold tracking-tight text-mist transition-all duration-500 group-hover:translate-x-1 group-hover:text-chalk md:text-5xl">
                {next.name}
              </span>
            </LocaleLink>
          </nav>
        </div>
      </section>
    </main>
  );
}
