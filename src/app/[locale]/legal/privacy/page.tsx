import type { Metadata } from "next";
import { i18nAlternates, isLocale, defaultLocale, type AppLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { PrivacyView } from "./PrivacyView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: AppLocale = isLocale(raw) ? raw : defaultLocale;
  const { title, description } = pageMeta("legal/privacy", locale);
  return {
    title,
    description,
    alternates: i18nAlternates(locale, "/legal/privacy"),
  };
}

export default function Privacy() {
  return <PrivacyView />;
}
