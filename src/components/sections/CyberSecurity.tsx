"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useContent } from "@/lib/content";
import { usePerf } from "@/lib/perf";
import { useLang } from "@/lib/lang";
import { audio } from "@/lib/audio";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";
import { Compile } from "@/components/ui/Compile";
import { ChapterNumeral } from "@/components/ui/ChapterNumeral";
import { CyberDefense } from "./CyberDefense";
import { SceneBoundary } from "@/components/three/SceneBoundary";
import { useSceneVisibility } from "@/hooks/useSceneVisibility";
import type { ShieldCtrl } from "@/components/three/CyberShield";

const CyberShield = dynamic(() => import("@/components/three/CyberShield"), {
  ssr: false,
  loading: () => <div className="absolute inset-0" />,
});

type Item = { id: string; title: string; tag: string; blurb: string };

const EASE = [0.16, 1, 0.3, 1] as const;

/** One-word stage captions + counter label for the animated explainer. */
const STAGE_LABELS = {
  en: { monitor: "monitor", detect: "detect", intercept: "intercept", respond: "respond", secured: "secured", counter: "threats neutralised" },
  fr: { monitor: "surveillance", detect: "détection", intercept: "interception", respond: "réponse", secured: "sécurisé", counter: "menaces neutralisées" },
} as const;
type StageKey = keyof (typeof STAGE_LABELS)["en"];

// narration timeline (drives the DOM caption + the shield's alert/pulse)
const TIMELINE: { key: Exclude<StageKey, "counter">; dur: number }[] = [
  { key: "monitor", dur: 3000 },
  { key: "detect", dur: 3000 },
  { key: "intercept", dur: 3600 },
  { key: "respond", dur: 4200 },
  { key: "secured", dur: 2600 },
];

