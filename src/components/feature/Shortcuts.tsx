"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLocaleRouter } from "@/hooks/useLocaleRouter";
import { stripLocale } from "@/lib/i18n";
import { scrollToTarget } from "@/components/layout/SmoothScroll";
import { audio } from "@/lib/audio";
import { startShowreel } from "@/lib/showreel";
import { toast } from "@/lib/toast";
import { getLang } from "@/lib/lang";

const T = {
  en: { help: "⌘K — command palette · T top · C contact · I industries · M sound · S showreel" },
  fr: { help: "⌘K — palette de commandes · T accueil · C contact · I services · M son · S bande-démo" },
} as const;

/** Global single-key shortcuts (ignored while typing). */
export function Shortcuts() {
  const router = useLocaleRouter();
  const pathname = usePathname();
  const isHome = stripLocale(pathname).rest === "/";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement;
      if (t?.closest?.("input, textarea, [contenteditable]")) return;

      switch (e.key.toLowerCase()) {
        case "t":
          if (!isHome) router.push("/");
          else scrollToTarget(0);
          break;
        case "c":
          if (!isHome) router.push("/#contact");
          else scrollToTarget("#contact");
          break;
        case "i":
          router.push("/services");
          break;
        case "m":
          audio.toggle();
          break;
        case "s":
          if (isHome) startShowreel();
          break;
        case "?":
          toast(T[getLang()].help, "⌨");
          break;
        default:
          return;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHome]);

  return null;
}
