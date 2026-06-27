"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { useContent } from "@/lib/content";

export function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 60%", "end 70%"],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });
  const c = useContent().timeline;
  const TIMELINE = c.items;

  return (
    <section className="relative z-10 scroll-mt-24 bg-void py-28 md:py-40">
      <SectionHeading index="09" eyebrow={c.eyebrow} title={c.title} />

      <div ref={ref} className="container-x relative mt-20">
        {/* spine */}
        <div className="absolute left-[7px] top-0 h-full w-px bg-white/8 md:left-1/2" />
        <motion.div
          style={{ scaleY: lineScale }}
          className="absolute left-[7px] top-0 h-full w-px origin-top bg-gradient-to-b from-accent-2 via-accent to-accent-3 md:left-1/2"
        />

        <div className="space-y-20">
          {TIMELINE.map((item, i) => (
            <div
              key={item.year}
              className={`relative pl-10 md:grid md:grid-cols-2 md:gap-16 md:pl-0 ${
                i % 2 === 0 ? "" : "md:[direction:rtl]"
              }`}
            >
              {/* node */}
              <span className="absolute left-0 top-1.5 z-10 flex h-4 w-4 -translate-x-[1px] items-center justify-center rounded-full bg-void md:left-1/2 md:-translate-x-1/2">
                <span className="h-2 w-2 rounded-full bg-accent-2 shadow-[0_0_14px_3px_rgba(122,242,224,0.6)]" />
              </span>

              <Reveal className={i % 2 === 0 ? "md:text-right md:pr-4" : "md:[direction:ltr] md:pl-4 md:col-start-2"}>
                <div className="font-mono text-sm text-accent">{item.year}</div>
                <h3 className="mt-3 font-display text-2xl font-semibold text-chalk">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-sm text-mist md:inline-block">{item.text}</p>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
