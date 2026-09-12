import { ServiceCard } from './service-card'
import { useEntrance } from './use-entrance'
import type { EntranceGroup } from './use-entrance'
import { useRef } from 'react'
import { TextReveal } from '../text-reveal'
import { Eyebrow } from './eyebrow'

const entrances = [{ name: 'cards', distance: 0, wipe: 'side', simultaneous: true }, { name: 'controls', distance: 20 }] satisfies readonly EntranceGroup[]

export function Services() {
  const motionRef = useRef<HTMLElement>(null)
  const entrance = useEntrance(motionRef, entrances)
  return <section ref={motionRef} id="services" aria-labelledby="services-heading" className="section-shell px-page bg-surface-soft py-10 max-md:bg-white max-md:px-5 max-md:py-16">
    <div className="flex flex-col items-start gap-5 max-md:gap-[22px]"><Eyebrow>Our services</Eyebrow><TextReveal as="h2" id="services-heading" className="max-w-xl font-display text-section max-md:text-section-mobile">From emergency response to lasting resilience</TextReveal></div>
    <div className="mt-12 max-md:mt-[22px] flex flex-col gap-1.5 max-md:gap-[22px] md:flex-row">
      <ServiceCard kind="emergency" cardEntrance={entrance('cards', 'emergency')} controlEntrance={entrance('controls', 'emergency')} />
      <ServiceCard kind="planning" cardEntrance={entrance('cards', 'planning')} controlEntrance={entrance('controls', 'planning')} />
    </div>
  </section>
}
