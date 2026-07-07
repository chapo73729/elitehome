"use client";

import { usePathname } from "next/navigation";
import { LocaleLink } from "@/components/ui/LocaleLink";
import { Brandmark } from "@/components/ui/Brandmark";
import { SITE } from "@/lib/site";
import { useContent } from "@/lib/content";
import { scrollToTarget } from "./SmoothScroll";
import { AccentSwitcher } from "@/components/feature/AccentSwitcher";
import { copyText, toast } from "@/lib/toast";
import { useLang } from "@/lib/lang";
import { useLocaleRouter } from "@/hooks/useLocaleRouter";
import { stripLocale } from "@/lib/i18n";

const T = {
  en: {
    cities: "Prague · Geneva · Singapore",
    cities2: "Dubai · Tokyo · New York",
    sitemap: "Sitemap",
    about: "About",
    work: "Work",
    approach: "Approach",
    careers: "Careers",
    contact: "Contact",
  },
  fr: {
    cities: "Prague · Genève · Singapour",
    cities2: "Dubaï · Tokyo · New York",
    sitemap: "Plan du site",
    about: "À propos",
    work: "Réalisations",
    approach: "Approche",
    careers: "Carrières",
    contact: "Contact",
  },
} as const;

/** [01]-style register mark — the homepage's numbered index idiom. */
const num = (i: number) => `[${String(i + 1).padStart(2, "0")}]`;

export function Footer() {
  const year = 2026;
  const c = useContent();
  const f = c.footer;
  const t = T[useLang()];
  const pathname = usePathname();
  const router = useLocaleRouter();
  const isHome = stripLocale(pathname).rest === "/";

  // same rule as the header nav: the [0x] registers point at homepage
  // anchors, so off the homepage they must navigate home first —
  // scrollToTarget alone silently no-ops on a selector that isn't there
  const goRegister = (href: string) => {
    if (href.startsWith("#") && !isHome) {
      router.push("/" + href);
      return;
    }
    scrollToTarget(href);
  };
  return (
    <footer className="relative z-10 hairline-t bg-void">
      <div className="container-x pb-14 pt-20 md:pb-16 md:pt-28">
        {/* editorial masthead — the studio signs off at display scale */}
        <Brandmark size={44} className="mb-6 text-chalk" />
        <p className="text-giant select-none">
          <span className="text-gradient">{SITE.name}</span>
          <span className="text-accent">®</span>
        </p>
        <p className="mt-6 max-w-md text-mist md:text-lg">{f.tagline}</p>

        {/* index + contact — hairline-ruled mono registers */}
        <div className="mt-16 grid gap-14 md:mt-24 md:grid-cols-12 md:gap-10">
          <nav aria-label={f.index} className="md:col-span-6 lg:col-span-5">
            <div className="eyebrow mb-6">{f.index}</div>
            <ul>
              {c.nav.map((n, i) => (
                <li key={n.href} className="hairline-t">
                  <button
                    onClick={() => goRegister(n.href)}
                    className="group flex w-full items-baseline gap-5 py-3 text-left"
                  >
                    <span className="font-mono text-xs text-accent tabular-nums">
                      {num(i)}
                    </span>
                    <span className="font-mono text-sm tracking-wider text-mist transition-colors group-hover:text-chalk">
                      {n.label}
                    </span>
                    <span
                      aria-hidden
                      className="ml-auto font-mono text-xs text-fog opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      →
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

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
                  <span className="font-mono text-xs text-accent tabular-nums">
                    {num(c.nav.length)}
                  </span>
                  <span className="font-mono text-sm tracking-wider text-mist transition-colors group-hover:text-chalk">
                    {SITE.email}
                  </span>
                </button>
              </li>
              <li className="hairline-t flex items-baseline gap-5 py-3">
                <span
                  aria-hidden
                  className="font-mono text-xs text-accent tabular-nums"
                >
                  {num(c.nav.length + 1)}
                </span>
                <span className="font-mono text-sm tracking-wider text-fog">
                  {t.cities}
                </span>
              </li>
              <li className="hairline-t flex items-baseline gap-5 py-3">
                <span
                  aria-hidden
                  className="font-mono text-xs text-accent tabular-nums"
                >
                  {num(c.nav.length + 2)}
                </span>
                <span className="font-mono text-sm tracking-wider text-fog">
                  {t.cities2}
                </span>
              </li>
            </ul>
            <div className="mt-10">
              <AccentSwitcher />
            </div>
          </div>
        </div>

        <nav
          aria-label={t.sitemap}
          className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-2 hairline-t pt-8 font-mono text-xs tracking-wider text-fog md:mt-24"
        >
          <LocaleLink href="/about" className="inline-block py-1 transition-colors hover:text-chalk">
            {t.about}
          </LocaleLink>
          <LocaleLink href="/work" className="inline-block py-1 transition-colors hover:text-chalk">
            {t.work}
          </LocaleLink>
          <LocaleLink href="/approach" className="inline-block py-1 transition-colors hover:text-chalk">
            {t.approach}
          </LocaleLink>
          <LocaleLink href="/careers" className="inline-block py-1 transition-colors hover:text-chalk">
            {t.careers}
          </LocaleLink>
          <LocaleLink href="/contact" className="inline-block py-1 transition-colors hover:text-chalk">
            {t.contact}
          </LocaleLink>
          <LocaleLink href="/insights" className="inline-block py-1 transition-colors hover:text-chalk">
            {f.insights ?? "Insights"}
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
          <span className="flex items-center gap-4">
            <span className="hidden items-center gap-1.5 sm:flex">
              {f.press}
              <kbd className="rounded border border-white/15 px-1.5 py-0.5 text-[0.65rem] text-mist">
                ⌘K
              </kbd>
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent-2" />
              {f.allSystems}
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
}
