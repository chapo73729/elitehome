import type { Metadata } from "next";
import { i18nAlternates, isLocale, ogLocale, defaultLocale, type AppLocale } from "@/lib/i18n";
import { ApproachView } from "./ApproachView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: AppLocale = isLocale(raw) ? raw : defaultLocale;
  return {
    title: "Approach",
    description:
      "How ARDLABS® works — a studio method that turns a problem into reliable software, shipped and supported.",
    alternates: i18nAlternates(locale, "/approach"),
    openGraph: {
      title: "Approach · ARDLABS®",
      description: "How we turn a problem into reliable software, shipped end to end.",
      url: `/${locale}/approach`,
      locale: ogLocale[locale],
    },
  };
}

export default function Approach() {
  return <ApproachView />;
}
