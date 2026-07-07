"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useContent } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

/* ============================================================
   Partners — a cinematic full-bleed reference band.

   Two counter-scrolling rows of large marques glide under soft
   edge fades. The motion is driven frame by frame (not a CSS
   animation): the rows breathe with the visitor's scroll — they
   accelerate as the page moves, echoing the site's continuous-
   world idiom — and hovering a row eases it to a stop instead of
   freezing it. Runs only while the band is on screen; reduced
   motion renders a static wall.

   REAL LOGOS: drop files into /public/partners/ and reference
   them in LOGO_SRC below (name -> file). Until a marque has its
   file it renders as a refined uniform wordmark.
   ============================================================ */

/** Official logo files, self-hosted in /public/partners/. */
const LOGO_SRC: Record<string, string | null> = {
  "MITRE ATT&CK": null,
  "LinkPlus IT": null,
  Cacttus: null,
  theHarvester: null,
  "InfoSoft Group": null,
  VirusTotal: null,
  "Communication Progress": null,
  "YTC Group": null,
  Avast: null,
  JetBrains: null,
};

type Item = { name: string; sector: string };

function Marque({ item, index }: { item: Item; index: number }) {
  const src = LOGO_SRC[item.name] ?? null;
  return (
    <div className="group/m flex shrink-0 flex-col items-center gap-3 px-12 py-2 md:px-16">
      <div className="flex h-10 items-center">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={item.name}
            className="h-8 w-auto opacity-60 [filter:brightness(0)_invert(0.92)] transition-all duration-500 group-hover/m:opacity-100 group-hover/m:[filter:none] md:h-9"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="whitespace-nowrap font-display text-2xl font-semibold tracking-tight text-chalk/60 transition-colors duration-500 group-hover/m:text-chalk md:text-[1.7rem]">
            {item.name}
          </span>
        )}
      </div>
      <span className="flex items-center gap-2 whitespace-nowrap font-mono text-[0.58rem] uppercase tracking-[0.22em] text-fog transition-colors duration-500 group-hover/m:text-mist">
        <span aria-hidden className="text-accent">{`[${String(index + 1).padStart(2, "0")}]`}</span>
        {item.sector}
      </span>
    </div>
  );
}

/** Frame-driven marquee row: base drift + scroll-velocity boost, eased
 *  pause on hover, wrapped modulo half the track width. */
function useMarquee(
  trackRef: React.RefObject<HTMLDivElement | null>,
  sectionRef: React.RefObject<HTMLElement | null>,
  dir: 1 | -1,
  base: number
) {
  useEffect(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;

    let half = 0;
    const measure = () => {
      half = track.scrollWidth / 2;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    let x = 0;
    let speed = base;
    let target = base;
    let raf = 0;
    let last = performance.now();
    let running = false;

    const hoverIn = () => {
      target = 0;
    };
    const hoverOut = () => {
      target = base;
    };
    track.parentElement?.addEventListener("mouseenter", hoverIn);
    track.parentElement?.addEventListener("mouseleave", hoverOut);

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      // scroll velocity feeds the drift — the band lives with the page
      const lenis = (window as { __lenis?: { velocity?: number } }).__lenis;
      const boost = Math.min(240, Math.abs(lenis?.velocity ?? 0) * 6);
      speed += (target + (target === 0 ? 0 : boost) - speed) * Math.min(1, dt * 6);
      x -= dir * speed * dt;
      if (half > 0) {
        x = ((x % half) + half) % half;
        track.style.transform = `translate3d(${-x}px, 0, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(loop);
      } else if (!e.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(section);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      track.parentElement?.removeEventListener("mouseenter", hoverIn);
      track.parentElement?.removeEventListener("mouseleave", hoverOut);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function Row({
  items,
  offset,
  dir,
  base,
  sectionRef,
}: {
  items: Item[];
  offset: number;
  dir: 1 | -1;
  base: number;
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  useMarquee(trackRef, sectionRef, dir, base);

  if (reduced) {
    return (
      <div className="flex flex-wrap items-start justify-center gap-y-6">
        {items.map((p, i) => (
          <Marque key={p.name} item={p} index={offset + i} />
        ))}
      </div>
    );
  }

  return (
    <div className="marquee-mask relative overflow-hidden">
      <div ref={trackRef} className="flex w-max items-start will-change-transform">
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className="flex items-start">
            {items.map((p, i) => (
              <Marque key={`${copy}-${p.name}`} item={p} index={offset + i} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Partners() {
  const c = useContent().partners;
  const items = c.items as unknown as Item[];
  const split = Math.ceil(items.length / 2);
  const rowA = items.slice(0, split);
  const rowB = items.slice(split);
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      aria-label={c.eyebrow}
      className="relative z-10 overflow-hidden bg-void"
    >
      <div className="py-24 md:py-32">
        {/* editorial header, on the page grid */}
        <div className="container-x">
          <Reveal>
            <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3">
              <span className="eyebrow">{c.eyebrow}</span>
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-fog">
                {c.note}
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="text-section-title text-gradient mt-5 max-w-2xl">{c.title}</h2>
          </Reveal>
        </div>

        {/* the band bleeds full width, framed by hairlines */}
        <Reveal delay={0.16} className="mt-14">
          <div className="hairline-t" />
          <div className="space-y-2 py-10">
            <Row items={rowA} offset={0} dir={1} base={26} sectionRef={sectionRef} />
            <Row items={rowB} offset={split} dir={-1} base={21} sectionRef={sectionRef} />
          </div>
          <div className="hairline-t" />
        </Reveal>

        {/* registry line — the studio's mono idiom */}
        <div className="container-x">
          <Reveal delay={0.22}>
            <p className="mt-6 text-right font-mono text-[0.6rem] uppercase tracking-[0.25em] text-fog">
              {"10 · KOSOVO — ALBANIA — CZ"}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
