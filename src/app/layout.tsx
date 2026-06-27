import type { Metadata, Viewport } from "next";
import { fontDisplay, fontSans, fontMono } from "@/lib/fonts";
import { SITE } from "@/lib/site";
import { JsonLd } from "@/components/layout/JsonLd";
import { Providers } from "@/components/layout/Providers";
import "./globals.css";

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
    "private ventures",
    "artificial intelligence",
    "software engineering",
    "automation",
    "industrial robotics",
    "maritime operations",
    "deep tech",
  ],
  authors: [{ name: SITE.legal }],
  creator: SITE.legal,
  publisher: SITE.legal,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.url,
    siteName: SITE.legal,
    title: `${SITE.legal} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.legal} — ${SITE.tagline}`,
    description: SITE.description,
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <JsonLd />
        <Providers>{children}</Providers>
        <div className="grain" aria-hidden />
        <div className="vignette" aria-hidden />
      </body>
    </html>
  );
}
