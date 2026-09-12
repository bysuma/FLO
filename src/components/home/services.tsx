import { useEntrance } from './use-entrance'
import type { EntranceGroup } from './use-entrance'
import { useRef } from 'react'
import { TextReveal } from '../text-reveal'
import { ButtonLink } from './button-link'
import { Eyebrow } from './eyebrow'

const entrances = [{ name: 'cards', distance: 0, wipe: 'side', simultaneous: true }, { name: 'controls', distance: 20 }] satisfies readonly EntranceGroup[]

export function Services() {
  const motionRef = useRef<HTMLElement>(null)
  const entrance = useEntrance(motionRef, entrances)
  return <section ref={motionRef} id="services" aria-labelledby="services-heading" className="section-shell px-page bg-surface-soft py-10">
    <div className="flex flex-col items-start gap-5"><Eyebrow>Our services</Eyebrow><TextReveal as="h2" id="services-heading" className="max-w-xl font-display text-section max-md:text-section-mobile">From emergency response to lasting resilience</TextReveal></div>
    <div className="mt-12 flex flex-col gap-1.5 md:flex-row">
      {[{ title: 'Emergency Work', image: 'emergency', subject: 'Emergency work' }, { title: 'Infrastructure planning', image: 'planning', subject: 'Infrastructure planning' }].map(service => <article {...entrance('cards', service.image)} data-reveal-owner key={service.image} className={`service-card min-h-130 pt-8 px-8.5 pb-7 bg-center bg-cover [&_h3]:max-w-110.5 max-md:min-h-116 max-md:px-6 [--reveal-delay:0] [--reveal-stagger:0] [--reveal-threshold:.01] ${service.image === 'emergency' ? "bg-[url('/services/emergency.webp')] max-md:bg-[url('/services/emergency-mobile.webp')] [&_h3]:max-w-74" : "bg-[linear-gradient(#0005,#0005),url('/services/planning.webp')] max-md:bg-[linear-gradient(#0005,#0005),url('/services/planning-mobile.webp')]"} flex min-w-0 flex-1 flex-col items-start justify-end gap-7`}>
        <TextReveal as="h3" className="font-display text-service max-md:text-service-mobile text-white">{service.title}</TextReveal>
        <ButtonLink {...entrance('controls', service.image)} href={`mailto:info@floengineering.net?subject=${encodeURIComponent(service.subject)}`} arrow>Learn More</ButtonLink>
      </article>)}
    </div>
  </section>
}
