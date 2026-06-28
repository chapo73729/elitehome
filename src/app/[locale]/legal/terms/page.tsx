import type { Metadata } from "next";
import { i18nAlternates, isLocale, defaultLocale, type AppLocale } from "@/lib/i18n";
import { TermsView } from "./TermsView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: AppLocale = isLocale(raw) ? raw : defaultLocale;
  return {
    title: "Terms of Use",
    description: "Terms governing the use of the ARDLABS® website.",
    alternates: i18nAlternates(locale, "/legal/terms"),
  };
}

export default function Terms() {
  return <TermsView />;
}
