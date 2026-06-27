import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { INDUSTRIES, SITE } from "@/lib/site";
import { IndustryDetail } from "@/components/industry/IndustryDetail";

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.id }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = INDUSTRIES.find((i) => i.id === slug);
  if (!industry) return {};
  const title = industry.title;
  const description = industry.overview;
  return {
    title,
    description,
    alternates: { canonical: `/industries/${industry.id}` },
    openGraph: {
      title: `${title} — ${SITE.legal}`,
      description,
      url: `${SITE.url}/industries/${industry.id}`,
      type: "article",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const idx = INDUSTRIES.findIndex((i) => i.id === slug);
  if (idx === -1) notFound();

  const industry = INDUSTRIES[idx];
  const prev = INDUSTRIES[(idx - 1 + INDUSTRIES.length) % INDUSTRIES.length];
  const next = INDUSTRIES[(idx + 1) % INDUSTRIES.length];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: industry.title,
        description: industry.overview,
        provider: { "@type": "Organization", name: SITE.legal, url: SITE.url },
        areaServed: "Worldwide",
        url: `${SITE.url}/industries/${industry.id}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
          { "@type": "ListItem", position: 2, name: "Industries", item: `${SITE.url}/industries` },
          {
            "@type": "ListItem",
            position: 3,
            name: industry.title,
            item: `${SITE.url}/industries/${industry.id}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <IndustryDetail
        industry={industry}
        prev={{ id: prev.id, title: prev.title }}
        next={{ id: next.id, title: next.title }}
      />
    </>
  );
}
