/**
 * ARDLABS brandmark — the single source of truth for the logo glyph in the UI
 * chrome (Navbar, Footer, preloader). The "A" inherits `currentColor`; the
 * engineering-trace crossbar + node carry the azure accent. Mirrors the icon
 * assets in src/app/icon.svg so the tab favicon and the on-page logo match.
 */
export function Brandmark({
  size = 28,
  className,
  title = "ARDLABS",
}: {
  size?: number;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label={title}
      className={className}
    >
      <path
        d="M18 48 L32 15 L46 48"
        fill="none"
        stroke="currentColor"
        strokeWidth={4.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24.2 34.5 H42.5"
        fill="none"
        stroke="var(--color-accent, #4F8CFF)"
        strokeWidth={4}
        strokeLinecap="round"
      />
      <circle cx="46" cy="34.5" r="2.5" fill="var(--color-accent, #4F8CFF)" />
    </svg>
  );
}
