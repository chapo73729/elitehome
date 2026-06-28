import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { INSIGHTS, getInsight } from "@/lib/insights";
import { SITE } from "@/lib/site";
import { PageHeaderFX } from "@/components/ui/PageHeaderFX";

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

function fmt(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function InsightArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getInsight(slug);
  if (!post) notFound();

  const more = INSIGHTS.filter((i) => i.slug !== post.slug).slice(0, 2);

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
    <main className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden pb-8 pt-40">
        <PageHeaderFX accent={post.accent} />
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[45vh] w-[45vh] -translate-x-1/2 rounded-full blur-[140px]"
          style={{ backgroundColor: `${post.accent}1f` }}
        />
        <div className="container-x relative max-w-3xl">
          <Link
            href="/insights"
            className="link-underline font-mono text-xs tracking-widest text-mist"
          >
            ← Insights
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-4 font-mono text-xs tracking-widest text-fog">
            <span style={{ color: post.accent }}>{post.category}</span>
            <span>{fmt(post.date)}</span>
            <span>{post.readingMinutes} min read</span>
          </div>
          <h1 className="text-giant text-gradient mt-4 text-balance">
            {post.title}
          </h1>
          <p className="mt-6 text-balance text-lg text-mist">{post.excerpt}</p>
        </div>
      </section>

      <article className="relative z-10 bg-void pb-24 pt-8">
        <div className="container-x max-w-3xl space-y-12">
          {post.body.map((block) => (
            <section key={block.heading}>
              <h2 className="font-display text-2xl font-semibold text-chalk">
                {block.heading}
              </h2>
              <div className="mt-4 space-y-4">
                {block.paragraphs.map((p, i) => (
                  <p key={i} className="leading-relaxed text-mist">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>

      <section className="relative z-10 bg-void pb-32">
        <div className="container-x max-w-3xl">
          <div className="eyebrow mb-6 hairline-t pt-10">Keep reading</div>
          <ul className="grid gap-px overflow-hidden rounded-2xl hairline sm:grid-cols-2">
            {more.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/insights/${p.slug}`}
                  className="group block h-full bg-ink p-6 transition-colors hover:bg-white/[0.03]"
                >
                  <span
                    className="font-mono text-[0.7rem] tracking-widest"
                    style={{ color: p.accent }}
                  >
                    {p.category}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-semibold text-chalk transition-colors group-hover:text-gradient">
                    {p.title}
                  </h3>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
