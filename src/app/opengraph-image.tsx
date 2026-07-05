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
            "radial-gradient(60% 60% at 50% 120%, rgba(79,140,255,0.35), transparent 70%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        {/* Compile signature: dashed blueprint frame + corner brackets */}
        <div
          style={{
            position: "absolute",
            top: 44,
            left: 44,
            right: 44,
            bottom: 44,
            border: "1px dashed rgba(79,140,255,0.35)",
            display: "flex",
          }}
        />
        {[
          { top: 28, left: 28, borderTop: "3px solid rgba(79,140,255,0.9)", borderLeft: "3px solid rgba(79,140,255,0.9)" },
          { top: 28, right: 28, borderTop: "3px solid rgba(79,140,255,0.9)", borderRight: "3px solid rgba(79,140,255,0.9)" },
          { bottom: 28, left: 28, borderBottom: "3px solid rgba(79,140,255,0.9)", borderLeft: "3px solid rgba(79,140,255,0.9)" },
          { bottom: 28, right: 28, borderBottom: "3px solid rgba(79,140,255,0.9)", borderRight: "3px solid rgba(79,140,255,0.9)" },
        ].map((s, i) => (
          <div key={i} style={{ position: "absolute", width: 34, height: 34, display: "flex", ...s }} />
        ))}
        <div
          style={{
            position: "absolute",
            top: 62,
            right: 70,
            fontSize: 22,
            letterSpacing: "0.1em",
            color: "rgba(139,147,160,0.9)",
            display: "flex",
          }}
        >
          {"// compile: ardlabs … ok"}
        </div>
        <div
          style={{
            fontSize: 150,
            fontWeight: 800,
            letterSpacing: "-0.05em",
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          ARDLABS
          <span style={{ fontSize: 48, color: "#4f8cff", marginTop: 18 }}>®</span>
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 34,
            letterSpacing: "0.4em",
            color: "#9a9aa3",
            textTransform: "uppercase",
          }}
        >
          Digital Engineering Studio
        </div>
      </div>
    ),
    { ...size }
  );
}
