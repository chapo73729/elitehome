"use client";

import { useLang, setLang } from "@/lib/lang";
import { unlock } from "@/lib/achievements";

export function LanguageToggle({ className }: { className?: string }) {
  const lang = useLang();
  return (
    <div
      className={`flex items-center gap-1 font-mono text-xs ${className ?? ""}`}
      role="group"
      aria-label="Language"
    >
      {(["en", "fr"] as const).map((l) => (
        <button
          key={l}
          onClick={() => {
            setLang(l);
            unlock("polyglot");
          }}
          data-cursor
          aria-pressed={lang === l}
          className={`rounded-full px-2 py-1 uppercase tracking-widest transition-colors duration-300 ${
            lang === l ? "text-chalk" : "text-fog hover:text-mist"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
