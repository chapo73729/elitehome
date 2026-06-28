/* Live accent-palette switching via CSS custom properties. */

export type Accent = {
  id: string;
  name: string;
  a: string;
  a2: string;
  a3: string;
};

/* Spec acté: ONE azure accent. Presets stay strictly in the azure family —
   subtle temperature shifts only, never a rainbow. */
export const ACCENTS: Accent[] = [
  { id: "azure", name: "Azure", a: "#4f8cff", a2: "#6b9dff", a3: "#3d6fe0" },
  { id: "ice", name: "Ice", a: "#5ea2ff", a2: "#8fbdff", a3: "#3f86e6" },
  { id: "steel", name: "Steel", a: "#5c86d8", a2: "#7ea3e6", a3: "#3a62b0" },
  { id: "deep", name: "Deep", a: "#3f6fe0", a2: "#5d8bff", a3: "#2c52b8" },
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
