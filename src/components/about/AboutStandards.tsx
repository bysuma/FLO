import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import { gsap } from 'gsap'
import { animations } from '../../lib/animations'
import { TextReveal } from '../text-reveal'
gsap.registerPlugin(useGSAP)

const values = [
  {
    title: 'Expertise That Goes Further',
    icon: 'expertise',
    text: 'The result is sharper planning, accurate budgets, and documentation and cost controls that hold up under public audit.',
  },
  {
    title: 'Invested in Every Outcome',
    icon: 'family',
    text: 'We approach every decision, every detail, and every outcome with the care and accountability that comes with having real skin in the game. That is what it means to have our name on the work.',
  },
  {
    title: 'Driven by Community',
    icon: 'community',
    text: 'From the people who live and work in the places we build to the crews who build them, we consider everyone part of our family. That is what drives everything we do.',
  },
]
export function AboutStandards() {
  const dividers = useRef<Array<HTMLDivElement | null>>([])
  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add(
      { desktop: '(min-width: 768px)', reduced: '(prefers-reduced-motion: reduce)' },
      (context) => {
        const { desktop, reduced } = context.conditions!
        const observers: IntersectionObserver[] = []
        dividers.current.forEach((divider) => {
          if (!divider || reduced) return
          const [line, start, end] = Array.from(divider.children)
          const axis = desktop ? 'scaleY' : 'scaleX'
          const timeline = gsap
            .timeline({ paused: true })
            .fromTo(start, { scale: 0 }, { scale: 1, duration: 0.18 })
            .fromTo(
              line,
              { [axis]: 0 },
              {
                [axis]: 1,
                duration: animations.standardsDivider.duration / 1000,
                ease: 'power2.inOut',
              },
            )
            .fromTo(end, { scale: 0 }, { scale: 1, duration: 0.18 }, '-=0.08')
          const observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                timeline.play()
                observer.disconnect()
              }
            },
            { threshold: 0.2 },
          )
          observer.observe(divider)
          observers.push(observer)
        })
        return () => observers.forEach((observer) => observer.disconnect())
      },
    )
    return () => media.revert()
  }, [])
  return (
    <section className="mx-4 flex min-h-177.25 flex-col items-center gap-7 rounded-md bg-surface px-4 pt-14 pb-5 text-center max-md:mx-0 max-md:py-16">
      <TextReveal
        as="h2"
        className="max-w-140 font-display text-[42px] leading-[1.143] tracking-[-.84px]"
      >
        A higher standard of Engineering
      </TextReveal>
      <TextReveal as="p" className="max-w-96 text-base leading-snug">
        We hold every project to a standard that reflects{' '}
        <strong>our commitment to the people behind it.</strong>
      </TextReveal>
      <div className="mt-8 grid w-full flex-1 grid-cols-3 rounded-md bg-white text-left max-md:grid-cols-1">
        {values.map((value, index) => (
          <article
            key={value.title}
            className="relative flex min-h-103 flex-col items-start px-7 py-12"
          >
            {index > 0 && (
              <div
                ref={(node) => {
                  dividers.current[index - 1] = node
                }}
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-px max-md:inset-x-0 max-md:top-0 max-md:bottom-auto max-md:h-px max-md:w-auto"
              >
                <span className="block h-full w-full origin-bottom bg-ink/40 max-md:origin-left" />
                <span className="absolute bottom-0 left-0 size-2.5 -translate-x-1/2 translate-y-1/2 bg-brand max-md:top-0 max-md:bottom-auto max-md:-translate-y-1/2" />
                <span className="absolute top-0 left-0 size-2.5 -translate-x-1/2 -translate-y-1/2 bg-brand max-md:left-auto max-md:right-0 max-md:translate-x-1/2" />
              </div>
            )}
            <TextReveal
              as="h3"
              className="max-w-68 font-display text-[38px] leading-none tracking-[-.76px]"
            >
              {value.title}
            </TextReveal>
            {value.icon === 'family' ? (
              <div aria-hidden="true" className="mt-auto grid size-9 grid-cols-3 grid-rows-3">
                <img
                  src="/about-page/family-top.svg"
                  className="col-start-2 h-full w-full"
                  alt=""
                />
                <img
                  src="/about-page/family-left.svg"
                  className="col-start-1 row-start-2 h-full w-full"
                  alt=""
                />
                <img
                  src="/about-page/family-right.svg"
                  className="col-start-3 row-start-2 h-full w-full"
                  alt=""
                />
                <img
                  src="/about-page/family-bottom.svg"
                  className="col-start-2 row-start-3 h-full w-full"
                  alt=""
                />
              </div>
            ) : (
              <img
                src={`/about-page/${value.icon}.svg`}
                alt=""
                width="36"
                height="36"
                className="mt-auto size-9"
              />
            )}
            <TextReveal as="p" className="mt-6 max-w-92 text-sm leading-[1.43]">
              {value.text}
            </TextReveal>
          </article>
        ))}
      </div>
    </section>
  )
}
