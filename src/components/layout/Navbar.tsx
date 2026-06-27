"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { NAV, SITE } from "@/lib/site";
import { scrollToTarget } from "./SmoothScroll";
import { Magnetic } from "@/components/ui/Magnetic";

export function Navbar({ ready = true }: { ready?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // track the section currently in view to light up the matching nav item
  useEffect(() => {
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
  }, [ready]);

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
    if (href.startsWith("#") && pathname !== "/") {
      router.push("/" + href);
      return;
    }
    scrollToTarget(href);
  };

  const goHome = () => {
    setOpen(false);
    if (pathname !== "/") router.push("/");
    else scrollToTarget(0);
  };

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="fixed inset-x-0 top-0 z-[120]"
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
          <nav className="hidden items-center gap-1 rounded-full px-2 py-2 md:flex glass">
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

          <div className="hidden md:block">
            <Magnetic strength={0.3}>
              <button
                onClick={() => go("#contact")}
                className="rounded-full bg-chalk px-5 py-2.5 text-sm font-medium text-void transition-transform duration-300 hover:scale-[1.03]"
              >
                Engage
              </button>
            </Magnetic>
          </div>

          {/* mobile toggle */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="relative z-[130] flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
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
            className="fixed inset-0 z-[115] flex flex-col items-center justify-center gap-2 bg-void/95 backdrop-blur-xl md:hidden"
          >
            {NAV.map((item, i) => (
              <motion.button
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                onClick={() => go(item.href)}
                className="text-giant text-gradient"
              >
                {item.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
