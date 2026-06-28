import type { Metadata } from "next";
import Link from "next/link";
import { PageHeaderFX } from "@/components/ui/PageHeaderFX";

export const metadata: Metadata = {
  title: "About",
  description:
    "ARDLABS® is a digital engineering studio. We design and build software, platforms and AI systems — refined to the detail.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About · ARDLABS®",
    description: "A digital engineering studio designing and building software, platforms and AI systems.",
    url: "/about",
  },
};

const PRINCIPLES = [
  {
    k: "Refined to the detail",
    v: "Everything we ship is built to hold up — fast, secure and legible — not just to demo well.",
  },
  {
    k: "Reliable, not impressive",
    v: "Dependability is the standard. We engineer products to be relied upon in real operations.",
  },
  {
    k: "A bias for shipping",
    v: "We start with the hard question and end with a product in production, maintained beyond launch.",
  },
  {
    k: "One standard, four poles",
    v: "Strategy, design & development, data & AI, and cloud — distinct disciplines, a shared standard of engineering.",
  },
];

const DISCIPLINES = [
  { t: "Strategy & Consulting", d: "Technology consulting, applied R&D and prototyping that turn an idea into a validated plan." },
  { t: "Design & Development", d: "Custom software, web, mobile, SaaS and internal platforms — designed and engineered end to end." },
  { t: "Data & AI", d: "Applied AI, intelligent automation and the dashboards that turn operations into decisions." },
  { t: "Cloud & Infrastructure", d: "Cloud architecture, deployment, APIs and integrations engineered for uptime and scale." },
];

export default function About() {
  return (
    <main className="relative">
      <section className="relative overflow-hidden pb-10 pt-40">
        <PageHeaderFX />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[50vh] w-[50vh] -translate-x-1/2 rounded-full bg-accent/12 blur-[150px]" />
        <div className="container-x relative max-w-4xl">
          <Link href="/" className="link-underline font-mono text-xs tracking-widest text-mist">
            ← Home
          </Link>
          <p className="eyebrow mt-8">About</p>
          <h1 className="text-giant text-gradient mt-4 max-w-3xl text-balance">
            A digital engineering studio.
          </h1>
          <p className="mt-6 max-w-2xl text-balance text-lg text-mist">
            ARDLABS is a digital engineering studio. We design and build
            software, platforms and AI systems that are fast, reliable, and
            refined to the detail — products built to hold up, not
            demonstrations.
          </p>
        </div>
      </section>

      <section className="relative z-10 bg-void py-16">
        <div className="container-x max-w-3xl space-y-6">
          <h2 className="font-display text-2xl font-semibold text-chalk">Why we exist</h2>
          <p className="leading-relaxed text-mist">
            Most studios stop at features. We engineer the whole product. Every
            project starts as a hard question — what to build, why, and how it
            will hold up — and ends as software, a platform or an AI system that
            works in production and keeps working long after launch.
          </p>
          <p className="leading-relaxed text-mist">
            Digital engineering is the umbrella. Under it, four poles cover an
            idea end to end: strategy and consulting, design and development,
            data and AI, and cloud and infrastructure. Deep engineering, clear
            design and a bias for shipping are what let a hard idea survive
            contact with reality.
          </p>
        </div>
      </section>

      <section className="relative z-10 bg-void py-16">
        <div className="container-x max-w-5xl">
          <p className="eyebrow mb-8">Principles</p>
          <div className="grid gap-px overflow-hidden rounded-3xl hairline sm:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <div key={p.k} className="bg-ink p-8">
                <h3 className="font-display text-lg font-semibold text-chalk">{p.k}</h3>
                <p className="mt-3 leading-relaxed text-mist">{p.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-void py-16">
        <div className="container-x max-w-5xl">
          <p className="eyebrow mb-3">How we&rsquo;re built</p>
          <h2 className="text-section-title text-gradient max-w-xl text-balance">
            One studio, four poles.
          </h2>
          <p className="mt-5 max-w-xl text-balance text-mist">
            We operate as a small, senior team organised by discipline rather than
            by title — engineers who build, across every timezone.
          </p>
          <div className="mt-10 grid gap-px overflow-hidden rounded-3xl hairline sm:grid-cols-2 lg:grid-cols-3">
            {DISCIPLINES.map((d) => (
              <div key={d.t} className="bg-ink p-7">
                <h3 className="font-display text-base font-semibold text-chalk">{d.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">{d.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-void py-20">
        <div className="container-x max-w-3xl text-center">
          <h2 className="text-section-title text-gradient text-balance">
            Build something that lasts.
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/work"
              className="rounded-full bg-chalk px-7 py-3.5 text-sm font-medium text-void transition-opacity hover:opacity-90"
            >
              See our work
            </Link>
            <Link
              href="/contact"
              className="rounded-full hairline px-7 py-3.5 text-sm font-medium text-chalk transition-colors hover:border-white/25"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
