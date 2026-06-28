"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/lib/lang";

const T = {
  en: {
    body: "We use only essential storage to run the site and remember your preferences. No third-party tracking.",
    privacy: "Privacy",
    got: "Got it",
    essential: "Essential only",
  },
  fr: {
    body: "Nous utilisons uniquement le stockage essentiel pour faire fonctionner le site et mémoriser vos préférences. Aucun traçage tiers.",
    privacy: "Confidentialité",
    got: "J'ai compris",
    essential: "Essentiel uniquement",
  },
};

export function CookieConsent() {
  const lang = useLang();
  const t = T[lang];
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem("ardlabs-consent")) {
        const t = setTimeout(() => setShow(true), 1600);
        return () => clearTimeout(t);
      }
    } catch {}
  }, []);

  const choose = (v: "accepted" | "essential") => {
    try {
      localStorage.setItem("ardlabs-consent", v);
    } catch {}
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-label="Cookie notice"
          className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-3 right-3 z-[170] rounded-2xl glass p-4 sm:right-auto sm:max-w-[340px]"
        >
          <p className="text-xs leading-relaxed text-mist">
            {t.body}{" "}
            <Link href="/legal/privacy" className="link-underline text-chalk">
              {t.privacy}
            </Link>
            .
          </p>
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={() => choose("accepted")}
              data-cursor
              className="rounded-full bg-chalk px-4 py-2 text-xs font-medium text-void transition-transform duration-300 hover:scale-[1.03]"
            >
              {t.got}
            </button>
            <button
              onClick={() => choose("essential")}
              data-cursor
              className="rounded-full hairline px-4 py-2 text-xs text-mist transition-colors hover:text-chalk"
            >
              {t.essential}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
