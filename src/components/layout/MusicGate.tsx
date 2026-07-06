"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { stripLocale } from "@/lib/i18n";
import { audio } from "@/lib/audio";

/**
 * Holds the music bed back until the visitor reaches the manifesto chapter
 * on the homepage — the hero belongs to the arrival cue and the UI sounds.
 * On inner pages (no manifesto) the gate opens immediately. The gate only
 * ever opens; scrolling back up never stops the track.
 */
export function MusicGate() {
  const pathname = usePathname();

  useEffect(() => {
    const isHome = stripLocale(pathname).rest === "/";
    if (!isHome) {
      audio.allowMusic();
      return;
    }
    const el = document.getElementById("manifesto");
    if (!el) {
      audio.allowMusic();
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          audio.allowMusic();
          io.disconnect();
        }
      },
      // fire once the chapter actually occupies the view, not at first pixel
      { rootMargin: "0px 0px -35% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
