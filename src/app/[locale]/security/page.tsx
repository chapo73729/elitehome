import type { Metadata } from "next";
import { i18nAlternates, isLocale, ogLocale, defaultLocale, type AppLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { SecurityView } from "./SecurityView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: AppLocale = isLocale(raw) ? raw : defaultLocale;
  const { title, description } = pageMeta("security", locale);
  return {
    title,
    description,
    alternates: i18nAlternates(locale, "/security"),
    openGraph: {
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
      title: `${title} · ARDLABS®`,
      description,
      url: `/${locale}/security`,
      locale: ogLocale[locale],
    },
  };
}

export default function Security() {
  return <SecurityView />;
}
