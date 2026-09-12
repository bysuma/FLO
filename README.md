# FLO Engineering

TanStack Start, React, Tailwind CSS and GSAP. Bun is the package manager; the versions in package.json and bun.lock are pinned.

## Development

```sh
bun install --frozen-lockfile
bun run dev
```

## Validation and production

```sh
bun run typecheck
bun test
bun run build
bun run start
```

Build generates responsive images and robots.txt, then builds the app and prerenders `/`. Nitro uses the Node server preset; deploy `.output` and start `.output/server/index.mjs`. Do not use the old `dist/server` path. The GitHub Actions check uses the same frozen install, typecheck, tests and build.

## Public domain and SEO

Copy `.env.example` to `.env.local` and set `VITE_SITE_URL` to the verified public origin once available. Build again to emit canonical, absolute Open Graph URLs and sitemap.xml. Without this value, description and basic social metadata still work; no provisional canonical or sitemap URL is published. This variable is public, never a secret.

## Local images

Source assets live under `public/{section}`. `bun run images:generate` uses Sharp to generate smaller WebP candidates under each section's `responsive` directory and updates `src/lib/images.generated.json`. It never upscales or overwrites source files. Build runs this automatically and skips files newer than their originals.

Use `responsiveImage(src, sizes)` with native img/source elements. About uses picture for different mobile crops; services and section backgrounds also use picture so lazy loading and resolution selection work. Sizes describe rendered CSS width; project images allow for the desktop parallax crop. SVG icons remain SVG. The video has a local WebP poster; video poster has no native srcSet API.

When replacing an original, rerun image generation and commit the generated assets and manifest with it.

## Rendering and motion

All sections use the normal TanStack Start hydration lifecycle. There are no deferred Hydrate boundaries. Entrance animations still use IntersectionObserver.

The motion watchdog moves from boot to ready after six seconds. Only targets with a registered observer may remain pending after that point. A single section cannot mark unrelated sections ready. Browser APIs and GSAP setup remain inside effects/handlers, with scoped cleanup. No full-page ClientOnly or disabled SSR.

Consult AGENTS.md for Intent skill loading.
