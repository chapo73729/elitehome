"use client";

import { Reveal } from "@/components/ui/Reveal";
import { CanvasMotif } from "@/components/ui/CanvasMotif";

const CAPS = [
  {
    n: "05",
    tag: "Artificial Intelligence",
    title: "A facility for thinking machines.",
    text: "Server halls, holographic readouts and floating code. Neural networks visualised at GPU scale — intelligence you can watch reason.",
    variant: "ai" as const,
    chips: ["Neural networks", "GPU clusters", "Inference"],
  },
  {
    n: "06",
    tag: "Software",
    title: "Code that compiles the future.",
    text: "Streaming pipelines, floating windows, live compilations. Algorithms rendered in real time — every commit a moving part of a larger machine.",
    variant: "code" as const,
    chips: ["Real-time systems", "Distributed runtime", "Edge"],
  },
  {
    n: "07",
    tag: "Industrial",
    title: "Where atoms meet algorithms.",
    text: "Robotic arms, instrumented factories, metal and sparks. Precision manufacturing governed by the same intelligence that runs our software.",
    variant: "industrial" as const,
    chips: ["Robotics", "Precision", "Telemetry"],
  },
  {
    n: "08",
    tag: "Maritime Operations",
    title: "An ocean, read like a dataset.",
    text: "Simulated seas, cargo routes, radar and GPS. Fleet intelligence that turns the unpredictable ocean into an optimised, navigable system.",
    variant: "ocean" as const,
    chips: ["Fleet AI", "Routing", "Logistics"],
  },
];

export function Capabilities() {
  return (
    <section id="lab" className="relative z-10 scroll-mt-24 bg-void">
      {CAPS.map((c, i) => (
        <div
          key={c.n}
          className="container-x grid items-center gap-10 border-t border-white/5 py-24 md:py-32 lg:grid-cols-2"
        >
          {/* visual */}
          <div
            className={`relative order-1 h-[44vh] min-h-[300px] overflow-hidden rounded-3xl hairline bg-ink ${
              i % 2 === 1 ? "lg:order-2" : ""
            }`}
          >
            <CanvasMotif variant={c.variant} className="absolute inset-0 h-full w-full" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_80%_at_50%_50%,transparent_40%,#050505_95%)]" />
            <span className="absolute bottom-5 left-6 font-mono text-[0.65rem] tracking-[0.3em] text-fog">
              {c.tag.toUpperCase()}
            </span>
          </div>

          {/* copy */}
          <div className={`order-2 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-accent">{c.n}</span>
                <span className="eyebrow">{c.tag}</span>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <h3 className="text-section-title text-gradient mt-6 max-w-md text-balance">
                {c.title}
              </h3>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-md text-balance text-mist">{c.text}</p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-wrap gap-2">
                {c.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full hairline px-4 py-1.5 font-mono text-xs text-mist"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      ))}
    </section>
  );
}
