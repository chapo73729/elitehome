"use client";

import { useLang, type Lang } from "./lang";
import type { MotifVariant } from "./site";

/* ============================================================
   Centralized, localized site content (EN base + FR overrides).
   Fabricated figures intentionally avoided — copy is credible
   but not falsely specific.
   ============================================================ */

const en = {
  nav: [
    { label: "Manifesto", href: "#manifesto" },
    { label: "AI Core", href: "#core" },
    { label: "Network", href: "#network" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" },
  ],
  common: {
    engage: "Engage",
    soundOn: "Sound on",
    soundOff: "Sound off",
    accent: "ACCENT",
    skip: "Skip to content",
  },
  hero: {
    eyebrow: "Digital Engineering Studio · Prague",
    headline: "Complex ideas, engineered into precise products.",
    subtitle:
      "ARDLABS is a digital engineering studio. We design and build software, platforms and AI systems that are fast, reliable, and refined to the detail.",
    explore: "See our work",
    engage: "Start a project",
    scroll: "SCROLL",
    scrollHint: "The studio, in five moves.",
  },
  vision: {
    tag: "ARDLABS.AI · COMPOSING VISION",
    lines: ["We don't just promise.", "We engineer — to the detail,", "and we ship."],
    para: "Every project starts as a hard question and ends as a product that holds up. We bring deep engineering, clear design and a bias for shipping.",
  },
  cinematic: {
    tag: "MANIFESTO",
    lines: [
      "Most studios ship features.",
      "We engineer products.",
      "Design, code and infrastructure —",
      "built to the detail, made to last.",
    ],
    outro: "This is digital engineering, done right.",
  },
  synthesis: {
    eyebrow: "Living Synthesis",
    title: "One system, many forms.",
    intro:
      "Intelligence, network, infrastructure — the same effort, recomposed. Click to reshape the field; move your cursor to disturb it.",
    hint: "Click to morph · move to disturb",
    shapes: ["Core", "Network", "Continuum", "Lattice"],
  },
  core: {
    eyebrow: "Interactive AI Core",
    title: "Intelligence, put to work.",
    intro:
      "Move your cursor — the field responds. The same way the AI and automation we build respond to real operations.",
    points: [
      { k: "Applied AI", v: "Models and agents wired into real workflows, not demos." },
      { k: "Automation", v: "Process automation that removes the manual grind." },
      { k: "Data", v: "Pipelines and dashboards that turn operations into decisions." },
    ],
    cta: "Have an operation that should run like this?",
    ctaButton: "Start a project",
  },
  network: {
    eyebrow: "Global Network",
    title: "One studio. Prague-based. Working worldwide.",
    intro:
      "We work with founders and teams across timezones — async by default, precise in delivery.",
    routesLabel: "Connected routes",
    returnHint: "Click the sea or press Esc to return",
  },
  industries: {
    eyebrow: "Services",
    title: "Four poles. One standard.",
    intro:
      "Digital engineering is the umbrella. Under it, four poles cover an idea end to end.",
    explore: "EXPLORE →",
    viewAll: "View all services",
    indexEyebrow: "Four poles.",
    indexIntro:
      "Digital engineering is the umbrella. Under it, four poles cover an idea end to end. Choose a pole.",
    items: [
      {
        id: "strategy",
        index: "01",
        accent: "#4f8cff",
        motif: "ai" as MotifVariant,
        title: "Strategy & Consulting",
        blurb:
          "Technology consulting, R&D and product prototyping that turn an idea into a validated plan.",
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
        deliverables: [
          "A written problem statement and the constraints that shape it",
          "A working prototype that tests the riskiest assumptions",
          "A target architecture with the key trade-offs made explicit",
          "A phased roadmap with scope, sequence and rough effort",
          "A technical due-diligence or feasibility note where it's warranted",
          "A clear handover the build team can execute against",
        ],
        engagement: [
          { t: "Discovery sprint", d: "A fixed, short engagement to frame the problem and surface the real risks." },
          { t: "Prototype & validate", d: "We build the smallest thing that proves or kills the riskiest assumption." },
          { t: "Plan & hand off", d: "Architecture, roadmap and docs — ready to build, with or without us." },
        ],
        stack: ["Figma", "TypeScript", "Next.js", "Python", "Notebooks", "Excalidraw"],
        relatedWork: ["helix-core", "continuum"],
      },
      {
        id: "software",
        index: "02",
        accent: "#6b9dff",
        motif: "code" as MotifVariant,
        title: "Design & Development",
        blurb:
          "Custom software, web, mobile, SaaS and internal platforms — designed and engineered end to end.",
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
        deliverables: [
          "A production application — web, mobile or both",
          "A reusable design system and component library",
          "A documented, tested codebase you fully own",
          "CI/CD pipelines and environments configured for repeatable releases",
          "Onboarding docs and a structured handover to your team",
          "An agreed support window after launch",
        ],
        engagement: [
          { t: "Discovery & design", d: "We align on scope and ship the core flows as a clickable, agreed design." },
          { t: "Fixed-scope build", d: "A small senior team ships production code in short, reviewable increments." },
          { t: "Launch & support", d: "We harden, ship, hand over and stay available for an agreed support window." },
        ],
        stack: ["React", "Next.js", "TypeScript", "Tailwind", "Figma", "Three.js"],
        relatedWork: ["tideglass", "foundry"],
      },
      {
        id: "ai",
        index: "03",
        accent: "#3d6fe0",
        motif: "ai" as MotifVariant,
        title: "Data & AI",
        blurb:
          "AI, intelligent automation, data solutions and the dashboards that turn operations into decisions.",
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
        deliverables: [
          "Mapped workflows and a clear view of where the data lives",
          "Data pipelines that consolidate scattered sources",
          "Automations or agents wired into real workflows",
          "Live dashboards and internal tools for the people who run operations",
          "Evaluation and guardrails for any AI in the loop",
          "Documentation and a handover so the system stays maintainable",
        ],
        engagement: [
          { t: "Map the operation", d: "We trace where the manual work and the data actually are before touching anything." },
          { t: "Automate & surface", d: "We build the pipelines, automations and dashboards that remove the grind." },
          { t: "Measure & improve", d: "We instrument what we ship so it can be checked, trusted and sharpened over time." },
        ],
        stack: ["Python", "TensorFlow", "OpenAI", "CUDA", "Postgres", "dbt"],
        relatedWork: ["helix-core", "foundry"],
      },
      {
        id: "cloud",
        index: "04",
        accent: "#5ea2ff",
        motif: "code" as MotifVariant,
        title: "Cloud & Infrastructure",
        blurb:
          "Cloud architecture, deployment, APIs and integrations engineered for uptime and scale.",
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
        deliverables: [
          "A cloud architecture sized for the load it will carry",
          "Infrastructure defined as code, reproducible across environments",
          "CI/CD pipelines that replace manual releases",
          "Observability — logs, metrics and alerts you can actually read",
          "APIs and integrations that connect your systems",
          "A security and compliance baseline, documented",
        ],
        engagement: [
          { t: "Architect", d: "We design the infrastructure and the deployment model around your real load." },
          { t: "Build & automate", d: "Infrastructure as code, CI/CD and observability, set up once and repeatable." },
          { t: "Operate & scale", d: "We hand over a system you can run — and that grows without a rewrite." },
        ],
        stack: ["AWS", "Docker", "Kubernetes", "Terraform", "Rust", "GitHub Actions"],
        relatedWork: ["continuum", "tideglass"],
      },
    ],
  },
  capabilities: {
    items: [
      {
        n: "05",
        tag: "Data & AI",
        title: "Intelligence, put to work.",
        text: "Models, agents and pipelines wired into real workflows. Applied AI and automation that remove the manual grind and make operations legible.",
        variant: "ai" as MotifVariant,
        chips: ["Applied AI", "Automation", "Data pipelines"],
      },
      {
        n: "06",
        tag: "Design & Development",
        title: "Code that ships products.",
        text: "Web, mobile, SaaS and platforms, designed and engineered end to end. Interfaces that are clear and code that stays fast, secure and legible for years.",
        variant: "code" as MotifVariant,
        chips: ["Web & mobile", "SaaS & platforms", "Design systems"],
      },
      {
        n: "07",
        tag: "Strategy & Consulting",
        title: "Clarity before code.",
        text: "Technology consulting, applied R&D and rapid prototyping. We de-risk the idea and turn it into an architecture and roadmap you can build against.",
        variant: "ai" as MotifVariant,
        chips: ["Consulting", "R&D", "Prototyping"],
      },
      {
        n: "08",
        tag: "Cloud & Infrastructure",
        title: "Foundations that hold.",
        text: "Cloud architecture, deployment and observability, plus the APIs and integrations that connect your systems — engineered for uptime and scale.",
        variant: "code" as MotifVariant,
        chips: ["Cloud", "CI/CD", "APIs & integrations"],
      },
    ],
  },
  research: {
    eyebrow: "Research Lab",
    title: "Step inside the apparatus.",
    intro:
      "Floating instruments, holographic readouts and a self-rotating core — a working model of how intelligence, data and matter converge under one roof.",
    readouts: [
      { k: "STATUS", v: "Operational" },
      { k: "ENTITIES", v: "Holographic" },
      { k: "ACCESS", v: "Restricted" },
    ],
  },
  stack: {
    eyebrow: "Technology Stack",
    title: "The instruments behind the work.",
    intro: "A deliberately small set of tools, mastered completely — from the metal to the model.",
    marquee: ["Engineering", "Intelligence", "Infrastructure", "Velocity", "Precision"],
  },
  stats: {
    items: [
      { value: "2019", label: "Founded" },
      { value: "Prague", label: "Based in" },
      { value: "EN / FR", label: "Bilingual" },
      { value: "Remote", label: "Working worldwide" },
    ],
  },
  timeline: {
    eyebrow: "Studio Timeline",
    title: "How the studio grew.",
    items: [
      { year: "2019", title: "Founded", text: "ARDLABS is founded in Prague as a digital engineering studio with a single conviction: design and build software that holds up." },
      { year: "2021", title: "The team", text: "The studio grows into a senior bench of designers and engineers, shipping web, mobile and SaaS products end to end." },
      { year: "2023", title: "Data & AI", text: "We expand into applied AI, automation and data — putting models and dashboards to work inside real operations." },
      { year: "2025", title: "Cloud & scale", text: "Cloud architecture and infrastructure become a full pole, engineered for uptime and growth." },
      { year: "2027", title: "Four poles", text: "Strategy, design & development, data & AI and cloud operate as one team covering an idea from question to product." },
    ],
  },
  projects: {
    eyebrow: "Selected Projects",
    title: "A look at the work.",
    intro: "A few illustrative projects from across the four poles. Open one.",
    open: "OPEN →",
    classified: "SELECTED WORK",
    requestBriefing: "Request a briefing",
    items: [
      {
        code: "PRJ—AX9",
        name: "Helix Core",
        field: "Data & AI",
        text: "An AI decision-support engine for operations teams who can't afford a wrong call.",
        detail:
          "Helix Core plans, acts, audits its own output and escalates to a human when confidence drops below threshold — a dependable assistant for high-stakes operational decisions.",
        highlights: ["Self-auditing reasoning", "Real-time decisions", "Human escalation paths"],
        stage: "Shipped · In production",
      },
      {
        code: "PRJ—M12",
        name: "Tideglass",
        field: "SaaS Platform",
        text: "A logistics SaaS dashboard that turns scattered data into live decisions.",
        detail:
          "Tideglass fuses tracking, scheduling and cost data into a single live model of the operation, then plans routes for the optimal balance of time, cost and reliability.",
        highlights: ["Live operations model", "Route optimisation", "Cost-aware"],
        stage: "Shipped · Scaling",
      },
      {
        code: "PRJ—R04",
        name: "Foundry",
        field: "Internal Tooling",
        text: "A manufacturing operations dashboard that makes a plant floor legible.",
        detail:
          "Foundry pulls live signals from existing line systems into one operational data layer, then surfaces throughput, exceptions and bottlenecks in real time — with predictive maintenance to head off downtime.",
        highlights: ["Real-time dashboard", "Operational data layer", "Predictive maintenance"],
        stage: "Shipped · In production",
      },
      {
        code: "PRJ—S77",
        name: "Continuum",
        field: "Platform",
        text: "A distributed runtime for the next generation of latency-minimal applications.",
        detail:
          "Continuum is a distributed runtime that places computation at the edge, close to the user. It powers applications that feel instantaneous, with a developer experience as simple as deploying to a single machine.",
        highlights: ["Edge-native runtime", "Latency-minimal", "Single-binary deploy"],
        stage: "Shipped · In production",
      },
    ],
  },
  workflow: {
    eyebrow: "The system",
    title: "Build logic at scale.",
    intro:
      "Design, deploy and orchestrate sophisticated AI workflows through one visual canvas — agents, tools and code, composed without friction.",
  },
  telemetry: {
    eyebrow: "Telemetry",
    title: "Optimised for performance.",
    intro:
      "Every signal, monitored in real time — agent accuracy, server latency and token efficiency, read like instruments.",
  },
  bento: {
    eyebrow: "Why ARDLABS",
    title: "Built differently, on purpose.",
    cells: [
      { title: "End to end", body: "Strategy, design, build and infrastructure — four poles, one team." },
      { title: "Senior bench", body: "Small teams of engineers who build." },
      { title: "Prague · worldwide", body: "Based in Prague, working with teams across every timezone — async by default." },
      { title: "Reliable by default", body: "Systems engineered to be relied upon, not to impress in a demo." },
      { title: "Refined to the detail", body: "Fast, secure, legible — and maintained well beyond launch." },
      { title: "One standard", body: "Distinct disciplines, a shared rigor of engineering." },
    ],
  },
  partners: {
    eyebrow: "Network",
    title: "Operating alongside a private network.",
    note: "Representative partners — replace with your own.",
    items: [
      "Vltava Systems · Prague, CZ",
      "Triglav Robotics · Ljubljana, SI",
      "Adriatic Marine · Koper, SI",
      "Bohemia AI · Brno, CZ",
      "Tatra Industrial · Bratislava, SK",
      "Helvetia Capital · Geneva, CH",
      "Danube Compute · Vienna, AT",
      "Lagoon Data · Singapore, SG",
    ],
  },
  testimonials: {
    eyebrow: "Endorsements",
    title: "What partners say.",
    note: "Representative quotes — replace with your own.",
    items: [
      { quote: "ARDLABS doesn't chase demos. They ship software we can rely on for years.", author: "Product Lead", role: "SaaS Company" },
      { quote: "The rare team that treats dependability as the feature, not an afterthought.", author: "Chief Technology Officer", role: "Scale-up" },
      { quote: "They engineer quietly and the results just keep working.", author: "Founder", role: "Startup" },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Questions, answered.",
    items: [
      { q: "How do you scope a project?", a: "Every project begins by framing the real problem and the constraints — then a prototype that tests the riskiest assumptions before we commit to a build." },
      { q: "Who do you work with?", a: "Founders, product teams and operators who care about software that holds up. We take on a small number of projects at a time." },
      { q: "Where are you based?", a: "Prague-based, working worldwide — async by default and precise in delivery, across every timezone." },
      { q: "Is your work public?", a: "Some of it is under NDA. What you see here is a curated window onto how we think and build." },
    ],
  },
  cta: {
    eyebrow: "Engage",
    title: "Have something worth building right?",
    body: "We take on a small number of projects at a time, for teams who care about software that holds up. Tell us what you're trying to build.",
    button: "Start a conversation",
  },
  contact: {
    eyebrow: "Contact · 04",
    title: "Let's build it.",
    intro:
      "We take on a small number of projects at a time. Tell us what you're building — we'll tell you how we'd approach it.",
    name: "Name",
    namePlaceholder: "Ada Lovelace",
    email: "Email",
    emailPlaceholder: "you@company.com",
    domain: "Domain",
    domains: ["Strategy & Consulting", "Design & Development", "Data & AI", "Cloud & Infrastructure"],
    message: "Message",
    messagePlaceholder: "What are you building?",
    transmit: "Transmit",
    transmitting: "Transmitting…",
    sentTitle: "Transmission received.",
    sentBody: "Thank you — your message is on its way to our team. We respond to every signal worth answering.",
    sendAnother: "Send another",
    errorPrefix: "Couldn't send — please email",
    step: "You are here · 04 / 04",
    copyHint: "Click to copy",
    copied: "Email copied",
  },
  footer: {
    tagline: "A digital engineering studio designing and building software, platforms and AI systems, refined to the detail.",
    index: "Index",
    contact: "Contact",
    copyHint: "Click to copy",
    copied: "Email copied",
    insights: "Insights",
    legalNotice: "Legal Notice",
    privacy: "Privacy",
    terms: "Terms",
    rights: "All rights reserved.",
    press: "Press",
    allSystems: "All systems operational",
  },
  industry: {
    all: "← All services",
    label: "Service",
    overview: "Overview",
    capabilities: "Capabilities",
    howWeOperate: "How we operate.",
    deliverables: "What you get",
    deliverablesIntro: "Concrete artifacts you keep — not slideware.",
    engagement: "How we engage",
    engagementIntro: "A simple, fixed-scope path from question to shipped work.",
    stack: "Typical stack",
    stackIntro: "A deliberately small set of tools we reach for here.",
    relatedWork: "Related work",
    relatedWorkIntro: "Representative projects that show this pole in practice.",
    viewCase: "View case study",
    prev: "← PREVIOUS",
    next: "NEXT →",
    ctaPrefix: "Build",
    ctaSuffix: "with ARDLABS.",
    ctaBody: "Tell us what you're trying to build. We'll tell you how we'd approach it.",
    startConversation: "Start a conversation",
    startProject: "Start a project",
    home: "← Home",
  },
};

export type Content = typeof en;

/* ---------- French overrides (text only; neutral fields inherit) ---------- */
const fr: DeepPartial<Content> = {
  nav: [
    { label: "Manifeste" },
    { label: "Cœur IA" },
    { label: "Réseau" },
    { label: "Services" },
    { label: "Contact" },
  ],
  common: {
    engage: "Contact",
    soundOn: "Son activé",
    soundOff: "Son coupé",
    accent: "ACCENT",
    skip: "Aller au contenu",
  },
  hero: {
    eyebrow: "Studio d'ingénierie numérique · Prague",
    headline: "Des idées complexes, transformées en produits précis.",
    subtitle:
      "ARDLABS est un studio d'ingénierie numérique. Nous concevons et développons des logiciels, plateformes et systèmes IA rapides, fiables et soignés jusqu'au détail.",
    explore: "Voir nos projets",
    engage: "Démarrer un projet",
    scroll: "DÉFILER",
    scrollHint: "Le studio, en cinq temps.",
  },
  vision: {
    tag: "ARDLABS.AI · COMPOSITION DE LA VISION",
    lines: ["On ne fait pas que promettre.", "On conçoit — jusqu'au détail,", "et on livre."],
    para: "Chaque projet part d'une question difficile et finit en produit qui tient. Ingénierie pointue, design clair, et le réflexe de livrer.",
  },
  cinematic: {
    tag: "MANIFESTE",
    lines: [
      "La plupart livrent des fonctionnalités.",
      "Nous, des produits.",
      "Design, code et infrastructure —",
      "soignés jusqu'au détail, faits pour durer.",
    ],
    outro: "L'ingénierie numérique, faite correctement.",
  },
  synthesis: {
    eyebrow: "Synthèse vivante",
    title: "Un système, plusieurs formes.",
    intro:
      "Intelligence, réseau, infrastructure — un même effort, recomposé. Cliquez pour transformer le champ ; bougez le curseur pour le perturber.",
    hint: "Cliquez pour transformer · bougez pour perturber",
    shapes: ["Cœur", "Réseau", "Continuum", "Treillis"],
  },
  core: {
    eyebrow: "Cœur IA interactif",
    title: "L'intelligence, mise au travail.",
    intro:
      "Bougez le curseur — le champ réagit. Comme l'IA et l'automatisation qu'on construit réagissent aux opérations réelles.",
    points: [
      { k: "IA appliquée", v: "Modèles et agents branchés sur de vrais workflows, pas des démos." },
      { k: "Automatisation", v: "Automatisation des process qui supprime le travail manuel." },
      { k: "Données", v: "Pipelines et tableaux de bord qui transforment l'opérationnel en décisions." },
    ],
    cta: "Une opération qui devrait tourner comme ça ?",
    ctaButton: "Démarrer un projet",
  },
  network: {
    eyebrow: "Réseau mondial",
    title: "Un studio. Basé à Prague. Au service du monde entier.",
    intro:
      "Nous travaillons avec des fondateurs et des équipes sur tous les fuseaux — async par défaut, précis à la livraison.",
    routesLabel: "Routes connectées",
    returnHint: "Cliquez la mer ou appuyez sur Échap pour revenir",
  },
  industries: {
    eyebrow: "Services",
    title: "Quatre pôles. Un seul standard.",
    intro:
      "L'ingénierie numérique est l'ombrelle. En dessous, quatre pôles couvrent une idée de bout en bout.",
    explore: "EXPLORER →",
    viewAll: "Voir tous les services",
    indexEyebrow: "Quatre pôles.",
    indexIntro:
      "L'ingénierie numérique est l'ombrelle. En dessous, quatre pôles couvrent une idée de bout en bout. Choisissez un pôle.",
    items: [
      {
        title: "Conseil & stratégie",
        blurb:
          "Conseil technologique, R&D et prototypage qui transforment une idée en plan validé.",
        tagline: "La clarté avant le code.",
        overview:
          "Avant la moindre ligne de code, les vraies questions : quoi construire, pourquoi, et comment ça tiendra. Conseil technologique, R&D appliquée et prototypage rapide pour dérisquer l'idée et tracer le chemin vers le produit.",
        capabilities: [
          "Conseil technologique",
          "R&D appliquée",
          "Prototypage produit",
          "Due diligence technique",
          "Planification d'architecture",
          "Feuille de route",
        ],
        approach: [
          { t: "Cadrer", d: "Le vrai problème, les contraintes, le pari." },
          { t: "Explorer", d: "Des prototypes qui testent d'abord les hypothèses les plus risquées." },
          { t: "Planifier", d: "Une architecture et une feuille de route exploitables." },
          { t: "Transmettre", d: "Un plan que l'équipe de build exécute sans deviner." },
        ],
        metrics: [
          { value: "Semaine 1", label: "Premier prototype" },
          { value: "Périmètre fixe", label: "Livrables clairs" },
          { value: "À vous", label: "Code & docs" },
        ],
        deliverables: [
          "Un énoncé écrit du problème et des contraintes qui le cadrent",
          "Un prototype fonctionnel qui teste les hypothèses les plus risquées",
          "Une architecture cible avec les arbitrages clés explicités",
          "Une feuille de route par phases : périmètre, séquence et effort estimé",
          "Une note de due diligence ou de faisabilité technique si nécessaire",
          "Une passation claire que l'équipe de build peut exécuter",
        ],
        engagement: [
          { t: "Sprint de cadrage", d: "Un engagement court et fixe pour cadrer le problème et révéler les vrais risques." },
          { t: "Prototyper & valider", d: "On construit le plus petit élément qui prouve ou écarte l'hypothèse la plus risquée." },
          { t: "Planifier & transmettre", d: "Architecture, feuille de route et docs — prêts à construire, avec ou sans nous." },
        ],
        stack: ["Figma", "TypeScript", "Next.js", "Python", "Notebooks", "Excalidraw"],
      },
      {
        title: "Conception & développement",
        blurb:
          "Logiciels sur mesure, web, mobile, SaaS et plateformes internes — conçus et développés de bout en bout.",
        tagline: "Soigné jusqu'au détail.",
        overview:
          "Le cœur du studio. Nous concevons et développons des logiciels sur mesure — web, mobile, SaaS, plateformes et systèmes internes — avec des interfaces claires et un code qui reste rapide, sûr et lisible des années durant.",
        capabilities: [
          "Logiciels sur mesure",
          "Web & mobile",
          "SaaS & plateformes",
          "Systèmes internes",
          "Design UI/UX",
          "Design systems",
        ],
        approach: [
          { t: "Concevoir", d: "Des interfaces évidentes avant d'être belles." },
          { t: "Construire", d: "Une petite équipe rapide qui livre en continu." },
          { t: "Durcir", d: "Testé, instrumenté et sécurisé avant la mise en ligne." },
          { t: "Maintenir", d: "Ça continue de fonctionner bien après le lancement." },
        ],
        metrics: [
          { value: "Bout en bout", label: "Design + dév" },
          { value: "Production", label: "Pas que des protos" },
          { value: "Maintenu", label: "Au-delà du lancement" },
        ],
        deliverables: [
          "Une application en production — web, mobile ou les deux",
          "Un design system et une bibliothèque de composants réutilisables",
          "Un code documenté et testé, dont vous êtes pleinement propriétaire",
          "Des pipelines CI/CD et des environnements prêts pour des releases répétables",
          "Une documentation d'onboarding et une passation structurée à votre équipe",
          "Une fenêtre de support convenue après le lancement",
        ],
        engagement: [
          { t: "Cadrage & design", d: "On aligne le périmètre et on livre les parcours clés sous forme de design cliquable et validé." },
          { t: "Build à périmètre fixe", d: "Une petite équipe senior livre du code de production par incréments courts et relisibles." },
          { t: "Lancement & support", d: "On durcit, on livre, on transmet et on reste disponible pour une fenêtre de support convenue." },
        ],
        stack: ["React", "Next.js", "TypeScript", "Tailwind", "Figma", "Three.js"],
      },
      {
        title: "Données & IA",
        blurb:
          "IA, automatisation intelligente, solutions data et tableaux de bord qui transforment l'opérationnel en décisions.",
        tagline: "Des opérations enfin lisibles.",
        overview:
          "Nous mettons la donnée et l'IA là où elles rapportent : automatisation intelligente, automatisation des process (workflow, RPA), pipelines de données et les tableaux de bord et outils métier qui transforment l'opérationnel en décisions.",
        capabilities: [
          "IA appliquée",
          "Automatisation par IA",
          "Automatisation des process (RPA)",
          "Solutions data",
          "Tableaux de bord & BI",
          "Outils métier",
        ],
        approach: [
          { t: "Cartographier", d: "Où sont vraiment le travail manuel et la donnée." },
          { t: "Automatiser", d: "Pipelines et agents qui absorbent la charge répétitive." },
          { t: "Révéler", d: "Des tableaux de bord qui rendent l'état des choses évident." },
          { t: "Améliorer", d: "Des systèmes qui s'affinent en tournant." },
        ],
        metrics: [
          { value: "Moins de manuel", label: "Travail supprimé" },
          { value: "En direct", label: "Tableaux de bord" },
          { value: "Décisions", label: "À partir des données" },
        ],
        deliverables: [
          "Des workflows cartographiés et une vue claire de l'emplacement des données",
          "Des pipelines de données qui consolident des sources éparses",
          "Des automatisations ou agents branchés sur de vrais workflows",
          "Des tableaux de bord et outils métier en direct pour ceux qui pilotent les opérations",
          "Évaluation et garde-fous pour toute IA dans la boucle",
          "Documentation et passation pour que le système reste maintenable",
        ],
        engagement: [
          { t: "Cartographier l'opération", d: "On trace où sont vraiment le travail manuel et la donnée avant de toucher à quoi que ce soit." },
          { t: "Automatiser & révéler", d: "On construit les pipelines, automatisations et tableaux de bord qui suppriment la corvée." },
          { t: "Mesurer & améliorer", d: "On instrumente ce qu'on livre pour qu'on puisse le vérifier, lui faire confiance et l'affiner." },
        ],
        stack: ["Python", "TensorFlow", "OpenAI", "CUDA", "Postgres", "dbt"],
      },
      {
        title: "Cloud & infrastructure",
        blurb:
          "Architecture cloud, déploiement, APIs et intégrations pensés pour la disponibilité et l'échelle.",
        tagline: "Des fondations qui tiennent.",
        overview:
          "Un logiciel ne vaut que ce sur quoi il tourne. Nous architecturons l'infrastructure cloud, mettons en place déploiement et observabilité, et construisons les APIs et intégrations qui relient vos systèmes — pensés pour la disponibilité et l'échelle.",
        capabilities: [
          "Architecture cloud",
          "Infrastructure & déploiement",
          "APIs & intégrations",
          "Pipelines CI/CD",
          "Observabilité & SRE",
          "Sécurité & conformité",
        ],
        approach: [
          { t: "Architecturer", d: "Une infra dimensionnée pour la charge réelle." },
          { t: "Déployer", d: "Des pipelines répétables, aucune release manuelle." },
          { t: "Observer", d: "Vous voyez ce qui se passe en production." },
          { t: "Scaler", d: "Ça grandit sans réécriture." },
        ],
        metrics: [
          { value: "Disponibilité", label: "Pensé pour" },
          { value: "Automatisés", label: "Déploiements" },
          { value: "Connecté", label: "APIs & systèmes" },
        ],
        deliverables: [
          "Une architecture cloud dimensionnée pour la charge réelle",
          "Une infrastructure définie en code, reproductible entre environnements",
          "Des pipelines CI/CD qui remplacent les releases manuelles",
          "De l'observabilité — logs, métriques et alertes réellement lisibles",
          "Des APIs et intégrations qui relient vos systèmes",
          "Une base de sécurité et de conformité, documentée",
        ],
        engagement: [
          { t: "Architecturer", d: "On conçoit l'infrastructure et le modèle de déploiement autour de votre charge réelle." },
          { t: "Construire & automatiser", d: "Infrastructure as code, CI/CD et observabilité, posés une fois et répétables." },
          { t: "Exploiter & scaler", d: "On transmet un système exploitable — qui grandit sans réécriture." },
        ],
        stack: ["AWS", "Docker", "Kubernetes", "Terraform", "Rust", "GitHub Actions"],
      },
    ],
  },
  capabilities: {
    items: [
      {
        tag: "Données & IA",
        title: "L'intelligence, mise au travail.",
        text: "Modèles, agents et pipelines branchés sur de vrais workflows. IA appliquée et automatisation qui suppriment le travail manuel et rendent l'opérationnel lisible.",
        chips: ["IA appliquée", "Automatisation", "Pipelines data"],
      },
      {
        tag: "Conception & développement",
        title: "Du code qui livre des produits.",
        text: "Web, mobile, SaaS et plateformes, conçus et développés de bout en bout. Des interfaces claires et un code qui reste rapide, sûr et lisible des années durant.",
        chips: ["Web & mobile", "SaaS & plateformes", "Design systems"],
      },
      {
        tag: "Conseil & stratégie",
        title: "La clarté avant le code.",
        text: "Conseil technologique, R&D appliquée et prototypage rapide. On dérisque l'idée et on la transforme en architecture et feuille de route exploitables.",
        chips: ["Conseil", "R&D", "Prototypage"],
      },
      {
        tag: "Cloud & infrastructure",
        title: "Des fondations qui tiennent.",
        text: "Architecture cloud, déploiement et observabilité, plus les APIs et intégrations qui relient vos systèmes — pensés pour la disponibilité et l'échelle.",
        chips: ["Cloud", "CI/CD", "APIs & intégrations"],
      },
    ],
  },
  research: {
    eyebrow: "Laboratoire de recherche",
    title: "Entrez dans l'appareil.",
    intro:
      "Instruments flottants, affichages holographiques et un cœur auto-rotatif — un modèle vivant de la convergence entre intelligence, données et matière.",
    readouts: [
      { k: "STATUT", v: "Opérationnel" },
      { k: "ENTITÉS", v: "Holographiques" },
      { k: "ACCÈS", v: "Restreint" },
    ],
  },
  stack: {
    eyebrow: "Stack technologique",
    title: "Les instruments derrière le travail.",
    intro: "Un ensemble d'outils volontairement restreint, maîtrisé totalement — du métal au modèle.",
    marquee: ["Ingénierie", "Intelligence", "Infrastructure", "Vélocité", "Précision"],
  },
  stats: {
    items: [
      { value: "2019", label: "Fondé" },
      { value: "Prague", label: "Basé à" },
      { value: "EN / FR", label: "Bilingue" },
      { value: "À distance", label: "Partout dans le monde" },
    ],
  },
  timeline: {
    eyebrow: "Frise du studio",
    title: "L'histoire du studio.",
    items: [
      { title: "Fondation", text: "ARDLABS est fondé à Prague comme studio d'ingénierie numérique avec une seule conviction : concevoir et développer des logiciels qui tiennent." },
      { title: "L'équipe", text: "Le studio devient une équipe senior de designers et d'ingénieurs, livrant des produits web, mobile et SaaS de bout en bout." },
      { title: "Données & IA", text: "Nous nous étendons à l'IA appliquée, l'automatisation et la donnée — modèles et tableaux de bord mis au travail dans de vraies opérations." },
      { title: "Cloud & échelle", text: "L'architecture cloud et l'infrastructure deviennent un pôle à part entière, pensé pour la disponibilité et la croissance." },
      { title: "Quatre pôles", text: "Stratégie, conception & développement, données & IA et cloud opèrent en une seule équipe, de la question au produit." },
    ],
  },
  projects: {
    eyebrow: "Projets sélectionnés",
    title: "Un aperçu du travail.",
    intro: "Quelques projets illustratifs à travers les quatre pôles. Ouvrez-en un.",
    open: "OUVRIR →",
    classified: "TRAVAUX SÉLECTIONNÉS",
    requestBriefing: "Demander un briefing",
    items: [
      {
        field: "Données & IA",
        text: "Un moteur d'aide à la décision par IA pour les équipes ops qui ne peuvent pas se tromper.",
        detail:
          "Helix Core planifie, agit, audite sa propre sortie et escalade vers l'humain quand la confiance chute sous le seuil — un assistant fiable pour les décisions opérationnelles à enjeux.",
        highlights: ["Raisonnement auto-audité", "Décisions temps réel", "Voies d'escalade humaine"],
        stage: "Livré · En production",
      },
      {
        field: "Plateforme SaaS",
        text: "Un tableau de bord SaaS logistique qui transforme des données éparses en décisions en direct.",
        detail:
          "Tideglass fusionne suivi, planification et données de coût en un modèle vivant de l'opération, puis planifie les routes pour l'équilibre optimal entre temps, coût et fiabilité.",
        highlights: ["Modèle d'opération en direct", "Optimisation des routes", "Conscient des coûts"],
        stage: "Livré · En croissance",
      },
      {
        field: "Outillage interne",
        text: "Un tableau de bord d'opérations de production qui rend un atelier lisible.",
        detail:
          "Foundry remonte les signaux des systèmes de ligne existants en une couche de données opérationnelles, puis révèle débit, anomalies et goulots en temps réel — avec une maintenance prédictive pour anticiper les arrêts.",
        highlights: ["Tableau de bord temps réel", "Couche de données opérationnelles", "Maintenance prédictive"],
        stage: "Livré · En production",
      },
      {
        field: "Plateforme",
        text: "Un runtime distribué pour la prochaine génération d'applications à latence minimale.",
        detail:
          "Continuum est un runtime distribué qui place le calcul à la périphérie, au plus près de l'utilisateur. Il propulse des applications qui paraissent instantanées, avec une expérience développeur aussi simple qu'un déploiement sur une seule machine.",
        highlights: ["Runtime natif edge", "Latence minimale", "Déploiement mono-binaire"],
        stage: "Livré · En production",
      },
    ],
  },
  workflow: {
    eyebrow: "Le système",
    title: "Concevez la logique à grande échelle.",
    intro:
      "Concevez, déployez et orchestrez des workflows d'IA sophistiqués depuis un seul canevas visuel — agents, outils et code, composés sans friction.",
  },
  telemetry: {
    eyebrow: "Télémétrie",
    title: "Optimisé pour la performance.",
    intro:
      "Chaque signal, surveillé en temps réel — précision des agents, latence serveur et efficacité des tokens, lus comme des instruments.",
  },
  bento: {
    eyebrow: "Pourquoi ARDLABS",
    title: "Construits différemment, volontairement.",
    cells: [
      { title: "De bout en bout", body: "Stratégie, design, build et infrastructure — quatre pôles, une seule équipe." },
      { title: "Équipe senior", body: "De petites équipes d'ingénieurs qui construisent." },
      { title: "Prague · monde entier", body: "Basés à Prague, au service d'équipes sur tous les fuseaux — async par défaut." },
      { title: "Fiable par défaut", body: "Des systèmes conçus pour qu'on s'y appuie, pas pour impressionner en démo." },
      { title: "Soigné jusqu'au détail", body: "Rapide, sûr, lisible — et maintenu bien après le lancement." },
      { title: "Un seul standard", body: "Des disciplines distinctes, une même rigueur d'ingénierie." },
    ],
  },
  partners: {
    eyebrow: "Réseau",
    title: "Aux côtés d'un réseau privé.",
    note: "Partenaires représentatifs — à remplacer par les vôtres.",
    items: [
      "Vltava Systems · Prague, CZ",
      "Triglav Robotics · Ljubljana, SI",
      "Adriatic Marine · Koper, SI",
      "Bohemia AI · Brno, CZ",
      "Tatra Industrial · Bratislava, SK",
      "Helvetia Capital · Genève, CH",
      "Danube Compute · Vienne, AT",
      "Lagoon Data · Singapour, SG",
    ],
  },
  testimonials: {
    eyebrow: "Recommandations",
    title: "Ce que disent nos partenaires.",
    note: "Citations représentatives — à remplacer par les vôtres.",
    items: [
      { quote: "ARDLABS ne court pas après les démos. Ils livrent des logiciels sur lesquels on s'appuie pendant des années.", author: "Responsable produit", role: "Éditeur SaaS" },
      { quote: "L'équipe rare qui traite la fiabilité comme la fonctionnalité, pas comme un détail.", author: "Directeur technique", role: "Scale-up" },
      { quote: "Ils conçoivent en silence et les résultats continuent simplement de fonctionner.", author: "Fondateur", role: "Startup" },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Vos questions, nos réponses.",
    items: [
      { q: "Comment cadrez-vous un projet ?", a: "Chaque projet débute en cadrant le vrai problème et les contraintes — puis un prototype qui teste les hypothèses les plus risquées avant de s'engager dans un build." },
      { q: "Avec qui travaillez-vous ?", a: "Des fondateurs, des équipes produit et des opérateurs qui tiennent à un logiciel qui dure. Nous prenons un petit nombre de projets à la fois." },
      { q: "Où êtes-vous basés ?", a: "Basés à Prague, au service du monde entier — async par défaut et précis à la livraison, sur tous les fuseaux." },
      { q: "Votre travail est-il public ?", a: "Une partie est sous NDA. Ce que vous voyez ici est une fenêtre choisie sur notre façon de penser et de construire." },
    ],
  },
  cta: {
    eyebrow: "Engager",
    title: "Un projet à construire correctement ?",
    body: "Nous prenons un petit nombre de projets à la fois, pour des équipes qui tiennent à un logiciel qui dure. Dites-nous ce que vous voulez construire.",
    button: "Démarrer la conversation",
  },
  contact: {
    eyebrow: "Contact · 04",
    title: "Construisons-le.",
    intro:
      "Nous prenons un petit nombre de projets à la fois. Dites-nous ce que vous construisez — on vous dira comment on l'aborderait.",
    name: "Nom",
    namePlaceholder: "Ada Lovelace",
    email: "Email",
    emailPlaceholder: "vous@entreprise.com",
    domain: "Domaine",
    domains: ["Conseil & stratégie", "Conception & développement", "Données & IA", "Cloud & infrastructure"],
    message: "Message",
    messagePlaceholder: "Que construisez-vous ?",
    transmit: "Transmettre",
    transmitting: "Transmission…",
    sentTitle: "Transmission reçue.",
    sentBody: "Merci — votre message est en route vers notre équipe. Nous répondons à chaque signal qui le mérite.",
    sendAnother: "Envoyer un autre",
    errorPrefix: "Échec de l'envoi — écrivez à",
    step: "Vous êtes ici · 04 / 04",
    copyHint: "Cliquer pour copier",
    copied: "Email copié",
  },
  footer: {
    tagline: "Un studio d'ingénierie numérique qui conçoit et développe logiciels, plateformes et systèmes IA, soignés jusqu'au détail.",
    index: "Index",
    contact: "Contact",
    copyHint: "Cliquer pour copier",
    copied: "Email copié",
    insights: "Perspectives",
    legalNotice: "Mentions légales",
    privacy: "Confidentialité",
    terms: "Conditions",
    rights: "Tous droits réservés.",
    press: "Appuyez sur",
    allSystems: "Tous les systèmes opérationnels",
  },
  industry: {
    all: "← Tous les services",
    label: "Service",
    overview: "Vue d'ensemble",
    capabilities: "Capacités",
    howWeOperate: "Notre façon d'opérer.",
    deliverables: "Ce que vous obtenez",
    deliverablesIntro: "Des artefacts concrets que vous gardez — pas des slides.",
    engagement: "Comment on s'engage",
    engagementIntro: "Un chemin simple, à périmètre fixe, de la question au livré.",
    stack: "Stack typique",
    stackIntro: "Un ensemble d'outils volontairement restreint, pour ce pôle.",
    relatedWork: "Projets liés",
    relatedWorkIntro: "Projets représentatifs qui montrent ce pôle en pratique.",
    viewCase: "Voir l'étude de cas",
    prev: "← PRÉCÉDENT",
    next: "SUIVANT →",
    ctaPrefix: "Construire",
    ctaSuffix: "avec ARDLABS.",
    ctaBody: "Dites-nous ce que vous voulez construire. On vous dira comment on l'aborderait.",
    startConversation: "Démarrer une conversation",
    startProject: "Démarrer un projet",
    home: "← Accueil",
  },
};

/* ---------- deep merge (FR text over EN base, arrays by index) ---------- */
type DeepPartial<T> = T extends (infer U)[]
  ? DeepPartial<U>[]
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

function merge<T>(base: T, over: any): T {
  if (Array.isArray(base)) {
    return base.map((b, i) => (over && over[i] !== undefined ? merge(b, over[i]) : b)) as any;
  }
  if (base && typeof base === "object") {
    const out: any = { ...base };
    if (over) for (const k of Object.keys(over)) out[k] = merge((base as any)[k], over[k]);
    return out;
  }
  return over !== undefined ? over : base;
}

export const CONTENT: Record<Lang, Content> = {
  en,
  fr: merge(en, fr),
};

/** Reactive localized content for the current language. */
export function useContent(): Content {
  const lang = useLang();
  return CONTENT[lang];
}
