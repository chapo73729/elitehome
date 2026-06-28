"use client";

import { LocaleLink } from "@/components/ui/LocaleLink";
import { PageHeaderFX } from "@/components/ui/PageHeaderFX";
import { useLang } from "@/lib/lang";

const T = {
  en: {
    home: "← Home",
    eyebrow: "Approach",
    h1: "Problem to product.",
    intro:
      "Every project begins as a problem and ends as a product that holds up. The method between those two points is deliberate, and it’s the same across every pole we work in.",
    principlesEyebrow: "Operating principles",
    ctaTitle: "Have something worth building right?",
    startConversation: "Start a conversation",
    seeWork: "See the work",
    PHASES: [
      {
        n: "01",
        t: "Frame",
        d: "We start by framing the real problem, the constraints and the bet — not the feature list. Clarity here is what keeps the rest of the project honest.",
      },
      {
        n: "02",
        t: "Prototype",
        d: "We pressure-test the idea against reality: prototypes and evaluations that exercise the riskiest assumptions first. Most directions are corrected here, cheaply.",
      },
      {
        n: "03",
        t: "Design & build",
        d: "What survives is designed and engineered end to end — interfaces that are clear and code that stays fast, secure and legible for years.",
      },
      {
        n: "04",
        t: "Harden & ship",
        d: "We test, instrument and secure before launch, then ship into production with guardrails, fallbacks and the observability that lets a system be relied upon.",
      },
      {
        n: "05",
        t: "Support",
        d: "We stay for the part that matters: maintaining, measuring and improving the software well beyond launch, so it keeps working as it grows.",
      },
    ],
    PRINCIPLES: [
      { t: "Correctness over velocity", d: "We move fast where it's cheap to be wrong and slowly where it isn't." },
      { t: "Measure, don't admire", d: "Behaviour is something to be evaluated, not trusted because it looks impressive." },
      { t: "Build the loop", d: "Robustness comes from the system as a whole — plan, act, observe, correct — not from any single step." },
      { t: "Escalate early", d: "Autonomous systems should surface ambiguity to humans at exactly the right moment." },
    ],
  },
  fr: {
    home: "← Accueil",
    eyebrow: "Approche",
    h1: "Du problème au produit.",
    intro:
      "Chaque projet commence par un problème et aboutit à un produit qui tient dans le temps. La méthode entre ces deux points est délibérée, et elle est la même quel que soit le pôle concerné.",
    principlesEyebrow: "Principes de travail",
    ctaTitle: "Vous avez un projet à mener correctement ?",
    startConversation: "Entamer la conversation",
    seeWork: "Voir les réalisations",
    PHASES: [
      {
        n: "01",
        t: "Cadrer",
        d: "Nous commençons par cadrer le vrai problème, les contraintes et le pari — et non la liste des fonctionnalités. C'est cette clarté qui maintient le reste du projet sur la bonne voie.",
      },
      {
        n: "02",
        t: "Prototyper",
        d: "Nous confrontons l'idée à la réalité : prototypes et évaluations qui mettent d'abord à l'épreuve les hypothèses les plus risquées. La plupart des orientations sont corrigées ici, à moindre coût.",
      },
      {
        n: "03",
        t: "Concevoir et développer",
        d: "Ce qui résiste est conçu et développé de bout en bout — des interfaces claires et un code qui reste rapide, sécurisé et lisible pendant des années.",
      },
      {
        n: "04",
        t: "Fiabiliser et livrer",
        d: "Nous testons, instrumentons et sécurisons avant le lancement, puis livrons en production avec garde-fous, solutions de repli et l'observabilité qui permet de compter sur un système.",
      },
      {
        n: "05",
        t: "Accompagner",
        d: "Nous restons pour ce qui compte vraiment : maintenir, mesurer et améliorer le logiciel bien au-delà du lancement, afin qu'il continue de fonctionner à mesure qu'il grandit.",
      },
    ],
    PRINCIPLES: [
      { t: "La justesse avant la vitesse", d: "Nous avançons vite là où l'erreur coûte peu, et lentement là où elle coûte cher." },
      { t: "Mesurer, ne pas se fier aux apparences", d: "Un comportement doit être évalué, et non tenu pour acquis parce qu'il fait bonne impression." },
      { t: "Construire la boucle", d: "La robustesse vient du système dans son ensemble — planifier, agir, observer, corriger — et non d'une seule étape." },
      { t: "Escalader tôt", d: "Les systèmes autonomes doivent signaler toute ambiguïté aux humains au moment précis où il le faut." },
    ],
  },
};

export function ApproachView() {
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
        <div className="container-x max-w-3xl">
          <ol className="grid gap-px overflow-hidden rounded-3xl hairline">
            {t.PHASES.map((p) => (
              <li key={p.n} className="bg-ink p-8 md:p-10">
                <div className="flex items-baseline gap-5">
                  <span className="font-mono text-sm text-accent">{p.n}</span>
                  <div>
                    <h2 className="font-display text-xl font-semibold text-chalk">{p.t}</h2>
                    <p className="mt-3 leading-relaxed text-mist">{p.d}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative z-10 bg-void py-16">
        <div className="container-x max-w-5xl">
          <p className="eyebrow mb-8">{t.principlesEyebrow}</p>
          <div className="grid gap-px overflow-hidden rounded-3xl hairline sm:grid-cols-2">
            {t.PRINCIPLES.map((p) => (
              <div key={p.t} className="bg-ink p-8">
                <h3 className="font-display text-lg font-semibold text-chalk">{p.t}</h3>
                <p className="mt-3 leading-relaxed text-mist">{p.d}</p>
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
              href="/contact"
              className="rounded-full bg-chalk px-7 py-3.5 text-sm font-medium text-void transition-opacity hover:opacity-90"
            >
              {t.startConversation}
            </LocaleLink>
            <LocaleLink
              href="/work"
              className="rounded-full hairline px-7 py-3.5 text-sm font-medium text-chalk transition-colors hover:border-white/25"
            >
              {t.seeWork}
            </LocaleLink>
          </div>
        </div>
      </section>
    </main>
  );
}
