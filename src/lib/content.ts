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
    { label: "Industries", href: "#industries" },
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
    eyebrow: "Private Ventures · Est. 2019",
    subtitle:
      "A laboratory of the future — engineering artificial intelligence, software, automation and physical infrastructure for the long term.",
    explore: "Explore the lab",
    engage: "Engage ARDLABS",
    scroll: "SCROLL",
  },
  vision: {
    tag: "ARDLABS.AI · COMPOSING VISION",
    lines: ["We do not predict the future.", "We engineer it — privately,", "with a long horizon."],
    para: "Every venture begins as a hypothesis and ends as infrastructure. We hold the rare positions — patient capital, deep engineering and a long-term view.",
  },
  cinematic: {
    tag: "MANIFESTO",
    lines: [
      "Most companies optimise quarters.",
      "We compound decades.",
      "Intelligence, infrastructure, and patience —",
      "engineered into one operating system.",
    ],
    outro: "This is the laboratory of the future.",
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
    title: "A living intelligence, wired from first principles.",
    intro:
      "Neurons firing in real time. Move your cursor — the lattice responds, the way our systems respond to the world.",
    points: [
      { k: "Reasoning", v: "Autonomous agents that plan, act and self-correct." },
      { k: "Scale", v: "GPU clusters orchestrated for frontier-model training." },
      { k: "Deployment", v: "Inference engineered for production, not demos." },
    ],
  },
  network: {
    eyebrow: "Global Network",
    title: "One operating fabric. Six anchors. Every timezone.",
    intro:
      "Data, capital and talent move continuously between our hubs — routed, optimised and secured in real time.",
  },
  industries: {
    eyebrow: "Industries",
    title: "Six universes. One laboratory.",
    intro:
      "Each venture runs as its own world — distinct teams, distinct physics, a shared standard of engineering.",
    explore: "EXPLORE →",
    viewAll: "View all six industries",
    indexEyebrow: "Six universes.",
    indexIntro:
      "Each venture runs as its own world — distinct teams, distinct physics, a shared standard of engineering. Choose a domain.",
    items: [
      {
        id: "ai",
        index: "01",
        accent: "#5b8cff",
        motif: "ai" as MotifVariant,
        title: "Artificial Intelligence",
        blurb:
          "Frontier models, autonomous agents and GPU-scale reasoning systems engineered for real-world deployment.",
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
          { value: "Frontier", label: "Model research" },
          { value: "Real-time", label: "Inference" },
          { value: "24/7", label: "Autonomous operation" },
        ],
      },
      {
        id: "software",
        index: "02",
        accent: "#7af2e0",
        motif: "code" as MotifVariant,
        title: "Software Development",
        blurb:
          "Mission-critical platforms, real-time systems and developer infrastructure built to outlast a decade.",
        tagline: "Code that compiles the future.",
        overview:
          "Software is the substrate of every venture we run. We write mission-critical platforms, real-time systems and developer infrastructure with a single bias: longevity. Code that is fast today and still legible, secure and extensible a decade from now.",
        capabilities: [
          "Distributed real-time systems",
          "Developer platforms & SDKs",
          "Edge & latency-minimal runtimes",
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
          { value: "Resilient", label: "Architecture" },
          { value: "Edge", label: "Distribution" },
          { value: "∞", label: "Scale" },
        ],
      },
      {
        id: "automation",
        index: "03",
        accent: "#b98cff",
        motif: "ai" as MotifVariant,
        title: "Automation",
        blurb:
          "Self-orchestrating pipelines that turn manual operations into measurable, compounding leverage.",
        tagline: "Leverage that compounds.",
        overview:
          "Every manual operation is latent leverage. We design self-orchestrating pipelines that absorb repetitive work and convert it into measurable, compounding output — freeing teams to do only what humans should.",
        capabilities: [
          "Process intelligence & mapping",
          "Workflow orchestration engines",
          "Robotic process automation",
          "Event-driven pipelines",
          "Human-in-the-loop controls",
          "Outcome instrumentation",
        ],
        approach: [
          { t: "Map", d: "Every operation observed, measured and modelled." },
          { t: "Orchestrate", d: "Pipelines that route work without supervision." },
          { t: "Verify", d: "Human checkpoints where stakes demand them." },
          { t: "Multiply", d: "Output that compounds as the system learns." },
        ],
        metrics: [
          { value: "Hands-off", label: "Orchestration" },
          { value: "Compounding", label: "Output" },
          { value: "Zero", label: "Dropped tasks" },
        ],
      },
      {
        id: "industrial",
        index: "04",
        accent: "#ff8c5b",
        motif: "industrial" as MotifVariant,
        title: "Industrial Services",
        blurb:
          "Robotics, precision manufacturing and instrumented factories where atoms meet algorithms.",
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
          { value: "Precision", label: "Manufacturing" },
          { value: "Predictive", label: "Maintenance" },
          { value: "Full", label: "Traceability" },
        ],
      },
      {
        id: "strategy",
        index: "05",
        accent: "#ffd15b",
        motif: "ai" as MotifVariant,
        title: "Strategic Development",
        blurb:
          "Capital, structure and long-horizon strategy for ventures designed to define their category.",
        tagline: "Built to define a category.",
        overview:
          "Some ventures are built to compete; ours are built to define. We bring patient capital, deliberate structure and a long-term horizon to a small number of ventures — and engineer them to own their category.",
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
          { value: "Patient", label: "Capital" },
          { value: "Long-horizon", label: "Planning" },
          { value: "Hands-on", label: "Partnership" },
        ],
      },
      {
        id: "maritime",
        index: "06",
        accent: "#5be0ff",
        motif: "ocean" as MotifVariant,
        title: "Maritime Operations",
        blurb:
          "Fleet intelligence, route optimisation and ocean logistics navigated by data, not instinct.",
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
          { value: "Live", label: "Fleet tracking" },
          { value: "Optimised", label: "Routing" },
          { value: "Global", label: "Logistics" },
        ],
      },
    ],
  },
  capabilities: {
    items: [
      {
        n: "05",
        tag: "Artificial Intelligence",
        title: "A facility for thinking machines.",
        text: "Server halls, holographic readouts and floating code. Neural networks visualised at GPU scale — intelligence you can watch reason.",
        variant: "ai" as MotifVariant,
        chips: ["Neural networks", "GPU clusters", "Inference"],
      },
      {
        n: "06",
        tag: "Software",
        title: "Code that compiles the future.",
        text: "Streaming pipelines, floating windows, live compilations. Algorithms rendered in real time — every commit a moving part of a larger machine.",
        variant: "code" as MotifVariant,
        chips: ["Real-time systems", "Distributed runtime", "Edge"],
      },
      {
        n: "07",
        tag: "Industrial",
        title: "Where atoms meet algorithms.",
        text: "Robotic arms, instrumented factories, metal and sparks. Precision manufacturing governed by the same intelligence that runs our software.",
        variant: "industrial" as MotifVariant,
        chips: ["Robotics", "Precision", "Telemetry"],
      },
      {
        n: "08",
        tag: "Maritime Operations",
        title: "An ocean, read like a dataset.",
        text: "Simulated seas, cargo routes, radar and GPS. Fleet intelligence that turns the unpredictable ocean into an optimised, navigable system.",
        variant: "ocean" as MotifVariant,
        chips: ["Fleet AI", "Routing", "Logistics"],
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
      { value: 6, suffix: "", decimals: 0, prefix: "", label: "Continents engaged" },
      { value: 100, suffix: "%", decimals: 0, prefix: "", label: "Privately held" },
      { value: 2019, suffix: "", decimals: 0, prefix: "", label: "Engineering since" },
      { value: 24, suffix: "/7", decimals: 0, prefix: "", label: "Always operational" },
    ],
  },
  timeline: {
    eyebrow: "Innovation Timeline",
    title: "A trajectory measured in decades.",
    items: [
      { year: "2019", title: "Genesis", text: "ARDLABS is founded as a private engineering studio with a single conviction: build the future before it is named." },
      { year: "2021", title: "Intelligence", text: "First in-house neural architectures reach production, powering autonomous decision systems across ventures." },
      { year: "2023", title: "Expansion", text: "Operations span multiple continents. Industrial robotics and maritime intelligence join the portfolio." },
      { year: "2025", title: "Convergence", text: "AI, software and physical infrastructure merge into a single, self-improving operating fabric." },
      { year: "2027", title: "Horizon", text: "Autonomous ventures that design, fund and operate themselves — engineered, governed and owned privately." },
    ],
  },
  projects: {
    eyebrow: "Future Projects",
    title: "Engineered behind closed doors.",
    intro: "A glimpse of ventures currently under construction inside the lab. Open one.",
    open: "OPEN →",
    classified: "CLASSIFIED · IN DEVELOPMENT",
    requestBriefing: "Request a briefing",
    items: [
      {
        code: "PRJ—AX9",
        name: "Helix Core",
        field: "Artificial Intelligence",
        text: "A self-supervising reasoning engine for high-stakes decision environments.",
        detail:
          "Helix Core is an autonomous reasoning engine designed for environments where a wrong call is unacceptable. It plans, acts, audits its own reasoning and escalates to humans when confidence drops below threshold.",
        highlights: ["Self-auditing reasoning", "Real-time decisions", "Human escalation paths"],
        stage: "Concept · In development",
      },
      {
        code: "PRJ—M12",
        name: "Tideglass",
        field: "Maritime Operations",
        text: "Real-time fleet intelligence for global shipping lanes.",
        detail:
          "Tideglass fuses radar, AIS, weather and market data into a single live model of the ocean, then routes fleets for the optimal balance of time, fuel and emissions.",
        highlights: ["Live fleet model", "Route optimisation", "Emissions-aware"],
        stage: "Prototype",
      },
      {
        code: "PRJ—R04",
        name: "Foundry",
        field: "Industrial Services",
        text: "Instrumented micro-factories that reconfigure themselves around demand.",
        detail:
          "Foundry is a blueprint for micro-factories that sense demand and physically reconfigure their production lines to meet it — robotic cells, digital twins and predictive maintenance governed by the same intelligence that runs our software.",
        highlights: ["Self-reconfiguring lines", "Digital twin", "Predictive upkeep"],
        stage: "Prototype",
      },
      {
        code: "PRJ—S77",
        name: "Continuum",
        field: "Software",
        text: "A distributed runtime for the next generation of latency-minimal applications.",
        detail:
          "Continuum is a distributed runtime that places computation at the edge, close to the user. It powers applications that feel instantaneous, with a developer experience as simple as deploying to a single machine.",
        highlights: ["Edge-native runtime", "Latency-minimal", "Single-binary deploy"],
        stage: "Concept",
      },
    ],
  },
  workflow: {
    eyebrow: "The system",
    title: "Build logic at scale.",
    intro:
      "Design, deploy and orchestrate sophisticated AI workflows through one visual fabric — agents, tools and code, composed without friction.",
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
      { title: "Patient capital", body: "We hold ventures for the long term — engineered to compound over years, not optimised for an exit." },
      { title: "Senior bench", body: "Small teams of principals who build." },
      { title: "Six hubs · every timezone", body: "Work follows the sun across Prague, Geneva, Singapore, Dubai, Tokyo and New York." },
      { title: "Load-bearing by default", body: "Systems engineered to be relied upon, not to impress in a demo." },
      { title: "Private by design", body: "We build quietly and own what we create." },
      { title: "One standard", body: "Distinct worlds, a shared rigor of engineering." },
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
      { quote: "ARDLABS doesn't chase demos. They ship systems we can build a decade on.", author: "Operating Partner", role: "Infrastructure Fund" },
      { quote: "The rare team that treats dependability as the feature, not an afterthought.", author: "Chief Technology Officer", role: "Industrial Group" },
      { quote: "They engineer quietly and let the results compound.", author: "Managing Director", role: "Family Office" },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Questions, answered.",
    items: [
      { q: "How do you choose what to build?", a: "Every venture begins as a sharp, falsifiable thesis about how an industry will change — and what has to be built for that change to become inevitable." },
      { q: "Do you work with outside partners?", a: "Selectively — with founders, operators and institutions aligned on a long horizon. We partner with a small number of people at a time." },
      { q: "Where are you based?", a: "A distributed fabric across six hubs — Prague, Geneva, Singapore, Dubai, Tokyo and New York — operating in every timezone." },
      { q: "Is your work public?", a: "Most of it is private by design. What you see here is a curated window onto how we think and build." },
    ],
  },
  cta: {
    eyebrow: "Engage",
    title: "Have a problem worth a decade?",
    body: "We partner with a small number of people building things that should exist. Tell us what you're trying to make inevitable.",
    button: "Start a conversation",
  },
  contact: {
    eyebrow: "Contact · 04",
    title: "Let's build the improbable.",
    intro:
      "We partner with a small number of founders, operators and institutions. Tell us what you're trying to make inevitable.",
    name: "Name",
    namePlaceholder: "Ada Lovelace",
    email: "Email",
    emailPlaceholder: "you@company.com",
    domain: "Domain",
    domains: ["AI", "Software", "Automation", "Industrial", "Strategy", "Maritime"],
    message: "Message",
    messagePlaceholder: "What are you building?",
    transmit: "Transmit",
    transmitting: "Transmitting…",
    sentTitle: "Transmission received.",
    sentBody: "Thank you — your message is on its way to our team. We respond to every signal worth answering.",
    sendAnother: "Send another",
    errorPrefix: "Couldn't send — please email",
  },
  footer: {
    tagline: "Private ventures engineering the next century of intelligence, software and physical infrastructure.",
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
    all: "← All industries",
    label: "Industry",
    overview: "Overview",
    capabilities: "Capabilities",
    howWeOperate: "How we operate.",
    prev: "← PREVIOUS",
    next: "NEXT →",
    ctaPrefix: "Build",
    ctaSuffix: "with ARDLABS.",
    startConversation: "Start a conversation",
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
    { label: "Industries" },
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
    eyebrow: "Private Ventures · Depuis 2019",
    subtitle:
      "Un laboratoire du futur — qui conçoit l'intelligence artificielle, le logiciel, l'automatisation et l'infrastructure physique sur le long terme.",
    explore: "Explorer le labo",
    engage: "Contacter ARDLABS",
    scroll: "DÉFILER",
  },
  vision: {
    tag: "ARDLABS.AI · COMPOSITION DE LA VISION",
    lines: ["Nous ne prédisons pas le futur.", "Nous le concevons — en privé,", "avec un horizon long."],
    para: "Chaque projet débute comme une hypothèse et finit comme une infrastructure. Nous occupons des positions rares — capital patient, ingénierie de pointe et vision de long terme.",
  },
  cinematic: {
    tag: "MANIFESTE",
    lines: [
      "La plupart des entreprises optimisent des trimestres.",
      "Nous composons des décennies.",
      "Intelligence, infrastructure et patience —",
      "réunies en un seul système d'exploitation.",
    ],
    outro: "Voici le laboratoire du futur.",
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
    title: "Une intelligence vivante, conçue depuis les premiers principes.",
    intro:
      "Des neurones qui s'activent en temps réel. Bougez le curseur — le réseau réagit, comme nos systèmes réagissent au monde.",
    points: [
      { k: "Raisonnement", v: "Des agents autonomes qui planifient, agissent et se corrigent." },
      { k: "Échelle", v: "Des clusters GPU orchestrés pour l'entraînement de modèles de pointe." },
      { k: "Déploiement", v: "De l'inférence conçue pour la production, pas pour la démo." },
    ],
  },
  network: {
    eyebrow: "Réseau mondial",
    title: "Un tissu opérationnel. Six ancrages. Tous les fuseaux.",
    intro:
      "Données, capital et talents circulent en continu entre nos hubs — routés, optimisés et sécurisés en temps réel.",
  },
  industries: {
    eyebrow: "Industries",
    title: "Six univers. Un laboratoire.",
    intro:
      "Chaque activité fonctionne comme son propre monde — des équipes distinctes, une physique distincte, un même standard d'ingénierie.",
    explore: "EXPLORER →",
    viewAll: "Voir les six industries",
    indexEyebrow: "Six univers.",
    indexIntro:
      "Chaque activité fonctionne comme son propre monde — des équipes distinctes, une physique distincte, un même standard d'ingénierie. Choisissez un domaine.",
    items: [
      {
        title: "Intelligence Artificielle",
        blurb:
          "Modèles de pointe, agents autonomes et systèmes de raisonnement à l'échelle GPU, conçus pour le déploiement réel.",
        tagline: "L'intelligence, conçue.",
        overview:
          "Nous concevons l'intelligence artificielle comme d'autres bâtissent l'infrastructure — pour qu'elle soit porteuse. De la recherche sur les modèles de pointe aux agents autonomes qui planifient, agissent et se corrigent, nos systèmes sont conçus pour prendre des décisions à enjeux en production, pas pour impressionner en démo.",
        capabilities: [
          "Entraînement & affinage de modèles de pointe",
          "Systèmes multi-agents autonomes",
          "Inférence temps réel à l'échelle GPU",
          "Pipelines de recherche & raisonnement",
          "Alignement, évaluation & garde-fous",
          "Déploiement sur site & souverain",
        ],
        approach: [
          { t: "Recherche", d: "Architectures inédites validées sur des cas réels." },
          { t: "Ingénierie", d: "Modèles durcis en systèmes fiables et observables." },
          { t: "Déploiement", d: "Inférence optimisée pour la latence, le coût et la disponibilité." },
          { t: "Compounding", d: "Des systèmes qui apprennent du déploiement et s'améliorent." },
        ],
        metrics: [
          { value: "Pointe", label: "Recherche de modèles" },
          { value: "Temps réel", label: "Inférence" },
          { value: "24/7", label: "Opération autonome" },
        ],
      },
      {
        title: "Développement Logiciel",
        blurb:
          "Plateformes critiques, systèmes temps réel et infrastructure développeur bâtis pour durer plus d'une décennie.",
        tagline: "Du code qui compile le futur.",
        overview:
          "Le logiciel est le substrat de chacune de nos activités. Nous écrivons des plateformes critiques, des systèmes temps réel et de l'infrastructure développeur avec un seul biais : la longévité. Du code rapide aujourd'hui et encore lisible, sûr et extensible dans dix ans.",
        capabilities: [
          "Systèmes distribués temps réel",
          "Plateformes & SDK développeur",
          "Runtimes edge à latence minimale",
          "Backends à haute garantie (Rust)",
          "Design systems & expériences web",
          "Observabilité & SRE par défaut",
        ],
        approach: [
          { t: "Architecture", d: "Des systèmes pensés pour la charge de dans cinq ans." },
          { t: "Construction", d: "De petites équipes rapides qui livrent en continu." },
          { t: "Durcissement", d: "Testé, instrumenté et sécurisé avant livraison." },
          { t: "Échelle", d: "Une infrastructure qui grandit sans réécriture." },
        ],
        metrics: [
          { value: "Résilient", label: "Architecture" },
          { value: "Edge", label: "Distribution" },
          { value: "∞", label: "Échelle" },
        ],
      },
      {
        title: "Automatisation",
        blurb:
          "Des pipelines auto-orchestrés qui transforment les opérations manuelles en levier mesurable et cumulatif.",
        tagline: "Un levier qui se cumule.",
        overview:
          "Chaque opération manuelle est un levier latent. Nous concevons des pipelines auto-orchestrés qui absorbent le travail répétitif et le convertissent en production mesurable et cumulative — pour que les équipes ne fassent que ce qui revient aux humains.",
        capabilities: [
          "Intelligence & cartographie des processus",
          "Moteurs d'orchestration de flux",
          "Automatisation robotisée des processus",
          "Pipelines pilotés par événements",
          "Contrôles avec humain dans la boucle",
          "Instrumentation des résultats",
        ],
        approach: [
          { t: "Cartographier", d: "Chaque opération observée, mesurée, modélisée." },
          { t: "Orchestrer", d: "Des pipelines qui routent le travail sans supervision." },
          { t: "Vérifier", d: "Des points de contrôle humains là où les enjeux l'exigent." },
          { t: "Multiplier", d: "Une production qui se cumule à mesure que le système apprend." },
        ],
        metrics: [
          { value: "Sans-main", label: "Orchestration" },
          { value: "Cumulatif", label: "Production" },
          { value: "Zéro", label: "Tâche perdue" },
        ],
      },
      {
        title: "Services Industriels",
        blurb:
          "Robotique, fabrication de précision et usines instrumentées où les atomes rencontrent les algorithmes.",
        tagline: "Où les atomes rencontrent les algorithmes.",
        overview:
          "Nous apportons la discipline du logiciel au monde physique. Robotique, fabrication de précision et usines entièrement instrumentées — où chaque machine reporte, chaque process est mesuré, et la même intelligence qui fait tourner nos logiciels gouverne l'atelier.",
        capabilities: [
          "Robotique & cellules industrielles",
          "Fabrication de précision",
          "Télémétrie & jumeaux numériques",
          "Maintenance prédictive",
          "Vision qualité",
          "Intégration chaîne d'approvisionnement",
        ],
        approach: [
          { t: "Instrumenter", d: "Chaque machine et process rendus observables." },
          { t: "Automatiser", d: "Des cellules robotisées qui se reconfigurent selon la demande." },
          { t: "Prédire", d: "Les pannes anticipées avant l'arrêt de la ligne." },
          { t: "Optimiser", d: "Le débit réglé par les mêmes modèles que l'IA." },
        ],
        metrics: [
          { value: "Précision", label: "Fabrication" },
          { value: "Prédictive", label: "Maintenance" },
          { value: "Totale", label: "Traçabilité" },
        ],
      },
      {
        title: "Développement Stratégique",
        blurb:
          "Capital, structure et stratégie de long horizon pour des projets conçus pour définir leur catégorie.",
        tagline: "Conçu pour définir une catégorie.",
        overview:
          "Certaines activités sont bâties pour concurrencer ; les nôtres sont bâties pour définir. Nous apportons un capital patient, une structure délibérée et un horizon de long terme à un petit nombre de projets — et nous les concevons pour dominer leur catégorie.",
        capabilities: [
          "Déploiement de capital patient",
          "Architecture & structure de venture",
          "Stratégie de marché & de catégorie",
          "Partenariats opérationnels",
          "Fusions-acquisitions & consolidation",
          "Gouvernance & planification long terme",
        ],
        approach: [
          { t: "Sélectionner", d: "Quelques convictions, poursuivies pleinement." },
          { t: "Structurer", d: "Capital et gouvernance conçus pour durer." },
          { t: "Opérer", d: "Un partenariat actif, pas une détention passive." },
          { t: "Durer", d: "Des décisions prises pour des décennies, pas des trimestres." },
        ],
        metrics: [
          { value: "Patient", label: "Capital" },
          { value: "Long terme", label: "Planification" },
          { value: "Actif", label: "Partenariat" },
        ],
      },
      {
        title: "Opérations Maritimes",
        blurb:
          "Intelligence de flotte, optimisation des routes et logistique océanique guidées par la donnée, pas l'instinct.",
        tagline: "Un océan, lu comme un jeu de données.",
        overview:
          "L'océan est le plus grand système non optimisé sur Terre. Nous le naviguons par la donnée — intelligence de flotte, optimisation des routes et logistique qui transforment météo, courants et marchés en un seul modèle navigable.",
        capabilities: [
          "Plateformes d'intelligence de flotte",
          "Optimisation des routes & du carburant",
          "Modélisation météo & courants",
          "Orchestration ports & logistique",
          "Fusion de données radar / GPS",
          "Émissions & conformité",
        ],
        approach: [
          { t: "Percevoir", d: "Radar, GPS, météo et marché fusionnés en direct." },
          { t: "Modéliser", d: "L'océan rendu comme un système optimisable." },
          { t: "Router", d: "Des trajets choisis pour le coût, le temps et les émissions." },
          { t: "Livrer", d: "Du fret acheminé avec prévisibilité, pas avec chance." },
        ],
        metrics: [
          { value: "Live", label: "Suivi de flotte" },
          { value: "Optimisé", label: "Routage" },
          { value: "Mondiale", label: "Logistique" },
        ],
      },
    ],
  },
  capabilities: {
    items: [
      {
        tag: "Intelligence Artificielle",
        title: "Une installation pour machines pensantes.",
        text: "Salles de serveurs, affichages holographiques et code flottant. Des réseaux de neurones visualisés à l'échelle GPU — une intelligence qu'on voit raisonner.",
        chips: ["Réseaux de neurones", "Clusters GPU", "Inférence"],
      },
      {
        tag: "Logiciel",
        title: "Du code qui compile le futur.",
        text: "Pipelines en flux, fenêtres flottantes, compilations en direct. Des algorithmes rendus en temps réel — chaque commit, une pièce mobile d'une machine plus vaste.",
        chips: ["Systèmes temps réel", "Runtime distribué", "Edge"],
      },
      {
        tag: "Industriel",
        title: "Où les atomes rencontrent les algorithmes.",
        text: "Bras robotisés, usines instrumentées, métal et étincelles. Fabrication de précision gouvernée par la même intelligence que nos logiciels.",
        chips: ["Robotique", "Précision", "Télémétrie"],
      },
      {
        tag: "Opérations Maritimes",
        title: "Un océan, lu comme un jeu de données.",
        text: "Mers simulées, routes de fret, radar et GPS. Une intelligence de flotte qui transforme l'océan imprévisible en système navigable et optimisé.",
        chips: ["IA de flotte", "Routage", "Logistique"],
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
      { label: "Continents engagés" },
      { label: "Détenu en privé" },
      { label: "Ingénierie depuis" },
      { label: "Toujours opérationnel" },
    ],
  },
  timeline: {
    eyebrow: "Frise de l'innovation",
    title: "Une trajectoire mesurée en décennies.",
    items: [
      { title: "Genèse", text: "ARDLABS est fondé comme studio d'ingénierie privé avec une seule conviction : bâtir le futur avant qu'il ne soit nommé." },
      { title: "Intelligence", text: "Les premières architectures neuronales internes atteignent la production, au cœur de systèmes de décision autonomes." },
      { title: "Expansion", text: "Les opérations s'étendent sur plusieurs continents. Robotique industrielle et intelligence maritime rejoignent le portfolio." },
      { title: "Convergence", text: "IA, logiciel et infrastructure physique fusionnent en un tissu opérationnel unique et auto-améliorant." },
      { title: "Horizon", text: "Des activités autonomes qui se conçoivent, se financent et s'opèrent elles-mêmes — conçues, gouvernées et détenues en privé." },
    ],
  },
  projects: {
    eyebrow: "Projets futurs",
    title: "Conçus à huis clos.",
    intro: "Un aperçu des activités actuellement en construction dans le labo. Ouvrez-en une.",
    open: "OUVRIR →",
    classified: "CONFIDENTIEL · EN DÉVELOPPEMENT",
    requestBriefing: "Demander un briefing",
    items: [
      {
        field: "Intelligence Artificielle",
        text: "Un moteur de raisonnement auto-supervisé pour les environnements de décision à enjeux.",
        detail:
          "Helix Core est un moteur de raisonnement autonome conçu pour les environnements où une mauvaise décision est inacceptable. Il planifie, agit, audite son propre raisonnement et escalade vers l'humain quand la confiance chute.",
        highlights: ["Raisonnement auto-audité", "Décisions temps réel", "Voies d'escalade humaine"],
        stage: "Concept · En développement",
      },
      {
        field: "Opérations Maritimes",
        text: "Intelligence de flotte en temps réel pour les routes maritimes mondiales.",
        detail:
          "Tideglass fusionne radar, AIS, météo et données de marché en un modèle vivant de l'océan, puis route les flottes pour l'équilibre optimal entre temps, carburant et émissions.",
        highlights: ["Modèle de flotte en direct", "Optimisation des routes", "Conscient des émissions"],
        stage: "Prototype",
      },
      {
        field: "Services Industriels",
        text: "Des micro-usines instrumentées qui se reconfigurent selon la demande.",
        detail:
          "Foundry est un plan de micro-usines qui détectent la demande et reconfigurent physiquement leurs lignes — cellules robotisées, jumeaux numériques et maintenance prédictive gouvernés par la même intelligence que nos logiciels.",
        highlights: ["Lignes auto-reconfigurables", "Jumeau numérique", "Entretien prédictif"],
        stage: "Prototype",
      },
      {
        field: "Logiciel",
        text: "Un runtime distribué pour la prochaine génération d'applications à latence minimale.",
        detail:
          "Continuum est un runtime distribué qui place le calcul à la périphérie, au plus près de l'utilisateur. Il propulse des applications qui paraissent instantanées, avec une expérience développeur aussi simple qu'un déploiement sur une seule machine.",
        highlights: ["Runtime natif edge", "Latence minimale", "Déploiement mono-binaire"],
        stage: "Concept",
      },
    ],
  },
  workflow: {
    eyebrow: "Le système",
    title: "Concevez la logique à grande échelle.",
    intro:
      "Concevez, déployez et orchestrez des workflows d'IA sophistiqués depuis un seul tissu visuel — agents, outils et code, composés sans friction.",
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
      { title: "Capital patient", body: "Nous gardons nos projets sur le long terme — conçus pour composer sur des années, pas optimisés pour une sortie." },
      { title: "Équipe senior", body: "De petites équipes de principals qui construisent." },
      { title: "Six hubs · chaque fuseau", body: "Le travail suit le soleil : Prague, Genève, Singapour, Dubaï, Tokyo, New York." },
      { title: "Porteur par défaut", body: "Des systèmes conçus pour qu'on s'y appuie, pas pour impressionner en démo." },
      { title: "Privé par nature", body: "Nous construisons en silence et possédons ce que nous créons." },
      { title: "Un seul standard", body: "Des mondes distincts, une même rigueur d'ingénierie." },
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
      { quote: "ARDLABS ne court pas après les démos. Ils livrent des systèmes sur lesquels on peut bâtir une décennie.", author: "Operating Partner", role: "Fonds d'infrastructure" },
      { quote: "L'équipe rare qui traite la fiabilité comme la fonctionnalité, pas comme un détail.", author: "Directeur technique", role: "Groupe industriel" },
      { quote: "Ils conçoivent en silence et laissent les résultats composer.", author: "Directeur général", role: "Family office" },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Vos questions, nos réponses.",
    items: [
      { q: "Comment choisissez-vous quoi construire ?", a: "Chaque projet débute comme une hypothèse nette et réfutable sur l'évolution d'une industrie — et sur ce qu'il faut bâtir pour rendre ce changement inévitable." },
      { q: "Travaillez-vous avec des partenaires externes ?", a: "Sélectivement — avec des fondateurs, opérateurs et institutions alignés sur un horizon long. Nous nous associons à un petit nombre à la fois." },
      { q: "Où êtes-vous basés ?", a: "Un tissu distribué sur six hubs — Prague, Genève, Singapour, Dubaï, Tokyo et New York — opérant dans tous les fuseaux." },
      { q: "Votre travail est-il public ?", a: "L'essentiel est privé par nature. Ce que vous voyez ici est une fenêtre choisie sur notre façon de penser et de construire." },
    ],
  },
  cta: {
    eyebrow: "Engager",
    title: "Un problème qui mérite une décennie ?",
    body: "Nous nous associons à un petit nombre de personnes qui construisent ce qui devrait exister. Dites-nous ce que vous voulez rendre inévitable.",
    button: "Démarrer la conversation",
  },
  contact: {
    eyebrow: "Contact · 04",
    title: "Construisons l'improbable.",
    intro:
      "Nous nous associons à un petit nombre de fondateurs, d'opérateurs et d'institutions. Dites-nous ce que vous cherchez à rendre inévitable.",
    name: "Nom",
    namePlaceholder: "Ada Lovelace",
    email: "Email",
    emailPlaceholder: "vous@entreprise.com",
    domain: "Domaine",
    domains: ["IA", "Logiciel", "Automatisation", "Industriel", "Stratégie", "Maritime"],
    message: "Message",
    messagePlaceholder: "Que construisez-vous ?",
    transmit: "Transmettre",
    transmitting: "Transmission…",
    sentTitle: "Transmission reçue.",
    sentBody: "Merci — votre message est en route vers notre équipe. Nous répondons à chaque signal qui le mérite.",
    sendAnother: "Envoyer un autre",
    errorPrefix: "Échec de l'envoi — écrivez à",
  },
  footer: {
    tagline: "Private ventures concevant le prochain siècle d'intelligence, de logiciel et d'infrastructure physique.",
    index: "Index",
    contact: "Contact",
    copyHint: "Cliquer pour copier",
    copied: "Email copié",
    insights: "Perspectives",
    legalNotice: "Mentions légales",
    privacy: "Confidentialité",
    terms: "Conditions",
    rights: "Tous droits réservés.",
    press: "Appuyez",
    allSystems: "Tous les systèmes opérationnels",
  },
  industry: {
    all: "← Toutes les industries",
    label: "Industrie",
    overview: "Vue d'ensemble",
    capabilities: "Capacités",
    howWeOperate: "Notre façon d'opérer.",
    prev: "← PRÉCÉDENT",
    next: "SUIVANT →",
    ctaPrefix: "Construire",
    ctaSuffix: "avec ARDLABS.",
    startConversation: "Démarrer une conversation",
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
