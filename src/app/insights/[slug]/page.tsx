import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { INSIGHTS, getInsight } from "@/lib/insights";
import { SITE } from "@/lib/site";
import { InsightArticleView } from "@/components/insights/InsightArticleView";

export function generateStaticParams() {
  return INSIGHTS.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getInsight(slug);
  if (!post) return { title: "Insight not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/insights/${post.slug}` },
    openGraph: {
      type: "article",
      title: `${post.title} · ARDLABS®`,
      description: post.excerpt,
      url: `/insights/${post.slug}`,
      publishedTime: post.date,
    },
  };
}

export default async function InsightArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
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
    mainEntityOfPage: `${SITE.url}/insights/${post.slug}`,
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
