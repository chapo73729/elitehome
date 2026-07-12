import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.legal} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Og() {
  // the official wordmark, embedded as a data URI (node runtime)
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
          alignItems: "center",
          justifyContent: "center",
          background: "#050505",
          backgroundImage:
            "radial-gradient(60% 60% at 50% 120%, rgba(198,161,91,0.30), transparent 70%)",
          color: "#f6f3ec",
          fontFamily: "sans-serif",
        }}
      >
        {/* thin frame */}
        <div
          style={{
            position: "absolute",
            top: 44,
            left: 44,
            right: 44,
            bottom: 44,
            border: "1px solid rgba(199,203,209,0.18)",
            display: "flex",
          }}
        />
        {[
          { top: 28, left: 28, borderTop: "3px solid rgba(198,161,91,0.9)", borderLeft: "3px solid rgba(198,161,91,0.9)" },
          { top: 28, right: 28, borderTop: "3px solid rgba(198,161,91,0.9)", borderRight: "3px solid rgba(198,161,91,0.9)" },
          { bottom: 28, left: 28, borderBottom: "3px solid rgba(198,161,91,0.9)", borderLeft: "3px solid rgba(198,161,91,0.9)" },
          { bottom: 28, right: 28, borderBottom: "3px solid rgba(198,161,91,0.9)", borderRight: "3px solid rgba(198,161,91,0.9)" },
        ].map((s, i) => (
          <div key={i} style={{ position: "absolute", width: 34, height: 34, display: "flex", ...s }} />
        ))}
        <div
          style={{
            position: "absolute",
            top: 62,
            right: 70,
            fontSize: 22,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(168,164,155,0.9)",
            display: "flex",
          }}
        >
          Geneva · Switzerland
        </div>
        {/* the official wordmark */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={wordmarkSrc} width={880} height={78} alt="" />
        <div
          style={{
            marginTop: 44,
            fontSize: 30,
            letterSpacing: "0.35em",
            color: "#a8a49b",
            textTransform: "uppercase",
          }}
        >
          Executive Mobility · Swiss Precision
        </div>
      </div>
    ),
    { ...size }
  );
}
