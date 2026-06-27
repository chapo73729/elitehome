"use client";

import dynamic from "next/dynamic";
import { Reveal } from "@/components/ui/Reveal";
import { SceneBoundary } from "@/components/three/SceneBoundary";
import { useSceneVisibility } from "@/hooks/useSceneVisibility";

const NeuralCore = dynamic(() => import("@/components/three/NeuralCore"), {
  ssr: false,
  loading: () => null,
});

const POINTS = [
  { k: "Reasoning", v: "Autonomous agents that plan, act and self-correct." },
  { k: "Scale", v: "GPU clusters orchestrated for frontier-model training." },
  { k: "Deployment", v: "Inference engineered for production, not demos." },
];

export function AICore() {
  const scene = useSceneVisibility<HTMLDivElement>();
  return (
    <section
      id="core"
      className="relative z-10 min-h-[100svh] overflow-hidden bg-void py-28 md:py-36"
    >
      {/* full-bleed neural field */}
      <div ref={scene.ref} className="absolute inset-0">
        <SceneBoundary>
          {scene.mounted && <NeuralCore frameloop={scene.frameloop} />}
        </SceneBoundary>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_50%,transparent_30%,#050505_85%)]" />

      <div className="container-x relative z-10 flex min-h-[80svh] flex-col justify-center">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-accent">02</span>
            <span className="eyebrow">Interactive AI Core</span>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="text-section-title text-gradient mt-7 max-w-3xl text-balance">
            A living intelligence, wired from first principles.
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-6 max-w-md text-balance text-mist">
            Thousands of neurons firing in real time. Move your cursor — the
            lattice responds, the way our systems respond to the world.
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
