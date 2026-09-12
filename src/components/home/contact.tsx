import { useEntrance } from './use-entrance'
import type { EntranceGroup } from './use-entrance'
import { useRef } from 'react'
import { TextReveal } from '../text-reveal'
import { ButtonLink } from './button-link'

const entrances = [{ selector: '.section-backdrop', distance: 0, scale: 1.06 }, { selector: '.button', distance: 20 }] satisfies readonly EntranceGroup[]

export function Contact() {
  const motionRef = useRef<HTMLElement>(null)
  useEntrance(motionRef, entrances)
  return <section ref={motionRef} id="contact" aria-labelledby="contact-heading" className="contact-section relative isolate overflow-clip max-md:min-h-120 flex min-h-150 flex-col items-center justify-center gap-8 px-6 text-center"><div className="section-backdrop [background:linear-gradient(#0005,#0005),url('/contact/background.webp')_center_bottom/cover_no-repeat] max-md:bg-[linear-gradient(#0005,#0005),url('/contact/background-mobile.webp')] absolute inset-0 -z-10 pointer-events-none" aria-hidden="true" /><TextReveal as="h2" id="contact-heading" className="max-w-md font-display text-display max-md:text-display-mobile text-white">Ready when it can’t wait</TextReveal><ButtonLink href="mailto:info@floengineering.net">Contact Us</ButtonLink></section>
}
