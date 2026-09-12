import { animations } from '../../lib/animations'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/** Nura's position / viewport * intensity * -6 mapping, within a stable crop. */
export function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const frame = ref.current
    const image = frame?.querySelector('img')
    if (!frame || !image) return
    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()
    let disposed = false
    void document.fonts.ready.then(() => {
      if (disposed) return
      media.add('(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const distance = () => {
          const intensity = animations.parallax.intensity
          return intensity * 6
        }
        const endY = () => distance() * frame.clientHeight / window.innerHeight
        // Reserve enough photo outside the crop for either end of the movement.
        const scale = () => 1 + 2 * Math.max(distance(), endY()) / Math.max(frame.clientHeight, 1)
        gsap.fromTo(image, { y: () => -distance(), scale }, {
          y: endY,
          scale,
          ease: 'none',
          scrollTrigger: {
            trigger: frame,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
            onToggle: self => { image.style.willChange = self.isActive ? 'transform' : '' },
          },
        })
        return () => image.style.removeProperty('will-change')
      }, frame)
    })
    return () => {
      disposed = true
      media.revert()
      image.style.removeProperty('will-change')
    }
  }, [])

  return <div ref={ref} className="project-image self-stretch w-auto h-auto aspect-447/392 object-cover parallax-frame grid overflow-clip @container-size [&>img]:[grid-area:1/1] [&>img]:w-[100cqw] [&>img]:h-[100cqh] [&>img]:min-w-0 [&>img]:min-h-0 [&>img]:object-cover">
    <img src={src} alt={alt} width="447" height="392" loading="lazy" decoding="async" />
  </div>
}
