# ARDLABS® — Private Ventures

> A cinematic, immersive marketing site for ARDLABS® — engineered to feel like
> stepping into a laboratory of the future.

Dark, luxurious, minimal and ultra-immersive: a custom particle boot sequence,
a GPU particle planet, an interactive neural core, a live global network globe,
and a dozen scroll-driven sections built for an Awwwards-grade finish.

## Tech stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript**
- **Three.js** + **React Three Fiber** + **Drei** + **postprocessing** (Bloom, Vignette, Chromatic Aberration, Noise)
- **GSAP-grade motion** via **Framer Motion**
- **Lenis** smooth scroll
- **Tailwind CSS v4**
- Custom **GLSL shaders** (simplex-noise particle planet, fresnel atmosphere, twinkling starfield)

## Experience

| # | Section | Highlight |
|---|---------|-----------|
| — | Loader | Particles assemble the ARDLABS wordmark, then explode into the hero |
| — | Hero | GPU particle planet, mouse-reactive, scroll-driven camera dolly |
| 01 | Vision | AI-style word-by-word "writing" reveal |
| 02 | AI Core | Interactive 3D neural network with travelling signal pulses |
| 03 | Global Network | Dotted globe, city markers, animated arcs & orbiting satellites |
| 04 | Industries | Six magnetic, tilt-reactive "universe" cards |
| 05–08 | Capabilities | AI · Software · Industrial · Maritime, each with a bespoke canvas motif |
| 09 | Timeline | Scroll-tracked innovation spine |
| 11 | Tech Stack | Interactive wall + infinite marquee |
| 12 | Statistics | Animated counters |
| 13 | Future Projects | Holographic, perspective-tilt cards |
| 14 | Contact | Aurora background + modern enquiry form |

## Performance & quality

- 3D scenes are **dynamically imported** (`ssr: false`) and **device-tiered** — particle
  counts and post-processing scale to the hardware.
- Canvas motifs **pause when offscreen** (IntersectionObserver).
- Full **reduced-motion** support; the loader and smooth scroll degrade gracefully.
- Complete **SEO**: metadata, Schema.org JSON-LD, Open Graph + Twitter cards,
  dynamic OG image, sitemap, robots and web manifest.
- Custom blended cursor, magnetic buttons, film grain, vignette and scroll progress.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

> Tip: the production build benefits from extra heap on constrained machines —
> `NODE_OPTIONS="--max-old-space-size=3072" npm run build`.

## Structure

```
src/
  app/                 # routes, metadata, sitemap, robots, manifest, OG image
  components/
    loader/            # cinematic boot sequence
    layout/            # smooth scroll, cursor, navbar, footer, experience shell
    sections/          # all page sections
    three/             # R3F scenes + GLSL shaders
    ui/                # buttons, reveals, counters, canvas motifs, marquee
  hooks/               # device-tier detection
  lib/                 # site content & fonts
```
