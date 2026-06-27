/* ============================================================
   ARDLABS® — Central content & configuration
   ============================================================ */

export const SITE = {
  name: "ARDLABS",
  legal: "ARDLABS®",
  tagline: "Private Ventures",
  domain: "ardlabs.com",
  url: "https://ardlabs.com",
  email: "contact@ardmupro.ch",
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

export const INDUSTRIES = [
  {
    id: "ai",
    index: "01",
    title: "Artificial Intelligence",
    blurb:
      "Frontier models, autonomous agents and GPU-scale reasoning systems engineered for real-world deployment.",
    accent: "#5b8cff",
  },
  {
    id: "software",
    index: "02",
    title: "Software Development",
    blurb:
      "Mission-critical platforms, real-time systems and developer infrastructure built to outlast a decade.",
    accent: "#7af2e0",
  },
  {
    id: "automation",
    index: "03",
    title: "Automation",
    blurb:
      "Self-orchestrating pipelines that turn manual operations into measurable, compounding leverage.",
    accent: "#b98cff",
  },
  {
    id: "industrial",
    index: "04",
    title: "Industrial Services",
    blurb:
      "Robotics, precision manufacturing and instrumented factories where atoms meet algorithms.",
    accent: "#ff8c5b",
  },
  {
    id: "strategy",
    index: "05",
    title: "Strategic Development",
    blurb:
      "Capital, structure and long-horizon strategy for ventures designed to define their category.",
    accent: "#ffd15b",
  },
  {
    id: "maritime",
    index: "06",
    title: "Maritime Operations",
    blurb:
      "Fleet intelligence, route optimisation and ocean logistics navigated by data, not instinct.",
    accent: "#5be0ff",
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
  },
  {
    code: "PRJ—M12",
    name: "Tideglass",
    field: "Maritime Operations",
    text: "Real-time fleet intelligence reducing transit cost across global shipping lanes.",
  },
  {
    code: "PRJ—R04",
    name: "Foundry",
    field: "Industrial Services",
    text: "Instrumented micro-factories that reconfigure themselves around demand.",
  },
  {
    code: "PRJ—S77",
    name: "Continuum",
    field: "Software",
    text: "A distributed runtime powering the next generation of latency-zero applications.",
  },
] as const;

export const VISION_LINES = [
  "We do not predict the future.",
  "We engineer it — privately,",
  "at the scale of nations.",
] as const;
