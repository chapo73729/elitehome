"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/Section";
import { useContent } from "@/lib/content";

export function Faq() {
  const c = useContent().faq;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative z-10 bg-void py-28 md:py-36">
      <SectionHeading index="16" eyebrow={c.eyebrow} title={c.title} />
      <div className="container-x mt-14 max-w-3xl">
        <ul className="overflow-hidden rounded-3xl hairline">
          {c.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={i} className="border-b border-white/8 last:border-b-0">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  data-cursor
                  className="flex w-full items-center justify-between gap-6 bg-ink px-7 py-6 text-left transition-colors hover:bg-white/[0.03]"
                >
                  <span className="font-display text-lg font-medium text-chalk">
                    {item.q}
                  </span>
                  <span
                    className={`relative flex h-6 w-6 shrink-0 items-center justify-center text-accent transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                    aria-hidden
                  >
                    <span className="absolute h-px w-3.5 bg-current" />
                    <span className="absolute h-3.5 w-px bg-current" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden bg-ink"
                    >
                      <p className="max-w-2xl px-7 pb-7 leading-relaxed text-mist">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
