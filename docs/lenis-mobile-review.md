# Lenis mobile decision

Source review: https://github.com/darkroomengineering/lenis and https://kononenkogroup.com/_nuxt/BJv2xQ-z.js

The FLO configuration already left syncTouch at its false default. Therefore syncTouch instability is not established as the cause of the reported stutter. SVG painting, masks and text splitting remain possible independent causes.

The Kononenko application constructs Lenis with duration: Si(6, 2) and easing: DU, connects scroll to ScrollTrigger.update, advances Lenis through the GSAP ticker in milliseconds, and disables ticker lag smoothing. Si is a golden-ratio timing helper. That constructor does not enable syncTouch or provide a mobile-specific stutter fix.

Decision (updated at user request): keep Lenis instantiated on all screen sizes, matching Kononenko's initialization strategy. Explicit syncTouch: false preserves native touch scrolling. Reduced-motion users still do not receive Lenis. Desktop easing and duration remain unchanged.

No runtime/visual tests or FPS measurements were performed. This matches the reference mobile initialization strategy but does not establish that rendering stutter is resolved.
