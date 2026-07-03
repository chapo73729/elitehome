"use client";

import { useEffect, useRef, useState } from "react";
import { LocaleLink } from "@/components/ui/LocaleLink";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import { SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Compile } from "@/components/ui/Compile";
import { ChapterNumeral } from "@/components/ui/ChapterNumeral";
import { CanvasMotif } from "@/components/ui/CanvasMotif";
import { useContent } from "@/lib/content";
import { usePerf } from "@/lib/perf";
import { audio } from "@/lib/audio";

const EASE = [0.16, 1, 0.3, 1] as const;

type MotifVariant = "code" | "ai" | "industrial" | "ocean";

/**
 * Four semantically-distinct, azure-only motifs — one per pole. The pole's own
 * `motif` key in content.ts is not used here; this section owns its mapping so
 * Data&AI never collides with Cloud:
 *   strategy → "ai"         (radial node web — consulting / intelligence)
 *   software → "code"       (falling glyph rain — engineering)
 *   ai       → "industrial" (rotating rings + sparks — repurposed as a data/grid motif)
 *   cloud    → "ocean"      (layered flowing waves — repurposed as flowing infra)
 */
const MOTIF: Record<string, MotifVariant> = {
  strategy: "ai",
  software: "code",
  ai: "industrial",
  cloud: "ocean",
};

type Item = {
  id: string;
  index: string;
  title: string;
  tagline?: string;
  capabilities?: string[];
};

