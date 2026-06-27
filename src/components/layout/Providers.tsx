"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { SmoothScroll } from "./SmoothScroll";
import { Cursor } from "./Cursor";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { SectionNav } from "./SectionNav";
import { BackToTop } from "./BackToTop";
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
import { initAccent } from "@/lib/accent";

/**
 * Global site chrome shared by every route: smooth scroll, custom cursor,
 * scroll progress, navigation, footer, plus the command palette, context
 * menu, toasts, showreel, shortcuts and easter eggs.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    initAccent();
  }, []);

  return (
    <>
      <a
        href="#vision"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-full focus:bg-chalk focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-void"
      >
        Skip to content
      </a>
      <Cursor />
      <ScrollProgress />
      <SoundSystem />
      <Shortcuts />
      <TabTitle />
      <Konami />
      <CommandPalette />
      <ContextMenu />
      <Toaster />
      <ShowreelControl />
      <CookieConsent />
      {isHome && <SectionNav />}
      <BackToTop />
      <SmoothScroll>
        <Navbar />
        {children}
        <Footer />
      </SmoothScroll>
    </>
  );
}
