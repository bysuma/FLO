import pattern from '../../../public/about-page/pattern.svg?raw'
import { animateDecoration } from '../shared/decoration'
import { useEntrance } from '../shared/use-entrance'
import type { EntranceGroup } from '../shared/use-entrance'
import { useRef } from 'react'
import { Navbar } from '../shared/navbar'
import { TextReveal } from '../text-reveal'
import { AboutGallery } from './AboutGallery'
const entrances = [
  { name: 'paths', distance: 0, wipe: 'side', animate: animateDecoration },
] satisfies readonly EntranceGroup[]
export function AboutHero() {
  const ref = useRef<HTMLElement>(null)
  const entrance = useEntrance(ref, entrances)
  return (
    <header ref={ref} className="relative isolate overflow-clip bg-white pb-5 text-ink">
      <div
        {...entrance('paths')}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: pattern }}
        className="pointer-events-none absolute -top-145.5 left-[calc((100vw-1856.7px)/2-68.65px)] -z-10 h-[774.949px] w-[1856.7px] max-w-none"
      />
      <Navbar light />
      <div className="mx-auto flex max-w-[848px] flex-col items-center gap-[23px] px-5 pt-33.5 text-center max-md:pt-20">
        <TextReveal
          as="h1"
          className="font-display text-[52px] leading-none tracking-[-1.04px] uppercase max-md:text-[36px]"
        >
          Driven by the people
          <br className="max-md:hidden" /> behind every project
        </TextReveal>
        <TextReveal as="p" className="text-base leading-[1.375]">
          That responsibility shapes our work.
        </TextReveal>
      </div>
      <AboutGallery />
    </header>
  )
}
