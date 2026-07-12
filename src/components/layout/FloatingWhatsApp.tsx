"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SITE } from "@/lib/site";
import { useLang } from "@/lib/lang";

const LABEL = { fr: "Écrire sur WhatsApp", en: "Message us on WhatsApp" } as const;

/**
 * Pastille WhatsApp flottante — le canal de conversion le plus court.
 * Ivoire sur noir (monochrome maison), posée au-dessus du bouton
 * remonter-en-haut, visible après le premier écran.
 */
export function FloatingWhatsApp() {
  const label = LABEL[useLang()];
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.a
      href={`https://wa.me/${SITE.whatsappHref}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8, pointerEvents: "none" as const }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-[max(5.5rem,calc(env(safe-area-inset-bottom)+4.75rem))] right-6 z-[118] flex h-12 w-12 items-center justify-center rounded-full bg-chalk text-void shadow-[0_10px_35px_rgba(0,0,0,0.55)] transition-transform duration-300 hover:scale-110"
    >
      {/* glyphe WhatsApp */}
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.13-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
      </svg>
    </motion.a>
  );
}
