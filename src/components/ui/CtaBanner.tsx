"use client";

import { useContent } from "@/lib/content";
import { SITE } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

/** Reusable closing CTA used at the foot of inner pages. */
export function CtaBanner({
  title,
  body,
}: {
  title?: string;
  body?: string;
}) {
  const s = useContent().service;
  const c = useContent().common;

  return (
    <section className="relative z-10 overflow-hidden bg-void py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[360px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.07),transparent_70%)] blur-3xl" />
      </div>
      <div className="container-x relative text-center">
        <Reveal>
          <h2 className="text-section-title text-gradient mx-auto max-w-2xl text-balance">
            {title ?? s.ctaTitle}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-lead mx-auto mt-6 max-w-xl">{body ?? s.ctaBody}</p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Button href="/booking">{c.book}</Button>
            <Button href={`tel:${SITE.phoneHref}`} variant="ghost">
              {c.callUs} · {SITE.phone}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
