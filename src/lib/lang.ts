"use client";

import { useSyncExternalStore } from "react";

export type Lang = "en" | "fr";

let current: Lang = "en";
const subs = new Set<() => void>();

function emit() {
  subs.forEach((fn) => fn());
}

export function getLang() {
  return current;
}

export function setLang(l: Lang) {
  if (l === current) return;
  current = l;
  try {
    localStorage.setItem("ardlabs-lang", l);
    document.documentElement.lang = l;
  } catch {}
  emit();
}

/** Resolve the initial language from storage / browser (call once on mount). */
export function initLang() {
  if (typeof window === "undefined") return;
  let next: Lang | null = null;
  try {
    const stored = localStorage.getItem("ardlabs-lang") as Lang | null;
    if (stored === "en" || stored === "fr") next = stored;
  } catch {}
  if (!next && navigator.language?.toLowerCase().startsWith("fr")) next = "fr";
  if (next && next !== current) setLang(next);
}

function subscribe(fn: () => void) {
  subs.add(fn);
  return () => {
    subs.delete(fn);
  };
}

/** Reactive current language. SSR-safe (returns "en" on the server). */
export function useLang(): Lang {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => "en"
  );
}
