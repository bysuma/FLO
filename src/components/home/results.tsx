import { BackgroundPhoto } from './background-photo'
import { useEntrance } from './use-entrance'
import type { EntranceGroup } from './use-entrance'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { animations } from '../../lib/animations'
import { TextReveal } from '../text-reveal'
const stats = [
  { value: '40+', title: 'Years of experience', description: 'Decades of engineering and field experience.' },
  { value: '8+', title: 'Public & Private Partnerships', description: 'Trusted by Public Agencies & Private Partners' },
  { value: '20+', title: 'Projects completed', description: 'From small repairs to major infrastructure builds.' },
  { value: '100%', title: 'On-time delivery', description: 'We finish what we start, when we say we will.' },
]

const entrances = [{ name: 'backdrop', distance: 0, scale: 1.06 }, { name: 'cards', distance: 0, wipe: 'side', simultaneous: true }] satisfies readonly EntranceGroup[]

export function Results() {
  const motionRef = useRef<HTMLElement>(null)
  const entrance = useEntrance(motionRef, entrances)
  const photoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = motionRef.current
    const photo = photoRef.current
    if (!section || !photo) return
    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()
    media.add('(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      // Nura's image uses y = -(section.top / viewport.height) * intensity * 6.
      const distance = animations.parallax.intensity * 6
      const endY = () => distance * section.clientHeight / window.innerHeight
      // Keep enough photo above and below the crop across viewport changes.
      const overscan = () => Math.max(distance, endY())
      const setCrop = () => gsap.set(photo, { top: -overscan(), bottom: -overscan() })
      setCrop()
      gsap.fromTo(photo, { y: -distance }, {
        y: endY,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
          onRefreshInit: () => { setCrop() },
          onToggle: self => { photo.style.willChange = self.isActive ? 'transform' : '' },
        },
      })
      return () => photo.style.removeProperty('will-change')
    }, section)
    return () => media.revert()
  }, [])
  return <section ref={motionRef} aria-labelledby="results-heading" className="results-section relative isolate overflow-clip min-h-194.75 pt-22.25 max-lg:min-h-0 max-lg:pt-16 max-md:min-h-[869px] max-md:px-5 max-md:py-14 max-md:gap-6.5 [--reveal-delay:0] [--reveal-stagger:70] [--reveal-threshold:.01] flex flex-col"><div {...entrance('backdrop')} className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true"><div ref={photoRef} className="absolute inset-0"><BackgroundPhoto src="/results/background.webp" mobileSrc="/results/background-mobile.webp" /></div><div className="absolute inset-0 bg-linear-to-b from-black/53 to-[#66666688] max-md:from-black/45 max-md:to-black/45" /></div>
    <div className="flex flex-col items-center gap-7 px-6 max-md:gap-5 max-md:px-0 text-center text-white"><TextReveal as="h2" id="results-heading" className="max-w-md font-display text-section max-md:font-sans max-md:text-results-heading-mobile max-md:text-balance max-md:tracking-normal uppercase">4 decades of proven results</TextReveal><TextReveal as="p" className="max-w-72 text-body max-md:max-w-66 max-md:leading-[1.313]">We've earned our reputation through consistent work and accountability.</TextReveal></div>
    <div className="stats-row mt-auto flex items-start max-md:hidden max-lg:mt-12 max-lg:grid max-lg:grid-cols-2 max-lg:items-stretch max-[480px]:grid-cols-1">{stats.map((stat, index) => <article {...entrance('cards', stat.title)} data-reveal-owner className={`stat-card min-h-[12.8rem] pt-8.5 px-7.5 pb-4 bg-top-left bg-cover bg-no-repeat even:mt-[12.8rem] [&_h3]:text-base [&_.text-stat]:tabular-nums max-[1100px]:px-4 max-lg:min-h-60 max-lg:bg-surface max-lg:bg-none max-lg:even:mt-0 max-lg:p-6 [--reveal-delay:0] [--reveal-stagger:0] [--reveal-threshold:.01] ${["bg-[url('/results/card.svg')]", "bg-[url('/results/card-4.svg')]", "bg-[url('/results/card-2.svg')]", "bg-[url('/results/card-3.svg')]"][index]} flex min-w-0 flex-1 flex-col`} key={stat.title}><TextReveal as="p" className="text-stat max-lg:text-stat-mobile tracking-tight">{stat.value}</TextReveal><TextReveal as="h3" className="mt-4 text-body font-semibold uppercase">{stat.title}</TextReveal><TextReveal as="p" className="mt-4 max-w-52 text-small leading-tight">{stat.description}</TextReveal></article>)}</div>
    <div className="flex flex-col items-center gap-[9px] md:hidden">
      {stats.map((stat, index) => <article {...entrance('cards', `mobile-${stat.title}`)} data-reveal-owner key={stat.title} className="relative isolate flex h-[132.579px] w-[242px] max-w-full shrink-0 flex-col pt-[22px] pl-[20.84px] pr-3 text-ink [--reveal-delay:0] [--reveal-stagger:0]">
        <img src={`/results/card-mobile-${index + 1}.svg`} alt="" aria-hidden="true" width="242" height="132.579" className={`pointer-events-none absolute inset-0 -z-10 h-[132.579px] w-[242px] ${index === 2 ? '-scale-y-100' : ''}`} />
        <TextReveal as="p" className={`text-results-stat-mobile tracking-[-1.04px] tabular-nums ${index === 3 ? '' : 'h-[34.737px]'}`}>
          {stat.value.endsWith('+') ? <>{stat.value.slice(0, -1)}<span className="font-light">+</span></> : stat.value}
        </TextReveal>
        <TextReveal as="h3" className="mt-[10.421px] whitespace-nowrap text-xs leading-normal font-semibold uppercase">{index === 3 ? 'Projects completed' : stat.title}</TextReveal>
        <TextReveal as="p" className={`w-[128.526px] -ml-[1.16px] text-results-description-mobile ${index === 3 ? 'mt-[5.73px]' : index === 2 ? 'mt-[9.212px]' : 'mt-[11.522px]'}`}>
          {index === 1 ? 'Trusted by public agencies and private partners.' : index === 3 ? stats[2].description : stat.description}
        </TextReveal>
      </article>)}
    </div>
  </section>
}
