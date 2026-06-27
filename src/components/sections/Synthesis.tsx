"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SceneBoundary } from "@/components/three/SceneBoundary";
import { useSceneVisibility } from "@/hooks/useSceneVisibility";
import { useContent } from "@/lib/content";

const MorphCloud = dynamic(() => import("@/components/three/MorphCloud"), {
  ssr: false,
  loading: () => null,
});

export function Synthesis() {
  const c = useContent().synthesis;
  const shapes = c.shapes;
  const scene = useSceneVisibility<HTMLDivElement>();
  const target = useRef(0);
  const [idx, setIdx] = useState(0);

  function cycle(next?: number) {
    const n = next ?? (idx + 1) % shapes.length;
    target.current = n;
    setIdx(n);
  }

  return (
    <section
      id="synthesis"
      className="relative z-10 overflow-hidden bg-void py-28 md:py-36"
    >
      <div className="container-x">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-accent">07</span>
            <span className="eyebrow">{c.eyebrow}</span>
            <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="text-section-title text-gradient mt-8 max-w-2xl text-balance">
            {c.title}
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-6 max-w-md text-balance text-mist">{c.intro}</p>
        </Reveal>
      </div>

      {/* interactive canvas */}
      <div
        ref={scene.ref}
        onClick={() => cycle()}
        className="group relative mt-12 h-[62vh] min-h-[460px] w-full cursor-pointer"
        role="button"
        tabIndex={0}
        aria-label={c.hint}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            cycle();
          }
        }}
      >
        <SceneBoundary>
          {scene.mounted && (
            <MorphCloud target={target} frameloop={scene.frameloop} />
          )}
        </SceneBoundary>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_75%_at_50%_50%,transparent_45%,#050505_92%)]" />

        {/* hint */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[0.7rem] uppercase tracking-[0.3em] text-fog opacity-70 transition-opacity group-hover:opacity-100">
          {c.hint}
        </div>
      </div>

      {/* shape selector */}
      <div className="container-x mt-8">
        <div className="flex flex-wrap justify-center gap-2">
          {shapes.map((s, i) => (
            <button
              key={s}
              onClick={() => cycle(i)}
              data-cursor
              className={`rounded-full border px-4 py-2 font-mono text-xs tracking-widest transition-all duration-300 ${
                idx === i
                  ? "border-accent/60 bg-accent/15 text-chalk"
                  : "border-white/12 text-fog hover:border-white/30 hover:text-mist"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
