import type { Metadata } from "next";
import { i18nAlternates, isLocale, defaultLocale, type AppLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { TermsView } from "./TermsView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: AppLocale = isLocale(raw) ? raw : defaultLocale;
  const { title, description } = pageMeta("legal/terms", locale);
  return {
    title,
    description,
    alternates: i18nAlternates(locale, "/legal/terms"),
  };
}

export default function Terms() {
  return <TermsView />;
}
