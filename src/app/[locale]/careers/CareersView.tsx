"use client";

import { LocaleLink } from "@/components/ui/LocaleLink";
import { SITE } from "@/lib/site";
import { PageHeaderFX } from "@/components/ui/PageHeaderFX";
import { Reveal } from "@/components/ui/Reveal";
import { ChapterNumeral } from "@/components/ui/ChapterNumeral";
import { Compile } from "@/components/ui/Compile";
import { useLang } from "@/lib/lang";
import { usePerf } from "@/lib/perf";

const T = {
  en: {
    home: "← Home",
    eyebrow: "Careers",
    h1: "Build what outlasts you.",
    intro:
      "We hire a small number of exceptional engineers, scientists and designers — people who would rather build one dependable thing than ten impressive ones.",
    cultureEyebrow: "How we work",
    rolesEyebrow: "Open roles",
    apply: "APPLY →",
    applySubject: "Application — ",
    speculativeSubject: "Speculative application",
    noRolePre: "Don’t see your role? ",
    noRoleLink: "Tell us what you’d build",
    noRolePost: " — we hire exceptional people ahead of need.",
    CULTURE: [
      { t: "Senior by default", d: "Small teams of engineers who build. Little hierarchy, high ownership, real autonomy." },
      { t: "A bias for shipping", d: "Work measured in shipped products, not sprints. We optimise for what holds up." },
      { t: "Prague · worldwide", d: "Based in Prague, working with teams across every timezone — async by default." },
      { t: "Correctness culture", d: "We reward getting it right over getting it out — and we mean it." },
    ],
    ROLES: [
      { t: "Product Strategist", team: "Strategy & Consulting", loc: "Remote · Global" },
      { t: "Full-Stack Engineer", team: "Design & Development", loc: "Remote · Global" },
      { t: "Product Designer", team: "Design & Development", loc: "Remote · Global" },
      { t: "AI / Data Engineer", team: "Data & AI", loc: "Remote · Global" },
      { t: "Platform / DevOps Engineer", team: "Cloud & Infrastructure", loc: "Prague · Hybrid" },
    ],
  },
  fr: {
    home: "← Accueil",
    eyebrow: "Carrières",
    h1: "Construisez ce qui vous survivra.",
    intro:
      "Nous recrutons un petit nombre d'ingénieurs, de scientifiques et de designers d'exception — des personnes qui préfèrent construire une chose fiable plutôt que dix choses impressionnantes.",
    cultureEyebrow: "Notre façon de travailler",
    rolesEyebrow: "Postes ouverts",
    apply: "POSTULER →",
    applySubject: "Candidature — ",
    speculativeSubject: "Candidature spontanée",
    noRolePre: "Vous ne trouvez pas votre poste ? ",
    noRoleLink: "Dites-nous ce que vous construiriez",
    noRolePost: " — nous recrutons des personnes d'exception en anticipant nos besoins.",
    CULTURE: [
      { t: "Expérimentés par principe", d: "De petites équipes d'ingénieurs qui construisent. Peu de hiérarchie, une forte responsabilité, une réelle autonomie." },
      { t: "Le souci de livrer", d: "Un travail mesuré en produits livrés, non en sprints. Nous optimisons ce qui tient dans le temps." },
      { t: "Prague · dans le monde entier", d: "Basés à Prague, nous travaillons avec des équipes sur tous les fuseaux horaires — en asynchrone par défaut." },
      { t: "Culture de la justesse", d: "Nous valorisons le fait de bien faire plutôt que de livrer vite — et nous le pensons vraiment." },
    ],
    ROLES: [
      { t: "Stratège produit", team: "Conseil & stratégie", loc: "À distance · International" },
      { t: "Ingénieur full-stack", team: "Conception & développement", loc: "À distance · International" },
      { t: "Designer produit", team: "Conception & développement", loc: "À distance · International" },
      { t: "Ingénieur IA / données", team: "Données & IA", loc: "À distance · International" },
      { t: "Ingénieur plateforme / DevOps", team: "Cloud & infrastructure", loc: "Prague · Hybride" },
    ],
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

export function CareersView() {
  const t = T[useLang()];
  const perf = usePerf();

  return (
    <main className="relative">
      {/* ---------- HEADER — giant title on the void, ghost numeral ---------- */}
      <section className="relative overflow-hidden pb-10 pt-40">
        <PageHeaderFX accent="#4f8cff" />
        <div className="container-x relative">
          <ChapterNumeral n="03" label="PEOPLE" />

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
              <span className="eyebrow mt-8 block">{t.eyebrow} · 03</span>
            </Reveal>
            <Reveal delay={0.12}>
              <h1 className="text-giant text-gradient mt-5 max-w-3xl text-balance">
                {t.h1}
              </h1>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mt-6 max-w-2xl text-balance text-lg text-mist">{t.intro}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- HOW WE WORK — two-column hairline index ---------- */}
      <section className="relative z-10 bg-void py-20 md:py-28">
        <div className="container-x">
          <Reveal>
            <SectionMark index="01" label={t.cultureEyebrow} />
          </Reveal>
          <ul className="mt-12 grid border-b border-white/[0.07] sm:grid-cols-2 sm:gap-x-14">
            {t.CULTURE.map((c, i) => (
              <Reveal as="li" key={c.t} delay={(i % 2) * 0.06} className="hairline-t">
                <div className="flex items-baseline gap-5 py-6">
                  <span className="font-mono text-xs text-accent tabular-nums">
                    [{String(i + 1).padStart(2, "0")}]
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-lg leading-tight text-chalk">
                      {c.t}
                    </span>
                    <span className="mt-2 block max-w-sm text-sm leading-relaxed text-mist">
                      {c.d}
                    </span>
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- OPEN ROLES — numbered hairline rows, compiled ---------- */}
      <section className="relative z-10 bg-void py-20 md:py-28">
        <div className="container-x">
          <Reveal>
            <SectionMark index="02" label={t.rolesEyebrow} />
          </Reveal>
          <Compile label="roles" index="02" disabled={perf} className="mt-12">
            <ul className="border-b border-white/[0.07]">
              {t.ROLES.map((r, i) => (
                <Reveal as="li" key={r.t} delay={i * 0.05} className="hairline-t">
                  <a
                    href={`mailto:${SITE.email}?subject=${encodeURIComponent(t.applySubject + r.t)}`}
                    data-cursor
                    className="group grid items-baseline gap-x-6 gap-y-2 rounded-sm py-8 outline-none focus-visible:ring-1 focus-visible:ring-accent/60 focus-visible:ring-offset-4 focus-visible:ring-offset-void md:grid-cols-12 md:py-10"
                  >
                    <span className="font-mono text-xs text-fog tabular-nums transition-colors duration-500 group-hover:text-accent md:col-span-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 md:col-span-6">
                      <span className="block font-display text-2xl font-semibold tracking-tight text-chalk transition-transform duration-500 group-hover:translate-x-1 md:text-3xl">
                        {r.t}
                      </span>
                      <span className="mt-2 block font-mono text-[0.65rem] uppercase tracking-[0.25em] text-fog">
                        {r.team}
                      </span>
                    </span>
                    <span className="mt-3 block font-mono text-xs tracking-widest text-mist md:col-span-3 md:mt-0">
                      {r.loc}
                    </span>
                    <span className="mt-1 block font-mono text-xs tracking-widest text-accent transition-transform duration-500 group-hover:translate-x-1 md:col-span-2 md:mt-0 md:justify-self-end">
                      {t.apply}
                    </span>
                  </a>
                </Reveal>
              ))}
            </ul>
          </Compile>
        </div>
      </section>

      {/* ---------- SPECULATIVE — bare CTA moment on the void ---------- */}
      <section className="relative z-10 bg-void pb-28 pt-4 md:pb-36">
        <div className="container-x">
          <Reveal>
            <p className="max-w-2xl text-balance text-lg leading-relaxed text-mist">
              {t.noRolePre}
              <a
                href={`mailto:${SITE.email}?subject=${encodeURIComponent(t.speculativeSubject)}`}
                data-cursor
                className="link-underline text-accent transition-colors hover:text-chalk"
              >
                {t.noRoleLink}
              </a>
              {t.noRolePost}
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
