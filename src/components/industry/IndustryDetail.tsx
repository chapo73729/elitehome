"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { CanvasMotif } from "@/components/ui/CanvasMotif";
import { SceneBoundary } from "@/components/three/SceneBoundary";
import { useSceneVisibility } from "@/hooks/useSceneVisibility";
import { useContent } from "@/lib/content";

const Ocean3D = dynamic(() => import("@/components/three/Ocean3D"), { ssr: false });
const NeuralFlow = dynamic(() => import("@/components/three/NeuralFlow"), { ssr: false });
const DataStream3D = dynamic(() => import("@/components/three/DataStream3D"), { ssr: false });
const CogMachine3D = dynamic(() => import("@/components/three/CogMachine3D"), { ssr: false });

const SCENE_BY_ID: Record<string, any> = {
  ai: NeuralFlow,
  strategy: NeuralFlow,
  software: DataStream3D,
  automation: DataStream3D,
  industrial: CogMachine3D,
  maritime: Ocean3D,
};

const EASE = [0.16, 1, 0.3, 1] as const;

export function IndustryDetail({
  id,
  prevId,
  nextId,
}: {
  id: string;
  prevId: string;
  nextId: string;
}) {
  const c = useContent();
  const L = c.industry;
  const items = c.industries.items;
  const industry = items.find((x) => x.id === id) ?? items[0];
  const prev = items.find((x) => x.id === prevId) ?? items[0];
  const next = items.find((x) => x.id === nextId) ?? items[0];

  const accent = industry.accent;
  const scene = useSceneVisibility<HTMLDivElement>({ mountMargin: "600px 0px" });
  const Scene3D = SCENE_BY_ID[industry.id] ?? null;

  return (
    <main className="relative">
      {/* ---------- HERO ---------- */}
      <section className="relative flex min-h-[92svh] items-end overflow-hidden pb-16 pt-40 [@media(max-height:680px)]:pt-28">
        <div ref={scene.ref} className="absolute inset-0">
          {Scene3D ? (
            <SceneBoundary
              fallback={<CanvasMotif variant={industry.motif} className="h-full w-full" />}
            >
              {scene.mounted && <Scene3D frameloop={scene.frameloop} />}
            </SceneBoundary>
          ) : (
            <CanvasMotif variant={industry.motif} className="h-full w-full" />
          )}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_90%_at_50%_0%,transparent_20%,#050505_85%)]" />
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full blur-[140px]"
          style={{ background: accent, opacity: 0.18 }}
        />

        <div className="container-x relative z-10">
          <Reveal>
            <Link
              href="/industries"
              className="link-underline inline-flex items-center gap-2 font-mono text-xs tracking-widest text-mist"
            >
              {L.all}
            </Link>
          </Reveal>

          <div className="mt-8 flex items-center gap-4">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
              className="font-mono text-sm"
              style={{ color: accent }}
            >
              {industry.index}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
              className="eyebrow"
            >
              {L.label}
            </motion.span>
          </div>

          <h1 className="text-giant text-gradient mt-5 max-w-4xl text-balance">
            <span className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "115%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
              >
                {industry.title}
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
            className="mt-6 max-w-2xl text-balance text-lg text-mist"
          >
            {industry.tagline}
          </motion.p>
        </div>
      </section>

      {/* ---------- OVERVIEW ---------- */}
      <section className="relative z-10 bg-void py-24 md:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <div className="flex items-center gap-3">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: accent }}
                />
                <span className="eyebrow">{L.overview}</span>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <Reveal>
              <p className="text-balance text-2xl leading-relaxed text-chalk md:text-3xl">
                {industry.overview}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- METRICS ---------- */}
      <section className="relative z-10 bg-void pb-8">
        <div className="container-x">
          <div className="grid gap-px overflow-hidden rounded-3xl hairline sm:grid-cols-3">
            {industry.metrics.map((m, i) => (
              <Reveal key={m.label} delay={i * 0.08}>
                <div className="bg-ink p-8">
                  <div
                    className="font-display text-4xl font-bold tracking-tight md:text-5xl"
                    style={{ color: accent }}
                  >
                    {m.value}
                  </div>
                  <div className="mt-3 text-sm text-mist">{m.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CAPABILITIES ---------- */}
      <section className="relative z-10 bg-void py-24 md:py-32">
        <div className="container-x">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="eyebrow">{L.capabilities}</span>
              <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
            </div>
          </Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-3xl hairline sm:grid-cols-2 lg:grid-cols-3">
            {industry.capabilities.map((cap, i) => (
              <Reveal key={cap} delay={(i % 3) * 0.06}>
                <div className="group relative flex h-full items-start gap-4 bg-ink p-7 transition-colors duration-500 hover:bg-smoke">
                  <span
                    className="mt-1 font-mono text-xs"
                    style={{ color: accent }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-chalk">{cap}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- APPROACH ---------- */}
      <section className="relative z-10 bg-void py-24 md:py-32">
        <div className="container-x">
          <Reveal>
            <h2 className="text-section-title text-gradient max-w-2xl text-balance">
              {L.howWeOperate}
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-10 md:grid-cols-4">
            {industry.approach.map((step, i) => (
              <Reveal key={step.t} delay={i * 0.1}>
                <div className="relative">
                  <div
                    className="font-display text-5xl font-bold opacity-20"
                    style={{ color: accent }}
                  >
                    {String(i + 1)}
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold text-chalk">
                    {step.t}
                  </h3>
                  <p className="mt-3 text-sm text-mist">{step.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="relative z-10 overflow-hidden bg-void py-28 md:py-36">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[50vh] w-[50vh] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px]"
          style={{ background: accent, opacity: 0.16 }}
        />
        <div className="container-x relative text-center">
          <Reveal>
            <h2 className="text-giant text-gradient mx-auto max-w-3xl text-balance">
              {L.ctaPrefix} {industry.title.toLowerCase()} {L.ctaSuffix}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex justify-center">
              <Button href="/#contact" variant="primary">
                {L.startConversation} <span aria-hidden>→</span>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- PREV / NEXT ---------- */}
      <section className="relative z-10 bg-void">
        <div className="container-x grid gap-px overflow-hidden rounded-3xl hairline sm:grid-cols-2">
          <Link
            href={`/industries/${prev.id}`}
            className="group bg-ink p-8 transition-colors duration-500 hover:bg-smoke"
          >
            <div className="font-mono text-xs tracking-widest text-fog">{L.prev}</div>
            <div className="mt-3 font-display text-xl text-mist transition-colors group-hover:text-chalk">
              {prev.title}
            </div>
          </Link>
          <Link
            href={`/industries/${next.id}`}
            className="group bg-ink p-8 text-right transition-colors duration-500 hover:bg-smoke"
          >
            <div className="font-mono text-xs tracking-widest text-fog">{L.next}</div>
            <div className="mt-3 font-display text-xl text-mist transition-colors group-hover:text-chalk">
              {next.title}
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
