/* ============================================================
   ARDLABS® — Central content & configuration
   ============================================================ */

export const SITE = {
  name: "ARDLABS",
  legal: "ARDLABS®",
  tagline: "Private Ventures",
  domain: "ardlabs.com",
  url: "https://ardlabs.com",
  email: "info@ardlabs.com",
  description:
    "ARDLABS® — Private Ventures. A future-facing laboratory engineering artificial intelligence, software, automation, industrial and maritime ventures across a global network.",
  locale: "en",
} as const;

export const NAV = [
  { label: "Vision", href: "#vision" },
  { label: "Core", href: "#core" },
  { label: "Network", href: "#network" },
  { label: "Industries", href: "#industries" },
  { label: "Lab", href: "#lab" },
  { label: "Contact", href: "#contact" },
] as const;

export const STATS = [
  { value: 6, suffix: "", label: "Continents of operation" },
  { value: 47, suffix: "+", label: "Active ventures" },
  { value: 2.4, suffix: "B", prefix: "$", label: "Assets under engineering", decimals: 1 },
  { value: 99.99, suffix: "%", label: "Infrastructure uptime", decimals: 2 },
] as const;

export const CITIES = [
  { name: "Prague", lat: 50.0755, lon: 14.4378, primary: true },
  { name: "Geneva", lat: 46.2044, lon: 6.1432, primary: true },
  { name: "Singapore", lat: 1.3521, lon: 103.8198, primary: true },
  { name: "Dubai", lat: 25.2048, lon: 55.2708, primary: true },
  { name: "Tokyo", lat: 35.6762, lon: 139.6503, primary: true },
  { name: "New York", lat: 40.7128, lon: -74.006, primary: true },
] as const;

export type MotifVariant = "ai" | "code" | "industrial" | "ocean";

