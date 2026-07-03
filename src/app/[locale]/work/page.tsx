import type { Metadata } from "next";
import { i18nAlternates, isLocale, ogLocale, defaultLocale, type AppLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { WorkIndexView } from "@/components/work/WorkIndexView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: AppLocale = isLocale(raw) ? raw : defaultLocale;
  const { title, description } = pageMeta("work", locale);
  return {
    title,
    description,
    alternates: i18nAlternates(locale, "/work"),
    openGraph: {
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
      title: `${title} · ARDLABS®`,
      description,
      url: `/${locale}/work`,
      locale: ogLocale[locale],
    },
  };
}

export default function WorkIndex() {
  return <WorkIndexView />;
}
