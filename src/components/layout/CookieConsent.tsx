"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export function CookieConsent() {
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
          className="fixed bottom-4 left-4 z-[170] max-w-sm rounded-2xl glass p-5"
        >
          <p className="text-sm text-mist">
            We use only essential storage to run the site and remember your
            preferences. No third-party tracking.{" "}
            <Link href="/legal/privacy" className="link-underline text-chalk">
              Privacy
            </Link>
            .
          </p>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => choose("accepted")}
              data-cursor
              className="rounded-full bg-chalk px-4 py-2 text-xs font-medium text-void transition-transform duration-300 hover:scale-[1.03]"
            >
              Got it
            </button>
            <button
              onClick={() => choose("essential")}
              data-cursor
              className="rounded-full hairline px-4 py-2 text-xs text-mist transition-colors hover:text-chalk"
            >
              Essential only
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
