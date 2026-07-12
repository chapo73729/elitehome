/**
 * BLACKFIRST brandmark — the single source of truth for the emblem in the UI
 * chrome (Navbar, Footer, loader). A fine crest with an alpine ascent: the
 * diamond frame and baseline inherit `currentColor` (ivory in the chrome); the
 * ascent stroke and its apex node carry the champagne accent. Mirrors
 * src/app/icon.svg so the tab favicon and the on-page logo match.
 */
export function Brandmark({
  size = 28,
  className,
  title = "BLACKFIRST",
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
      {/* enclosing diamond — the crest */}
      <path
        d="M32 6 L58 32 L32 58 L6 32 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinejoin="round"
        opacity={0.5}
      />
      {/* the ascent — a champagne peak */}
      <path
        d="M18 42 L32 20 L46 42"
        fill="none"
        stroke="var(--color-accent, #c6a15b)"
        strokeWidth={3.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* baseline — the road */}
      <path
        d="M20 42 H44"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      {/* apex node */}
      <circle cx="32" cy="20" r="2.4" fill="var(--color-accent, #c6a15b)" />
    </svg>
  );
}
