"use client";

import { usePathname } from "next/navigation";
import { setLang } from "@/lib/lang";
import { stripLocale, type AppLocale } from "@/lib/i18n";

/**
 * Seeds the client language store from the URL locale. The URL is the single
 * source of truth for the active language. This runs during render (not in an
 * effect) so the store is set before children commit, avoiding a flash of the
 * wrong language and matching SSR. It also keeps <html lang> in sync.
 *
 * Receives the server-resolved `locale` (validated in the layout) but also
 * watches the live pathname so client-side locale switches stay in sync.
 */
export function LocaleSync({ locale }: { locale: AppLocale }) {
  const pathname = usePathname();
  const fromUrl = stripLocale(pathname ?? "").locale ?? locale;

  // setLang() is a no-op when the value is unchanged, so this is safe to call
  // on every render — it only emits on an actual change.
  setLang(fromUrl);
  if (typeof document !== "undefined") {
    document.documentElement.lang = fromUrl;
  }

  return null;
}
