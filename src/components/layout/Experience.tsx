"use client";

import { useState } from "react";
import { Loader } from "@/components/loader/Loader";
import { Hero } from "@/components/sections/Hero";
import { Cinematic } from "@/components/sections/Cinematic";
import { AICore } from "@/components/sections/AICore";
import { GlobalNetwork } from "@/components/sections/GlobalNetwork";
import { Partners } from "@/components/sections/Partners";
import { Industries } from "@/components/sections/Industries";
import { CyberSecurity } from "@/components/sections/CyberSecurity";
import { Team } from "@/components/sections/Team";
import { Contact } from "@/components/sections/Contact";
import { GutterRuler } from "@/components/layout/GutterRuler";

/**
 * Homepage experience — a tight, cinematic flow over one continuous world.
 * Curated to a few strong beats: arrival, manifesto, intelligence, network,
 * industries, and the call to engage. Everything else lives on sub-pages.
 */
export function Experience() {
  const [ready, setReady] = useState(false);

  return (
    <>
      <Loader onComplete={() => setReady(true)} />
      <GutterRuler />
      <main className="relative">
        <Hero ready={ready} />
        <Cinematic />
        <AICore />
        <GlobalNetwork />
        <Partners />
        <Industries />
        <CyberSecurity />
        <Team />
        <Contact />
      </main>
    </>
  );
}
