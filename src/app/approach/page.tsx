import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Approach",
  description:
    "How ARDLABS® works — a long-horizon method that turns a hypothesis into load-bearing infrastructure.",
  alternates: { canonical: "/approach" },
  openGraph: {
    title: "Approach · ARDLABS®",
    description: "How we turn a hypothesis into load-bearing infrastructure.",
    url: "/approach",
  },
};

const PHASES = [
  {
    n: "01",
    t: "Hypothesis",
    d: "Every venture begins as a sharp, falsifiable thesis about how an industry will change — and what has to be built for that change to become inevitable.",
  },
  {
    n: "02",
    t: "Research",
    d: "We pressure-test the thesis against reality: prototypes, evaluations and the unglamorous work of measuring rather than admiring. Most ideas are corrected here.",
  },
  {
    n: "03",
    t: "Engineer",
    d: "What survives is built to the second standard — load-bearing, observable and dependable at its worst, not just capable on average.",
  },
  {
    n: "04",
    t: "Deploy",
    d: "We ship into production with guardrails, fallbacks and the operational tooling that lets a system be relied upon, then learn from how it behaves under load.",
  },
  {
    n: "05",
    t: "Scale & own",
    d: "Proven ventures are scaled across our fabric and held privately — compounding over years rather than being optimised for an exit.",
  },
];

const PRINCIPLES = [
  { t: "Correctness over velocity", d: "We move fast where it's cheap to be wrong and slowly where it isn't." },
  { t: "Measure, don't admire", d: "Behaviour is something to be evaluated, not trusted because it looks impressive." },
  { t: "Build the loop", d: "Robustness comes from the system as a whole — plan, act, observe, correct — not from any single step." },
  { t: "Escalate early", d: "Autonomous systems should surface ambiguity to humans at exactly the right moment." },
];

export default function Approach() {
  return (
    <main className="relative">
      <section className="relative overflow-hidden pb-10 pt-40">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[50vh] w-[50vh] -translate-x-1/2 rounded-full bg-accent/12 blur-[150px]" />
        <div className="container-x relative max-w-4xl">
          <Link href="/" className="link-underline font-mono text-xs tracking-widest text-mist">
            ← Home
          </Link>
          <p className="eyebrow mt-8">Approach</p>
          <h1 className="text-giant text-gradient mt-4 max-w-3xl text-balance">
            Hypothesis to infrastructure.
          </h1>
          <p className="mt-6 max-w-2xl text-balance text-lg text-mist">
            Every venture begins as a hypothesis and ends as infrastructure. The
            method between those two points is deliberate, and it&rsquo;s the same
            across every domain we work in.
          </p>
        </div>
      </section>

      <section className="relative z-10 bg-void py-16">
        <div className="container-x max-w-3xl">
          <ol className="grid gap-px overflow-hidden rounded-3xl hairline">
            {PHASES.map((p) => (
              <li key={p.n} className="bg-ink p-8 md:p-10">
                <div className="flex items-baseline gap-5">
                  <span className="font-mono text-sm text-accent">{p.n}</span>
                  <div>
                    <h2 className="font-display text-xl font-semibold text-chalk">{p.t}</h2>
                    <p className="mt-3 leading-relaxed text-mist">{p.d}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative z-10 bg-void py-16">
        <div className="container-x max-w-5xl">
          <p className="eyebrow mb-8">Operating principles</p>
          <div className="grid gap-px overflow-hidden rounded-3xl hairline sm:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <div key={p.t} className="bg-ink p-8">
                <h3 className="font-display text-lg font-semibold text-chalk">{p.t}</h3>
                <p className="mt-3 leading-relaxed text-mist">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-void py-20">
        <div className="container-x max-w-3xl text-center">
          <h2 className="text-section-title text-gradient text-balance">
            Have a problem worth a decade?
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-chalk px-7 py-3.5 text-sm font-medium text-void transition-opacity hover:opacity-90"
            >
              Start a conversation
            </Link>
            <Link
              href="/work"
              className="rounded-full hairline px-7 py-3.5 text-sm font-medium text-chalk transition-colors hover:border-white/25"
            >
              See the work
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
