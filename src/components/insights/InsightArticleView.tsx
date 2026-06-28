"use client";

import { LocaleLink } from "@/components/ui/LocaleLink";
import { INSIGHTS, getInsight, localizeInsight } from "@/lib/insights";
import { PageHeaderFX } from "@/components/ui/PageHeaderFX";
import { useLang, type Lang } from "@/lib/lang";

const T = {
  en: {
    back: "← Insights",
    minRead: "min read",
    keepReading: "Keep reading",
  },
  fr: {
    back: "← Perspectives",
    minRead: "min de lecture",
    keepReading: "Poursuivre la lecture",
  },
};

function fmt(date: string, lang: Lang) {
  return new Date(date).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function InsightArticleView({ slug }: { slug: string }) {
  const lang = useLang();
  const t = T[lang];

  const base = getInsight(slug);
  if (!base) return null;
  const post = localizeInsight(base, lang);

  const more = INSIGHTS.filter((i) => i.slug !== post.slug)
    .slice(0, 2)
    .map((p) => localizeInsight(p, lang));

  return (
    <main className="relative">
      <section className="relative overflow-hidden pb-8 pt-40">
        <PageHeaderFX accent={post.accent} />
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[45vh] w-[45vh] -translate-x-1/2 rounded-full blur-[140px]"
          style={{ backgroundColor: `${post.accent}1f` }}
        />
        <div className="container-x relative max-w-3xl">
          <LocaleLink
            href="/insights"
            className="link-underline font-mono text-xs tracking-widest text-mist"
          >
            {t.back}
          </LocaleLink>
          <div className="mt-8 flex flex-wrap items-center gap-4 font-mono text-xs tracking-widest text-fog">
            <span style={{ color: post.accent }}>{post.category}</span>
            <span>{fmt(post.date, lang)}</span>
            <span>{post.readingMinutes} {t.minRead}</span>
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
          <div className="eyebrow mb-6 hairline-t pt-10">{t.keepReading}</div>
          <ul className="grid gap-px overflow-hidden rounded-2xl hairline sm:grid-cols-2">
            {more.map((p) => (
              <li key={p.slug}>
                <LocaleLink
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
                </LocaleLink>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
