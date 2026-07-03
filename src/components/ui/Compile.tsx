"use client";

import { useRef, type ReactNode } from "react";
import clsx from "clsx";
import { motion, useInView, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Resting opacities of the blueprint residue left behind after a section has
 * compiled — the signature's fingerprint. Frame + annotation drop to barely
 * visible; the corner brackets keep a little more presence.
 */
const REST = { frame: 0.12, bracket: 0.3, tick: 0.22 } as const;

/** Corner brackets — each path starts at a leg tip and runs through the
 *  corner, so the draw-on reads as the bracket snapping into the corner. */
const CORNERS = [
  { d: "M17 1L1 1L1 17", cls: "left-0 top-0" },
  { d: "M7 1L23 1L23 17", cls: "right-0 top-0" },
  { d: "M1 7L1 23L17 23", cls: "bottom-0 left-0" },
  { d: "M23 7L23 23L7 23", cls: "bottom-0 right-0" },
] as const;

/** Dimension ticks on the left edge, in % of frame height. */
const TICKS = [26, 50, 74] as const;

/**
 * « Compile » — the site builds itself in front of you.
 *
 * Wrap a section's inner content container (NOT the <section> itself). On
 * first viewport entry the content reads as an engineering blueprint (dashed
 * azure hairlines, corner brackets, dimension ticks, a mono annotation that
 * types on), then a luminous sweep line passes down through it and the real
 * content compiles behind the sweep (ghost → final). Afterwards the blueprint
 * fades to a faint residue and stays.
 *
 * Total choreography ~1.6s. Transform/opacity/filter only; the overlay is
 * aria-hidden + pointer-events-none. Reduced motion or `disabled` renders the
 * children directly with the frame in its final resting state.
 */
export function Compile({
  children,
  label,
  index,
  className,
  disabled = false,
}: {
  children: ReactNode;
  /** Mono annotation vocabulary, e.g. "network" → `// compile: network … ok` */
  label: string;
  /** Section index register mark, e.g. "02". */
  index: string;
  className?: string;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const play = !disabled && !reduce;
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  /** true once the elements should sit at (or animate toward) final state */
  const on = play ? inView : true;

  return (
    <div ref={ref} className={clsx("relative", className)}>
      {/* content — ghost until the sweep passes, compiled after */}
      <motion.div
        initial={play ? { opacity: 0.3, filter: "saturate(0) blur(2px)" } : false}
        animate={on ? { opacity: 1, filter: "saturate(1) blur(0px)" } : undefined}
        transition={{ delay: 0.3, duration: 1.05, ease: EASE }}
      >
        {children}
      </motion.div>

      {/* blueprint overlay — pure ornament, never interactive, never read */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-3 -inset-y-5 select-none md:-inset-x-6 md:-inset-y-7"
      >
        {/* dashed inset rectangle — crawls into place, then rests very dim */}
        <svg className="absolute inset-0 h-full w-full overflow-visible">
          <motion.rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={1}
            strokeDasharray="4 7"
            initial={play ? { opacity: 0, strokeDashoffset: 33 } : false}
            animate={
              on
                ? play
                  ? { opacity: [0, 0.45, 0.45, REST.frame], strokeDashoffset: 0 }
                  : { opacity: REST.frame, strokeDashoffset: 0 }
                : undefined
            }
            transition={{
              opacity: { duration: 1.6, times: [0, 0.2, 0.66, 1], ease: "linear" },
              strokeDashoffset: { duration: 0.8, ease: EASE },
            }}
          />
        </svg>

        {/* corner brackets — stroke draw-on, then settle slightly brighter
            than the rest of the residue */}
        {CORNERS.map((cn) => (
          <svg
            key={cn.cls}
            viewBox="0 0 24 24"
            fill="none"
            className={clsx("absolute h-5 w-5 text-accent", cn.cls)}
          >
            <motion.path
              d={cn.d}
              stroke="currentColor"
              strokeWidth={1.5}
              initial={play ? { pathLength: 0, opacity: 0.9 } : false}
              animate={on ? { pathLength: 1, opacity: REST.bracket } : undefined}
              transition={{
                pathLength: { duration: 0.5, ease: EASE },
                opacity: { delay: 1.15, duration: 0.45, ease: "easeOut" },
              }}
            />
          </svg>
        ))}

        {/* dimension ticks — left edge */}
        {TICKS.map((t, i) => (
          <motion.span
            key={t}
            className="absolute left-0 h-px w-2 origin-left bg-accent"
            style={{ top: `${t}%` }}
            initial={play ? { opacity: 0, scaleX: 0 } : false}
            animate={
              on
                ? play
                  ? { opacity: [0, 0.6, REST.tick], scaleX: 1 }
                  : { opacity: REST.tick, scaleX: 1 }
                : undefined
            }
            transition={{
              opacity: { duration: 1.6, times: [0, 0.28, 1], ease: "linear" },
              scaleX: { delay: 0.1 + i * 0.08, duration: 0.4, ease: EASE },
            }}
          />
        ))}

        {/* register mark — section index, top-left inside the frame */}
        <motion.span
          className="absolute left-3 top-2 font-mono text-[0.6rem] tracking-[0.32em] text-accent"
          initial={play ? { opacity: 0 } : false}
          animate={
            on
              ? play
                ? { opacity: [0, 0.8, 0.8, REST.frame] }
                : { opacity: REST.frame }
              : undefined
          }
          transition={{ duration: 1.6, times: [0, 0.12, 0.72, 1], ease: "linear" }}
        >
          [{index}]
        </motion.span>

        {/* mono annotation — types on top-right, "ok" lands as the sweep
            finishes, then the whole line fades to residue */}
        <motion.span
          className="absolute right-3 top-2 font-mono text-[0.62rem] tracking-wider text-accent"
          initial={play ? { opacity: 0 } : false}
          animate={
            on
              ? play
                ? { opacity: [0, 1, 1, REST.frame] }
                : { opacity: REST.frame }
              : undefined
          }
          transition={{ duration: 1.6, times: [0, 0.1, 0.72, 1], ease: "linear" }}
        >
          <motion.span
            className="inline-block whitespace-nowrap"
            initial={play ? { clipPath: "inset(0 100% 0 0)" } : false}
            animate={on ? { clipPath: "inset(0 0% 0 0)" } : undefined}
            transition={{ delay: 0.12, duration: 0.55, ease: "linear" }}
          >
            {`// compile: ${label} …`}
          </motion.span>
          <motion.span
            className="inline-block"
            initial={play ? { opacity: 0 } : false}
            animate={on ? { opacity: 1 } : undefined}
            transition={{ delay: 1.25, duration: 0.2, ease: "linear" }}
          >
            &nbsp;ok
          </motion.span>
        </motion.span>

        {/* luminous sweep — travels top → bottom once, compiling the content
            behind it. Transform + opacity only. */}
        {play && (
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute inset-0"
              initial={{ y: "-101%" }}
              animate={inView ? { y: "0%" } : undefined}
              transition={{ delay: 0.35, duration: 0.95, ease: EASE }}
            >
              <motion.div
                className="absolute inset-x-0 bottom-0 h-[2px]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, color-mix(in oklab, var(--color-accent) 85%, transparent) 22%, var(--color-accent-2) 50%, color-mix(in oklab, var(--color-accent) 85%, transparent) 78%, transparent 100%)",
                  boxShadow: "0 0 14px 2px rgba(79, 140, 255, 0.45)",
                }}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: [0, 1, 1, 0] } : undefined}
                transition={{
                  delay: 0.35,
                  duration: 0.95,
                  times: [0, 0.08, 0.85, 1],
                  ease: "linear",
                }}
              />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
