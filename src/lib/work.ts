/**
 * Case-study content. Illustrative digital-studio projects expanded into
 * full problem → approach → outcome narratives. Outcomes are framed
 * qualitatively; any figure shown is illustrative of intent, not a claim.
 *
 * The English content lives on each CaseStudy (unchanged). French translations
 * live in a parallel `WORK_FR` map keyed by slug; language-neutral fields
 * (slug, code, accent, pole, tech, product names) are not duplicated. Use
 * `localizeCase(study, lang)` to get a study with the right-language strings.
 */

import type { Lang } from "@/lib/lang";

export type CaseStudy = {
  slug: string;
  code: string;
  name: string;
  field: string;
  accent: string;
  summary: string;
  stage: string;
  /** Services pole this project best represents (matches INDUSTRIES id). */
  pole: string;
  /** Disciplines we owned on the engagement. */
  roles: string[];
  /** Representative tech used. */
  tech: string[];
  challenge: string[];
  approach: { title: string; body: string }[];
  outcome: string[];
  highlights: string[];
};

/** Translatable subset of a CaseStudy. Language-neutral fields are omitted. */
export type CaseStudyL10n = Pick<
  CaseStudy,
  | "field"
  | "summary"
  | "stage"
  | "roles"
  | "challenge"
  | "approach"
  | "outcome"
  | "highlights"
>;

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
    pole: "ai",
    roles: ["Applied AI", "Backend engineering", "Evaluation & guardrails"],
    tech: ["Python", "OpenAI", "Postgres", "FastAPI"],
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
    pole: "software",
    roles: ["Product design", "Full-stack engineering", "Data integration"],
    tech: ["React", "Next.js", "TypeScript", "Postgres"],
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
    pole: "ai",
    roles: ["Data engineering", "Internal tooling", "Dashboards & BI"],
    tech: ["Python", "dbt", "Postgres", "React"],
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
    pole: "cloud",
    roles: ["Systems engineering", "Cloud architecture", "Developer experience"],
    tech: ["Rust", "Kubernetes", "AWS", "Terraform"],
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

/**
 * French translations keyed by slug. Mirrors the translatable fields of the
 * English entries above (same array lengths and ordering). Product names,
 * codes, accents, poles and tech are language-neutral and not repeated here.
 */
