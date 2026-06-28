"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/lib/lang";

const T = {
  en: {
    eyebrow: "System anomaly",
    h1: "Signal interrupted.",
    body: "An unexpected error disrupted this view. The system is stable — please try again.",
    retry: "Try again",
    home: "Return home",
  },
  fr: {
    eyebrow: "Anomalie système",
    h1: "Signal interrompu.",
    body: "Une erreur inattendue a perturbé cet affichage. Le système est stable — veuillez réessayer.",
    retry: "Réessayer",
    home: "Retour à l'accueil",
  },
};

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = T[useLang()];

  useEffect(() => {
    // hook for error reporting if/when analytics is wired
  }, [error]);

  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-void px-6 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[55vh] w-[55vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-3/15 blur-[130px]"
      />
      <div className="relative">
        <span className="eyebrow">{t.eyebrow}</span>
        <h1 className="text-giant text-gradient mt-6 select-none">{t.h1}</h1>
        <p className="mx-auto mt-6 max-w-md text-balance text-mist">
          {t.body}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={reset}
            className="rounded-full bg-chalk px-7 py-3.5 text-sm font-medium text-void transition-transform duration-300 hover:scale-[1.03]"
          >
            {t.retry}
          </button>
          <Link
            href="/"
            className="rounded-full hairline px-7 py-3.5 text-sm text-chalk transition-colors hover:border-white/25"
          >
            {t.home}
          </Link>
        </div>
      </div>
    </main>
  );
}
