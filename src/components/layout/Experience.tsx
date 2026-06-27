"use client";

import { useState } from "react";
import { Loader } from "@/components/loader/Loader";
import { Hero } from "@/components/sections/Hero";
import { Vision } from "@/components/sections/Vision";
import { Cinematic } from "@/components/sections/Cinematic";
import { AICore } from "@/components/sections/AICore";
import { GlobalNetwork } from "@/components/sections/GlobalNetwork";
import { Industries } from "@/components/sections/Industries";
import { Capabilities } from "@/components/sections/Capabilities";
import { ResearchLab } from "@/components/sections/ResearchLab";
import { Synthesis } from "@/components/sections/Synthesis";
import { TechStack } from "@/components/sections/TechStack";
import { Stats } from "@/components/sections/Stats";
import { Timeline } from "@/components/sections/Timeline";
import { Projects } from "@/components/sections/Projects";
import { InsightsTeaser } from "@/components/sections/InsightsTeaser";
import { Contact } from "@/components/sections/Contact";

/**
 * Homepage experience. Global chrome (cursor, smooth scroll, nav, footer)
 * lives in Providers; here we own the boot loader and the section flow.
 */
export function Experience() {
  const [ready, setReady] = useState(false);

  return (
    <>
      <Loader onComplete={() => setReady(true)} />
      <main className="relative">
        <Hero ready={ready} />
        <Vision />
        <Cinematic />
        <AICore />
        <GlobalNetwork />
        <Industries />
        <Capabilities />
        <ResearchLab />
        <Synthesis />
        <TechStack />
        <Stats />
        <Timeline />
        <Projects />
        <InsightsTeaser />
        <Contact />
      </main>
    </>
  );
}
