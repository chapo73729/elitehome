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
    { label: "Security", href: "#security" },
    { label: "Team", href: "#team" },
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
    subtitle: "Software, platforms and AI — fast, reliable, refined.",
    explore: "See our work",
    engage: "Start a project",
    scroll: "SCROLL",
    scrollHint: "The studio, in five moves.",
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
  core: {
    eyebrow: "Interactive AI Core",
    title: "Intelligence, put to work.",
    intro: "Move your cursor — the field responds.",
    points: [
      { k: "Applied AI", v: "Wired into real workflows." },
      { k: "Automation", v: "The manual grind, removed." },
      { k: "Data", v: "Operations, turned into decisions." },
    ],
    cta: "Have an operation that should run like this?",
    ctaButton: "Start a project",
  },
  network: {
    eyebrow: "Global Network",
    title: "One studio. Prague-based. Working worldwide.",
    intro: "Async by default. Precise in delivery.",
    routesLabel: "Connected routes",
    returnHint: "Click the sea or press Esc to return",
  },
  industries: {
    eyebrow: "Services",
    title: "Four poles. One standard.",
    intro: "Four poles cover an idea end to end.",
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
        blurb: "From idea to validated plan.",
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
        blurb: "Web, mobile, SaaS — end to end.",
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
        blurb: "Automation, data and AI at work.",
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
        blurb: "Foundations built for uptime.",
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
  partners: {
    eyebrow: "Selected Clients",
    title: "In good company.",
    note: "A representative selection",
    items: [
      { name: "MITRE ATT&CK", sector: "Threat intelligence framework" },
      { name: "LinkPlus IT", sector: "IT services & cloud \u00b7 Kosovo" },
      { name: "Cacttus", sector: "IT & cybersecurity \u00b7 Kosovo" },
      { name: "theHarvester", sector: "OSINT reconnaissance" },
      { name: "InfoSoft Group", sector: "Information systems \u00b7 Albania" },
      { name: "VirusTotal", sector: "Threat analysis engine" },
      { name: "Communication Progress", sector: "ICT & cybersecurity \u00b7 Albania" },
      { name: "YTC Group", sector: "Industrial group \u00b7 Albania" },
      { name: "Avast", sector: "Cybersecurity \u00b7 Czech Republic" },
      { name: "JetBrains", sector: "Developer tools \u00b7 Czech Republic" },
    ],
  },
  security: {
    eyebrow: "Cyber Security",
    title: "Defence, engineered in.",
    intro: "Built with security. Never bolted on.",
    registry: "10 domains · offensive + defensive",
    acts: [
      "01 · intrusion detected — 4 812 hostile signatures",
      "02 · live analysis — every vector traced",
      "03 · threat absorbed — the attack becomes the armour",
    ],
    reel: {
      label: "field footage",
      caption: "AI threat response — hunted, neutralised.",
    },
    items: [
      { id: "soc", title: "Security Operations", tag: "SOC" },
      { id: "pentest", title: "Penetration Testing", tag: "OFFENSE" },
      { id: "redteam", title: "Red Team Operations", tag: "ADVERSARY" },
      { id: "blueteam", title: "Blue Team Defense", tag: "DEFENSE" },
      { id: "threatintel", title: "Threat Intelligence", tag: "INTEL" },
      { id: "forensics", title: "Digital Forensics", tag: "DFIR" },
      { id: "ir", title: "Incident Response", tag: "RESPONSE" },
      { id: "cloudsec", title: "Cloud Security", tag: "CLOUD" },
      { id: "infrasec", title: "Infrastructure Security", tag: "INFRA" },
      { id: "vulnassess", title: "Vulnerability Assessment", tag: "ASSESS" },
    ],
  },
  team: {
    eyebrow: "The Team",
    title: "The people behind the work.",
    intro: "Small. Senior. Accountable.",
    stackLabel: "Core stack",
    members: [
      {
        id: "jakub",
        name: "Jakub Novák",
        role: "Senior Software Engineer",
        bio: "Systems that hold under load.",
        stack: ["Rust", "Go", "C++", "TypeScript", "React", "PostgreSQL"],
      },
      {
        id: "tomas",
        name: "Tomáš Dvořák",
        role: "Cybersecurity Specialist",
        bio: "Red team to blue team.",
        stack: ["Pentest", "Red Team", "Blue Team", "Threat Intel", "DevSecOps", "Linux"],
      },
      {
        id: "samir",
        name: "Samir Gojani",
        role: "AI & Cloud Engineer",
        bio: "AI and cloud, in production.",
        stack: ["Python", "Kubernetes", "Docker", "AWS", "Azure", "Terraform", "Machine Learning"],
      },
    ],
  },
  cta: {
    eyebrow: "Engage",
    title: "Got something worth building?",
    body: "Tell us what you're building.",
    button: "Start a conversation",
  },
  contact: {
    eyebrow: "Contact · 06",
    title: "Let's build it.",
    intro: "A few lines. A fast reply.",
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
    sentBody: "On its way. We'll reply soon.",
    sendAnother: "Send another",
    errorPrefix: "Couldn't send — please email",
    step: "You are here · 04 / 04",
    copyHint: "Click to copy",
    copied: "Email copied",
    continueLabel: "Continue",
    back: "Back",
    edit: "Edit",
    stepOf: "Step {n} of {total}",
    enterHint: "press Enter ↵",
    cmdEnterHint: "⌘ / Ctrl + Enter to continue",
    briefCompiled: "brief compiled",
    briefHint: "Review your brief — edit any line before transmitting.",
    nameError: "Please tell us your name.",
    emailError: "That email doesn't look right.",
    messageError: "Tell us a few words about the project.",
  },
  footer: {
    tagline: "Software, platforms and AI — refined to the detail.",
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
    { label: "Sécurité" },
    { label: "Équipe" },
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
    subtitle: "Logiciels, plateformes et IA — rapides, fiables, soignés.",
    explore: "Voir nos projets",
    engage: "Démarrer un projet",
    scroll: "DÉFILER",
    scrollHint: "Le studio, en cinq temps.",
  },
  cinematic: {
    tag: "MANIFESTE",
    lines: [
      "La plupart des studios livrent des fonctionnalités.",
      "Nous, des produits.",
      "Design, code et infrastructure —",
      "soignés jusqu'au détail, faits pour durer.",
    ],
    outro: "L'ingénierie numérique, dans les règles de l'art.",
  },
  core: {
    eyebrow: "Cœur IA interactif",
    title: "L'intelligence, à l'œuvre.",
    intro: "Bougez le curseur — le champ réagit.",
    points: [
      { k: "IA appliquée", v: "Branchée sur de vrais workflows." },
      { k: "Automatisation", v: "Le travail manuel, supprimé." },
      { k: "Données", v: "L'opérationnel, transformé en décisions." },
    ],
    cta: "Une opération qui devrait tourner comme ça ?",
    ctaButton: "Démarrer un projet",
  },
  network: {
    eyebrow: "Réseau mondial",
    title: "Un studio. Basé à Prague. Présent dans le monde entier.",
    intro: "Asynchrone par défaut. Précis à la livraison.",
    routesLabel: "Routes connectées",
    returnHint: "Cliquez sur la mer ou appuyez sur Échap pour revenir",
  },
  industries: {
    eyebrow: "Services",
    title: "Quatre pôles. Un seul standard.",
    intro: "Quatre pôles couvrent une idée de bout en bout.",
    explore: "EXPLORER →",
    viewAll: "Voir tous les services",
    indexEyebrow: "Quatre pôles.",
    indexIntro:
      "L'ingénierie numérique chapeaute l'ensemble. Dessous, quatre pôles couvrent une idée de bout en bout. Choisissez un pôle.",
    items: [
      {
        title: "Conseil & stratégie",
        blurb: "De l'idée au plan validé.",
        tagline: "La clarté avant le code.",
        overview:
          "Avant la moindre ligne de code, les vraies questions : quoi construire, pourquoi, et comment cela tiendra. Conseil technologique, R&D appliquée et prototypage rapide pour réduire le risque et tracer le chemin vers le produit.",
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
          { t: "Transmettre", d: "Un plan que l'équipe de réalisation exécute sans deviner." },
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
          "Une passation claire que l'équipe de réalisation peut exécuter",
        ],
        engagement: [
          { t: "Sprint de cadrage", d: "Un engagement court et fixe pour cadrer le problème et révéler les vrais risques." },
          { t: "Prototyper & valider", d: "Nous construisons le plus petit élément qui prouve ou écarte l'hypothèse la plus risquée." },
          { t: "Planifier & transmettre", d: "Architecture, feuille de route et docs — prêts à construire, avec ou sans nous." },
        ],
        stack: ["Figma", "TypeScript", "Next.js", "Python", "Notebooks", "Excalidraw"],
      },
      {
        title: "Conception & développement",
        blurb: "Web, mobile, SaaS — de bout en bout.",
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
          { t: "Maintenir", d: "Le produit fonctionne encore, bien après le lancement." },
        ],
        metrics: [
          { value: "Bout en bout", label: "Design + dév" },
          { value: "Production", label: "Pas de simples prototypes" },
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
          { t: "Cadrage & design", d: "Nous alignons le périmètre et livrons les parcours clés sous forme de design cliquable et validé." },
          { t: "Développement à périmètre fixe", d: "Une petite équipe senior livre du code de production par incréments courts, faciles à relire." },
          { t: "Lancement & support", d: "Nous durcissons, livrons et transmettons — puis restons disponibles pour une fenêtre de support convenue." },
        ],
        stack: ["React", "Next.js", "TypeScript", "Tailwind", "Figma", "Three.js"],
      },
      {
        title: "Données & IA",
        blurb: "Automatisation, données et IA à l'œuvre.",
        tagline: "Des opérations enfin lisibles.",
        overview:
          "Nous mettons la donnée et l'IA là où elles rapportent : automatisation intelligente, automatisation des processus (workflow, RPA), pipelines de données, et les tableaux de bord et outils métier qui transforment l'opérationnel en décisions.",
        capabilities: [
          "IA appliquée",
          "Automatisation par IA",
          "Automatisation des processus (RPA)",
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
          { t: "Cartographier l'opération", d: "Nous traçons où sont vraiment le travail manuel et la donnée avant de toucher à quoi que ce soit." },
          { t: "Automatiser & révéler", d: "Nous construisons les pipelines, automatisations et tableaux de bord qui suppriment la corvée." },
          { t: "Mesurer & améliorer", d: "Nous instrumentons ce que nous livrons, pour qu'il puisse être vérifié, éprouvé et affiné dans la durée." },
        ],
        stack: ["Python", "TensorFlow", "OpenAI", "CUDA", "Postgres", "dbt"],
      },
      {
        title: "Cloud & infrastructure",
        blurb: "Des fondations faites pour durer.",
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
          { t: "Passer à l'échelle", d: "La plateforme grandit sans réécriture." },
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
          { t: "Architecturer", d: "Nous concevons l'infrastructure et le modèle de déploiement autour de votre charge réelle." },
          { t: "Construire & automatiser", d: "Infrastructure as code, CI/CD et observabilité, posés une fois et répétables." },
          { t: "Exploiter & passer à l'échelle", d: "Nous transmettons un système que vous pouvez exploiter — et qui grandit sans réécriture." },
        ],
        stack: ["AWS", "Docker", "Kubernetes", "Terraform", "Rust", "GitHub Actions"],
      },
    ],
  },
  partners: {
    eyebrow: "R\u00e9f\u00e9rences",
    title: "En bonne compagnie.",
    note: "Une s\u00e9lection repr\u00e9sentative",
    items: [
      { sector: "Cadre de renseignement sur les menaces" },
      { sector: "Services IT & cloud \u00b7 Kosovo" },
      { sector: "IT & cybers\u00e9curit\u00e9 \u00b7 Kosovo" },
      { sector: "Reconnaissance OSINT" },
      { sector: "Syst\u00e8mes d'information \u00b7 Albanie" },
      { sector: "Moteur d'analyse des menaces" },
      { sector: "ICT & cybers\u00e9curit\u00e9 \u00b7 Albanie" },
      { sector: "Groupe industriel \u00b7 Albanie" },
      { sector: "Cybers\u00e9curit\u00e9 \u00b7 R\u00e9publique tch\u00e8que" },
      { sector: "Outils de d\u00e9veloppement \u00b7 R\u00e9publique tch\u00e8que" },
    ],
  },
  security: {
    eyebrow: "Cybersécurité",
    title: "La défense, intégrée dès la conception.",
    intro: "La sécurité se construit. Elle ne se rajoute pas.",
    registry: "10 domaines · offensif + défensif",
    acts: [
      "01 · intrusion détectée — 4 812 signatures hostiles",
      "02 · analyse en direct — chaque vecteur tracé",
      "03 · menace absorbée — l'attaque devient l'armure",
    ],
    reel: {
      label: "séquence terrain",
      caption: "Réponse IA à la menace — traquée, neutralisée.",
    },
    items: [
      { title: "Security Operations" },
      { title: "Tests d'intrusion" },
      { title: "Opérations Red Team" },
      { title: "Défense Blue Team" },
      { title: "Renseignement menaces" },
      { title: "Investigation numérique" },
      { title: "Réponse à incident" },
      { title: "Sécurité du cloud" },
      { title: "Sécurité des infrastructures" },
      { title: "Évaluation des vulnérabilités" },
    ],
  },
  team: {
    eyebrow: "L'équipe",
    title: "Les personnes derrière le travail.",
    intro: "Réduite. Senior. Responsable.",
    stackLabel: "Stack principale",
    members: [
      { role: "Ingénieur logiciel senior", bio: "Des systèmes qui tiennent la charge." },
      { role: "Spécialiste cybersécurité", bio: "Du red team au blue team." },
      { role: "Ingénieur IA & Cloud", bio: "IA et cloud, en production." },
    ],
  },
  cta: {
    eyebrow: "Collaborer",
    title: "Quelque chose qui mérite d'être construit ?",
    body: "Dites-nous ce que vous construisez.",
    button: "Démarrer la conversation",
  },
  contact: {
    eyebrow: "Contact · 06",
    title: "Construisons-le.",
    intro: "Quelques lignes. Une réponse rapide.",
    name: "Nom",
    namePlaceholder: "Ada Lovelace",
    email: "E-mail",
    emailPlaceholder: "vous@entreprise.com",
    domain: "Domaine",
    domains: ["Conseil & stratégie", "Conception & développement", "Données & IA", "Cloud & infrastructure"],
    message: "Message",
    messagePlaceholder: "Que construisez-vous ?",
    transmit: "Transmettre",
    transmitting: "Transmission…",
    sentTitle: "Transmission reçue.",
    sentBody: "C'est parti. Réponse rapide.",
    sendAnother: "Envoyer un autre message",
    errorPrefix: "Échec de l'envoi — écrivez à",
    step: "Vous êtes ici · 04 / 04",
    copyHint: "Cliquer pour copier",
    copied: "E-mail copié",
    continueLabel: "Continuer",
    back: "Retour",
    edit: "Modifier",
    stepOf: "Étape {n} sur {total}",
    enterHint: "appuyez sur Entrée ↵",
    cmdEnterHint: "⌘ / Ctrl + Entrée pour continuer",
    briefCompiled: "brief compilé",
    briefHint: "Relisez votre brief — chaque ligne reste modifiable avant l'envoi.",
    nameError: "Indiquez-nous votre nom.",
    emailError: "Cet e-mail ne semble pas valide.",
    messageError: "Dites-nous quelques mots sur le projet.",
  },
  footer: {
    tagline: "Logiciels, plateformes et IA — soignés jusqu'au détail.",
    index: "Index",
    contact: "Contact",
    copyHint: "Cliquer pour copier",
    copied: "E-mail copié",
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
    deliverablesIntro: "Des livrables concrets que vous gardez — pas des slides.",
    engagement: "Comment nous collaborons",
    engagementIntro: "Un chemin simple, à périmètre fixe, de la question au produit livré.",
    stack: "Stack typique",
    stackIntro: "Un ensemble d'outils volontairement restreint, pour ce pôle.",
    relatedWork: "Projets liés",
    relatedWorkIntro: "Projets représentatifs qui montrent ce pôle en pratique.",
    viewCase: "Voir l'étude de cas",
    prev: "← PRÉCÉDENT",
    next: "SUIVANT →",
    ctaPrefix: "Construire",
    ctaSuffix: "avec ARDLABS.",
    ctaBody: "Dites-nous ce que vous cherchez à construire. Nous vous dirons comment nous l'aborderions.",
    startConversation: "Démarrer la conversation",
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

/* ---- French typography ----------------------------------------------------
   Apply correct French micro-typography to French-authored strings: a thin
   non-breaking space (U+202F) before ; : ! ? and inside « », and curly
   apostrophes. Run ONLY on the fr override (not the English base), idempotent,
   with guards so URLs (://) and times/ratios (12:00) are left intact. */
const NNBSP = " ";
function frTypo(s: string): string {
  return (
    s
      // curly apostrophes
      .replace(/'/g, "’")
      // thin nbsp before ; ! ? (collapse any preceding space)
      .replace(/([^\s])\s*([;!?])/g, `$1${NNBSP}$2`)
      // before colon — but not in URLs (://) nor between digits (12:00, 16:9)
      .replace(/([^\s\d])\s*:(?!\/\/)/g, `$1${NNBSP}:`)
      // inside guillemets
      .replace(/«\s*/g, `«${NNBSP}`)
      .replace(/\s*»/g, `${NNBSP}»`)
  );
}
function frDeep<T>(v: T): T {
  if (typeof v === "string") return frTypo(v) as unknown as T;
  if (Array.isArray(v)) return v.map(frDeep) as unknown as T;
  if (v && typeof v === "object") {
    const o: Record<string, unknown> = {};
    for (const k of Object.keys(v as object)) o[k] = frDeep((v as Record<string, unknown>)[k]);
    return o as unknown as T;
  }
  return v;
}

export const CONTENT: Record<Lang, Content> = {
  en,
  fr: merge(en, frDeep(fr)),
};

/** Reactive localized content for the current language. */
export function useContent(): Content {
  const lang = useLang();
  return CONTENT[lang];
}
