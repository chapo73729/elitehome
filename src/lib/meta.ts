/* ============================================================
   ARDLABS® — Locale-aware page metadata (titles + descriptions)
   Server-safe: no "use client", no React hooks. Used by each
   page's generateMetadata() to localize the <title> segment and
   meta description per locale. Canonical/hreflang stay on the
   page via i18nAlternates().
   ============================================================ */

import type { AppLocale } from "@/lib/i18n";

export type PageMeta = { title: string; description: string };

/**
 * Static-page title/description, keyed by locale. Titles are the
 * segment fed into the `%s — ARDLABS®` template (root layout), so
 * each value here is the bare page name / phrase, not the full title.
 */
export const PAGE_META: Record<string, Record<AppLocale, PageMeta>> = {
  about: {
    en: {
      title: "About",
      description:
        "ARDLABS® is a digital engineering studio. We design and build software, platforms and AI systems — refined to the detail.",
    },
    fr: {
      title: "À propos",
      description:
        "ARDLABS® est un studio d'ingénierie numérique. Nous concevons et développons des logiciels, plateformes et systèmes d'IA — soignés jusqu'au détail.",
    },
  },
  approach: {
    en: {
      title: "Approach",
      description:
        "How ARDLABS® works — a studio method that turns a problem into reliable software, shipped and supported.",
    },
    fr: {
      title: "Approche",
      description:
        "La méthode ARDLABS® — une approche de studio qui transforme un problème en un logiciel fiable, livré et maintenu.",
    },
  },
  security: {
    en: {
      title: "Security posture",
      description:
        "How ARDLABS® secures its own platform — transport security, response headers, data minimisation and a responsible disclosure policy. Every claim is verifiable from outside.",
    },
    fr: {
      title: "Posture de sécurité",
      description:
        "Comment ARDLABS® sécurise sa propre plateforme — transport, en-têtes de réponse, minimisation des données et politique de divulgation responsable. Chaque affirmation est vérifiable de l'extérieur.",
    },
  },
  careers: {
    en: {
      title: "Careers",
      description:
        "Join ARDLABS® — a small, senior digital engineering studio building software, platforms and AI systems, refined to the detail.",
    },
    fr: {
      title: "Carrières",
      description:
        "Rejoignez ARDLABS® — un studio d'ingénierie numérique, petit et senior, qui conçoit et développe logiciels, plateformes et systèmes d'IA, soignés jusqu'au détail.",
    },
  },
  contact: {
    en: {
      title: "Contact",
      description:
        "Engage ARDLABS® — start a conversation about designing and building software, platforms, data & AI, and cloud.",
    },
    fr: {
      title: "Contact",
      description:
        "Contactez ARDLABS® — démarrez la conversation sur la conception et le développement de logiciels, plateformes, données & IA et cloud.",
    },
  },
  work: {
    en: {
      title: "Work",
      description:
        "Selected work from ARDLABS® — software, platforms, data and cloud projects, shipped end to end.",
    },
    fr: {
      title: "Réalisations",
      description:
        "Une sélection de réalisations ARDLABS® — projets de logiciels, plateformes, données et cloud, livrés de bout en bout.",
    },
  },
  insights: {
    en: {
      title: "Insights",
      description:
        "Notes from ARDLABS® on digital engineering — shipping reliable software, applied AI, and infrastructure refined to the detail.",
    },
    fr: {
      title: "Perspectives",
      description:
        "Les notes d'ARDLABS® sur l'ingénierie numérique — logiciels fiables, IA appliquée et infrastructures soignées jusqu'au détail.",
    },
  },
  services: {
    en: {
      title: "Services",
      description:
        "Four poles, one standard — Strategy & Consulting, Design & Development, Data & AI, and Cloud & Infrastructure, engineered by ARDLABS®.",
    },
    fr: {
      title: "Services",
      description:
        "Quatre pôles, un seul standard — Conseil & stratégie, Conception & développement, Données & IA, et Cloud & infrastructure, conçus par ARDLABS®.",
    },
  },
  "legal/imprint": {
    en: {
      title: "Legal Notice",
      description: "Legal notice and company information for ARDLABS®.",
    },
    fr: {
      title: "Mentions légales",
      description: "Mentions légales et informations sur la société ARDLABS®.",
    },
  },
  "legal/privacy": {
    en: {
      title: "Privacy Policy",
      description: "How ARDLABS® collects, uses and protects personal data.",
    },
    fr: {
      title: "Politique de confidentialité",
      description:
        "Comment ARDLABS® collecte, utilise et protège les données personnelles.",
    },
  },
  "legal/terms": {
    en: {
      title: "Terms of Use",
      description: "Terms governing the use of the ARDLABS® website.",
    },
    fr: {
      title: "Conditions d'utilisation",
      description:
        "Les conditions régissant l'utilisation du site web ARDLABS®.",
    },
  },
};

