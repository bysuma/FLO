import { useEntrance } from './use-entrance'
import type { EntranceGroup } from './use-entrance'
import { useRef } from 'react'
import { TextReveal } from '../text-reveal'
import { ButtonLink } from './button-link'

const entrances = [{ name: 'backdrop', distance: 0, scale: 1.06 }, { name: 'controls', distance: 20 }] satisfies readonly EntranceGroup[]

export function Contact() {
  const motionRef = useRef<HTMLElement>(null)
  const entrance = useEntrance(motionRef, entrances)
  return <section ref={motionRef} id="contact" aria-labelledby="contact-heading" className="contact-section relative isolate overflow-clip max-md:min-h-[708px] max-md:justify-start max-md:pt-[127px] max-md:gap-[33px] max-md:bg-[#295f8b] max-md:[&_a]:bg-brand max-md:[&_a]:text-white max-md:[&_a]:rounded-none max-md:[&_a]:w-[155px] max-md:[&_a]:h-10 flex min-h-150 flex-col items-center justify-center gap-8 px-6 text-center"><div {...entrance('backdrop')} className="section-backdrop [background:linear-gradient(#0005,#0005),url('/contact/background.webp')_center_bottom/cover_no-repeat] max-md:top-[215px] max-md:bg-[linear-gradient(#0000004d,#0000004d),url('/contact/background-mobile.webp')] absolute inset-0 -z-10 pointer-events-none" aria-hidden="true" /><TextReveal as="h2" id="contact-heading" className="max-w-md font-display text-display max-md:text-[42px] max-md:leading-[1.2] max-md:tracking-[-.84px] max-md:font-sans max-md:max-w-[272px] text-white">Ready when it can’t wait</TextReveal><TextReveal as="p" className="-mt-[13px] max-w-[228px] text-center text-base text-white md:hidden">Let's talk about what your infrastructure needs and how we can help.</TextReveal><ButtonLink {...entrance('controls')} href="mailto:info@floengineering.net">Contact Us</ButtonLink></section>
}
