"use client";

import { useEffect } from "react";
import { audio } from "@/lib/audio";
import { toast } from "@/lib/toast";

const SEQ = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

/** Hidden "hyperdrive" easter egg via the Konami code. */
export function Konami() {
  useEffect(() => {
    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === SEQ[pos]) {
        pos++;
        if (pos === SEQ.length) {
          pos = 0;
          fire();
        }
      } else {
        pos = k === SEQ[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return null;
}

function fire() {
  toast("HYPERDRIVE ENGAGED", "⚡");
  try {
    audio.enable();
  } catch {}

  // brief accent flash + speed-up of CSS animations via a body class
  const el = document.createElement("div");
  el.setAttribute("aria-hidden", "true");
  el.style.cssText =
    "position:fixed;inset:0;z-index:230;pointer-events:none;mix-blend-mode:screen;" +
    "background:radial-gradient(circle at 50% 50%, var(--color-accent-2), transparent 60%);" +
    "opacity:0;transition:opacity .25s ease";
  document.body.appendChild(el);
  requestAnimationFrame(() => (el.style.opacity = "0.5"));
  document.documentElement.classList.add("hyperdrive");
  setTimeout(() => (el.style.opacity = "0"), 450);
  setTimeout(() => {
    el.remove();
    document.documentElement.classList.remove("hyperdrive");
  }, 2600);
}
