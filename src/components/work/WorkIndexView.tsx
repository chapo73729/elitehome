"use client";

import { LocaleLink } from "@/components/ui/LocaleLink";
import { WORK, localizeCase } from "@/lib/work";
import { PageHeaderFX } from "@/components/ui/PageHeaderFX";
import { Reveal } from "@/components/ui/Reveal";
import { ChapterNumeral } from "@/components/ui/ChapterNumeral";
import { Compile } from "@/components/ui/Compile";
import { useLang } from "@/lib/lang";
import { usePerf } from "@/lib/perf";

const T = {
  en: {
    home: "← Home",
    eyebrow: "Work",
    h1: "Work, engineered to the detail.",
    intro:
      "A selection of what we build — software, platforms, data and cloud, each held to a shared standard of engineering.",
    nda: "Representative projects, shown to illustrate how we work. Client names are withheld where engagements are under NDA.",
    representative: "Representative project",
    caseStudy: "CASE STUDY",
    caseStudyAria: "case study",
    servicesLabel: "Services",
    servicesCta: "Explore the four poles →",
    contactLabel: "Contact",
    contactCta: "Start a project →",
  },
  fr: {
    home: "← Accueil",
    eyebrow: "Réalisations",
    h1: "Des réalisations, soignées jusqu’au détail.",
    intro:
      "Une sélection de ce que nous construisons — logiciels, plateformes, données et cloud, tenus à un même standard d’ingénierie.",
    nda: "Projets représentatifs, présentés pour illustrer notre façon de travailler. Les noms des clients sont omis lorsque l’engagement est couvert par un accord de confidentialité.",
    representative: "Projet représentatif",
    caseStudy: "ÉTUDE DE CAS",
    caseStudyAria: "étude de cas",
    servicesLabel: "Services",
    servicesCta: "Découvrir les quatre pôles →",
    contactLabel: "Contact",
    contactCta: "Démarrer un projet →",
  },
};

export function WorkIndexView() {
  const lang = useLang();
  const t = T[lang];
  const perf = usePerf();
  const items = WORK.map((w) => localizeCase(w, lang));

  return (
    <main className="relative">
      {/* ---------- HEADER — giant title on the void, ghost numeral ---------- */}
      <section className="relative overflow-hidden pb-10 pt-40">
        <PageHeaderFX />
        <div className="container-x relative">
          <ChapterNumeral n="05" label="WORK" />

          <div className="relative z-10">
            <Reveal>
              <LocaleLink
                href="/"
                data-cursor
                className="link-underline font-mono text-xs tracking-widest text-mist"
              >
                {t.home}
              </LocaleLink>
            </Reveal>
            <Reveal delay={0.06}>
              <span className="eyebrow mt-8 block">{t.eyebrow} · 05</span>
            </Reveal>
            <Reveal delay={0.12}>
              <h1 className="text-giant text-gradient mt-5 max-w-3xl text-balance">
                {t.h1}
              </h1>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mt-6 max-w-xl text-balance text-lg text-mist">{t.intro}</p>
            </Reveal>
            <Reveal delay={0.24}>
              <p className="mt-4 max-w-xl text-balance text-sm text-fog">{t.nda}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- THE INDEX — numbered hairline rows, no cards ---------- */}
      <section className="relative z-10 bg-void py-16 md:py-24">
        <div className="container-x">
          <Compile label="work-index" index="05" disabled={perf}>
            <ul className="border-b border-white/[0.07]">
              {items.map((w, i) => (
                <Reveal as="li" key={w.slug} delay={i * 0.06} className="hairline-t">
                  <LocaleLink
                    href={`/work/${w.slug}`}
                    data-cursor
                    aria-label={`${w.name} — ${w.field} ${t.caseStudyAria}`}
                    className="group grid items-baseline gap-x-6 gap-y-2 rounded-sm py-10 outline-none focus-visible:ring-1 focus-visible:ring-accent/60 focus-visible:ring-offset-4 focus-visible:ring-offset-void md:grid-cols-12 md:py-12"
                  >
                    <span className="font-mono text-xs text-fog tabular-nums transition-colors duration-500 group-hover:text-accent md:col-span-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 md:col-span-5">
                      <span className="block font-display text-3xl font-semibold tracking-tight text-chalk transition-transform duration-500 group-hover:translate-x-1 md:text-5xl">
                        {w.name}
                      </span>
                      <span className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-fog">
                        <span style={{ color: w.accent }}>{w.code}</span>
                        <span className="text-mist">{w.client}</span>
                        <span>{w.field}</span>
                      </span>
                    </span>
                    <span className="mt-4 block max-w-md text-sm text-mist md:col-span-5 md:mt-0 md:text-base">
                      {w.summary}
                      <span className="mt-3 block font-mono text-[0.6rem] uppercase tracking-[0.25em] text-fog">
                        {t.representative} · {w.stage}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className="hidden font-mono text-xs tracking-widest text-fog transition-all duration-500 group-hover:translate-x-1 group-hover:text-chalk md:col-span-1 md:block md:justify-self-end"
                    >
                      →
                    </span>
                  </LocaleLink>
                </Reveal>
              ))}
            </ul>
          </Compile>
        </div>
      </section>

      {/* ---------- ONWARD — two huge display links on a hairline ---------- */}
      <section className="relative z-10 bg-void pb-8">
        <div className="hairline-t">
          <nav className="container-x grid sm:grid-cols-2">
            <LocaleLink
              href="/services"
              data-cursor
              className="group py-14 sm:py-20 sm:pr-10"
            >
              <span className="font-mono text-xs tracking-widest text-fog transition-colors duration-500 group-hover:text-accent">
                {t.servicesLabel}
              </span>
              <span className="mt-4 block font-display text-2xl font-semibold tracking-tight text-mist transition-all duration-500 group-hover:-translate-x-1 group-hover:text-chalk md:text-4xl">
                {t.servicesCta}
              </span>
            </LocaleLink>
            <LocaleLink
              href="/contact"
              data-cursor
              className="group border-t border-white/[0.07] py-14 text-right sm:border-l sm:border-t-0 sm:py-20 sm:pl-10"
            >
              <span className="font-mono text-xs tracking-widest text-fog transition-colors duration-500 group-hover:text-accent">
                {t.contactLabel}
              </span>
              <span className="mt-4 block font-display text-2xl font-semibold tracking-tight text-mist transition-all duration-500 group-hover:translate-x-1 group-hover:text-chalk md:text-4xl">
                {t.contactCta}
              </span>
            </LocaleLink>
          </nav>
        </div>
      </section>
    </main>
  );
}
