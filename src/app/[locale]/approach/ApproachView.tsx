"use client";

import { LocaleLink } from "@/components/ui/LocaleLink";
import { PageHeaderFX } from "@/components/ui/PageHeaderFX";
import { Reveal } from "@/components/ui/Reveal";
import { ChapterNumeral } from "@/components/ui/ChapterNumeral";
import { Compile } from "@/components/ui/Compile";
import { useLang } from "@/lib/lang";
import { usePerf } from "@/lib/perf";

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
    ctaTitle: "Un projet à mener dans les règles de l'art ?",
    startConversation: "Démarrer la conversation",
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
      { t: "Passer la main tôt", d: "Les systèmes autonomes doivent signaler toute ambiguïté aux humains au moment précis où il le faut." },
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

export function ApproachView() {
  const t = T[useLang()];
  const perf = usePerf();

  return (
    <main className="relative">
      {/* ---------- HEADER — giant title on the void, ghost numeral ---------- */}
      <section className="relative overflow-hidden pb-10 pt-40">
        <PageHeaderFX accent="#4f8cff" />
        <div className="container-x relative">
          <ChapterNumeral n="02" label="METHOD" />

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
              <span className="eyebrow mt-8 block">{t.eyebrow} · 02</span>
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

      {/* ---------- THE METHOD — numbered editorial rows, compiled ---------- */}
      <section className="relative z-10 bg-void py-20 md:py-28">
        <div className="container-x">
          <Reveal>
            <SectionMark index="01" />
          </Reveal>
          <Compile label="method" index="01" disabled={perf} className="mt-12">
            <ol className="border-b border-white/[0.07]">
              {t.PHASES.map((p, i) => (
                <Reveal as="li" key={p.n} delay={i * 0.06} className="hairline-t">
                  <div className="grid items-baseline gap-x-6 gap-y-2 py-8 md:grid-cols-12 md:py-10">
                    <span className="font-mono text-xs text-accent tabular-nums md:col-span-1">
                      {p.n}
                    </span>
                    <h2 className="font-display text-2xl font-semibold tracking-tight text-chalk md:col-span-4 md:text-3xl">
                      {p.t}
                    </h2>
                    <p className="max-w-md leading-relaxed text-mist md:col-span-7">
                      {p.d}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </Compile>
        </div>
      </section>

      {/* ---------- OPERATING PRINCIPLES — two-column hairline index ---------- */}
      <section className="relative z-10 bg-void py-20 md:py-28">
        <div className="container-x">
          <Reveal>
            <SectionMark index="02" label={t.principlesEyebrow} />
          </Reveal>
          <ul className="mt-12 grid border-b border-white/[0.07] sm:grid-cols-2 sm:gap-x-14">
            {t.PRINCIPLES.map((p, i) => (
              <Reveal as="li" key={p.t} delay={(i % 2) * 0.06} className="hairline-t">
                <div className="flex items-baseline gap-5 py-6">
                  <span className="font-mono text-xs text-accent tabular-nums">
                    [{String(i + 1).padStart(2, "0")}]
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-lg leading-tight text-chalk">
                      {p.t}
                    </span>
                    <span className="mt-2 block max-w-sm text-sm leading-relaxed text-mist">
                      {p.d}
                    </span>
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- CTA — bare statement on the void, one azure link ---------- */}
      <section className="relative z-10 bg-void py-24 md:py-36">
        <div className="container-x">
          <Reveal>
            <h2 className="text-giant text-gradient max-w-4xl text-balance">
              {t.ctaTitle}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
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
                <span className="font-display text-lg">{t.startConversation}</span>
              </LocaleLink>
              <LocaleLink
                href="/work"
                data-cursor
                className="link-underline font-mono text-xs uppercase tracking-[0.22em] text-mist transition-colors hover:text-chalk"
              >
                {t.seeWork} →
              </LocaleLink>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
