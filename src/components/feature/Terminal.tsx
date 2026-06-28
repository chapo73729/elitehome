"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { INDUSTRIES } from "@/lib/site";
import { scrollToTarget } from "@/components/layout/SmoothScroll";
import { applyAccent, ACCENTS } from "@/lib/accent";
import { setLang } from "@/lib/lang";
import { togglePerf } from "@/lib/perf";
import { audio } from "@/lib/audio";
import { startShowreel } from "@/lib/showreel";
import { achievementState, unlock } from "@/lib/achievements";

let _open: (() => void) | null = null;
export function openTerminal() {
  _open?.();
}

type Line = { t: "in" | "out"; v: string };

const BANNER = [
  "ARDLABS® CONSOLE v1.0 — type 'help'",
];

export function Terminal() {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<Line[]>(BANNER.map((v) => ({ t: "out", v })));
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
        out([
          "available commands:",
          "  help            this list",
          "  about           what is ARDLABS",
          "  whoami          current session",
          "  services        list service poles",
          "  open <id>       open a service",
          "  contact         jump to contact",
          "  theme <name>    " + ACCENTS.map((a) => a.id).join(" | "),
          "  lang <en|fr>    switch language",
          "  sound           toggle sound",
          "  perf            toggle performance mode",
          "  showreel        play the auto-tour",
          "  achievements    show unlocked",
          "  clear / exit",
        ]);
        break;
      case "about":
        out([
          "ARDLABS® — Digital Engineering Studio.",
          "We design and build software, platforms and AI",
          "systems, refined to the detail. Four poles:",
          "strategy, software, data & AI, cloud.",
        ]);
        break;
      case "whoami":
        out(["visitor@ardlabs — access: guest"]);
        break;
      case "services":
      case "industries":
      case "ls":
        out(INDUSTRIES.map((i) => `  ${i.id.padEnd(12)} ${i.title}`));
        break;
      case "open": {
        const id = (args[0] || "").toLowerCase();
        if (INDUSTRIES.some((i) => i.id === id)) {
          out([`opening /services/${id} …`]);
          unlock("explorer");
          router.push(`/services/${id}`);
          setOpen(false);
        } else out([`unknown service: ${args[0] || "(none)"}`]);
        break;
      }
      case "contact":
        out(["routing to contact …"]);
        router.push("/#contact");
        setTimeout(() => scrollToTarget("#contact"), 60);
        setOpen(false);
        break;
      case "theme": {
        const id = (args[0] || "").toLowerCase();
        if (ACCENTS.some((a) => a.id === id)) {
          applyAccent(id);
          out([`accent → ${id}`]);
        } else out([`themes: ${ACCENTS.map((a) => a.id).join(", ")}`]);
        break;
      }
      case "lang": {
        const l = (args[0] || "").toLowerCase();
        if (l === "en" || l === "fr") {
          setLang(l);
          out([`language → ${l}`]);
        } else out(["usage: lang en|fr"]);
        break;
      }
      case "sound":
        audio.toggle();
        out([`sound → ${audio.enabled ? "on" : "off"}`]);
        break;
      case "perf":
        togglePerf();
        out(["performance mode toggled"]);
        break;
      case "showreel":
        out(["engaging showreel …"]);
        router.push("/");
        setTimeout(startShowreel, 400);
        setOpen(false);
        break;
      case "achievements": {
        const s = achievementState();
        out([`unlocked ${s.count}/${s.total}`, ...s.unlocked.map((u) => `  ★ ${u}`)]);
        break;
      }
      case "sudo":
        out(["nice try."]);
        break;
      case "clear":
        setHistory([]);
        break;
      case "exit":
        setOpen(false);
        break;
      default:
        out([`command not found: ${cmd}`]);
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
              ARDLABS://console
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-fog transition-colors hover:text-chalk"
              aria-label="Close console"
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
              placeholder="type a command…"
            />
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
