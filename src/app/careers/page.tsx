import type { Metadata } from "next";
import { CareersView } from "./CareersView";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join ARDLABS® — a small, senior digital engineering studio building software, platforms and AI systems, refined to the detail.",
  alternates: { canonical: "/careers" },
  openGraph: {
    title: "Careers · ARDLABS®",
    description: "Join a small, senior studio building reliable software, platforms and AI systems.",
    url: "/careers",
  },
};

export default function Careers() {
  return <CareersView />;
}
