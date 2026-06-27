"use client";

import { useEffect } from "react";

/** Switches the document title when the tab loses focus. */
export function TabTitle() {
  useEffect(() => {
    let original = document.title;
    const onVis = () => {
      if (document.hidden) {
        original = document.title;
        document.title = "← Return to the lab · ARDLABS®";
      } else {
        document.title = original;
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);
  return null;
}
