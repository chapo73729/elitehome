import clsx from "clsx";

/**
 * Oversized "ghost" chapter numeral that bleeds off the top-left, sitting
 * behind a section's content but above its background. Pure typography — a
 * compositor's chapter mark, the only ornament a section gets. The optional
 * mono label hangs beside the numeral as a register mark.
 */
export function ChapterNumeral({
  n,
  label,
  className,
}: {
  n: string;
  label?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={clsx(
        "pointer-events-none absolute left-0 top-0 z-0 select-none",
        "-translate-x-[0.06em] -translate-y-[0.32em]",
        className
      )}
    >
      <span
        className="text-mega block font-display leading-none"
        style={{
          color: "color-mix(in oklab, var(--color-accent) 14%, transparent)",
        }}
      >
        {n}
      </span>
      {label && (
        <span className="ml-[0.12em] block font-mono text-[0.6rem] uppercase tracking-[0.42em] text-fog/60">
          {label}
        </span>
      )}
    </div>
  );
}
