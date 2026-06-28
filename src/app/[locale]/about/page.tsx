import type { Metadata } from "next";
import { i18nAlternates, isLocale, ogLocale, defaultLocale, type AppLocale } from "@/lib/i18n";
import { AboutView } from "./AboutView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: AppLocale = isLocale(raw) ? raw : defaultLocale;
  return {
    title: "About",
    description:
      "ARDLABS® is a digital engineering studio. We design and build software, platforms and AI systems — refined to the detail.",
    alternates: i18nAlternates(locale, "/about"),
    openGraph: {
      title: "About · ARDLABS®",
      description: "A digital engineering studio designing and building software, platforms and AI systems.",
      url: `/${locale}/about`,
      locale: ogLocale[locale],
    },
  };
}

export default function About() {
  return <AboutView />;
}
