"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { setLang } from "@/lib/lang";
import { stripLocale, type AppLocale } from "@/lib/i18n";

/**
 * Keeps the client language store and <html lang> in sync with the URL locale
 * across client-side navigations (e.g. the language toggle's router.replace).
 *
 * Nothing here runs during render:
 * - The initial <html lang> is server-rendered by the [locale] root layout.
 * - The store seeds itself from location.pathname at module-init time
 *   (see src/lib/lang.ts), so it is correct before the first render.
 * This effect only handles subsequent SPA locale changes.
 */
export function LocaleSync({ locale }: { locale: AppLocale }) {
  const pathname = usePathname();

  useEffect(() => {
    const fromUrl = pathname ? stripLocale(pathname).locale : locale;
    setLang(fromUrl);
    // setLang no-ops when unchanged, so make sure <html lang> is right even
    // if the store already matches (e.g. after recovering from global-error).
    document.documentElement.lang = fromUrl;
  }, [pathname, locale]);

  return null;
}
