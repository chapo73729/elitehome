"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site";
import { useContent } from "@/lib/content";
import { scrollToTarget } from "./SmoothScroll";
import { Magnetic } from "@/components/ui/Magnetic";
import { SoundToggle } from "./SoundToggle";
import { LanguageToggle } from "@/components/feature/LanguageToggle";
import { useLang } from "@/lib/lang";
import { useLocaleRouter } from "@/hooks/useLocaleRouter";
import { stripLocale } from "@/lib/i18n";

const T = {
  en: { openMenu: "Open menu", closeMenu: "Close menu", sound: "SOUND" },
  fr: { openMenu: "Ouvrir le menu", closeMenu: "Fermer le menu", sound: "SON" },
} as const;

export function Navbar({ ready = true }: { ready?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const pathname = usePathname();
  const router = useLocaleRouter();
  const isHome = stripLocale(pathname).rest === "/";
  const c = useContent();
  const NAV = c.nav;
  const t = T[useLang()];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // track the section currently in view to light up the matching nav item;
  // clear it off the homepage — the navbar persists across client navigations,
  // so a stale highlight would otherwise survive onto inner pages
  useEffect(() => {
    if (!isHome) {
      setActive("");
      return;
    }
    const ids = NAV.map((n) => n.href.replace("#", ""));
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive("#" + e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ready, NAV, isHome]);

  // close the mobile menu on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    // when off the homepage, navigate home (with hash) instead of scrolling
    if (href.startsWith("#") && !isHome) {
      router.push("/" + href);
      return;
    }
    scrollToTarget(href);
  };

  const goHome = () => {
    setOpen(false);
    if (!isHome) router.push("/");
    else scrollToTarget(0);
  };

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
          {/* wordmark */}
          <Magnetic strength={0.25}>
            <button
              onClick={goHome}
              className="font-display text-lg font-bold tracking-tight text-chalk"
              data-cursor
            >
              {SITE.name}
              <span className="text-accent">®</span>
            </button>
          </Magnetic>

          {/* desktop nav pill */}
          <nav className="hidden items-center gap-1 rounded-full px-2 py-2 lg:flex glass">
            {NAV.map((item) => {
              const isActive = active === item.href;
              return (
                <button
                  key={item.href}
                  onClick={() => go(item.href)}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative rounded-full px-4 py-1.5 text-sm transition-colors duration-300 ${
                    isActive ? "text-void" : "text-mist hover:text-chalk"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-0 rounded-full bg-chalk"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <LanguageToggle />
            <SoundToggle />
            <Magnetic strength={0.3}>
              <button
                onClick={() => go("#contact")}
                className="rounded-full bg-chalk px-5 py-2.5 text-sm font-medium text-void transition-transform duration-300 hover:scale-[1.03]"
              >
                {c.common.engage}
              </button>
            </Magnetic>
          </div>

          {/* mobile toggle */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="relative z-[130] flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
            aria-label={open ? t.closeMenu : t.openMenu}
            aria-expanded={open}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[115] flex flex-col items-center justify-center gap-2 overflow-y-auto bg-void/95 py-24 backdrop-blur-xl lg:hidden"
          >
            <div className="flex max-h-[80vh] w-full flex-col items-center gap-2 overflow-y-auto">
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="mt-8 flex items-center gap-6 font-mono text-xs tracking-widest text-fog"
            >
              <span className="flex items-center gap-3">
                <span>{t.sound}</span>
                <SoundToggle />
              </span>
              <LanguageToggle />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