export const WORK_FR: Record<string, CaseStudyL10n> = {
  "helix-core": {
    field: "Données & IA",
    summary:
      "Un moteur d'aide à la décision par IA pour les équipes opérationnelles qui ne peuvent pas se permettre une mauvaise décision.",
    stage: "Livré · En production",
    roles: ["IA appliquée", "Ingénierie backend", "Évaluation & garde-fous"],
    challenge: [
      "Des décisions opérationnelles à fort enjeu ne peuvent pas être confiées à un modèle simplement précis en moyenne. L'équipe avait besoin d'un système fiable dans le pire des cas — et qui sait reconnaître ses incertitudes.",
      "Le vrai problème n'a jamais été la capacité brute. C'était la confiance : un assistant qui transmet la main à un humain exactement au bon moment, avec un raisonnement qu'une personne peut auditer.",
    ],
    approach: [
      {
        title: "Raisonner en boucle fermée",
        body: "Helix planifie, agit, observe le résultat et critique sa propre production avant de la valider. La robustesse vient de la boucle, et non de la perfection d'une étape isolée.",
      },
      {
        title: "Confiance calibrée",
        body: "Chaque recommandation porte un score de confiance calibré. En dessous d'un seuil, le système s'arrête et transmet la main — avec l'ensemble du raisonnement joint pour une revue humaine.",
      },
      {
        title: "Auditable par conception",
        body: "Chaque action est consignée sous forme d'enregistrement inspectable, de sorte qu'un opérateur peut reconstituer exactement pourquoi une décision a été prise, longtemps après coup.",
      },
    ],
    outcome: [
      "En production, Helix traite automatiquement la majorité des décisions de routine tout en signalant tôt à l'équipe celles qui sont véritablement ambiguës.",
      "Le résultat n'est pas un système qui remplace le jugement, mais un système qui concentre l'attention humaine là où elle compte le plus.",
    ],
    highlights: ["Raisonnement auto-auditable", "Décisions en moins d'une seconde", "Voies d'escalade vers l'humain"],
  },
  tideglass: {
    field: "Plateforme SaaS",
    summary:
      "Un tableau de bord SaaS logistique qui transforme des données opérationnelles éparses en décisions vivantes et exploitables pour le routage.",
    stage: "Livré · En montée en charge",
    roles: ["Design produit", "Ingénierie full-stack", "Intégration de données"],
    challenge: [
      "L'activité logistique du client reposait sur de faibles marges et des informations obsolètes, dispersées dans une mosaïque d'outils déconnectés. Les décisions étaient souvent prises sur des données vieilles de plusieurs heures.",
      "L'opportunité consistait à donner aux opérateurs une vue unique et en temps réel de leur réseau — et à planifier en continu plutôt qu'une fois par jour.",
    ],
    approach: [
      {
        title: "Fusionner chaque signal",
        body: "Tideglass fusionne le suivi, la planification, les coûts et les flux de données externes en un seul modèle de l'activité, mis à jour en continu.",
      },
      {
        title: "Optimiser l'itinéraire dans son ensemble",
        body: "Plutôt que le plus court chemin, le moteur équilibre temps, coût et fiabilité selon les priorités de chaque opérateur, et replanifie à mesure que les conditions évoluent.",
      },
      {
        title: "L'opérateur dans la boucle",
        body: "Les recommandations sont explicables et peuvent être outrepassées — le système conseille, le répartiteur décide.",
      },
    ],
    outcome: [
      "Le déploiement initial a réduit sensiblement les coûts d'exploitation sur l'ensemble du réseau tout en améliorant la ponctualité.",
      "Les opérateurs ont gagné un tableau de bord partagé et en temps réel, qui a remplacé une mosaïque de tableurs et d'outils déconnectés.",
    ],
    highlights: ["Modèle opérationnel en temps réel", "Routage soucieux des coûts", "Recommandations explicables"],
  },
  foundry: {
    field: "Outils internes",
    summary:
      "Un tableau de bord d'exploitation industrielle et une suite d'outils internes qui rendent un atelier de production lisible.",
    stage: "Livré · En production",
    roles: ["Ingénierie de données", "Outils internes", "Tableaux de bord & BI"],
    challenge: [
      "L'usine du client fonctionnait sur des savoirs informels et de la paperasse en fin de poste. Quand quelque chose dérapait, personne ne le voyait avant que cela ne devienne un problème.",
      "La question était de savoir si l'état quotidien des opérations pouvait être rendu visible en temps réel — et si la corvée des rapports manuels pouvait être entièrement supprimée.",
    ],
    approach: [
      {
        title: "Instrumenter l'atelier",
        body: "Foundry agrège en temps réel les signaux des systèmes de ligne existants et des capteurs dans une seule couche de données opérationnelle — sans tout remplacer.",
      },
      {
        title: "Faire remonter l'état",
        body: "Un tableau de bord en temps réel et des outils internes offrent aux superviseurs une vue claire et partagée du débit, des anomalies et des goulots d'étranglement à mesure qu'ils surviennent.",
      },
      {
        title: "Anticiper plutôt que réagir",
        body: "Les modèles signalent les conditions qui précèdent un arrêt, de sorte que la maintenance est planifiée avant qu'une ligne ne s'arrête, et non après.",
      },
    ],
    outcome: [
      "Les superviseurs ont gagné une vue en temps réel de l'atelier et une réduction marquée des arrêts non planifiés.",
      "Des heures de reporting manuel en fin de poste ont été remplacées par des tableaux de bord toujours à jour.",
    ],
    highlights: ["Tableau de bord en temps réel", "Couche de données opérationnelle", "Maintenance prédictive"],
  },
  continuum: {
    field: "Plateforme",
    summary:
      "Un environnement d'exécution distribué qui place le calcul à quelques microsecondes de l'utilisateur.",
    stage: "Livré · En production",
    roles: ["Ingénierie systèmes", "Architecture cloud", "Expérience développeur"],
    challenge: [
      "On attend des applications modernes qu'elles paraissent instantanées partout — mais l'infrastructure pour y parvenir a toujours été complexe, coûteuse et réservée aux plus grandes équipes d'ingénierie.",
      "L'objectif était d'atteindre les performances de l'edge avec l'expérience développeur d'un déploiement sur une seule machine.",
    ],
    approach: [
      {
        title: "Calculer à la périphérie",
        body: "Continuum place l'exécution à quelques microsecondes de l'utilisateur, de sorte que les applications répondent à la vitesse de la perception, partout sur la planète.",
      },
      {
        title: "Un seul binaire, partout",
        body: "Les développeurs déploient un seul artefact ; l'environnement d'exécution prend en charge la distribution mondiale, le placement et la bascule en cas de panne.",
      },
      {
        title: "Des opérations invisibles",
        body: "La mise à l'échelle, le routage et la reprise sont gérés par la plateforme, et non par l'équipe qui construit dessus.",
      },
    ],
    outcome: [
      "Les applications ont atteint des temps de réponse qui paraissent instantanés pour les utilisateurs, sans travail d'infrastructure sur mesure.",
      "De petites équipes ont obtenu des capacités qui exigeaient auparavant une organisation plateforme dédiée.",
    ],
    highlights: ["Environnement d'exécution natif edge", "Déploiement en binaire unique", "Bascule mondiale"],
  },
};

/**
 * Return a CaseStudy with its translatable fields resolved to `lang`.
 * Language-neutral fields are preserved; English is the fallback.
 */
export function localizeCase(study: CaseStudy, lang: Lang): CaseStudy {
  if (lang === "en") return study;
  const fr = WORK_FR[study.slug];
  if (!fr) return study;
  return { ...study, ...fr };
}

export function getCase(slug: string) {
  return WORK.find((w) => w.slug === slug);
}

/** Cases that best represent a given services pole (INDUSTRIES id). */
export function getCasesByPole(pole: string) {
  return WORK.filter((w) => w.pole === pole);
}
