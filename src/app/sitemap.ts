import type { MetadataRoute } from "next";
import { SITE, INDUSTRIES } from "@/lib/site";
import { INSIGHTS } from "@/lib/insights";
import { WORK } from "@/lib/work";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE.url,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE.url}/services`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...INDUSTRIES.map((i) => ({
      url: `${SITE.url}/services/${i.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...["about", "approach", "work", "careers", "contact"].map((p) => ({
      url: `${SITE.url}/${p}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...WORK.map((w) => ({
      url: `${SITE.url}/work/${w.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    {
      url: `${SITE.url}/insights`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    ...INSIGHTS.map((i) => ({
      url: `${SITE.url}/insights/${i.slug}`,
      lastModified: new Date(i.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...["imprint", "privacy", "terms"].map((p) => ({
      url: `${SITE.url}/legal/${p}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
