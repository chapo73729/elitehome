import { Cormorant_Garamond, Jost } from "next/font/google";

/* BLACKFIRST type system — a luxury-house pairing:
   - Display: Cormorant Garamond, an elegant high-contrast serif in the
     register of grand hotels and fashion maisons. Headlines only.
   - Body & labels: Jost, a refined geometric sans (Futura spirit) for
     running text, navigation and the letterspaced uppercase labels.
   The label face keeps tabular figures via the .font-mono utility so
   times, coordinates and fares never jitter ("executive numerals"). */
export const fontDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const fontMono = Jost({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
