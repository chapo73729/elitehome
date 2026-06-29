"use client";

import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { useContent } from "@/lib/content";

/** Full-width gradient call-to-action banner before the contact section. */
export function CtaBanner() {
  const c = useContent().cta;
  return (
    <section className="relative z-10 py-16 md:py-24">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] hairline bg-void-2 px-8 py-20 text-center md:px-16 md:py-28">
            {/* animated aurora background — layered, full-strength */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-1/2 h-[170%] w-[95%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_0deg,rgba(79,140,255,0.55),rgba(107,157,255,0.4),rgba(61,111,224,0.5),rgba(79,140,255,0.55))] blur-[90px] [animation:spin-slow_22s_linear_infinite]" />
              <div className="absolute left-1/2 top-1/2 h-[120%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_180deg,rgba(107,157,255,0.35),transparent_40%,rgba(61,111,224,0.42),transparent_80%)] blur-[70px] [animation:spin-slow_34s_linear_infinite_reverse]" />
            </div>
            {/* keep the centre readable without dimming the edges */}
            <div className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_90%_at_50%_50%,rgba(5,5,5,0.65),transparent_75%)]" />
            <div className="pointer-events-none absolute inset-0 [background:radial-gradient(90%_130%_at_50%_0%,transparent_55%,rgba(5,5,5,0.55))]" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background:repeating-linear-gradient(0deg,#fff_0px,#fff_1px,transparent_1px,transparent_5px)]" />

            <div className="relative z-10">
              <span className="eyebrow">{c.eyebrow}</span>
              <h2 className="text-section-title text-chalk mx-auto mt-6 max-w-3xl text-balance">
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
