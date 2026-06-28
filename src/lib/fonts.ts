import { Geist, Geist_Mono } from "next/font/google";

/* Spec Ch.05 §5.3 — Geist (display + body) and Geist Mono (technical labels,
   numerals, "relevés"). Vercel's native typeface; clean engineering voice. */
export const fontDisplay = Geist({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
