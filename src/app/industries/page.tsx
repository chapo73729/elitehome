import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { IndustriesIndexView } from "@/components/industry/IndustriesIndexView";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Four poles, one standard — Strategy & Consulting, Design & Development, Data & AI, and Cloud & Infrastructure, engineered by ARDLABS®.",
  alternates: { canonical: "/industries" },
  openGraph: {
    title: `Services — ${SITE.legal}`,
    description: "Four poles. One standard.",
    url: `${SITE.url}/industries`,
  },
};

export default function IndustriesIndex() {
  return <IndustriesIndexView />;
}
