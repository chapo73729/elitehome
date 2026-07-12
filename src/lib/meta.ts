/* ============================================================
   BLACKFIRST® — Locale-aware page metadata (titles + descriptions)
   Server-safe: no "use client", no React hooks. Used by each
   page's generateMetadata() to localize the <title> segment and
   meta description per locale. Canonical/hreflang stay on the
   page via i18nAlternates().
   ============================================================ */

import type { AppLocale } from "@/lib/i18n";

export type PageMeta = { title: string; description: string };

/**
 * Static-page title/description, keyed by locale. Titles are the segment
 * fed into the `%s — BLACKFIRST®` template (root layout), so each value
 * here is the bare page name / phrase, not the full title.
 */
export const PAGE_META: Record<string, Record<AppLocale, PageMeta>> = {
  about: {
    en: {
      title: "About",
      description:
        "BLACKFIRST® is a Geneva-based executive chauffeur house — Swiss precision, total discretion, one standard across Switzerland and Europe.",
    },
    fr: {
      title: "À propos",
      description:
        "BLACKFIRST® est une maison de chauffeurs basée à Genève — précision suisse, discrétion totale, un seul standard à travers la Suisse et l'Europe.",
    },
  },
  services: {
    en: {
      title: "Services",
      description:
        "Airport transfers, business mobility, luxury events and international long-distance journeys — private chauffeur services by BLACKFIRST® in Geneva.",
    },
    fr: {
      title: "Services",
      description:
        "Transferts aéroport, mobilité d'affaires, événements de prestige et longues distances internationales — services de chauffeur privé BLACKFIRST® à Genève.",
    },
  },
  fleet: {
    en: {
      title: "The Fleet",
      description:
        "A quiet, immaculately kept fleet of recent Mercedes-Benz — S-Class, E-Class, V-Class VIP and electric EQS. Detailed before every journey.",
    },
    fr: {
      title: "La flotte",
      description:
        "Une flotte silencieuse et impeccablement tenue de Mercedes-Benz récentes — Classe S, Classe E, V-Class VIP et EQS électrique. Soignée avant chaque trajet.",
    },
  },
  locations: {
    en: {
      title: "Areas Served",
      description:
        "Based in Geneva, at home across the arc lémanique, the Alps and Europe — Lausanne, Montreux, Verbier, Courchevel, Lyon and Milan.",
    },
    fr: {
      title: "Zones desservies",
      description:
        "Basés à Genève, chez nous sur l'arc lémanique, dans les Alpes et en Europe — Lausanne, Montreux, Verbier, Courchevel, Lyon et Milan.",
    },
  },
  booking: {
    en: {
      title: "Book a Chauffeur",
      description:
        "Reserve your private chauffeur with BLACKFIRST®. Tell us where and when — we reply with a fixed, all-inclusive quote, fast.",
    },
    fr: {
      title: "Réserver un chauffeur",
      description:
        "Réservez votre chauffeur privé avec BLACKFIRST®. Dites-nous où et quand — nous répondons avec un devis fixe et tout compris, vite.",
    },
  },
  contact: {
    en: {
      title: "Contact",
      description:
        "Reach BLACKFIRST® by phone, WhatsApp or email — reservations answered 24/7, day and night, across Geneva, Switzerland and Europe.",
    },
    fr: {
      title: "Contact",
      description:
        "Joignez BLACKFIRST® par téléphone, WhatsApp ou e-mail — réservations 24 h/24, jour et nuit, à Genève, en Suisse et en Europe.",
    },
  },
  "legal/imprint": {
    en: { title: "Legal Notice", description: "Legal notice and company information for BLACKFIRST®." },
    fr: { title: "Mentions légales", description: "Mentions légales et informations sur la société BLACKFIRST®." },
  },
  "legal/privacy": {
    en: { title: "Privacy Policy", description: "How BLACKFIRST® collects, uses and protects personal data." },
    fr: {
      title: "Politique de confidentialité",
      description: "Comment BLACKFIRST® collecte, utilise et protège les données personnelles.",
    },
  },
  "legal/terms": {
    en: { title: "Terms of Use", description: "Terms governing the use of the BLACKFIRST® website and services." },
    fr: {
      title: "Conditions d'utilisation",
      description: "Les conditions régissant l'utilisation du site web et des services BLACKFIRST®.",
    },
  },
};

/**
 * Per-service (slug) localized title + description. Kept here so server-side
 * generateMetadata never imports the "use client" content module. The `[slug]`
 * page falls back to the English entry if a locale value is missing.
 */
export const SERVICE_META: Record<string, Record<AppLocale, PageMeta>> = {
  "airport-transfer": {
    en: {
      title: "Airport Executive Transfer",
      description:
        "Private airport transfers to and from Geneva, Zurich, Lausanne and the Alpine resorts — flight tracked, meet & greet, fixed fare.",
    },
    fr: {
      title: "Transfert aéroport Executive",
      description:
        "Transferts aéroport privés depuis et vers Genève, Zurich, Lausanne et les stations alpines — vol suivi, accueil personnalisé, tarif fixe.",
    },
  },
  "business-chauffeur": {
    en: {
      title: "Business Mobility",
      description:
        "A discreet, dedicated chauffeur for executives — by the hour, half-day or full day, with a signal-clear cabin for calls and documents.",
    },
    fr: {
      title: "Mobilité d'affaires",
      description:
        "Un chauffeur dédié et discret pour dirigeants — à l'heure, à la demi-journée ou à la journée, avec une cabine confidentielle pour vos appels.",
    },
  },
  events: {
    en: {
      title: "Luxury Events",
      description:
        "Weddings, private galas and celebrations chauffeured with the choreography an occasion deserves — one car or a coordinated fleet.",
    },
    fr: {
      title: "Événements de prestige",
      description:
        "Mariages, galas privés et célébrations avec chauffeur et la chorégraphie qu'une occasion mérite — une voiture ou une flotte coordonnée.",
    },
  },
  "long-distance": {
    en: {
      title: "International Chauffeur",
      description:
        "Long-distance journeys across Switzerland, France and Europe — Geneva to Courchevel, Milan or Lyon, door to door, tolls included.",
    },
    fr: {
      title: "Chauffeur international",
      description:
        "Longues distances à travers la Suisse, la France et l'Europe — Genève vers Courchevel, Milan ou Lyon, de porte à porte, péages inclus.",
    },
  },
};

/** Home / site default title + description, per locale. */
export const HOME_META: Record<AppLocale, PageMeta> = {
  en: {
    title: "BLACKFIRST® — Executive Chauffeur Service Geneva",
    description:
      "BLACKFIRST® — executive chauffeur & private mobility in Geneva. Airport transfers, business travel and long-distance journeys with Swiss precision and total discretion.",
  },
  fr: {
    title: "BLACKFIRST® — Service de chauffeur privé à Genève",
    description:
      "BLACKFIRST® — chauffeur d'exception & mobilité privée à Genève. Transferts aéroport, déplacements d'affaires et longues distances, avec la précision suisse et une discrétion totale.",
  },
};

/** Convenience accessor for a static page's localized metadata. */
export function pageMeta(key: keyof typeof PAGE_META, locale: AppLocale): PageMeta {
  return PAGE_META[key][locale];
}
