import type { Metadata } from "next";
import { InsightsIndexView } from "@/components/insights/InsightsIndexView";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Notes from ARDLABS® on digital engineering — shipping reliable software, applied AI, and infrastructure refined to the detail.",
  alternates: { canonical: "/insights" },
  openGraph: {
    title: "Insights · ARDLABS®",
    description:
      "Notes from the studio on digital engineering — software, AI and infrastructure, done right.",
    url: "/insights",
  },
};

export default function InsightsIndex() {
  return <InsightsIndexView />;
}
