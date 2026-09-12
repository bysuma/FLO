# GSAP performance review

Static code review using the repository gsap-performance skill. No browser trace, build, or visual tests were run; 60/120 fps is not verified.

## Corrections

- Decorative SVG timelines pause while outside the viewport and resume on re-entry. Visibility observers disconnect on completion or context cleanup.
- Mask-only entrances no longer write identity transforms or clear transforms owned by another effect.
- Text resize handling consumes ResizeObserver border-box measurements instead of performing another synchronous bounding-box read.
- Parallax receives a temporary transform layer hint only while its ScrollTrigger is active, removed on exit and unmount.

## Confirmed architecture

- Lenis uses the GSAP ticker, without a second animation loop.
- Parallax animates the photo inside a stable frame; the entrance mask belongs to the frame.
- GSAP contexts and media-query lifecycles revert animations on teardown.
- Reduced-motion handling remains present.
- No React state updates occur per frame in the active homepage motion components. The unused CountUp component does use state per frame.

## Remaining risks requiring a browser performance trace

- stroke-dashoffset drawing repaints SVG strokes; large compound paths are not compositor-only effects.
- Animated clip paths and nested SVG/CSS masks can incur paint and compositing costs dependent on browser and device.
- Kugiri splits text and measures lines on entry; simultaneous text blocks can cause one-time layout spikes.
- Overscan increases the parallax photo's rendered surface area.

Approval is limited to the reviewed code practices. Actual frame budgets (16.67 ms at 60 Hz and 8.33 ms at 120 Hz) need measurement on the target device, ideally in a production build.
