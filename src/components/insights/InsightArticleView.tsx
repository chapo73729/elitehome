"use client";

import { LocaleLink } from "@/components/ui/LocaleLink";
import { INSIGHTS, getInsight, localizeInsight } from "@/lib/insights";
import { PageHeaderFX } from "@/components/ui/PageHeaderFX";
import { Reveal } from "@/components/ui/Reveal";
import { ChapterNumeral } from "@/components/ui/ChapterNumeral";
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

const pad2 = (n: number) => String(n).padStart(2, "0");

export function InsightArticleView({ slug }: { slug: string }) {
  const lang = useLang();
  const t = T[lang];

  const base = getInsight(slug);
  if (!base) return null;
  const post = localizeInsight(base, lang);
  const num = pad2(INSIGHTS.findIndex((i) => i.slug === post.slug) + 1);

  const more = INSIGHTS.filter((i) => i.slug !== post.slug)
    .slice(0, 2)
    .map((p) => localizeInsight(p, lang));

  return (
    <main className="relative">
      {/* ---------- HEADER — ghost entry numeral, mono dateline register ---------- */}
      <section className="relative overflow-hidden pb-10 pt-40">
        <PageHeaderFX accent={post.accent} />
        <div className="container-x relative">
          <div className="mx-auto max-w-[44rem]">
            <Reveal>
              <LocaleLink
                href="/insights"
                data-cursor
                className="link-underline font-mono text-xs tracking-widest text-mist"
              >
                {t.back}
              </LocaleLink>
            </Reveal>

            <div className="relative mt-12">
              <ChapterNumeral n={num} label="insight" />
              <div className="relative z-10">
                <Reveal delay={0.05}>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs tracking-widest text-fog">
                    <span className="text-accent tabular-nums">{num}</span>
                    <span style={{ color: post.accent }}>{post.category}</span>
                    <span>{fmt(post.date, lang)}</span>
                    <span>
                      {post.readingMinutes} {t.minRead}
                    </span>
                  </div>
                </Reveal>
                <Reveal delay={0.12}>
                  <h1 className="text-giant text-gradient mt-6 text-balance">
                    {post.title}
                  </h1>
                </Reveal>
                <Reveal delay={0.2}>
                  <p className="mt-6 text-balance text-lg leading-relaxed text-mist">
                    {post.excerpt}
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- BODY — a single reading measure, numbered movements ---------- */}
      <article className="relative z-10 bg-void pb-24 pt-10">
        <div className="container-x">
          <div className="mx-auto max-w-[44rem]">
            {post.body.map((block, i) => (
              <section
                key={block.heading}
                className={i === 0 ? undefined : "mt-16 md:mt-20"}
              >
                <Reveal>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-accent tabular-nums">
                      {pad2(i + 1)}
                    </span>
                    <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
                  </div>
                  <h2 className="mt-5 max-w-xl text-balance font-display text-2xl font-semibold tracking-tight text-chalk md:text-3xl">
                    {block.heading}
                  </h2>
                </Reveal>
                <div className="mt-6 space-y-5">
                  {block.paragraphs.map((p, j) => (
                    <p
                      key={j}
                      className="text-[1.0625rem] leading-[1.85] text-mist"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}

            {/* mono end mark — hardcoded, non-translatable instrument readout */}
            <div
              aria-hidden
              className="mt-16 flex items-center gap-4 font-mono text-[0.68rem] tracking-wider text-fog tabular-nums"
            >
              <span>
                <span className="text-accent">▮</span> end of entry {num}
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
            </div>
          </div>
        </div>
      </article>

      {/* ---------- KEEP READING — hairline index rows, no cards ---------- */}
      <section className="relative z-10 bg-void pb-32">
        <div className="container-x">
          <div className="mx-auto max-w-[44rem]">
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="eyebrow">{t.keepReading}</span>
                <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
              </div>
            </Reveal>
            <ul className="mt-8 border-b border-white/[0.07]">
              {more.map((p, i) => (
                <Reveal as="li" key={p.slug} delay={i * 0.06} className="hairline-t">
                  <LocaleLink
                    href={`/insights/${p.slug}`}
                    data-cursor
                    className="group flex items-baseline gap-5 py-6"
                  >
                    <span className="font-mono text-xs text-accent tabular-nums">
                      {pad2(i + 1)}
                    </span>
                    <div className="flex-1">
                      <span
                        className="font-mono text-[0.65rem] uppercase tracking-[0.25em]"
                        style={{ color: p.accent }}
                      >
                        {p.category}
                      </span>
                      <h3 className="mt-1.5 font-display text-xl font-semibold tracking-tight text-chalk transition-transform duration-500 group-hover:translate-x-1">
                        {p.title}
                      </h3>
                    </div>
                    <span
                      aria-hidden
                      className="font-mono text-xs text-fog transition-all duration-500 group-hover:translate-x-1 group-hover:text-chalk"
                    >
                      →
                    </span>
                  </LocaleLink>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
