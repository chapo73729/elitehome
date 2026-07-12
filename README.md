# BLACKFIRST® — Executive Chauffeur & Private Mobility

> The marketing site for BLACKFIRST®, a Geneva-based executive chauffeur and
> private-mobility house — bilingual EN/FR, cinematic, built to feel closer to a
> five-star hotel or private aviation than to a ride hail.
>
> Positioning: **Executive Mobility. Swiss Precision. Beyond the journey.**

This document is the handoff reference: stack, architecture, conventions and the
constraints a new team should not rediscover the hard way.

## Tech stack

- **Next.js 15** (App Router, static generation) · **React 19** · **TypeScript (strict)**
- **Tailwind CSS v4** — design tokens live in `@theme` inside `src/app/globals.css`
- **framer-motion 12** for UI motion, **Lenis** for smooth scroll (`window.__lenis`)
- Light **2D-canvas** visuals (`NightDrive`, `PageHeaderFX`, `RouteMap`) instead of
  heavy WebGL — cheap, capped-DPR, paused off-screen, static under reduced motion
- **@vercel/analytics** + **speed-insights**
- Reservation / enquiry relay via **Web3Forms** (`WEB3FORMS_ACCESS_KEY`, server-side
  in `/api/contact`)

## Architecture

### Routing & i18n

- `src/app/[locale]/layout.tsx` **is the root layout** (renders `<html lang>`
  server-side). There is intentionally **no** `src/app/layout.tsx`.
- Locales: `en` (source of truth) and `fr`. `src/middleware.ts` redirects `/`
  to the visitor's locale (cookie → `Accept-Language` → `en`).
- Copy lives in `src/lib/content.ts`: the `fr` object is deep-merged over `en`
  (arrays by index), and a typographic transform applies French micro-typography
  (thin NBSP before `; : ! ?`, inside « », curly apostrophes) automatically —
  **write plain FR strings; do not hand-place NBSPs**.
- Language-neutral structural data (services, fleet specs, served locations,
  brand + contact details) lives in `src/lib/site.ts`.
- Server-side per-route metadata lives in `src/lib/meta.ts` so
  `generateMetadata()` never imports the client-only content module.

### Routes

`/` (home) · `/services` + `/services/[slug]` (airport-transfer,
business-chauffeur, events, long-distance) · `/fleet` · `/locations` ·
`/about` · `/booking` · `/contact` · `/legal/{imprint,privacy,terms}`.

### Homepage

`src/components/layout/Experience.tsx` composes the cinematic flow: Loader →
Hero (Geneva night-drive backdrop + Executive HUD) → Manifesto → Cabin →
RouteMap → Services → Fleet → Booking CTA.

## Development

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
npx tsc --noEmit  # strict type check
```

Environment:

| Variable | Purpose |
|---|---|
| `WEB3FORMS_ACCESS_KEY` | Server-side key for the enquiry/booking relay (`/api/contact`) |

> Constrained machines: `NODE_OPTIONS="--max-old-space-size=3072" npm run build`.

## Before going live

- **Legal**: the imprint / privacy / terms pages carry Swiss placeholders marked
  with the `<Fill>` component (company name, UID/VAT, registered address). Replace
  them with the real BLACKFIRST Sàrl details.
- **Contact details**: `src/lib/site.ts` holds placeholder phone / WhatsApp
  numbers and the `blackfirst.ch` domain — swap in the real ones.
- **Imagery**: the hero and cabin visuals are lightweight canvas/CSS stand-ins for
  the heavier 3D scenes in the brief; replace with real fleet / Geneva photography
  or a WebGL scene when assets are ready.

## Constraints — read before "fixing"

- **CSP** (in `next.config.ts`) keeps `script-src 'self' 'unsafe-inline'`. A
  nonce + `strict-dynamic` policy was tried and reverted (SSG can't carry
  per-request nonces). Everything the browser touches is same-origin.
- **Loader**: the first-visit cinematic is a deliberate product decision.
- **Reduced motion** is honored everywhere (loader, canvas visuals, transitions).
  Any new animation must have a reduced-motion path.
