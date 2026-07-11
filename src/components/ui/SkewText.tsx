"use client";

import { type ReactNode } from "react";

/** Formerly skewed its children with scroll velocity. Retired in the
 *  performance/coherence pass: the per-scroll-tick scroll→spring→transform
 *  chain cost main-thread time on every heading and read as text wobble.
 *  Kept as a passthrough so call sites stay stable. */
export function SkewText({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
