"use client";

import { SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { useContent } from "@/lib/content";

/* A node-based AI workflow diagram on a dotted grid — agents, tools and code
   wired into a pipeline, with signals travelling along the connections. */

const VW = 1000;
const VH = 520;

type Node = {
  id: string;
  x: number;
  y: number;
  label: string;
  sub: string;
  icon: keyof typeof ICONS;
  big?: boolean;
};

const NODES: Node[] = [
  { id: "trigger", x: 130, y: 150, label: "Email Trigger", sub: "IMAP", icon: "mail" },
  { id: "edit1", x: 330, y: 150, label: "Edit Fields", sub: "Manual", icon: "edit" },
  { id: "agent", x: 540, y: 150, label: "AI Agent", sub: "Tools Agent", icon: "bolt", big: true },
  { id: "code", x: 740, y: 150, label: "Code", sub: "Transform", icon: "code" },
  { id: "edit2", x: 905, y: 150, label: "Edit Fields", sub: "Manual", icon: "edit" },
  { id: "telegram", x: 430, y: 380, label: "Telegram", sub: "sendAndWait", icon: "send" },
  { id: "ifn", x: 600, y: 380, label: "If", sub: "Branch", icon: "branch" },
  { id: "email", x: 760, y: 380, label: "Send Email", sub: "Send", icon: "send" },
];

const EDGES: [string, string, boolean?][] = [
  ["trigger", "edit1"],
  ["edit1", "agent"],
  ["agent", "code"],
  ["code", "edit2"],
  ["agent", "telegram", true],
  ["telegram", "ifn"],
  ["ifn", "email"],
  ["email", "edit2", true],
];

const byId = (id: string) => NODES.find((n) => n.id === id)!;

function edgePath(a: Node, b: Node) {
  if (Math.abs(a.y - b.y) < 4) return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
  // right-angle-ish curve for branches
  const my = (a.y + b.y) / 2;
  return `M ${a.x} ${a.y} C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
}

const ICONS = {
  mail: (
    <path d="M3 5h14v10H3z M3 6l7 5 7-5" />
  ),
  edit: (
    <path d="M4 13.5 13 4.5l2.5 2.5L6.5 16H4z" />
  ),
  bolt: (
    <path d="M11 2 4 11h5l-1 7 7-9h-5z" />
  ),
  code: (
    <path d="M7 6 3 10l4 4 M13 6l4 4-4 4 M11 4l-2 12" />
  ),
  send: (
    <path d="M3 10 17 3l-5 14-2.5-5z" />
  ),
  branch: (
    <path d="M6 3v6a4 4 0 0 0 4 4h4 M14 9l3 4-3 4" />
  ),
} as const;

function NodeBox({ n }: { n: Node }) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${(n.x / VW) * 100}%`, top: `${(n.y / VH) * 100}%` }}
    >
      <div
        className={`relative flex items-center justify-center rounded-xl border bg-ink/90 backdrop-blur-sm ${
          n.big
            ? "h-12 gap-2 border-accent/40 px-4 shadow-[0_0_24px_rgba(91,140,255,0.25)]"
            : "h-11 w-11 border-white/15"
        }`}
      >
        <svg
          viewBox="0 0 20 20"
          className={`${n.big ? "h-5 w-5 text-accent-2" : "h-[18px] w-[18px] text-chalk"}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {ICONS[n.icon]}
        </svg>
        {n.big && (
          <span className="font-display text-sm font-semibold text-chalk">
            {n.label}
          </span>
        )}
      </div>
      <div className="absolute left-1/2 top-[calc(100%+6px)] -translate-x-1/2 whitespace-nowrap text-center">
        {!n.big && (
          <div className="font-mono text-[0.6rem] tracking-wide text-mist">
            {n.label}
          </div>
        )}
        <div className="font-mono text-[0.55rem] uppercase tracking-widest text-fog">
          {n.sub}
        </div>
      </div>
    </div>
  );
}

export function WorkflowDiagram() {
  const c = useContent().workflow;
  return (
    <section className="relative z-10 overflow-hidden bg-void py-28 md:py-36">
      <SectionHeading index="05" eyebrow={c.eyebrow} title={c.title} intro={c.intro} />

      <div className="container-x mt-14">
        <Reveal>
          <div
            className="relative w-full overflow-hidden rounded-3xl hairline bg-[#070708]"
            style={{ aspectRatio: `${VW} / ${VH}` }}
          >
            {/* dotted grid */}
            <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:22px_22px]" />
            <div className="pointer-events-none absolute inset-0 [background:radial-gradient(90%_90%_at_50%_45%,transparent_60%,rgba(5,5,5,0.55))]" />

            {/* connections */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox={`0 0 ${VW} ${VH}`}
              preserveAspectRatio="none"
              aria-hidden
            >
              {EDGES.map(([a, b, dashed], i) => {
                const d = edgePath(byId(a), byId(b));
                return (
                  <g key={i}>
                    <path
                      d={d}
                      fill="none"
                      stroke="rgba(255,255,255,0.18)"
                      strokeWidth={1.4}
                      strokeDasharray={dashed ? "5 6" : undefined}
                      vectorEffect="non-scaling-stroke"
                    />
                    <circle r={3.2} fill="#7af2e0">
                      <animateMotion
                        dur={`${2.6 + i * 0.25}s`}
                        repeatCount="indefinite"
                        path={d}
                        keyPoints="0;1"
                        keyTimes="0;1"
                        calcMode="linear"
                      />
                    </circle>
                  </g>
                );
              })}
            </svg>

            {/* nodes */}
            {NODES.map((n) => (
              <NodeBox key={n.id} n={n} />
            ))}

            {/* chrome labels */}
            <span className="absolute left-5 top-4 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-fog">
              Agent mode
            </span>
            <span className="absolute right-5 top-4 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-fog">
              Host
            </span>
            <span className="absolute bottom-4 left-5 flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-fog">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent-2" />
              Auto
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
