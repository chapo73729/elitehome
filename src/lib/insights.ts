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
    category: "Philosophy",
    title: "Engineering for the long horizon",
    excerpt:
      "Why we measure progress in decades, treat patience as infrastructure, and design ventures to become load-bearing rather than merely impressive.",
    date: "2026-05-18",
    readingMinutes: 6,
    accent: "#5b8cff",
    body: [
      {
        heading: "The quarter is the wrong unit",
        paragraphs: [
          "Most organisations optimise the next reporting period. It is a rational response to the incentives they live inside — but it quietly caps the kind of problems they are able to attempt. Anything whose payoff arrives after the horizon they measure simply never gets started.",
          "We chose a different unit. When the planning horizon is a decade, a class of work becomes available that is invisible on a quarterly clock: foundational research, infrastructure that compounds, and ventures that only become valuable once they are load-bearing for an entire industry.",
        ],
      },
      {
        heading: "Patience as infrastructure",
        paragraphs: [
          "Patience is usually framed as a virtue. We treat it as infrastructure — a resource you build deliberately and draw on when the work demands it. Patient capital, deep engineering benches, and a culture that rewards correctness over velocity are the scaffolding that lets a long-horizon thesis survive contact with reality.",
          "The discipline is not in waiting. It is in continuing to ship, measure and correct while the eventual outcome is still years away.",
        ],
      },
      {
        heading: "Load-bearing, not impressive",
        paragraphs: [
          "A demo is designed to impress. Infrastructure is designed to be relied upon. The two require almost opposite engineering cultures, and conflating them is the most common way ambitious projects fail.",
          "Every venture we run is built to the second standard. The question we ask is not whether something looks remarkable in a controlled setting, but whether other people can build their own work on top of it without thinking about it.",
        ],
      },
    ],
  },
  {
    slug: "intelligence-as-load-bearing-infrastructure",
    category: "Artificial Intelligence",
    title: "Intelligence as load-bearing infrastructure",
    excerpt:
      "Frontier capability is necessary but not sufficient. The harder problem is making intelligent systems dependable enough to carry weight in production.",
    date: "2026-04-02",
    readingMinutes: 7,
    accent: "#7af2e0",
    body: [
      {
        heading: "From capability to dependability",
        paragraphs: [
          "The public conversation about artificial intelligence fixates on capability — what a model can do at its best. In production, the binding constraint is almost always dependability: what a system does reliably, at its worst, on its hundred-thousandth call of the day.",
          "Closing that gap is an engineering problem, not a research one. It lives in evaluation harnesses, fallbacks, guardrails, observability and the unglamorous discipline of treating model behaviour as something to be measured rather than admired.",
        ],
      },
      {
        heading: "Agents that plan, act and self-correct",
        paragraphs: [
          "Autonomous agents are most useful where the environment is too complex to script in advance. That same property makes them hard to trust: the system is deciding, not following a fixed path.",
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
    slug: "one-fabric-six-anchors",
    category: "Global Network",
    title: "One operating fabric, six anchors",
    excerpt:
      "How a distributed set of hubs across every timezone behaves as a single operating system for capital, data and talent.",
    date: "2026-02-21",
    readingMinutes: 5,
    accent: "#b48cff",
    body: [
      {
        heading: "A network, not a headquarters",
        paragraphs: [
          "A traditional organisation has a centre and a periphery. A fabric does not. Each hub is a full node — able to originate work, route it and complete it — and the value is in how continuously they exchange.",
          "Our anchors sit across every major timezone for a practical reason: it lets work follow the sun. A question raised in one hub at the end of its day is often answered by another that is just beginning theirs.",
        ],
      },
      {
        heading: "Routing capital, data and talent",
        paragraphs: [
          "Three things move across the fabric continuously. Capital flows to the ventures where it compounds fastest. Data flows to where it can be processed and secured. Talent flows to the problems that most need it.",
          "Treating all three as routable — rather than fixed to a location — is what turns a set of offices into an operating system.",
        ],
      },
    ],
  },
];

export function getInsight(slug: string) {
  return INSIGHTS.find((i) => i.slug === slug);
}
