/* ============================================================
   BLACKFIRST® — URL-based locale (i18n) helpers
   Single source of truth for the /en and /fr URL prefixes.
   ============================================================ */

export const locales = ["en", "fr"] as const;
export const defaultLocale = "en";
export type AppLocale = (typeof locales)[number];

/** Type guard: is the given value one of our supported locales? */
export function isLocale(x: unknown): x is AppLocale {
  return typeof x === "string" && (locales as readonly string[]).includes(x);
}

/**
 * Prefix a path with the given locale, preserving any hash + query string and
 * avoiding a double prefix. Hash-only and external links are returned as-is.
 */
export function localizePath(path: string, locale: AppLocale): string {
  if (!path) return `/${locale}`;
  // leave hash-only, protocol-relative, absolute URLs and mailto/tel untouched
  if (
    path.startsWith("#") ||
    path.startsWith("mailto:") ||
    path.startsWith("tel:") ||
    /^[a-z][a-z0-9+.-]*:/i.test(path) ||
    path.startsWith("//")
  ) {
    return path;
  }

  // split off hash + query so we only touch the pathname
  let rest = path;
  let suffix = "";
  const hashIdx = rest.indexOf("#");
  if (hashIdx !== -1) {
    suffix = rest.slice(hashIdx) + suffix;
    rest = rest.slice(0, hashIdx);
  }
  const queryIdx = rest.indexOf("?");
  if (queryIdx !== -1) {
    suffix = rest.slice(queryIdx) + suffix;
    rest = rest.slice(0, queryIdx);
  }

  // ensure a leading slash on the pathname portion
  if (!rest.startsWith("/")) rest = "/" + rest;

  // avoid double-prefix: if it already starts with a locale segment, restrip
  const { rest: stripped } = stripLocale(rest);
  const prefixed = stripped === "/" ? `/${locale}` : `/${locale}${stripped}`;
  return prefixed + suffix;
}

/**
 * Split a pathname into its locale segment (if any) and the remaining path.
 * `rest` always starts with "/". When no locale is present, the default locale
 * is returned and `rest` is the original pathname.
 */
export function stripLocale(pathname: string): { locale: AppLocale; rest: string } {
  if (!pathname) return { locale: defaultLocale, rest: "/" };
  const segments = pathname.split("/"); // ["", "en", "about", ...]
  const maybe = segments[1];
  if (isLocale(maybe)) {
    const rest = "/" + segments.slice(2).join("/");
    return { locale: maybe, rest: rest === "/" ? "/" : rest.replace(/\/$/, "") || "/" };
  }
  return { locale: defaultLocale, rest: pathname || "/" };
}

/** OpenGraph locale codes for each app locale. */
export const ogLocale: Record<AppLocale, string> = {
  en: "en_US",
  fr: "fr_FR",
};

/**
 * Build a Next.js `alternates` block (canonical + hreflang languages) for a
 * given locale and an unprefixed path (e.g. "/about", "/services/ai", "/").
 */
export function i18nAlternates(locale: AppLocale, path: string) {
  const clean = path === "/" ? "" : path.replace(/\/$/, "");
  return {
    canonical: `/${locale}${clean}`,
    languages: {
      en: `/en${clean}`,
      fr: `/fr${clean}`,
      "x-default": `/en${clean}`,
    },
  };
}
