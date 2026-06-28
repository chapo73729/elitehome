"use client";

import { LocaleLink } from "@/components/ui/LocaleLink";
import { SITE } from "@/lib/site";
import { PageHeaderFX } from "@/components/ui/PageHeaderFX";
import { useLang } from "@/lib/lang";

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
      { t: "Stratège produit", team: "Stratégie et conseil", loc: "À distance · International" },
      { t: "Ingénieur full-stack", team: "Design et développement", loc: "À distance · International" },
      { t: "Designer produit", team: "Design et développement", loc: "À distance · International" },
      { t: "Ingénieur IA / données", team: "Données et IA", loc: "À distance · International" },
      { t: "Ingénieur plateforme / DevOps", team: "Cloud et infrastructure", loc: "Prague · Hybride" },
    ],
  },
};

export function CareersView() {
  const t = T[useLang()];
  return (
    <main className="relative">
      <section className="relative overflow-hidden pb-10 pt-40">
        <PageHeaderFX accent="#4f8cff" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[50vh] w-[50vh] -translate-x-1/2 rounded-full bg-accent/12 blur-[150px]" />
        <div className="container-x relative max-w-4xl">
          <LocaleLink href="/" className="link-underline font-mono text-xs tracking-widest text-mist">
            {t.home}
          </LocaleLink>
          <p className="eyebrow mt-8">{t.eyebrow}</p>
          <h1 className="text-giant text-gradient mt-4 max-w-3xl text-balance">
            {t.h1}
          </h1>
          <p className="mt-6 max-w-2xl text-balance text-lg text-mist">
            {t.intro}
          </p>
        </div>
      </section>

      <section className="relative z-10 bg-void py-16">
        <div className="container-x max-w-5xl">
          <p className="eyebrow mb-8">{t.cultureEyebrow}</p>
          <div className="grid gap-px overflow-hidden rounded-3xl hairline sm:grid-cols-2">
            {t.CULTURE.map((c) => (
              <div key={c.t} className="bg-ink p-8">
                <h3 className="font-display text-lg font-semibold text-chalk">{c.t}</h3>
                <p className="mt-3 leading-relaxed text-mist">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-void py-16">
        <div className="container-x max-w-4xl">
          <p className="eyebrow mb-8">{t.rolesEyebrow}</p>
          <ul className="grid gap-px overflow-hidden rounded-3xl hairline">
            {t.ROLES.map((r) => (
              <li key={r.t}>
                <a
                  href={`mailto:${SITE.email}?subject=${encodeURIComponent(t.applySubject + r.t)}`}
                  className="group flex flex-wrap items-center justify-between gap-3 bg-ink p-7 transition-colors hover:bg-white/[0.03]"
                >
                  <div>
                    <h3 className="font-display text-lg font-semibold text-chalk transition-colors group-hover:text-gradient">
                      {r.t}
                    </h3>
                    <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-widest text-fog">
                      {r.team}
                    </p>
                  </div>
                  <div className="flex items-center gap-5">
                    <span className="font-mono text-xs tracking-widest text-mist">{r.loc}</span>
                    <span className="font-mono text-xs tracking-widest text-accent transition-transform duration-300 group-hover:translate-x-1">
                      {t.apply}
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-balance text-mist">
            {t.noRolePre}
            <a href={`mailto:${SITE.email}?subject=${encodeURIComponent(t.speculativeSubject)}`} className="text-chalk underline">
              {t.noRoleLink}
            </a>
            {t.noRolePost}
          </p>
        </div>
      </section>
    </main>
  );
}
