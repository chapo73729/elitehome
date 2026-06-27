"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { PROJECTS } from "@/lib/site";

function HoloCard({ p, i }: { p: (typeof PROJECTS)[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [10, -10]), { stiffness: 150, damping: 16 });
  const ry = useSpring(useTransform(mx, [0, 1], [-10, 10]), { stiffness: 150, damping: 16 });
  const sheen = useTransform([mx, my], ([x, y]: number[]) =>
    `radial-gradient(380px circle at ${x * 100}% ${y * 100}%, rgba(159,232,255,0.16), transparent 55%)`
  );

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <Reveal delay={(i % 2) * 0.1}>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
        className="group relative overflow-hidden rounded-3xl hairline bg-ink p-8 md:p-10"
      >
        <motion.div className="pointer-events-none absolute inset-0" style={{ background: sheen }} />
        {/* scanlines */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background:repeating-linear-gradient(0deg,#fff_0px,#fff_1px,transparent_1px,transparent_4px)]" />

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs tracking-widest text-accent-2">{p.code}</span>
            <span className="rounded-full hairline px-3 py-1 font-mono text-[0.65rem] text-fog">
              {p.field}
            </span>
          </div>
          <h3 className="mt-12 font-display text-3xl font-semibold tracking-tight text-gradient">
            {p.name}
          </h3>
          <p className="mt-4 max-w-sm text-sm text-mist">{p.text}</p>

          <div className="mt-8 flex items-center gap-2 font-mono text-xs text-fog">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent-2" />
            CLASSIFIED · IN DEVELOPMENT
          </div>
        </div>
      </motion.div>
    </Reveal>
  );
}

export function Projects() {
  return (
    <section className="relative z-10 scroll-mt-24 bg-void py-28 md:py-40">
      <SectionHeading
        index="13"
        eyebrow="Future Projects"
        title="Engineered behind closed doors."
        intro="A glimpse of ventures currently under construction inside the lab."
      />
      <div className="container-x mt-16">
        <div className="grid gap-5 md:grid-cols-2">
          {PROJECTS.map((p, i) => (
            <HoloCard key={p.code} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
