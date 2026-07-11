"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useTransform,
  useMotionValueEvent,
  cubicBezier,
  type MotionValue,
} from "framer-motion";
import { useContent } from "@/lib/content";
import { useScrollScrub } from "@/hooks/useScrollScrub";
import { ChapterNumeral } from "@/components/ui/ChapterNumeral";

const EASE = cubicBezier(0.16, 1, 0.3, 1);

/* The manifesto typesets across this progress window; before LEAD_IN the
   stage is empty, after the lines have locked the outro types in. */
const LEAD_IN = 0.08;
const TYPE_END = 0.86;

/**
 * A single word that rises out of an overflow-hidden mask, scrubbed by the
 * section's scroll progress. Each word owns a narrow sub-range of the overall
 * 0→1 progress so the four lines set themselves word-by-word, then persist.
 */
function ScrubWord({
  progress,
  start,
  end,
  children,
  accent,
}: {
  progress: MotionValue<number>;
  start: number;
  end: number;
  children: string;
  accent?: boolean;
}) {
  const y = useTransform(progress, [start, end], ["110%", "0%"], {
    ease: EASE,
  });
  const opacity = useTransform(progress, [start, (start + end) / 2], [0, 1]);
  return (
    <span className="inline-block overflow-hidden align-bottom">
      <motion.span
        className="inline-block will-change-transform"
        style={
          accent ? { y, opacity, color: "var(--color-accent)" } : { y, opacity }
        }
      >
        {children}
        {" "}
      </motion.span>
    </span>
  );
}

/** Scrubbed line: words stagger across the line's progress band; letter-spacing
 *  tightens subtly as the line locks into place. */
function ScrubLine({
  progress,
  text,
  bandStart,
  bandEnd,
  accentLastWord,
}: {
  progress: MotionValue<number>;
  text: string;
  bandStart: number;
  bandEnd: number;
  accentLastWord?: boolean;
}) {
  const words = text.split(" ");
  const span = bandEnd - bandStart;
  const perWord = span / words.length;
  // tracking eases from a touch open to tight as the line completes
  const letterSpacing = useTransform(
    progress,
    [bandStart, bandEnd],
    ["0.01em", "-0.035em"]
  );

  return (
    <motion.span className="block" style={{ letterSpacing }}>
      {words.map((w, i) => {
        const start = bandStart + perWord * i;
        const end = start + perWord * 1.6; // overlap neighbours for flow
        return (
          <ScrubWord
            key={i}
            progress={progress}
            start={start}
            end={Math.min(end, bandEnd + perWord)}
            accent={accentLastWord && i === words.length - 1}
          >
            {w}
          </ScrubWord>
        );
      })}
    </motion.span>
  );
}

/**
 * Scroll-pinned manifesto chapter. A tall track drives a particle warp that
 * eases out as you descend; in the sticky stage the four manifesto lines
 * typeset themselves word-by-word — left-aligned, baseline-gridded — and stay,
 * composing one readable paragraph. The mono outro types in last and the final
 * word settles in azure: the only colour in the section.
 */
