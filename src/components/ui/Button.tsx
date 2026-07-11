"use client";

import { type ReactNode } from "react";
import clsx from "clsx";
import { Magnetic } from "./Magnetic";
import { scrollToTarget } from "@/components/layout/SmoothScroll";
import { useLang } from "@/lib/lang";
import { localizePath } from "@/lib/i18n";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "ghost";
  className?: string;
  onClick?: () => void;
}

export function Button({
  children,
  href,
  variant = "primary",
  className,
  onClick,
}: ButtonProps) {
  const locale = useLang();
  // hash-only links scroll in-page; everything internal gets a locale prefix
  const resolvedHref =
    href && !href.startsWith("#") ? localizePath(href, locale) : href;

  const base =
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-5 py-2.5 text-sm font-medium tracking-wide transition-[color,transform] duration-500 active:scale-[0.97] active:duration-100 md:px-7 md:py-3.5 " +
    // arrow glyphs passed as children nudge along on hover
    "[&_span[aria-hidden]]:transition-transform [&_span[aria-hidden]]:duration-200 [&_span[aria-hidden]]:ease-[cubic-bezier(0.23,1,0.32,1)] hover:[&_span[aria-hidden]]:translate-x-[3px]";
  const styles =
    variant === "primary"
      ? "bg-chalk text-void hover:text-void"
      : "text-chalk hairline hover:border-white/25";

  const handle = (e: React.MouseEvent) => {
    if (href?.startsWith("#")) {
      e.preventDefault();
      scrollToTarget(href);
    }
    onClick?.();
  };

  const inner = (
    <>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant === "primary" && (
        <>
          <span className="absolute inset-0 -z-0 translate-y-full bg-gradient-to-r from-accent-2 via-accent to-accent-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
          {/* sheen: one light sweep across the face on hover-in, never looping */}
          <span
            aria-hidden
            className="absolute inset-0 z-10 -translate-x-[130%] bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.35)_50%,transparent_60%)] group-hover:translate-x-[130%] group-hover:transition-transform group-hover:duration-700 group-hover:ease-[cubic-bezier(0.77,0,0.175,1)]"
          />
        </>
      )}
      {variant === "ghost" && (
        <span className="absolute inset-0 -z-0 scale-x-0 origin-left bg-white/5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
      )}
    </>
  );

  return (
    <Magnetic strength={0.35} className="inline-block">
      {href ? (
        <a href={resolvedHref} onClick={handle} className={clsx(base, styles, className)}>
          {inner}
        </a>
      ) : (
        <button onClick={handle} className={clsx(base, styles, className)}>
          {inner}
        </button>
      )}
    </Magnetic>
  );
}
