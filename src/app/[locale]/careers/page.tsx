import type { Metadata } from "next";
import { i18nAlternates, isLocale, ogLocale, defaultLocale, type AppLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { CareersView } from "./CareersView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: AppLocale = isLocale(raw) ? raw : defaultLocale;
  const { title, description } = pageMeta("careers", locale);
  return {
    title,
    description,
    alternates: i18nAlternates(locale, "/careers"),
    openGraph: {
      title: `${title} · ARDLABS®`,
      description,
      url: `/${locale}/careers`,
      locale: ogLocale[locale],
    },
  };
}

export default function Careers() {
  return <CareersView />;
}
