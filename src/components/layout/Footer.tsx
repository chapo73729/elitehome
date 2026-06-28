"use client";

import Link from "next/link";
import { SITE } from "@/lib/site";
import { useContent } from "@/lib/content";
import { scrollToTarget } from "./SmoothScroll";
import { AccentSwitcher } from "@/components/feature/AccentSwitcher";
import { copyText, toast } from "@/lib/toast";

export function Footer() {
  const year = 2026;
  const c = useContent();
  const f = c.footer;
  return (
    <footer className="relative z-10 hairline-t bg-void">
      <div className="container-x py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              {SITE.name}
              <span className="text-accent">®</span>
            </div>
            <p className="mt-4 max-w-sm text-mist">{f.tagline}</p>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <div className="eyebrow mb-5">{f.index}</div>
            <ul className="space-y-3">
              {c.nav.map((n) => (
                <li key={n.href}>
                  <button
                    onClick={() => scrollToTarget(n.href)}
                    className="link-underline text-mist transition-colors hover:text-chalk"
                  >
                    {n.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 md:col-start-10">
            <div className="eyebrow mb-5">{f.contact}</div>
            <button
              onClick={async () => {
                if (await copyText(SITE.email)) toast(f.copied, "✓");
              }}
              data-cursor
              className="link-underline text-left text-mist transition-colors hover:text-chalk"
              title={f.copyHint}
            >
              {SITE.email}
            </button>
            <p className="mt-6 text-sm text-fog">
              Prague · Geneva · Singapore
              <br />
              Dubai · Tokyo · New York
            </p>
            <div className="mt-8">
              <AccentSwitcher />
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-2 hairline-t pt-8 font-mono text-xs tracking-wider text-fog">
          <Link href="/about" className="transition-colors hover:text-chalk">
            About
          </Link>
          <Link href="/work" className="transition-colors hover:text-chalk">
            Work
          </Link>
          <Link href="/approach" className="transition-colors hover:text-chalk">
            Approach
          </Link>
          <Link href="/careers" className="transition-colors hover:text-chalk">
            Careers
          </Link>
          <Link href="/contact" className="transition-colors hover:text-chalk">
            Contact
          </Link>
          <Link href="/insights" className="transition-colors hover:text-chalk">
            {f.insights ?? "Insights"}
          </Link>
          <Link href="/legal/imprint" className="transition-colors hover:text-chalk">
            {f.legalNotice}
          </Link>
          <Link href="/legal/privacy" className="transition-colors hover:text-chalk">
            {f.privacy}
          </Link>
          <Link href="/legal/terms" className="transition-colors hover:text-chalk">
            {f.terms}
          </Link>
        </div>

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
