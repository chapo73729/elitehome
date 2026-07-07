"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { onToast, type Toast } from "@/lib/toast";

export function Toaster() {
  const [items, setItems] = useState<Toast[]>([]);

  useEffect(() => {
    return onToast((t) => {
      setItems((prev) => [...prev, t]);
      setTimeout(() => {
        setItems((prev) => prev.filter((x) => x.id !== t.id));
      }, 3200);
    });
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed bottom-6 left-1/2 z-[210] flex -translate-x-1/2 flex-col items-center gap-2"
    >
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex items-center gap-2.5 rounded-full glass px-5 py-3 text-sm text-chalk shadow-2xl"
          >
            {t.icon && <span className="text-accent-2">{t.icon}</span>}
            {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
