import type { Metadata } from "next";
import { i18nAlternates, isLocale, ogLocale, defaultLocale, type AppLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { InsightsIndexView } from "@/components/insights/InsightsIndexView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: AppLocale = isLocale(raw) ? raw : defaultLocale;
  const { title, description } = pageMeta("insights", locale);
  return {
    title,
    description,
    alternates: i18nAlternates(locale, "/insights"),
    openGraph: {
      title: `${title} · ARDLABS®`,
      description,
      url: `/${locale}/insights`,
      locale: ogLocale[locale],
    },
  };
}

export default function InsightsIndex() {
  return <InsightsIndexView />;
}
