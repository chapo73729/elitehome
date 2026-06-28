import type { Metadata } from "next";
import { TermsView } from "./TermsView";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms governing the use of the ARDLABS® website.",
  alternates: { canonical: "/legal/terms" },
};

export default function Terms() {
  return <TermsView />;
}