function PoleRow({
  item,
  active,
  dimmed,
  reduced,
  exploreLabel,
  onActivate,
  registerRef,
  onKeyNav,
}: {
  item: Item;
  active: boolean;
  dimmed: boolean;
  reduced: boolean;
  exploreLabel: string;
  onActivate: () => void;
  registerRef: (el: HTMLAnchorElement | null) => void;
  onKeyNav: (dir: 1 | -1) => void;
}) {
  const titleRef = useRef<HTMLDivElement>(null);
  // magnetic pull applied to the title (reusing the useSpring/useTransform idiom)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 180, damping: 17, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 180, damping: 17, mass: 0.5 });
  const tx = useTransform(sx, (v) => (reduced ? 0 : v));
  const ty = useTransform(sy, (v) => (reduced ? 0 : v));

  const onMove = (e: React.PointerEvent) => {
    if (reduced) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = titleRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.12);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.22);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const onEnter = () => {
    onActivate();
    audio.hover();
  };

  return (
    <LocaleLink
      ref={registerRef}
      href={`/services/${item.id}`}
      data-cursor
      aria-label={`${item.title} — ${exploreLabel}`}
      onPointerMove={onMove}
      onPointerEnter={onEnter}
      onPointerLeave={reset}
      onFocus={onActivate}
      onKeyDown={(e) => {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          onKeyNav(1);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          onKeyNav(-1);
        }
      }}
      className="hairline-t group relative block outline-none"
    >
      <motion.div
        animate={{
          opacity: dimmed ? 0.4 : 1,
          paddingTop: reduced ? 28 : active ? 44 : 26,
          paddingBottom: reduced ? 28 : active ? 44 : 26,
        }}
        transition={{ duration: 0.5, ease: EASE }}
        className="relative flex items-baseline gap-5 pr-4 sm:gap-8 md:gap-12"
      >
        {/* index numeral — large mono figure */}
        <motion.span
          animate={{ color: active ? "var(--color-accent)" : "var(--color-fog)" }}
          transition={{ duration: 0.4, ease: EASE }}
          className="w-[2.2ch] shrink-0 font-mono text-base tabular-nums sm:text-xl"
        >
          {item.index}
        </motion.span>

        <div className="min-w-0 flex-1">
          {/* huge title with magnetic pull */}
          <motion.div
            ref={titleRef}
            style={{ x: tx, y: ty }}
            animate={{ scale: reduced ? 1 : active ? 1.02 : 1 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="origin-left"
          >
            <h3 className="text-section-title text-balance text-chalk">
              {item.title}
            </h3>
          </motion.div>

          {item.tagline && (
            <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-mist sm:text-xs">
              {item.tagline}
            </p>
          )}

          {/* capability chips — mask-reveal stagger when active */}
          <AnimatePresence initial={false}>
            {active && Array.isArray(item.capabilities) && (
              <motion.ul
                key="caps"
                initial={reduced ? false : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={reduced ? undefined : { opacity: 0, height: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="mt-5 flex flex-wrap gap-1.5 overflow-hidden"
              >
                {item.capabilities.slice(0, 6).map((cap, ci) => (
                  <li
                    key={cap}
                    className="overflow-hidden rounded-full hairline px-3 py-1"
                  >
                    <motion.span
                      initial={reduced ? false : { y: "120%" }}
                      animate={{ y: "0%" }}
                      transition={{
                        duration: 0.5,
                        ease: EASE,
                        delay: reduced ? 0 : 0.08 + ci * 0.045,
                      }}
                      className="block font-mono text-[0.6rem] tracking-wide text-mist"
                    >
                      {cap}
                    </motion.span>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* explore arrow — appears on active */}
        <motion.span
          aria-hidden
          animate={{
            opacity: active ? 1 : 0,
            x: active ? 0 : -6,
          }}
          transition={{ duration: 0.4, ease: EASE }}
          className="hidden shrink-0 self-center font-mono text-xs tracking-widest text-chalk sm:block"
        >
          {exploreLabel}
        </motion.span>
      </motion.div>
    </LocaleLink>
  );
}

export function Industries() {
  const c = useContent().industries;
  const reducedPref = useReducedMotion();
  const perf = usePerf();
  const reduced = !!reducedPref || perf;

  const items = c.items as unknown as Item[];
  const [active, setActive] = useState(0);
  const rowRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // the active row's vertical share of the rail, for the azure segment
  const n = items.length;
  const segH = 100 / n;
  const segTop = active * segH;

  const activeVariant = MOTIF[items[active]?.id] ?? "ai";

  const focusRow = (i: number) => {
    const clamped = (i + n) % n;
    rowRefs.current[clamped]?.focus();
    setActive(clamped);
  };

  return (
    <section id="services" className="relative z-10 scroll-mt-24 py-28 md:py-40">
      <div className="container-x relative">
        <ChapterNumeral n="03" label="SERVICES" />
      </div>

      <div className="container-x">
        <Compile label="services" index="03" disabled={perf}>
          <SectionHeading
            flush
            index="03"
            eyebrow={c.eyebrow}
            title={c.title}
            intro={c.intro}
          />
        </Compile>
      </div>

      <div className="container-x mt-16">
        <div className="relative grid gap-x-10 lg:grid-cols-[1fr_minmax(280px,38%)]">
          {/* ---- left: the editorial index ---- */}
          <div className="relative">
            {/* vertical rail — draws down on enter; azure segment tracks active row */}
            <motion.div
              aria-hidden
              initial={reduced ? false : { scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 1.1, ease: EASE }}
              className="pointer-events-none absolute -left-4 top-0 hidden h-full w-px origin-top bg-white/10 sm:block"
            >
              <motion.div
                animate={{ top: `${segTop}%`, height: `${segH}%` }}
                transition={{ duration: 0.5, ease: EASE }}
                className="absolute left-0 w-px bg-accent"
                style={{ top: `${segTop}%`, height: `${segH}%` }}
              />
            </motion.div>

            <ul className="border-b border-white/[0.07]">
              {items.map((item, i) => (
                <li key={item.id}>
                  <PoleRow
                    item={item}
                    active={active === i}
                    dimmed={!reduced && active !== i}
                    reduced={reduced}
                    exploreLabel={c.explore}
                    onActivate={() => setActive(i)}
                    registerRef={(el) => {
                      rowRefs.current[i] = el;
                    }}
                    onKeyNav={(dir) => focusRow(i + dir)}
                  />
                </li>
              ))}
            </ul>

            {/* mono row-footer link (not a floating pill) */}
            <Reveal delay={0.1}>
              <LocaleLink
                href="/services"
                data-cursor
                className="group flex items-center justify-between gap-4 py-6 font-mono text-xs uppercase tracking-[0.22em] text-mist transition-colors duration-500 hover:text-chalk"
              >
                <span>{c.viewAll}</span>
                <span className="transition-transform duration-500 group-hover:translate-x-1">
                  →
                </span>
              </LocaleLink>
            </Reveal>
          </div>

          {/* ---- right: a single shared canvas that morphs to the active pole ---- */}
          <div
            aria-hidden
            className="pointer-events-none relative hidden lg:block"
          >
            <div className="sticky top-32 aspect-square overflow-hidden rounded-3xl hairline bg-ink">
              <div
                className="absolute inset-0"
                style={{
                  maskImage:
                    "radial-gradient(100% 100% at 50% 40%, #000 35%, transparent 85%)",
                  WebkitMaskImage:
                    "radial-gradient(100% 100% at 50% 40%, #000 35%, transparent 85%)",
                }}
              >
                <SharedMotif variant={activeVariant} reduced={reduced} />
              </div>
              {/* active pole label inside the visual frame */}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-6 py-5 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-fog">
                <span>{items[active]?.index}</span>
                <span className="text-mist">{items[active]?.title}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Single CanvasMotif instance, cross-faded as the variant changes so the morph
 * between poles reads as one continuous visual rather than four stacked canvases.
 * Under reduced/lite, the morph is instant (no crossfade) and there is only ever
 * one canvas alive.
 */
function SharedMotif({
  variant,
  reduced,
}: {
  variant: MotifVariant;
  reduced: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  if (reduced) {
    return <CanvasMotif key={variant} variant={variant} className="h-full w-full" />;
  }

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={variant}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="absolute inset-0"
      >
        <CanvasMotif variant={variant} className="h-full w-full" />
      </motion.div>
    </AnimatePresence>
  );
}
