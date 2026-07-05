/**
 * The shared "journey" signal — one number every 3D scene reads so the
 * whole homepage feels like a single camera traveling through one world.
 *
 * progress: 0..1 across the full page scroll (smoothed).
 * velocity: eased scroll velocity, roughly -1..1.
 *
 * No rAF of its own: scenes call getJourney() from their useFrame and the
 * module advances its smoothing there (idempotent per frame via timestamp).
 * SSR-safe; respects prefers-reduced-motion by pinning progress to 0 so
 * every drift derived from it collapses to the static composition.
 */

type Journey = { progress: number; velocity: number };

const state: Journey = { progress: 0, velocity: 0 };
let lastT = 0;
let reduce = false;
let init = false;

function ensureInit() {
  if (init || typeof window === "undefined") return;
  init = true;
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function getJourney(): Journey {
  ensureInit();
  if (typeof window === "undefined" || reduce) return state;

  // advance at most once per frame regardless of how many scenes call us
  const now = performance.now();
  if (now - lastT < 4) return state;
  lastT = now;

  const lenis = (window as unknown as { __lenis?: { velocity: number } }).__lenis;
  const doc = document.documentElement;
  const max = Math.max(1, doc.scrollHeight - window.innerHeight);
  const target = Math.min(1, Math.max(0, window.scrollY / max));
  const rawVel = lenis ? Math.max(-1, Math.min(1, lenis.velocity * 0.02)) : 0;

  // one shared easing constant — THE trick that makes separate canvases read
  // as the same camera passing between rooms
  state.progress += (target - state.progress) * 0.06;
  state.velocity += (rawVel - state.velocity) * 0.06;
  return state;
}
