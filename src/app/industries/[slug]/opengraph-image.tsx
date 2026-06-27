import { ImageResponse } from "next/og";
import { INDUSTRIES, SITE } from "@/lib/site";

export const alt = "ARDLABS Industry";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.id }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = INDUSTRIES.find((i) => i.id === slug);
  const title = industry?.title ?? SITE.legal;
  const accent = industry?.accent ?? "#5b8cff";
  const index = industry?.index ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#050505",
          backgroundImage: `radial-gradient(60% 70% at 80% 10%, ${accent}33, transparent 60%)`,
          padding: 80,
          fontFamily: "sans-serif",
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#9a9aa3" }}>
          <span style={{ fontWeight: 700, letterSpacing: -1 }}>
            ARDLABS<span style={{ color: accent }}>®</span>
          </span>
          <span style={{ letterSpacing: 8, textTransform: "uppercase", fontSize: 22 }}>
            Industry {index}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ width: 90, height: 4, background: accent, marginBottom: 28 }} />
          <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -3, lineHeight: 1 }}>
            {title}
          </div>
          <div style={{ marginTop: 24, fontSize: 30, color: "#9a9aa3" }}>
            {industry?.tagline ?? "Private Ventures"}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
