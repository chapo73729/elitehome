import type { MetadataRoute } from "next";
import { SITE, INDUSTRIES } from "@/lib/site";

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
      url: `${SITE.url}/industries`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...INDUSTRIES.map((i) => ({
      url: `${SITE.url}/industries/${i.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...["imprint", "privacy", "terms"].map((p) => ({
      url: `${SITE.url}/legal/${p}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
