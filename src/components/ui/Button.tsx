"use client";

import { type ReactNode } from "react";
import clsx from "clsx";
import { Magnetic } from "./Magnetic";
import { scrollToTarget } from "@/components/layout/SmoothScroll";

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
  const base =
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-colors duration-500";
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
        <span className="absolute inset-0 -z-0 translate-y-full bg-gradient-to-r from-accent-2 via-accent to-accent-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
      )}
      {variant === "ghost" && (
        <span className="absolute inset-0 -z-0 scale-x-0 origin-left bg-white/5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
      )}
    </>
  );

  return (
    <Magnetic strength={0.35} className="inline-block">
      {href ? (
        <a href={href} onClick={handle} className={clsx(base, styles, className)}>
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