const fmt = (n: number) =>
  Math.floor(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

/** Blueprint corner bracket, matched to the « Compile » idiom. */
const STAGE_CORNERS = [
  "left-4 top-4 border-l border-t",
  "right-4 top-4 border-r border-t",
  "bottom-4 left-4 border-b border-l",
  "bottom-4 right-4 border-b border-r",
] as const;

/**
 * The defence-in-depth centrepiece. A real Three.js shield-dome scene when
 * WebGL is available and motion is allowed; the 2D CyberDefense canvas is the
 * fallback (reduced motion, perf mode, no WebGL, or a lost context). A single
 * rAF timeline narrates the phases — driving the DOM caption + counter and,
 * for the 3D path, the shield's alert/pulse via a shared ref.
 */
function DefenseStage({ reducedPref, perf }: { reducedPref: boolean; perf: boolean }) {
  const labels = STAGE_LABELS[useLang()];
  const [webgl, setWebgl] = useState(true);
  const use3D = !reducedPref && !perf && webgl;
  const scene = useSceneVisibility<HTMLDivElement>({ mountMargin: "600px 0px" });

  const ctrl = useRef<ShieldCtrl>({ alert: 0, pulse: 0 });
  const counterRef = useRef<HTMLSpanElement>(null);
  const [phase, setPhase] = useState<Exclude<StageKey, "counter">>("monitor");

  useEffect(() => {
    // detect WebGL once on the client so SSR stays deterministic
    import("@/hooks/useSceneVisibility").then((m) => setWebgl(m.webglSupported()));
  }, []);

  // narration timeline — only needed on the 3D path (the 2D canvas narrates itself)
  useEffect(() => {
    if (!use3D) return;
    const total = TIMELINE.reduce((a, s) => a + s.dur, 0);
    let raf = 0;
    let cycleStart = performance.now();
    let curIdx = -1;
    let count = 1284507 + Math.floor(Math.random() * 60000);
    let lastWrite = 0;
    let prev = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      let el = now - cycleStart;
      if (el >= total) {
        cycleStart = now;
        el = 0;
      }
      let acc = 0;
      let idx = 0;
      for (let i = 0; i < TIMELINE.length; i++) {
        if (el < acc + TIMELINE[i].dur) {
          idx = i;
          break;
        }
        acc += TIMELINE[i].dur;
      }
      const key = TIMELINE[idx].key;
      if (idx !== curIdx) {
        curIdx = idx;
        setPhase(key);
        if (key === "secured") ctrl.current.pulse = 1;
      }
      const targetAlert = key === "respond" ? 1 : key === "intercept" ? 0.18 : 0;
      ctrl.current.alert += (targetAlert - ctrl.current.alert) * Math.min(1, dt * 3);
      ctrl.current.pulse *= 0.94;
      count += dt * (key === "intercept" ? 300 : 80);
      if (now - lastWrite > 100 && counterRef.current) {
        counterRef.current.textContent = fmt(count);
        lastWrite = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [use3D]);

  const capColor = phase === "respond" ? "text-[#ffd0d0]" : "text-[#bcd6ff]";

  return (
    <Reveal delay={0.12}>
      <div
        ref={scene.ref}
        className="relative mx-auto h-[clamp(340px,52vh,540px)] w-full max-w-4xl overflow-hidden rounded-2xl border border-chalk/10 bg-[radial-gradient(120%_120%_at_50%_35%,#0b0e14_0%,#050608_70%)]"
      >
        {use3D ? (
          <SceneBoundary fallback={<CyberDefense labels={labels} className="absolute inset-0 h-full w-full" />}>
            {scene.mounted && <CyberShield frameloop={scene.frameloop} ctrl={ctrl} />}
          </SceneBoundary>
        ) : (
          <CyberDefense still={reducedPref} labels={labels} className="absolute inset-0 h-full w-full" />
        )}

        {/* blueprint corner brackets */}
        {STAGE_CORNERS.map((cls) => (
          <span key={cls} aria-hidden className={`pointer-events-none absolute h-5 w-5 border-accent/50 ${cls}`} />
        ))}

        {/* static HUD readouts */}
        <span aria-hidden className="pointer-events-none absolute left-6 top-5 font-mono text-[0.55rem] uppercase tracking-[0.28em] text-fog/80">
          {"// defence.in.depth"}
        </span>
        <span aria-hidden className="pointer-events-none absolute right-6 top-5 flex items-center gap-2 font-mono text-[0.55rem] uppercase tracking-[0.28em] text-accent/85">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          live
        </span>
        <span aria-hidden className="pointer-events-none absolute bottom-5 left-6 hidden font-mono text-[0.55rem] uppercase tracking-[0.28em] text-fog/70 sm:block">
          {"AES-256 · zero-trust"}
        </span>

        {/* dynamic HUD (3D path only — the 2D canvas draws its own) */}
        {use3D && (
          <>
            <span
              aria-hidden
              className={`pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.42em] transition-colors duration-500 ${capColor}`}
            >
              {labels[phase]}
            </span>
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-5 right-6 hidden text-right font-mono text-[0.6rem] uppercase tracking-[0.18em] text-fog/70 sm:block"
            >
              {labels.counter}
              {"  "}
              <span ref={counterRef} className="tabular-nums text-[#bcd6ff]">
                1 284 507
              </span>
            </span>
          </>
        )}
      </div>
    </Reveal>
  );
}

/* ============================================================
   Cyber Security — a SOC-floor section. A live network/radar
   canvas breathes behind a grid of ten domain cards spanning the
   offensive→defensive spectrum. Each card is a real focusable
   surface with blueprint corner brackets that ignite on hover /
   focus. Reduced motion / perf mode drops the canvas for a calm
   static wall.
   ============================================================ */

function DomainCard({ item, index }: { item: Item; index: number }) {
  return (
    <Reveal delay={Math.min(index * 0.05, 0.3)}>
      <div
        tabIndex={0}
        onMouseEnter={() => audio.hover()}
        className="group relative h-full overflow-hidden rounded-lg border border-chalk/10 bg-chalk/[0.02] p-6 transition-colors duration-500 hover:border-accent/40 hover:bg-accent/[0.04] focus:outline-none focus-visible:border-accent/60 focus-visible:ring-1 focus-visible:ring-accent/50 md:p-7"
      >
        {/* blueprint corner brackets — ignite on hover/focus */}
        <span aria-hidden className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-accent/0 transition-colors duration-500 group-hover:border-accent/70 group-focus-visible:border-accent/70" />
        <span aria-hidden className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-accent/0 transition-colors duration-500 group-hover:border-accent/70 group-focus-visible:border-accent/70" />

        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-accent/80">
            {item.tag}
          </span>
          <span aria-hidden className="font-mono text-[0.58rem] tabular-nums text-fog">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-chalk md:text-xl">
          {item.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-mist">{item.blurb}</p>

        {/* baseline trace that draws across on hover */}
        <span
          aria-hidden
          className="mt-6 block h-px w-full origin-left scale-x-0 bg-gradient-to-r from-accent/70 to-transparent transition-transform duration-500 group-hover:scale-x-100 group-focus-visible:scale-x-100"
        />
      </div>
    </Reveal>
  );
}

export function CyberSecurity() {
  const c = useContent().security;
  const reducedPref = !!useReducedMotion();
  const perf = usePerf();
  const reduced = reducedPref || perf;
  const items = c.items as unknown as Item[];

  return (
    <section id="security" className="relative z-10 scroll-mt-24 overflow-hidden bg-void py-28 md:py-40">
      <div className="container-x relative">
        <ChapterNumeral n="04" label="SECURITY" />
      </div>

      <div className="container-x relative">
        <Compile label="security" index="04" disabled={perf}>
          <SectionHeading flush index="04" eyebrow={c.eyebrow} title={c.title} intro={c.intro} />
        </Compile>
      </div>

      {/* the animated defence-in-depth explainer */}
      <div className="container-x relative mt-14">
        <DefenseStage reducedPref={reducedPref} perf={perf} />
      </div>

      <div className="container-x relative mt-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item, i) => (
            <DomainCard key={item.id} item={item} index={i} />
          ))}
        </div>

        {/* registry line — the studio's mono idiom */}
        <Reveal delay={0.1}>
          <motion.p
            className="mt-8 text-right font-mono text-[0.6rem] uppercase tracking-[0.25em] text-fog"
            initial={reduced ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {c.registry}
          </motion.p>
        </Reveal>
      </div>
    </section>
  );
}
