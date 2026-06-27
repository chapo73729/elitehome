import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { IndustriesIndexView } from "@/components/industry/IndustriesIndexView";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Six universes, one laboratory — Artificial Intelligence, Software, Automation, Industrial, Strategy and Maritime ventures engineered by ARDLABS®.",
  alternates: { canonical: "/industries" },
  openGraph: {
    title: `Industries — ${SITE.legal}`,
    description: "Six universes, one laboratory.",
    url: `${SITE.url}/industries`,
  },
};

export default function IndustriesIndex() {
  return <IndustriesIndexView />;
}
