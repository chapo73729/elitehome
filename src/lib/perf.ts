"use client";

import { useSyncExternalStore } from "react";

let perf = false;
const subs = new Set<() => void>();

export function getPerf() {
  return perf;
}

export function setPerf(v: boolean) {
  if (v === perf) return;
  perf = v;
  try {
    localStorage.setItem("ardlabs-perf", v ? "on" : "off");
  } catch {}
  subs.forEach((fn) => fn());
}

export function togglePerf() {
  setPerf(!perf);
}

export function initPerf() {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem("ardlabs-perf") === "on") setPerf(true);
  } catch {}
}

function subscribe(fn: () => void) {
  subs.add(fn);
  return () => {
    subs.delete(fn);
  };
}

/** Reactive performance-mode flag. */
export function usePerf(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => perf,
    () => false
  );
}
