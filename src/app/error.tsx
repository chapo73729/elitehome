"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
        <span className="eyebrow">System anomaly</span>
        <h1 className="text-giant text-gradient mt-6 select-none">Signal interrupted.</h1>
        <p className="mx-auto mt-6 max-w-md text-balance text-mist">
          An unexpected error disrupted this view. The lab is stable — please try
          again.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={reset}
            className="rounded-full bg-chalk px-7 py-3.5 text-sm font-medium text-void transition-transform duration-300 hover:scale-[1.03]"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full hairline px-7 py-3.5 text-sm text-chalk transition-colors hover:border-white/25"
          >
            Return home
          </Link>
        </div>
      </div>
    </main>
  );
}
