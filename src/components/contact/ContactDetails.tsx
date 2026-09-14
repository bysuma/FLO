import { useRef } from 'react'
import { useEntrance, type EntranceGroup } from '../shared/use-entrance'
import { company, contactLinks } from '../../lib/config'
import { TextReveal } from '../text-reveal'

const entrances = [{ name: 'icons', distance: 10 }] satisfies readonly EntranceGroup[]

const details = [
  { title: 'Address', icon: 'address', width: 12.001, height: 15.002, gap: 'gap-[9.644px]', size: 'w-[12.001px] h-[15.002px]', content: <>{company.address.street}<br />{company.address.suite}<br />{company.address.locality}</> },
  { title: 'Mail', icon: 'mail', width: 15.71, height: 11.73, gap: 'gap-[9.644px]', size: 'w-[15.71px] h-[11.73px]', content: <a href={contactLinks.email} className="hover:underline">{company.email}</a> },
  { title: 'Phone', icon: 'phone', width: 16.074, height: 16.074, gap: 'gap-[5.358px]', size: 'w-[16.074px] h-[16.074px]', content: <a href={contactLinks.phone} className="hover:underline">{company.phone.display}</a> },
  { title: 'Hours', icon: 'hours', width: 13.931, height: 13.931, gap: 'gap-[7.501px]', size: 'w-[13.931px] h-[13.931px]', content: <>Available: {company.hours.daily},<br />{company.hours.weekly}</> },
]

export function ContactDetails() {
  const ref = useRef<HTMLElement>(null)
  const entrance = useEntrance(ref, entrances)
  return (
    <section ref={ref} aria-label="Contact information" className="bg-white py-[50px] min-h-[201px]">
      <div className="ml-[calc(50%-457px)] grid grid-cols-[159.669px_165.027px_108.232px_166px] gap-[105px] max-xl:mx-8 max-xl:grid-cols-4 max-xl:gap-6 max-md:mx-5 max-md:grid-cols-2 max-[380px]:grid-cols-1">
        {details.map(({ title, icon, width, height, gap, size, content }) => (
          <div key={title} className="min-w-0">
            <div className={`mb-[11.788px] flex ${gap} ${icon === 'address' ? 'items-end' : 'items-center'}`}>
              <img {...entrance('icons', icon)} src={`/contact-page/${icon}.svg`} alt="" width={width} height={height} className={`shrink-0 object-contain ${size}`} loading="lazy" />
              <TextReveal as="h2" className={`text-[19.289px] leading-[27.862px] font-semibold ${icon === 'address' ? 'h-[22.504px]' : ''}`}>{title}</TextReveal>
            </div>
            <TextReveal as="p" className="font-display text-[14px] leading-[normal] text-[#1a1a1a] [overflow-wrap:anywhere]">{content}</TextReveal>
          </div>
        ))}
      </div>
    </section>
  )
}
