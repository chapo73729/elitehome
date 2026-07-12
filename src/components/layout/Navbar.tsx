"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site";
import { useContent } from "@/lib/content";
import { scrollToTarget } from "./SmoothScroll";
import { Magnetic } from "@/components/ui/Magnetic";
import { Brandmark } from "@/components/ui/Brandmark";
import { LanguageToggle } from "@/components/feature/LanguageToggle";
import { useLang } from "@/lib/lang";
import { useLocaleRouter } from "@/hooks/useLocaleRouter";
import { stripLocale } from "@/lib/i18n";

const T = {
  en: { openMenu: "Open menu", closeMenu: "Close menu", primary: "Primary" },
  fr: { openMenu: "Ouvrir le menu", closeMenu: "Fermer le menu", primary: "Navigation principale" },
} as const;

export function Navbar({ ready = true }: { ready?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const router = useLocaleRouter();
  const currentPath = stripLocale(pathname).rest;
  const isHome = currentPath === "/";
  const c = useContent();
  const NAV = c.nav;
  const t = T[useLang()];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the mobile menu on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // while the full-screen menu is open, the page behind it must be inert
  useEffect(() => {
    if (!open) return;
    const behind = document.querySelectorAll<HTMLElement>("main, footer");
    behind.forEach((el) => el.setAttribute("inert", ""));
    const first = document.querySelector<HTMLElement>("#mobile-menu a, #mobile-menu button");
    first?.focus();
    return () => {
      behind.forEach((el) => el.removeAttribute("inert"));
      toggleRef.current?.focus();
    };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    if (href.startsWith("#")) {
      if (!isHome) router.push("/" + href);
      else scrollToTarget(href);
      return;
    }
    router.push(href);
  };

  const goHome = () => {
    setOpen(false);
    if (!isHome) router.push("/");
    else scrollToTarget(0);
  };

  const isActive = (href: string) =>
    href !== "/" && !href.startsWith("#") && currentPath.startsWith(href);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className={`fixed inset-x-0 top-0 z-[120] transition-colors duration-500 ${
          scrolled
            ? "border-b border-white/[0.06] bg-void/85 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <div
          className={`mx-auto flex items-center justify-between px-6 transition-all duration-500 md:px-14 ${
            scrolled ? "py-4" : "py-7"
          }`}
        >
          {/* wordmark + emblem */}
          <Magnetic strength={0.25}>
            <button
              onClick={goHome}
              className="flex items-center gap-3 font-display text-xl font-semibold tracking-[0.14em] text-chalk"
              data-cursor
              aria-label={SITE.name}
            >
              <Brandmark size={28} className="text-chalk" />
              <span>
                {SITE.name}
                <span className="text-accent">®</span>
              </span>
            </button>
          </Magnetic>

          {/* desktop nav pill */}
          <nav aria-label={t.primary} className="hidden items-center gap-1 rounded-full px-2 py-2 lg:flex glass">
            {NAV.map((item) => {
              const activeNow = isActive(item.href);
              return (
                <button
                  key={item.href}
                  onClick={() => go(item.href)}
                  aria-current={activeNow ? "page" : undefined}
                  className={`relative rounded-full px-4 py-1.5 text-sm transition-colors duration-300 ${
                    activeNow ? "text-void" : "text-mist hover:text-chalk"
                  }`}
                >
                  {activeNow && (
                    <motion.span
                      layoutId="nav-active-pill"
                      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                      className="absolute inset-0 -z-0 rounded-full bg-chalk"
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <LanguageToggle />
            <Magnetic strength={0.3}>
              <button
                onClick={() => go("/booking")}
                className="rounded-full bg-chalk px-6 py-3 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-void transition-transform duration-300 hover:scale-[1.03]"
              >
                {c.common.book}
              </button>
            </Magnetic>
          </div>

          {/* mobile toggle */}
          <button
            ref={toggleRef}
            onClick={() => setOpen((o) => !o)}
            className="relative z-[130] flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
            aria-label={open ? t.closeMenu : t.openMenu}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span
              className={`h-px w-6 bg-chalk transition-transform duration-300 ${
                open ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-6 bg-chalk transition-transform duration-300 ${
                open ? "-translate-y-[3.5px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </motion.header>

      {/* mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[115] flex flex-col items-center justify-center gap-2 overflow-y-auto bg-void/95 py-24 backdrop-blur-xl lg:hidden"
          >
            <div className="flex max-h-[70vh] w-full flex-col items-center gap-2 overflow-y-auto">
              {NAV.map((item, i) => (
                <motion.button
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  onClick={() => go(item.href)}
                  className="text-section-title text-gradient"
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * NAV.length }}
              onClick={() => go("/booking")}
              className="mt-6 rounded-full bg-chalk px-9 py-4 text-xs font-medium uppercase tracking-[0.22em] text-void"
            >
              {c.common.book}
            </motion.button>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="mt-8 flex items-center gap-6 font-mono text-xs tracking-widest text-fog"
            >
              <LanguageToggle />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
