import type { MetadataRoute } from "next";
import { SITE, INDUSTRIES } from "@/lib/site";
import { INSIGHTS } from "@/lib/insights";
import { WORK } from "@/lib/work";
import { locales } from "@/lib/i18n";

/**
 * Every public path, emitted once per locale (prefixed) with hreflang
 * alternates linking the locale variants together.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  type Entry = {
    path: string;
    lastModified: Date;
    changeFrequency: "weekly" | "monthly" | "yearly";
    priority: number;
  };

  const entries: Entry[] = [
    { path: "", lastModified: now, changeFrequency: "monthly", priority: 1 },
    { path: "/services", lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...INDUSTRIES.map((i) => ({
      path: `/services/${i.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...["about", "approach", "work", "careers", "contact"].map((p) => ({
      path: `/${p}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...WORK.map((w) => ({
      path: `/work/${w.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    { path: "/insights", lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...INSIGHTS.map((i) => ({
      path: `/insights/${i.slug}`,
      lastModified: new Date(i.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...["imprint", "privacy", "terms"].map((p) => ({
      path: `/legal/${p}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];

  return entries.flatMap((e) =>
    locales.map((locale) => ({
      url: `${SITE.url}/${locale}${e.path}`,
      lastModified: e.lastModified,
      changeFrequency: e.changeFrequency,
      priority: e.priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${SITE.url}/${l}${e.path}`])
        ),
      },
    }))
  );
}
