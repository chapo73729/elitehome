/**
 * Case-study content. Built on the venture list in site.ts but expanded into
 * full challenge → approach → outcome narratives. Outcomes are framed
 * qualitatively; any figure shown is illustrative of intent, not a claim.
 */

export type CaseStudy = {
  slug: string;
  code: string;
  name: string;
  field: string;
  accent: string;
  summary: string;
  stage: string;
  challenge: string[];
  approach: { title: string; body: string }[];
  outcome: string[];
  highlights: string[];
};

export const WORK: CaseStudy[] = [
  {
    slug: "helix-core",
    code: "PRJ—AX9",
    name: "Helix Core",
    field: "Artificial Intelligence",
    accent: "#5b8cff",
    summary:
      "A self-supervising reasoning engine for environments where a wrong call is unacceptable.",
    stage: "Stage III · Pilot",
    challenge: [
      "High-stakes decisions — capital allocation, infrastructure control, crisis response — cannot be delegated to systems that are merely capable on average. They demand systems that are dependable at their worst, and that know when they are uncertain.",
      "The hard problem was never raw intelligence. It was trust: making an autonomous system that escalates to a human at exactly the right moment, with a reasoning trail a human can audit.",
    ],
    approach: [
      {
        title: "Reason in a closed loop",
        body: "Helix plans, acts, observes the result and critiques its own reasoning before committing. Robustness comes from the loop, not from any single step being perfect.",
      },
      {
        title: "Calibrated confidence",
        body: "Every decision carries a calibrated confidence score. Below a threshold, the system stops and escalates — with the full chain of reasoning attached for human review.",
      },
      {
        title: "Auditable by construction",
        body: "Each action is logged as an inspectable artefact, so an operator can reconstruct exactly why a decision was made long after the fact.",
      },
    ],
    outcome: [
      "In pilot environments, Helix handles the routine majority of decisions autonomously while surfacing the genuinely ambiguous ones to humans early.",
      "The result is not a system that replaces judgement, but one that concentrates human attention where it matters most.",
    ],
    highlights: ["Self-auditing reasoning", "Sub-second decisions", "Human escalation paths"],
  },
  {
    slug: "tideglass",
    code: "PRJ—M12",
    name: "Tideglass",
    field: "Maritime Operations",
    accent: "#7af2e0",
    summary:
      "Real-time fleet intelligence that routes ships for the best balance of time, fuel and emissions.",
    stage: "Stage IV · Scaling",
    challenge: [
      "Global shipping runs on thin margins and stale information. Routing decisions are often made against forecasts that are hours old, leaving fuel, time and emissions on the table.",
      "The opportunity was to give operators a single, live model of the ocean — and to route against it continuously rather than once per voyage.",
    ],
    approach: [
      {
        title: "Fuse every signal",
        body: "Tideglass merges radar, AIS, weather and market data into one continuously-updated model of conditions across global lanes.",
      },
      {
        title: "Optimise the whole voyage",
        body: "Rather than shortest-path, the engine balances time, fuel and emissions against each operator's priorities, re-routing as conditions change.",
      },
      {
        title: "Operator in the loop",
        body: "Recommendations are explainable and overridable — the system advises, the captain decides.",
      },
    ],
    outcome: [
      "Early deployments meaningfully reduced transit cost across major lanes while lowering emissions on the same routes.",
      "Operators gained a live, shared picture of their fleet that replaced a patchwork of disconnected tools.",
    ],
    highlights: ["Live fleet model", "Emissions-aware routing", "Explainable recommendations"],
  },
  {
    slug: "foundry",
    code: "PRJ—R04",
    name: "Foundry",
    field: "Industrial Services",
    accent: "#ffae6b",
    summary:
      "Instrumented micro-factories that sense demand and physically reconfigure to meet it.",
    stage: "Stage II · Prototype",
    challenge: [
      "Traditional factories are optimised for one product at scale. When demand shifts, retooling is slow and expensive — and capacity sits idle in between.",
      "The question was whether a production line could reconfigure itself around demand, the way software reallocates compute.",
    ],
    approach: [
      {
        title: "Sense demand directly",
        body: "Foundry lines read real demand signals and plan their own configuration ahead of need.",
      },
      {
        title: "Reconfigure physically",
        body: "Robotic cells and a live digital twin let a line change what it builds without a manual retooling cycle.",
      },
      {
        title: "Predict, don't react",
        body: "The same intelligence that runs our software governs maintenance — predicting failures before they halt a line.",
      },
    ],
    outcome: [
      "Prototype cells demonstrated self-reconfiguration between products and a marked reduction in unplanned downtime.",
      "The blueprint points toward factories that behave less like fixed plant and more like programmable infrastructure.",
    ],
    highlights: ["Self-reconfiguring lines", "Digital twin", "Predictive maintenance"],
  },
  {
    slug: "continuum",
    code: "PRJ—S77",
    name: "Continuum",
    field: "Software",
    accent: "#b48cff",
    summary:
      "A distributed runtime that places computation microseconds from the user.",
    stage: "Stage III · Pilot",
    challenge: [
      "Modern applications are expected to feel instantaneous everywhere — but the infrastructure to achieve that has historically been complex, costly and reserved for the largest engineering teams.",
      "The goal was edge performance with the developer experience of deploying to a single machine.",
    ],
    approach: [
      {
        title: "Compute at the edge",
        body: "Continuum places execution microseconds from the user, so applications respond at the speed of perception anywhere on earth.",
      },
      {
        title: "One binary, everywhere",
        body: "Developers deploy a single artefact; the runtime handles global distribution, placement and failover.",
      },
      {
        title: "Invisible operations",
        body: "Scaling, routing and recovery are handled by the platform, not by the team shipping on top of it.",
      },
    ],
    outcome: [
      "Pilot applications achieved response times that feel instantaneous to users, without bespoke infrastructure work.",
      "Small teams gained capabilities that previously required a dedicated platform organisation.",
    ],
    highlights: ["Edge-native runtime", "Single-binary deploy", "Global failover"],
  },
];

export function getCase(slug: string) {
  return WORK.find((w) => w.slug === slug);
}
