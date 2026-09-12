/** Durations, delays and stagger are in milliseconds. */
export const animations = {
  menu: { duration: 450 },
  mobile: { duration: 350, distance: 10, revealDuration: 650, revealStagger: 45, maskDuration: 650 },
  testimonials: { hold: 2500, duration: 600, ease: 'power2.inOut' },
  parallax: { intensity: 20 },
  lines: { speed: 1800 }, // Rendered pixels per second.
  entrance: { duration: 1200, delay: 80, stagger: 170 },
  counter: { duration: 1800 },
  interaction: { ease: 'cubic-bezier(.25, 1, .5, 1)' },
  reveal: {
    duration: 1000,
    delay: 100,
    stagger: 130,
    ease: 'cubic-bezier(.22, .68, .3, 1)',
  },
} as const

/** Read at the point of entry so responsive changes affect upcoming animations. */
export function usesSimpleMotion() {
  return window.matchMedia('(max-width: 1023px), (pointer: coarse)').matches
}
