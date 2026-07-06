import { SITE, CITIES } from "@/lib/site";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": `${SITE.url}/#organization`,
        name: SITE.legal,
        legalName: SITE.legal,
        url: SITE.url,
        email: SITE.email,
        description: SITE.description,
        slogan: SITE.tagline,
        foundingDate: "2019",
        logo: `${SITE.url}/icon.svg`,
        image: `${SITE.url}/opengraph-image`,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          email: SITE.email,
          availableLanguage: ["en", "fr"],
        },
        address: {
          "@type": "PostalAddress",
          streetAddress: "Na Příkopě 21",
          postalCode: "110 00",
          addressLocality: "Praha 1",
          addressCountry: "CZ",
        },
        areaServed: CITIES.map((c) => c.name),
        knowsAbout: [
          "Strategy & Consulting",
          "Design & Development",
          "Data & AI",
          "Cloud & Infrastructure",
        ],
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
