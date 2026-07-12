/**
 * Mercedes-Benz three-pointed star — a faithful flat vector (ring + three
 * tapered arms) used to mark the marque of each vehicle in the fleet.
 * Nominative use: it identifies the make of the cars we drive. Inherits
 * `currentColor` so it reads platinum in the cards and ivory on hover.
 */
export function MercedesStar({
  size = 28,
  className,
  title = "Mercedes-Benz",
}: {
  size?: number;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      role="img"
      aria-label={title}
      className={className}
    >
      <circle cx="32" cy="32" r="29" stroke="currentColor" strokeWidth="2.6" />
      {/* three tapered arms, 120° apart */}
      <g fill="currentColor">
        <path d="M32 4.6 L35.4 30.2 L32 32 L28.6 30.2 Z" />
        <path d="M32 4.6 L35.4 30.2 L32 32 L28.6 30.2 Z" transform="rotate(120 32 32)" />
        <path d="M32 4.6 L35.4 30.2 L32 32 L28.6 30.2 Z" transform="rotate(240 32 32)" />
      </g>
    </svg>
  );
}
