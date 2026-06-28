"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { useContent } from "@/lib/content";
import { useLang } from "@/lib/lang";

const T = {
  en: {
    systemLoad: "System Load",
    neural: "Active neural processing",
    sla: "SLA Response",
    uptimeMonitoring: "Global uptime monitoring",
    tokenUsage: "Token Usage",
    monthlyVolume: "Monthly volume throughput",
    cache: "Cache",
    uptime: "Uptime",
    coreSystems: "Core systems",
    totalQueries: "Total queries",
    activeNodes: "Active nodes",
  },
  fr: {
    systemLoad: "Charge système",
    neural: "Traitement neuronal actif",
    sla: "Réponse SLA",
    uptimeMonitoring: "Surveillance de disponibilité mondiale",
    tokenUsage: "Utilisation de tokens",
    monthlyVolume: "Débit mensuel",
    cache: "Cache",
    uptime: "Disponibilité",
    coreSystems: "Systèmes centraux",
    totalQueries: "Requêtes totales",
    activeNodes: "Nœuds actifs",
  },
} as const;

const EASE = [0.16, 1, 0.3, 1] as const;
const inView = { once: true, margin: "-15% 0px" };

function Card({
  icon,
  title,
  sub,
  badge,
  children,
}: {
  icon: string;
  title: string;
  sub: string;
  badge: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-3xl hairline bg-ink p-7">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 font-mono text-sm text-chalk">
            {icon}
          </span>
          <span className="font-display text-base font-semibold text-chalk">{title}</span>
        </div>
        <span className="font-mono text-xs text-accent-2">{badge}</span>
      </div>
      <p className="mt-2 text-sm text-mist">{sub}</p>
      <div className="mt-6 flex flex-1 items-center justify-center">{children}</div>
    </div>
  );
}

/* ---- Card 1: radial load ring ---- */
function LoadRing() {
  const t = T[useLang()];
  return (
    <div className="flex w-full items-center gap-6">
      <div className="flex flex-col gap-4 font-mono">
        <div>
          <div className="text-lg text-chalk">99%</div>
          <div className="text-[0.6rem] uppercase tracking-widest text-fog">{t.cache}</div>
        </div>
        <div>
          <div className="text-lg text-chalk">6M</div>
          <div className="text-[0.6rem] uppercase tracking-widest text-fog">{t.uptime}</div>
        </div>
      </div>
      <div className="relative mx-auto h-40 w-40">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
          <motion.circle
            cx="60" cy="60" r="50" fill="none" stroke="url(#loadGrad)" strokeWidth="10"
            strokeLinecap="round" pathLength={100} strokeDasharray="100"
            initial={{ strokeDashoffset: 100 }}
            whileInView={{ strokeDashoffset: 100 - 86 }}
            viewport={inView}
            transition={{ duration: 1.4, ease: EASE }}
          />
          <defs>
            <linearGradient id="loadGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#6b9dff" />
              <stop offset="1" stopColor="#4f8cff" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-display text-4xl font-bold text-chalk">
            <Counter value={15} />
          </div>
          <div className="font-mono text-[0.6rem] uppercase tracking-widest text-fog">{t.coreSystems}</div>
        </div>
      </div>
    </div>
  );
}

/* ---- Card 2: SLA lollipop chart ---- */
function SlaChart() {
  const bars = [42, 60, 78, 54, 100, 70, 38, 64];
  return (
    <div className="w-full">
      <div className="relative h-44">
        <div className="absolute left-0 right-0 top-2 flex items-center gap-2">
          <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[0.6rem] text-mist">SLA 99%</span>
          <span className="h-px flex-1 border-t border-dashed border-white/15" />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex h-40 items-end justify-between gap-3">
          {bars.map((h, i) => (
            <div key={i} className="flex h-full flex-1 items-end justify-center">
              <motion.div
                className="relative w-0.5 rounded-full bg-gradient-to-t from-white/15 to-white/55"
                initial={{ height: 0 }}
                whileInView={{ height: `${h}%` }}
                viewport={inView}
                transition={{ duration: 0.9, ease: EASE, delay: i * 0.06 }}
              >
                <span
                  className={`absolute -top-1.5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full ${
                    h === 100 ? "bg-accent-2 shadow-[0_0_10px_2px_rgba(107,157,255,0.6)]" : "bg-chalk"
                  }`}
                />
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---- Card 3: token speedometer ---- */
function Speedometer() {
  const t = T[useLang()];
  // semicircle arc, left(180°) to right(0°)
  const d = "M 12 70 A 58 58 0 0 1 128 70";
  return (
    <div className="w-full">
      <div className="relative mx-auto h-32 w-full max-w-[16rem]">
        <svg viewBox="0 0 140 86" className="h-full w-full">
          <path d={d} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" strokeLinecap="round" />
          <motion.path
            d={d} fill="none" stroke="url(#spdGrad)" strokeWidth="9" strokeLinecap="round"
            pathLength={100} strokeDasharray="100"
            initial={{ strokeDashoffset: 100 }}
            whileInView={{ strokeDashoffset: 100 - 72 }}
            viewport={inView}
            transition={{ duration: 1.4, ease: EASE }}
          />
          <defs>
            <linearGradient id="spdGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#4f8cff" />
              <stop offset="1" stopColor="#6b9dff" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-x-0 bottom-1 flex flex-col items-center">
          <div className="font-display text-4xl font-bold text-chalk">
            <Counter value={343} />
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl hairline text-center">
        <div className="bg-ink p-3">
          <div className="font-display text-lg text-chalk">
            <Counter value={152} />
          </div>
          <div className="font-mono text-[0.55rem] uppercase tracking-widest text-fog">{t.totalQueries}</div>
        </div>
        <div className="bg-ink p-3">
          <div className="font-display text-lg text-chalk">
            <Counter value={115} />
          </div>
          <div className="font-mono text-[0.55rem] uppercase tracking-widest text-fog">{t.activeNodes}</div>
        </div>
      </div>
    </div>
  );
}

export function Telemetry() {
  const c = useContent().telemetry;
  const t = T[useLang()];
  return (
    <section className="relative z-10 bg-void py-28 md:py-36">
      <SectionHeading index="12" eyebrow={c.eyebrow} title={c.title} intro={c.intro} />
      <div className="container-x mt-14">
        <div className="grid gap-5 lg:grid-cols-3">
          <Reveal>
            <Card icon="◇" title={t.systemLoad} sub={t.neural} badge="98.7%">
              <LoadRing />
            </Card>
          </Reveal>
          <Reveal delay={0.08}>
            <Card icon="◆" title={t.sla} sub={t.uptimeMonitoring} badge="99.99%">
              <SlaChart />
            </Card>
          </Reveal>
          <Reveal delay={0.16}>
            <Card icon="◈" title={t.tokenUsage} sub={t.monthlyVolume} badge="8.4M">
              <Speedometer />
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
