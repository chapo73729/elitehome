"use client";

import { useContent } from "@/lib/content";
import { SITE } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { LocaleLink } from "@/components/ui/LocaleLink";

/**
 * Booking Experience — le temps fort lumineux de la page. Après tout ce noir
 * profond, un bandeau ivoire éclatant : « Votre voyage commence ici », la
 * promesse de confirmation personnelle, et les deux appels à l'action.
 */
export function BookingCTA() {
  const b = useContent().booking;
  const c = useContent().common;

  return (
    <section
      id="booking"
      className="relative z-10 scroll-mt-24 overflow-hidden bg-gradient-to-b from-[#f8f5ee] via-[#f3eee2] to-[#ece5d4] py-28 text-void md:py-40"
    >
      {/* lumière champagne dans l'ivoire */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[460px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(198,161,91,0.28),transparent_70%)] blur-3xl" />
        <div className="absolute -bottom-24 right-[10%] h-[320px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(198,161,91,0.18),transparent_70%)] blur-3xl" />
      </div>

      <div className="container-x relative text-center">
        <Reveal>
          <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.4em] text-[#a8843f]">
            {b.eyebrow}
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="text-section-title mx-auto mt-7 max-w-3xl text-balance text-[#141210]">
            {b.title}
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#5c564a]">{b.intro}</p>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <LocaleLink
              href="/booking"
              data-cursor
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[#141210] px-8 py-4 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-chalk transition-transform duration-300 hover:scale-[1.03] active:scale-[0.97]"
            >
              <span className="relative z-10">{c.book}</span>
              <span className="absolute inset-0 -z-0 translate-y-full bg-gradient-to-r from-accent-3 via-accent to-accent-2 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
            </LocaleLink>
            <a
              href={`tel:${SITE.phoneHref}`}
              className="inline-flex items-center justify-center rounded-full border border-[#141210]/25 px-8 py-4 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-[#141210] transition-colors duration-300 hover:border-[#141210]/60"
            >
              {c.callUs} · {SITE.phone}
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.32}>
          <p className="mx-auto mt-9 max-w-md font-mono text-xs leading-relaxed tracking-wide text-[#8a8272]">
            {b.promise}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
