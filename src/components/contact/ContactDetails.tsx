import { useRef } from 'react'
import { useEntrance, type EntranceGroup } from '../../lib/use-entrance'
import { company, contactLinks } from '../../lib/config'
import { TextReveal } from '../text-reveal'

const entrances = [{ name: 'icons', distance: 10 }] satisfies readonly EntranceGroup[]

const details = [
  {
    title: 'Address',
    icon: 'address',
    content: (
      <>
        {company.address.street}
        <br />
        {company.address.suite}
        <br />
        {company.address.locality}
      </>
    ),
  },
  {
    title: 'Mail',
    icon: 'mail',
    content: (
      <a href={contactLinks.email} className="hover:underline">
        {company.email}
      </a>
    ),
  },
  {
    title: 'Phone',
    icon: 'phone',
    content: (
      <a href={contactLinks.phone} className="hover:underline">
        {company.phone.display}
      </a>
    ),
  },
  {
    title: 'Hours',
    icon: 'hours',
    content: (
      <>
        Available: {company.hours.daily},<br />
        {company.hours.weekly}
      </>
    ),
  },
]

export function ContactDetails() {
  const ref = useRef<HTMLElement>(null)
  const entrance = useEntrance(ref, entrances)
  return (
    <section ref={ref} aria-label="Contact information" className="bg-white py-12.5 min-h-50.25">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-5 min-[380px]:grid-cols-2 md:grid-cols-4 md:gap-12 md:px-8">
        {details.map(({ title, icon, content }) => (
          <div key={title} className="min-w-0">
            <div className="mb-3 flex items-center gap-2">
              <img
                {...entrance('icons', icon)}
                src={`/contact-page/${icon}.svg`}
                alt=""
                width={16}
                height={16}
                className="size-4 shrink-0 object-contain"
                loading="lazy"
              />
              <TextReveal as="h2" className="text-[19px] leading-7 font-semibold">
                {title}
              </TextReveal>
            </div>
            <TextReveal
              as="p"
              className="font-display text-small leading-[normal] text-[#1a1a1a] wrap-anywhere"
            >
              {content}
            </TextReveal>
          </div>
        ))}
      </div>
    </section>
  )
}
