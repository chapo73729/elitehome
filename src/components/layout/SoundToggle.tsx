"use client";

import { useEffect, useState } from "react";
import { audio } from "@/lib/audio";

/** Animated speaker/equalizer toggle for the synthesized sound design. */
export function SoundToggle({ className }: { className?: string }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const unsub = audio.subscribe(setOn);
    return () => {
      unsub();
    };
  }, []);

  return (
    <button
      onClick={() => audio.toggle()}
      aria-pressed={on}
      aria-label={on ? "Mute sound" : "Enable sound"}
      title={on ? "Sound on" : "Sound off"}
      data-cursor
      className={`flex h-9 items-center gap-[3px] rounded-full px-3 transition-colors duration-300 ${
        on ? "text-accent-2" : "text-fog hover:text-chalk"
      } ${className ?? ""}`}
    >
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="block w-[2px] rounded-full bg-current"
          style={{
            height: on ? undefined : 4,
            animation: on
              ? `eq 0.9s ${i * 0.12}s ease-in-out infinite alternate`
              : "none",
          }}
        />
      ))}
      <style jsx>{`
        span {
          height: 5px;
        }
        @keyframes eq {
          from {
            height: 4px;
          }
          to {
            height: 15px;
          }
        }
      `}</style>
    </button>
  );
}
