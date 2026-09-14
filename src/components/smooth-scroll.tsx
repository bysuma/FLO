import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const media = gsap.matchMedia()

    // Touch devices use native scrolling without a Lenis ticker.
    media.add(
      '(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
      () => {
        gsap.ticker.lagSmoothing(0)
        const lenis = new Lenis({
          autoRaf: false,
          anchors: true,
          syncTouch: false,
        })
        const update = (time: number) => {
          // GSAP uses seconds; Lenis expects milliseconds.
          lenis.raf(time * 1000)
        }

        lenis.on('scroll', ScrollTrigger.update)
        gsap.ticker.add(update)

        return () => {
          gsap.ticker.remove(update)
          lenis.off('scroll', ScrollTrigger.update)
          lenis.destroy()
        }
      },
    )

    return () => media.revert()
  }, [])

  return null
}
