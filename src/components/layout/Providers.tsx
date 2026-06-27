"use client";

import { usePathname } from "next/navigation";
import { SmoothScroll } from "./SmoothScroll";
import { Cursor } from "./Cursor";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { SectionNav } from "./SectionNav";
import { BackToTop } from "./BackToTop";
import { SoundSystem } from "./SoundSystem";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

/**
 * Global site chrome shared by every route: smooth scroll, custom cursor,
 * scroll progress, navigation and footer. The homepage layers its boot
 * loader and section rail on top of this.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

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
