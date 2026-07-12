"use client";

/**
 * The persistent base layer behind the entire site — the night the whole
 * experience drives through. A near-black ground with slow drifts of warm
 * champagne and cool platinum light, like street lamps and city glow moving
 * past tinted glass. CSS-only: buttery, free, and static under reduced
 * motion (the drift animations are neutralised in globals.css).
 */
export function AmbientBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-void"
    >
      {/* deep base wash — a warm tilt away from flat black */}
      <div className="absolute inset-0 [background:radial-gradient(120%_85%_at_50%_-10%,rgba(56,46,28,0.48),transparent_62%),radial-gradient(100%_70%_at_50%_110%,rgba(40,34,22,0.40),transparent_62%)]" />

      {/* slow-drifting light — champagne street glow + platinum moonlight */}
      <div className="absolute left-[12%] top-[6%] h-[62vmax] w-[62vmax] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl [animation:aurora1_36s_ease-in-out_infinite] [background:radial-gradient(closest-side,rgba(198,161,91,0.16),transparent_70%)]" />
      <div className="absolute right-[6%] top-[58%] h-[58vmax] w-[58vmax] translate-x-1/4 rounded-full blur-3xl [animation:aurora2_46s_ease-in-out_infinite] [background:radial-gradient(closest-side,rgba(199,203,209,0.09),transparent_70%)]" />
      <div className="absolute left-[44%] top-[42%] h-[52vmax] w-[52vmax] -translate-x-1/2 rounded-full blur-3xl [animation:aurora3_54s_ease-in-out_infinite] [background:radial-gradient(closest-side,rgba(228,200,138,0.08),transparent_70%)]" />

      {/* settle the edges into pure void so content stays legible */}
      <div className="absolute inset-0 [background:radial-gradient(130%_90%_at_50%_30%,transparent_45%,rgba(5,5,5,0.7))]" />
    </div>
  );
}
