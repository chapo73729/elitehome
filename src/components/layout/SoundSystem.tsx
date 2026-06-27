"use client";

import { useEffect } from "react";
import { audio } from "@/lib/audio";

/**
 * Mounts global interaction sounds (no UI). Hover ticks on interactive
 * elements + a click blip — all no-ops unless sound is enabled.
 */
export function SoundSystem() {
  useEffect(() => {
    audio.init();

    let last: Element | null = null;
    const SELECTOR = "a, button, [data-cursor], [role='button']";

    const onOver = (e: PointerEvent) => {
      const el = (e.target as HTMLElement)?.closest?.(SELECTOR) ?? null;
      if (el && el !== last) {
        last = el;
        audio.hover();
      } else if (!el) {
        last = null;
      }
    };
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement)?.closest?.(SELECTOR)) audio.click();
    };

    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return null;
}
