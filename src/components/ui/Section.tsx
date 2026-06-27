"use client";

import { type ReactNode } from "react";
import clsx from "clsx";
import { Reveal } from "./Reveal";

export function Section({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={clsx(
        "relative z-10 scroll-mt-24 bg-void py-28 md:py-40",
        className
      )}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  intro,
}: {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  intro?: string;
}) {
  return (
    <div className="container-x">
      <Reveal>
        <div className="flex items-center gap-4">
          {index && (
            <span className="font-mono text-xs text-accent">{index}</span>
          )}
          <span className="eyebrow">{eyebrow}</span>
          <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="text-section-title text-gradient mt-7 max-w-4xl text-balance">
          {title}
        </h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.16}>
          <p className="mt-6 max-w-xl text-balance text-mist">{intro}</p>
        </Reveal>
      )}
    </div>
  );
}
