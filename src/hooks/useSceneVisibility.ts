"use client";

import { useEffect, useRef, useState } from "react";

let _webgl: boolean | null = null;
/** One-time, cached check for WebGL availability. */
export function webglSupported(): boolean {
  if (_webgl !== null) return _webgl;
  if (typeof window === "undefined") return true;
  try {
    const c = document.createElement("canvas");
    _webgl = !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl") || c.getContext("experimental-webgl"))
    );
  } catch {
    _webgl = false;
  }
  return _webgl;
}

/**
 * Gates an expensive 3D scene:
 *  - `mounted` flips true only once the element approaches the viewport
 *    (so the WebGL context isn't created until needed), and stays mounted.
 *  - `frameloop` is "always" while visible and "never" while off-screen,
 *    so idle scenes stop consuming GPU/CPU.
 */
export function useSceneVisibility<T extends HTMLElement>(opts?: {
  mountMargin?: string;
}) {
  const ref = useRef<T>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setSupported(webglSupported());
    const el = ref.current;
    if (!el) return;

    const mountIO = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMounted(true);
          mountIO.disconnect();
        }
      },
      { rootMargin: opts?.mountMargin ?? "400px 0px" }
    );
    mountIO.observe(el);

    const visIO = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { threshold: 0.01 }
    );
    visIO.observe(el);

    return () => {
      mountIO.disconnect();
      visIO.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    ref,
    mounted: mounted && supported,
    supported,
    frameloop: (visible ? "always" : "never") as "always" | "never",
  };
}
