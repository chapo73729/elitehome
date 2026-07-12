/* ============================================================
   BLACKFIRST® — Pages destinations (SEO local, server-safe).
   Une entrée par ville desservie : métadonnées ciblées, contenu
   et trajets signature avec durées indicatives. Source unique
   pour /locations/[slug] (vue + metadata + JSON-LD + sitemap).
   ============================================================ */

import type { AppLocale } from "@/lib/i18n";

export type SignatureRoute = { from: string; to: string; time: string };

export type DestinationCopy = {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  body: string;
  highlights: string[];
  routesTitle: string;
};

export type Destination = {
  slug: string;
  /** Service lié (slug) pour le maillage interne. */
  service: "airport-transfer" | "long-distance" | "business-chauffeur";
  routes: Record<AppLocale, SignatureRoute[]>;
  fr: DestinationCopy;
  en: DestinationCopy;
};

export const DESTINATIONS: Destination[] = [
  {
    slug: "geneva",
    service: "airport-transfer",
    routes: {
      fr: [
        { from: "Aéroport de Genève (GVA)", to: "Genève centre", time: "≈ 15 min" },
        { from: "Genève", to: "Lausanne", time: "≈ 45 min" },
        { from: "Genève", to: "Verbier", time: "≈ 1 h 50" },
        { from: "Genève", to: "Courchevel", time: "≈ 2 h 15" },
      ],
      en: [
        { from: "Geneva Airport (GVA)", to: "Geneva city centre", time: "≈ 15 min" },
        { from: "Geneva", to: "Lausanne", time: "≈ 45 min" },
        { from: "Geneva", to: "Verbier", time: "≈ 1 h 50" },
        { from: "Geneva", to: "Courchevel", time: "≈ 2 h 15" },
      ],
    },
    fr: {
      metaTitle: "Chauffeur privé à Genève",
      metaDescription:
        "Chauffeur privé à Genève : transferts aéroport GVA, mise à disposition à l'heure, événements et longues distances. Mercedes Classe S et Classe V, tarif fixe, réservation 24 h/24.",
      h1: "Chauffeur privé à Genève",
      intro:
        "Genève est notre ville. De l'aéroport de Cointrin à la Rue du Rhône, des organisations internationales aux quais du lac, un chauffeur BLACKFIRST vous attend — à l'heure, en toute discrétion.",
      body: "Basés à Genève, nous connaissons la ville à la minute près : les créneaux d'atterrissage de GVA, la circulation du pont du Mont-Blanc, les entrées discrètes des grands hôtels et des banques privées. Chaque trajet est confirmé personnellement, au tarif fixe, dans une Mercedes récente préparée avant chaque course.",
      highlights: [
        "Prise en charge à l'aéroport de Genève avec suivi du vol et accueil personnalisé",
        "Mise à disposition à l'heure pour vos rendez-vous en ville",
        "Départs immédiats selon disponibilité — réservations 24 h/24",
      ],
      routesTitle: "Trajets signature depuis Genève",
    },
    en: {
      metaTitle: "Private chauffeur in Geneva",
      metaDescription:
        "Private chauffeur in Geneva: GVA airport transfers, hourly hire, events and long distance. Mercedes S-Class and V-Class, fixed fares, reservations 24/7.",
      h1: "Private chauffeur in Geneva",
      intro:
        "Geneva is our home. From Cointrin airport to Rue du Rhône, from the international organisations to the lakeside quays, a BLACKFIRST chauffeur is waiting — on time, in complete discretion.",
      body: "Based in Geneva, we know the city to the minute: GVA landing slots, Mont-Blanc bridge traffic, the discreet entrances of the grand hotels and private banks. Every journey is personally confirmed, at a fixed fare, in a recent Mercedes detailed before each ride.",
      highlights: [
        "Geneva Airport pickup with live flight tracking and meet & greet",
        "Hourly hire for your meetings across the city",
        "Immediate departures subject to availability — reservations 24/7",
      ],
      routesTitle: "Signature journeys from Geneva",
    },
  },
  {
    slug: "lausanne",
    service: "business-chauffeur",
    routes: {
      fr: [
        { from: "Genève", to: "Lausanne", time: "≈ 45 min" },
        { from: "Aéroport de Genève (GVA)", to: "Lausanne", time: "≈ 50 min" },
        { from: "Lausanne", to: "Montreux", time: "≈ 25 min" },
      ],
      en: [
        { from: "Geneva", to: "Lausanne", time: "≈ 45 min" },
        { from: "Geneva Airport (GVA)", to: "Lausanne", time: "≈ 50 min" },
        { from: "Lausanne", to: "Montreux", time: "≈ 25 min" },
      ],
    },
    fr: {
      metaTitle: "Chauffeur privé Genève – Lausanne",
      metaDescription:
        "Transfert en chauffeur privé entre Genève et Lausanne : berline Mercedes, tarif fixe, prise en charge à l'aéroport GVA ou en ville. Réservation 24 h/24.",
      h1: "Chauffeur privé Genève – Lausanne",
      intro:
        "La capitale olympique à trois quarts d'heure de Genève, dans le calme d'une berline. Sièges du CIO, EPFL, sièges d'entreprises de l'arc lémanique : vos rendez-vous commencent dans la voiture.",
      body: "Entre deux rives du Léman, l'autoroute A1 est notre couloir quotidien. Nous assurons les liaisons directes depuis l'aéroport de Genève ou le centre-ville, les mises à disposition à la journée pour vos tournées lémaniques, et les retours tardifs sans jamais vous presser.",
      highlights: [
        "Liaison directe Genève ⇄ Lausanne en Mercedes Classe S ou Classe V",
        "Mise à disposition pour vos journées d'affaires sur l'arc lémanique",
        "Wi-Fi et cabine silencieuse pour préparer vos réunions en route",
      ],
      routesTitle: "Trajets signature vers Lausanne",
    },
    en: {
      metaTitle: "Private chauffeur Geneva – Lausanne",
      metaDescription:
        "Private chauffeur transfer between Geneva and Lausanne: Mercedes saloon, fixed fare, pickup at GVA airport or in town. Reservations 24/7.",
      h1: "Private chauffeur Geneva – Lausanne",
      intro:
        "The Olympic capital, forty-five minutes from Geneva, in the calm of a saloon. IOC, EPFL, the head offices of the Lake Geneva arc: your meetings begin in the car.",
      body: "Between the two shores of Lake Geneva, the A1 motorway is our daily corridor. We run direct connections from Geneva Airport or the city centre, full-day hire for your Léman engagements, and late returns without ever rushing you.",
      highlights: [
        "Direct Geneva ⇄ Lausanne connection in an S-Class or V-Class",
        "Day hire for your business rounds across the Léman arc",
        "Wi-Fi and a quiet cabin to prepare your meetings en route",
      ],
      routesTitle: "Signature journeys to Lausanne",
    },
  },
  {
    slug: "montreux",
    service: "business-chauffeur",
    routes: {
      fr: [
        { from: "Genève", to: "Montreux", time: "≈ 1 h" },
        { from: "Aéroport de Genève (GVA)", to: "Montreux", time: "≈ 1 h 05" },
        { from: "Montreux", to: "Gstaad", time: "≈ 1 h" },
      ],
      en: [
        { from: "Geneva", to: "Montreux", time: "≈ 1 h" },
        { from: "Geneva Airport (GVA)", to: "Montreux", time: "≈ 1 h 05" },
        { from: "Montreux", to: "Gstaad", time: "≈ 1 h" },
      ],
    },
    fr: {
      metaTitle: "Chauffeur privé Genève – Montreux",
      metaDescription:
        "Chauffeur privé entre Genève et Montreux : Riviera vaudoise, festivals, palaces au bord du lac. Mercedes, tarif fixe, réservation 24 h/24.",
      h1: "Chauffeur privé Genève – Montreux",
      intro:
        "La Riviera vaudoise, son festival, ses palaces au bord de l'eau. Une heure de route entre vignes et lac — le trajet le plus doux de Suisse, à vivre depuis la banquette arrière.",
      body: "Montreux Jazz Festival, séjours au bord du lac, dîners à Vevey ou visites de Chillon : nous orchestrons vos allers-retours depuis Genève au cordeau, avec attente discrète sur place et retour à l'heure que vous choisissez.",
      highlights: [
        "Liaison directe le long du Léman, par la route des vignes si vous le souhaitez",
        "Service événement pendant le Montreux Jazz Festival",
        "Attente sur place et retour de nuit sans supplément surprise",
      ],
      routesTitle: "Trajets signature vers Montreux",
    },
    en: {
      metaTitle: "Private chauffeur Geneva – Montreux",
      metaDescription:
        "Private chauffeur between Geneva and Montreux: Vaud Riviera, festivals, lakeside palaces. Mercedes, fixed fare, reservations 24/7.",
      h1: "Private chauffeur Geneva – Montreux",
      intro:
        "The Vaud Riviera, its festival, its lakeside palaces. One hour between vineyards and water — Switzerland's gentlest drive, best enjoyed from the back seat.",
      body: "Montreux Jazz Festival, lakeside stays, dinners in Vevey or a visit to Chillon: we orchestrate your return journeys from Geneva to the minute, with discreet waiting on site and a departure at the hour you choose.",
      highlights: [
        "Direct connection along Lake Geneva — via the vineyard road on request",
        "Event service during the Montreux Jazz Festival",
        "On-site waiting and late-night returns with no surprise surcharge",
      ],
      routesTitle: "Signature journeys to Montreux",
    },
  },
  {
    slug: "verbier",
    service: "airport-transfer",
    routes: {
      fr: [
        { from: "Aéroport de Genève (GVA)", to: "Verbier", time: "≈ 1 h 50" },
        { from: "Genève", to: "Verbier", time: "≈ 1 h 50" },
        { from: "Verbier", to: "Zermatt (Täsch)", time: "≈ 1 h 45" },
      ],
      en: [
        { from: "Geneva Airport (GVA)", to: "Verbier", time: "≈ 1 h 50" },
        { from: "Geneva", to: "Verbier", time: "≈ 1 h 50" },
        { from: "Verbier", to: "Zermatt (Täsch)", time: "≈ 1 h 45" },
      ],
    },
    fr: {
      metaTitle: "Transfert Genève – Verbier",
      metaDescription:
        "Transfert privé de l'aéroport de Genève à Verbier : Mercedes équipée hiver, porte-skis, suivi du vol, tarif fixe. Le standard des stations, réservation 24 h/24.",
      h1: "Transfert privé Genève – Verbier",
      intro:
        "De la passerelle de GVA au pied des 4 Vallées en moins de deux heures. Skis chargés, cabine chauffée, route de montagne maîtrisée — la saison commence dès l'aéroport.",
      body: "L'hiver, Verbier est notre deuxième adresse. Véhicules équipés neige, chauffeurs habitués au val de Bagnes, prise en charge des skis et des bagages volumineux : vous atterrissez, nous nous occupons du reste — y compris les départs matinaux pour les premiers forfaits.",
      highlights: [
        "Équipement hiver complet et porte-skis sur toute la saison",
        "Suivi du vol et ajustement gratuit en cas de retard",
        "Classe V pour les familles et groupes jusqu'à 7 passagers",
      ],
      routesTitle: "Trajets signature vers Verbier",
    },
    en: {
      metaTitle: "Geneva – Verbier transfer",
      metaDescription:
        "Private transfer from Geneva Airport to Verbier: winter-equipped Mercedes, ski rack, flight tracking, fixed fare. The resort standard, reservations 24/7.",
      h1: "Private Geneva – Verbier transfer",
      intro:
        "From the GVA jet bridge to the foot of the 4 Vallées in under two hours. Skis loaded, cabin warmed, mountain road mastered — the season starts at the airport.",
      body: "In winter, Verbier is our second address. Snow-equipped vehicles, chauffeurs at home in the Val de Bagnes, skis and bulky luggage handled: you land, we take care of the rest — including early departures for first lifts.",
      highlights: [
        "Full winter equipment and ski racks all season long",
        "Flight tracking with free adjustment if you are delayed",
        "V-Class for families and groups of up to 7 passengers",
      ],
      routesTitle: "Signature journeys to Verbier",
    },
  },
  {
    slug: "zurich",
    service: "long-distance",
    routes: {
      fr: [
        { from: "Genève", to: "Zurich", time: "≈ 2 h 45" },
        { from: "Aéroport de Genève (GVA)", to: "Zurich (ZRH)", time: "≈ 3 h" },
        { from: "Zurich", to: "Genève", time: "≈ 2 h 45" },
      ],
      en: [
        { from: "Geneva", to: "Zurich", time: "≈ 2 h 45" },
        { from: "Geneva Airport (GVA)", to: "Zurich (ZRH)", time: "≈ 3 h" },
        { from: "Zurich", to: "Geneva", time: "≈ 2 h 45" },
      ],
    },
    fr: {
      metaTitle: "Chauffeur privé Genève – Zurich",
      metaDescription:
        "Liaison en chauffeur privé entre Genève et Zurich : bureau roulant, Wi-Fi, arrêts à la demande. L'alternative sereine au train et à l'avion, tarif fixe.",
      h1: "Chauffeur privé Genève – Zurich",
      intro:
        "D'une place financière à l'autre sans passer par une porte d'embarquement. Trois heures de bureau roulant — appels confidentiels, dossiers, ou simplement le paysage suisse.",
      body: "Paradeplatz, aéroport de Kloten, sièges de groupes alémaniques : nous relions les deux économies du pays porte à porte. Départ à votre heure, arrêts où vous voulez, et le même chauffeur pour l'aller-retour si votre journée l'exige.",
      highlights: [
        "Porte à porte Genève ⇄ Zurich sans rupture de charge",
        "Cabine de travail : Wi-Fi, chargeurs, confidentialité totale",
        "Aller-retour dans la journée avec le même chauffeur",
      ],
      routesTitle: "Trajets signature vers Zurich",
    },
    en: {
      metaTitle: "Private chauffeur Geneva – Zurich",
      metaDescription:
        "Private chauffeur connection between Geneva and Zurich: rolling office, Wi-Fi, stops on demand. The serene alternative to train and plane, fixed fare.",
      h1: "Private chauffeur Geneva – Zurich",
      intro:
        "From one financial centre to the other without a boarding gate. Three hours of rolling office — confidential calls, files, or simply the Swiss landscape.",
      body: "Paradeplatz, Kloten airport, the head offices of Swiss-German groups: we connect the country's two economies door to door. Departure at your hour, stops where you wish, and the same chauffeur for the return if your day demands it.",
      highlights: [
        "Door-to-door Geneva ⇄ Zurich with no changeovers",
        "Working cabin: Wi-Fi, chargers, total confidentiality",
        "Same-day return with the same chauffeur",
      ],
      routesTitle: "Signature journeys to Zurich",
    },
  },
  {
    slug: "courchevel",
    service: "long-distance",
    routes: {
      fr: [
        { from: "Aéroport de Genève (GVA)", to: "Courchevel 1850", time: "≈ 2 h 15" },
        { from: "Genève", to: "Courchevel", time: "≈ 2 h 15" },
        { from: "Courchevel", to: "Megève", time: "≈ 1 h 15" },
      ],
      en: [
        { from: "Geneva Airport (GVA)", to: "Courchevel 1850", time: "≈ 2 h 15" },
        { from: "Geneva", to: "Courchevel", time: "≈ 2 h 15" },
        { from: "Courchevel", to: "Megève", time: "≈ 1 h 15" },
      ],
    },
    fr: {
      metaTitle: "Transfert Genève – Courchevel",
      metaDescription:
        "Transfert privé Genève – Courchevel 1850 : Mercedes équipée hiver, formalités de frontière gérées, tarif fixe tout compris. Réservation 24 h/24.",
      h1: "Transfert privé Genève – Courchevel",
      intro:
        "Des Trois Vallées à l'aéroport de Genève, la route la plus courte passe par nous. Frontière, cols et lacets de la Tarentaise : votre chauffeur les connaît par toutes les neiges.",
      body: "Courchevel 1850, Méribel, Val Thorens : chaque hiver, nous accompagnons nos clients de la passerelle GVA jusqu'à la conciergerie du chalet. Passage de frontière fluide, équipement neige complet, coordination avec vos chefs de chalet — l'altitude sans l'effort.",
      highlights: [
        "Liaison directe GVA ⇄ Trois Vallées, frontière gérée",
        "Coordination avec votre conciergerie ou chef de chalet",
        "Classe V pour les groupes, skis et bagages volumineux",
      ],
      routesTitle: "Trajets signature vers Courchevel",
    },
    en: {
      metaTitle: "Geneva – Courchevel transfer",
      metaDescription:
        "Private Geneva – Courchevel 1850 transfer: winter-equipped Mercedes, border formalities handled, all-inclusive fixed fare. Reservations 24/7.",
      h1: "Private Geneva – Courchevel transfer",
      intro:
        "From the Trois Vallées to Geneva Airport, the shortest road runs through us. Border, passes and the hairpins of the Tarentaise: your chauffeur knows them in every snow.",
      body: "Courchevel 1850, Méribel, Val Thorens: every winter we accompany our clients from the GVA jet bridge to the chalet concierge. Smooth border crossing, full snow equipment, coordination with your chalet staff — altitude without the effort.",
      highlights: [
        "Direct GVA ⇄ Trois Vallées connection, border handled",
        "Coordination with your concierge or chalet manager",
        "V-Class for groups, skis and bulky luggage",
      ],
      routesTitle: "Signature journeys to Courchevel",
    },
  },
  {
    slug: "lyon",
    service: "long-distance",
    routes: {
      fr: [
        { from: "Genève", to: "Lyon", time: "≈ 1 h 45" },
        { from: "Aéroport de Genève (GVA)", to: "Lyon Part-Dieu", time: "≈ 1 h 50" },
        { from: "Lyon (LYS)", to: "Genève", time: "≈ 1 h 40" },
      ],
      en: [
        { from: "Geneva", to: "Lyon", time: "≈ 1 h 45" },
        { from: "Geneva Airport (GVA)", to: "Lyon Part-Dieu", time: "≈ 1 h 50" },
        { from: "Lyon (LYS)", to: "Geneva", time: "≈ 1 h 40" },
      ],
    },
    fr: {
      metaTitle: "Chauffeur privé Genève – Lyon",
      metaDescription:
        "Chauffeur privé entre Genève et Lyon : liaison transfrontalière directe, correspondances aéroport LYS, tarif fixe tout compris, péages inclus.",
      h1: "Chauffeur privé Genève – Lyon",
      intro:
        "La capitale des Gaules à moins de deux heures de Genève, sans quai de gare ni file d'embarquement. Une liaison transfrontalière que nous parcourons chaque semaine.",
      body: "Affaires à la Part-Dieu, correspondance à Saint-Exupéry, week-end presqu'île : nous gérons la frontière, les péages et le stationnement — vous ne gérez rien. Tarif fixe communiqué à l'avance, tout compris.",
      highlights: [
        "Liaison directe Genève ⇄ Lyon, péages et frontière inclus",
        "Correspondances avec l'aéroport de Lyon Saint-Exupéry",
        "Aller-retour dans la journée pour vos rendez-vous",
      ],
      routesTitle: "Trajets signature vers Lyon",
    },
    en: {
      metaTitle: "Private chauffeur Geneva – Lyon",
      metaDescription:
        "Private chauffeur between Geneva and Lyon: direct cross-border connection, LYS airport links, all-inclusive fixed fare, tolls included.",
      h1: "Private chauffeur Geneva – Lyon",
      intro:
        "The capital of the Gauls, under two hours from Geneva, with no station platform and no boarding queue. A cross-border run we drive every week.",
      body: "Business at Part-Dieu, a connection at Saint-Exupéry, a weekend on the Presqu'île: we handle the border, the tolls and the parking — you handle nothing. Fixed fare quoted in advance, all inclusive.",
      highlights: [
        "Direct Geneva ⇄ Lyon connection, tolls and border included",
        "Connections with Lyon Saint-Exupéry airport",
        "Same-day return for your meetings",
      ],
      routesTitle: "Signature journeys to Lyon",
    },
  },
  {
    slug: "milan",
    service: "long-distance",
    routes: {
      fr: [
        { from: "Genève", to: "Milan", time: "≈ 4 h" },
        { from: "Genève", to: "Lac de Côme", time: "≈ 3 h 45" },
        { from: "Milan (MXP)", to: "Genève", time: "≈ 3 h 45" },
      ],
      en: [
        { from: "Geneva", to: "Milan", time: "≈ 4 h" },
        { from: "Geneva", to: "Lake Como", time: "≈ 3 h 45" },
        { from: "Milan (MXP)", to: "Geneva", time: "≈ 3 h 45" },
      ],
    },
    fr: {
      metaTitle: "Chauffeur privé Genève – Milan",
      metaDescription:
        "Chauffeur privé entre Genève et Milan : traversée des Alpes en Mercedes, semaine de la mode, lacs italiens. Tarif fixe, vignettes et péages inclus.",
      h1: "Chauffeur privé Genève – Milan",
      intro:
        "Genève – Milan par le Grand-Saint-Bernard ou le Simplon : quatre heures de traversée alpine dont on ne se lasse pas. Mode, finance, lacs italiens — arrivez reposé.",
      body: "Semaine de la mode, salon du meuble, villas du lac de Côme : nos liaisons italiennes sont pensées comme un voyage, pas comme un transport. Pauses à votre rythme, itinéraire panoramique sur demande, et un chauffeur qui connaît Milan comme Genève.",
      highlights: [
        "Traversée des Alpes en Classe S ou Classe V, vignettes incluses",
        "Fashion Week, Salone del Mobile : réservations anticipées conseillées",
        "Extensions lac de Côme, Portofino et lacs italiens",
      ],
      routesTitle: "Trajets signature vers Milan",
    },
    en: {
      metaTitle: "Private chauffeur Geneva – Milan",
      metaDescription:
        "Private chauffeur between Geneva and Milan: Alpine crossing by Mercedes, fashion week, the Italian lakes. Fixed fare, vignettes and tolls included.",
      h1: "Private chauffeur Geneva – Milan",
      intro:
        "Geneva – Milan via the Great St Bernard or the Simplon: four hours of Alpine crossing you never tire of. Fashion, finance, the Italian lakes — arrive rested.",
      body: "Fashion week, the Salone del Mobile, the villas of Lake Como: our Italian connections are designed as a journey, not a transport. Breaks at your pace, scenic routing on request, and a chauffeur who knows Milan as well as Geneva.",
      highlights: [
        "Alpine crossing in an S-Class or V-Class, vignettes included",
        "Fashion Week and Salone del Mobile: early booking advised",
        "Lake Como, Portofino and Italian-lakes extensions",
      ],
      routesTitle: "Signature journeys to Milan",
    },
  },
];

export function getDestination(slug: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.slug === slug);
}
