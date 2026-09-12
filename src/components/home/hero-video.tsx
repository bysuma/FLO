import { useHeroPreparation } from './hero-preparation'
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

export function HeroVideo({ src, alt }: { src: string; alt: string }) {
  const preparation = useHeroPreparation()
  const id = `hero-mask-${useId().replace(/:/g, '')}`
  const ref = useRef<SVGSVGElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    let disposed = false
    let visible = true
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      if ((!preparation || preparation.released) && visible && !document.hidden && !motion.matches) void video.play().catch(() => {})
      else video.pause()
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    observer.observe(ref.current ?? video)
    void preparation?.ready.then(() => { if (!disposed) sync() })
    document.addEventListener('visibilitychange', sync)
    motion.addEventListener('change', sync)
    sync()
    return () => {
      disposed = true
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
      motion.removeEventListener('change', sync)
      video.pause()
    }
  }, [src, preparation])

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
        // Expand the actual clipping geometry, leaving the video frame stationary.
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
      preparation?.hold(context)
      return () => context.revert()
    })
    return () => media.revert()
  }, [src, preparation])

  return <svg ref={ref} className="hero-landscape block w-199.5 h-125 max-w-none shrink-0 object-contain aspect-[797.847/500] max-[1100px]:self-stretch max-[1100px]:w-auto max-[1100px]:h-auto max-[1100px]:min-w-0 min-[1101px]:w-[797.847px] min-[1101px]:h-[500px] min-[1101px]:ml-auto" data-hero-mask viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-labelledby={`${id}-title`}>
    <title id={`${id}-title`}>{alt}</title>
    <defs><clipPath id={id} clipPathUnits="userSpaceOnUse">{bands.map(path => <path key={path} d={path} />)}</clipPath></defs>
    <foreignObject width={WIDTH} height={HEIGHT} clipPath={`url(#${id})`}>
      <video ref={videoRef} src={src} poster="/hero/video-poster.webp" muted loop playsInline preload="auto" className="block h-full w-full object-cover" />
    </foreignObject>
  </svg>
}
