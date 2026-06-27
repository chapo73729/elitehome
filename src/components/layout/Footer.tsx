"use client";

import { NAV, SITE } from "@/lib/site";
import { scrollToTarget } from "./SmoothScroll";

export function Footer() {
  const year = 2026;
  return (
    <footer className="relative z-10 hairline-t bg-void">
      <div className="container-x py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="font-display text-4xl font-bold tracking-tight">
              {SITE.name}
              <span className="text-accent">®</span>
            </div>
            <p className="mt-4 max-w-sm text-mist">
              Private ventures engineering the next century of intelligence,
              software and physical infrastructure.
            </p>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <div className="eyebrow mb-5">Index</div>
            <ul className="space-y-3">
              {NAV.map((n) => (
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

          <div className="md:col-span-3">
            <div className="eyebrow mb-5">Contact</div>
            <a
              href={`mailto:${SITE.email}`}
              className="link-underline text-mist transition-colors hover:text-chalk"
            >
              {SITE.email}
            </a>
            <p className="mt-6 text-sm text-fog">
              Prague · Geneva · Singapore
              <br />
              Dubai · Tokyo · New York
            </p>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-4 hairline-t pt-8 font-mono text-xs tracking-wider text-fog md:flex-row md:items-center">
          <span>
            © {year} {SITE.legal} — All rights reserved.
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent-2" />
            All systems operational
          </span>
        </div>
      </div>
    </footer>
  );
}
