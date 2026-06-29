"use client";

import { useEffect, useRef } from "react";

/**
 * Cinematic blended cursor: a small dot that tracks instantly and a larger
 * ring that lags with spring-like smoothing and dilates over interactive
 * elements. Hidden entirely on touch / coarse pointers.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // coarse pointers have no cursor; reduced-motion users get the native
    // cursor (no lagging/spring ring) — leave the custom one dormant + invisible
    if (coarse || reduce) return;

    // hide the native cursor only now that the custom one is live
    document.documentElement.classList.add("hide-cursor");

    const dot = dotRef.current!;
    const ring = ringRef.current!;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let scale = 1;
    let targetScale = 1;
    let visible = false;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!visible) {
        visible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
      const interactive = (e.target as HTMLElement)?.closest(
        "a, button, [data-cursor], input, textarea, [role='button']"
      );
      targetScale = interactive ? 2.4 : 1;
    };

    const onLeave = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const onDown = () => (targetScale = 0.7);
    const onUp = () => (targetScale = 1);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    let raf = 0;
    const render = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      scale += (targetScale - scale) * 0.16;

      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale})`;
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("hide-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-white opacity-0 transition-opacity duration-300"
        style={{ mixBlendMode: "difference" }}
      />
      <div
        ref={ringRef}
        className="fixed left-0 top-0 h-9 w-9 rounded-full border border-white/60 opacity-0 transition-opacity duration-300"
        style={{ mixBlendMode: "difference" }}
      />
    </div>
  );
}
