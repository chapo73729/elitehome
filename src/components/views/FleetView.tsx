"use client";

import { useContent } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { FleetCards } from "@/components/sections/FleetCards";
import { CtaBanner } from "@/components/ui/CtaBanner";

export function FleetView() {
  const f = useContent().fleet;

  return (
    <main className="relative">
      <PageHero
        eyebrow={f.eyebrow}
        title={f.title}
        intro={f.intro}
        image="/images/garage-fleet.webp"
        imagePosition="center 60%"
      />
      <section className="relative z-10 bg-void pb-28 md:pb-36">
        <div className="container-x">
          <FleetCards />
        </div>
      </section>
      <CtaBanner />
    </main>
  );
}
