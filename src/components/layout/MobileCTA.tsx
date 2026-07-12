"use client";

import { useEffect, useState } from "react";
import { LocaleLink } from "@/components/ui/LocaleLink";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useContent } from "@/lib/content";
import { stripLocale } from "@/lib/i18n";

/**
 * Mobile + tablet thumb-reach call-to-action. A persistent, compact glass pill
 * anchored bottom-left so it never collides with the bottom-right BackToTop
 * button. The desktop header CTA only appears at lg, so this covers everything
 * below 1024px.
 *
 * It waits for the cookie banner to be dismissed before appearing (both are
 * anchored bottom-left) so the two never overlap; on return visits — when
 * consent is already stored — it simply fades in after the hero settles.
 * Uses the localized hero.engage label and links to the on-page contact anchor
 * on the homepage, the contact route everywhere else.
 */
export function MobileCTA() {
  const pathname = usePathname();
  const label = useContent().common.book;
  const rest = stripLocale(pathname).rest;
  const href = "/booking";
  const [show, setShow] = useState(false);
  // redundant on the booking page itself
  const onBooking = rest === "/booking";

  useEffect(() => {
    let consented = true;
    try {
      consented = !!localStorage.getItem("blackfirst-consent");
    } catch {}

    // return visit (consent already stored): fade in after the hero settles.
    if (consented) {
      const t = setTimeout(() => setShow(true), 900);
      return () => clearTimeout(t);
    }

    // first visit: hold until the cookie banner is dismissed so the two
    // bottom-left elements never stack.
    const onConsent = () => setShow(true);
    window.addEventListener("blackfirst-consent-set", onConsent);
    return () => window.removeEventListener("blackfirst-consent-set", onConsent);
  }, []);

  if (onBooking) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-[max(0.85rem,env(safe-area-inset-bottom))] left-3 z-[120] lg:hidden"
    >
      <LocaleLink
        href={href}
        data-cursor
        className="flex items-center gap-2 rounded-full glass px-4 py-2.5 text-sm font-medium text-chalk shadow-[0_8px_30px_rgba(0,0,0,0.45)] transition-colors duration-300 hover:border-white/25"
      >
        <span
          aria-hidden
          className="block h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_2px_rgba(255,255,255,0.55)]"
        />
        {label}
      </LocaleLink>
    </motion.div>
  );
}
