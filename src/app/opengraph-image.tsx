import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const runtime = "edge";
export const alt = `${SITE.legal} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Og() {
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
        {/* thin crest frame */}
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
        {/* brandmark glyph — matches the favicon / on-site logo */}
        <svg width={96} height={96} viewBox="0 0 64 64" fill="none" style={{ marginBottom: 22 }}>
          <path d="M32 8 L56 32 L32 56 L8 32 Z" fill="none" stroke="#c7cbd1" strokeWidth={2} strokeLinejoin="round" opacity={0.5} />
          <path d="M18 42 L32 20 L46 42" fill="none" stroke="#c6a15b" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 42 H44" fill="none" stroke="#f6f3ec" strokeWidth={2.8} strokeLinecap="round" />
          <circle cx="32" cy="20" r="2.8" fill="#e4c88a" />
        </svg>
        <div
          style={{
            fontSize: 132,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          BLACKFIRST
          <span style={{ fontSize: 44, color: "#c6a15b", marginTop: 14 }}>®</span>
        </div>
        <div
          style={{
            marginTop: 16,
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
