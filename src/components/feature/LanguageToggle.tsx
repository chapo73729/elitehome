"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/lang";
import { unlock } from "@/lib/achievements";
import { stripLocale, localizePath, locales, type AppLocale } from "@/lib/i18n";

export function LanguageToggle({ className }: { className?: string }) {
  const lang = useLang();
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (l: AppLocale) => {
    if (l === lang) return;
    // remember the choice so the middleware honours it on bare-path visits
    document.cookie = `ardlabs-lang=${l}; path=/; max-age=31536000`;
    unlock("polyglot");
    const { rest } = stripLocale(pathname ?? "/");
    // preserve hash + query from the live location
    const suffix =
      typeof window !== "undefined"
        ? window.location.search + window.location.hash
        : "";
    router.replace(localizePath(rest + suffix, l));
  };

  return (
    <div
      className={`flex items-center gap-1 font-mono text-xs ${className ?? ""}`}
      role="group"
      aria-label="Language"
    >
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
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
