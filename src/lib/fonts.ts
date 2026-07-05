import { Geist, Geist_Mono } from "next/font/google";

/* Spec Ch.05 §5.3 — Geist (display + body) and Geist Mono (technical labels,
   numerals, "relevés"). Vercel's native typeface; clean engineering voice. */
/* Display and body share the SAME Geist instance — loading it twice under two
   CSS variables shipped duplicate font files + an extra preload for nothing.
   --font-sans is aliased to --font-display in globals.css. */
export const fontDisplay = Geist({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
