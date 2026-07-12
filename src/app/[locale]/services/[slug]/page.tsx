import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICES, SITE } from "@/lib/site";
import { SERVICE_META } from "@/lib/meta";
import { i18nAlternates, isLocale, ogLocale, defaultLocale, locales, type AppLocale } from "@/lib/i18n";
import { ServiceDetailView } from "@/components/views/ServiceDetailView";

export function generateStaticParams() {
  return locales.flatMap((locale) => SERVICES.map((s) => ({ locale, slug: s.slug })));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: AppLocale = isLocale(raw) ? raw : defaultLocale;
  const meta = SERVICE_META[slug];
  if (!meta) return {};
  const { title, description } = meta[locale] ?? meta.en;
  return {
    title,
    description,
    alternates: i18nAlternates(locale, `/services/${slug}`),
    openGraph: {
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
      title: `${title} — ${SITE.legal}`,
      description,
      url: `${SITE.url}/${locale}/services/${slug}`,
      type: "article",
      locale: ogLocale[locale],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale: AppLocale = isLocale(raw) ? raw : defaultLocale;
  const idx = SERVICES.findIndex((s) => s.slug === slug);
  if (idx === -1) notFound();

  const prev = SERVICES[(idx - 1 + SERVICES.length) % SERVICES.length];
  const next = SERVICES[(idx + 1) % SERVICES.length];
  const meta = SERVICE_META[slug]?.[locale] ?? SERVICE_META[slug]?.en;

  const crumb =
    locale === "fr" ? { home: "Accueil", services: "Services" } : { home: "Home", services: "Services" };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: meta?.title,
        description: meta?.description,
        serviceType: "Chauffeur service",
        provider: { "@type": "Organization", name: SITE.legal, url: SITE.url },
        areaServed: ["Switzerland", "France", "Italy", "Europe"],
        url: `${SITE.url}/${locale}/services/${slug}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: crumb.home, item: `${SITE.url}/${locale}` },
          { "@type": "ListItem", position: 2, name: crumb.services, item: `${SITE.url}/${locale}/services` },
          { "@type": "ListItem", position: 3, name: meta?.title, item: `${SITE.url}/${locale}/services/${slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ServiceDetailView slug={slug} prevSlug={prev.slug} nextSlug={next.slug} />
    </>
  );
}
