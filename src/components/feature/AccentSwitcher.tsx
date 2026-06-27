"use client";

import { useEffect, useState } from "react";
import { ACCENTS, applyAccent, onAccent } from "@/lib/accent";

export function AccentSwitcher() {
  const [active, setActive] = useState("quantum");
  useEffect(() => onAccent(setActive), []);

  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs tracking-widest text-fog">ACCENT</span>
      <div className="flex items-center gap-2">
        {ACCENTS.map((a) => (
          <button
            key={a.id}
            onClick={() => applyAccent(a.id)}
            data-cursor
            aria-label={a.name}
            aria-pressed={active === a.id}
            title={a.name}
            className={`h-4 w-4 rounded-full transition-transform duration-300 hover:scale-125 ${
              active === a.id ? "ring-2 ring-white/70 ring-offset-2 ring-offset-void" : ""
            }`}
            style={{ background: `linear-gradient(135deg, ${a.a}, ${a.a2})` }}
          />
        ))}
      </div>
    </div>
  );
}
