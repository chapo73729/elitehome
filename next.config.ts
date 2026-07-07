import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // three.js and its R3F ecosystem ship ESM that benefits from transpilation
  transpilePackages: ["three"],
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/industries", destination: "/services", permanent: true },
      { source: "/industries/:slug", destination: "/services/:slug", permanent: true },
    ];
  },
  async headers() {
    /* ── "Bunker" hardening ──────────────────────────────────────────────
       Everything the browser touches is same-origin: fonts, images, the
       audio bed and the contact fetch (/api/contact — the Web3Forms relay
       is server-to-server, so the browser never reaches an external host).
       The CSP is therefore locked to 'self' with no external allow-list.

       CSP note: a nonce + 'strict-dynamic' policy is NOT viable here — the
       site is SSG and prerendered inline scripts can't carry per-request
       nonces (verified: it blocked every script). 'unsafe-inline' for
       script-src is the workable model for static output; script-src-attr
       'none' still blocks inline event-handler attributes as defence in
       depth. */
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "script-src-attr 'none'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "media-src 'self'",
      "connect-src 'self'",
      "worker-src 'self' blob:",
      "manifest-src 'self'",
      "frame-src 'none'",
      "child-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; ");

    /* Deny every powerful feature; opt out of the ad-targeting APIs
       (Topics/FLoC) so the browser can't be recruited to profile visitors.
       autoplay is allowed for self — the sound bed plays on the user's own
       gesture. */
    const permissions = [
      "accelerometer=()",
      "autoplay=(self)",
      "bluetooth=()",
      "browsing-topics=()",
      "camera=()",
      "display-capture=()",
      "encrypted-media=()",
      "fullscreen=(self)",
      "geolocation=()",
      "gyroscope=()",
      "hid=()",
      "idle-detection=()",
      "interest-cohort=()",
      "local-fonts=()",
      "magnetometer=()",
      "microphone=()",
      "midi=()",
      "payment=()",
      "screen-wake-lock=()",
      "serial=()",
      "usb=()",
      "xr-spatial-tracking=()",
    ].join(", ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          // no framing at all — the site is never embedded anywhere
          { key: "X-Frame-Options", value: "DENY" },
          // never leak a referrer to anyone, on-site or off
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "Permissions-Policy", value: permissions },
          // isolate the browsing context + keep our resources same-origin
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
