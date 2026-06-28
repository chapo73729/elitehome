import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WORK, getCase } from "@/lib/work";
import { SITE } from "@/lib/site";
import { CaseStudyView } from "@/components/work/CaseStudyView";

export function generateStaticParams() {
  return WORK.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const w = getCase(slug);
  if (!w) return { title: "Case study not found" };
  return {
    title: `${w.name} — ${w.field}`,
    description: w.summary,
    alternates: { canonical: `/work/${w.slug}` },
    openGraph: {
      title: `${w.name} · ARDLABS®`,
      description: w.summary,
      url: `/work/${w.slug}`,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const w = getCase(slug);
  if (!w) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: w.name,
    about: w.field,
    description: w.summary,
    creator: { "@type": "Organization", name: SITE.legal },
    url: `${SITE.url}/work/${w.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CaseStudyView slug={w.slug} />
    </>
  );
}
