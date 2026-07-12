"use client";

import { LocaleLink } from "@/components/ui/LocaleLink";
import { useLang } from "@/lib/lang";

const T = {
  en: {
    eyebrow: "Page not found",
    body: "This address does not exist — the page you are looking for has moved, or was never on our route. Allow us to drive you back.",
    home: "Return to BLACKFIRST",
  },
  fr: {
    eyebrow: "Page introuvable",
    body: "Cette adresse n'existe pas — la page que vous cherchez a été déplacée, ou n'a jamais figuré sur notre itinéraire. Laissez-nous vous raccompagner.",
    home: "Retour vers BLACKFIRST",
  },
};

export function NotFoundView() {
  const t = T[useLang()];

  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-void px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]"
      />

      <div className="relative w-full max-w-xl py-6 text-center">
        <span className="eyebrow">{t.eyebrow}</span>
        <h1 className="text-mega text-gradient mt-6 select-none">404</h1>
        <span
          aria-hidden
          className="mx-auto mt-8 block h-px w-36 bg-gradient-to-r from-transparent via-accent to-transparent"
        />
        <p className="mx-auto mt-8 max-w-sm text-balance text-mist">{t.body}</p>
        <LocaleLink
          href="/"
          data-cursor
          className="group mt-10 inline-flex items-baseline gap-3 text-accent transition-colors hover:text-chalk"
        >
          <span
            aria-hidden
            className="font-mono text-xs uppercase tracking-[0.3em] transition-transform duration-500 group-hover:translate-x-1"
          >
            →
          </span>
          <span className="font-display text-2xl">{t.home}</span>
        </LocaleLink>
      </div>
    </main>
  );
}
