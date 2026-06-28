import type { Metadata } from "next";
import Link from "next/link";
import { PageHeaderFX } from "@/components/ui/PageHeaderFX";

export const metadata: Metadata = {
  title: "Approach",
  description:
    "How ARDLABS® works — a studio method that turns a problem into reliable software, shipped and supported.",
  alternates: { canonical: "/approach" },
  openGraph: {
    title: "Approach · ARDLABS®",
    description: "How we turn a problem into reliable software, shipped end to end.",
    url: "/approach",
  },
};

const PHASES = [
  {
    n: "01",
    t: "Frame",
    d: "We start by framing the real problem, the constraints and the bet — not the feature list. Clarity here is what keeps the rest of the project honest.",
  },
  {
    n: "02",
    t: "Prototype",
    d: "We pressure-test the idea against reality: prototypes and evaluations that exercise the riskiest assumptions first. Most directions are corrected here, cheaply.",
  },
  {
    n: "03",
    t: "Design & build",
    d: "What survives is designed and engineered end to end — interfaces that are clear and code that stays fast, secure and legible for years.",
  },
  {
    n: "04",
    t: "Harden & ship",
    d: "We test, instrument and secure before launch, then ship into production with guardrails, fallbacks and the observability that lets a system be relied upon.",
  },
  {
    n: "05",
    t: "Support",
    d: "We stay for the part that matters: maintaining, measuring and improving the software well beyond launch, so it keeps working as it grows.",
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
        <PageHeaderFX accent="#4f8cff" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[50vh] w-[50vh] -translate-x-1/2 rounded-full bg-accent/12 blur-[150px]" />
        <div className="container-x relative max-w-4xl">
          <Link href="/" className="link-underline font-mono text-xs tracking-widest text-mist">
            ← Home
          </Link>
          <p className="eyebrow mt-8">Approach</p>
          <h1 className="text-giant text-gradient mt-4 max-w-3xl text-balance">
            Problem to product.
          </h1>
          <p className="mt-6 max-w-2xl text-balance text-lg text-mist">
            Every project begins as a problem and ends as a product that holds
            up. The method between those two points is deliberate, and it&rsquo;s
            the same across every pole we work in.
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
            Have something worth building right?
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
