import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { i18nAlternates, isLocale, ogLocale, defaultLocale, type AppLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { BookingView } from "./BookingView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: AppLocale = isLocale(raw) ? raw : defaultLocale;
  const { title, description } = pageMeta("booking", locale);
  return {
    title,
    description,
    alternates: i18nAlternates(locale, "/booking"),
    openGraph: {
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
      title: `${title} — ${SITE.legal}`,
      description,
      url: `${SITE.url}/${locale}/booking`,
      locale: ogLocale[locale],
    },
  };
}

export default function BookingPage() {
  return <BookingView />;
}
