"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";

/**
 * Editorial film panel — the site's one way of framing motion footage:
 * hairline 16:9 (or custom aspect) frame, blueprint corner brackets, soft
 * inset vignette, mono label + short caption.
 *
 * Playback is made resilient: the loop is muted/inline (autoplay-eligible)
 * and driven by an IntersectionObserver, but browsers still refuse autoplay
 * in some states (iOS Low Power Mode, background tabs, fast scroll racing
 * the fetch). So we retry on `canplay`, and if playback is ever refused we
 * reveal a tap-to-play affordance — the video can never be stuck black.
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
  const [needsTap, setNeedsTap] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduced) return;

    let onScreen = false;

    const attempt = () => {
      if (!onScreen) return;
      const p = v.play();
      if (p && typeof p.then === "function") {
        p.then(() => setNeedsTap(false)).catch(() => {
          // not ready yet, or autoplay refused
          if (v.readyState < 2) {
            const onCanPlay = () => {
              v.removeEventListener("canplay", onCanPlay);
              attempt();
            };
            v.addEventListener("canplay", onCanPlay);
            v.load();
          } else {
            // genuinely refused — offer a tap
            setNeedsTap(true);
          }
        });
      }
    };

    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        if (onScreen) attempt();
        else v.pause();
      },
      { threshold: 0.25 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduced]);

  const tapToPlay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.play()
      .then(() => setNeedsTap(false))
      .catch(() => {});
  };

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
            preload="metadata"
            controls={reduced}
            aria-label={caption}
            onClick={reduced ? undefined : tapToPlay}
          >
            <source src={`${base}.mp4`} type="video/mp4" />
            <source src={`${base}.webm`} type="video/webm" />
          </video>

          {/* tap-to-play affordance — only shown if autoplay was refused */}
          {needsTap && !reduced && (
            <button
              type="button"
              onClick={tapToPlay}
              aria-label="Play"
              className="absolute inset-0 z-20 flex items-center justify-center bg-black/25 backdrop-blur-[1px] transition-opacity"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/40">
                <svg width="18" height="20" viewBox="0 0 18 20" fill="none" aria-hidden>
                  <path d="M1 1.5v17l15-8.5-15-8.5z" fill="#fff" />
                </svg>
              </span>
            </button>
          )}

          <div aria-hidden className="pointer-events-none absolute inset-0 rounded-xl [box-shadow:inset_0_0_80px_rgba(0,0,0,0.55)]" />
        </div>
        <figcaption className="mt-3 flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.28em] text-fog">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            {`// ${label}`}
          </span>
          <span className="text-right text-xs text-mist">{caption}</span>
        </figcaption>
      </figure>
    </Reveal>
  );
}
