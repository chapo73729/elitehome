import type { Metadata } from "next";
import Link from "next/link";
import { WORK } from "@/lib/work";
import { PageHeaderFX } from "@/components/ui/PageHeaderFX";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected ventures from ARDLABS® — case studies across artificial intelligence, software, industrial and maritime engineering.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Work · ARDLABS®",
    description: "Selected ventures across AI, software, industrial and maritime.",
    url: "/work",
  },
};

export default function WorkIndex() {
  return (
    <main className="relative">
      <section className="relative overflow-hidden pb-8 pt-40">
        <PageHeaderFX />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[45vh] w-[45vh] -translate-x-1/2 rounded-full bg-accent/12 blur-[140px]" />
        <div className="container-x relative max-w-4xl">
          <Link href="/" className="link-underline font-mono text-xs tracking-widest text-mist">
            ← Home
          </Link>
          <p className="eyebrow mt-8">Work</p>
          <h1 className="text-giant text-gradient mt-4 max-w-3xl text-balance">
            Ventures engineered to be load-bearing.
          </h1>
          <p className="mt-6 max-w-xl text-balance text-mist">
            A selection of what we build — each one run as its own world, held to
            a shared standard of engineering.
          </p>
        </div>
      </section>

      <section className="relative z-10 bg-void pb-32 pt-10">
        <div className="container-x max-w-5xl">
          <ul className="grid gap-px overflow-hidden rounded-3xl hairline md:grid-cols-2">
            {WORK.map((w) => (
              <li key={w.slug}>
                <Link
                  href={`/work/${w.slug}`}
                  className="group flex h-full flex-col bg-ink p-8 transition-colors hover:bg-white/[0.03] md:p-10"
                >
                  <div className="flex items-center justify-between font-mono text-xs tracking-widest text-fog">
                    <span style={{ color: w.accent }}>{w.code}</span>
                    <span>{w.stage}</span>
                  </div>
                  <h2 className="mt-5 font-display text-2xl font-semibold text-chalk transition-colors group-hover:text-gradient md:text-3xl">
                    {w.name}
                  </h2>
                  <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-widest text-mist">
                    {w.field}
                  </p>
                  <p className="mt-4 flex-1 text-balance text-mist">{w.summary}</p>
                  <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs tracking-widest text-accent">
                    CASE STUDY
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
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
