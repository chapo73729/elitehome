import type { Metadata } from "next";
import { ApproachView } from "./ApproachView";

export const metadata: Metadata = {
  title: "Approach",
  description:
    "How ARDLABS® works — a studio method that turns a problem into reliable software, shipped and supported.",
  alternates: { canonical: "/approach" },
  openGraph: {
    title: "Approach · ARDLABS®",
    description: "How we turn a problem into reliable software, shipped end to end.",
    url: "/approach",
  },
};

export default function Approach() {
  return <ApproachView />;
}
