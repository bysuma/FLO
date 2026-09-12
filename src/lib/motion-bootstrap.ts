// Shared by server CSS and client observers: targets are hidden before hydration.

export const motionInitialCSS = `@media (prefers-reduced-motion: no-preference) {
html[data-motion] :is([data-hero-mask], [data-text-reveal], .section-backdrop, .motion-decoration, .button:not(button .button), .hero-copy a, .navbar a, .navbar button, #projects button:has(.button), .about-gallery > img, .service-card, #projects .project-image, .testimonial-card, .stat-card, .footer img):not([data-motion-ready]) { opacity: 0; }
}`

// Executed in the head before any content paints. If hydration fails, fail open.
export const motionBootstrap = `if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.motion='boot';setTimeout(function(){if(document.documentElement.dataset.motion==='boot')document.documentElement.removeAttribute('data-motion')},6000)}`
