import { responsiveImage } from '../../lib/images'
import { animations } from '../../lib/animations'
import { useEffect, useRef } from 'react'
import type { RefCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/** Nura's position / viewport * intensity * -6 mapping, within a stable crop. */
export function ParallaxImage({
  src,
  alt,
  entrance,
}: {
  src: string
  alt: string
  entrance?: { ref: RefCallback<Element>; 'data-entrance': string }
}) {
  const ref = useRef<HTMLDivElement>(null)

  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const frame = ref.current
    const image = imageRef.current
    if (!frame || !image) return
    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()
    let disposed = false
    void document.fonts.ready.then(() => {
      if (disposed) return
      media.add(
        '(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
        () => {
          const distance = () => {
            const intensity = animations.parallax.intensity
            return intensity * 6
          }
          const endY = () => (distance() * frame.clientHeight) / window.innerHeight
          const overscan = () => Math.max(distance(), endY())
          const crop = () =>
            gsap.set(image, { height: frame.clientHeight + 2 * overscan(), marginTop: -overscan() })
          crop()
          gsap.fromTo(
            image,
            { y: () => -distance() },
            {
              y: endY,
              ease: 'none',
              scrollTrigger: {
                trigger: frame,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
                invalidateOnRefresh: true,
                onRefreshInit: () => {
                  crop()
                },
                onToggle: (self) => {
                  image.style.willChange = self.isActive ? 'transform' : ''
                },
              },
            },
          )
          return () => image.style.removeProperty('will-change')
        },
        frame,
      )
    })
    return () => {
      disposed = true
      media.revert()
      image.style.removeProperty('will-change')
    }
  }, [])

  return (
    <div
      {...entrance}
      ref={(node) => {
        ref.current = node
        entrance?.ref(node)
      }}
      className="project-image self-stretch w-auto h-auto aspect-447/392 max-md:aspect-auto max-md:h-60 object-cover parallax-frame grid overflow-clip @container-size [&>img]:[grid-area:1/1] [&>img]:w-[100cqw] [&>img]:h-[100cqh] [&>img]:min-w-0 [&>img]:min-h-0 [&>img]:object-cover"
    >
      <img
        ref={imageRef}
        {...responsiveImage(
          src,
          '(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) 34vw, 50vw',
        )}
        alt={alt}
        width="447"
        height="392"
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}
