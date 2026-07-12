import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SERVICES, SITE } from "@/lib/site";
import { SERVICE_META } from "@/lib/meta";
import { isLocale, defaultLocale, locales } from "@/lib/i18n";

export const alt = "BLACKFIRST service";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.flatMap((locale) => SERVICES.map((s) => ({ locale, slug: s.slug })));
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const svc = SERVICES.find((s) => s.slug === slug);
  const meta = SERVICE_META[slug]?.[locale] ?? SERVICE_META[slug]?.en;
  const title = meta?.title ?? SITE.legal;
  const accent = svc?.accent ?? "#c6a15b";
  const index = svc?.index ?? "";
  const wordmark = await readFile(join(process.cwd(), "public/brand/wordmark.png"));
  const wordmarkSrc = `data:image/png;base64,${wordmark.toString("base64")}`;

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
          color: "#f6f3ec",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 28, color: "#a8a49b" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={wordmarkSrc} width={315} height={28} alt="" />
          <span style={{ letterSpacing: 8, textTransform: "uppercase", fontSize: 22 }}>
            Service {index}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ width: 90, height: 4, background: accent, marginBottom: 28 }} />
          <div style={{ fontSize: 92, fontWeight: 800, letterSpacing: -2, lineHeight: 1 }}>{title}</div>
          <div style={{ marginTop: 24, fontSize: 30, color: "#a8a49b" }}>{SITE.tagline}</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
