"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-void" />,
});

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero({ ready }: { ready: boolean }) {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
    >
      {/* 3D field */}
      <div className="absolute inset-0">
        <HeroScene />
      </div>

      {/* radial floor glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_115%,rgba(91,140,255,0.18),transparent_70%)]" />

      {/* content */}
      <div className="container-x relative z-10 flex flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: EASE, delay: 0.3 }}
          className="eyebrow mb-8"
        >
          Private Ventures · Est. 2019
        </motion.span>

        <h1 className="text-mega text-gradient select-none">
          <Line ready={ready} delay={0.4}>
            ARDLABS
            <span className="align-top text-[0.32em] text-accent">®</span>
          </Line>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: EASE, delay: 0.9 }}
          className="mt-7 max-w-xl text-balance text-base text-mist md:text-lg"
        >
          A laboratory of the future — engineering artificial intelligence,
          software, automation and physical infrastructure at the scale of
          nations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: EASE, delay: 1.1 }}
          className="mt-11 flex flex-wrap items-center justify-center gap-4"
        >
          <Button href="#industries" variant="primary">
            Explore the lab
            <span aria-hidden>→</span>
          </Button>
          <Button href="#contact" variant="ghost">
            Engage ARDLABS
          </Button>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1.6 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="font-mono text-[0.62rem] tracking-[0.34em] text-fog">
          SCROLL
        </span>
        <span className="relative block h-10 w-px overflow-hidden bg-white/10">
          <motion.span
            className="absolute left-0 top-0 block h-3 w-px bg-accent-2"
            animate={{ y: [-12, 40] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}

function Line({
  children,
  ready,
  delay,
}: {
  children: React.ReactNode;
  ready: boolean;
  delay: number;
}) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        className="block"
        initial={{ y: "115%" }}
        animate={ready ? { y: "0%" } : {}}
        transition={{ duration: 1.2, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}
