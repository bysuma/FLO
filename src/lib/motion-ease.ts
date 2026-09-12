import { animations } from './animations'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'

const curves = new Map<string, ReturnType<typeof CustomEase.create>>()

/** Called inside client effects; easing configuration lives in animations.ts. */
export function motionEase() {
  const value = animations.reveal.ease
  const points = /^cubic-bezier\(([^)]+)\)$/.exec(value)?.[1]
  if (!points) return 'power3.out'
  let ease = curves.get(points)
  if (!ease) {
    gsap.registerPlugin(CustomEase)
    ease = CustomEase.create('flo-reveal-' + curves.size, points)
    curves.set(points, ease)
  }
  return ease
}
