"use client";

import Link from "next/link";
import { forwardRef } from "react";
import type { ComponentProps } from "react";
import { useLang } from "@/lib/lang";
import { localizePath } from "@/lib/i18n";

type LinkProps = ComponentProps<typeof Link>;

/**
 * Drop-in replacement for next/link that prefixes internal hrefs with the
 * current URL locale. Hash-only (#…), mailto:, tel:, and external/absolute
 * URLs are passed through untouched.
 */
export const LocaleLink = forwardRef<HTMLAnchorElement, LinkProps>(
  function LocaleLink({ href, ...rest }, ref) {
    const locale = useLang();
    const next =
      typeof href === "string" ? localizePath(href, locale) : href;
    return <Link ref={ref} href={next} {...rest} />;
  }
);
