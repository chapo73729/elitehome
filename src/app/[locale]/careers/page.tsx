import type { Metadata } from "next";
import { i18nAlternates, isLocale, ogLocale, defaultLocale, type AppLocale } from "@/lib/i18n";
import { CareersView } from "./CareersView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: AppLocale = isLocale(raw) ? raw : defaultLocale;
  return {
    title: "Careers",
    description:
      "Join ARDLABS® — a small, senior digital engineering studio building software, platforms and AI systems, refined to the detail.",
    alternates: i18nAlternates(locale, "/careers"),
    openGraph: {
      title: "Careers · ARDLABS®",
      description: "Join a small, senior studio building reliable software, platforms and AI systems.",
      url: `/${locale}/careers`,
      locale: ogLocale[locale],
    },
  };
}

export default function Careers() {
  return <CareersView />;
}
