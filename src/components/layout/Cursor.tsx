"use client";

import { useEffect, useRef } from "react";

/**
 * Cinematic blended cursor: a small dot that tracks instantly and a larger
 * ring that follows on a true spring (position + velocity), stretching
 * subtly along its direction of travel so fast moves feel physical.
 *
 * Contextual states (all driven by the same rAF loop, transforms only):
 * - interactive elements  -> ring dilates, dot collapses to 0
 * - text inputs/textareas -> ring becomes a thin I-beam-like vertical bar
 * - pointerdown           -> quick 0.9 squish
 *
 * Hidden entirely on touch / coarse pointers and for reduced-motion users.
 */

type CursorMode = "default" | "interactive" | "text";

/** input[type]s that show a caret and deserve the I-beam treatment */
const TEXT_INPUT_TYPES = new Set([
  "text",
  "search",
  "email",
  "url",
  "password",
  "tel",
  "number",
  "date",
  "datetime-local",
  "month",
  "week",
  "time",
]);

/** ring stretch: max ~1.15 along the movement axis */
const MAX_STRETCH = 0.15;
/** ring velocity (px/frame @60fps) at which stretch saturates */
const STRETCH_SATURATION = 150;

function resolveMode(target: EventTarget | null): CursorMode {
  if (!(target instanceof Element)) return "default";
  const editable = target.closest<HTMLElement>(
    "textarea, input, [contenteditable]"
  );
  if (editable) {
    if (editable.tagName === "TEXTAREA") return "text";
    if (editable.tagName === "INPUT") {
      if (TEXT_INPUT_TYPES.has((editable as HTMLInputElement).type)) {
        return "text";
      }
    } else if (editable.isContentEditable) {
      return "text";
    }
  }
  const interactive = target.closest(
    "a, button, [data-cursor], input, select, label, [role='button']"
  );
  return interactive ? "interactive" : "default";
}

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

    // pointer (dot is pinned to this)
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;

    // ring spring state: integrated position + velocity for real inertia
    let rx = mx;
    let ry = my;
    let vx = 0;
    let vy = 0;

    // smoothed scales (ring per-axis so the I-beam morph glides)
    let ringSX = 1;
    let ringSY = 1;
    let dotS = 1;

    let mode: CursorMode = "default";
    let pressed = false;
    let visible = false;

    /** discrete restyle on mode change — never touched per-frame */
    const applyMode = (next: CursorMode) => {
      if (next === mode) return;
      mode = next;
      if (mode === "text") {
        // filled bar reads as an I-beam; a scaled 1px border would vanish
        ring.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
        ring.style.borderColor = "transparent";
      } else {
        ring.style.backgroundColor = "transparent";
        ring.style.borderColor = ""; // restore class-defined border-white/60
      }
    };

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!visible) {
        visible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
      applyMode(resolveMode(e.target));
    };

    const onOut = (e: PointerEvent) => {
      // only hide when actually leaving the window, not on every
      // element boundary cross (prevents opacity flicker)
      if (e.relatedTarget) return;
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const onDown = () => (pressed = true);
    const onUp = () => (pressed = false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", onOut);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    // spring + smoothing constants (per 60fps frame, dt-normalized below)
    const SPRING_STIFFNESS = 0.16;
    const SPRING_DAMPING = 0.84;
    const SCALE_EASE = 0.22; // scale states respond a touch quicker

    let raf = 0;
    let last = performance.now();

    const render = (now: number) => {
      // normalize to 60fps frames so feel is identical on 120Hz displays
      const dt = Math.min((now - last) / (1000 / 60), 2.5);
      last = now;

      // --- ring position: damped spring integration ---
      vx = (vx + (mx - rx) * SPRING_STIFFNESS * dt) * Math.pow(SPRING_DAMPING, dt);
      vy = (vy + (my - ry) * SPRING_STIFFNESS * dt) * Math.pow(SPRING_DAMPING, dt);
      rx += vx * dt;
      ry += vy * dt;

      // --- scale targets from mode + press ---
      const press = pressed ? 0.9 : 1;
      let tRingSX = 1;
      let tRingSY = 1;
      let tDotS = 1;
      if (mode === "interactive") {
        tRingSX = tRingSY = 2.4;
        tDotS = 0;
      } else if (mode === "text") {
        tRingSX = 0.1; // 36px ring -> ~3.6px bar
        tRingSY = 0.8; // ~29px tall, caret-like
        tDotS = 0;
      }
      tRingSX *= press;
      tRingSY *= press;

      const ease = 1 - Math.pow(1 - SCALE_EASE, dt);
      ringSX += (tRingSX - ringSX) * ease;
      ringSY += (tRingSY - ringSY) * ease;
      dotS += (tDotS - dotS) * ease;

      // --- velocity stretch along movement direction (circle modes only) ---
      let stretch = 0;
      let angle = 0;
      if (mode !== "text") {
        const speed = Math.hypot(vx, vy);
        stretch = Math.min(speed / STRETCH_SATURATION, MAX_STRETCH);
        angle = Math.atan2(vy, vx);
      }

      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%) scale(${dotS})`;
      // rotate -> scale -> unrotate stretches along the travel axis while
      // keeping the element itself unrotated (I-beam stays upright, angle=0)
      ring.style.transform =
        `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) ` +
        `rotate(${angle}rad) scale(${ringSX * (1 + stretch)}, ${ringSY * (1 - stretch * 0.6)}) rotate(${-angle}rad)`;

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("hide-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onOut);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-white opacity-0 transition-opacity duration-300"
        style={{ mixBlendMode: "difference", willChange: "transform" }}
      />
      <div
        ref={ringRef}
        className="fixed left-0 top-0 h-9 w-9 rounded-full border border-white/60 opacity-0 transition-[opacity,background-color,border-color] duration-300"
        style={{ mixBlendMode: "difference", willChange: "transform" }}
      />
    </div>
  );
}
