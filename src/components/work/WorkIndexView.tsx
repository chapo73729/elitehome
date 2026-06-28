"use client";

import { LocaleLink } from "@/components/ui/LocaleLink";
import { WORK, localizeCase } from "@/lib/work";
import { PageHeaderFX } from "@/components/ui/PageHeaderFX";
import { useLang } from "@/lib/lang";

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
    h1: "Des réalisations, peaufinées dans le détail.",
    intro:
      "Une sélection de ce que nous construisons — logiciels, plateformes, données et cloud, chacun tenu à un même standard d'ingénierie.",
    nda: "Projets représentatifs, présentés pour illustrer notre façon de travailler. Les noms des clients sont tus lorsque les engagements sont couverts par un accord de confidentialité.",
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
  const items = WORK.map((w) => localizeCase(w, lang));

  return (
    <main className="relative">
      <section className="relative overflow-hidden pb-8 pt-40">
        <PageHeaderFX />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[45vh] w-[45vh] -translate-x-1/2 rounded-full bg-accent/12 blur-[140px]" />
        <div className="container-x relative max-w-4xl">
          <LocaleLink href="/" className="link-underline font-mono text-xs tracking-widest text-mist">
            {t.home}
          </LocaleLink>
          <p className="eyebrow mt-8">{t.eyebrow}</p>
          <h1 className="text-giant text-gradient mt-4 max-w-3xl text-balance">
            {t.h1}
          </h1>
          <p className="mt-6 max-w-xl text-balance text-mist">{t.intro}</p>
          <p className="mt-4 max-w-xl text-balance text-sm text-fog">{t.nda}</p>
        </div>
      </section>

      <section className="relative z-10 bg-void pb-32 pt-10">
        <div className="container-x max-w-5xl">
          <ul className="grid gap-px overflow-hidden rounded-3xl hairline md:grid-cols-2">
            {items.map((w) => (
              <li key={w.slug}>
                <LocaleLink
                  href={`/work/${w.slug}`}
                  aria-label={`${w.name} — ${w.field} ${t.caseStudyAria}`}
                  className="group flex h-full flex-col bg-ink p-8 transition-colors hover:bg-white/[0.03] md:p-10"
                >
                  <div className="flex items-center justify-between font-mono text-xs tracking-widest text-fog">
                    <span style={{ color: w.accent }}>{w.code}</span>
                    <span>{w.stage}</span>
                  </div>
                  <span className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-widest text-fog">
                    {t.representative}
                  </span>
                  <h2 className="mt-5 font-display text-2xl font-semibold text-chalk transition-colors group-hover:text-gradient md:text-3xl">
                    {w.name}
                  </h2>
                  <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-widest text-mist">
                    {w.field}
                  </p>
                  <p className="mt-4 flex-1 text-balance text-mist">{w.summary}</p>
                  <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs tracking-widest text-accent">
                    {t.caseStudy}
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </LocaleLink>
              </li>
            ))}
          </ul>

          <div className="mt-px grid gap-px overflow-hidden rounded-3xl hairline sm:grid-cols-2">
            <LocaleLink
              href="/services"
              className="group bg-ink p-8 transition-colors hover:bg-white/[0.03]"
            >
              <div className="font-mono text-xs tracking-widest text-fog">{t.servicesLabel}</div>
              <div className="mt-3 font-display text-xl text-mist transition-colors group-hover:text-chalk">
                {t.servicesCta}
              </div>
            </LocaleLink>
            <LocaleLink
              href="/contact"
              className="group bg-ink p-8 text-right transition-colors hover:bg-white/[0.03]"
            >
              <div className="font-mono text-xs tracking-widest text-fog">{t.contactLabel}</div>
              <div className="mt-3 font-display text-xl text-mist transition-colors group-hover:text-chalk">
                {t.contactCta}
              </div>
            </LocaleLink>
          </div>
        </div>
      </section>
    </main>
  );
}
