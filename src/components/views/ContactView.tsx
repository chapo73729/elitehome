"use client";

import { useContent } from "@/lib/content";
import { SITE } from "@/lib/site";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { copyText, toast } from "@/lib/toast";

export function ContactView() {
  const ct = useContent().contact;

  const channels = [
    {
      label: ct.phoneLabel,
      value: SITE.phone,
      href: `tel:${SITE.phoneHref}`,
      sub: ct.hours,
    },
    {
      label: ct.whatsappLabel,
      value: SITE.whatsapp,
      href: `https://wa.me/${SITE.whatsappHref}`,
      external: true,
    },
    {
      label: ct.emailLabel,
      value: SITE.email,
      href: `mailto:${SITE.email}`,
    },
  ];

  return (
    <main className="relative">
      <PageHero eyebrow={ct.eyebrow} title={ct.title} intro={ct.intro} />

      <section className="relative z-10 bg-void pb-24 md:pb-32">
        <div className="container-x grid gap-px overflow-hidden hairline sm:grid-cols-3">
          {channels.map((ch, i) => (
            <Reveal
              key={ch.label}
              delay={0.06 * i}
              className="group bg-void p-8 transition-colors duration-500 hover:bg-ink md:p-10"
            >
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-fog">{ch.label}</p>
              <a
                href={ch.href}
                target={ch.external ? "_blank" : undefined}
                rel={ch.external ? "noopener noreferrer" : undefined}
                className="mt-4 block font-display text-lg text-chalk transition-colors group-hover:text-accent-2"
              >
                {ch.value}
              </a>
              {ch.sub && <p className="mt-3 text-sm text-mist">{ch.sub}</p>}
              <button
                onClick={async () => {
                  if (await copyText(ch.value)) toast("Copied", "✓");
                }}
                className="mt-4 font-mono text-[0.62rem] uppercase tracking-widest text-fog transition-colors hover:text-chalk"
              >
                copy
              </button>
            </Reveal>
          ))}
        </div>

        <div className="container-x mt-12 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <Reveal>
            <div>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-fog">{ct.baseLabel}</p>
              <p className="mt-2 text-mist">{ct.base}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <p className="max-w-sm text-sm text-fog">{ct.responseNote}</p>
              <Button href="/booking">{ct.bookCta}</Button>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
