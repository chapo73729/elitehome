"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { PROJECTS } from "@/lib/site";

type Project = (typeof PROJECTS)[number];

function HoloCard({
  p,
  i,
  onOpen,
}: {
  p: Project;
  i: number;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
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
      <motion.button
        ref={ref}
        onClick={onOpen}
        onPointerMove={onMove}
        onPointerLeave={reset}
        data-cursor
        aria-label={`Open ${p.name}`}
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
        className="group relative w-full overflow-hidden rounded-3xl hairline bg-ink p-8 text-left md:p-10"
      >
        <motion.div className="pointer-events-none absolute inset-0" style={{ background: sheen }} />
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

          <div className="mt-8 flex items-center justify-between">
            <span className="flex items-center gap-2 font-mono text-xs text-fog">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent-2" />
              {p.stage}
            </span>
            <span className="font-mono text-xs tracking-widest text-mist opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:text-chalk group-hover:opacity-100">
              OPEN →
            </span>
          </div>
        </div>
      </motion.button>
    </Reveal>
  );
}

function ProjectModal({ p, onClose }: { p: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const lenis = (window as any).__lenis;
    lenis?.stop?.();
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start?.();
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-void/80 backdrop-blur-md"
        onClick={onClose}
        aria-hidden
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        role="dialog"
        aria-modal="true"
        aria-label={p.name}
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl glass p-8 md:p-12"
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background:repeating-linear-gradient(0deg,#fff_0px,#fff_1px,transparent_1px,transparent_4px)]" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-xs tracking-widest text-accent-2">{p.code}</span>
              <h3 className="mt-3 font-display text-4xl font-semibold tracking-tight text-gradient">
                {p.name}
              </h3>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              data-cursor
              className="flex h-10 w-10 items-center justify-center rounded-full hairline text-mist transition-colors hover:text-chalk"
            >
              ✕
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full hairline px-3 py-1 font-mono text-[0.65rem] text-fog">
              {p.field}
            </span>
            <span className="rounded-full hairline px-3 py-1 font-mono text-[0.65rem] text-accent-2">
              {p.stage}
            </span>
          </div>

          <p className="mt-6 text-balance leading-relaxed text-mist">{p.detail}</p>

          <div className="mt-8 grid gap-px overflow-hidden rounded-2xl hairline sm:grid-cols-3">
            {p.highlights.map((h) => (
              <div key={h} className="bg-ink/60 p-4 text-center">
                <span className="text-sm text-chalk">{h}</span>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Button href="/#contact" variant="ghost" onClick={onClose}>
              Request a briefing <span aria-hidden>→</span>
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

export function Projects() {
  const [open, setOpen] = useState<Project | null>(null);

  return (
    <section id="projects" className="relative z-10 scroll-mt-24 bg-void py-28 md:py-40">
      <SectionHeading
        index="13"
        eyebrow="Future Projects"
        title="Engineered behind closed doors."
        intro="A glimpse of ventures currently under construction inside the lab. Open one."
      />
      <div className="container-x mt-16">
        <div className="grid gap-5 md:grid-cols-2">
          {PROJECTS.map((p, i) => (
            <HoloCard key={p.code} p={p} i={i} onOpen={() => setOpen(p)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && <ProjectModal p={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  );
}
