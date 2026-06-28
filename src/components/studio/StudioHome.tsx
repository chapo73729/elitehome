"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ============================================================
   ARDLABS — Studio direction (proof). A light, editorial digital
   studio: cream paper, black ink, one coral signature accent,
   oversized type. The opposite of the generic dark/blue AI look.
   Self-contained (its own header/footer) so it can be evaluated
   before rolling the identity across the whole site.
   ============================================================ */

const INK = "#14110f";
const ACCENT = "#ff4322";

const SERVICES = [
  { n: "01", t: "Web development", d: "Fast, accessible, bespoke front-ends and the systems behind them — Next.js, React, headless." },
  { n: "02", t: "Web design — UI/UX", d: "Interfaces with a point of view. Research, design systems, prototypes that ship." },
  { n: "03", t: "Web apps & SaaS", d: "Dashboards, platforms and tools engineered to scale with your business." },
  { n: "04", t: "E-commerce", d: "Storefronts that load instantly and convert — Shopify, headless, custom." },
  { n: "05", t: "Brand & identity", d: "Logos, type and visual systems that make you impossible to ignore." },
  { n: "06", t: "Performance & SEO", d: "Core Web Vitals, technical SEO and the speed that wins rankings." },
];

const WORK = [
  { tag: "E-commerce", t: "Maison Vela", d: "A headless storefront for a luxury label.", c1: "#ffe9e3", c2: "#ff4322" },
  { tag: "SaaS", t: "Orbit Dashboard", d: "An analytics platform from zero to launch.", c1: "#e7ecff", c2: "#3b4cff" },
  { tag: "Brand + Web", t: "Northbound", d: "Identity and site for a design consultancy.", c1: "#e9f3ea", c2: "#16a34a" },
  { tag: "Web app", t: "Cadence", d: "A scheduling tool teams actually enjoy.", c1: "#fff2d6", c2: "#e8a317" },
];

