"use client";

import { useEffect, useRef } from "react";
import { Reveal } from "./Reveal";

/**
 * Editorial film panel — the site's one way of framing motion footage:
 * hairline 16:9 (or custom aspect) frame, blueprint corner brackets, soft
 * inset vignette, mono label + short caption. The muted loop plays only
 * while on screen; reduced motion gets the poster with native controls.
 * Sources: `${base}.mp4` + `${base}.webm` + `${base}-poster.jpg`.
 */
export function FilmPanel({
  base,
  label,
  caption,
  aspect = "aspect-video",
  reduced = false,
}: {
  base: string;
  label: string;
  caption: string;
  aspect?: string;
  reduced?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduced) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.35 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <Reveal>
      <figure className="group relative">
        <div className="lit-top relative overflow-hidden rounded-xl border border-chalk/10 bg-[#05070c]">
          <span aria-hidden className="pointer-events-none absolute left-3 top-3 z-10 h-4 w-4 border-l border-t border-accent/50" />
          <span aria-hidden className="pointer-events-none absolute right-3 top-3 z-10 h-4 w-4 border-r border-t border-accent/50" />
          <span aria-hidden className="pointer-events-none absolute bottom-3 left-3 z-10 h-4 w-4 border-b border-l border-accent/50" />
          <span aria-hidden className="pointer-events-none absolute bottom-3 right-3 z-10 h-4 w-4 border-b border-r border-accent/50" />

          <video
            ref={videoRef}
            className={`${aspect} w-full object-cover`}
            poster={`${base}-poster.jpg`}
            muted
            loop
            playsInline
            preload="none"
            controls={reduced}
            aria-label={caption}
          >
            <source src={`${base}.mp4`} type="video/mp4" />
            <source src={`${base}.webm`} type="video/webm" />
          </video>
          <div aria-hidden className="pointer-events-none absolute inset-0 rounded-xl [box-shadow:inset_0_0_80px_rgba(0,0,0,0.55)]" />
        </div>
        <figcaption className="mt-3 flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.28em] text-fog">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#22e0ff]" />
            {`// ${label}`}
          </span>
          <span className="text-right text-xs text-mist">{caption}</span>
        </figcaption>
      </figure>
    </Reveal>
  );
}
