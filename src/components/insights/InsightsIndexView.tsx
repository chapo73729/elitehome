"use client";

import { LocaleLink } from "@/components/ui/LocaleLink";
import { INSIGHTS, localizeInsight } from "@/lib/insights";
import { PageHeaderFX } from "@/components/ui/PageHeaderFX";
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

export function InsightsIndexView() {
  const lang = useLang();
  const t = T[lang];
  const posts = INSIGHTS.map((p) => localizeInsight(p, lang));

  return (
    <main className="relative">
      <section className="relative overflow-hidden pb-8 pt-40">
        <PageHeaderFX />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[45vh] w-[45vh] -translate-x-1/2 rounded-full bg-accent/12 blur-[140px]" />
        <div className="container-x relative max-w-4xl">
          <LocaleLink
            href="/"
            className="link-underline font-mono text-xs tracking-widest text-mist"
          >
            {t.home}
          </LocaleLink>
          <p className="eyebrow mt-8">{t.eyebrow}</p>
          <h1 className="text-giant text-gradient mt-4 max-w-3xl text-balance">
            {t.h1}
          </h1>
          <p className="mt-6 max-w-xl text-balance text-mist">{t.intro}</p>
        </div>
      </section>

      <section className="relative z-10 bg-void pb-32 pt-10">
        <div className="container-x max-w-4xl">
          <ul className="grid gap-px overflow-hidden rounded-3xl hairline">
            {posts.map((post) => (
              <li key={post.slug}>
                <LocaleLink
                  href={`/insights/${post.slug}`}
                  className="group block bg-ink p-8 transition-colors hover:bg-white/[0.03] md:p-10"
                >
                  <div className="flex flex-wrap items-center gap-4 font-mono text-xs tracking-widest text-fog">
                    <span style={{ color: post.accent }}>{post.category}</span>
                    <span>{fmt(post.date, lang)}</span>
                    <span>{post.readingMinutes} {t.minRead}</span>
                  </div>
                  <h2 className="mt-4 font-display text-2xl font-semibold text-chalk transition-colors group-hover:text-gradient md:text-3xl">
                    {post.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-balance text-mist">
                    {post.excerpt}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 font-mono text-xs tracking-widest text-accent">
                    {t.read}
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </LocaleLink>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
