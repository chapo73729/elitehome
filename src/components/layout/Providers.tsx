"use client";

import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { usePathname } from "next/navigation";
import { SmoothScroll } from "./SmoothScroll";
import { AnchorAlign } from "./AnchorAlign";
import { MusicGate } from "./MusicGate";
import { PageTransition } from "./PageTransition";
import { AmbientBackdrop } from "./AmbientBackdrop";
import { Atmosphere } from "./Atmosphere";
import { Cursor } from "./Cursor";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { SectionNav } from "./SectionNav";
import { BackToTop } from "./BackToTop";
import { MobileCTA } from "./MobileCTA";
import { SoundSystem } from "./SoundSystem";
import { CookieConsent } from "./CookieConsent";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Toaster } from "@/components/ui/Toaster";
import { CommandPalette } from "@/components/feature/CommandPalette";
import { ContextMenu } from "@/components/feature/ContextMenu";
import { ShowreelControl } from "@/components/feature/ShowreelControl";
import { Konami } from "@/components/feature/Konami";
import { TabTitle } from "@/components/feature/TabTitle";
import { Shortcuts } from "@/components/feature/Shortcuts";
import { PWARegister } from "./PWARegister";
import { Terminal } from "@/components/feature/Terminal";
import { initAccent } from "@/lib/accent";
import { initPerf } from "@/lib/perf";
import { initAchievements } from "@/lib/achievements";
import { stripLocale } from "@/lib/i18n";
import { useContent } from "@/lib/content";

/**
 * Global site chrome shared by every route: smooth scroll, custom cursor,
 * scroll progress, navigation, footer, plus the command palette, context
 * menu, toasts, showreel, shortcuts and easter eggs.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = stripLocale(pathname).rest === "/";
  const skip = useContent().common.skip;

  useEffect(() => {
    initAccent();
    initPerf();
    initAchievements();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#content-top"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-full focus:bg-chalk focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-void"
      >
        {skip}
      </a>
      <AmbientBackdrop />
      <Atmosphere />
      <div className="scanlines" aria-hidden />
      <Cursor />
      <PageTransition />
      <ScrollProgress />
      <SoundSystem />
      <Shortcuts />
      <TabTitle />
      <Konami />
      <CommandPalette />
      <ContextMenu />
      <Terminal />
      <PWARegister />
      <Toaster />
      <ShowreelControl />
      <CookieConsent />
      <SmoothScroll>
        <AnchorAlign />
        <MusicGate />
        <Navbar />
        {/* stable skip-link target on every route */}
        <div id="content-top" tabIndex={-1} className="outline-none" />
        {children}
        <Footer />
      </SmoothScroll>
      {/* fixed rails AFTER the document flow so the Tab order reads
          header → content → footer → rails (they are position:fixed,
          so DOM placement has no visual effect) */}
      {isHome && <SectionNav />}
      <BackToTop />
      <MobileCTA />
    </MotionConfig>
  );
}
