import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { i18nAlternates, isLocale, ogLocale, defaultLocale, type AppLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { ServicesIndexView } from "@/components/views/ServicesIndexView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: AppLocale = isLocale(raw) ? raw : defaultLocale;
  const { title, description } = pageMeta("services", locale);
  return {
    title,
    description,
    alternates: i18nAlternates(locale, "/services"),
    openGraph: {
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
      title: `${title} — ${SITE.legal}`,
      description,
      url: `${SITE.url}/${locale}/services`,
      locale: ogLocale[locale],
    },
  };
}

export default function ServicesIndex() {
  return <ServicesIndexView />;
}
