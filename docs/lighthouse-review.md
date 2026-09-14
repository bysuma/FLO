# Lighthouse optimization — 2026-09-14

The supplied report measured the homepage in desktop mode: Performance 98,
Accessibility 100, Best Practices 100, SEO 100. An independent run against the
then-deployed site also identified a low-contrast primary button and a missing
favicon request. The unminified JavaScript warning in the supplied report belongs
to a Chrome extension, not this application.

## Historical result before restoring hero animations

Lighthouse 13.4.1, production build, clean headless Chromium, default simulated
throttling for each preset, local HTTPS/HTTP/2 preview with gzip:

| Profile | Performance | Accessibility | Best Practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| Desktop | 100 | 100 | 100 | 100 |
| Mobile | 95 | 100 | 100 | 100 |

The headline and media entrance animations were subsequently restored at the
user’s request. The scores below must be remeasured for the current version;
they are not current scores.

The local TLS certificate was self-signed, so the test browser ignored certificate
errors. These are local build results, not a claim that the Vercel deployment has
already been updated or revalidated. Mobile performance has not reached 100.
Recheck the deployed URL after publishing; scores depend on network and CPU.

## Changes

- Preserve the original homepage headline reveal and media entrance animation.
  An initial attempt to remove these animations was reverted at the user’s request.
- Deliver a 960px AVIF poster (~26 KB instead of the 166 KB WebP original), with
  high fetch priority. Keep it visible until the video starts playing.
- Serve separate 640px mobile and 960px desktop video renditions (~1 MB and ~2 MB),
  retaining the complete duration. Preserve the original file for regeneration.
- Do not preload video; existing visibility/reduced-motion controls start playback
  only when appropriate. Reduced motion shows the poster without fetching video.
- Generate compressed responsive images at every candidate width, including the
  largest width, rather than serving the heavy original at the largest size.
- Invalidate generated images when the generation settings/script change.
- Add Latin webfont subsets with full-font fallback for other Unicode ranges.
- Include compiled CSS in the initial HTML and defer below-fold/footer/modal images
  using native lazy loading, avoiding unnecessary React SSR image preloads.
- Slightly darken the primary button background for accessible white text and
  declare the existing SVG logo as the favicon.

Video guidance: https://web.dev/learn/performance/video-performance

## Verification and regeneration

`bun run build`, `bun run typecheck`, and all 7 `bun test` tests pass.

Browser regression checks against the production preview:

- `tests/browser/hero-loading.mjs`: headline/poster without JavaScript, video
  playback and correct desktop/mobile source, no mobile Lenis, reduced motion.
- `tests/browser/mobile-navigation.mjs`: About, return home, same-page anchor,
  transition visibility, reduced motion, scroll unlock, no JavaScript errors.

Set `BASE_URL` to the preview URL. Both browser checks accept `PLAYWRIGHT_MODULE`
as a path to an existing Playwright module; otherwise they import `playwright`.

Images regenerate during build. Regenerate fonts with
`python3 scripts/generate-fonts.py` (requires `fonttools[woff]`), and video renditions
with `bash scripts/generate-videos.sh` (requires ffmpeg). Generated assets are stored alongside the source so those extra tools are not
required by the production build.
