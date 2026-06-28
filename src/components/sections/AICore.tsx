"use client";

import dynamic from "next/dynamic";
import { Reveal } from "@/components/ui/Reveal";
import { SceneBoundary } from "@/components/three/SceneBoundary";
import { useSceneVisibility } from "@/hooks/useSceneVisibility";
import { useContent } from "@/lib/content";

const NeuralFlow = dynamic(() => import("@/components/three/NeuralFlow"), {
  ssr: false,
  loading: () => null,
});

export function AICore() {
  const scene = useSceneVisibility<HTMLDivElement>();
  const c = useContent().core;
  const POINTS = c.points;
  return (
    <section
      id="core"
      className="relative z-10 min-h-[100svh] overflow-hidden py-28 md:py-36"
    >
      {/* full-bleed neural field */}
      <div ref={scene.ref} className="absolute inset-0">
        <SceneBoundary>
          {scene.mounted && <NeuralFlow frameloop={scene.frameloop} />}
        </SceneBoundary>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_50%,transparent_30%,#050505_85%)]" />

      <div className="container-x relative z-10 flex min-h-[80svh] flex-col justify-center">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-accent">01</span>
            <span className="eyebrow">{c.eyebrow}</span>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="text-section-title text-gradient mt-7 max-w-3xl text-balance">
            {c.title}
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-6 max-w-md text-balance text-mist">
            {c.intro}
          </p>
        </Reveal>

        <div className="mt-16 grid max-w-3xl gap-px overflow-hidden rounded-2xl hairline sm:grid-cols-3">
          {POINTS.map((p, i) => (
            <Reveal key={p.k} delay={0.1 + i * 0.08}>
              <div className="glass h-full p-6">
                <div className="font-mono text-xs uppercase tracking-widest text-accent-2">
                  {p.k}
                </div>
                <p className="mt-3 text-sm text-mist">{p.v}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
