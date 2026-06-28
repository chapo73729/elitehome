import type { Metadata } from "next";
import { AboutView } from "./AboutView";

export const metadata: Metadata = {
  title: "About",
  description:
    "ARDLABS® is a digital engineering studio. We design and build software, platforms and AI systems — refined to the detail.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About · ARDLABS®",
    description: "A digital engineering studio designing and building software, platforms and AI systems.",
    url: "/about",
  },
};

export default function About() {
  return <AboutView />;
}
