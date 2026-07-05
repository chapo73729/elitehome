"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { stripLocale } from "@/lib/i18n";
import { scrollToTarget } from "./SmoothScroll";

/**
 * Re-aligns deep-linked homepage anchors after the layout settles.
 *
 * Navigating to `/#contact` from an inner page scrolls at navigation time,
 * but the homepage's lazily-mounted sections keep growing for a couple of
 * seconds afterwards and push the lower anchors down — the visitor lands
 * hundreds of pixels short. This watches the hash target and nudges the
 * scroll back onto it while the page is still assembling; the first real
 * user input (wheel / touch / key) cancels any further correction.
 */
export function AnchorAlign() {
  const pathname = usePathname();
  const isHome = stripLocale(pathname).rest === "/";

  useEffect(() => {
    if (!isHome) return;
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;

    let cancelled = false;
    const cancel = () => {
      cancelled = true;
    };
    window.addEventListener("wheel", cancel, { passive: true, once: true });
    window.addEventListener("touchstart", cancel, { passive: true, once: true });
    window.addEventListener("keydown", cancel, { once: true });

    const align = () => {
      if (cancelled) return;
      let el: Element | null = null;
      try {
        el = document.querySelector(hash);
      } catch {
        return; // malformed hash — nothing to align to
      }
      if (!el) return;
      // scrollToTarget lands the section top at -10px; only correct real drift
      if (Math.abs(el.getBoundingClientRect().top + 10) > 24) scrollToTarget(hash);
    };
    // spaced passes: scene mounts settle early, the first-visit loader can
    // hold layout for ~4s — the late pass covers deep links on first visit
    const timers = [600, 1400, 2600, 4500].map((t) => setTimeout(align, t));

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
      window.removeEventListener("keydown", cancel);
    };
  }, [pathname, isHome]);

  return null;
}
