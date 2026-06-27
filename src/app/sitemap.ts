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
    ...INDUSTRIES.map((i) => ({
      url: `${SITE.url}/industries/${i.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
