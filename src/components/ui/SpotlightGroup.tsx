"use client";

import { type ReactNode, useRef } from "react";

/**
 * Pointer-tracked spotlight for card grids. One delegated listener on the
 * group writes --mx/--my custom properties onto the hovered .spot-card;
 * the highlight itself is pure CSS (globals.css). rAF-coalesced so fast
 * pointer movement costs at most one style write per frame.
 */
export function SpotlightGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const frame = useRef(0);

  const onPointerMove = (e: React.PointerEvent) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>(".spot-card");
    if (!card) return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${clientX - r.left}px`);
      card.style.setProperty("--my", `${clientY - r.top}px`);
    });
  };

  return (
    <div className={className} onPointerMove={onPointerMove}>
      {children}
    </div>
  );
}
