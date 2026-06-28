import type { Metadata } from "next";
import { ImprintView } from "./ImprintView";

export const metadata: Metadata = {
  title: "Legal Notice",
  description: "Legal notice and company information for ARDLABS®.",
  alternates: { canonical: "/legal/imprint" },
  robots: { index: true, follow: true },
};

export default function Imprint() {
  return <ImprintView />;
}
