"use client";

import { useRouter } from "next/navigation";
import { useLang } from "@/lib/lang";
import { localizePath } from "@/lib/i18n";

type NavOptions = Parameters<ReturnType<typeof useRouter>["push"]>[1];

/**
 * Wraps next/navigation's useRouter so push/replace automatically prefix
 * internal paths with the current URL locale. Other router methods are
 * forwarded unchanged.
 */
export function useLocaleRouter() {
  const router = useRouter();
  const locale = useLang();

  return {
    ...router,
    push: (href: string, options?: NavOptions) =>
      router.push(localizePath(href, locale), options),
    replace: (href: string, options?: NavOptions) =>
      router.replace(localizePath(href, locale), options),
  };
}
