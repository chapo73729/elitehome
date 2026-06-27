import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signal lost — 404",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-void px-6 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-[120px]"
      />
      <div className="relative">
        <span className="eyebrow">Error · Signal lost</span>
        <h1 className="text-mega text-gradient mt-6 select-none">404</h1>
        <p className="mx-auto mt-6 max-w-sm text-balance text-mist">
          This coordinate lies beyond the mapped network. The page you seek was
          never charted — or has since dissolved into the void.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-chalk px-7 py-3.5 text-sm font-medium text-void transition-transform duration-300 hover:scale-[1.03]"
        >
          Return to ARDLABS <span aria-hidden>→</span>
        </Link>
      </div>
    </main>
  );
}
