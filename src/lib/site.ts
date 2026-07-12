/* ============================================================
   BLACKFIRST® — Central brand configuration & structural data
   Executive Chauffeur & Private Mobility · Geneva, Switzerland

   This module holds language-NEUTRAL data only (ids, slugs, coordinates,
   contact details, vehicle specs). All localized copy lives in
   src/lib/content.ts. Server components import from here freely; the
   content module is client-only.
   ============================================================ */

export const SITE = {
  name: "BLACKFIRST",
  legal: "BLACKFIRST®",
  tagline: "Executive Mobility. Swiss Precision.",
  domain: "blackfirst.ch",
  url: "https://blackfirst.ch",
  email: "reservations@blackfirst.ch",
  phone: "+41 22 500 00 00",
  phoneHref: "+41225000000",
  whatsapp: "+41 79 500 00 00",
  whatsappHref: "41795000000",
  city: "Geneva",
  country: "CH",
  description:
    "BLACKFIRST® is an executive chauffeur and private mobility house based in Geneva. Airport transfers, business travel, private events and long-distance journeys across Switzerland and Europe — with Swiss precision and total discretion.",
  locale: "en",
} as const;

/* ---- Services (structural: slug + index + accent) ------------------------
   Localized titles/copy live in content.services.items, keyed by slug. */
export const SERVICES = [
  { slug: "airport-transfer", index: "01", accent: "#ffffff" },
  { slug: "business-chauffeur", index: "02", accent: "#e6e8ec" },
  { slug: "events", index: "03", accent: "#c7cbd1" },
  { slug: "long-distance", index: "04", accent: "#f5f5f5" },
] as const;

export type ServiceSlug = (typeof SERVICES)[number]["slug"];

export function isServiceSlug(x: string): x is ServiceSlug {
  return SERVICES.some((s) => s.slug === x);
}

/* ---- Fleet (specs are language-neutral; copy keyed by id in content) ----- */
export const FLEET = [
  {
    id: "s-class",
    name: "Mercedes Classe S",
    line: "Berline · Flagship",
    seats: 3,
    luggage: 3,
    accent: "#ffffff",
    electric: false,
  },
  {
    id: "v-class",
    name: "Mercedes Classe V VIP",
    line: "Van · Cabine première classe",
    seats: 7,
    luggage: 7,
    accent: "#c7cbd1",
    electric: false,
  },
] as const;

export type FleetId = (typeof FLEET)[number]["id"];

/* ---- Served zones / map nodes -------------------------------------------
   `hub` marks the operating base (Geneva). Coordinates drive the RouteMap. */
export const LOCATIONS = [
  { id: "geneva", name: "Geneva", country: "Switzerland", lat: 46.2044, lon: 6.1432, hub: true },
  { id: "lausanne", name: "Lausanne", country: "Switzerland", lat: 46.5197, lon: 6.6323, hub: false },
  { id: "montreux", name: "Montreux", country: "Switzerland", lat: 46.4312, lon: 6.9107, hub: false },
  { id: "verbier", name: "Verbier", country: "Switzerland", lat: 46.0964, lon: 7.2286, hub: false },
  { id: "zurich", name: "Zurich", country: "Switzerland", lat: 47.3769, lon: 8.5417, hub: false },
  { id: "courchevel", name: "Courchevel", country: "France", lat: 45.4154, lon: 6.6349, hub: false },
  { id: "lyon", name: "Lyon", country: "France", lat: 45.764, lon: 4.8357, hub: false },
  { id: "milan", name: "Milan", country: "Italy", lat: 45.4642, lon: 9.19, hub: false },
] as const;

/** Alias kept for JsonLd / areaServed. */
export const CITIES = LOCATIONS;

/* ---- Trust markers shown on the homepage --------------------------------
   Neutral, non-fabricated statements — labels are localized in content. */
export const HALLMARKS = [
  { id: "since", value: "24/7" },
  { id: "based", value: "Geneva" },
  { id: "reach", value: "CH · FR · EU" },
  { id: "languages", value: "FR / EN / DE" },
] as const;
