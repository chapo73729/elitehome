import { LocaleLink } from "@/components/ui/LocaleLink";
import type { ReactNode } from "react";

export function LegalPage({
  title,
  updated,
  children,
  homeLabel = "← Home",
  updatedLabel = "Last updated",
}: {
  title: string;
  updated: string;
  children: ReactNode;
  homeLabel?: string;
  updatedLabel?: string;
}) {
  return (
    <main className="relative">
      <section className="relative overflow-hidden pb-10 pt-40">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[45vh] w-[45vh] -translate-x-1/2 rounded-full bg-accent/12 blur-[140px]" />
        <div className="container-x relative max-w-3xl">
          <LocaleLink href="/" className="link-underline font-mono text-xs tracking-widest text-mist">
            {homeLabel}
          </LocaleLink>
          <h1 className="text-giant text-gradient mt-8 text-balance">{title}</h1>
          <p className="mt-4 font-mono text-xs tracking-widest text-fog">
            {updatedLabel} · {updated}
          </p>
        </div>
      </section>

      <section className="relative z-10 bg-void pb-32">
        <div className="container-x max-w-3xl space-y-10 text-mist [&_a]:text-chalk [&_a]:underline [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-chalk [&_p]:leading-relaxed [&_li]:leading-relaxed">
          {children}
        </div>
      </section>
    </main>
  );
}

/** Marks placeholder text the operator must complete before going live. */
export function Fill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded bg-accent/15 px-1.5 py-0.5 font-mono text-[0.85em] text-accent-2">
      {children}
    </span>
  );
}
