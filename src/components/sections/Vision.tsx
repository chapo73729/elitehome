"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { VISION_LINES } from "@/lib/site";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Vision() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-25% 0px" });

  // flatten to words with an absolute index for sequential reveal
  let counter = 0;

  return (
    <section
      id="vision"
      className="relative z-10 flex min-h-[90svh] items-center bg-void py-32"
    >
      <div className="container-x" ref={ref}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 font-mono text-xs tracking-[0.3em] text-accent"
        >
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          ARDLABS.AI · COMPOSING VISION
        </motion.div>

        <h2 className="text-giant mt-10 max-w-5xl">
          {VISION_LINES.map((line, li) => (
            <span key={li} className="block">
              {line.split(" ").map((word) => {
                const idx = counter++;
                const accent = word.toLowerCase().includes("engineer");
                return (
                  <span key={idx} className="inline-block overflow-hidden">
                    <motion.span
                      className={`inline-block ${
                        accent ? "text-gradient-accent" : "text-gradient"
                      }`}
                      initial={{ y: "110%", opacity: 0 }}
                      animate={inView ? { y: "0%", opacity: 1 } : {}}
                      transition={{
                        duration: 0.7,
                        ease: EASE,
                        delay: 0.25 + idx * 0.08,
                      }}
                    >
                      {word}&nbsp;
                    </motion.span>
                  </span>
                );
              })}
            </span>
          ))}
          {/* blinking caret */}
          <motion.span
            aria-hidden
            className="ml-1 inline-block h-[0.82em] w-[3px] translate-y-[0.08em] bg-accent-2 align-middle"
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE, delay: 1.6 }}
          className="mt-14 max-w-md text-balance text-mist"
        >
          Every venture begins as a hypothesis and ends as infrastructure.
          We hold the rare positions — patient capital, deep engineering and a
          century-long horizon.
        </motion.p>
      </div>
    </section>
  );
}
