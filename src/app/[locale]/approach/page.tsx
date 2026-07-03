import type { Metadata } from "next";
import { i18nAlternates, isLocale, ogLocale, defaultLocale, type AppLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { ApproachView } from "./ApproachView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: AppLocale = isLocale(raw) ? raw : defaultLocale;
  const { title, description } = pageMeta("approach", locale);
  return {
    title,
    description,
    alternates: i18nAlternates(locale, "/approach"),
    openGraph: {
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
      title: `${title} · ARDLABS®`,
      description,
      url: `/${locale}/approach`,
      locale: ogLocale[locale],
    },
  };
}

export default function Approach() {
  return <ApproachView />;
}
