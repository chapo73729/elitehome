"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocaleRouter } from "@/hooks/useLocaleRouter";
import { INDUSTRIES } from "@/lib/site";
import { scrollToTarget } from "@/components/layout/SmoothScroll";
import { applyAccent, ACCENTS } from "@/lib/accent";
import { getLang, setLang, useLang } from "@/lib/lang";
import { togglePerf } from "@/lib/perf";
import { audio } from "@/lib/audio";
import { startShowreel } from "@/lib/showreel";
import { achievementState, unlock } from "@/lib/achievements";

let _open: (() => void) | null = null;
export function openTerminal() {
  _open?.();
}

type Line = { t: "in" | "out"; v: string };

const T = {
  en: {
    banner: "ARDLABS® CONSOLE v1.0 — type 'help'",
    help: [
      "available commands:",
      "  help            this list",
      "  about           what is ARDLABS",
      "  whoami          current session",
      "  services        list service poles",
      "  open <id>       open a service",
      "  contact         jump to contact",
      "  theme <name>    {accents}",
      "  lang <en|fr>    switch language",
      "  sound           toggle sound",
      "  perf            toggle performance mode",
      "  showreel        play the auto-tour",
      "  achievements    show unlocked",
      "  clear / exit",
    ],
    about: [
      "ARDLABS® — Digital Engineering Studio.",
      "We design and build software, platforms and AI",
      "systems, refined to the detail. Four poles:",
      "strategy, software, data & AI, cloud.",
    ],
    whoami: "visitor@ardlabs — access: guest",
    opening: (id: string) => `opening /services/${id} …`,
    unknownService: (id: string) => `unknown service: ${id}`,
    none: "(none)",
    routing: "routing to contact …",
    accent: (id: string) => `accent → ${id}`,
    themes: (list: string) => `themes: ${list}`,
    language: (l: string) => `language → ${l}`,
    langUsage: "usage: lang en|fr",
    sound: (on: boolean) => `sound → ${on ? "on" : "off"}`,
    perf: "performance mode toggled",
    showreel: "engaging showreel …",
    unlocked: (count: number, total: number) => `unlocked ${count}/${total}`,
    sudo: "nice try.",
    notFound: (cmd: string) => `command not found: ${cmd}`,
    header: "ARDLABS://console",
    close: "Close console",
    placeholder: "type a command…",
  },
  fr: {
    banner: "CONSOLE ARDLABS® v1.0 — tapez « help »",
    help: [
      "commandes disponibles :",
      "  help            cette liste",
      "  about           qu’est-ce qu’ARDLABS",
      "  whoami          session courante",
      "  services        liste des pôles de services",
      "  open <id>       ouvrir un service",
      "  contact         aller au contact",
      "  theme <name>    {accents}",
      "  lang <en|fr>    changer de langue",
      "  sound           activer/couper le son",
      "  perf            activer le mode performance",
      "  showreel        lancer la visite auto",
      "  achievements    afficher les succès",
      "  clear / exit",
    ],
    about: [
      "ARDLABS® — Studio d’ingénierie numérique.",
      "Nous concevons et développons logiciels, plateformes",
      "et systèmes d’IA, soignés jusqu’au détail. Quatre pôles :",
      "conseil, développement, données & IA, cloud.",
    ],
    whoami: "visitor@ardlabs — accès : invité",
    opening: (id: string) => `ouverture de /services/${id} …`,
    unknownService: (id: string) => `service inconnu : ${id}`,
    none: "(aucun)",
    routing: "redirection vers le contact …",
    accent: (id: string) => `accent → ${id}`,
    themes: (list: string) => `thèmes : ${list}`,
    language: (l: string) => `langue → ${l}`,
    langUsage: "usage : lang en|fr",
    sound: (on: boolean) => `son → ${on ? "activé" : "coupé"}`,
    perf: "mode performance basculé",
    showreel: "lancement de la bande-démo …",
    unlocked: (count: number, total: number) => `débloqués ${count}/${total}`,
    sudo: "bien essayé.",
    notFound: (cmd: string) => `commande introuvable : ${cmd}`,
    header: "ARDLABS://console",
    close: "Fermer la console",
    placeholder: "tapez une commande…",
  },
} as const;

