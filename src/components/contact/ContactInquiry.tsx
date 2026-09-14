import { useRef } from 'react'
import { TextReveal } from '../text-reveal'
import { useEntrance } from '../../lib/use-entrance'
import type { EntranceGroup } from '../../lib/use-entrance'
import { ContactForm } from './ContactForm'

const entrances = [{ name: 'form', distance: 20 }] satisfies readonly EntranceGroup[]

export function ContactInquiry() {
  const ref = useRef<HTMLElement>(null)
  const entrance = useEntrance(ref, entrances)
  return (
    <section
      ref={ref}
      aria-labelledby="project-inquiry-heading"
      className="relative isolate overflow-clip bg-ink pt-14.25 pb-11.25 min-h-162.25 max-md:py-14"
    >
      <img
        src="/contact-page/form-decoration.svg"
        alt=""
        loading="lazy"
        width="1068"
        height="271"
        className="pointer-events-none absolute -bottom-1 -left-111.25 -z-10 h-auto w-267 max-w-none max-md:-left-150"
      />
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-10 px-5 md:grid-cols-2 md:gap-16 md:px-8">
        <TextReveal
          as="h2"
          id="project-inquiry-heading"
          className="max-w-99.75 font-display text-[52px] leading-[46.553px] tracking-[-1.04px] text-brand"
        >
          Let’s talk about your project
        </TextReveal>
        <div {...entrance('form')}>
          <ContactForm.Root>
            <div className="grid grid-cols-2 gap-2.5 max-[480px]:grid-cols-1">
              <ContactForm.Field
                label="First Name"
                name="firstName"
                autoComplete="given-name"
                required
                maxLength={100}
              />
              <ContactForm.Field
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                required
                maxLength={100}
              />
              <ContactForm.Field
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
              />
              <ContactForm.Field
                label="Phone Number"
                name="phone"
                type="tel"
                autoComplete="tel"
                maxLength={40}
              />
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
