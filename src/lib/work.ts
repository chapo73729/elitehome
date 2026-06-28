/**
 * Case-study content. Illustrative digital-studio projects expanded into
 * full problem → approach → outcome narratives. Outcomes are framed
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
    field: "Data & AI",
    accent: "#4f8cff",
    summary:
      "An AI decision-support engine for operations teams who can't afford a wrong call.",
    stage: "Shipped · In production",
    challenge: [
      "High-stakes operational decisions can't be handed to a model that is merely accurate on average. The team needed a system that is dependable at its worst — and that knows when it is uncertain.",
      "The hard problem was never raw capability. It was trust: an assistant that escalates to a human at exactly the right moment, with a reasoning trail a person can audit.",
    ],
    approach: [
      {
        title: "Reason in a closed loop",
        body: "Helix plans, acts, observes the result and critiques its own output before committing. Robustness comes from the loop, not from any single step being perfect.",
      },
      {
        title: "Calibrated confidence",
        body: "Every recommendation carries a calibrated confidence score. Below a threshold, the system stops and escalates — with the full chain of reasoning attached for human review.",
      },
      {
        title: "Auditable by construction",
        body: "Each action is logged as an inspectable record, so an operator can reconstruct exactly why a decision was made long after the fact.",
      },
    ],
    outcome: [
      "In production, Helix handles the routine majority of decisions automatically while surfacing the genuinely ambiguous ones to the team early.",
      "The result is not a system that replaces judgement, but one that concentrates human attention where it matters most.",
    ],
    highlights: ["Self-auditing reasoning", "Sub-second decisions", "Human escalation paths"],
  },
  {
    slug: "tideglass",
    code: "PRJ—M12",
    name: "Tideglass",
    field: "SaaS Platform",
    accent: "#6b9dff",
    summary:
      "A logistics SaaS dashboard that turns scattered operational data into live, routable decisions.",
    stage: "Shipped · Scaling",
    challenge: [
      "The client's logistics operation ran on thin margins and stale information, spread across a patchwork of disconnected tools. Decisions were often made against data that was hours old.",
      "The opportunity was to give operators a single, live picture of their network — and to plan against it continuously rather than once a day.",
    ],
    approach: [
      {
        title: "Fuse every signal",
        body: "Tideglass merges tracking, scheduling, cost and external data feeds into one continuously-updated model of the operation.",
      },
      {
        title: "Optimise the whole route",
        body: "Rather than shortest-path, the engine balances time, cost and reliability against each operator's priorities, re-planning as conditions change.",
      },
      {
        title: "Operator in the loop",
        body: "Recommendations are explainable and overridable — the system advises, the dispatcher decides.",
      },
    ],
    outcome: [
      "Early rollout meaningfully reduced operating cost across the network while improving on-time reliability.",
      "Operators gained a live, shared dashboard that replaced a patchwork of spreadsheets and disconnected tools.",
    ],
    highlights: ["Live operations model", "Cost-aware routing", "Explainable recommendations"],
  },
  {
    slug: "foundry",
    code: "PRJ—R04",
    name: "Foundry",
    field: "Internal Tooling",
    accent: "#3d6fe0",
    summary:
      "A manufacturing operations dashboard and internal tooling suite that makes a plant floor legible.",
    stage: "Shipped · In production",
    challenge: [
      "The client's plant ran on tribal knowledge and end-of-shift paperwork. When something slipped, no one could see it until it was already a problem.",
      "The question was whether the day-to-day state of operations could be made visible in real time — and whether the manual reporting grind could be removed entirely.",
    ],
    approach: [
      {
        title: "Instrument the floor",
        body: "Foundry pulls live signals from existing line systems and sensors into a single operational data layer — no rip-and-replace.",
      },
      {
        title: "Surface the state",
        body: "A real-time dashboard and internal tools give supervisors a clear, shared view of throughput, exceptions and bottlenecks as they happen.",
      },
      {
        title: "Predict, don't react",
        body: "Models flag the conditions that precede downtime, so maintenance is scheduled before a line stops rather than after.",
      },
    ],
    outcome: [
      "Supervisors gained a live view of the floor and a marked reduction in unplanned downtime.",
      "Hours of manual end-of-shift reporting were replaced by dashboards that are always current.",
    ],
    highlights: ["Real-time dashboard", "Operational data layer", "Predictive maintenance"],
  },
  {
    slug: "continuum",
    code: "PRJ—S77",
    name: "Continuum",
    field: "Platform",
    accent: "#5ea2ff",
    summary:
      "A distributed runtime that places computation microseconds from the user.",
    stage: "Shipped · In production",
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
      "Applications achieved response times that feel instantaneous to users, without bespoke infrastructure work.",
      "Small teams gained capabilities that previously required a dedicated platform organisation.",
    ],
    highlights: ["Edge-native runtime", "Single-binary deploy", "Global failover"],
  },
];

export function getCase(slug: string) {
  return WORK.find((w) => w.slug === slug);
}