export function Terminal() {
  const lang = useLang();
  const t = T[lang];
  const [open, setOpen] = useState(false);
  // Seed the banner from the language at mount so FR users see the FR banner.
  const [history, setHistory] = useState<Line[]>(() => [{ t: "out", v: T[getLang()].banner }]);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const router = useLocaleRouter();

  useEffect(() => {
    _open = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if ((e.key === "`" || e.key === "~") && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      _open = null;
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (open) {
      unlock("terminal");
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  // keep the banner in the active language while it's the only line
  useEffect(() => {
    setHistory((h) =>
      h.length === 1 && h[0].t === "out" && (h[0].v === T.en.banner || h[0].v === T.fr.banner)
        ? [{ t: "out", v: t.banner }]
        : h
    );
  }, [t]);

  useEffect(() => {
    bodyRef.current?.scrollTo(0, bodyRef.current.scrollHeight);
  }, [history]);

  const out = (lines: string[]) =>
    setHistory((h) => [...h, ...lines.map((v) => ({ t: "out" as const, v }))]);

  const run = (raw: string) => {
    const line = raw.trim();
    setHistory((h) => [...h, { t: "in", v: line }]);
    const [cmd, ...args] = line.split(/\s+/);
    switch (cmd.toLowerCase()) {
      case "":
        break;
      case "help":
        out(
          t.help.map((l) =>
            l.replace("{accents}", ACCENTS.map((a) => a.id).join(" | "))
          )
        );
        break;
      case "about":
        out([...t.about]);
        break;
      case "whoami":
        out([t.whoami]);
        break;
      case "services":
      case "industries":
      case "ls":
        out(INDUSTRIES.map((i) => `  ${i.id.padEnd(12)} ${i.title}`));
        break;
      case "open": {
        const id = (args[0] || "").toLowerCase();
        if (INDUSTRIES.some((i) => i.id === id)) {
          out([t.opening(id)]);
          unlock("explorer");
          router.push(`/services/${id}`);
          setOpen(false);
        } else out([t.unknownService(args[0] || t.none)]);
        break;
      }
      case "contact":
        out([t.routing]);
        router.push("/#contact");
        setTimeout(() => scrollToTarget("#contact"), 60);
        setOpen(false);
        break;
      case "theme": {
        const id = (args[0] || "").toLowerCase();
        if (ACCENTS.some((a) => a.id === id)) {
          applyAccent(id);
          out([t.accent(id)]);
        } else out([t.themes(ACCENTS.map((a) => a.id).join(", "))]);
        break;
      }
      case "lang": {
        const l = (args[0] || "").toLowerCase();
        if (l === "en" || l === "fr") {
          setLang(l);
          out([t.language(l)]);
        } else out([t.langUsage]);
        break;
      }
      case "sound":
        audio.toggle();
        out([t.sound(audio.enabled)]);
        break;
      case "perf":
        togglePerf();
        out([t.perf]);
        break;
      case "showreel":
        out([t.showreel]);
        router.push("/");
        setTimeout(startShowreel, 400);
        setOpen(false);
        break;
      case "achievements": {
        const s = achievementState();
        out([t.unlocked(s.count, s.total), ...s.unlocked.map((u) => `  ★ ${u}`)]);
        break;
      }
      case "sudo":
        out([t.sudo]);
        break;
      case "clear":
        setHistory([]);
        break;
      case "exit":
        setOpen(false);
        break;
      default:
        out([t.notFound(cmd)]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-1/2 z-[205] w-[min(92vw,640px)] -translate-x-1/2 overflow-hidden rounded-2xl glass font-mono text-xs"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
            <span className="flex items-center gap-2 text-accent-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-2" />
              {t.header}
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-fog transition-colors hover:text-chalk"
              aria-label={t.close}
            >
              ✕
            </button>
          </div>
          <div ref={bodyRef} className="max-h-[40vh] space-y-1 overflow-y-auto p-4">
            {history.map((l, i) => (
              <div key={i} className={l.t === "in" ? "text-chalk" : "text-mist"}>
                {l.t === "in" ? <span className="text-accent">❯ </span> : null}
                {l.v}
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(value);
              setValue("");
            }}
            className="flex items-center gap-2 border-t border-white/10 px-4 py-3"
          >
            <span className="text-accent">❯</span>
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              spellCheck={false}
              autoComplete="off"
              className="w-full bg-transparent text-chalk outline-none"
              placeholder={t.placeholder}
            />
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
