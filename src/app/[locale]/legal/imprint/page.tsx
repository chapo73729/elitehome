import type { Metadata } from "next";
import { i18nAlternates, isLocale, defaultLocale, type AppLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { ImprintView } from "./ImprintView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: AppLocale = isLocale(raw) ? raw : defaultLocale;
  const { title, description } = pageMeta("legal/imprint", locale);
  return {
    title,
    description,
    alternates: i18nAlternates(locale, "/legal/imprint"),
    robots: { index: true, follow: true },
  };
}

export default function Imprint() {
  return <ImprintView />;
}
