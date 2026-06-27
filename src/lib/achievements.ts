import { toast } from "./toast";

export const ACHIEVEMENTS: Record<string, string> = {
  palette: "Commander — opened the command palette",
  terminal: "Root access — opened the console",
  konami: "Hyperdrive — entered the Konami code",
  polyglot: "Polyglot — switched language",
  chameleon: "Chameleon — changed the accent",
  spectator: "Spectator — played the showreel",
  minimalist: "Minimalist — enabled performance mode",
  explorer: "Explorer — opened an industry",
};

const KEY = "ardlabs-ach";
let unlocked = new Set<string>();

export function initAchievements() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) unlocked = new Set(JSON.parse(raw));
  } catch {}
}

export function unlock(id: string) {
  if (typeof window === "undefined") return;
  if (!ACHIEVEMENTS[id] || unlocked.has(id)) return;
  unlocked.add(id);
  try {
    localStorage.setItem(KEY, JSON.stringify([...unlocked]));
  } catch {}
  toast(`Achievement · ${ACHIEVEMENTS[id]}`, "★");
}

export function achievementState() {
  return {
    unlocked: [...unlocked],
    total: Object.keys(ACHIEVEMENTS).length,
    count: unlocked.size,
  };
}
