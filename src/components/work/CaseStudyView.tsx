"use client";

import Link from "next/link";
import { WORK, getCase, localizeCase } from "@/lib/work";
import { INDUSTRIES } from "@/lib/site";
import { PageHeaderFX } from "@/components/ui/PageHeaderFX";
import { useLang } from "@/lib/lang";

const T = {
  en: {
    back: "← Work",
    representative: "Representative project",
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
    poleTitles: {
      strategy: "Strategy & Consulting",
      software: "Design & Development",
      ai: "Data & AI",
      cloud: "Cloud & Infrastructure",
    } as Record<string, string>,
  },
  fr: {
    back: "← Réalisations",
    representative: "Projet représentatif",
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
    poleTitles: {
      strategy: "Stratégie & Conseil",
      software: "Design & Développement",
      ai: "Données & IA",
      cloud: "Cloud & Infrastructure",
    } as Record<string, string>,
  },
};

export function CaseStudyView({ slug }: { slug: string }) {
  const lang = useLang();
  const t = T[lang];

  const base = getCase(slug);
  if (!base) return null;
  const w = localizeCase(base, lang);

  const more = WORK.filter((x) => x.slug !== w.slug)
    .slice(0, 2)
    .map((m) => localizeCase(m, lang));
  const pole = INDUSTRIES.find((i) => i.id === w.pole);
  const poleTitle = pole ? t.poleTitles[pole.id] ?? pole.title : null;

  return (
    <main className="relative">
      <section className="relative overflow-hidden pb-8 pt-40">
        <PageHeaderFX accent={w.accent} />
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[45vh] w-[45vh] -translate-x-1/2 rounded-full blur-[140px]"
          style={{ backgroundColor: `${w.accent}1f` }}
        />
        <div className="container-x relative max-w-3xl">
          <Link href="/work" className="link-underline font-mono text-xs tracking-widest text-mist">
            {t.back}
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-4 font-mono text-xs tracking-widest text-fog">
            <span style={{ color: w.accent }}>{w.code}</span>
            <span>{w.field}</span>
            <span>{w.stage}</span>
          </div>
          <span className="mt-5 inline-flex w-fit items-center rounded-full border border-white/10 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-widest text-fog">
            {t.representative}
          </span>
          <h1 className="text-giant text-gradient mt-4 text-balance">{w.name}</h1>
          <p className="mt-6 text-balance text-lg text-mist">{w.summary}</p>

          <dl className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="font-mono text-[0.7rem] uppercase tracking-widest text-fog">{t.ourRole}</dt>
              <dd className="mt-3 flex flex-wrap gap-2">
                {w.roles.map((r) => (
                  <span
                    key={r}
                    className="rounded-full border border-white/12 px-3 py-1.5 font-mono text-[0.7rem] tracking-widest text-mist"
                  >
                    {r}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[0.7rem] uppercase tracking-widest text-fog">{t.stack}</dt>
              <dd className="mt-3 flex flex-wrap gap-2">
                {w.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/12 px-3 py-1.5 font-mono text-[0.7rem] tracking-widest text-mist"
                  >
                    {tech}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <article className="relative z-10 bg-void pb-20 pt-8">
        <div className="container-x max-w-3xl space-y-14">
          <section>
            <h2 className="font-display text-2xl font-semibold text-chalk">{t.challenge}</h2>
            <div className="mt-4 space-y-4">
              {w.challenge.map((p, i) => (
                <p key={i} className="leading-relaxed text-mist">{p}</p>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-chalk">{t.approach}</h2>
            <ol className="mt-6 grid gap-px overflow-hidden rounded-2xl hairline">
              {w.approach.map((a, i) => (
                <li key={i} className="bg-ink p-6 md:p-8">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-chalk">{a.title}</h3>
                      <p className="mt-2 leading-relaxed text-mist">{a.body}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-chalk">{t.outcome}</h2>
            <div className="mt-4 space-y-4">
              {w.outcome.map((p, i) => (
                <p key={i} className="leading-relaxed text-mist">{p}</p>
              ))}
            </div>
            <ul className="mt-8 flex flex-wrap gap-2">
              {w.highlights.map((h) => (
                <li
                  key={h}
                  className="rounded-full border border-white/12 px-4 py-2 font-mono text-xs tracking-widest text-mist"
                >
                  {h}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </article>

      <section className="relative z-10 bg-void pb-20">
        <div className="container-x max-w-3xl">
          <div
            className="overflow-hidden rounded-3xl hairline p-8 md:p-10"
            style={{ background: `linear-gradient(135deg, ${w.accent}14, transparent 70%)` }}
          >
            <h2 className="font-display text-2xl font-semibold text-chalk md:text-3xl">
              {t.ctaTitle}
            </h2>
            <p className="mt-3 max-w-xl text-balance text-mist">{t.ctaBody}</p>
            <div className="mt-7 flex flex-wrap gap-4 font-mono text-xs tracking-widest">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-chalk px-6 py-3 text-void transition-opacity hover:opacity-90"
              >
                {t.startProject} <span aria-hidden>→</span>
              </Link>
              {pole && (
                <Link
                  href={`/services/${pole.id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-chalk transition-colors hover:border-white/30"
                >
                  {poleTitle} <span aria-hidden>→</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-void pb-32">
        <div className="container-x max-w-3xl">
          <div className="eyebrow mb-6 hairline-t pt-10">{t.moreWork}</div>
          <ul className="grid gap-px overflow-hidden rounded-2xl hairline sm:grid-cols-2">
            {more.map((m) => (
              <li key={m.slug}>
                <Link
                  href={`/work/${m.slug}`}
                  className="group block h-full bg-ink p-6 transition-colors hover:bg-white/[0.03]"
                >
                  <span className="font-mono text-[0.7rem] tracking-widest" style={{ color: m.accent }}>
                    {m.field}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-semibold text-chalk transition-colors group-hover:text-gradient">
                    {m.name}
                  </h3>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
