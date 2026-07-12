"use client";

import { useContent } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { ServiceCards } from "@/components/sections/ServiceCards";
import { CtaBanner } from "@/components/ui/CtaBanner";

export function ServicesIndexView() {
  const s = useContent().services;

  return (
    <main className="relative">
      <PageHero eyebrow={s.indexEyebrow} title={s.title} intro={s.indexIntro} />
      <section className="relative z-10 bg-void pb-28 md:pb-36">
        <div className="container-x">
          <ServiceCards />
        </div>
      </section>
      <CtaBanner />
    </main>
  );
}
