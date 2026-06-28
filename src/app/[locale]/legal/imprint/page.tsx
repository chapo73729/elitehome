import type { Metadata } from "next";
import { i18nAlternates, isLocale, defaultLocale, type AppLocale } from "@/lib/i18n";
import { ImprintView } from "./ImprintView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: AppLocale = isLocale(raw) ? raw : defaultLocale;
  return {
    title: "Legal Notice",
    description: "Legal notice and company information for ARDLABS®.",
    alternates: i18nAlternates(locale, "/legal/imprint"),
    robots: { index: true, follow: true },
  };
}

export default function Imprint() {
  return <ImprintView />;
}
