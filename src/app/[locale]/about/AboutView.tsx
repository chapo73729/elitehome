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
    eyebrow: "About",
    h1: "A digital engineering studio.",
    intro:
      "ARDLABS is a digital engineering studio. We design and build software, platforms and AI systems that are fast, reliable, and refined to the detail — products built to hold up, not demonstrations.",
    photoAlt: "The ARDLABS studio — engineers at work in the Prague office.",
    photoCaption: "The studio · Prague",
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
    photoAlt: "Le studio ARDLABS — les ingénieurs au travail dans les bureaux de Prague.",
    photoCaption: "Le studio · Prague",
    whyTitle: "Notre raison d'être",
    why1:
      "La plupart des studios s'arrêtent aux fonctionnalités. Nous concevons le produit dans son ensemble. Chaque projet commence par une question difficile — quoi construire, pourquoi, et comment cela tiendra dans le temps — et aboutit à un logiciel, une plateforme ou un système d'IA qui fonctionne en production et continue de fonctionner longtemps après le lancement.",
    why2:
      "L'ingénierie numérique chapeaute l'ensemble. Dessous, quatre pôles couvrent une idée de bout en bout : conseil et stratégie, conception et développement, données et IA, cloud et infrastructure. Une ingénierie pointue, un design clair et le souci constant de livrer sont ce qui permet à une idée exigeante de résister à l'épreuve du réel.",
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
        k: "Un standard, quatre pôles",
        v: "Conseil, conception et développement, données et IA, et cloud — des disciplines distinctes, une même exigence d'ingénierie.",
      },
    ],
    DISCIPLINES: [
      { t: "Conseil & stratégie", d: "Conseil technologique, R&D appliquée et prototypage pour transformer une idée en un plan validé." },
      { t: "Conception & développement", d: "Logiciels sur mesure, web, mobile, SaaS et plateformes internes — conçus et développés de bout en bout." },
      { t: "Données & IA", d: "IA appliquée, automatisation intelligente et tableaux de bord qui transforment les opérations en décisions." },
      { t: "Cloud & infrastructure", d: "Architecture cloud, déploiement, APIs et intégrations pensés pour la disponibilité et l'échelle." },
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

export function AboutView() {
  const t = T[useLang()];
  const perf = usePerf();

  return (
    <main className="relative">
      {/* ---------- HEADER — giant title on the void, ghost numeral ---------- */}
      <section className="relative overflow-hidden pb-10 pt-40">
        <PageHeaderFX />
        <div className="container-x relative">
          <ChapterNumeral n="01" label="STUDIO" />

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
              <span className="eyebrow mt-8 block">{t.eyebrow} · 01</span>
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

      {/* ---------- STUDIO PHOTOGRAPH — blueprint-framed ---------- */}
      <section className="relative z-10 bg-void pb-6 pt-10 md:pt-14">
        <div className="container-x">
          <Reveal>
            <figure>
              <div className="relative overflow-hidden">
                <picture>
                  <source media="(max-width: 640px)" srcSet="/images/studio-sm.webp" />
                  <img
                    src="/images/studio.webp"
                    alt={t.photoAlt}
                    width={1600}
                    height={1062}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full object-cover saturate-[0.85]"
                  />
                </picture>
                {/* dark wash so the warm photograph sits in the void */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-[#050505]/50 via-transparent to-[#050505]/20"
                />
                {/* blueprint chrome — the Compile idiom at rest */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-3 border border-dashed border-accent/25 md:inset-4"
                />
                <span aria-hidden className="absolute left-1.5 top-1.5 h-5 w-5 border-l-2 border-t-2 border-accent/70 md:left-2 md:top-2" />
                <span aria-hidden className="absolute right-1.5 top-1.5 h-5 w-5 border-r-2 border-t-2 border-accent/70 md:right-2 md:top-2" />
                <span aria-hidden className="absolute bottom-1.5 left-1.5 h-5 w-5 border-b-2 border-l-2 border-accent/70 md:bottom-2 md:left-2" />
                <span aria-hidden className="absolute bottom-1.5 right-1.5 h-5 w-5 border-b-2 border-r-2 border-accent/70 md:bottom-2 md:right-2" />
              </div>
              <figcaption className="flex flex-wrap items-baseline justify-between gap-2 py-3 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-fog">
                <span>{t.photoCaption}</span>
                <span aria-hidden className="normal-case text-fog/60">{"// studio: prague … ok"}</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ---------- WHY — register left, editorial column right ---------- */}
      <section className="relative z-10 bg-void py-20 md:py-28">
        <div className="container-x grid gap-x-12 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <SectionMark index="01" label={t.whyTitle} />
            </Reveal>
          </div>
          <div className="max-w-xl space-y-5 lg:col-span-8">
            <Reveal delay={0.06}>
              <p className="text-lg leading-relaxed text-mist">{t.why1}</p>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="text-lg leading-relaxed text-mist">{t.why2}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- PRINCIPLES — numbered hairline rows, compiled ---------- */}
      <section className="relative z-10 bg-void py-20 md:py-28">
        <div className="container-x">
          <Reveal>
            <SectionMark index="02" label={t.principlesEyebrow} />
          </Reveal>
          <Compile label="principles" index="02" disabled={perf} className="mt-12">
            <ul className="border-b border-white/[0.07]">
              {t.PRINCIPLES.map((p, i) => (
                <Reveal as="li" key={p.k} delay={i * 0.06} className="hairline-t">
                  <div className="grid items-baseline gap-x-6 gap-y-2 py-8 md:grid-cols-12">
                    <span className="font-mono text-xs text-accent tabular-nums md:col-span-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-2xl font-semibold tracking-tight text-chalk md:col-span-4 md:text-3xl">
                      {p.k}
                    </h3>
                    <p className="max-w-md leading-relaxed text-mist md:col-span-7">
                      {p.v}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </Compile>
        </div>
      </section>

      {/* ---------- HOW WE'RE BUILT — two-column hairline index ---------- */}
      <section className="relative z-10 bg-void py-20 md:py-28">
        <div className="container-x">
          <Reveal>
            <SectionMark index="03" label={t.builtEyebrow} />
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="text-section-title mt-7 max-w-xl text-balance text-chalk">
              {t.builtTitle}
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-5 max-w-xl text-balance text-mist">{t.builtIntro}</p>
          </Reveal>
          <Compile label="poles" index="03" disabled={perf} className="mt-14">
            <ul className="grid border-b border-white/[0.07] sm:grid-cols-2 sm:gap-x-14">
              {t.DISCIPLINES.map((d, i) => (
                <Reveal as="li" key={d.t} delay={(i % 2) * 0.06} className="hairline-t">
                  <div className="flex items-baseline gap-5 py-6">
                    <span className="font-mono text-xs text-accent tabular-nums">
                      [{String(i + 1).padStart(2, "0")}]
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-lg leading-tight text-chalk">
                        {d.t}
                      </span>
                      <span className="mt-2 block max-w-sm text-sm leading-relaxed text-mist">
                        {d.d}
                      </span>
                    </span>
                  </div>
                </Reveal>
              ))}
            </ul>
          </Compile>
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
                <span className="font-display text-lg">{t.getInTouch}</span>
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
