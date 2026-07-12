"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";

/**
 * Lenis-powered smooth scroll. Exposes the instance on window so other
 * components (e.g. anchor links) can scrollTo through the same engine,
 * and respects prefers-reduced-motion by disabling lerp.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  // Read BEFORE any effect runs (lazy initializer fires during render, the
  // one phase guaranteed to complete before every component's effects) so
  // this is immune to whichever of SmoothScroll/Loader happens to mount
  // first: on a fresh session the Loader is about to boot and lock scroll,
  // so Lenis must come up already stopped — starting live even for a
  // handful of frames is enough for its own eased target to fight the
  // Loader's lock and drag scrollY away from the top before it catches up.
  const [freshBoot] = useState(() => {
    try {
      return !sessionStorage.getItem("blackfirst-booted");
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      lerp: 0.1,
    });
    if (freshBoot) lenis.stop();

    // expose for anchor navigation
    (window as any).__lenis = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      (window as any).__lenis = null;
    };
  }, []);

  return <>{children}</>;
}

/** Smooth-scroll to a selector or y-offset, falling back to native.
 *
 * Selectors are resolved to an absolute y HERE (live rect + current scroll)
 * rather than handed to Lenis: Lenis's element targeting computed a landing
 * ~100px short on this layout (measured drift grew down the page, +87px on
 * #services, +116px on #contact), while numeric targets land exactly. */
export function scrollToTarget(target: string | number) {
  let y: number;
  if (typeof target === "string") {
    const el = document.querySelector(target);
    if (!el) return;
    y = window.scrollY + el.getBoundingClientRect().top - 10;
  } else {
    y = target;
  }
  const lenis = (window as any).__lenis as Lenis | null | undefined;
  if (lenis) {
    lenis.scrollTo(y, { duration: 1.4 });
    return;
  }
  window.scrollTo({ top: y, behavior: "smooth" });
}
