"use client";

import { LocaleLink } from "@/components/ui/LocaleLink";
import { Reveal } from "@/components/ui/Reveal";
import { INSIGHTS } from "@/lib/insights";
import { useContent } from "@/lib/content";

function fmt(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function InsightsTeaser() {
  const label = useContent().footer.insights ?? "Insights";
  const posts = INSIGHTS.slice(0, 3);
  return (
    <section id="insights" className="relative z-10 bg-void py-28 md:py-36">
      <div className="container-x">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-accent">10</span>
            <span className="eyebrow">{label}</span>
            <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
          </div>
        </Reveal>

        <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
          <Reveal delay={0.08}>
            <h2 className="text-section-title text-gradient max-w-xl text-balance">
              Notes from the studio.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <LocaleLink
              href="/insights"
              className="link-underline font-mono text-xs tracking-widest text-mist transition-colors hover:text-chalk"
            >
              VIEW ALL →
            </LocaleLink>
          </Reveal>
        </div>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-3xl hairline md:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.08} className="h-full">
              <li className="h-full">
                <LocaleLink
                  href={`/insights/${post.slug}`}
                  className="group flex h-full flex-col bg-ink p-7 transition-colors hover:bg-white/[0.03]"
                >
                  <div className="flex items-center gap-3 font-mono text-[0.7rem] tracking-widest text-fog">
                    <span style={{ color: post.accent }}>{post.category}</span>
                    <span>{fmt(post.date)}</span>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold text-chalk transition-colors group-hover:text-gradient">
                    {post.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm text-mist">{post.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-mono text-[0.7rem] tracking-widest text-accent">
                    READ
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </LocaleLink>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
