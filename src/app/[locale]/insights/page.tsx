import type { Metadata } from "next";
import { i18nAlternates, isLocale, ogLocale, defaultLocale, type AppLocale } from "@/lib/i18n";
import { InsightsIndexView } from "@/components/insights/InsightsIndexView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: AppLocale = isLocale(raw) ? raw : defaultLocale;
  return {
    title: "Insights",
    description:
      "Notes from ARDLABS® on digital engineering — shipping reliable software, applied AI, and infrastructure refined to the detail.",
    alternates: i18nAlternates(locale, "/insights"),
    openGraph: {
      title: "Insights · ARDLABS®",
      description:
        "Notes from the studio on digital engineering — software, AI and infrastructure, done right.",
      url: `/${locale}/insights`,
      locale: ogLocale[locale],
    },
  };
}

export default function InsightsIndex() {
  return <InsightsIndexView />;
}
