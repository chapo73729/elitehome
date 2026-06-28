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
    eyebrow: "Digital Engineering Studio · Prague",
    headline: "Complex ideas, engineered into precise products.",
    subtitle:
      "ARDLABS is a digital engineering studio. We design and build software, platforms and AI systems that are fast, reliable, and refined to the detail.",
    explore: "See our work",
    engage: "Start a project",
    scroll: "SCROLL",
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
  },
  network: {
    eyebrow: "Global Network",
    title: "One studio. Prague-based. Working worldwide.",
    intro:
      "We work with founders and teams across timezones — async by default, precise in delivery.",
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
      { value: "2019", label: "Founded" },
      { value: "Prague", label: "Based in" },
      { value: "EN / FR", label: "Bilingual" },
      { value: "Remote", label: "Working worldwide" },
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
      { q: "Where are you based?", a: "Prague-based, working worldwide — async by default and precise in delivery, across every timezone." },
      { q: "Is your work public?", a: "Some of it is under NDA. What you see here is a curated window onto how we think and build." },
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
    domains: ["Strategy & Consulting", "Design & Development", "Data & AI", "Cloud & Infrastructure"],
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
    eyebrow: "Studio d'ingénierie numérique · Prague",
    headline: "Des idées complexes, transformées en produits précis.",
    subtitle:
      "ARDLABS est un studio d'ingénierie numérique. Nous concevons et développons des logiciels, plateformes et systèmes IA rapides, fiables et soignés jusqu'au détail.",
    explore: "Voir nos projets",
    engage: "Démarrer un projet",
    scroll: "DÉFILER",
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
  },
  network: {
    eyebrow: "Réseau mondial",
    title: "Un studio. Basé à Prague. Au service du monde entier.",
    intro:
      "Nous travaillons avec des fondateurs et des équipes sur tous les fuseaux — async par défaut, précis à la livraison.",
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
      { value: "2019", label: "Fondé" },
      { value: "Prague", label: "Basé à" },
      { value: "EN / FR", label: "Bilingue" },
      { value: "À distance", label: "Partout dans le monde" },
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
      { q: "Où êtes-vous basés ?", a: "Basés à Prague, au service du monde entier — async par défaut et précis à la livraison, sur tous les fuseaux." },
      { q: "Votre travail est-il public ?", a: "Une partie est sous NDA. Ce que vous voyez ici est une fenêtre choisie sur notre façon de penser et de construire." },
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
    domains: ["Conseil & stratégie", "Conception & développement", "Données & IA", "Cloud & infrastructure"],
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
