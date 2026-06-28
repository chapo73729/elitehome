import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "ARDLABS® is a private laboratory engineering artificial intelligence, software, automation and physical infrastructure for the long term.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About · ARDLABS®",
    description: "A private laboratory engineering the next century of intelligence and infrastructure.",
    url: "/about",
  },
};

const PRINCIPLES = [
  {
    k: "Long horizon",
    v: "We measure progress in decades. It lets us attempt work whose payoff is invisible on a quarterly clock.",
  },
  {
    k: "Load-bearing, not impressive",
    v: "Everything we ship is built to be relied upon, not to demo well. Dependability is the standard.",
  },
  {
    k: "Private by design",
    v: "Patient capital and a small, senior bench let us build quietly and own what we create.",
  },
  {
    k: "One standard, many worlds",
    v: "Each venture runs as its own domain — distinct teams, distinct physics — held to a shared standard of engineering.",
  },
];

const DISCIPLINES = [
  { t: "AI Research", d: "Frontier models, autonomous agents and the evaluation discipline that makes them dependable." },
  { t: "Software & Platform", d: "Distributed runtimes and developer infrastructure engineered for production scale." },
  { t: "Industrial & Robotics", d: "Instrumented machines, digital twins and self-reconfiguring production." },
  { t: "Maritime & Earth Systems", d: "Live models of physical systems — oceans, fleets, networks — read like data." },
  { t: "Capital & Operations", d: "Patient capital allocation and the operating fabric that connects every hub." },
  { t: "Design & Research", d: "The interfaces and instrumentation that make complex systems legible." },
];

export default function About() {
  return (
    <main className="relative">
      <section className="relative overflow-hidden pb-10 pt-40">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[50vh] w-[50vh] -translate-x-1/2 rounded-full bg-accent/12 blur-[150px]" />
        <div className="container-x relative max-w-4xl">
          <Link href="/" className="link-underline font-mono text-xs tracking-widest text-mist">
            ← Home
          </Link>
          <p className="eyebrow mt-8">About</p>
          <h1 className="text-giant text-gradient mt-4 max-w-3xl text-balance">
            A laboratory of the future.
          </h1>
          <p className="mt-6 max-w-2xl text-balance text-lg text-mist">
            ARDLABS is a private venture laboratory. We engineer artificial
            intelligence, software, automation and physical infrastructure — and
            we hold them for the long term, as load-bearing systems rather than
            demonstrations.
          </p>
        </div>
      </section>

      <section className="relative z-10 bg-void py-16">
        <div className="container-x max-w-3xl space-y-6">
          <h2 className="font-display text-2xl font-semibold text-chalk">Why we exist</h2>
          <p className="leading-relaxed text-mist">
            Most organisations optimise the next reporting period. It is rational
            — and it quietly caps the kind of problems they can attempt. We chose
            a different unit of time. When the horizon is a decade, a class of
            work becomes available: foundational research, infrastructure that
            compounds, and ventures that only become valuable once an entire
            industry depends on them.
          </p>
          <p className="leading-relaxed text-mist">
            We treat patience as infrastructure — something built deliberately and
            drawn on when the work demands it. Patient capital, a senior
            engineering bench and a culture that rewards correctness over velocity
            are what let a long-horizon thesis survive contact with reality.
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
            One bench, six disciplines.
          </h2>
          <p className="mt-5 max-w-xl text-balance text-mist">
            We operate as a small, senior team organised by discipline rather than
            by title — principals who build, across every timezone.
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
