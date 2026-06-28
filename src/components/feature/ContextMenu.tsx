"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { SITE } from "@/lib/site";
import { audio } from "@/lib/audio";
import { toast, copyText } from "@/lib/toast";
import { startShowreel } from "@/lib/showreel";

type Pt = { x: number; y: number } | null;

export function ContextMenu() {
  const [pt, setPt] = useState<Pt>(null);
  const router = useRouter();

  useEffect(() => {
    const onCtx = (e: MouseEvent) => {
      // allow native menu inside form fields
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea")) return;
      e.preventDefault();
      const x = Math.min(e.clientX, window.innerWidth - 230);
      const y = Math.min(e.clientY, window.innerHeight - 240);
      setPt({ x, y });
    };
    const close = () => setPt(null);
    window.addEventListener("contextmenu", onCtx);
    window.addEventListener("click", close);
    window.addEventListener("scroll", close, { passive: true });
    return () => {
      window.removeEventListener("contextmenu", onCtx);
      window.removeEventListener("click", close);
      window.removeEventListener("scroll", close);
    };
  }, []);

  const items: { label: string; run: () => void }[] = [
    { label: "Copy email", run: async () => { if (await copyText(SITE.email)) toast("Email copied", "✓"); } },
    { label: "Contact", run: () => router.push("/#contact") },
    { label: "Services", run: () => router.push("/services") },
    { label: "Play showreel", run: () => { router.push("/"); setTimeout(startShowreel, 400); } },
    { label: "Toggle sound", run: () => audio.toggle() },
  ];

  return (
    <AnimatePresence>
      {pt && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.14 }}
          style={{ left: pt.x, top: pt.y }}
          className="fixed z-[215] w-52 overflow-hidden rounded-2xl glass p-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-2 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-fog">
            ARDLABS®
          </div>
          {items.map((it) => (
            <button
              key={it.label}
              onClick={() => {
                it.run();
                setPt(null);
              }}
              className="block w-full rounded-xl px-3 py-2 text-left text-sm text-mist transition-colors hover:bg-white/10 hover:text-chalk"
            >
              {it.label}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