export function Cinematic() {
  const c = useContent().cinematic;
  const lines = c.lines;
  const n = lines.length;

  const trackRef = useRef<HTMLDivElement>(null);

  const { progress, reduced } = useScrollScrub(trackRef);

  // per-line progress bands inside [LEAD_IN, TYPE_END]
  const typeSpan = TYPE_END - LEAD_IN;
  const bandFor = (i: number) => {
    const start = LEAD_IN + (typeSpan / n) * i;
    const end = LEAD_IN + (typeSpan / n) * (i + 1);
    return [start, end] as const;
  };

  // outro types in after the last line locks
  const outroOpacity = useTransform(progress, [TYPE_END, TYPE_END + 0.05], [0, 1]);
  // gutter fill scrubs with overall progress (echo of the page GutterRuler)
  const gutterScaleY = progress;
  // chapter readout counts the active line as it sets
  const [readout, setReadout] = useState("00");
  useMotionValueEvent(progress, "change", (v) => {
    const t = Math.max(0, Math.min(n, ((v - LEAD_IN) / typeSpan) * n));
    setReadout(String(Math.min(n, Math.floor(t))).padStart(2, "0"));
  });

  return (
    <section
      id="manifesto"
      ref={trackRef}
      aria-label="Manifesto"
      className="relative z-10 h-[320vh] bg-void"
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* deep-space backdrop — pure CSS, zero GPU budget */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_75%_40%,rgba(79,140,255,0.14),transparent_65%),radial-gradient(60%_50%_at_85%_70%,rgba(107,157,255,0.08),transparent_70%)]"
        />
        {/* the craft, filmed — a masked ambient layer on the stage's right,
            under the scrims so the manifesto type always owns the left */}
        {!reduced && <CraftFilm />}
        {/* left-anchored scrim: solid void behind the (left-aligned) type so the
            white headline reads crisp, fading to transparent on the right where
            the spark field is the clean feature — same idiom as the AI Core. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050505] from-30% via-[#050505]/80 via-55% to-transparent to-85%" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />

        {/* ghost chapter numeral, bleeding top-left */}
        <ChapterNumeral n="00" label="MANIFESTO" />

        {/* per-section gutter measure — echoes the page GutterRuler */}
        <div className="pointer-events-none absolute left-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex">
          <span className="font-mono text-[0.6rem] tabular-nums tracking-[0.3em] text-chalk/70">
            {reduced ? "04" : readout}
            <span className="text-fog/50"> / 04</span>
          </span>
          <div className="relative h-[34vh] w-px overflow-hidden bg-white/10">
            <motion.div
              style={{ scaleY: reduced ? 1 : gutterScaleY, transformOrigin: "top" }}
              className="absolute inset-0 origin-top bg-[var(--color-accent)]"
            />
          </div>
        </div>

        {/* manifesto — left-aligned, baseline-gridded editorial typesetting */}
        <div className="container-x relative z-10">
          <span className="eyebrow mb-10 block pl-[3.2em] lg:pl-0">{c.tag}</span>

          <div className="max-w-5xl">
            {reduced ? (
              <StaticManifesto lines={lines} />
            ) : (
              /* sized against BOTH axes so four lines always fit the sticky
                 screen — no more clipped type on short/narrow viewports */
              <h2 className="font-display text-[clamp(1.7rem,2.4vw+2.6vh,4.4rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-chalk">
                {lines.map((line, i) => {
                  const [s, e] = bandFor(i);
                  return (
                    <span key={i} className="relative block">
                      {/* hanging mono micro-label in the gutter */}
                      <span className="absolute -left-2 top-[0.35em] hidden -translate-x-full font-mono text-[0.6rem] tracking-[0.25em] text-fog/50 md:block">
                        {`L0${i + 1}`}
                      </span>
                      <ScrubLine
                        progress={progress}
                        text={line}
                        bandStart={s}
                        bandEnd={e}
                        accentLastWord={i === lines.length - 1}
                      />
                    </span>
                  );
                })}
              </h2>
            )}

            <motion.p
              className="mt-10 font-mono text-xs uppercase tracking-[0.3em] text-accent-2"
              style={{ opacity: reduced ? 1 : outroOpacity }}
            >
              {c.outro}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The craft footage, masked into the right of the manifesto stage — plays
 *  only while the stage is on screen. Decorative; hidden from AT. */
function CraftFilm() {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.2 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute right-0 top-0 hidden h-full w-[54%] object-cover opacity-55 md:block"
      style={{
        maskImage: "linear-gradient(to left, black 45%, transparent 98%)",
        WebkitMaskImage: "linear-gradient(to left, black 45%, transparent 98%)",
      }}
      muted
      loop
      playsInline
      preload="none"
      poster="/media/craft-poster.jpg"
    >
      <source src="/media/craft.mp4" type="video/mp4" />
      <source src="/media/craft.webm" type="video/webm" />
    </video>
  );
}

/** Static final-frame layout for reduced-motion: all lines present, last word
 *  in azure, no scrub. */
function StaticManifesto({ lines }: { lines: string[] }) {
  return (
    <h2 className="font-display text-[clamp(1.7rem,2.4vw+2.6vh,4.4rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-chalk">
      {lines.map((line, i) => {
        const words = line.split(" ");
        const last = i === lines.length - 1;
        return (
          <span key={i} className="relative block">
            <span className="absolute -left-2 top-[0.35em] hidden -translate-x-full font-mono text-[0.6rem] tracking-[0.25em] text-fog/50 md:block">
              {`L0${i + 1}`}
            </span>
            {words.map((w, j) => (
              <span
                key={j}
                style={
                  last && j === words.length - 1
                    ? { color: "var(--color-accent)" }
                    : undefined
                }
              >
                {w}
                {j < words.length - 1 ? " " : ""}
              </span>
            ))}
          </span>
        );
      })}
    </h2>
  );
}
