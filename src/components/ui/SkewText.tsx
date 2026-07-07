"use client";

import { type ReactNode } from "react";
import {
  motion,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";

/** Subtly skews its children with scroll velocity for a fluid, liquid feel.
 *  MotionConfig doesn't neutralise style-bound MotionValues, so we pin the
 *  skew to 0 ourselves when the visitor prefers reduced motion. */
export function SkewText({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const skewRaw = useTransform(velocity, [-2500, 0, 2500], [3.5, 0, -3.5], {
    clamp: true,
  });
  const skew = useSpring(skewRaw, { stiffness: 280, damping: 40, mass: 0.4 });

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div style={{ skewY: skew }} className={className}>
      {children}
    </motion.div>
  );
}
