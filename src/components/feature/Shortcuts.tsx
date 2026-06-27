"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { scrollToTarget } from "@/components/layout/SmoothScroll";
import { audio } from "@/lib/audio";
import { startShowreel } from "@/lib/showreel";
import { toast } from "@/lib/toast";

/** Global single-key shortcuts (ignored while typing). */
export function Shortcuts() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement;
      if (t?.closest?.("input, textarea, [contenteditable]")) return;

      switch (e.key.toLowerCase()) {
        case "t":
          if (pathname !== "/") router.push("/");
          else scrollToTarget(0);
          break;
        case "c":
          if (pathname !== "/") router.push("/#contact");
          else scrollToTarget("#contact");
          break;
        case "i":
          router.push("/industries");
          break;
        case "m":
          audio.toggle();
          break;
        case "s":
          if (pathname === "/") startShowreel();
          break;
        case "?":
          toast("⌘K — command palette · T top · C contact · I industries · M sound · S showreel", "⌨");
          break;
        default:
          return;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pathname, router]);

  return null;
}