/**
 * Per-service (INDUSTRIES id) localized title + overview, mirroring the
 * EN values in site.ts (INDUSTRIES) and the FR values in content.ts. Kept
 * here so server-side generateMetadata never imports the "use client"
 * content module. The `[slug]` page falls back to the English INDUSTRIES
 * entry if a slug is missing here.
 */
export const SERVICE_META: Record<string, Record<AppLocale, PageMeta>> = {
  strategy: {
    en: {
      title: "Strategy & Consulting",
      description:
        "Before a line of code, the hard questions: what to build, why, and how it will hold up. We bring technology consulting, applied R&D and rapid prototyping to de-risk the idea and chart the path to a product.",
    },
    fr: {
      title: "Conseil & stratégie",
      description:
        "Avant la moindre ligne de code, les vraies questions : quoi construire, pourquoi, et comment cela tiendra. Conseil technologique, R&D appliquée et prototypage rapide pour réduire le risque et tracer le chemin vers le produit.",
    },
  },
  software: {
    en: {
      title: "Design & Development",
      description:
        "The core of the studio. We design and build custom software — web, mobile, SaaS, platforms and internal systems — with interfaces that are clear and code that stays fast, secure and legible for years.",
    },
    fr: {
      title: "Conception & développement",
      description:
        "Le cœur du studio. Nous concevons et développons des logiciels sur mesure — web, mobile, SaaS, plateformes et systèmes internes — avec des interfaces claires et un code qui reste rapide, sûr et lisible des années durant.",
    },
  },
  ai: {
    en: {
      title: "Data & AI",
      description:
        "Data and AI where they pay off: intelligent automation, data pipelines, and the dashboards that turn raw operations into decisions.",
    },
    fr: {
      title: "Données & IA",
      description:
        "La donnée et l'IA là où elles rapportent : automatisation intelligente, pipelines de données et tableaux de bord qui éclairent les décisions.",
    },
  },
  cloud: {
    en: {
      title: "Cloud & Infrastructure",
      description:
        "Software is only as reliable as what it runs on. We architect cloud infrastructure, set up deployment and observability, and build the APIs and integrations that connect your systems — engineered for uptime and scale.",
    },
    fr: {
      title: "Cloud & infrastructure",
      description:
        "Un logiciel ne vaut que ce sur quoi il tourne. Nous architecturons l'infrastructure cloud, mettons en place déploiement et observabilité, et construisons les APIs et intégrations qui relient vos systèmes — pensés pour la disponibilité et l'échelle.",
    },
  },
};

/**
 * Home / site default title + description, per locale. The FR wording
 * reuses the hero subtitle / SITE description already in content.ts.
 */
export const HOME_META: Record<AppLocale, PageMeta> = {
  en: {
    title: "ARDLABS® — Digital Engineering Studio",
    description:
      "ARDLABS® is a digital engineering studio. We design and build software, platforms and AI systems that are fast, reliable, and refined to the detail.",
  },
  fr: {
    title: "ARDLABS® — Studio d'ingénierie numérique",
    description:
      "Studio d'ingénierie numérique : logiciels, plateformes et systèmes d'IA rapides, fiables et soignés jusqu'au détail.",
  },
};

/** Convenience accessor for a static page's localized metadata. */
export function pageMeta(key: keyof typeof PAGE_META, locale: AppLocale): PageMeta {
  return PAGE_META[key][locale];
}
