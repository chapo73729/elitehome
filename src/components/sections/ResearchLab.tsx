"use client";

import dynamic from "next/dynamic";
import { Reveal } from "@/components/ui/Reveal";
import { SceneBoundary } from "@/components/three/SceneBoundary";
import { useSceneVisibility } from "@/hooks/useSceneVisibility";

const Lab = dynamic(() => import("@/components/three/ResearchLab"), {
  ssr: false,
  loading: () => null,
});

const READOUTS = [
  { k: "STATUS", v: "Operational" },
  { k: "ENTITIES", v: "Holographic" },
  { k: "ACCESS", v: "Restricted" },
];

export function ResearchLab() {
  const scene = useSceneVisibility<HTMLDivElement>();
  return (
    <section
      id="research"
      className="relative z-10 min-h-[100svh] overflow-hidden bg-void py-28 md:py-36"
    >
      <div ref={scene.ref} className="absolute inset-0">
        <SceneBoundary>
          {scene.mounted && <Lab frameloop={scene.frameloop} />}
        </SceneBoundary>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_70%_at_50%_50%,transparent_35%,#050505_92%)]" />

      <div className="container-x relative z-10 flex min-h-[80svh] flex-col justify-between">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-accent">10</span>
            <span className="eyebrow">Research Lab</span>
          </div>
        </Reveal>

        <div className="max-w-xl">
          <Reveal delay={0.08}>
            <h2 className="text-section-title text-gradient text-balance">
              Step inside the apparatus.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-md text-balance text-mist">
              Floating instruments, holographic readouts and a self-rotating
              core — a working model of how intelligence, data and matter
              converge under one roof.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 font-mono text-xs">
              {READOUTS.map((r) => (
                <div key={r.k}>
                  <div className="text-fog">{r.k}</div>
                  <div className="mt-1 text-accent-2">{r.v}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
