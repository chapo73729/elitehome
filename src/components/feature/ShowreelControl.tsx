"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { onShowreel, stopShowreel } from "@/lib/showreel";
import { useLang } from "@/lib/lang";

const T = {
  en: { showreel: "SHOWREEL", stop: "STOP" },
  fr: { showreel: "BANDE-DÉMO", stop: "ARRÊT" },
} as const;

export function ShowreelControl() {
  const [state, setState] = useState({ running: false, idx: 0, total: 9 });
  useEffect(() => onShowreel(setState), []);
  const t = T[useLang()];

  return (
    <AnimatePresence>
      {state.running && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          className="fixed bottom-6 left-1/2 z-[160] flex -translate-x-1/2 items-center gap-4 rounded-full glass px-5 py-3"
        >
          <span className="flex items-center gap-2 font-mono text-xs tracking-widest text-accent-2">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent-2" />
            {t.showreel}
          </span>
          <div className="h-1 w-32 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-accent-2 to-accent"
              animate={{ width: `${(state.idx / state.total) * 100}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
          <button
            onClick={stopShowreel}
            data-cursor
            className="font-mono text-xs tracking-widest text-mist transition-colors hover:text-chalk"
          >
            {t.stop}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
