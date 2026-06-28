/**
 * Editorial "Insights" content. Language-neutral English long-form — kept here
 * (rather than in the bilingual UI content) because articles are standalone
 * documents. Figures are deliberately qualitative, not fabricated metrics.
 */

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
    slug: "intelligence-as-load-bearing-infrastructure",
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

export function getInsight(slug: string) {
  return INSIGHTS.find((i) => i.slug === slug);
}
