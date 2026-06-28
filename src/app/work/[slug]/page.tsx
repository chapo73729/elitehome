import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WORK, getCase } from "@/lib/work";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return WORK.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const w = getCase(slug);
  if (!w) return { title: "Case study not found" };
  return {
    title: `${w.name} — ${w.field}`,
    description: w.summary,
    alternates: { canonical: `/work/${w.slug}` },
    openGraph: {
      title: `${w.name} · ARDLABS®`,
      description: w.summary,
      url: `/work/${w.slug}`,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const w = getCase(slug);
  if (!w) notFound();

  const more = WORK.filter((x) => x.slug !== w.slug).slice(0, 2);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: w.name,
    about: w.field,
    description: w.summary,
    creator: { "@type": "Organization", name: SITE.legal },
    url: `${SITE.url}/work/${w.slug}`,
  };

  return (
    <main className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden pb-8 pt-40">
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[45vh] w-[45vh] -translate-x-1/2 rounded-full blur-[140px]"
          style={{ backgroundColor: `${w.accent}1f` }}
        />
        <div className="container-x relative max-w-3xl">
          <Link href="/work" className="link-underline font-mono text-xs tracking-widest text-mist">
            ← Work
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-4 font-mono text-xs tracking-widest text-fog">
            <span style={{ color: w.accent }}>{w.code}</span>
            <span>{w.field}</span>
            <span>{w.stage}</span>
          </div>
          <h1 className="text-giant text-gradient mt-4 text-balance">{w.name}</h1>
          <p className="mt-6 text-balance text-lg text-mist">{w.summary}</p>
        </div>
      </section>

      <article className="relative z-10 bg-void pb-20 pt-8">
        <div className="container-x max-w-3xl space-y-14">
          <section>
            <h2 className="font-display text-2xl font-semibold text-chalk">The challenge</h2>
            <div className="mt-4 space-y-4">
              {w.challenge.map((p, i) => (
                <p key={i} className="leading-relaxed text-mist">{p}</p>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-chalk">Our approach</h2>
            <ol className="mt-6 grid gap-px overflow-hidden rounded-2xl hairline">
              {w.approach.map((a, i) => (
                <li key={i} className="bg-ink p-6 md:p-8">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-chalk">{a.title}</h3>
                      <p className="mt-2 leading-relaxed text-mist">{a.body}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-chalk">The outcome</h2>
            <div className="mt-4 space-y-4">
              {w.outcome.map((p, i) => (
                <p key={i} className="leading-relaxed text-mist">{p}</p>
              ))}
            </div>
            <ul className="mt-8 flex flex-wrap gap-2">
              {w.highlights.map((h) => (
                <li
                  key={h}
                  className="rounded-full border border-white/12 px-4 py-2 font-mono text-xs tracking-widest text-mist"
                >
                  {h}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </article>

      <section className="relative z-10 bg-void pb-32">
        <div className="container-x max-w-3xl">
          <div className="eyebrow mb-6 hairline-t pt-10">More work</div>
          <ul className="grid gap-px overflow-hidden rounded-2xl hairline sm:grid-cols-2">
            {more.map((m) => (
              <li key={m.slug}>
                <Link
                  href={`/work/${m.slug}`}
                  className="group block h-full bg-ink p-6 transition-colors hover:bg-white/[0.03]"
                >
                  <span className="font-mono text-[0.7rem] tracking-widest" style={{ color: m.accent }}>
                    {m.field}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-semibold text-chalk transition-colors group-hover:text-gradient">
                    {m.name}
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