const STEPS = [
  { n: "01", t: "Discover", d: "We dig into your goals, users and constraints — then write a sharp brief." },
  { n: "02", t: "Design", d: "Directions, systems and prototypes. You see it before we build it." },
  { n: "03", t: "Build", d: "Clean, fast, maintainable code. Weekly demos, no surprises." },
  { n: "04", t: "Launch & grow", d: "Ship, measure, iterate. We stay for the part that compounds." },
];

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f3f0e9]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10">
        <a href="#top" className="text-lg font-bold tracking-tight">
          ARDLABS<span style={{ color: ACCENT }}>.</span>
        </a>
        <nav className="hidden gap-8 text-sm font-medium md:flex">
          {["Work", "Services", "Studio", "Contact"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="relative py-1 transition-opacity hover:opacity-60">
              {l}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#f3f0e9] transition-transform hover:-translate-y-0.5"
          style={{ background: INK }}
        >
          Start a project
        </a>
      </div>
    </header>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section id="top" ref={ref} className="relative overflow-hidden px-6 pb-16 pt-20 md:px-10 md:pb-24 md:pt-28">
      <div className="relative mx-auto max-w-[1400px]">
        <motion.div
          style={{ y }}
          className="pointer-events-none absolute right-[-12%] top-[-22%] -z-0 hidden h-[26vw] w-[26vw] rounded-full opacity-90 md:block"
        >
          <div className="h-full w-full rounded-full" style={{ background: ACCENT }} />
        </motion.div>

        <p className="relative z-10 font-mono text-xs uppercase tracking-[0.3em] text-black/50">
          Digital studio · Est. 2019
        </p>

        <h1 className="relative z-10 mt-6 max-w-[15ch] text-[clamp(2.6rem,8.5vw,8rem)] font-bold leading-[0.95] tracking-[-0.03em]">
          We design &amp; build the web&rsquo;s{" "}
          <span style={{ color: ACCENT }}>next benchmark</span>.
        </h1>

        <div className="relative z-10 mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-lg leading-relaxed text-black/70">
            ARDLABS is a digital studio. We craft websites, web apps and brands
            for ambitious teams — engineered to be fast, beautiful and
            impossible to forget.
          </p>
          <div className="flex flex-shrink-0 gap-3">
            <a href="#work" className="rounded-full border border-black/15 px-7 py-3.5 text-sm font-semibold transition-colors hover:border-black/40">
              See our work
            </a>
            <a href="#contact" className="rounded-full px-7 py-3.5 text-sm font-semibold text-[#f3f0e9]" style={{ background: ACCENT }}>
              Start a project →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["Web development", "UI/UX design", "Web apps", "E-commerce", "Branding", "SEO & performance"];
  const seq = [...items, ...items];
  return (
    <div className="border-y border-black/10 py-5">
      <div className="group flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
        <div className="marquee-track">
          {seq.map((it, i) => (
            <span key={i} className="mx-6 inline-flex items-center gap-6 text-2xl font-semibold tracking-tight md:text-3xl">
              {it}
              <span style={{ color: ACCENT }}>✸</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function Services() {
  return (
    <section id="services" className="px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="flex items-end justify-between gap-6">
          <h2 className="max-w-[14ch] text-[clamp(2rem,5vw,4rem)] font-bold leading-[0.98] tracking-[-0.02em]">
            What we do.
          </h2>
          <span className="hidden font-mono text-xs uppercase tracking-[0.3em] text-black/40 md:block">
            Services
          </span>
        </Reveal>
        <div className="mt-14 border-t border-black/10">
          {SERVICES.map((s, i) => (
            <Reveal key={s.n} delay={(i % 2) * 0.05}>
              <div className="group grid grid-cols-1 items-baseline gap-3 border-b border-black/10 py-7 transition-colors hover:bg-black/[0.03] md:grid-cols-[5rem_1fr_1.2fr] md:gap-8 md:px-2">
                <span className="font-mono text-sm text-black/40">{s.n}</span>
                <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  <span className="inline-flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full opacity-0 transition-opacity group-hover:opacity-100" style={{ background: ACCENT }} />
                    {s.t}
                  </span>
                </h3>
                <p className="text-black/60">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Work() {
  return (
    <section id="work" className="px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="flex items-end justify-between gap-6">
          <h2 className="max-w-[16ch] text-[clamp(2rem,5vw,4rem)] font-bold leading-[0.98] tracking-[-0.02em]">
            Selected work.
          </h2>
          <span className="hidden font-mono text-xs uppercase tracking-[0.3em] text-black/40 md:block">
            Representative — replace with yours
          </span>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {WORK.map((w, i) => (
            <Reveal key={w.t} delay={(i % 2) * 0.06}>
              <article className="group cursor-pointer">
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl" style={{ background: w.c1 }}>
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="text-7xl font-bold tracking-tight transition-transform duration-500 group-hover:scale-110" style={{ color: w.c2 }}>
                      {w.t.split(" ").map((p) => p[0]).join("")}
                    </span>
                  </div>
                  <span className="absolute left-5 top-5 rounded-full bg-white/70 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest backdrop-blur">
                    {w.tag}
                  </span>
                </div>
                <div className="mt-5 flex items-baseline justify-between">
                  <h3 className="text-2xl font-semibold tracking-tight">{w.t}</h3>
                  <span className="font-mono text-sm text-black/40 transition-transform group-hover:translate-x-1">→</span>
                </div>
                <p className="mt-1 text-black/60">{w.d}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section id="studio" className="px-6 py-24 md:px-10 md:py-32" style={{ background: INK, color: "#f3f0e9" }}>
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">How we work</span>
          <h2 className="mt-6 max-w-[18ch] text-[clamp(2rem,5vw,4rem)] font-bold leading-[0.98] tracking-[-0.02em]">
            A studio that ships, not just decks.
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.06}>
              <div className="h-full p-8" style={{ background: INK }}>
                <span className="font-mono text-sm" style={{ color: ACCENT }}>{s.n}</span>
                <h3 className="mt-6 text-xl font-semibold">{s.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaContact() {
  return (
    <section id="contact" className="px-6 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-black/40">Let&rsquo;s build</p>
          <h2 className="mx-auto mt-6 max-w-[16ch] text-[clamp(2.4rem,7vw,6rem)] font-bold leading-[0.95] tracking-[-0.03em]">
            Have a project in mind?
          </h2>
          <p className="mx-auto mt-6 max-w-md text-lg text-black/70">
            Tell us what you&rsquo;re building. We reply within a day.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="mailto:info@ardlabs.com" className="rounded-full px-8 py-4 text-sm font-semibold text-[#f3f0e9]" style={{ background: ACCENT }}>
              Start a project →
            </a>
            <a href="mailto:info@ardlabs.com" className="rounded-full border border-black/15 px-8 py-4 text-sm font-semibold transition-colors hover:border-black/40">
              info@ardlabs.com
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-black/10 px-6 py-10 md:px-10">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 text-sm text-black/50 md:flex-row">
        <span className="text-lg font-bold tracking-tight text-[#14110f]">
          ARDLABS<span style={{ color: ACCENT }}>.</span>
        </span>
        <span>© 2026 ARDLABS — Digital studio. All rights reserved.</span>
        <Link href="/legal/imprint" className="hover:text-black">Legal</Link>
      </div>
    </footer>
  );
}

export function StudioHome() {
  return (
    <div className="min-h-screen bg-[#f3f0e9] font-sans text-[#14110f] antialiased [--tw-prose:none]">
      <Header />
      <Hero />
      <Marquee />
      <Services />
      <Work />
      <Process />
      <CtaContact />
      <Footer />
    </div>
  );
}
