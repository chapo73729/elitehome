"use client";

import { type ReactNode } from "react";
import { LocaleLink } from "@/components/ui/LocaleLink";
import { PageHeaderFX } from "@/components/ui/PageHeaderFX";
import { Reveal } from "@/components/ui/Reveal";
import { useContent } from "@/lib/content";

/**
 * Shared inner-page header: back-to-home link, eyebrow, display title and an
 * optional intro, over the drifting constellation backdrop.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  accent = "#c6a15b",
  backHref = "/",
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  accent?: string;
  backHref?: string;
  children?: ReactNode;
}) {
  const back = useContent().common.backHome;

  return (
    <section className="relative overflow-hidden pb-12 pt-36 md:pt-44">
      <PageHeaderFX accent={accent} />
      <div className="container-x relative">
        <Reveal>
          <LocaleLink
            href={backHref}
            className="link-underline font-mono text-xs tracking-widest text-mist"
          >
            {back}
          </LocaleLink>
        </Reveal>
        <Reveal delay={0.06}>
          <p className="eyebrow mt-10">{eyebrow}</p>
        </Reveal>
        <Reveal delay={0.12}>
          <h1 className="text-giant text-gradient mt-6 max-w-4xl text-balance">{title}</h1>
        </Reveal>
        {intro && (
          <Reveal delay={0.18}>
            <p className="text-lead mt-6 max-w-2xl">{intro}</p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
