"use client";

import { useLang, type Lang } from "./lang";

/* ============================================================
   BLACKFIRST® — Centralized, localized site content.
   EN is the source of truth; FR is deep-merged over it (arrays by
   index). French micro-typography (thin NBSP before ; : ! ?, inside
   « », curly apostrophes) is applied automatically to the FR override —
   write plain FR strings, never hand-place NBSPs.
   ============================================================ */

const en = {
  nav: [
    { label: "Services", href: "/services" },
    { label: "Fleet", href: "/fleet" },
    { label: "Locations", href: "/locations" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  common: {
    book: "Book a chauffeur",
    quote: "Request a quote",
    menu: "Open menu",
    close: "Close menu",
    skip: "Skip to content",
    callUs: "Call",
    whatsapp: "WhatsApp",
    email: "Email",
    backHome: "← Home",
  },
  hero: {
    eyebrow: "Executive Chauffeur Service · Geneva",
    lines: ["BLACK", "FIRST"],
    headline: "Executive chauffeur service in Geneva.",
    subtitle:
      "Private airport transfers, business travel and long-distance journeys — driven with Swiss precision and absolute discretion.",
    book: "Book a chauffeur",
    quote: "Request a quote",
    scroll: "SCROLL",
    scrollHint: "More than a journey. An experience.",
  },
  manifesto: {
    tag: "MANIFESTO",
    lines: ["More than a journey.", "An experience."],
    outro: "This is private mobility, engineered around you.",
    values: [
      { k: "Discretion", v: "What happens in the cabin stays there." },
      { k: "Excellence", v: "Every detail, considered and rehearsed." },
      { k: "Punctuality", v: "Early is on time. We plan for it." },
      { k: "Comfort", v: "A quiet cabin that feels like arriving." },
    ],
  },
  experience: {
    eyebrow: "The Cabin",
    title: "Step in. The city goes quiet.",
    intro: "Every car is a private lounge on the move.",
    points: [
      { k: "Fine leather", v: "Hand-finished interiors, climate to your taste." },
      { k: "Still cabin", v: "Sound-insulated calm — call, read, or simply rest." },
      { k: "Refreshments", v: "Chilled water, Wi-Fi and a charge point, always." },
      { k: "Your tempo", v: "Conversation or silence — the choice is yours." },
    ],
    note: "Prefer to work? A tablet, stable connectivity and a signal-clear cabin come standard.",
  },
  routes: {
    eyebrow: "Geneva & Europe",
    title: "From the lake to the Alps — and beyond.",
    intro: "One house, one standard, across Switzerland and Europe.",
    hint: "Geneva Airport · Lausanne · Zurich · the Alps · Europe",
  },
  services: {
    eyebrow: "Services",
    title: "Four ways we move you.",
    intro: "Airport, business, events, long distance — one seamless standard.",
    explore: "Explore →",
    viewAll: "View all services",
    indexEyebrow: "Private mobility, curated.",
    indexIntro:
      "Executive chauffeuring is the house. Under it, four services cover every kind of journey. Choose the one that fits.",
    items: [
      {
        slug: "airport-transfer",
        title: "Airport Executive",
        blurb: "Private transfers to and from every airport and station.",
        tagline: "Land. Step in. Gone.",
        overview:
          "A chauffeur waiting the moment you land — name in hand, flight tracked, luggage handled. From Geneva Airport to the city, the lake or the ski resorts, your transfer is timed to the minute and never rushed.",
        highlights: [
          "Live flight tracking — we adjust to delays at no cost",
          "Meet & greet in the arrivals hall, name board in hand",
          "60 minutes of complimentary wait time on airport pickups",
          "Child seats and extra luggage on request",
        ],
        destinations: [
          "Geneva Airport (GVA)",
          "Lausanne",
          "Zurich Airport (ZRH)",
          "Alpine resorts",
        ],
        includes: [
          "Door-to-door private transfer",
          "Fixed, all-inclusive fare quoted in advance",
          "Flight monitoring and schedule adjustment",
          "Bottled water, Wi-Fi and phone chargers",
        ],
        process: [
          { t: "Book", d: "Send us your flight and destination — we handle the rest." },
          { t: "Track", d: "We watch your flight and time the pickup to your landing." },
          { t: "Meet", d: "Your chauffeur greets you in arrivals, name in hand." },
          { t: "Arrive", d: "A calm, direct transfer to your door." },
        ],
      },
      {
        slug: "business-chauffeur",
        title: "Business Mobility",
        blurb: "A discreet chauffeur for executives and professional days.",
        tagline: "Your day, driven.",
        overview:
          "For directors, delegations and professional appointments: a dedicated chauffeur for a half-day, a full day or a multi-stop schedule. A mobile office between meetings — punctual, private and predictable.",
        highlights: [
          "By the hour, half-day or full day — as your agenda demands",
          "Multi-stop itineraries planned around your meetings",
          "Signal-clear, confidential cabin for calls and documents",
          "The same trusted chauffeur throughout the engagement",
        ],
        destinations: [
          "Geneva CBD & Rue du Rhône",
          "Lausanne & the arc lémanique",
          "Zurich & Basel",
          "Cross-border to Lyon & Milan",
        ],
        includes: [
          "Dedicated chauffeur for the booked period",
          "Flexible, on-the-day itinerary changes",
          "Discreet waiting between appointments",
          "Wi-Fi, chargers and refreshments on board",
        ],
        process: [
          { t: "Brief", d: "Share your agenda; we build the day around it." },
          { t: "Assign", d: "A single chauffeur is dedicated to you for the day." },
          { t: "Drive", d: "On time to every stop, ready when you are." },
          { t: "Adapt", d: "Plans change — we adjust without a word needed twice." },
        ],
      },
      {
        slug: "events",
        title: "Luxury Events",
        blurb: "Weddings, private galas and occasions that deserve arrival.",
        tagline: "Arrive the way it matters.",
        overview:
          "Weddings, private celebrations, galas and salons — chauffeured with the choreography an occasion deserves. One car or a coordinated fleet, timed to your programme and delivered without a seam.",
        highlights: [
          "Wedding cars presented and detailed for the day",
          "Coordinated fleets for guests and delegations",
          "A single point of contact managing the timing",
          "Discreet, formally dressed chauffeurs",
        ],
        destinations: [
          "Lakeside venues & grand hotels",
          "Private estates & vineyards",
          "Geneva & Lausanne galas",
          "Alpine celebrations",
        ],
        includes: [
          "Route and timing rehearsed in advance",
          "Vehicles presented to occasion standard",
          "Fleet coordination for larger parties",
          "One coordinator from booking to farewell",
        ],
        process: [
          { t: "Plan", d: "We map the programme, venues and timings with you." },
          { t: "Rehearse", d: "Routes and hand-offs are confirmed before the day." },
          { t: "Present", d: "Cars arrive detailed, chauffeurs formally dressed." },
          { t: "Deliver", d: "Every arrival on cue, every guest cared for." },
        ],
      },
      {
        slug: "long-distance",
        title: "International Chauffeur",
        blurb: "Long-distance journeys across Switzerland, France and Europe.",
        tagline: "Borders, quietly crossed.",
        overview:
          "City to city, country to country — the comfortable alternative to a flight or a train. Geneva to Courchevel, Milan or Lyon, in one uninterrupted journey, at the pace you set.",
        highlights: [
          "Direct point-to-point across CH, FR, IT and beyond",
          "Overnight and multi-day itineraries arranged",
          "Comfort stops and scenic routing on request",
          "All tolls, vignettes and border formalities handled",
        ],
        destinations: [
          "Geneva ⇄ Courchevel",
          "Geneva ⇄ Milan",
          "Geneva ⇄ Lyon",
          "Bespoke European routes",
        ],
        includes: [
          "One chauffeur for the full journey",
          "Tolls, vignettes and fuel included in the fare",
          "Refreshments and comfort stops as you wish",
          "Door-to-door, city-centre to city-centre",
        ],
        process: [
          { t: "Route", d: "We plan the journey, stops and timing with you." },
          { t: "Prepare", d: "Tolls, vignettes and paperwork sorted in advance." },
          { t: "Travel", d: "One calm ride, your pace, your playlist." },
          { t: "Deliver", d: "Straight to the door, wherever it is." },
        ],
      },
    ],
  },
  fleet: {
    eyebrow: "The Fleet",
    title: "A quiet fleet, immaculately kept.",
    intro: "Recent, top-of-the-range vehicles, detailed before every journey.",
    viewAll: "View the fleet",
    seatsLabel: "Passengers",
    luggageLabel: "Luggage",
    electricLabel: "Zero-emission",
    items: [
      {
        id: "s-class",
        name: "Mercedes-Benz S-Class",
        tagline: "The flagship.",
        blurb: "The definitive executive saloon — silent, spacious, exact.",
        features: ["Rear climate comfort", "Reclining rear seats", "Ambient lighting", "Privacy glass"],
      },
      {
        id: "e-class",
        name: "Mercedes-Benz E-Class",
        tagline: "The everyday executive.",
        blurb: "Refined business travel with the comfort you expect from us.",
        features: ["Business-class comfort", "Generous luggage", "Quiet cabin", "On-board Wi-Fi"],
      },
      {
        id: "v-class",
        name: "Mercedes-Benz V-Class VIP",
        tagline: "For the party.",
        blurb: "A first-class cabin for groups, families and delegations.",
        features: ["Up to 7 seats", "Conference seating", "Generous luggage", "Full standing headroom"],
      },
      {
        id: "eqs",
        name: "Mercedes-Benz EQS",
        tagline: "Silent. Electric.",
        blurb: "Zero-emission luxury for the environmentally minded traveller.",
        features: ["Fully electric", "Near-silent drive", "Rear comfort suite", "Long range"],
      },
    ],
  },
  locations: {
    eyebrow: "Areas Served",
    title: "Where we drive.",
    intro: "Based in Geneva, at home across the arc lémanique, the Alps and Europe.",
    hubLabel: "Home base",
    note: "Don't see your destination? We arrange bespoke journeys anywhere in Europe.",
    items: [
      { id: "geneva", name: "Geneva", blurb: "Our home city — airport, CBD, lakeside and the airport hotels." },
      { id: "lausanne", name: "Lausanne", blurb: "The Olympic capital and the arc lémanique, minutes away." },
      { id: "montreux", name: "Montreux", blurb: "The Riviera, festivals and lakeside grand hotels." },
      { id: "verbier", name: "Verbier", blurb: "Premier alpine transfers, chalets and heli-pads." },
      { id: "courchevel", name: "Courchevel", blurb: "The French Alps — direct from Geneva, door to chalet." },
      { id: "lyon", name: "Lyon", blurb: "Cross-border business and airport connections." },
      { id: "milan", name: "Milan", blurb: "Fashion, finance and the Italian lakes." },
    ],
  },
  booking: {
    eyebrow: "Reservation",
    title: "Your journey starts here.",
    intro: "Tell us where and when. We reply with a fixed quote, fast.",
    promise: "We confirm every reservation personally, within the hour during service.",
    fromLabel: "Pick-up",
    fromPlaceholder: "Address, airport or hotel",
    toLabel: "Destination",
    toPlaceholder: "Where to?",
    dateLabel: "Date",
    timeLabel: "Time",
    passengersLabel: "Passengers",
    luggageLabel: "Luggage",
    vehicleLabel: "Vehicle",
    vehicleAny: "No preference",
    nameLabel: "Name",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "you@email.com",
    phoneLabel: "Phone",
    phonePlaceholder: "+41 …",
    notesLabel: "Anything else?",
    notesPlaceholder: "Flight number, child seats, special requests…",
    submit: "Request my quote",
    submitting: "Sending…",
    sentTitle: "Request received.",
    sentBody: "Thank you. We'll confirm your reservation and fixed quote shortly.",
    sendAnother: "Make another request",
    errorPrefix: "Couldn't send — please email or call us",
    nameError: "Please tell us your name.",
    emailError: "That email doesn't look right.",
    routeError: "Please tell us where you're travelling from and to.",
  },
  about: {
    eyebrow: "About BLACKFIRST",
    title: "A Geneva house for private mobility.",
    lead: "BLACKFIRST is built on a simple idea: that being driven should feel like the most composed part of your day.",
    body: [
      "We are a Geneva-based chauffeur house serving business travellers, private clients, hotels and event planners across Switzerland and Europe. Not a taxi company — a mobility house, closer in spirit to a five-star hotel or private aviation than to a ride hail.",
      "Every journey is handled by a professional chauffeur, in a recent Mercedes-Benz kept immaculate, timed to the minute and delivered with the discretion our clients expect.",
    ],
    pillarsTitle: "What we stand for",
    pillars: [
      { t: "Swiss precision", d: "On time, every time. We plan for traffic, weather and the unexpected — so you never do." },
      { t: "Total discretion", d: "Confidentiality is the service. Your movements, calls and conversations stay private." },
      { t: "Genuine care", d: "The small things — the temperature, the water, the quiet — are the whole thing." },
      { t: "One standard", d: "Airport run or European tour, the standard never moves." },
    ],
    closing: "Beyond the journey.",
  },
  contact: {
    eyebrow: "Contact",
    title: "At your service.",
    intro: "Reach us however suits you. We answer quickly, day and night.",
    phoneLabel: "Call us",
    whatsappLabel: "WhatsApp",
    emailLabel: "Email",
    hoursLabel: "Hours",
    hours: "Reservations 24 / 7 · 365 days a year",
    baseLabel: "Based in",
    base: "Geneva, Switzerland",
    responseNote: "Prefer to book online? Use the reservation form — we reply with a fixed quote fast.",
    bookCta: "Open the booking form",
  },
  footer: {
    tagline: "Executive chauffeur & private mobility — Geneva, Switzerland.",
    explore: "Explore",
    company: "Company",
    contact: "Contact",
    rights: "All rights reserved.",
    legalNotice: "Legal Notice",
    privacy: "Privacy",
    terms: "Terms",
    copyHint: "Click to copy",
    copied: "Email copied",
    availability: "Available 24 / 7",
  },
  service: {
    all: "← All services",
    label: "Service",
    overview: "Overview",
    highlights: "Highlights",
    destinations: "Where we go",
    includes: "What's included",
    process: "How it works",
    book: "Book this service",
    quote: "Request a quote",
    prev: "← Previous",
    next: "Next →",
    home: "← Home",
    ctaTitle: "Ready when you are.",
    ctaBody: "Tell us where and when. We'll reply with a fixed quote and confirm your chauffeur.",
  },
};

export type Content = typeof en;

/* ---------- French overrides (text only; neutral fields inherit) --------- */
const fr: DeepPartial<Content> = {
  nav: [
    { label: "Services" },
    { label: "Flotte" },
    { label: "Destinations" },
    { label: "À propos" },
    { label: "Contact" },
  ],
  common: {
    book: "Réserver un chauffeur",
    quote: "Demander un devis",
    menu: "Ouvrir le menu",
    close: "Fermer le menu",
    skip: "Aller au contenu",
    callUs: "Appeler",
    whatsapp: "WhatsApp",
    email: "E-mail",
    backHome: "← Accueil",
  },
  hero: {
    eyebrow: "Service de chauffeur privé · Genève",
    headline: "Service de chauffeur privé à Genève.",
    subtitle:
      "Transferts aéroport privés, déplacements d'affaires et longues distances — avec la précision suisse et une discrétion absolue.",
    book: "Réserver un chauffeur",
    quote: "Demander un devis",
    scroll: "DÉFILER",
    scrollHint: "Plus qu'un trajet. Une expérience.",
  },
  manifesto: {
    tag: "MANIFESTE",
    lines: ["Plus qu'un trajet.", "Une expérience."],
    outro: "La mobilité privée, pensée autour de vous.",
    values: [
      { k: "Discrétion", v: "Ce qui se passe dans l'habitacle y reste." },
      { k: "Excellence", v: "Chaque détail, pensé et répété." },
      { k: "Ponctualité", v: "En avance, c'est à l'heure. Nous l'anticipons." },
      { k: "Confort", v: "Un habitacle silencieux, comme une arrivée." },
    ],
  },
  experience: {
    eyebrow: "L'habitacle",
    title: "Montez. La ville se tait.",
    intro: "Chaque voiture est un salon privé en mouvement.",
    points: [
      { k: "Cuir fin", v: "Intérieurs façonnés main, climat à votre goût." },
      { k: "Cabine feutrée", v: "Un calme insonorisé — appelez, lisez, ou reposez-vous." },
      { k: "Rafraîchissements", v: "Eau fraîche, Wi-Fi et prise de charge, toujours." },
      { k: "Votre tempo", v: "Conversation ou silence — vous choisissez." },
    ],
    note: "Envie de travailler ? Tablette, connexion stable et cabine au calme, en standard.",
  },
  routes: {
    eyebrow: "Genève & Europe",
    title: "Du lac aux Alpes — et au-delà.",
    intro: "Une maison, un standard, à travers la Suisse et l'Europe.",
    hint: "Aéroport de Genève · Lausanne · Zurich · les Alpes · l'Europe",
  },
  services: {
    eyebrow: "Services",
    title: "Quatre façons de vous conduire.",
    intro: "Aéroport, affaires, événements, longue distance — un seul standard.",
    explore: "Découvrir →",
    viewAll: "Voir tous les services",
    indexEyebrow: "La mobilité privée, sur mesure.",
    indexIntro:
      "Le chauffeur d'exception est la maison. En dessous, quatre services couvrent chaque type de trajet. Choisissez le vôtre.",
    items: [
      {
        title: "Aéroport Executive",
        blurb: "Transferts privés depuis et vers chaque aéroport et gare.",
        tagline: "Atterrissez. Montez. Partez.",
        overview:
          "Un chauffeur qui vous attend dès l'atterrissage — nom en main, vol suivi, bagages pris en charge. De l'aéroport de Genève à la ville, au lac ou aux stations de ski, votre transfert est réglé à la minute et jamais précipité.",
        highlights: [
          "Suivi des vols en direct — nous ajustons aux retards sans frais",
          "Accueil personnalisé dans le hall d'arrivée, pancarte à votre nom",
          "60 minutes d'attente offertes sur les prises en charge à l'aéroport",
          "Sièges enfant et bagages supplémentaires sur demande",
        ],
        destinations: [
          "Aéroport de Genève (GVA)",
          "Lausanne",
          "Aéroport de Zurich (ZRH)",
          "Stations alpines",
        ],
        includes: [
          "Transfert privé de porte à porte",
          "Tarif fixe et tout compris, communiqué à l'avance",
          "Suivi du vol et ajustement de l'horaire",
          "Eau, Wi-Fi et chargeurs de téléphone",
        ],
        process: [
          { t: "Réserver", d: "Communiquez votre vol et votre destination — on s'occupe du reste." },
          { t: "Suivre", d: "Nous surveillons votre vol et calons la prise en charge sur l'atterrissage." },
          { t: "Accueillir", d: "Votre chauffeur vous accueille à l'arrivée, nom en main." },
          { t: "Arriver", d: "Un transfert direct et serein jusqu'à votre porte." },
        ],
      },
      {
        title: "Mobilité d'affaires",
        blurb: "Un chauffeur discret pour dirigeants et journées professionnelles.",
        tagline: "Votre journée, conduite.",
        overview:
          "Pour les dirigeants, les délégations et les rendez-vous professionnels : un chauffeur dédié pour une demi-journée, une journée ou un programme à plusieurs étapes. Un bureau mobile entre deux réunions — ponctuel, privé et prévisible.",
        highlights: [
          "À l'heure, à la demi-journée ou à la journée — selon votre agenda",
          "Itinéraires multi-étapes calés sur vos réunions",
          "Cabine confidentielle et au calme pour vos appels et documents",
          "Le même chauffeur de confiance tout au long de la mission",
        ],
        destinations: [
          "Centre de Genève & Rue du Rhône",
          "Lausanne & l'arc lémanique",
          "Zurich & Bâle",
          "Transfrontalier vers Lyon & Milan",
        ],
        includes: [
          "Chauffeur dédié pour la période réservée",
          "Modifications d'itinéraire le jour même",
          "Attente discrète entre les rendez-vous",
          "Wi-Fi, chargeurs et rafraîchissements à bord",
        ],
        process: [
          { t: "Briefer", d: "Partagez votre agenda ; nous construisons la journée autour." },
          { t: "Affecter", d: "Un seul chauffeur vous est dédié pour la journée." },
          { t: "Conduire", d: "À l'heure à chaque étape, prêt quand vous l'êtes." },
          { t: "S'adapter", d: "Les plans changent — nous ajustons sans qu'il faille le répéter." },
        ],
      },
      {
        title: "Événements de prestige",
        blurb: "Mariages, galas privés et occasions qui méritent une arrivée.",
        tagline: "Arrivez comme il se doit.",
        overview:
          "Mariages, célébrations privées, galas et salons — avec chauffeur et la chorégraphie qu'une occasion mérite. Une voiture ou une flotte coordonnée, calée sur votre programme et livrée sans la moindre couture.",
        highlights: [
          "Voitures de mariage présentées et soignées pour le jour J",
          "Flottes coordonnées pour invités et délégations",
          "Un interlocuteur unique qui gère le timing",
          "Chauffeurs discrets, en tenue de cérémonie",
        ],
        destinations: [
          "Domaines au bord du lac & grands hôtels",
          "Propriétés privées & vignobles",
          "Galas de Genève & Lausanne",
          "Célébrations alpines",
        ],
        includes: [
          "Itinéraire et timing répétés à l'avance",
          "Véhicules présentés au niveau de l'occasion",
          "Coordination de flotte pour les grands groupes",
          "Un coordinateur, de la réservation aux adieux",
        ],
        process: [
          { t: "Planifier", d: "Nous cartographions le programme, les lieux et les horaires avec vous." },
          { t: "Répéter", d: "Itinéraires et relais confirmés avant le jour J." },
          { t: "Présenter", d: "Voitures soignées, chauffeurs en tenue." },
          { t: "Livrer", d: "Chaque arrivée à la seconde, chaque invité choyé." },
        ],
      },
      {
        title: "Chauffeur international",
        blurb: "Longues distances à travers la Suisse, la France et l'Europe.",
        tagline: "Les frontières, franchies en silence.",
        overview:
          "De ville en ville, de pays en pays — l'alternative confortable à l'avion ou au train. Genève vers Courchevel, Milan ou Lyon, en un seul trajet ininterrompu, au rythme que vous fixez.",
        highlights: [
          "Point à point direct à travers CH, FR, IT et au-delà",
          "Itinéraires de nuit et sur plusieurs jours organisés",
          "Pauses confort et routes panoramiques sur demande",
          "Péages, vignettes et formalités de frontière pris en charge",
        ],
        destinations: [
          "Genève ⇄ Courchevel",
          "Genève ⇄ Milan",
          "Genève ⇄ Lyon",
          "Routes européennes sur mesure",
        ],
        includes: [
          "Un seul chauffeur pour tout le trajet",
          "Péages, vignettes et carburant inclus dans le tarif",
          "Rafraîchissements et pauses confort à votre gré",
          "De porte à porte, de centre-ville à centre-ville",
        ],
        process: [
          { t: "Tracer", d: "Nous planifions le trajet, les arrêts et l'horaire avec vous." },
          { t: "Préparer", d: "Péages, vignettes et papiers réglés à l'avance." },
          { t: "Voyager", d: "Un trajet serein, votre rythme, votre playlist." },
          { t: "Livrer", d: "Directement à la porte, où qu'elle soit." },
        ],
      },
    ],
  },
  fleet: {
    eyebrow: "La flotte",
    title: "Une flotte silencieuse, impeccablement tenue.",
    intro: "Des véhicules récents haut de gamme, soignés avant chaque trajet.",
    viewAll: "Voir la flotte",
    seatsLabel: "Passagers",
    luggageLabel: "Bagages",
    electricLabel: "Zéro émission",
    items: [
      {
        tagline: "Le vaisseau amiral.",
        blurb: "La berline d'exception par définition — silencieuse, spacieuse, exacte.",
        features: ["Confort climatique arrière", "Sièges arrière inclinables", "Éclairage d'ambiance", "Vitres teintées"],
      },
      {
        tagline: "L'executive au quotidien.",
        blurb: "Un déplacement d'affaires raffiné, avec le confort que vous attendez.",
        features: ["Confort business", "Coffre généreux", "Cabine silencieuse", "Wi-Fi à bord"],
      },
      {
        tagline: "Pour le groupe.",
        blurb: "Une cabine première classe pour groupes, familles et délégations.",
        features: ["Jusqu'à 7 places", "Sièges en conférence", "Coffre généreux", "Hauteur sous plafond"],
      },
      {
        tagline: "Silencieuse. Électrique.",
        blurb: "Un luxe zéro émission pour le voyageur soucieux de l'environnement.",
        features: ["100 % électrique", "Conduite quasi silencieuse", "Suite de confort arrière", "Grande autonomie"],
      },
    ],
  },
  locations: {
    eyebrow: "Zones desservies",
    title: "Où nous conduisons.",
    intro: "Basés à Genève, chez nous sur l'arc lémanique, dans les Alpes et en Europe.",
    hubLabel: "Base",
    note: "Votre destination n'y figure pas ? Nous organisons des trajets sur mesure partout en Europe.",
    items: [
      { name: "Genève", blurb: "Notre ville — aéroport, centre d'affaires, bord du lac et hôtels." },
      { name: "Lausanne", blurb: "La capitale olympique et l'arc lémanique, à quelques minutes." },
      { name: "Montreux", blurb: "La Riviera, les festivals et les grands hôtels du lac." },
      { name: "Verbier", blurb: "Transferts alpins de premier ordre, chalets et hélisurfaces." },
      { name: "Courchevel", blurb: "Les Alpes françaises — direct depuis Genève, de la porte au chalet." },
      { name: "Lyon", blurb: "Affaires transfrontalières et correspondances aéroport." },
      { name: "Milan", blurb: "La mode, la finance et les lacs italiens." },
    ],
  },
  booking: {
    eyebrow: "Réservation",
    title: "Votre voyage commence ici.",
    intro: "Dites-nous où et quand. Nous répondons avec un devis fixe, vite.",
    promise: "Nous confirmons chaque réservation personnellement, dans l'heure pendant le service.",
    fromLabel: "Prise en charge",
    fromPlaceholder: "Adresse, aéroport ou hôtel",
    toLabel: "Destination",
    toPlaceholder: "Vers où ?",
    dateLabel: "Date",
    timeLabel: "Heure",
    passengersLabel: "Passagers",
    luggageLabel: "Bagages",
    vehicleLabel: "Véhicule",
    vehicleAny: "Sans préférence",
    nameLabel: "Nom",
    namePlaceholder: "Votre nom",
    emailLabel: "E-mail",
    emailPlaceholder: "vous@email.com",
    phoneLabel: "Téléphone",
    phonePlaceholder: "+41 …",
    notesLabel: "Autre chose ?",
    notesPlaceholder: "Numéro de vol, sièges enfant, demandes particulières…",
    submit: "Demander mon devis",
    submitting: "Envoi…",
    sentTitle: "Demande reçue.",
    sentBody: "Merci. Nous confirmons votre réservation et votre devis fixe sous peu.",
    sendAnother: "Faire une autre demande",
    errorPrefix: "Échec de l'envoi — écrivez-nous ou appelez-nous",
    nameError: "Indiquez-nous votre nom.",
    emailError: "Cet e-mail ne semble pas valide.",
    routeError: "Indiquez-nous d'où et vers où vous voyagez.",
  },
  about: {
    eyebrow: "À propos de BLACKFIRST",
    title: "Une maison genevoise de mobilité privée.",
    lead: "BLACKFIRST repose sur une idée simple : être conduit devrait être le moment le plus posé de votre journée.",
    body: [
      "Nous sommes une maison de chauffeurs basée à Genève, au service des voyageurs d'affaires, des clients privés, des hôtels et des organisateurs d'événements à travers la Suisse et l'Europe. Pas une compagnie de taxis — une maison de mobilité, plus proche par l'esprit d'un hôtel cinq étoiles ou de l'aviation privée que d'une application de VTC.",
      "Chaque trajet est assuré par un chauffeur professionnel, dans une Mercedes-Benz récente tenue impeccable, réglé à la minute et livré avec la discrétion que nos clients attendent.",
    ],
    pillarsTitle: "Ce que nous défendons",
    pillars: [
      { t: "Précision suisse", d: "À l'heure, à chaque fois. Nous anticipons le trafic, la météo et l'imprévu — pour que vous n'ayez jamais à le faire." },
      { t: "Discrétion totale", d: "La confidentialité est le service. Vos déplacements, appels et conversations restent privés." },
      { t: "Attention sincère", d: "Les petites choses — la température, l'eau, le silence — sont l'essentiel." },
      { t: "Un seul standard", d: "Trajet aéroport ou tournée européenne, le niveau ne bouge jamais." },
    ],
    closing: "Au-delà du trajet.",
  },
  contact: {
    eyebrow: "Contact",
    title: "À votre service.",
    intro: "Joignez-nous comme il vous convient. Nous répondons vite, jour et nuit.",
    phoneLabel: "Appelez-nous",
    whatsappLabel: "WhatsApp",
    emailLabel: "E-mail",
    hoursLabel: "Horaires",
    hours: "Réservations 24 h/24 · 365 jours par an",
    baseLabel: "Basés à",
    base: "Genève, Suisse",
    responseNote: "Vous préférez réserver en ligne ? Utilisez le formulaire — nous répondons vite avec un devis fixe.",
    bookCta: "Ouvrir le formulaire de réservation",
  },
  footer: {
    tagline: "Chauffeur privé & mobilité d'exception — Genève, Suisse.",
    explore: "Explorer",
    company: "Maison",
    contact: "Contact",
    rights: "Tous droits réservés.",
    legalNotice: "Mentions légales",
    privacy: "Confidentialité",
    terms: "Conditions",
    copyHint: "Cliquer pour copier",
    copied: "E-mail copié",
    availability: "Disponibles 24 h/24",
  },
  service: {
    all: "← Tous les services",
    label: "Service",
    overview: "Aperçu",
    highlights: "Points forts",
    destinations: "Où nous allons",
    includes: "Ce qui est inclus",
    process: "Comment ça marche",
    book: "Réserver ce service",
    quote: "Demander un devis",
    prev: "← Précédent",
    next: "Suivant →",
    home: "← Accueil",
    ctaTitle: "Prêts quand vous l'êtes.",
    ctaBody: "Dites-nous où et quand. Nous répondons avec un devis fixe et confirmons votre chauffeur.",
  },
};

/* ---------- deep merge (FR text over EN base, arrays by index) ---------- */
type DeepPartial<T> = T extends (infer U)[]
  ? DeepPartial<U>[]
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

function merge<T>(base: T, over: unknown): T {
  if (Array.isArray(base)) {
    const o = over as unknown[] | undefined;
    return base.map((b, i) => (o && o[i] !== undefined ? merge(b, o[i]) : b)) as unknown as T;
  }
  if (base && typeof base === "object") {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    if (over) for (const k of Object.keys(over as object)) out[k] = merge((base as Record<string, unknown>)[k], (over as Record<string, unknown>)[k]);
    return out as unknown as T;
  }
  return over !== undefined ? (over as T) : base;
}

/* ---- French typography ----------------------------------------------------
   Thin non-breaking space (U+202F) before ; : ! ? and inside « », plus curly
   apostrophes. Applied ONLY to the FR override. Idempotent; guards leave URLs
   (://) and times/ratios (12:00, 16:9) intact. */
const NNBSP = " ";
function frTypo(s: string): string {
  return s
    .replace(/'/g, "’")
    .replace(/([^\s])\s*([;!?])/g, `$1${NNBSP}$2`)
    .replace(/([^\s\d])\s*:(?!\/\/)/g, `$1${NNBSP}:`)
    .replace(/«\s*/g, `«${NNBSP}`)
    .replace(/\s*»/g, `${NNBSP}»`);
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
