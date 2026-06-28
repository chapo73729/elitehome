"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[125] h-[2px] w-full origin-left bg-gradient-to-r from-accent-2 via-accent to-accent-3 shadow-[0_0_10px_rgba(79,140,255,0.6)]"
    />
  );
}
