/* ============================================================
   BLACKFIRST® — FAQ (server-safe: pas de "use client").
   Source unique pour la section FAQ de la page réservation ET
   les données structurées FAQPage (generateMetadata / JSON-LD).
   ============================================================ */

import type { AppLocale } from "@/lib/i18n";

export type FaqItem = { q: string; a: string };

export const FAQ: Record<AppLocale, { title: string; intro: string; items: FaqItem[] }> = {
  fr: {
    title: "Questions fréquentes",
    intro: "Tout ce qu'il faut savoir avant de réserver.",
    items: [
      {
        q: "Comment réserver un chauffeur ?",
        a: "Par le formulaire de réservation, par WhatsApp ou par téléphone au +41 79 292 77 59. Chaque demande est confirmée personnellement, avec un devis fixe, dans l'heure pendant le service.",
      },
      {
        q: "Les tarifs sont-ils fixes ?",
        a: "Oui. Le prix communiqué avec votre confirmation est fixe et tout compris — véhicule, chauffeur, carburant, péages. Aucun compteur, aucune surprise à l'arrivée.",
      },
      {
        q: "Que se passe-t-il si mon vol est retardé ?",
        a: "Nous suivons votre vol en direct et ajustons la prise en charge sans frais. À l'aéroport, 60 minutes d'attente sont offertes après l'atterrissage.",
      },
      {
        q: "Puis-je modifier ou annuler ma réservation ?",
        a: "Oui — contactez-nous simplement. Les conditions de modification et d'annulation vous sont communiquées avec votre devis, avant toute confirmation.",
      },
      {
        q: "Acceptez-vous les demandes de dernière minute ?",
        a: "Les réservations sont ouvertes 24 h/24, 7 j/7. Selon la disponibilité des chauffeurs, nous faisons notre possible pour honorer les demandes immédiates.",
      },
      {
        q: "Dans quelles langues le service est-il assuré ?",
        a: "Nos chauffeurs vous accueillent en français, en anglais et en allemand.",
      },
    ],
  },
  en: {
    title: "Frequently asked questions",
    intro: "Everything you need to know before booking.",
    items: [
      {
        q: "How do I book a chauffeur?",
        a: "Through the booking form, by WhatsApp or by phone at +41 79 292 77 59. Every request is confirmed personally, with a fixed quote, within the hour during service.",
      },
      {
        q: "Are your fares fixed?",
        a: "Yes. The price sent with your confirmation is fixed and all-inclusive — vehicle, chauffeur, fuel and tolls. No meter, no surprises on arrival.",
      },
      {
        q: "What happens if my flight is delayed?",
        a: "We track your flight live and adjust the pickup at no cost. At the airport, 60 minutes of waiting time are complimentary after landing.",
      },
      {
        q: "Can I change or cancel my reservation?",
        a: "Yes — simply contact us. Modification and cancellation terms are shared with your quote, before anything is confirmed.",
      },
      {
        q: "Do you take last-minute requests?",
        a: "Reservations are open 24/7. Subject to chauffeur availability, we do our best to honour immediate requests.",
      },
      {
        q: "Which languages do you serve in?",
        a: "Our chauffeurs welcome you in French, English and German.",
      },
    ],
  },
};
