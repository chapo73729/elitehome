"use client";

import { type ReactNode } from "react";
import { LocaleLink } from "@/components/ui/LocaleLink";
import { PageHeaderFX } from "@/components/ui/PageHeaderFX";
import { Reveal } from "@/components/ui/Reveal";
import { useContent } from "@/lib/content";

/**
 * Shared inner-page header: back-to-home link, eyebrow, display title and an
 * optional intro. Backdrop is either one of the house's own photographs
 * (`image`) graded into the night, or the drifting constellation canvas.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  accent = "#ffffff",
  backHref = "/",
  image,
  imagePosition = "center",
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  accent?: string;
  backHref?: string;
  /** Optional photographic backdrop (public path, e.g. /images/…webp). */
  image?: string;
  imagePosition?: string;
  children?: ReactNode;
}) {
  const back = useContent().common.backHome;

  return (
    <section className="relative overflow-hidden pb-12 pt-36 md:pt-44">
      {image ? (
        <div aria-hidden className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: imagePosition }}
            decoding="async"
            draggable={false}
          />
          {/* graded into the black world; text side kept legible, photo alive */}
          <div className="absolute inset-0 bg-void/35" />
          <div className="absolute inset-0 bg-gradient-to-r from-void/80 via-void/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-void/30 via-transparent to-void" />
        </div>
      ) : (
        <PageHeaderFX accent={accent} />
      )}
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
