import { useEntrance } from './use-entrance'
import type { EntranceGroup } from './use-entrance'
import { useRef } from 'react'
import { TextReveal } from '../text-reveal'
const stats = [
  { value: '40+', title: 'Years of experience', description: 'Decades of engineering and field experience.' },
  { value: '8+', title: 'Public & Private Partnerships', description: 'Trusted by Public Agencies & Private Partners' },
  { value: '20+', title: 'Projects completed', description: 'From small repairs to major infrastructure builds.' },
  { value: '100%', title: 'On-time delivery', description: 'We finish what we start, when we say we will.' },
]

const entrances = [{ selector: '.section-backdrop', distance: 0, scale: 1.06 }, { selector: '.stat-card', distance: 0, wipe: 'side', simultaneous: true }] satisfies readonly EntranceGroup[]

export function Results() {
  const motionRef = useRef<HTMLElement>(null)
  useEntrance(motionRef, entrances)
  return <section ref={motionRef} aria-labelledby="results-heading" className="results-section relative isolate overflow-clip min-h-194.75 pt-22.25 max-lg:min-h-0 max-lg:pt-16 [--reveal-delay:0] [--reveal-stagger:70] [--reveal-threshold:.01] flex flex-col"><div className="section-backdrop [background:linear-gradient(#0008,#6668),url('/results/background.webp')_center/cover] max-md:bg-[linear-gradient(#0008,#6668),url('/results/background-mobile.webp')] absolute inset-0 -z-10 pointer-events-none" aria-hidden="true" />
    <div className="flex flex-col items-center gap-7 px-6 text-center text-white"><TextReveal as="h2" id="results-heading" className="max-w-md font-display text-section max-md:text-section-mobile uppercase">4 decades of proven results</TextReveal><TextReveal as="p" className="max-w-72 text-body">We've earned our reputation through consistent work and accountability.</TextReveal></div>
    <div className="stats-row mt-auto flex items-start max-lg:mt-12 max-lg:grid max-lg:grid-cols-2 max-lg:items-stretch max-[480px]:grid-cols-1">{stats.map((stat, index) => <article className={`stat-card min-h-[12.8rem] pt-8.5 px-7.5 pb-4 bg-top-left bg-cover bg-no-repeat even:mt-[12.8rem] [&_h3]:text-base [&_.text-stat]:tabular-nums max-[1100px]:px-4 max-lg:min-h-60 max-lg:bg-surface max-lg:bg-none max-lg:even:mt-0 max-lg:p-6 [--reveal-delay:0] [--reveal-stagger:0] [--reveal-threshold:.01] ${["bg-[url('/results/card.svg')]", "bg-[url('/results/card-4.svg')]", "bg-[url('/results/card-2.svg')]", "bg-[url('/results/card-3.svg')]"][index]} flex min-w-0 flex-1 flex-col`} key={stat.title}><TextReveal as="p" className="text-stat max-lg:text-stat-mobile tracking-tight">{stat.value}</TextReveal><TextReveal as="h3" className="mt-4 text-body font-semibold uppercase">{stat.title}</TextReveal><TextReveal as="p" className="mt-4 max-w-52 text-small leading-tight">{stat.description}</TextReveal></article>)}</div>
  </section>
}
