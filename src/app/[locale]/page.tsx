import type { Metadata } from "next";
import { Experience } from "@/components/layout/Experience";
import { i18nAlternates, isLocale, ogLocale, defaultLocale, type AppLocale } from "@/lib/i18n";
import { SITE } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: AppLocale = isLocale(raw) ? raw : defaultLocale;
  return {
    alternates: i18nAlternates(locale, "/"),
    openGraph: {
      url: `${SITE.url}/${locale}`,
      locale: ogLocale[locale],
    },
  };
}

export default function Home() {
  return <Experience />;
}
