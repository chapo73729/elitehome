import type { Metadata } from "next";
import { WorkIndexView } from "@/components/work/WorkIndexView";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected work from ARDLABS® — software, platforms, data and cloud projects, shipped end to end.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Work · ARDLABS®",
    description: "Software, platforms, data and cloud projects, shipped end to end.",
    url: "/work",
  },
};

export default function WorkIndex() {
  return <WorkIndexView />;
}
