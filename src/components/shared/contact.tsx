import { BackgroundPhoto } from './background-photo'
import { useEntrance } from '../../lib/use-entrance'
import type { EntranceGroup } from '../../lib/use-entrance'
import { useRef } from 'react'
import { TextReveal } from '../text-reveal'
import { ButtonLink } from './button-link'

const entrances = [
  { name: 'backdrop', distance: 0, scale: 1.06 },
  { name: 'controls', distance: 20 },
] satisfies readonly EntranceGroup[]

export function Contact() {
  const motionRef = useRef<HTMLElement>(null)
  const entrance = useEntrance(motionRef, entrances)
  return (
    <section
      ref={motionRef}
      id="contact"
      aria-labelledby="contact-heading"
      className="relative isolate overflow-clip max-md:min-h-177 max-md:justify-start max-md:pt-31.75 max-md:gap-8.25 max-md:bg-[#295f8b] flex min-h-150 flex-col items-center justify-center gap-8 px-6 text-center"
    >
      <div
        {...entrance('backdrop')}
        className="absolute inset-0 max-md:top-53.75 -z-10 pointer-events-none"
        aria-hidden="true"
      >
        <BackgroundPhoto
          src="/contact/background.webp"
          mobileSrc="/contact/background-mobile.webp"
          position="bottom"
        />
        <div className="absolute inset-0 bg-black/33 max-md:bg-black/30" />
      </div>
      <TextReveal
        as="h2"
        id="contact-heading"
        className="max-w-md font-display text-display max-md:text-[42px] max-md:leading-[1.2] max-md:tracking-[-.84px] max-md:font-sans max-md:max-w-68 text-white"
      >
        Ready when it can’t wait
      </TextReveal>
      <TextReveal as="p" className="-mt-3.25 max-w-57 text-center text-base text-white md:hidden">
        Let's talk about what your infrastructure needs and how we can help.
      </TextReveal>
      <ButtonLink
        className="max-md:bg-brand max-md:text-white max-md:rounded-none max-md:w-38.75 max-md:h-10"
        {...entrance('controls')}
        href="/contact"
      >
        Contact Us
      </ButtonLink>
    </section>
  )
}
