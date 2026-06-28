"use client";

import { LocaleLink } from "@/components/ui/LocaleLink";
import { PageHeaderFX } from "@/components/ui/PageHeaderFX";
import { useLang } from "@/lib/lang";

const T = {
  en: {
    home: "← Home",
    eyebrow: "About",
    h1: "A digital engineering studio.",
    intro:
      "ARDLABS is a digital engineering studio. We design and build software, platforms and AI systems that are fast, reliable, and refined to the detail — products built to hold up, not demonstrations.",
    whyTitle: "Why we exist",
    why1:
      "Most studios stop at features. We engineer the whole product. Every project starts as a hard question — what to build, why, and how it will hold up — and ends as software, a platform or an AI system that works in production and keeps working long after launch.",
    why2:
      "Digital engineering is the umbrella. Under it, four poles cover an idea end to end: strategy and consulting, design and development, data and AI, and cloud and infrastructure. Deep engineering, clear design and a bias for shipping are what let a hard idea survive contact with reality.",
    principlesEyebrow: "Principles",
    builtEyebrow: "How we're built",
    builtTitle: "One studio, four poles.",
    builtIntro:
      "We operate as a small, senior team organised by discipline rather than by title — engineers who build, across every timezone.",
    ctaTitle: "Build something that lasts.",
    seeWork: "See our work",
    getInTouch: "Get in touch",
    PRINCIPLES: [
      {
        k: "Refined to the detail",
        v: "Everything we ship is built to hold up — fast, secure and legible — not just to demo well.",
      },
      {
        k: "Reliable, not impressive",
        v: "Dependability is the standard. We engineer products to be relied upon in real operations.",
      },
      {
        k: "A bias for shipping",
        v: "We start with the hard question and end with a product in production, maintained beyond launch.",
      },
      {
        k: "One standard, four poles",
        v: "Strategy, design & development, data & AI, and cloud — distinct disciplines, a shared standard of engineering.",
      },
    ],
    DISCIPLINES: [
      { t: "Strategy & Consulting", d: "Technology consulting, applied R&D and prototyping that turn an idea into a validated plan." },
      { t: "Design & Development", d: "Custom software, web, mobile, SaaS and internal platforms — designed and engineered end to end." },
      { t: "Data & AI", d: "Applied AI, intelligent automation and the dashboards that turn operations into decisions." },
      { t: "Cloud & Infrastructure", d: "Cloud architecture, deployment, APIs and integrations engineered for uptime and scale." },
    ],
  },
  fr: {
    home: "← Accueil",
    eyebrow: "À propos",
    h1: "Un studio d'ingénierie numérique.",
    intro:
      "ARDLABS est un studio d'ingénierie numérique. Nous concevons et développons des logiciels, des plateformes et des systèmes d'IA rapides, fiables et soignés jusqu'au détail — des produits conçus pour durer, et non de simples démonstrations.",
    whyTitle: "Notre raison d'être",
    why1:
      "La plupart des studios s'arrêtent aux fonctionnalités. Nous concevons le produit dans son ensemble. Chaque projet commence par une question difficile — quoi construire, pourquoi, et comment cela tiendra dans le temps — et aboutit à un logiciel, une plateforme ou un système d'IA qui fonctionne en production et continue de fonctionner longtemps après le lancement.",
    why2:
      "L'ingénierie numérique est le fil conducteur. Sous cette bannière, quatre pôles couvrent une idée de bout en bout : stratégie et conseil, design et développement, données et IA, cloud et infrastructure. Une ingénierie pointue, un design clair et le souci constant de livrer sont ce qui permet à une idée exigeante de résister à l'épreuve du réel.",
    principlesEyebrow: "Principes",
    builtEyebrow: "Notre organisation",
    builtTitle: "Un seul studio, quatre pôles.",
    builtIntro:
      "Nous fonctionnons comme une petite équipe expérimentée, organisée par discipline plutôt que par titre — des ingénieurs qui construisent, sur tous les fuseaux horaires.",
    ctaTitle: "Construisez quelque chose qui dure.",
    seeWork: "Voir nos réalisations",
    getInTouch: "Nous contacter",
    PRINCIPLES: [
      {
        k: "Soigné jusqu'au détail",
        v: "Tout ce que nous livrons est conçu pour durer — rapide, sécurisé et lisible — et non pour faire bonne figure en démo.",
      },
      {
        k: "Fiable, pas tape-à-l'œil",
        v: "La fiabilité est la norme. Nous concevons des produits sur lesquels on peut compter en exploitation réelle.",
      },
      {
        k: "Le souci de livrer",
        v: "Nous partons de la question difficile pour aboutir à un produit en production, maintenu au-delà du lancement.",
      },
      {
        k: "Une norme, quatre pôles",
        v: "Stratégie, design et développement, données et IA, et cloud — des disciplines distinctes, une même exigence d'ingénierie.",
      },
    ],
    DISCIPLINES: [
      { t: "Stratégie et conseil", d: "Conseil technologique, R&D appliquée et prototypage pour transformer une idée en un plan validé." },
      { t: "Design et développement", d: "Logiciels sur mesure, web, mobile, SaaS et plateformes internes — conçus et développés de bout en bout." },
      { t: "Données et IA", d: "IA appliquée, automatisation intelligente et tableaux de bord qui transforment les opérations en décisions." },
      { t: "Cloud et infrastructure", d: "Architecture cloud, déploiement, API et intégrations conçus pour la disponibilité et la montée en charge." },
    ],
  },
};

