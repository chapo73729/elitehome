"use client";

import { useContent } from "@/lib/content";
import { SITE } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

/**
 * Booking Experience — the closing homepage beat. "Your journey starts here",
 * the personal-confirmation promise, and the primary calls to action. The full
 * reservation form lives on /booking.
 */
export function BookingCTA() {
  const b = useContent().booking;
  const c = useContent().common;

  return (
    <section id="booking" className="relative z-10 scroll-mt-24 overflow-hidden bg-void py-28 md:py-40">
      {/* champagne wash */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(198,161,91,0.14),transparent_70%)] blur-3xl" />
      </div>

      <div className="container-x relative text-center">
        <Reveal>
          <p className="eyebrow">{b.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="text-section-title text-gradient mx-auto mt-7 max-w-3xl text-balance">
            {b.title}
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="text-lead mx-auto mt-6 max-w-xl">{b.intro}</p>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href="/booking">{c.book}</Button>
            <Button href={`tel:${SITE.phoneHref}`} variant="ghost">
              {c.callUs} · {SITE.phone}
            </Button>
          </div>
        </Reveal>
        <Reveal delay={0.32}>
          <p className="mx-auto mt-8 max-w-md font-mono text-xs leading-relaxed tracking-wide text-fog">
            {b.promise}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
