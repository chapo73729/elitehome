/* Live accent-palette switching via CSS custom properties. */

export type Accent = {
  id: string;
  name: string;
  a: string;
  a2: string;
  a3: string;
};

/* Four clearly distinct accent families (owner's call): the original azure
   plus ruby, emerald and violet — each tuned to azure's brightness structure
   (base / lighter hover / deeper variant) so every preset keeps its contrast
   on the near-black canvas. */
export const ACCENTS: Accent[] = [
  { id: "azure", name: "Azure", a: "#4f8cff", a2: "#6b9dff", a3: "#3d6fe0" },
  { id: "ruby", name: "Ruby", a: "#f0524a", a2: "#ff7a70", a3: "#c93a34" },
  { id: "emerald", name: "Emerald", a: "#35c98e", a2: "#5fe0ac", a3: "#1fa06b" },
  { id: "violet", name: "Violet", a: "#8b5cf6", a2: "#a78bfa", a3: "#6d3fe0" },
];

const subs = new Set<(id: string) => void>();
let current = "azure";

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
