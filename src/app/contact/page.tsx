import type { Metadata } from "next";
import Link from "next/link";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Engage ARDLABS® — start a conversation about designing and building software, platforms, data & AI, and cloud.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact · ARDLABS®",
    description: "Start a conversation with ARDLABS®.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="relative">
      <div className="container-x pt-32">
        <Link href="/" className="link-underline font-mono text-xs tracking-widest text-mist">
          ← Home
        </Link>
      </div>
      <Contact />
    </main>
  );
}
