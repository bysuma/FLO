import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Rollover } from '../shared/rollover'
import { animations } from '../../lib/animations'
import { useRef, useState } from 'react'
import { TextReveal } from '../text-reveal'
import { BackgroundPhoto } from '../shared/background-photo'
import { responsiveImage } from '../../lib/images'
gsap.registerPlugin(useGSAP, ScrollTrigger)

export function AboutLeadership() {
  const [selected, setSelected] = useState(0)
  const [open, setOpen] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const blurRef = useRef<HTMLDivElement>(null)
  const toggleIconRef = useRef<HTMLSpanElement>(null)
  const portraitsRef = useRef<HTMLDivElement>(null)
  const panelTimeline = useRef<gsap.core.Timeline | null>(null)
  const openRef = useRef(open)
  openRef.current = open

  useGSAP(
    () => {
      const section = sectionRef.current!
      const background = backgroundRef.current!
      const panel = panelRef.current!
      const media = gsap.matchMedia()
      media.add(
        {
          desktop: '(min-width: 1024px)',
          fine: '(hover: hover) and (pointer: fine)',
          reduced: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { desktop, fine, reduced } = context.conditions!
          if (!desktop) setOpen(true)
          const duration = reduced ? 0 : animations.leadership.duration / 1000
          const timeline = gsap
            .timeline({ paused: true, defaults: { duration, ease: animations.leadership.ease } })
            .fromTo(
              panel,
              { autoAlpha: 0, x: () => panel.offsetWidth + 16 },
              { autoAlpha: 1, x: 0 },
              0,
            )
            .fromTo(toggleIconRef.current, { rotation: 0 }, { rotation: 45 }, 0)
            .fromTo(blurRef.current, { opacity: 0 }, { opacity: 1 }, 0)
            .fromTo(
              headingRef.current,
              { scale: desktop ? 1.15 : 1, transformOrigin: 'left center' },
              { scale: 1 },
              0,
            )
            .fromTo(
              closeRef.current,
              { x: () => (desktop ? panel.offsetWidth + 10 : 0) },
              { x: 0 },
              0,
            )
          panelTimeline.current = timeline
          timeline.progress(!desktop || openRef.current ? 1 : 0)
          let width = panel.offsetWidth
          const resize = new ResizeObserver(() => {
            if (panel.offsetWidth === width) return
            width = panel.offsetWidth
            const progress = timeline.progress()
            timeline.invalidate().progress(progress)
          })
          resize.observe(panel)

          if (desktop && fine && !reduced) {
            const distance = animations.parallax.intensity * 6
            const endY = () => (distance * section.clientHeight) / window.innerHeight
            const crop = () => {
              const overscan = Math.max(distance, endY())
              gsap.set(background, {
                height: section.clientHeight + 2 * overscan,
                marginTop: -overscan,
              })
            }
            crop()
            gsap.fromTo(
              background,
              { y: -distance },
              {
                y: endY,
                ease: 'none',
                scrollTrigger: {
                  trigger: section,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                  invalidateOnRefresh: true,
                  onRefreshInit: crop,
                  onToggle: (self) => {
                    background.style.willChange = self.isActive ? 'transform' : ''
                  },
                },
              },
            )
          }
          return () => {
            resize.disconnect()
            panelTimeline.current = null
            background.style.removeProperty('will-change')
          }
        },
      )
      return () => media.revert()
    },
    { scope: sectionRef },
  )

  useGSAP(
    () => {
      const timeline = panelTimeline.current
      if (!timeline) return
      timeline.reversed(!open)
      timeline.paused(false)
    },
    { dependencies: [open], scope: sectionRef },
  )

  useGSAP(
    () => {
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
      gsap.to(Array.from(portraitsRef.current?.children ?? []), {
        opacity: (index) => (index === selected ? 1 : 0),
        duration: reduced ? 0 : animations.leadership.duration / 1000,
        ease: animations.leadership.ease,
        overwrite: 'auto',
      })
    },
    { dependencies: [selected], scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-[863px] items-center gap-12 overflow-clip p-4 pl-inset max-lg:grid max-lg:min-h-svh max-lg:grid-cols-1 max-lg:gap-8 max-lg:px-4 max-lg:py-12"
    >
      <div ref={backgroundRef} className="absolute inset-0 -z-10">
        <BackgroundPhoto
          src="/about-page/leadership-bg.webp"
          mobileSrc="/about-page/leadership-bg.webp"
        />
        <div ref={blurRef} aria-hidden="true" className="absolute inset-0 opacity-0">
          <BackgroundPhoto
            src="/about-page/leadership-bg-blurred.webp"
            mobileSrc="/about-page/leadership-bg-blurred.webp"
          />
        </div>
        <div className="absolute inset-0 bg-black/30" />
      </div>
      <div
        ref={headingRef}
        className={`flex flex-1 flex-col items-start gap-6 text-white max-lg:col-start-1 max-lg:row-start-1`}
      >
        <TextReveal as="p">OUR DNA</TextReveal>
        <div>
          <TextReveal
            as="h2"
            className="max-w-102 font-display text-[52px] leading-[.98] tracking-[-1.04px] max-md:text-[38px]"
          >
            Backed by people who lead from the field
          </TextReveal>
        </div>
        <button
          type="button"
          ref={triggerRef}
          aria-expanded={open}
          aria-controls="leadership-profile"
          onClick={() => {
            setOpen(true)
            if (matchMedia('(max-width: 1023px)').matches) {
              panelRef.current?.scrollIntoView({
                block: 'start',
                behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
                  ? 'instant'
                  : 'smooth',
              })
            }
          }}
          className="rounded-sm bg-brand px-8 py-3"
        >
          <Rollover>Meet the Leadership Team</Rollover>
        </button>
      </div>
      <div className="pointer-events-none relative flex shrink-0 items-center gap-2.5 max-lg:col-start-1 max-lg:row-start-2 max-lg:w-full max-lg:flex-col max-lg:items-stretch max-lg:gap-2">
        <button
          type="button"
          ref={closeRef}
          aria-expanded={open}
          aria-controls="leadership-profile"
          aria-label={open ? 'Close leadership profile' : 'Open leadership profile'}
          onClick={() => {
            setOpen((value) => !value)
          }}
          className={`pointer-events-auto relative z-10 grid size-10 shrink-0 place-items-center rounded-md bg-white text-[28px] leading-none text-black max-lg:hidden`}
        >
          <span ref={toggleIconRef} aria-hidden="true" className="inline-block">
            +
          </span>
        </button>
        <div
          ref={panelRef}
          id="leadership-profile"
          inert={!open}
          aria-hidden={!open}
          className={`flex min-h-[792px] w-[698px] max-w-full flex-col items-center gap-6 rounded-md bg-white p-3 text-center max-lg:min-h-0 max-lg:max-h-none max-lg:overflow-visible max-lg:gap-4 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
        >
          <div
            ref={portraitsRef}
            className="grid h-88 shrink-0 w-full max-lg:h-[min(30svh,240px)] items-end justify-items-center overflow-hidden bg-[#c5c4c9] [mask-image:url(/about-page/leadership-portrait-mask.svg)] [mask-size:100%_100%] [mask-repeat:no-repeat]"
          >
            {['kristen', 'greg'].map((name, index) => (
              <img
                key={name}
                {...responsiveImage(`/about-page/${name}.webp`, index === 0 ? '335px' : '674px')}
                alt={index === 0 ? 'Kristen Flores' : 'Greg Flores'}
                aria-hidden={selected !== index}
                width="335"
                height="335"
                className={`col-start-1 row-start-1 ${index === 0 ? 'size-84 max-lg:h-[min(30svh,240px)] max-lg:w-full object-contain' : 'h-88 max-lg:h-[min(30svh,240px)] w-full object-cover'} object-bottom ${index === 0 ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
          </div>
          <h3 className="text-2xl tracking-[-.48px]">
            {selected === 0 ? 'Kristen Flores' : 'Greg Flores'}
          </h3>
          <p className="font-display text-xs">FOUNDER</p>
          <div className="grid max-w-120 text-base leading-[1.375]">
            {[
              'CEO & Co-Founder of FLO Engineering Inc., with a multidisciplinary background spanning finance, construction, and infrastructure management. Her experience combines strategic planning, operational leadership, and project execution across complex infrastructure initiatives.',
              'Principal & Co-Founder of FLO Engineering Inc., with a background in mechanical engineering, heavy civil construction, and field operations. His experience combines structural project delivery, field leadership, and technical expertise across complex infrastructure projects.',
            ].map((bio, index) => (
              <p
                key={index}
                aria-hidden={selected !== index}
                className={`col-start-1 row-start-1 ${selected === index ? '' : 'invisible'}`}
              >
                {bio}
              </p>
            ))}
          </div>
          <a
            href={
              selected === 0
                ? 'https://www.linkedin.com/in/kristenflores2016/'
                : 'https://www.linkedin.com/in/greg-flores-36a87211a/'
            }
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${selected === 0 ? 'Kristen' : 'Greg'} Flores on LinkedIn`}
          >
            <Rollover icon>
              <img src="/about-page/linkedin.svg" alt="" width="18" height="18" />
            </Rollover>
          </a>
          <div className="mt-auto flex shrink-0 gap-7 py-5 max-lg:py-2">
            {['Kristen', 'Greg'].map((name, index) => (
              <button
                key={name}
                type="button"
                aria-pressed={selected === index}
                onClick={() => setSelected(index)}
                className="flex flex-col items-start gap-2 text-left text-[13px]"
              >
                <img
                  src={`/about-page/${name.toLowerCase()}-thumb.webp`}
                  alt=""
                  width="96"
                  height="96"
                  className={`size-24 max-lg:size-16 object-cover ${selected === index ? '' : 'grayscale'}`}
                />
                <span>{name} Flores</span>
                <span className="font-display text-[9px]">FOUNDER</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
