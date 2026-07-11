"use client";

/**
 * Letter-roll hover: two copies of the label stacked inside an
 * overflow-hidden line; on hover (of the nearest `.group`) each column
 * slides up one em, letters cascading left to right. Compositor-only.
 * Decorative — callers keep the accessible name on the interactive parent.
 */
export function RollingText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span aria-hidden className={`inline-flex overflow-hidden ${className ?? ""}`}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className="relative inline-block transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-full"
          style={{ transitionDelay: `${Math.min(i * 18, 400)}ms` }}
        >
          <span className="block">{ch === " " ? " " : ch}</span>
          <span className="absolute left-0 top-full block text-accent-2">
            {ch === " " ? " " : ch}
          </span>
        </span>
      ))}
    </span>
  );
}
