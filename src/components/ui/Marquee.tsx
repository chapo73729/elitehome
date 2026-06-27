"use client";

export function Marquee({
  items,
  className,
}: {
  items: readonly string[];
  className?: string;
}) {
  const sequence = [...items, ...items];
  return (
    <div
      className={`group relative flex overflow-hidden ${className ?? ""}`}
      aria-hidden
    >
      <div className="marquee-track group-hover:[animation-play-state:paused]">
        {sequence.map((item, i) => (
          <span key={i} className="mx-8 flex items-center gap-8">
            <span className="text-section-title text-gradient opacity-90">
              {item}
            </span>
            <span className="text-accent/70 text-2xl">✳</span>
          </span>
        ))}
      </div>
    </div>
  );
}
