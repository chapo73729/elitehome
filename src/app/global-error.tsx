"use client";

import { useLang } from "@/lib/lang";

const T = {
  en: {
    h1: "Signal interrupted.",
    body: "A critical error occurred. Please reload to continue.",
    reload: "Reload",
  },
  fr: {
    h1: "Signal interrompu.",
    body: "Une erreur critique est survenue. Veuillez recharger pour continuer.",
    reload: "Recharger",
  },
};

export default function GlobalError({ reset }: { reset: () => void }) {
  const lang = useLang();
  const t = T[lang];
  return (
    <html lang={lang}>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#050505",
          color: "#e8e8ec",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "0 1.5rem",
        }}
      >
        <h1 style={{ fontSize: "clamp(2.5rem,8vw,5rem)", fontWeight: 700, letterSpacing: "-0.03em" }}>
          {t.h1}
        </h1>
        <p style={{ color: "#9a9aa3", maxWidth: 420, marginTop: "1rem" }}>
          {t.body}
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: "2rem",
            border: 0,
            borderRadius: 999,
            background: "#e8e8ec",
            color: "#050505",
            padding: "0.85rem 1.75rem",
            fontSize: "0.9rem",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          {t.reload}
        </button>
      </body>
    </html>
  );
}
