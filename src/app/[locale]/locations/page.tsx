import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { i18nAlternates, isLocale, ogLocale, defaultLocale, type AppLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { LocationsView } from "@/components/views/LocationsView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: AppLocale = isLocale(raw) ? raw : defaultLocale;
  const { title, description } = pageMeta("locations", locale);
  return {
    title,
    description,
    alternates: i18nAlternates(locale, "/locations"),
    openGraph: {
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
      title: `${title} — ${SITE.legal}`,
      description,
      url: `${SITE.url}/${locale}/locations`,
      locale: ogLocale[locale],
    },
  };
}

export default function LocationsPage() {
  return <LocationsView />;
}
