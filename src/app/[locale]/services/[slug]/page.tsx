import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { INDUSTRIES, SITE } from "@/lib/site";
import { i18nAlternates, isLocale, ogLocale, defaultLocale, locales, type AppLocale } from "@/lib/i18n";
import { IndustryDetail } from "@/components/industry/IndustryDetail";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    INDUSTRIES.map((i) => ({ locale, slug: i.id }))
  );
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: AppLocale = isLocale(raw) ? raw : defaultLocale;
  const industry = INDUSTRIES.find((i) => i.id === slug);
  if (!industry) return {};
  const title = industry.title;
  const description = industry.overview;
  return {
    title,
    description,
    alternates: i18nAlternates(locale, `/services/${industry.id}`),
    openGraph: {
      title: `${title} — ${SITE.legal}`,
      description,
      url: `${SITE.url}/${locale}/services/${industry.id}`,
      type: "article",
      locale: ogLocale[locale],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale: AppLocale = isLocale(raw) ? raw : defaultLocale;
  const idx = INDUSTRIES.findIndex((i) => i.id === slug);
  if (idx === -1) notFound();

  const industry = INDUSTRIES[idx];
  const prev = INDUSTRIES[(idx - 1 + INDUSTRIES.length) % INDUSTRIES.length];
  const next = INDUSTRIES[(idx + 1) % INDUSTRIES.length];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: industry.title,
        description: industry.overview,
        provider: { "@type": "Organization", name: SITE.legal, url: SITE.url },
        areaServed: "Worldwide",
        url: `${SITE.url}/${locale}/services/${industry.id}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE.url}/${locale}` },
          { "@type": "ListItem", position: 2, name: "Services", item: `${SITE.url}/${locale}/services` },
          {
            "@type": "ListItem",
            position: 3,
            name: industry.title,
            item: `${SITE.url}/${locale}/services/${industry.id}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <IndustryDetail id={industry.id} prevId={prev.id} nextId={next.id} />
    </>
  );
}
