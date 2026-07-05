/**
 * Editorial "Insights" content. The English long-form lives on each Insight
 * (unchanged). French translations live in a parallel `INSIGHTS_FR` map keyed
 * by slug; language-neutral fields (slug, date, readingMinutes, accent) are not
 * duplicated. Use `localizeInsight(post, lang)` to resolve to a locale.
 * Figures are deliberately qualitative, not fabricated metrics.
 */

import type { Lang } from "@/lib/lang";

export type Insight = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  readingMinutes: number;
  accent: string;
  body: { heading: string; paragraphs: string[] }[];
};

/** Translatable subset of an Insight. Language-neutral fields are omitted. */
export type InsightL10n = Pick<
  Insight,
  "category" | "title" | "excerpt" | "body"
>;

export const INSIGHTS: Insight[] = [
  {
    slug: "engineering-for-the-long-horizon",
    category: "Engineering",
    title: "Engineering software that lasts",
    excerpt:
      "Why we optimise for software that is still fast, secure and legible years after launch — not just impressive on day one.",
    date: "2026-05-18",
    readingMinutes: 6,
    accent: "#4f8cff",
    body: [
      {
        heading: "The demo is the wrong target",
        paragraphs: [
          "A lot of software is built to look good in a first demo. It is a rational response to how projects are pitched and approved — but it quietly caps the quality of what gets shipped. Anything whose payoff arrives after launch tends to get cut.",
          "We aim at a different target. When the goal is software that is still maintainable a few years out, a different class of work becomes worth doing: clear architecture, real test coverage, and interfaces that stay obvious as the team turns over.",
        ],
      },
      {
        heading: "Maintainability is a feature",
        paragraphs: [
          "Maintainability is usually treated as an afterthought. We treat it as a feature you build deliberately — legible code, sensible boundaries and observability that lets the next engineer understand the system without a tour.",
          "The discipline is not in shipping once. It is in continuing to ship, measure and refine while the system carries real load.",
        ],
      },
      {
        heading: "Reliable, not just impressive",
        paragraphs: [
          "A prototype is designed to impress. Production software is designed to be relied upon. The two require almost opposite engineering cultures, and conflating them is the most common way ambitious projects fail.",
          "Everything we ship is built to the second standard. The question we ask is not whether something looks remarkable in a controlled setting, but whether other people can build their own work on top of it without thinking about it.",
        ],
      },
    ],
  },
  {
    slug: "making-ai-dependable-in-production",
    category: "Data & AI",
    title: "Making AI dependable in production",
    excerpt:
      "Frontier capability is necessary but not sufficient. The harder problem is making intelligent systems dependable enough to carry weight in production.",
    date: "2026-04-02",
    readingMinutes: 7,
    accent: "#6b9dff",
    body: [
      {
        heading: "From capability to dependability",
        paragraphs: [
          "The public conversation about AI fixates on capability — what a model can do at its best. In production, the binding constraint is almost always dependability: what a system does reliably, at its worst, on its hundred-thousandth call of the day.",
          "Closing that gap is an engineering problem, not a research one. It lives in evaluation harnesses, fallbacks, guardrails, observability and the unglamorous discipline of treating model behaviour as something to be measured rather than admired.",
        ],
      },
      {
        heading: "Agents that plan, act and self-correct",
        paragraphs: [
          "Automated agents are most useful where the workflow is too complex to script in advance. That same property makes them hard to trust: the system is deciding, not following a fixed path.",
          "We design agents around a tight loop — plan, act, observe, correct — and around the assumption that any individual step can be wrong. Robustness comes from the loop, not from any one decision being perfect.",
        ],
      },
      {
        heading: "Engineered for production, not demos",
        paragraphs: [
          "A model that performs brilliantly in a notebook and unpredictably under load has not been deployed; it has been previewed. The work of deployment is everything that happens after the impressive result.",
          "That is where we spend our effort: latency budgets, graceful degradation, cost control and the operational tooling that lets a team run an intelligent system the way they would run any other critical service.",
        ],
      },
    ],
  },
  {
    slug: "one-team-four-poles",
    category: "Studio",
    title: "One team, four poles.",
    excerpt:
      "How strategy, design & development, data & AI, and cloud work as a single team rather than four handoffs.",
    date: "2026-02-21",
    readingMinutes: 5,
    accent: "#3d6fe0",
    body: [
      {
        heading: "One team, not a relay race",
        paragraphs: [
          "Most digital work is broken into handoffs: strategy throws a deck over the wall to design, design to engineering, engineering to ops. Each handoff loses context, and the product pays for it.",
          "We run as one team across four poles — Strategy & Consulting, Design & Development, Data & AI, and Cloud & Infrastructure. The people who frame the problem are close to the people who build it and the people who keep it running.",
        ],
      },
      {
        heading: "An idea, covered end to end",
        paragraphs: [
          "Each pole is a full discipline, but they share a single standard of engineering. Strategy de-risks the idea, design and development build it, data and AI make operations legible, and cloud keeps it fast and reliable.",
          "Treating the four as one practice — rather than four vendors — is what lets an idea travel from a sharp question to a product that holds up, without losing anything in translation.",
        ],
      },
    ],
  },
];

