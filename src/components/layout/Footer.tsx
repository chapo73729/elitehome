"use client";

import { LocaleLink } from "@/components/ui/LocaleLink";
import { SITE } from "@/lib/site";
import { useContent } from "@/lib/content";
import { copyText, toast } from "@/lib/toast";
import { useLang } from "@/lib/lang";

const T = {
  en: {
    cities: "Geneva · Lausanne · Montreux · Verbier",
    cities2: "Courchevel · Lyon · Milan",
    sitemap: "Sitemap",
  },
  fr: {
    cities: "Genève · Lausanne · Montreux · Verbier",
    cities2: "Courchevel · Lyon · Milan",
    sitemap: "Plan du site",
  },
} as const;

/** [01]-style register mark. */
const num = (i: number) => `[${String(i + 1).padStart(2, "0")}]`;

export function Footer() {
  const year = 2026;
  const c = useContent();
  const f = c.footer;
  const t = T[useLang()];

  return (
    <footer className="relative z-10 hairline-t bg-void">
      <div className="container-x pb-14 pt-20 md:pb-16 md:pt-28">
        {/* editorial masthead */}
        <p className="text-giant select-none">
          <span className="text-gradient">{SITE.name}</span>
          <span className="text-accent">®</span>
        </p>
        <p className="mt-6 max-w-md text-mist md:text-lg">{f.tagline}</p>

        <div className="mt-16 grid gap-14 md:mt-24 md:grid-cols-12 md:gap-10">
          {/* explore */}
          <nav aria-label={f.explore} className="md:col-span-6 lg:col-span-5">
            <div className="eyebrow mb-6">{f.explore}</div>
            <ul>
              {c.nav.map((n, i) => (
                <li key={n.href} className="hairline-t">
                  <LocaleLink
                    href={n.href}
                    className="group flex w-full items-baseline gap-5 py-3 text-left"
                  >
                    <span className="font-mono text-xs text-accent tabular-nums">{num(i)}</span>
                    <span className="font-mono text-sm tracking-wider text-mist transition-colors group-hover:text-chalk">
                      {n.label}
                    </span>
                    <span
                      aria-hidden
                      className="ml-auto font-mono text-xs text-fog opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      →
                    </span>
                  </LocaleLink>
                </li>
              ))}
              <li className="hairline-t">
                <LocaleLink
                  href="/booking"
                  className="group flex w-full items-baseline gap-5 py-3 text-left"
                >
                  <span className="font-mono text-xs text-accent tabular-nums">{num(c.nav.length)}</span>
                  <span className="font-mono text-sm tracking-wider text-mist transition-colors group-hover:text-chalk">
                    {c.common.book}
                  </span>
                </LocaleLink>
              </li>
            </ul>
          </nav>

          {/* contact */}
          <div className="md:col-span-6 md:col-start-7 md:border-l md:border-[color-mix(in_oklab,var(--color-chalk)_7%,transparent)] md:pl-10 lg:col-span-5 lg:col-start-8">
            <div className="eyebrow mb-6">{f.contact}</div>
            <ul>
              <li className="hairline-t">
                <button
                  onClick={async () => {
                    if (await copyText(SITE.email)) toast(f.copied, "✓");
                  }}
                  data-cursor
                  className="group flex w-full items-baseline gap-5 py-3 text-left"
                  title={f.copyHint}
                >
                  <span className="font-mono text-xs text-accent tabular-nums">{num(0)}</span>
                  <span className="font-mono text-sm tracking-wider text-mist transition-colors group-hover:text-chalk">
                    {SITE.email}
                  </span>
                </button>
              </li>
              <li className="hairline-t">
                <a
                  href={`tel:${SITE.phoneHref}`}
                  className="group flex w-full items-baseline gap-5 py-3 text-left"
                >
                  <span className="font-mono text-xs text-accent tabular-nums">{num(1)}</span>
                  <span className="font-mono text-sm tracking-wider text-mist transition-colors group-hover:text-chalk">
                    {SITE.phone}
                  </span>
                </a>
              </li>
              <li className="hairline-t flex items-baseline gap-5 py-3">
                <span aria-hidden className="font-mono text-xs text-accent tabular-nums">{num(2)}</span>
                <span className="font-mono text-sm tracking-wider text-fog">{t.cities}</span>
              </li>
              <li className="hairline-t flex items-baseline gap-5 py-3">
                <span aria-hidden className="font-mono text-xs text-accent tabular-nums">{num(3)}</span>
                <span className="font-mono text-sm tracking-wider text-fog">{t.cities2}</span>
              </li>
            </ul>
          </div>
        </div>

        <nav
          aria-label={t.sitemap}
          className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-2 hairline-t pt-8 font-mono text-xs tracking-wider text-fog md:mt-24"
        >
          <LocaleLink href="/services" className="inline-block py-1 transition-colors hover:text-chalk">
            {c.nav[0].label}
          </LocaleLink>
          <LocaleLink href="/fleet" className="inline-block py-1 transition-colors hover:text-chalk">
            {c.nav[1].label}
          </LocaleLink>
          <LocaleLink href="/locations" className="inline-block py-1 transition-colors hover:text-chalk">
            {c.nav[2].label}
          </LocaleLink>
          <LocaleLink href="/about" className="inline-block py-1 transition-colors hover:text-chalk">
            {c.nav[3].label}
          </LocaleLink>
          <LocaleLink href="/contact" className="inline-block py-1 transition-colors hover:text-chalk">
            {c.nav[4].label}
          </LocaleLink>
          <LocaleLink href="/booking" className="inline-block py-1 transition-colors hover:text-chalk">
            {c.common.book}
          </LocaleLink>
          <LocaleLink href="/legal/imprint" className="inline-block py-1 transition-colors hover:text-chalk">
            {f.legalNotice}
          </LocaleLink>
          <LocaleLink href="/legal/privacy" className="inline-block py-1 transition-colors hover:text-chalk">
            {f.privacy}
          </LocaleLink>
          <LocaleLink href="/legal/terms" className="inline-block py-1 transition-colors hover:text-chalk">
            {f.terms}
          </LocaleLink>
        </nav>

        <div className="mt-6 flex flex-col items-start justify-between gap-4 font-mono text-xs tracking-wider text-fog md:flex-row md:items-center">
          <span>
            © {year} {SITE.legal} — {f.rights}
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent-2" />
            {f.availability}
          </span>
        </div>
      </div>
    </footer>
  );
}
