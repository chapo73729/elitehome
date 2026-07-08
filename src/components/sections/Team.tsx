"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useContent } from "@/lib/content";
import { usePerf } from "@/lib/perf";
import { audio } from "@/lib/audio";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";
import { Compile } from "@/components/ui/Compile";
import { ChapterNumeral } from "@/components/ui/ChapterNumeral";

type Member = { id: string; name: string; role: string; bio: string; stack: string[] };

const EASE = [0.16, 1, 0.3, 1] as const;

/* Real portraits: drop optimised files into /public/team/ (e.g. jakub.webp)
   and map them here (id -> src). Until a member has a file, a refined
   blueprint portrait renders in the studio's own visual language. */
const PORTRAIT_SRC: Record<string, string | null> = {
  jakub: "/team/jakub.webp",
  tomas: "/team/tomas.webp",
  samir: "/team/samir.webp",
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Blueprint portrait — a framed monogram panel, premium even without a photo. */
function Portrait({ member }: { member: Member }) {
  const src = PORTRAIT_SRC[member.id] ?? null;
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-chalk/10 bg-[#0a0b0d]">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`${member.name} — ${member.role}`}
          width={480}
          height={600}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-top grayscale transition-all duration-700 group-hover:grayscale-0"
        />
      ) : (
        <>
          {/* faint blueprint grid */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.5]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(79,140,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(79,140,255,0.10) 1px, transparent 1px)",
              backgroundSize: "26px 26px",
            }}
          />
          {/* radial accent glow */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 42%, rgba(79,140,255,0.20), transparent 70%)",
            }}
          />
          {/* corner brackets */}
          <span aria-hidden className="absolute left-4 top-4 h-5 w-5 border-l border-t border-accent/50" />
          <span aria-hidden className="absolute right-4 top-4 h-5 w-5 border-r border-t border-accent/50" />
          <span aria-hidden className="absolute bottom-4 left-4 h-5 w-5 border-b border-l border-accent/50" />
          <span aria-hidden className="absolute bottom-4 right-4 h-5 w-5 border-b border-r border-accent/50" />
          {/* monogram */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-6xl font-bold tracking-tight text-chalk/90 [text-shadow:0_0_28px_rgba(79,140,255,0.45)] md:text-7xl">
              {initials(member.name)}
            </span>
          </div>
          {/* mono id */}
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[0.55rem] uppercase tracking-[0.3em] text-fog">
            {`// ${member.id}`}
          </span>
        </>
      )}
    </div>
  );
}

function MemberCard({ member, index, stackLabel }: { member: Member; index: number; stackLabel: string }) {
  const reduced = useReducedMotion();
  return (
    <Reveal delay={Math.min(index * 0.08, 0.24)}>
      <div className="group" onMouseEnter={() => audio.hover()}>
        <Portrait member={member} />

        <div className="mt-6">
          <h3 className="font-display text-xl font-semibold tracking-tight text-chalk">
            {member.name}
          </h3>
          <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-accent/85">
            {member.role}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-mist">{member.bio}</p>

          <div className="mt-5">
            <span className="font-mono text-[0.55rem] uppercase tracking-[0.24em] text-fog">
              {stackLabel}
            </span>
            <div className="mt-3 flex flex-wrap gap-2">
              {member.stack.map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: EASE, delay: Math.min(i * 0.04, 0.3) }}
                  className="rounded-full border border-chalk/12 bg-chalk/[0.03] px-3 py-1 font-mono text-[0.62rem] tracking-wide text-mist transition-colors duration-300 hover:border-accent/40 hover:text-chalk"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function Team() {
  const c = useContent().team;
  const perf = usePerf();
  const members = c.members as unknown as Member[];

  return (
    <section id="team" className="relative z-10 scroll-mt-24 bg-void py-28 md:py-40">
      <div className="container-x relative">
        <ChapterNumeral n="05" label="TEAM" />
      </div>

      <div className="container-x relative">
        <Compile label="team" index="05" disabled={perf}>
          <SectionHeading flush index="05" eyebrow={c.eyebrow} title={c.title} intro={c.intro} />
        </Compile>
      </div>

      <div className="container-x mt-16">
        <div className="grid gap-x-8 gap-y-14 md:grid-cols-3">
          {members.map((m, i) => (
            <MemberCard key={m.id} member={m} index={i} stackLabel={c.stackLabel} />
          ))}
        </div>
      </div>
    </section>
  );
}
