import type { Metadata } from "next";
import Link from "next/link";
import { INSIGHTS } from "@/lib/insights";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Essays from ARDLABS® on long-horizon engineering, artificial intelligence as infrastructure, and operating as a global fabric.",
  alternates: { canonical: "/insights" },
  openGraph: {
    title: "Insights · ARDLABS®",
    description:
      "Essays on long-horizon engineering, AI as infrastructure, and operating as a global fabric.",
    url: "/insights",
  },
};

function fmt(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function InsightsIndex() {
  return (
    <main className="relative">
      <section className="relative overflow-hidden pb-8 pt-40">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[45vh] w-[45vh] -translate-x-1/2 rounded-full bg-accent/12 blur-[140px]" />
        <div className="container-x relative max-w-4xl">
          <Link
            href="/"
            className="link-underline font-mono text-xs tracking-widest text-mist"
          >
            ← Home
          </Link>
          <p className="eyebrow mt-8">Insights</p>
          <h1 className="text-giant text-gradient mt-4 max-w-3xl text-balance">
            Notes from the laboratory.
          </h1>
          <p className="mt-6 max-w-xl text-balance text-mist">
            Long-form thinking on how we engineer for the long horizon — and why
            patience, dependability and a distributed fabric are the real
            primitives.
          </p>
        </div>
      </section>

      <section className="relative z-10 bg-void pb-32 pt-10">
        <div className="container-x max-w-4xl">
          <ul className="grid gap-px overflow-hidden rounded-3xl hairline">
            {INSIGHTS.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/insights/${post.slug}`}
                  className="group block bg-ink p-8 transition-colors hover:bg-white/[0.03] md:p-10"
                >
                  <div className="flex flex-wrap items-center gap-4 font-mono text-xs tracking-widest text-fog">
                    <span style={{ color: post.accent }}>{post.category}</span>
                    <span>{fmt(post.date)}</span>
                    <span>{post.readingMinutes} min read</span>
                  </div>
                  <h2 className="mt-4 font-display text-2xl font-semibold text-chalk transition-colors group-hover:text-gradient md:text-3xl">
                    {post.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-balance text-mist">
                    {post.excerpt}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 font-mono text-xs tracking-widest text-accent">
                    READ
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
