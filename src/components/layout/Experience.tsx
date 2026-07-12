"use client";

import { useState } from "react";
import { Loader } from "@/components/loader/Loader";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Marquee } from "@/components/sections/Marquee";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { RouteMap } from "@/components/sections/RouteMap";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { FleetSection } from "@/components/sections/FleetSection";
import { BookingCTA } from "@/components/sections/BookingCTA";
import { Seam } from "@/components/layout/Seam";

/**
 * Homepage experience — a cinematic flow over one continuous night: arrival,
 * manifesto, the cabin, the map, services, the fleet, and the invitation to
 * reserve. Everything else lives on sub-pages.
 */
export function Experience() {
  const [ready, setReady] = useState(false);

  return (
    <>
      <Loader onComplete={() => setReady(true)} />
      <main className="relative">
        <Hero ready={ready} />
        <Manifesto />
        <Marquee />
        <ExperienceSection />
        <Seam />
        <RouteMap />
        <ServicesSection />
        <FleetSection />
        <Seam />
        <BookingCTA />
      </main>
    </>
  );
}
