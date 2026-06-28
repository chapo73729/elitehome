import type { Metadata } from "next";
import { PrivacyView } from "./PrivacyView";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How ARDLABS® collects, uses and protects personal data.",
  alternates: { canonical: "/legal/privacy" },
};

export default function Privacy() {
  return <PrivacyView />;
}
