"use client";

import { LocaleLink } from "@/components/ui/LocaleLink";
import { INSIGHTS, localizeInsight } from "@/lib/insights";
import { PageHeaderFX } from "@/components/ui/PageHeaderFX";
import { Reveal } from "@/components/ui/Reveal";
import { ChapterNumeral } from "@/components/ui/ChapterNumeral";
import { useLang, type Lang } from "@/lib/lang";

const T = {
  en: {
    home: "← Home",
    eyebrow: "Insights",
    h1: "Notes from the studio.",
    intro:
      "Long-form thinking on how we engineer software, platforms and AI systems — and why clarity, reliability and detail are the real primitives.",
    read: "READ",
    minRead: "min read",
  },
  fr: {
    home: "← Accueil",
    eyebrow: "Perspectives",
    h1: "Notes du studio.",
    intro:
      "Une réflexion de fond sur la façon dont nous concevons logiciels, plateformes et systèmes d'IA — et pourquoi la clarté, la fiabilité et le détail sont les vrais fondamentaux.",
    read: "LIRE",
    minRead: "min de lecture",
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

export function InsightsIndexView() {
  const lang = useLang();
  const t = T[lang];
  const posts = INSIGHTS.map((p) => localizeInsight(p, lang));
  const count = pad2(posts.length);

  return (
    <main className="relative">
      {/* ---------- HEADER — ghost numeral behind the title, mono register ---------- */}
      <section className="relative overflow-hidden pb-10 pt-40">
        <PageHeaderFX />
        <div className="container-x relative">
          <Reveal>
            <LocaleLink
              href="/"
              data-cursor
              className="link-underline font-mono text-xs tracking-widest text-mist"
            >
              {t.home}
            </LocaleLink>
          </Reveal>

          <div className="relative mt-12">
            <ChapterNumeral n={count} label="journal" />
            <div className="relative z-10">
              <Reveal delay={0.05}>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-accent tabular-nums">
                    {count}
                  </span>
                  <span className="eyebrow">{t.eyebrow}</span>
                  <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
                </div>
              </Reveal>
              <Reveal delay={0.12}>
                <h1 className="text-giant text-gradient mt-6 max-w-3xl text-balance">
                  {t.h1}
                </h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-6 max-w-xl text-balance text-mist">{t.intro}</p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- INDEX — numbered hairline editorial rows, no cards ---------- */}
      <section className="relative z-10 bg-void pb-32 pt-8">
        <div className="container-x">
          <ul className="border-b border-white/[0.07]">
            {posts.map((post, i) => (
              <Reveal as="li" key={post.slug} delay={i * 0.06} className="hairline-t">
                <LocaleLink
                  href={`/insights/${post.slug}`}
                  data-cursor
                  aria-label={`${post.title} — ${t.read}`}
                  className="group grid items-baseline gap-x-6 gap-y-2 py-8 md:grid-cols-12 md:py-10"
                >
                  <span className="font-mono text-xs text-accent tabular-nums md:col-span-1">
                    {pad2(i + 1)}
                  </span>
                  <span
                    className="font-mono text-[0.65rem] uppercase tracking-[0.25em] md:col-span-2"
                    style={{ color: post.accent }}
                  >
                    {post.category}
                  </span>
                  <div className="md:col-span-5">
                    <h2 className="font-display text-2xl font-semibold tracking-tight text-chalk transition-transform duration-500 group-hover:translate-x-1 md:text-3xl">
                      {post.title}
                    </h2>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-mist">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="font-mono text-[0.65rem] text-fog tabular-nums md:col-span-3 md:text-right">
                    <span className="block">{fmt(post.date, lang)}</span>
                    <span className="mt-1 block">
                      {post.readingMinutes} {t.minRead}
                    </span>
                  </div>
                  <span
                    aria-hidden
                    className="hidden font-mono text-xs text-fog transition-all duration-500 group-hover:translate-x-1 group-hover:text-chalk md:col-span-1 md:block md:justify-self-end"
                  >
                    →
                  </span>
                </LocaleLink>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
