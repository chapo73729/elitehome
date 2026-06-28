import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { PageHeaderFX } from "@/components/ui/PageHeaderFX";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join ARDLABS® — a small, senior team engineering artificial intelligence, software, automation and physical infrastructure for the long term.",
  alternates: { canonical: "/careers" },
  openGraph: {
    title: "Careers · ARDLABS®",
    description: "Join a small, senior team building load-bearing systems for the long term.",
    url: "/careers",
  },
};

const CULTURE = [
  { t: "Senior by default", d: "Small teams of principals who build. Little hierarchy, high ownership, real autonomy." },
  { t: "Long horizon", d: "Work measured in years, not sprints. We optimise for what compounds." },
  { t: "Remote across hubs", d: "Work follows the sun across Prague, Geneva, Singapore, Dubai, Tokyo and New York." },
  { t: "Correctness culture", d: "We reward getting it right over getting it out — and we mean it." },
];

const ROLES = [
  { t: "AI Research Engineer", team: "AI Research", loc: "Remote · Global" },
  { t: "Distributed Systems Engineer", team: "Software & Platform", loc: "Remote · Global" },
  { t: "Robotics / Controls Engineer", team: "Industrial", loc: "Prague · Hybrid" },
  { t: "Data & Modelling Scientist", team: "Maritime & Earth Systems", loc: "Remote · Global" },
  { t: "Product Designer", team: "Design & Research", loc: "Remote · Global" },
];

export default function Careers() {
  return (
    <main className="relative">
      <section className="relative overflow-hidden pb-10 pt-40">
        <PageHeaderFX accent="#b48cff" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[50vh] w-[50vh] -translate-x-1/2 rounded-full bg-accent/12 blur-[150px]" />
        <div className="container-x relative max-w-4xl">
          <Link href="/" className="link-underline font-mono text-xs tracking-widest text-mist">
            ← Home
          </Link>
          <p className="eyebrow mt-8">Careers</p>
          <h1 className="text-giant text-gradient mt-4 max-w-3xl text-balance">
            Build what outlasts you.
          </h1>
          <p className="mt-6 max-w-2xl text-balance text-lg text-mist">
            We hire a small number of exceptional engineers, scientists and
            designers — people who would rather build one load-bearing thing than
            ten impressive ones.
          </p>
        </div>
      </section>

      <section className="relative z-10 bg-void py-16">
        <div className="container-x max-w-5xl">
          <p className="eyebrow mb-8">How we work</p>
          <div className="grid gap-px overflow-hidden rounded-3xl hairline sm:grid-cols-2">
            {CULTURE.map((c) => (
              <div key={c.t} className="bg-ink p-8">
                <h3 className="font-display text-lg font-semibold text-chalk">{c.t}</h3>
                <p className="mt-3 leading-relaxed text-mist">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-void py-16">
        <div className="container-x max-w-4xl">
          <p className="eyebrow mb-8">Open roles</p>
          <ul className="grid gap-px overflow-hidden rounded-3xl hairline">
            {ROLES.map((r) => (
              <li key={r.t}>
                <a
                  href={`mailto:${SITE.email}?subject=${encodeURIComponent("Application — " + r.t)}`}
                  className="group flex flex-wrap items-center justify-between gap-3 bg-ink p-7 transition-colors hover:bg-white/[0.03]"
                >
                  <div>
                    <h3 className="font-display text-lg font-semibold text-chalk transition-colors group-hover:text-gradient">
                      {r.t}
                    </h3>
                    <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-widest text-fog">
                      {r.team}
                    </p>
                  </div>
                  <div className="flex items-center gap-5">
                    <span className="font-mono text-xs tracking-widest text-mist">{r.loc}</span>
                    <span className="font-mono text-xs tracking-widest text-accent transition-transform duration-300 group-hover:translate-x-1">
                      APPLY →
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-balance text-mist">
            Don&rsquo;t see your role?{" "}
            <a href={`mailto:${SITE.email}?subject=${encodeURIComponent("Speculative application")}`} className="text-chalk underline">
              Tell us what you&rsquo;d build
            </a>{" "}
            — we hire exceptional people ahead of need.
          </p>
        </div>
      </section>
    </main>
  );
}
