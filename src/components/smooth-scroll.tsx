import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function SmoothScroll() {
  useGSAP(() => {
    const media = gsap.matchMedia()

    media.add(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
      () => {
        gsap.ticker.lagSmoothing(0)
        const lenis = new Lenis({
          autoRaf: false,
          autoToggle: true,
          anchors: true,
          stopInertiaOnNavigate: true,
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
