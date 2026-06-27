"use client";

import React from "react";

/**
 * Catches any error thrown while rendering a 3D scene (e.g. WebGL context
 * loss) and shows a calm gradient fallback instead of crashing the page.
 */
export class SceneBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    /* swallow — the visual is non-essential */
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(91,140,255,0.12),transparent_70%)]" />
        )
      );
    }
    return this.props.children;
  }
}
