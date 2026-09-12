// Before hydration, prepare entrances.
// After the watchdog, only elements with a registered observer remain hidden.
export const motionInitialCSS = `@media (prefers-reduced-motion: no-preference) {
html[data-motion="boot"] :is([data-hero-mask], [data-text-reveal], [data-entrance]):not([data-motion-ready]),
html[data-motion] [data-motion-pending]:not([data-motion-ready]) { opacity: 0; }
}`

export const motionBootstrap = `if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.motion='boot';setTimeout(function(){document.documentElement.dataset.motion='ready'},6000)}`
