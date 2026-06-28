"use client";

import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { useContent } from "@/lib/content";

/** Full-width gradient call-to-action banner before the contact section. */
export function CtaBanner() {
  const c = useContent().cta;
  return (
    <section className="relative z-10 bg-void py-16 md:py-24">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] hairline px-8 py-20 text-center md:px-16 md:py-28">
            {/* animated aurora background */}
            <div className="pointer-events-none absolute inset-0 opacity-70">
              <div className="absolute left-1/2 top-1/2 h-[140%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_0deg,rgba(91,140,255,0.25),rgba(122,242,224,0.18),rgba(180,140,255,0.22),rgba(91,140,255,0.25))] blur-[90px] [animation:spin-slow_24s_linear_infinite]" />
            </div>
            <div className="pointer-events-none absolute inset-0 [background:radial-gradient(70%_120%_at_50%_0%,transparent,rgba(5,5,5,0.6))]" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background:repeating-linear-gradient(0deg,#fff_0px,#fff_1px,transparent_1px,transparent_5px)]" />

            <div className="relative z-10">
              <span className="eyebrow">{c.eyebrow}</span>
              <h2 className="text-section-title text-gradient mx-auto mt-6 max-w-3xl text-balance">
                {c.title}
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-balance text-mist">
                {c.body}
              </p>
              <div className="mt-10 flex justify-center">
                <Button href="#contact">
                  {c.button} <span aria-hidden>→</span>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
