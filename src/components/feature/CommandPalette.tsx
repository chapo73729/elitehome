"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { NAV, INDUSTRIES, SITE } from "@/lib/site";
import { scrollToTarget } from "@/components/layout/SmoothScroll";
import { audio } from "@/lib/audio";
import { startShowreel } from "@/lib/showreel";
import { ACCENTS, applyAccent } from "@/lib/accent";
import { toast, copyText } from "@/lib/toast";

type Cmd = { id: string; label: string; group: string; hint?: string; run: () => void };

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const goSection = (href: string) => {
    if (pathname !== "/") router.push("/" + href);
    else scrollToTarget(href);
  };

  const commands: Cmd[] = useMemo(() => {
    const list: Cmd[] = [];
    NAV.forEach((n) =>
      list.push({ id: "nav" + n.href, label: n.label, group: "Navigate", run: () => goSection(n.href) })
    );
    list.push({ id: "top", label: "Back to top", group: "Navigate", run: () => (pathname !== "/" ? router.push("/") : scrollToTarget(0)) });
    INDUSTRIES.forEach((i) =>
      list.push({ id: "ind" + i.id, label: i.title, group: "Industries", run: () => router.push(`/industries/${i.id}`) })
    );
    list.push({ id: "ind-all", label: "All industries", group: "Industries", run: () => router.push("/industries") });
    list.push({ id: "showreel", label: "Play showreel", group: "Actions", hint: "auto-tour", run: () => { router.push("/"); setTimeout(startShowreel, 400); } });
    list.push({ id: "sound", label: "Toggle sound", group: "Actions", run: () => audio.toggle() });
    list.push({
      id: "copy",
      label: "Copy contact email",
      group: "Actions",
      run: async () => {
        if (await copyText(SITE.email)) toast("Email copied", "✓");
      },
    });
    ACCENTS.forEach((a) =>
      list.push({ id: "acc" + a.id, label: `Accent · ${a.name}`, group: "Theme", run: () => { applyAccent(a.id); toast(`${a.name} accent`, "◆"); } })
    );
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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

  useEffect(() => {
    if (open) {
      setQ("");
      setSel(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => setSel(0), [q]);

  const onListKey = (e: React.KeyboardEvent) => {
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
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl glass"
            onKeyDown={onListKey}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <span className="font-mono text-xs text-accent-2">⌘K</span>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search sections, industries, actions…"
                className="w-full bg-transparent text-chalk outline-none placeholder:text-fog"
              />
            </div>
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {filtered.length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-fog">No results.</div>
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
