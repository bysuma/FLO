import { animations, usesSimpleMotion } from '../../lib/animations'
import { useEffect, useId, useRef } from 'react'
import { gsap } from 'gsap'

const WIDTH = 797.847
const HEIGHT = 500
// Exact path coordinates from the exported Figma vector, not an approximation.
const bands = [
  'M797.847 250V125L502.098 0H0V125L295.749 250H797.847Z',
  'M797.847 500V375L502.098 250H0V375L295.749 500H797.847Z',
]

export function HeroImage({ src, alt }: { src: string; alt: string }) {
  const id = `hero-mask-${useId().replace(/:/g, '')}`
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      if (!document.documentElement.dataset.motion) return
      const paths = element.querySelectorAll('clipPath path')
      const context = gsap.context(() => {
        if (usesSimpleMotion()) {
          gsap.fromTo(element, { opacity: 0 }, {
            opacity: 1, duration: animations.mobile.duration / 1000,
            ease: 'power1.out', clearProps: 'opacity',
          })
          element.setAttribute('data-motion-ready', '')
          return
        }
        // Expand the actual clipping geometry, leaving the photograph stationary.
        gsap.fromTo(paths, {
          scaleY: 0,
          svgOrigin: (index: number) => `0 ${index * 250 + 125}`,
        }, {
          scaleY: 1,
          duration: 1.45,
          stagger: .2,
          ease: 'power3.inOut',
          clearProps: 'transform',
        })
        // Initial mask transforms are applied synchronously before revealing the SVG.
        element.setAttribute('data-motion-ready', '')
      }, element)
      return () => context.revert()
    })
    return () => media.revert()
  }, [src])

  return <svg ref={ref} className="hero-landscape block w-199.5 h-125 max-w-none shrink-0 object-contain aspect-[797.847/500] max-[1100px]:self-stretch max-[1100px]:w-auto max-[1100px]:h-auto max-[1100px]:min-w-0 min-[1101px]:w-[797.847px] min-[1101px]:h-[500px] min-[1101px]:ml-auto" data-hero-mask viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-labelledby={`${id}-title`}>
    <title id={`${id}-title`}>{alt}</title>
    <defs><clipPath id={id} clipPathUnits="userSpaceOnUse">{bands.map(path => <path key={path} d={path} />)}</clipPath></defs>
    <image href={src} width={WIDTH} height={HEIGHT} preserveAspectRatio="xMidYMid slice" clipPath={`url(#${id})`} />
  </svg>
}