export const INDUSTRIES = [
  {
    id: "ai",
    index: "01",
    title: "Artificial Intelligence",
    blurb:
      "Frontier models, autonomous agents and GPU-scale reasoning systems engineered for real-world deployment.",
    accent: "#5b8cff",
    motif: "ai" as MotifVariant,
    tagline: "Intelligence, engineered.",
    overview:
      "We build artificial intelligence the way others build infrastructure — to be load-bearing. From frontier model research to autonomous agents that plan, act and self-correct, our systems are designed to make consequential decisions in production, not to impress in a demo.",
    capabilities: [
      "Frontier model training & fine-tuning",
      "Autonomous multi-agent systems",
      "Real-time inference at GPU scale",
      "Retrieval & reasoning pipelines",
      "Alignment, evaluation & guardrails",
      "On-prem & sovereign deployment",
    ],
    approach: [
      { t: "Research", d: "Novel architectures validated against real-world benchmarks." },
      { t: "Engineer", d: "Models hardened into reliable, observable production systems." },
      { t: "Deploy", d: "Inference tuned for latency, cost and uptime at scale." },
      { t: "Compound", d: "Systems that learn from deployment and improve continuously." },
    ],
    metrics: [
      { value: "10¹⁵", label: "FLOPs per training run" },
      { value: "<40ms", label: "Inference latency" },
      { value: "24/7", label: "Autonomous operation" },
    ],
  },
  {
    id: "software",
    index: "02",
    title: "Software Development",
    blurb:
      "Mission-critical platforms, real-time systems and developer infrastructure built to outlast a decade.",
    accent: "#7af2e0",
    motif: "code" as MotifVariant,
    tagline: "Code that compiles the future.",
    overview:
      "Software is the substrate of every venture we run. We write mission-critical platforms, real-time systems and developer infrastructure with a single bias: longevity. Code that is fast today and still legible, secure and extensible a decade from now.",
    capabilities: [
      "Distributed real-time systems",
      "Developer platforms & SDKs",
      "Edge & latency-zero runtimes",
      "High-assurance backends (Rust)",
      "Design systems & web experiences",
      "Observability & SRE by default",
    ],
    approach: [
      { t: "Architect", d: "Systems designed for the load they'll carry in five years." },
      { t: "Build", d: "Small, fast teams shipping production code continuously." },
      { t: "Harden", d: "Tested, instrumented and secured before it ships." },
      { t: "Scale", d: "Infrastructure that grows without rewrites." },
    ],
    metrics: [
      { value: "99.99%", label: "Platform uptime" },
      { value: "<1ms", label: "Edge response" },
      { value: "∞", label: "Horizontal scale" },
    ],
  },
  {
    id: "automation",
    index: "03",
    title: "Automation",
    blurb:
      "Self-orchestrating pipelines that turn manual operations into measurable, compounding leverage.",
    accent: "#b98cff",
    motif: "ai" as MotifVariant,
    tagline: "Leverage that compounds.",
    overview:
      "Every manual operation is latent leverage. We design self-orchestrating pipelines that absorb repetitive work and convert it into measurable, compounding output — freeing teams to do only what humans should.",
    capabilities: [
      "Process intelligence & mapping",
      "Workflow orchestration engines",
      "Robotic process automation",
      "Event-driven pipelines",
      "Human-in-the-loop controls",
      "ROI instrumentation",
    ],
    approach: [
      { t: "Map", d: "Every operation observed, measured and modelled." },
      { t: "Orchestrate", d: "Pipelines that route work without supervision." },
      { t: "Verify", d: "Human checkpoints where stakes demand them." },
      { t: "Multiply", d: "Output that compounds as the system learns." },
    ],
    metrics: [
      { value: "90%", label: "Manual work removed" },
      { value: "10×", label: "Throughput gain" },
      { value: "0", label: "Dropped tasks" },
    ],
  },
  {
    id: "industrial",
    index: "04",
    title: "Industrial Services",
    blurb:
      "Robotics, precision manufacturing and instrumented factories where atoms meet algorithms.",
    accent: "#ff8c5b",
    motif: "industrial" as MotifVariant,
    tagline: "Where atoms meet algorithms.",
    overview:
      "We bring software discipline to the physical world. Robotics, precision manufacturing and fully instrumented factories — where every machine reports, every process is measured, and the same intelligence that runs our software governs the floor.",
    capabilities: [
      "Industrial robotics & cells",
      "Precision manufacturing",
      "Factory telemetry & digital twins",
      "Predictive maintenance",
      "Quality vision systems",
      "Supply-chain integration",
    ],
    approach: [
      { t: "Instrument", d: "Every machine and process made observable." },
      { t: "Automate", d: "Robotic cells that reconfigure around demand." },
      { t: "Predict", d: "Failures forecast before they halt the line." },
      { t: "Optimise", d: "Throughput tuned by the same models that run AI." },
    ],
    metrics: [
      { value: "μm", label: "Tolerances" },
      { value: "−35%", label: "Downtime" },
      { value: "100%", label: "Traceability" },
    ],
  },
  {
    id: "strategy",
    index: "05",
    title: "Strategic Development",
    blurb:
      "Capital, structure and long-horizon strategy for ventures designed to define their category.",
    accent: "#ffd15b",
    motif: "ai" as MotifVariant,
    tagline: "Built to define a category.",
    overview:
      "Some ventures are built to compete; ours are built to define. We bring patient capital, deliberate structure and a century-long horizon to a small number of ventures each year — and engineer them to own their category.",
    capabilities: [
      "Patient capital deployment",
      "Venture architecture & structure",
      "Market & category strategy",
      "Operating partnerships",
      "M&A and consolidation",
      "Governance & long-horizon planning",
    ],
    approach: [
      { t: "Select", d: "A few convictions, pursued completely." },
      { t: "Structure", d: "Capital and governance designed to last." },
      { t: "Operate", d: "Hands-on partnership, not passive ownership." },
      { t: "Endure", d: "Decisions made for decades, not quarters." },
    ],
    metrics: [
      { value: "$2.4B", label: "Under engineering" },
      { value: "100y", label: "Planning horizon" },
      { value: "47+", label: "Active ventures" },
    ],
  },
  {
    id: "maritime",
    index: "06",
    title: "Maritime Operations",
    blurb:
      "Fleet intelligence, route optimisation and ocean logistics navigated by data, not instinct.",
    accent: "#5be0ff",
    motif: "ocean" as MotifVariant,
    tagline: "An ocean, read like a dataset.",
    overview:
      "The ocean is the largest unoptimised system on earth. We navigate it with data — fleet intelligence, route optimisation and logistics that turn weather, currents and markets into a single, navigable model.",
    capabilities: [
      "Fleet intelligence platforms",
      "Route & fuel optimisation",
      "Weather & current modelling",
      "Port & logistics orchestration",
      "Radar / GPS data fusion",
      "Emissions & compliance",
    ],
    approach: [
      { t: "Sense", d: "Radar, GPS, weather and market data fused live." },
      { t: "Model", d: "The ocean rendered as an optimisable system." },
      { t: "Route", d: "Paths chosen for cost, time and emissions." },
      { t: "Deliver", d: "Cargo moved with predictability, not luck." },
    ],
    metrics: [
      { value: "−18%", label: "Transit cost" },
      { value: "Live", label: "Fleet tracking" },
      { value: "Global", label: "Shipping lanes" },
    ],
  },
] as const;

