"use client";

import { useSyncExternalStore } from "react";

export type Lang = "en" | "fr";

function langFromPathname(pathname: string): Lang {
  return pathname === "/fr" || pathname.startsWith("/fr/") ? "fr" : "en";
}

/**
 * The URL is the single source of truth for the active language, and the
 * middleware guarantees every page URL is locale-prefixed. Deriving the
 * initial value from location.pathname at module-init time means the store
 * is already correct on the client's first render — no render-phase writes
 * needed anywhere (see LocaleSync). On the server this stays "en", matching
 * getServerSnapshot below.
 */
let current: Lang =
  typeof window !== "undefined"
    ? langFromPathname(window.location.pathname)
    : "en";

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
    localStorage.setItem("blackfirst-lang", l);
    document.documentElement.lang = l;
  } catch {}
  emit();
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
