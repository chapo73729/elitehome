"use client";

import { SmoothScroll } from "./SmoothScroll";
import { Cursor } from "./Cursor";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

/**
 * Global site chrome shared by every route: smooth scroll, custom cursor,
 * scroll progress, navigation and footer. The homepage layers its boot
 * loader on top of this.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Cursor />
      <ScrollProgress />
      <SmoothScroll>
        <Navbar />
        {children}
        <Footer />
      </SmoothScroll>
    </>
  );
}
