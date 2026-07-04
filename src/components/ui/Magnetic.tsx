"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/** max tilt toward the pull direction, in degrees */
const MAX_TILT = 2;

const TRANSLATE_SPRING = { stiffness: 180, damping: 16, mass: 0.5 };
const ROTATE_SPRING = { stiffness: 140, damping: 18, mass: 0.5 };

/**
 * Wraps children so they are magnetically attracted to the cursor within
 * their bounds, tilting gently (max +-2deg) toward the pull direction and
 * spring-releasing back to rest on leave — never snapping. Disabled on
 * coarse pointers and for reduced-motion users.
 */
export function Magnetic({
  children,
  strength = 0.4,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // media queries are stable for the life of the page; check once, lazily
  const disabled = useRef<boolean | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useMotionValue(0);
  const sx = useSpring(x, TRANSLATE_SPRING);
  const sy = useSpring(y, TRANSLATE_SPRING);
  const sr = useSpring(rotate, ROTATE_SPRING);

  const onMove = (e: React.PointerEvent) => {
    if (disabled.current === null) {
      disabled.current =
        window.matchMedia("(pointer: coarse)").matches ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    if (disabled.current) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = e.clientX - (rect.left + rect.width / 2);
    const my = e.clientY - (rect.top + rect.height / 2);
    x.set(mx * strength);
    y.set(my * strength);
    // tilt toward the pull: horizontal offset drives the lean, slightly
    // amplified when the pull is also vertical (feels like a held card)
    const nx = mx / (rect.width / 2);
    const ny = my / (rect.height / 2);
    const tilt = nx * (1 + Math.min(Math.abs(ny), 1) * 0.4) * MAX_TILT;
    rotate.set(Math.max(-MAX_TILT, Math.min(MAX_TILT, tilt)));
  };

  const onLeave = () => {
    // targets go to rest; the springs carry the element home — no snap
    x.set(0);
    y.set(0);
    rotate.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy, rotate: sr }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}
