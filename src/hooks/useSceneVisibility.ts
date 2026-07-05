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

/* Staggered mount queue: when several scenes cross their mount margin in the
   same burst (typical on load or a fast scroll), chaining their mounts through
   idle callbacks keeps two WebGL contexts from compiling shaders in the same
   frame burst — the main source of the long-task spikes the perf audit
   measured. */
let mountChain: Promise<void> = Promise.resolve();
function enqueueMount(run: () => void) {
  mountChain = mountChain.then(
    () =>
      new Promise<void>((resolve) => {
        const w = window as unknown as {
          requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
        };
        const go = () => {
          run();
          // small gap so the just-mounted canvas gets its init frame alone
          setTimeout(resolve, 120);
        };
        if (w.requestIdleCallback) w.requestIdleCallback(go, { timeout: 800 });
        else setTimeout(go, 50);
      })
  );
}

/**
 * Gates an expensive 3D scene:
 *  - `mounted` flips true only once the element approaches the viewport
 *    (so the WebGL context isn't created until needed); mounts are staggered
 *    through an idle queue so concurrent scenes never init in one burst.
 *  - scenes far behind/ahead (beyond the retain margin) UNMOUNT again, so a
 *    long page holds ~2 live contexts instead of accumulating all of them
 *    (hysteresis: mount at ~400px, release at ~1600px — no thrash band).
 *  - `frameloop` is "always" while visible and "never" while off-screen,
 *    so idle scenes stop consuming GPU/CPU.
 */
export function useSceneVisibility<T extends HTMLElement>(opts?: {
  mountMargin?: string;
  retainMargin?: string;
}) {
  const ref = useRef<T>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [supported, setSupported] = useState(true);
  const mountedRef = useRef(false);
  const pendingRef = useRef(false);

  useEffect(() => {
    setSupported(webglSupported());
    const el = ref.current;
    if (!el) return;

    const mountIO = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !mountedRef.current && !pendingRef.current) {
          pendingRef.current = true;
          enqueueMount(() => {
            pendingRef.current = false;
            mountedRef.current = true;
            setMounted(true);
          });
        }
      },
      { rootMargin: opts?.mountMargin ?? "400px 0px" }
    );
    mountIO.observe(el);

    // release the context once the section is far outside the retain band
    const retainIO = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting && mountedRef.current) {
          mountedRef.current = false;
          setMounted(false);
        }
      },
      { rootMargin: opts?.retainMargin ?? "1600px 0px" }
    );
    retainIO.observe(el);

    const visIO = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { threshold: 0.01 }
    );
    visIO.observe(el);

    return () => {
      mountIO.disconnect();
      retainIO.disconnect();
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
