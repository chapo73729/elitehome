import type { Metadata } from "next";
import { LocaleLink } from "@/components/ui/LocaleLink";
import { Contact } from "@/components/sections/Contact";
import { i18nAlternates, isLocale, ogLocale, defaultLocale, type AppLocale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: AppLocale = isLocale(raw) ? raw : defaultLocale;
  const { title, description } = pageMeta("contact", locale);
  return {
    title,
    description,
    alternates: i18nAlternates(locale, "/contact"),
    openGraph: {
      title: `${title} · ARDLABS®`,
      description,
      url: `/${locale}/contact`,
      locale: ogLocale[locale],
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: AppLocale = isLocale(raw) ? raw : defaultLocale;
  const h1 = locale === "fr" ? "Contacter ARDLABS®" : "Contact ARDLABS®";
  const back = locale === "fr" ? "← Accueil" : "← Home";
  return (
    <main className="relative">
      {/* page-level heading for structure/SEO; the section below carries the
          visible display headline as an h2 */}
      <h1 className="sr-only">{h1}</h1>
      <div className="container-x pt-32">
        <LocaleLink href="/" className="link-underline font-mono text-xs tracking-widest text-mist">
          {back}
        </LocaleLink>
      </div>
      <Contact />
    </main>
  );
}
