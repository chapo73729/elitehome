"use client";

import { useState } from "react";
import { Loader } from "@/components/loader/Loader";
import { Hero } from "@/components/sections/Hero";
import { Cinematic } from "@/components/sections/Cinematic";
import { AICore } from "@/components/sections/AICore";
import { GlobalNetwork } from "@/components/sections/GlobalNetwork";
import { Industries } from "@/components/sections/Industries";
import { CtaBanner } from "@/components/sections/CtaBanner";
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
        <Industries />
        <CtaBanner />
        <Contact />
      </main>
    </>
  );
}
