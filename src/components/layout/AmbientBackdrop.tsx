"use client";

/**
 * The persistent base layer behind the entire site. It is the void floor that
 * sits *under* the WebGL Atmosphere canvas — a rich, layered azure gradient so
 * every section floats in one continuous world rather than stacking as separate
 * black blocks. CSS-only: buttery, free, and the full fallback when the canvas
 * is disabled (lite tier / reduced motion / perf mode), where it carries the
 * whole atmosphere on its own.
 *
 * Under reduced-motion the drift animations are neutralised by globals.css, so
 * this resolves to a static, still-rich gradient.
 */
export function AmbientBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-void"
    >
      {/* deep base wash — a faint azure tilt away from flat black */}
      <div className="absolute inset-0 [background:radial-gradient(120%_85%_at_50%_-10%,rgba(23,42,92,0.30),transparent_60%),radial-gradient(100%_70%_at_50%_110%,rgba(16,30,70,0.22),transparent_60%)]" />

      {/* slow-drifting aurora blobs — layered light in the deep */}
      <div className="absolute left-[12%] top-[6%] h-[62vmax] w-[62vmax] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl [animation:aurora1_36s_ease-in-out_infinite] [background:radial-gradient(closest-side,rgba(79,140,255,0.15),transparent_70%)]" />
      <div className="absolute right-[6%] top-[58%] h-[58vmax] w-[58vmax] translate-x-1/4 rounded-full blur-3xl [animation:aurora2_46s_ease-in-out_infinite] [background:radial-gradient(closest-side,rgba(107,157,255,0.10),transparent_70%)]" />
      <div className="absolute left-[44%] top-[42%] h-[52vmax] w-[52vmax] -translate-x-1/2 rounded-full blur-3xl [animation:aurora3_54s_ease-in-out_infinite] [background:radial-gradient(closest-side,rgba(61,111,224,0.09),transparent_70%)]" />

      {/* settle the edges into pure void so content stays legible */}
      <div className="absolute inset-0 [background:radial-gradient(130%_90%_at_50%_30%,transparent_45%,rgba(5,5,5,0.7))]" />
    </div>
  );
}
