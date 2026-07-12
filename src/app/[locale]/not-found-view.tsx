"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { LocaleLink } from "@/components/ui/LocaleLink";
import { useLang } from "@/lib/lang";

const T = {
  en: {
    eyebrow: "Error · Signal lost",
    body: "This coordinate lies beyond the mapped network. The page you seek was never charted — or has since dissolved into the void.",
    home: "Return to BLACKFIRST",
  },
  fr: {
    eyebrow: "Erreur · Signal perdu",
    body: "Cette coordonnée se situe au-delà du réseau cartographié. La page que vous cherchez n'a jamais été répertoriée — ou s'est depuis dissoute dans le néant.",
    home: "Retour vers BLACKFIRST",
  },
};

/** Compile's corner brackets, resting as blueprint residue around the 404. */
const CORNERS = [
  { d: "M17 1L1 1L1 17", cls: "left-0 top-0" },
  { d: "M7 1L23 1L23 17", cls: "right-0 top-0" },
  { d: "M1 7L1 23L17 23", cls: "bottom-0 left-0" },
  { d: "M23 7L23 23L7 23", cls: "bottom-0 right-0" },
] as const;

export function NotFoundView() {
  const t = T[useLang()];
  const reduce = useReducedMotion() ?? false;
  const pathname = usePathname();

  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-void px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]"
      />

      <div className="relative w-full max-w-xl">
        {/* blueprint residue — the route that failed to compile. Pure
            ornament: aria-hidden, pointer-events-none, opacity-only motion. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-4 -inset-y-10 select-none sm:-inset-x-10"
        >
          <svg className="absolute inset-0 h-full w-full overflow-visible">
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth={1}
              strokeDasharray="4 7"
              opacity={0.12}
            />
          </svg>
          {CORNERS.map((cn) => (
            <svg
              key={cn.cls}
              viewBox="0 0 24 24"
              fill="none"
              className={`absolute h-5 w-5 text-accent ${cn.cls}`}
            >
              <path d={cn.d} stroke="currentColor" strokeWidth={1.5} opacity={0.3} />
            </svg>
          ))}

          {/* register mark — top-left inside the frame */}
          <span className="absolute left-4 top-3 font-mono text-[0.6rem] tracking-[0.32em] text-accent opacity-30">
            [404]
          </span>

          {/* mono annotation — types on, then "failed" lands. Static under
              reduced motion. */}
          <motion.span
            className="absolute right-4 top-3 font-mono text-[0.62rem] tracking-wider text-accent"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ duration: 0.4, ease: "linear" }}
          >
            <motion.span
              className="inline-block whitespace-nowrap"
              initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ delay: 0.15, duration: 0.55, ease: "linear" }}
            >
              {"route ·"}
            </motion.span>
            <motion.span
              className="inline-block"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.2, ease: "linear" }}
            >
              &nbsp;not found
            </motion.span>
          </motion.span>
        </div>

        <div className="relative py-6 text-center">
          <span className="eyebrow">{t.eyebrow}</span>
          <h1 className="text-mega text-gradient mt-6 select-none">404</h1>
          {pathname && (
            <p
              aria-hidden
              className="mx-auto mt-4 max-w-full truncate font-mono text-[0.68rem] tracking-wider text-fog tabular-nums"
            >
              <span className="text-accent">▮</span> route: {pathname}
            </p>
          )}
          <p className="mx-auto mt-6 max-w-sm text-balance text-mist">{t.body}</p>
          <LocaleLink
            href="/"
            data-cursor
            className="group mt-10 inline-flex items-baseline gap-3 text-accent transition-colors hover:text-chalk"
          >
            <span
              aria-hidden
              className="font-mono text-xs uppercase tracking-[0.3em] transition-transform duration-500 group-hover:translate-x-1"
            >
              →
            </span>
            <span className="font-display text-lg">{t.home}</span>
          </LocaleLink>
        </div>
      </div>
    </main>
  );
}