export function AboutView() {
  const t = T[useLang()];
  return (
    <main className="relative">
      <section className="relative overflow-hidden pb-10 pt-40">
        <PageHeaderFX />
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
        <div className="container-x max-w-3xl space-y-6">
          <h2 className="font-display text-2xl font-semibold text-chalk">{t.whyTitle}</h2>
          <p className="leading-relaxed text-mist">
            {t.why1}
          </p>
          <p className="leading-relaxed text-mist">
            {t.why2}
          </p>
        </div>
      </section>

      <section className="relative z-10 bg-void py-16">
        <div className="container-x max-w-5xl">
          <p className="eyebrow mb-8">{t.principlesEyebrow}</p>
          <div className="grid gap-px overflow-hidden rounded-3xl hairline sm:grid-cols-2">
            {t.PRINCIPLES.map((p) => (
              <div key={p.k} className="bg-ink p-8">
                <h3 className="font-display text-lg font-semibold text-chalk">{p.k}</h3>
                <p className="mt-3 leading-relaxed text-mist">{p.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-void py-16">
        <div className="container-x max-w-5xl">
          <p className="eyebrow mb-3">{t.builtEyebrow}</p>
          <h2 className="text-section-title text-gradient max-w-xl text-balance">
            {t.builtTitle}
          </h2>
          <p className="mt-5 max-w-xl text-balance text-mist">
            {t.builtIntro}
          </p>
          <div className="mt-10 grid gap-px overflow-hidden rounded-3xl hairline sm:grid-cols-2 lg:grid-cols-3">
            {t.DISCIPLINES.map((d) => (
              <div key={d.t} className="bg-ink p-7">
                <h3 className="font-display text-base font-semibold text-chalk">{d.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">{d.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-void py-20">
        <div className="container-x max-w-3xl text-center">
          <h2 className="text-section-title text-gradient text-balance">
            {t.ctaTitle}
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <LocaleLink
              href="/work"
              className="rounded-full bg-chalk px-7 py-3.5 text-sm font-medium text-void transition-opacity hover:opacity-90"
            >
              {t.seeWork}
            </LocaleLink>
            <LocaleLink
              href="/contact"
              className="rounded-full hairline px-7 py-3.5 text-sm font-medium text-chalk transition-colors hover:border-white/25"
            >
              {t.getInTouch}
            </LocaleLink>
          </div>
        </div>
      </section>
    </main>
  );
}
