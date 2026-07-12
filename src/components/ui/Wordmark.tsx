/* eslint-disable @next/next/no-img-element */
/**
 * The official BLACKFIRST wordmark — the real logotype supplied by the house
 * (chromed capitals on transparency, cut from the brand master). Used in the
 * chrome (Navbar, Footer, Loader) and at display scale in the hero.
 * Intrinsic ratio 1800×160 (11.25:1); size via className (h-* w-auto).
 */
export function Wordmark({
  className,
  alt = "BLACKFIRST",
  priority = false,
}: {
  className?: string;
  alt?: string;
  priority?: boolean;
}) {
  return (
    <img
      src="/brand/wordmark.png"
      alt={alt}
      width={1800}
      height={160}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={className}
      draggable={false}
    />
  );
}
