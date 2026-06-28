"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { CanvasMotif } from "@/components/ui/CanvasMotif";
import { useContent } from "@/lib/content";

const MOTIF: Record<string, "code" | "ai" | "industrial" | "ocean"> = {
  ai: "ai",
  strategy: "ai",
  software: "code",
  automation: "code",
  industrial: "industrial",
  maritime: "ocean",
};

function IndustryCard({
  industry,
  i,
  exploreLabel,
}: {
  industry: any;
  i: number;
  exploreLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [7, -7]), {
    stiffness: 150,
    damping: 18,
  });
  const ry = useSpring(useTransform(mx, [0, 1], [-7, 7]), {
    stiffness: 150,
    damping: 18,
  });

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
    el.style.setProperty("--x", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--y", `${((e.clientY - r.top) / r.height) * 100}%`);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <Reveal delay={(i % 3) * 0.08} className="h-full">
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
        className="group relative h-full"
      >
       <Link
        href={`/industries/${industry.id}`}
        data-cursor
        aria-label={`Explore ${industry.title}`}
        className="relative block h-full overflow-hidden rounded-3xl hairline bg-ink p-8 transition-colors duration-500 hover:border-white/15"
       >
        {/* cursor spotlight */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(420px circle at var(--x,50%) var(--y,50%), ${industry.accent}22, transparent 60%)`,
          }}
        />
        {/* living per-domain motif — faded into the card, intensifies on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-700 group-hover:opacity-80"
          style={{
            maskImage:
              "radial-gradient(120% 90% at 80% 0%, #000 0%, rgba(0,0,0,0.5) 45%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(120% 90% at 80% 0%, #000 0%, rgba(0,0,0,0.5) 45%, transparent 75%)",
          }}
        >
          <CanvasMotif
            variant={MOTIF[industry.id] ?? "ai"}
            className="h-full w-full"
          />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-20 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-40"
          style={{ background: industry.accent }}
        />

        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-start justify-between">
            <span
              className="font-mono text-sm"
              style={{ color: industry.accent }}
            >
              {industry.index}
            </span>
            <span className="font-mono text-xs tracking-widest text-fog opacity-0 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:text-chalk group-hover:opacity-100">
              {exploreLabel}
            </span>
          </div>

          <h3 className="mt-14 font-display text-2xl font-semibold tracking-tight text-chalk">
            {industry.title}
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-mist">
            {industry.blurb}
          </p>

          <div
            className="mt-6 h-px w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
            style={{
              background: `linear-gradient(90deg, ${industry.accent}, transparent)`,
            }}
          />
        </div>
       </Link>
      </motion.div>
    </Reveal>
  );
}

export function Industries() {
  const c = useContent().industries;
  return (
    <section id="industries" className="relative z-10 scroll-mt-24 bg-void py-28 md:py-40">
      <SectionHeading index="04" eyebrow={c.eyebrow} title={c.title} intro={c.intro} />

      <div className="container-x mt-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {c.items.map((ind, i) => (
            <IndustryCard key={ind.id} industry={ind} i={i} exploreLabel={c.explore} />
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-10 flex justify-center">
            <Link
              href="/industries"
              data-cursor
              className="group inline-flex items-center gap-2 rounded-full hairline px-6 py-3 text-sm text-mist transition-colors duration-500 hover:border-white/25 hover:text-chalk"
            >
              {c.viewAll}
              <span className="transition-transform duration-500 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
