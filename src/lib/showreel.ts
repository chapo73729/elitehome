/* Cinematic auto-tour: glide through every section, hands-free. */
import { scrollToTarget } from "@/components/layout/SmoothScroll";

const SECTIONS = [
  "hero",
  "manifesto",
  "core",
  "network",
  "industries",
  "contact",
];

let running = false;
let idx = 0;
let timer: ReturnType<typeof setTimeout> | null = null;
const subs = new Set<(s: { running: boolean; idx: number; total: number }) => void>();

function emit() {
  subs.forEach((fn) => fn({ running, idx, total: SECTIONS.length }));
}

export function onShowreel(fn: (s: { running: boolean; idx: number; total: number }) => void) {
  subs.add(fn);
  fn({ running, idx, total: SECTIONS.length });
  return () => {
    subs.delete(fn);
  };
}

export function isShowreelRunning() {
  return running;
}

export function stopShowreel() {
  if (!running) return;
  running = false;
  if (timer) clearTimeout(timer);
  timer = null;
  detach();
  emit();
}

function step() {
  if (!running) return;
  // skip missing sections
  while (idx < SECTIONS.length && !document.getElementById(SECTIONS[idx])) idx++;
  if (idx >= SECTIONS.length) {
    scrollToTarget(0);
    stopShowreel();
    return;
  }
  scrollToTarget("#" + SECTIONS[idx]);
  emit();
  idx++;
  timer = setTimeout(step, 3400);
}

const cancel = () => stopShowreel();

function attach() {
  window.addEventListener("wheel", cancel, { passive: true });
  window.addEventListener("touchstart", cancel, { passive: true });
  window.addEventListener("keydown", cancel);
}
function detach() {
  window.removeEventListener("wheel", cancel);
  window.removeEventListener("touchstart", cancel);
  window.removeEventListener("keydown", cancel);
}

export function startShowreel() {
  if (running) return;
  running = true;
  idx = 0;
  emit();
  // let any cancelling keystroke (e.g. from the palette) settle first
  setTimeout(() => attach(), 120);
  step();
}
