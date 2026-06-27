/* Live accent-palette switching via CSS custom properties. */

export type Accent = {
  id: string;
  name: string;
  a: string;
  a2: string;
  a3: string;
};

export const ACCENTS: Accent[] = [
  { id: "quantum", name: "Quantum", a: "#5b8cff", a2: "#7af2e0", a3: "#b98cff" },
  { id: "aurora", name: "Aurora", a: "#2fd6b6", a2: "#7af2e0", a3: "#5b8cff" },
  { id: "plasma", name: "Plasma", a: "#a06bff", a2: "#ff8cf0", a3: "#5b8cff" },
  { id: "solar", name: "Solar", a: "#ff9d4a", a2: "#ffd15b", a3: "#ff6b6b" },
];

const subs = new Set<(id: string) => void>();
let current = "quantum";

export function getAccent() {
  return current;
}

export function onAccent(fn: (id: string) => void) {
  subs.add(fn);
  fn(current);
  return () => {
    subs.delete(fn);
  };
}

export function applyAccent(id: string) {
  const p = ACCENTS.find((x) => x.id === id);
  if (!p || typeof document === "undefined") return;
  const r = document.documentElement.style;
  r.setProperty("--color-accent", p.a);
  r.setProperty("--color-accent-2", p.a2);
  r.setProperty("--color-accent-3", p.a3);
  r.setProperty("--color-glow", p.a);
  current = id;
  try {
    localStorage.setItem("ardlabs-accent", id);
  } catch {}
  subs.forEach((s) => s(id));
}

export function initAccent() {
  if (typeof window === "undefined") return;
  try {
    const id = localStorage.getItem("ardlabs-accent");
    if (id && ACCENTS.some((a) => a.id === id)) applyAccent(id);
  } catch {}
}
