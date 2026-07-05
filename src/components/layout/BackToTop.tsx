"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { scrollToTarget } from "./SmoothScroll";
import { useLang } from "@/lib/lang";

export function BackToTop() {
  const [show, setShow] = useState(false);
  const lang = useLang();

  useEffect(() => {
    const onScroll = () =>
      setShow(window.scrollY > window.innerHeight * 1.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          onClick={() => scrollToTarget(0)}
          aria-label={lang === "fr" ? "Retour en haut" : "Back to top"}
          data-cursor
          className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[max(1.5rem,env(safe-area-inset-right))] z-[110] flex h-12 w-12 items-center justify-center rounded-full glass text-chalk transition-colors duration-300 hover:border-white/25"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
              d="M7 12V2M7 2L2.5 6.5M7 2l4.5 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
