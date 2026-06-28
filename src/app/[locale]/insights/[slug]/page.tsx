import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { INSIGHTS, getInsight } from "@/lib/insights";
import { SITE } from "@/lib/site";
import { i18nAlternates, isLocale, ogLocale, defaultLocale, locales, type AppLocale } from "@/lib/i18n";
import { InsightArticleView } from "@/components/insights/InsightArticleView";

export function generateStaticParams() {
  return locales.flatMap((locale) => INSIGHTS.map((i) => ({ locale, slug: i.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: AppLocale = isLocale(raw) ? raw : defaultLocale;
  const post = getInsight(slug);
  if (!post) return { title: "Insight not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: i18nAlternates(locale, `/insights/${post.slug}`),
    openGraph: {
      type: "article",
      title: `${post.title} · ARDLABS®`,
      description: post.excerpt,
      url: `/${locale}/insights/${post.slug}`,
      publishedTime: post.date,
      locale: ogLocale[locale],
    },
  };
}

export default async function InsightArticle({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale: AppLocale = isLocale(raw) ? raw : defaultLocale;
  const post = getInsight(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    articleSection: post.category,
    author: { "@type": "Organization", name: SITE.legal },
    publisher: { "@type": "Organization", name: SITE.legal },
    mainEntityOfPage: `${SITE.url}/${locale}/insights/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InsightArticleView slug={post.slug} />
    </>
  );
}
