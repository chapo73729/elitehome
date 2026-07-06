import { SITE } from "@/lib/site";
import { INSIGHTS } from "@/lib/insights";

export const dynamic = "force-static";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** RSS 2.0 feed of the studio's Insights (English canon). */
export async function GET() {
  const items = [...INSIGHTS]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map((p) => {
      const url = `${SITE.url}/en/insights/${p.slug}`;
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${esc(p.excerpt)}</description>
      <category>${esc(p.category)}</category>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE.legal)} — Insights</title>
    <link>${SITE.url}/en/insights</link>
    <atom:link href="${SITE.url}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Notes from ${esc(SITE.legal)} on digital engineering — shipping reliable software, applied AI, and infrastructure refined to the detail.</description>
    <language>en</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
