import { BackgroundPhoto } from './background-photo'
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
  return <section ref={motionRef} id="services" aria-labelledby="services-heading" className="section-shell px-page bg-surface-soft py-10 max-md:bg-white max-md:px-5 max-md:py-16">
    <div className="flex flex-col items-start gap-5 max-md:gap-[22px]"><Eyebrow>Our services</Eyebrow><TextReveal as="h2" id="services-heading" className="max-w-xl font-display text-section max-md:text-section-mobile">From emergency response to lasting resilience</TextReveal></div>
    <div className="mt-12 max-md:mt-[22px] flex flex-col gap-1.5 max-md:gap-[22px] md:flex-row">
      {[{ title: 'Emergency Work', image: 'emergency', subject: 'Emergency work' }, { title: 'Infrastructure planning', image: 'planning', subject: 'Infrastructure planning' }].map(service => <article {...entrance('cards', service.image)} data-reveal-owner key={service.image} className={`service-card relative isolate overflow-clip min-h-130 pt-8 px-8.5 pb-7 bg-center bg-cover [&_h3]:max-w-110.5 max-md:min-h-[310px] max-md:p-5 max-md:justify-between max-md:[&_h3]:max-w-[233px] max-md:[&_a]:w-[115px] max-md:[&_a]:min-h-[32.168px] max-md:[&_a]:h-[32.168px] max-md:[&_a]:text-[10.35px] max-md:[&_a]:gap-2 max-md:[&_a]:pl-[10.45px] max-md:[&_a_img]:size-[27.343px] [--reveal-delay:0] [--reveal-stagger:0] [--reveal-threshold:.01] ${service.image === 'emergency' ? '[&_h3]:max-w-74' : ''} flex min-w-0 flex-1 flex-col items-start justify-end gap-7`}>
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <BackgroundPhoto src={`/services/${service.image}.webp`} mobileSrc={`/services/${service.image}-mobile.webp`} sizes="(max-width: 767px) calc(100vw - 40px), 50vw" />
          <div className={`absolute inset-0 max-md:bg-black/30 ${service.image === 'planning' ? 'md:bg-black/33' : ''}`} />
        </div>
        <TextReveal as="h3" className="font-display text-service max-md:text-service-mobile text-white">{service.title}</TextReveal>
        <ButtonLink {...entrance('controls', service.image)} href={`mailto:info@floengineering.net?subject=${encodeURIComponent(service.subject)}`} arrow>Learn More</ButtonLink>
      </article>)}
    </div>
  </section>
}
