"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLang } from "@/lib/lang";

const T = {
  en: { online: "SYSTEM ONLINE", wordmark: "ARDLABS // ENGINEERING STUDIO" },
  fr: { online: "SYSTÈME EN LIGNE", wordmark: "ARDLABS // STUDIO D’INGÉNIERIE" },
} as const;

/**
 * Diegetic HUD overlaid on the hero — corner brackets, live readouts and a
 * sweeping scan line. Purely decorative; sells the "control room" feel without
 * touching the 3D scene.
 */
export function HeroHud({ ready }: { ready: boolean }) {
  const t = T[useLang()];
  const reducedMotion = useReducedMotion();
  const [clock, setClock] = useState("00:00:00 UTC");
  const latRef = useRef<HTMLSpanElement>(null);
  const lonRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // write the decorative LAT/LON straight to the DOM via refs, throttled to
    // one rAF — no React re-render on a pointer storm (protects INP).
    // Anchored at the studio's real coordinates (Prague) with a small
    // pointer-driven drift, so the readout stays truthful at rest and on touch.
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const lat = (50.0755 + (e.clientY / window.innerHeight - 0.5) * 1.2).toFixed(4);
        const lon = (14.4378 + (e.clientX / window.innerWidth - 0.5) * 2.4).toFixed(4);
        if (latRef.current) latRef.current.textContent = `LAT ${lat}`;
        if (lonRef.current) lonRef.current.textContent = `LON ${lon}`;
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const tick = () => {
      const d = new Date();
      setClock(
        `${String(d.getUTCHours()).padStart(2, "0")}:${String(
          d.getUTCMinutes()
        ).padStart(2, "0")}:${String(d.getUTCSeconds()).padStart(2, "0")} UTC`
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => {
      window.removeEventListener("pointermove", onMove);
      clearInterval(id);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const fade = {
    initial: { opacity: 0 },
    animate: ready ? { opacity: 1 } : { opacity: 0 },
    transition: { duration: 1.2, delay: 1.4 },
  };

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[5] hidden font-mono text-[0.6rem] tracking-[0.25em] text-fog md:block [@media(max-height:680px)]:!hidden"
    >
      {/* corner brackets */}
      {[
        "left-6 top-24 border-l border-t",
        "right-6 top-24 border-r border-t",
        "left-6 bottom-24 border-l border-b",
        "right-6 bottom-24 border-r border-b",
      ].map((pos, i) => (
        <motion.span
          key={i}
          {...fade}
          transition={{ duration: 1, delay: 1.2 + i * 0.08 }}
          className={`absolute h-6 w-6 border-white/20 ${pos}`}
        />
      ))}

      {/* top-left readout */}
      <motion.div {...fade} className="absolute left-12 top-28 space-y-1.5">
        <div className="flex items-center gap-2 text-accent-2">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent-2" />
          {t.online}
        </div>
        <div><span ref={latRef}>LAT 50.0755</span></div>
        <div><span ref={lonRef}>LON 14.4378</span></div>
      </motion.div>

      {/* top-right readout */}
      <motion.div {...fade} className="absolute right-12 top-28 space-y-1.5 text-right">
        <div>{clock}</div>
      </motion.div>

      {/* vertical right label */}
      <motion.div
        {...fade}
        className="absolute right-12 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] text-[0.58rem] tracking-[0.45em]"
      >
        {t.wordmark}
      </motion.div>

      {/* sweeping scan line — framer's reduced-motion handling doesn't cover
          `top` keyframes, so guard the infinite sweep explicitly */}
      {!reducedMotion && (
        <motion.span
          initial={{ top: "20%", opacity: 0 }}
          animate={ready ? { top: ["20%", "80%", "20%"], opacity: 0.5 } : {}}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
        />
      )}
    </div>
  );
}
