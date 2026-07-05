import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { fontDisplay, fontMono } from "@/lib/fonts";
import { SITE } from "@/lib/site";
import { isLocale, locales } from "@/lib/i18n";
import { JsonLd } from "@/components/layout/JsonLd";
import { Providers } from "@/components/layout/Providers";
import { LocaleSync } from "@/components/layout/LocaleSync";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.legal} — ${SITE.tagline}`,
    template: `%s — ${SITE.legal}`,
  },
  description: SITE.description,
  applicationName: SITE.legal,
  keywords: [
    "ARDLABS",
    "digital engineering studio",
    "software development",
    "web development",
    "mobile apps",
    "SaaS",
    "AI",
    "data",
    "cloud",
    "Prague",
  ],
  authors: [{ name: SITE.legal }],
  creator: SITE.legal,
  publisher: SITE.legal,
  alternates: { canonical: "/" },
  openGraph: {
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    type: "website",
    locale: "en_US",
    url: SITE.url,
    siteName: SITE.legal,
    title: `${SITE.legal} — ${SITE.tagline}`,
    description: SITE.description,
  },
  // Card type + creator only: without a twitter:title/description here,
  // X/Twitter falls back to each page's LOCALIZED og:* tags instead of
  // inheriting this English default on every route.
  twitter: {
    card: "summary_large_image",
    creator: "@ardlabs",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Root layout. Lives under the [locale] segment (the middleware guarantees
 * every page URL is locale-prefixed) so the served HTML can declare the
 * correct `<html lang>` per locale instead of a hard-coded "en".
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html
      lang={locale}
      className={`${fontDisplay.variable} ${fontMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <LocaleSync locale={locale} />
        <JsonLd />
        <Providers>{children}</Providers>
        <div className="grain" aria-hidden />
        <div className="vignette" aria-hidden />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
