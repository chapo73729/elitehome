import type { Metadata } from "next";
import { i18nAlternates, isLocale, defaultLocale, type AppLocale } from "@/lib/i18n";
import { PrivacyView } from "./PrivacyView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: AppLocale = isLocale(raw) ? raw : defaultLocale;
  return {
    title: "Privacy Policy",
    description: "How ARDLABS® collects, uses and protects personal data.",
    alternates: i18nAlternates(locale, "/legal/privacy"),
  };
}

export default function Privacy() {
  return <PrivacyView />;
}
