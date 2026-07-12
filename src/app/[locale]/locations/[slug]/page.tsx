import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE } from "@/lib/site";
import { DESTINATIONS, getDestination } from "@/lib/destinations";
import { i18nAlternates, isLocale, ogLocale, defaultLocale, locales, type AppLocale } from "@/lib/i18n";
import { DestinationView } from "@/components/views/DestinationView";

export function generateStaticParams() {
  return locales.flatMap((locale) => DESTINATIONS.map((d) => ({ locale, slug: d.slug })));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: AppLocale = isLocale(raw) ? raw : defaultLocale;
  const dest = getDestination(slug);
  if (!dest) return {};
  const copy = dest[locale];
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: i18nAlternates(locale, `/locations/${slug}`),
    openGraph: {
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
      title: `${copy.metaTitle} — ${SITE.legal}`,
      description: copy.metaDescription,
      url: `${SITE.url}/${locale}/locations/${slug}`,
      type: "article",
      locale: ogLocale[locale],
    },
    twitter: { card: "summary_large_image", title: copy.metaTitle, description: copy.metaDescription },
  };
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale: AppLocale = isLocale(raw) ? raw : defaultLocale;
  const dest = getDestination(slug);
  if (!dest) notFound();

  const copy = dest[locale];
  const crumb =
    locale === "fr"
      ? { home: "Accueil", locations: "Destinations" }
      : { home: "Home", locations: "Locations" };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: copy.metaTitle,
        description: copy.metaDescription,
        serviceType: "Chauffeur service",
        provider: { "@type": "Organization", name: SITE.legal, url: SITE.url },
        areaServed: { "@type": "City", name: dest.slug === "geneva" ? "Geneva" : copy.h1 },
        url: `${SITE.url}/${locale}/locations/${slug}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: crumb.home, item: `${SITE.url}/${locale}` },
          { "@type": "ListItem", position: 2, name: crumb.locations, item: `${SITE.url}/${locale}/locations` },
          { "@type": "ListItem", position: 3, name: copy.h1, item: `${SITE.url}/${locale}/locations/${slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DestinationView slug={slug} />
    </>
  );
}
