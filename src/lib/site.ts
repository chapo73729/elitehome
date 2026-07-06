/* ============================================================
   ARDLABS® — Central content & configuration
   ============================================================ */

export const SITE = {
  name: "ARDLABS",
  legal: "ARDLABS®",
  tagline: "Digital Engineering Studio",
  domain: "ardlabs.eu",
  url: "https://ardlabs.eu",
  email: "info@ardlabs.eu",
  description:
    "ARDLABS® is a digital engineering studio. We design and build software, platforms and AI systems that are fast, reliable, and refined to the detail.",
  locale: "en",
} as const;

export const STATS = [
  { value: "2019", label: "Founded" },
  { value: "Prague", label: "Based in" },
  { value: "EN / FR", label: "Bilingual" },
  { value: "Remote", label: "Working worldwide" },
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
    id: "strategy",
    index: "01",
    title: "Strategy & Consulting",
    blurb:
      "Technology consulting, R&D and product prototyping that turn an idea into a validated plan.",
    accent: "#4f8cff",
    motif: "ai" as MotifVariant,
    tagline: "Clarity before code.",
    overview:
      "Before a line of code, the hard questions: what to build, why, and how it will hold up. We bring technology consulting, applied R&D and rapid prototyping to de-risk the idea and chart the path to a product.",
    capabilities: [
      "Technology consulting",
      "Applied R&D",
      "Product prototyping",
      "Technical due diligence",
      "Architecture planning",
      "Roadmapping",
    ],
    approach: [
      { t: "Frame", d: "The real problem, the constraints, the bet." },
      { t: "Explore", d: "Prototypes that test the riskiest assumptions first." },
      { t: "Plan", d: "An architecture and roadmap you can build against." },
      { t: "Hand off", d: "A plan the build team can execute without guesswork." },
    ],
    metrics: [
      { value: "Week 1", label: "First prototype" },
      { value: "Fixed scope", label: "Clear deliverables" },
      { value: "Yours", label: "All IP & docs" },
    ],
  },
  {
    id: "software",
    index: "02",
    title: "Design & Development",
    blurb:
      "Custom software, web, mobile, SaaS and internal platforms — designed and engineered end to end.",
    accent: "#6b9dff",
    motif: "code" as MotifVariant,
    tagline: "Built to the detail.",
    overview:
      "The core of the studio. We design and build custom software — web, mobile, SaaS, platforms and internal systems — with interfaces that are clear and code that stays fast, secure and legible for years.",
    capabilities: [
      "Custom software",
      "Web & mobile apps",
      "SaaS & platforms",
      "Internal systems",
      "UI/UX design",
      "Design systems",
    ],
    approach: [
      { t: "Design", d: "Interfaces that are obvious before they are pretty." },
      { t: "Build", d: "Small fast team shipping production code continuously." },
      { t: "Harden", d: "Tested, instrumented and secured before it ships." },
      { t: "Maintain", d: "It keeps working long after launch." },
    ],
    metrics: [
      { value: "End-to-end", label: "Design + build" },
      { value: "Production", label: "Not just prototypes" },
      { value: "Maintained", label: "Beyond launch" },
    ],
  },
  {
    id: "ai",
    index: "03",
    title: "Data & AI",
    blurb:
      "AI, intelligent automation, data solutions and the dashboards that turn operations into decisions.",
    accent: "#3d6fe0",
    motif: "ai" as MotifVariant,
    tagline: "Operations, made legible.",
    overview:
      "We put data and AI to work where it pays off: intelligent automation, process automation (workflow, RPA), data pipelines and the dashboards and internal tools that turn raw operations into decisions.",
    capabilities: [
      "Applied AI",
      "AI automation",
      "Process automation (RPA)",
      "Data solutions",
      "Dashboards & BI",
      "Internal tools",
    ],
    approach: [
      { t: "Map", d: "Where the manual work and the data actually are." },
      { t: "Automate", d: "Pipelines and agents that absorb the repetitive load." },
      { t: "Surface", d: "Dashboards that make the state of things obvious." },
      { t: "Improve", d: "Systems that get sharper as they run." },
    ],
    metrics: [
      { value: "Less manual", label: "Work removed" },
      { value: "Live", label: "Dashboards" },
      { value: "Decisions", label: "From raw data" },
    ],
  },
  {
    id: "cloud",
    index: "04",
    title: "Cloud & Infrastructure",
    blurb:
      "Cloud architecture, deployment, APIs and integrations engineered for uptime and scale.",
    accent: "#5ea2ff",
    motif: "code" as MotifVariant,
    tagline: "Foundations that hold.",
    overview:
      "Software is only as reliable as what it runs on. We architect cloud infrastructure, set up deployment and observability, and build the APIs and integrations that connect your systems — engineered for uptime and scale.",
    capabilities: [
      "Cloud architecture",
      "Infrastructure & deployment",
      "APIs & integrations",
      "CI/CD pipelines",
      "Observability & SRE",
      "Security & compliance",
    ],
    approach: [
      { t: "Architect", d: "Infrastructure sized for the load it will carry." },
      { t: "Deploy", d: "Repeatable pipelines, no manual releases." },
      { t: "Observe", d: "You can see what's happening in production." },
      { t: "Scale", d: "It grows without a rewrite." },
    ],
    metrics: [
      { value: "Uptime", label: "Engineered for" },
      { value: "Automated", label: "Deploys" },
      { value: "Connected", label: "APIs & systems" },
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

