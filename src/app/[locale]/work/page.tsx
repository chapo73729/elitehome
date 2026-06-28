import type { Metadata } from "next";
import { i18nAlternates, isLocale, ogLocale, defaultLocale, type AppLocale } from "@/lib/i18n";
import { WorkIndexView } from "@/components/work/WorkIndexView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: AppLocale = isLocale(raw) ? raw : defaultLocale;
  return {
    title: "Work",
    description:
      "Selected work from ARDLABS® — software, platforms, data and cloud projects, shipped end to end.",
    alternates: i18nAlternates(locale, "/work"),
    openGraph: {
      title: "Work · ARDLABS®",
      description: "Software, platforms, data and cloud projects, shipped end to end.",
      url: `/${locale}/work`,
      locale: ogLocale[locale],
    },
  };
}

export default function WorkIndex() {
  return <WorkIndexView />;
}
