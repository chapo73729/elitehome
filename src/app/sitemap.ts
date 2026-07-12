import type { MetadataRoute } from "next";
import { SITE, SERVICES } from "@/lib/site";
import { DESTINATIONS } from "@/lib/destinations";
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
    ...SERVICES.map((s) => ({
      path: `/services/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { path: "/booking", lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...DESTINATIONS.map((d) => ({
      path: `/locations/${d.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: d.slug === "geneva" ? 0.9 : 0.8,
    })),
    ...["fleet", "locations", "about", "contact"].map((p) => ({
      path: `/${p}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
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
        languages: {
          ...Object.fromEntries(locales.map((l) => [l, `${SITE.url}/${l}${e.path}`])),
          "x-default": `${SITE.url}/fr${e.path}`,
        },
      },
    }))
  );
}