/**
 * French translations keyed by slug. Mirrors the translatable fields of the
 * English entries above (same block count, ordering and paragraph counts).
 * Slugs, dates, reading times and accents are language-neutral.
 */
export const INSIGHTS_FR: Record<string, InsightL10n> = {
  "engineering-for-the-long-horizon": {
    category: "Ingénierie",
    title: "Concevoir un logiciel qui dure",
    excerpt:
      "Pourquoi nous concevons des logiciels encore rapides, sûrs et lisibles des années après le lancement — pas seulement impressionnants le premier jour.",
    body: [
      {
        heading: "La démo est la mauvaise cible",
        paragraphs: [
          "Beaucoup de logiciels sont conçus pour faire bonne impression lors d'une première démonstration. C'est une réponse rationnelle à la manière dont les projets sont présentés et validés — mais cela plafonne discrètement la qualité de ce qui est livré. Tout ce dont le bénéfice arrive après le lancement tend à être sacrifié.",
          "Nous visons une autre cible. Lorsque l'objectif est un logiciel encore maintenable quelques années plus tard, une autre catégorie de travail mérite d'être entreprise : une architecture claire, une vraie couverture de tests et des interfaces qui restent évidentes à mesure que l'équipe se renouvelle.",
        ],
      },
      {
        heading: "La maintenabilité est une fonctionnalité",
        paragraphs: [
          "La maintenabilité est généralement traitée comme une réflexion après coup. Nous la traitons comme une fonctionnalité que l'on construit délibérément — un code lisible, des frontières sensées et une observabilité qui permet à l'ingénieur suivant de comprendre le système sans visite guidée.",
          "La discipline ne consiste pas à livrer une fois. Elle consiste à continuer de livrer, de mesurer et d'affiner pendant que le système supporte une charge réelle.",
        ],
      },
      {
        heading: "Fiable, pas seulement impressionnant",
        paragraphs: [
          "Un prototype est conçu pour impressionner. Un logiciel de production est conçu pour qu'on puisse s'y fier. Les deux exigent des cultures d'ingénierie presque opposées, et les confondre est la manière la plus courante dont des projets ambitieux échouent.",
          "Tout ce que nous livrons est construit selon le second standard. La question que nous posons n'est pas de savoir si quelque chose paraît remarquable dans un cadre contrôlé, mais si d'autres peuvent bâtir leur propre travail dessus sans avoir à y penser.",
        ],
      },
    ],
  },
  "making-ai-dependable-in-production": {
    category: "Données & IA",
    title: "Rendre l'IA fiable en production",
    excerpt:
      "La capacité de pointe est nécessaire, mais pas suffisante. Le plus difficile est de rendre les systèmes intelligents assez fiables pour qu'on leur confie de vraies décisions en production.",
    body: [
      {
        heading: "De la capacité à la fiabilité",
        paragraphs: [
          "Le débat public sur l'IA se focalise sur la capacité — ce qu'un modèle peut faire au mieux de sa forme. En production, la contrainte déterminante est presque toujours la fiabilité : ce qu'un système fait de manière constante, dans le pire des cas, à son cent-millième appel de la journée.",
          "Combler cet écart est un problème d'ingénierie, pas de recherche. Il se loge dans les bancs d'évaluation, les solutions de repli, les garde-fous, l'observabilité et la discipline ingrate qui consiste à traiter le comportement du modèle comme quelque chose à mesurer plutôt qu'à admirer.",
        ],
      },
      {
        heading: "Des agents qui planifient, agissent et se corrigent",
        paragraphs: [
          "Les agents automatisés sont les plus utiles là où le flux de travail est trop complexe pour être scripté à l'avance. Cette même propriété les rend difficiles à fiabiliser : le système décide, au lieu de suivre un chemin figé.",
          "Nous concevons les agents autour d'une boucle serrée — planifier, agir, observer, corriger — et autour de l'hypothèse que chaque étape individuelle peut être erronée. La robustesse vient de la boucle, et non de la perfection d'une décision isolée.",
        ],
      },
      {
        heading: "Conçu pour la production, pas pour les démos",
        paragraphs: [
          "Un modèle qui se comporte brillamment dans un notebook et de façon imprévisible sous charge n'a pas été déployé ; il a été présenté en avant-première. Le travail de déploiement, c'est tout ce qui se passe après le résultat impressionnant.",
          "C'est là que nous concentrons nos efforts : budgets de latence, dégradation maîtrisée, contrôle des coûts et l'outillage opérationnel qui permet à une équipe d'exploiter un système intelligent comme elle exploiterait tout autre service critique.",
        ],
      },
    ],
  },
  "one-team-four-poles": {
    category: "Studio",
    title: "Une équipe, quatre pôles.",
    excerpt:
      "Comment le conseil, la conception & le développement, les données & l'IA et le cloud fonctionnent comme une seule équipe plutôt que comme quatre passations.",
    body: [
      {
        heading: "Une équipe, pas une course de relais",
        paragraphs: [
          "La plupart des projets numériques sont fragmentés en passations : la stratégie envoie une présentation par-dessus le mur au design, le design à l'ingénierie, l'ingénierie à l'exploitation. Chaque passation perd du contexte, et le produit en paie le prix.",
          "Nous fonctionnons comme une seule équipe répartie sur quatre pôles — Conseil & stratégie, Conception & développement, Données & IA, et Cloud & infrastructure. Ceux qui cadrent le problème sont proches de ceux qui le construisent et de ceux qui le maintiennent en marche.",
        ],
      },
      {
        heading: "Une idée, prise en charge de bout en bout",
        paragraphs: [
          "Chaque pôle est une discipline à part entière, mais tous partagent un même standard d'ingénierie. Le conseil écarte les risques de l'idée, la conception et le développement la construisent, les données et l'IA rendent l'exploitation lisible, et le cloud la maintient rapide et fiable.",
          "Traiter ces quatre pôles comme une seule pratique — plutôt que comme quatre prestataires — est ce qui permet à une idée de voyager d'une question précise jusqu'à un produit qui tient la route, sans rien perdre en chemin.",
        ],
      },
    ],
  },
};

/**
 * Return an Insight with its translatable fields resolved to `lang`.
 * Language-neutral fields are preserved; English is the fallback.
 */
export function localizeInsight(post: Insight, lang: Lang): Insight {
  if (lang === "en") return post;
  const fr = INSIGHTS_FR[post.slug];
  if (!fr) return post;
  return { ...post, ...fr };
}

export function getInsight(slug: string) {
  return INSIGHTS.find((i) => i.slug === slug);
}
