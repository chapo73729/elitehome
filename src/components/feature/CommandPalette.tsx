"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useLocaleRouter } from "@/hooks/useLocaleRouter";
import { stripLocale } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { useContent } from "@/lib/content";
import { scrollToTarget } from "@/components/layout/SmoothScroll";
import { audio } from "@/lib/audio";
import { startShowreel } from "@/lib/showreel";
import { ACCENTS, applyAccent } from "@/lib/accent";
import { toast, copyText } from "@/lib/toast";
import { togglePerf } from "@/lib/perf";
import { openTerminal } from "@/components/feature/Terminal";
import { unlock } from "@/lib/achievements";
import { useLang } from "@/lib/lang";

const T = {
  en: {
    groupNavigate: "Navigate",
    groupServices: "Services",
    groupActions: "Actions",
    groupTheme: "Theme",
    backToTop: "Back to top",
    allServices: "All services",
    playShowreel: "Play showreel",
    autoTour: "auto-tour",
    openConsole: "Open console",
    togglePerf: "Toggle performance mode",
    toggleSound: "Toggle sound",
    copyEmail: "Copy contact email",
    accentPrefix: "Accent · ",
    perfToast: "Performance mode toggled",
    emailCopied: "Email copied",
    accentToast: (name: string) => `${name} accent`,
    placeholder: "Search sections, industries, actions…",
    searchAria: "Search sections, industries and actions",
    noResults: "No results.",
  },
  fr: {
    groupNavigate: "Naviguer",
    groupServices: "Services",
    groupActions: "Actions",
    groupTheme: "Thème",
    backToTop: "Retour en haut",
    allServices: "Tous les services",
    playShowreel: "Lancer la bande-démo",
    autoTour: "visite auto",
    openConsole: "Ouvrir la console",
    togglePerf: "Activer le mode performance",
    toggleSound: "Activer/couper le son",
    copyEmail: "Copier l’e-mail de contact",
    accentPrefix: "Accent · ",
    perfToast: "Mode performance activé",
    emailCopied: "E-mail copié",
    accentToast: (name: string) => `Accent ${name}`,
    placeholder: "Rechercher sections, services, actions…",
    searchAria: "Rechercher sections, services et actions",
    noResults: "Aucun résultat.",
  },
} as const;

type Cmd = { id: string; label: string; group: string; hint?: string; run: () => void };

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useLocaleRouter();
  const pathname = usePathname();
  const isHome = stripLocale(pathname).rest === "/";
  const content = useContent();
  const lang = useLang();
  const t = T[lang];
  const NAV = content.nav;
  const INDUSTRIES = content.industries.items;

  const goSection = (href: string) => {
    if (!isHome) router.push("/" + href);
    else scrollToTarget(href);
  };

  const commands: Cmd[] = useMemo(() => {
    const list: Cmd[] = [];
    NAV.forEach((n) =>
      list.push({ id: "nav" + n.href, label: n.label, group: t.groupNavigate, run: () => goSection(n.href) })
    );
    list.push({ id: "top", label: t.backToTop, group: t.groupNavigate, run: () => (!isHome ? router.push("/") : scrollToTarget(0)) });
    INDUSTRIES.forEach((i) =>
      list.push({ id: "ind" + i.id, label: i.title, group: t.groupServices, run: () => router.push(`/services/${i.id}`) })
    );
    list.push({ id: "ind-all", label: t.allServices, group: t.groupServices, run: () => router.push("/services") });
    list.push({ id: "showreel", label: t.playShowreel, group: t.groupActions, hint: t.autoTour, run: () => { unlock("spectator"); router.push("/"); setTimeout(startShowreel, 400); } });
    list.push({ id: "terminal", label: t.openConsole, group: t.groupActions, hint: "~", run: () => openTerminal() });
    list.push({ id: "perf", label: t.togglePerf, group: t.groupActions, run: () => { togglePerf(); unlock("minimalist"); toast(t.perfToast, "⚡"); } });
    list.push({ id: "sound", label: t.toggleSound, group: t.groupActions, run: () => audio.toggle() });
    list.push({
      id: "copy",
      label: t.copyEmail,
      group: t.groupActions,
      run: async () => {
        if (await copyText(SITE.email)) toast(t.emailCopied, "✓");
      },
    });
    ACCENTS.forEach((a) =>
      list.push({ id: "acc" + a.id, label: `${t.accentPrefix}${a.name}`, group: t.groupTheme, run: () => { applyAccent(a.id); unlock("chameleon"); toast(t.accentToast(a.name), "◆"); } })
    );
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHome, content, lang]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return commands;
    return commands.filter((c) => (c.label + " " + c.group).toLowerCase().includes(s));
  }, [q, commands]);

  // open/close hotkeys
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // remember what had focus before the palette opened and hand it back on
  // close, so keyboard users aren't dropped onto <body>
  const restoreRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (open) {
      restoreRef.current = document.activeElement as HTMLElement | null;
      unlock("palette");
      setQ("");
      setSel(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    } else {
      restoreRef.current?.focus?.();
      restoreRef.current = null;
    }
  }, [open]);

  useEffect(() => setSel(0), [q]);

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      // trap focus inside the palette
      e.preventDefault();
      inputRef.current?.focus();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const c = filtered[sel];
      if (c) {
        c.run();
        setOpen(false);
      }
    }
  };

  let lastGroup = "";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[220] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-void/70 backdrop-blur-md" onClick={() => setOpen(false)} />
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={t.searchAria}
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl glass"
            onKeyDown={onListKey}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <span className="font-mono text-xs text-accent-2">⌘K</span>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t.placeholder}
                aria-label={t.searchAria}
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-results"
                aria-activedescendant={filtered[sel] ? `palette-opt-${filtered[sel].id}` : undefined}
                className="w-full bg-transparent text-chalk outline-none placeholder:text-fog"
              />
            </div>
            <div id="palette-results" role="listbox" aria-label={t.searchAria} className="max-h-[50vh] overflow-y-auto p-2">
              {filtered.length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-fog">{t.noResults}</div>
              )}
              {filtered.map((c, i) => {
                const showGroup = c.group !== lastGroup;
                lastGroup = c.group;
                return (
                  <div key={c.id}>
                    {showGroup && (
                      <div className="px-3 pb-1 pt-3 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-fog">
                        {c.group}
                      </div>
                    )}
                    <button
                      id={`palette-opt-${c.id}`}
                      role="option"
                      aria-selected={sel === i}
                      tabIndex={-1}
                      onMouseEnter={() => setSel(i)}
                      onClick={() => {
                        c.run();
                        setOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                        sel === i ? "bg-white/10 text-chalk" : "text-mist"
                      }`}
                    >
                      {c.label}
                      {c.hint && <span className="font-mono text-[0.6rem] text-fog">{c.hint}</span>}
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
