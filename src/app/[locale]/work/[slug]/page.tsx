import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WORK, getCase, localizeCase } from "@/lib/work";
import { SITE } from "@/lib/site";
import { i18nAlternates, isLocale, ogLocale, defaultLocale, locales, type AppLocale } from "@/lib/i18n";
import { CaseStudyView } from "@/components/work/CaseStudyView";

export function generateStaticParams() {
  return locales.flatMap((locale) => WORK.map((w) => ({ locale, slug: w.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: AppLocale = isLocale(raw) ? raw : defaultLocale;
  const base = getCase(slug);
  if (!base) return { title: locale === "fr" ? "Étude de cas introuvable" : "Case study not found" };
  const w = localizeCase(base, locale);
  return {
    title: `${w.name} — ${w.field}`,
    description: w.summary,
    alternates: i18nAlternates(locale, `/work/${w.slug}`),
    openGraph: {
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
      title: `${w.name} · ARDLABS®`,
      description: w.summary,
      url: `/${locale}/work/${w.slug}`,
      locale: ogLocale[locale],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale: AppLocale = isLocale(raw) ? raw : defaultLocale;
  const w = getCase(slug);
  if (!w) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: w.name,
    about: w.field,
    description: w.summary,
    creator: { "@type": "Organization", name: SITE.legal },
    url: `${SITE.url}/${locale}/work/${w.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CaseStudyView slug={w.slug} />
    </>
  );
}
