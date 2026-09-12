import { useEntrance } from './use-entrance'
import type { EntranceGroup } from './use-entrance'
import { useRef } from 'react'
import { Decoration } from './decoration'
import { TextReveal } from '../text-reveal'
const entrances = [{ name: 'images', distance: 0, wipe: 'up' }] satisfies readonly EntranceGroup[]

export function About() {
  const motionRef = useRef<HTMLElement>(null)
  const entrance = useEntrance(motionRef, entrances)
  return <section ref={motionRef} id="about" aria-labelledby="about-heading" className="about-section mt-0.5 relative isolate overflow-clip min-h-177.75 flex flex-col pt-[7.8rem] pr-page pb-4 pl-inset max-md:min-h-0 max-md:pt-16 max-md:px-page max-md:pb-6">
    <Decoration section="about" />
    <div className="about-copy items-start [&>p]:[--reveal-delay:240] flex flex-col gap-8 lg:flex-row lg:gap-16">
      <TextReveal as="h2" id="about-heading" className="max-w-lg flex-1 font-display text-display max-md:text-display-mobile">The partner<br />communities<br />rely on</TextReveal>
      <TextReveal as="p" className="max-w-96 flex-1 text-intro max-md:text-lg">From road repair to landslide stabilization, we restore what needs attention today while reinforcing what needs to last tomorrow.</TextReveal>
    </div>
    <div className="about-gallery min-w-0 mt-[2.85rem] self-end overflow-clip max-md:self-stretch max-md:mt-12 [&_img]:min-w-0 [&_img]:flex-1 [&_img]:w-55 [&_img]:h-77 [&_img]:object-cover max-md:[&_img]:w-0 max-md:[&_img]:h-48 flex gap-2.5">
      <img {...entrance('images', 'team')} src="/about/team.webp" alt="FLO team inspecting work on site" width="219" height="308" loading="lazy" decoding="async" />
      <img {...entrance('images', 'excavator')} src="/about/excavator.webp" alt="Excavator carrying out hillside repairs" width="220" height="308" loading="lazy" decoding="async" />
      <img {...entrance('images', 'hillside')} src="/about/hillside.webp" alt="Restored road along a wooded hillside" width="226" height="308" loading="lazy" decoding="async" />
    </div>
  </section>
}