export const TECH = [
  "React",
  "Next.js",
  "Rust",
  "Python",
  "TensorFlow",
  "OpenAI",
  "CUDA",
  "Docker",
  "Kubernetes",
  "AWS",
  "Three.js",
  "WebGPU",
] as const;

export const TIMELINE = [
  {
    year: "2019",
    title: "Genesis",
    text: "ARDLABS is founded as a private engineering studio with a single conviction: build the future before it is named.",
  },
  {
    year: "2021",
    title: "Intelligence",
    text: "First in-house neural architectures reach production, powering autonomous decision systems across ventures.",
  },
  {
    year: "2023",
    title: "Expansion",
    text: "Operations span six continents. Industrial robotics and maritime intelligence join the portfolio.",
  },
  {
    year: "2025",
    title: "Convergence",
    text: "AI, software and physical infrastructure merge into a single, self-improving operating fabric.",
  },
  {
    year: "2027",
    title: "Horizon",
    text: "Autonomous ventures that design, fund and operate themselves — engineered, governed and owned privately.",
  },
] as const;

export const PROJECTS = [
  {
    code: "PRJ—AX9",
    name: "Helix Core",
    field: "Artificial Intelligence",
    text: "A self-supervising reasoning engine for high-stakes decision environments.",
    detail:
      "Helix Core is an autonomous reasoning engine designed for environments where a wrong call is unacceptable — capital allocation, infrastructure control, crisis response. It plans, acts, audits its own reasoning and escalates to humans only when confidence drops below threshold.",
    highlights: ["Self-auditing reasoning", "Sub-second decisions", "Human escalation paths"],
    stage: "Stage III · Pilot",
  },
  {
    code: "PRJ—M12",
    name: "Tideglass",
    field: "Maritime Operations",
    text: "Real-time fleet intelligence reducing transit cost across global shipping lanes.",
    detail:
      "Tideglass fuses radar, AIS, weather and market data into a single live model of the ocean, then routes fleets for the optimal balance of time, fuel and emissions. Early deployments cut transit cost by double digits across major lanes.",
    highlights: ["−18% transit cost", "Live fleet model", "Emissions-aware routing"],
    stage: "Stage IV · Scaling",
  },
  {
    code: "PRJ—R04",
    name: "Foundry",
    field: "Industrial Services",
    text: "Instrumented micro-factories that reconfigure themselves around demand.",
    detail:
      "Foundry is a blueprint for micro-factories that sense demand and physically reconfigure their production lines to meet it — robotic cells, digital twins and predictive maintenance governed by the same intelligence that runs our software.",
    highlights: ["Self-reconfiguring lines", "Digital twin", "−35% downtime"],
    stage: "Stage II · Prototype",
  },
  {
    code: "PRJ—S77",
    name: "Continuum",
    field: "Software",
    text: "A distributed runtime powering the next generation of latency-zero applications.",
    detail:
      "Continuum is a distributed runtime that places computation at the edge, microseconds from the user. It powers applications that feel instantaneous anywhere on earth, with a developer experience as simple as deploying to a single machine.",
    highlights: ["Edge-native runtime", "<1ms response", "Single-binary deploy"],
    stage: "Stage III · Pilot",
  },
] as const;

export const VISION_LINES = [
  "We do not predict the future.",
  "We engineer it — privately,",
  "at the scale of nations.",
] as const;
