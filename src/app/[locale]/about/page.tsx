import type { Metadata } from "next";
import { i18nAlternates, isLocale, ogLocale, defaultLocale, type AppLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { AboutView } from "./AboutView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: AppLocale = isLocale(raw) ? raw : defaultLocale;
  const { title, description } = pageMeta("about", locale);
  return {
    title,
    description,
    alternates: i18nAlternates(locale, "/about"),
    openGraph: {
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
      title: `${title} · ARDLABS®`,
      description,
      url: `/${locale}/about`,
      locale: ogLocale[locale],
    },
  };
}

export default function About() {
  return <AboutView />;
}
