import { SITE, CITIES, SERVICES } from "@/lib/site";

const SERVICE_NAMES: Record<string, string> = {
  "airport-transfer": "Airport Executive Transfer",
  "business-chauffeur": "Business Chauffeur",
  events: "Luxury Event Chauffeur",
  "long-distance": "International Long-Distance Chauffeur",
};

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LimousineService", "LocalBusiness"],
        "@id": `${SITE.url}/#organization`,
        name: SITE.legal,
        legalName: SITE.legal,
        url: SITE.url,
        email: SITE.email,
        telephone: SITE.phone,
        description: SITE.description,
        slogan: SITE.tagline,
        priceRange: "$$$$",
        image: `${SITE.url}/opengraph-image`,
        logo: `${SITE.url}/icon.svg`,
        openingHours: "Mo-Su 00:00-24:00",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "reservations",
          email: SITE.email,
          telephone: SITE.phone,
          availableLanguage: ["fr", "en", "de"],
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Geneva",
          addressCountry: "CH",
        },
        areaServed: CITIES.map((c) => ({ "@type": "City", name: c.name })),
        knowsAbout: [
          "Executive chauffeur service",
          "Airport transfers Geneva",
          "Private mobility Switzerland",
          "Business chauffeur",
          "Long-distance chauffeur Europe",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Chauffeur services",
          itemListElement: SERVICES.map((s) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: SERVICE_NAMES[s.slug],
              url: `${SITE.url}/en/services/${s.slug}`,
            },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.legal,
        publisher: { "@id": `${SITE.url}/#organization` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
