# Motion reference

Inspected 2026-09-11: https://kononenkogroup.com/_nuxt/BJv2xQ-z.js

The reference uses Nuxt, GSAP SplitText, and Lenis. FLO retains React and Kugiri.

The bundle's `Si(step = 6, offset, base = 0.1)` computes a rounded golden-ratio scale (`base * 1.61803398875 ** (step - 1)`, subtracting the offset step when supplied).

- Lenis duration: `Si(6, 2)` = 0.947 seconds.
- Lenis easing: `t === 1 ? 1 : 1 - 2 ** (-Si(11, 6) * t)`, exponent 11.19.
- GSAP ticker calls `lenis.raf(time * 1000)`; lag smoothing disabled.
- Text: masked lines, `yPercent: 101`, duration `Si()` = 1.109 seconds, stagger `Si(1)` = 0.1 seconds; default delay 0, overridable per target.
- Default text easing: `cubic-bezier(0.17, 0.84, 0.44, 1)`.
- Reference trigger: top at viewport bottom minus 15% on desktop; viewport bottom on mobile.

Applied Lenis values exactly. Adapted the line movement to pixel distances measured from each line, retaining Kugiri and the existing IntersectionObserver triggers. Per the requested faster movement with more delay, FLO uses 800ms text duration, 220ms initial delay, and 200ms line stagger. Other entrances use 850ms duration with 220ms initial delay and 200ms stagger. The SSR preparation and reduced-motion fallback remain in place.


## Current direction

The reference configuration above is historical. Following user feedback, the page returned to the original Lenis defaults and the prior reveal curve. All visible copy now uses TextReveal, including controls, metadata, quotes, and footer content. Numeric values use line reveals instead of count-up. Images use cropped entrances with a subtle scale; CSS overrides coordinate copy timing within each section. No bundle inspection or tests were run for this revision, as requested.
