"use client";

import { useEffect, useState } from "react";
import { LocaleLink } from "@/components/ui/LocaleLink";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useContent } from "@/lib/content";
import { stripLocale } from "@/lib/i18n";

/**
 * Mobile-only thumb-reach call-to-action. A persistent, compact glass pill
 * anchored bottom-left so it never collides with the bottom-right BackToTop
 * button; it sits below the cookie banner (which overlays it while shown) and
 * the SectionNav is desktop-only, so there is nothing to fight on phones.
 *
 * Hidden on desktop (md:hidden), respects the safe-area inset, and uses the
 * localized hero.engage label ("Start a project" / "Démarrer un projet").
 * It links to the on-page contact anchor on the homepage and the contact
 * route everywhere else.
 */
export function MobileCTA() {
  const pathname = usePathname();
  const label = useContent().hero.engage;
  const isHome = stripLocale(pathname).rest === "/";
  const href = isHome ? "#contact" : "/contact";
  const [show, setShow] = useState(false);

  // let the hero reach first paint before the CTA fades in
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-[max(0.85rem,env(safe-area-inset-bottom))] left-3 z-[120] md:hidden"
    >
      <LocaleLink
        href={href}
        data-cursor
        className="flex items-center gap-2 rounded-full glass px-4 py-2.5 text-sm font-medium text-chalk shadow-[0_8px_30px_rgba(0,0,0,0.45)] transition-colors duration-300 hover:border-white/25"
      >
        <span
          aria-hidden
          className="block h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_2px_rgba(79,140,255,0.6)]"
        />
        {label}
      </LocaleLink>
    </motion.div>
  );
}
