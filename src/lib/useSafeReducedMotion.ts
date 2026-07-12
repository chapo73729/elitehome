"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * SSR-safe reduced-motion preference.
 *
 * `useReducedMotion()` returns `null` on the server (→ treated as "no
 * preference") but resolves to the real value on the client's very first
 * paint. Any component that renders *different DOM* — text, a style
 * attribute, a conditional element, or a framer `initial` prop — based on
 * that value will therefore mismatch the server HTML and throw a hydration
 * error (#418) for reduced-motion visitors.
 *
 * This hook defers the preference until after mount: it returns `false`
 * during SSR and the first client render (so they agree), then flips to the
 * real preference on the next tick. Actual motion suppression still happens
 * via the global <MotionConfig reducedMotion="user">.
 */
export function useSafeReducedMotion(): boolean {
  const prefers = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && !!prefers;
}
