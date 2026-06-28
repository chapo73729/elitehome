import type { Metadata } from "next";
import { LocaleLink } from "@/components/ui/LocaleLink";
import { Contact } from "@/components/sections/Contact";
import { i18nAlternates, isLocale, ogLocale, defaultLocale, type AppLocale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: AppLocale = isLocale(raw) ? raw : defaultLocale;
  return {
    title: "Contact",
    description:
      "Engage ARDLABS® — start a conversation about designing and building software, platforms, data & AI, and cloud.",
    alternates: i18nAlternates(locale, "/contact"),
    openGraph: {
      title: "Contact · ARDLABS®",
      description: "Start a conversation with ARDLABS®.",
      url: `/${locale}/contact`,
      locale: ogLocale[locale],
    },
  };
}

export default function ContactPage() {
  return (
    <main className="relative">
      <div className="container-x pt-32">
        <LocaleLink href="/" className="link-underline font-mono text-xs tracking-widest text-mist">
          ← Home
        </LocaleLink>
      </div>
      <Contact />
    </main>
  );
}
