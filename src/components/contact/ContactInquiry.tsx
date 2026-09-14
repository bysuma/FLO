import { useRef } from 'react'
import { TextReveal } from '../text-reveal'
import { useEntrance } from '../shared/use-entrance'
import type { EntranceGroup } from '../shared/use-entrance'
import { ContactForm } from './ContactForm'

const entrances = [{ name: 'form', distance: 20 }] satisfies readonly EntranceGroup[]

export function ContactInquiry() {
  const ref = useRef<HTMLElement>(null)
  const entrance = useEntrance(ref, entrances)
  return (
    <section ref={ref} aria-labelledby="project-inquiry-heading" className="relative isolate overflow-clip bg-ink pt-[57px] pb-[45px] min-h-[649px] max-md:py-14">
      <img src="/contact-page/form-decoration.svg" alt="" loading="lazy" width="1068" height="271" className="pointer-events-none absolute -bottom-1 -left-[445px] -z-10 h-auto w-[1068px] max-w-none max-md:-left-[600px]" />
      <div className="ml-[calc(50%-458px)] mr-[calc(50%-611px)] grid grid-cols-[minmax(0,399fr)_minmax(0,578fr)] items-start gap-[92px] max-xl:mx-8 max-xl:gap-10 max-md:mx-5 max-md:grid-cols-1">
        <TextReveal as="h2" id="project-inquiry-heading" className="max-w-[399px] font-display text-[52px] leading-[46.553px] tracking-[-1.04px] text-brand">
          Let’s talk about your project
        </TextReveal>
        <div {...entrance('form')}>
          <ContactForm.Root>
            <div className="grid grid-cols-2 gap-x-[9.39px] gap-y-[9.848px] max-[480px]:grid-cols-1">
              <ContactForm.Field label="First Name" name="firstName" autoComplete="given-name" required maxLength={100} />
              <ContactForm.Field label="Last Name" name="lastName" autoComplete="family-name" required maxLength={100} />
              <ContactForm.Field label="Email" name="email" type="email" autoComplete="email" required maxLength={254} />
              <ContactForm.Field label="Phone Number" name="phone" type="tel" autoComplete="tel" maxLength={40} />
            </div>
            <ContactForm.Project />
            <ContactForm.Roles />
            <ContactForm.Message />
            <ContactForm.Consent />
            <ContactForm.Submit />
          </ContactForm.Root>
        </div>
      </div>
    </section>
  )
}
