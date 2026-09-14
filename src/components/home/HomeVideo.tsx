import { useHeroPreparation } from '../shared/hero-preparation'
import { animations, usesSimpleMotion } from '../../lib/animations'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function HomeVideo({ src, alt }: { src: string; alt: string }) {
  const preparation = useHeroPreparation()
  const ref = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    let disposed = false
    let visible = true
    let covered = false
    let frame = 0
    const cover = ref.current?.closest('header')?.nextElementSibling
    const checkCover = () => {
      frame = 0
      covered =
        !!cover &&
        !!ref.current &&
        cover.getBoundingClientRect().top <= ref.current.getBoundingClientRect().top
      sync()
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(checkCover)
    }
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      if (
        (!preparation || preparation.released) &&
        visible &&
        !covered &&
        !document.hidden &&
        !motion.matches
      ) {
        if (video.paused) void video.play().catch(() => {})
      } else if (!video.paused) video.pause()
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    observer.observe(ref.current ?? video)
    void preparation?.ready.then(() => {
      if (!disposed) sync()
    })
    document.addEventListener('visibilitychange', sync)
    motion.addEventListener('change', sync)
    checkCover()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
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
      const context = gsap.context(() => {
        if (usesSimpleMotion()) {
          gsap.fromTo(
            element,
            { opacity: 0 },
            {
              opacity: 1,
              duration: animations.mobile.duration / 1000,
              ease: 'power1.out',
              clearProps: 'opacity',
            },
          )
          element.setAttribute('data-motion-ready', '')
          return
        }
        // Keep the SVG mask static; animate a separate reveal on the HTML wrapper.
        gsap.fromTo(
          element,
          { clipPath: 'inset(0 0 100% 0)' },
          {
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.45,
            ease: 'power3.inOut',
            clearProps: 'clipPath',
          },
        )
        element.setAttribute('data-motion-ready', '')
      }, element)
      preparation?.hold(context)
      return () => context.revert()
    })
    return () => media.revert()
  }, [src, preparation])

  return (
    <div
      ref={ref}
      className="hero-landscape relative block w-199.5 h-125 max-w-none shrink-0 aspect-[797.847/500] max-[1100px]:self-stretch max-[1100px]:w-auto max-[1100px]:h-auto max-[1100px]:min-w-0 min-[1101px]:w-[797.847px] min-[1101px]:h-[500px] min-[1101px]:ml-auto"
      data-hero-mask
    >
      <div className="h-full w-full aspect-[797.847/500] mask-[url('/hero/video-mask.svg')] mask-size-[100%_100%] mask-no-repeat">
        <video
          ref={videoRef}
          src={src}
          poster="/hero/video-poster.webp"
          aria-label={alt}
          muted
          loop
          playsInline
          preload="auto"
          className="block h-full w-full aspect-[797.847/500] object-cover"
        />
      </div>
    </div>
  )
}
