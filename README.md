# ARDLABS® — Digital Engineering Studio

> The marketing site for ARDLABS®, a digital engineering studio (software,
> platforms, data & AI, cloud) — bilingual EN/FR, built around a single visual
> signature: **« Compile »** — the site draws its own blueprint, sweeps it, and
> compiles into the final content.

This document is the handoff reference: stack, architecture, conventions,
verification workflow, and the known constraints a new team should not
rediscover the hard way.

## Tech stack

- **Next.js 15** (App Router, static generation) · **React 19** · **TypeScript (strict)**
- **Tailwind CSS v4** — design tokens live in `@theme` inside `src/app/globals.css`
- **framer-motion 12** for UI motion, **Lenis** for smooth scroll (exposed as `window.__lenis`)
- **React Three Fiber** + **drei** + **@react-three/postprocessing** for the 3D scenes
- **@vercel/analytics** (page views + custom conversion events)
- Contact relay via **Web3Forms** (`WEB3FORMS_ACCESS_KEY` env var, used server-side in `/api/contact`)

## Architecture

### Routing & i18n

- `src/app/[locale]/layout.tsx` **is the root layout** — it renders
  `<html lang={locale}>` server-side. There is intentionally **no**
  `src/app/layout.tsx`.
- Locales: `en` (source of truth) and `fr`. `src/middleware.ts` redirects `/`
  to the visitor's locale (cookie → `Accept-Language` → `en`).
- 404s are handled by the `[locale]/[...rest]` catch-all so the not-found page
  is localized.
- Copy lives in `src/lib/content.ts`: the `fr` object is deep-merged over `en`,
  and a typographic transform (`frTypo`/`frDeep`) automatically applies French
  micro-typography (thin no-break spaces before `; : ! ?`, inside « », curly
  apostrophes) — **write plain FR strings; do not hand-place NBSPs**.
- Server-side metadata (titles/descriptions per locale) lives in
  `src/lib/meta.ts` so `generateMetadata()` never imports the client-side
  content module.

### The « Compile » signature

`src/components/ui/Compile.tsx` wraps a section and plays the signature
sequence on first reveal: blueprint corner brackets draw on, a dashed frame and
dimension ticks appear, a mono annotation types (`// compile: {label} … ok`), a
luminous sweep passes, and the ghosted content resolves to final. A faint
blueprint residue remains at rest. It is applied to the homepage chapters, all
inner pages, the loader chrome, the page transition, the 404, and the OG image
— when extending the site, new sections should speak this language.

### 3D system

- Scenes: `HeroScene`, `NeuralFlow`, `WarpField` (+ the living `WorldMap`,
  which is 2D canvas/SVG).
- `src/hooks/useSceneVisibility.ts` governs every WebGL canvas: contexts mount
  ~400px before the viewport through a **staggered idle queue** (never two
  shader compilations in one burst) and **unmount again beyond a 1600px retain
  band**, so a full-page scroll holds ~2 live contexts instead of
  accumulating all of them. Frameloops stop entirely off-screen.
- `src/lib/journey.ts` is a shared, smoothed page-scroll signal
  (progress + velocity, single lerp). All scenes read it so the whole page
  behaves as one continuous camera move. Reduced motion pins it to zero.

### Sound

`src/lib/audio.ts` is a lazy WebAudio engine (created only on user gesture,
suspended when the tab hides): a quiet ambient pad plus `hover`, `click`,
`whoosh` (page transitions) and `success` (brief submitted) cues. Off by
default; toggled via the sound control in the header.

### Contact — the « Brief » flow

`src/components/sections/Contact.tsx` is a 4-step guided brief
(name → email → domain → message) with per-step validation, Enter-to-advance,
and a blueprint "compiled brief" review before submit. Submission posts to
`/api/contact` (origin-checked, honeypot, input-hardened) which relays through
Web3Forms. Conversion events: `brief_step` and `brief_transmitted`.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npx tsc --noEmit # strict type check
```

Environment:

| Variable | Purpose |
|---|---|
| `WEB3FORMS_ACCESS_KEY` | Server-side key for the contact relay (`/api/contact`) |

> Tip: constrained machines may need
> `NODE_OPTIONS="--max-old-space-size=3072" npm run build`.

## Structure

```
src/
  app/
    [locale]/          # ROOT layout (html lang), all pages, [...rest] 404
    api/contact/       # hardened contact relay (origin check, honeypot)
    opengraph-image.tsx# dynamic OG image in the Compile language
    sitemap.ts, robots.ts, manifest.ts
  components/
    layout/            # Loader, PageTransition, Header, Footer, Cursor, overlays
    sections/          # homepage chapters + Contact (Brief flow)
    industry/          # service-detail pages (IndustryDetail)
    views/             # inner-page views (work, about, insights, legal…)
    three/             # R3F scenes + shaders
    ui/                # Compile, Reveal, Magnetic, ChapterNumeral, WorldMap…
  hooks/               # useSceneVisibility (WebGL lifecycle), device tier
  lib/                 # content (EN + FR merge), meta, journey, audio, i18n, fonts
```

## Known constraints — read before "fixing"

- **CSP**: the Content-Security-Policy is set in `next.config.ts` and keeps
  `script-src 'self' 'unsafe-inline'`. A per-request **nonce +
  `strict-dynamic` CSP was tried and reverted**: the site is statically
  generated, so HTML cannot carry per-request nonces — it blocked every
  script. Do not reintroduce it without moving the affected pages to dynamic
  rendering. (Documented in `src/middleware.ts` and `next.config.ts`.)
- **Loader**: the full first-visit cinematic (~3.7s) is a deliberate product
  decision, accepted with its LCP cost. Do not shorten or skip it without a
  new decision from the owner.
- **Fonts**: Geist is loaded once (`fontDisplay`); `--font-sans` aliases it in
  `globals.css`. Don't add a second `next/font` load of the same family.
- **Reduced motion** is honored everywhere (loader, scenes, journey, Compile,
  transitions). Any new animation must have a reduced-motion path.
- Case-study/partner content is representative placeholder copy — replace with
  real client material before major marketing pushes.

## Quality gates (what "done" means here)

Every change should pass: `npx tsc --noEmit` clean → `npm run build` clean →
all routes render in both locales → responsive intact (360px up) →
reduced-motion path works → no console errors → Lighthouse/SEO unchanged
or better.
