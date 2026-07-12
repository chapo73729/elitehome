"use client";

import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { SmoothScroll } from "./SmoothScroll";
import { AnchorAlign } from "./AnchorAlign";
import { PageTransition } from "./PageTransition";
import { AmbientBackdrop } from "./AmbientBackdrop";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { BackToTop } from "./BackToTop";
import { MobileCTA } from "./MobileCTA";
import { FloatingWhatsApp } from "./FloatingWhatsApp";
import { CookieConsent } from "./CookieConsent";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Toaster } from "@/components/ui/Toaster";
import { PWARegister } from "./PWARegister";
import { initPerf } from "@/lib/perf";
import { useContent } from "@/lib/content";

/**
 * Global site chrome shared by every route: smooth scroll, ambient backdrop,
 * scroll progress, navigation, footer, page transitions and toasts. Kept
 * deliberately restrained — a luxury house speaks quietly.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const skip = useContent().common.skip;

  useEffect(() => {
    initPerf();
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
      <PageTransition />
      <ScrollProgress />
      <PWARegister />
      <Toaster />
      <CookieConsent />
      <SmoothScroll>
        <AnchorAlign />
        <Navbar />
        {/* stable skip-link target on every route */}
        <div id="content-top" tabIndex={-1} className="outline-none" />
        {children}
        <Footer />
      </SmoothScroll>
      <MobileCTA />
      <FloatingWhatsApp />
      <BackToTop />
    </MotionConfig>
  );
}
