import storyLines from '../../assets/about/story-lines.svg?raw'
import { animateDecoration } from '../shared/decoration'
import { useRef } from 'react'
import { useAboutEntrance } from '../../lib/use-about-entrance'
import type { EntranceGroup } from '../../lib/use-entrance'
import { TextReveal } from '../text-reveal'
import { responsiveImage } from '../../lib/images'
const entrances = [
  { name: 'photos', distance: 0, wipe: 'bottom-to-top', simultaneous: true },
  { name: 'symbol', distance: 0, wipe: 'side', simultaneous: true },
  { name: 'lines', distance: 0, wipe: 'side', animate: animateDecoration },
] satisfies readonly EntranceGroup[]

export function AboutStory() {
  const sectionRef = useRef<HTMLElement>(null)
  const entrance = useAboutEntrance(sectionRef, entrances)
  return (
    <section
      ref={sectionRef}
      className="relative isolate grid min-h-212 grid-cols-12 gap-x-6 gap-y-16 py-16 overflow-clip bg-[#f5f5f5] max-xl:flex max-xl:flex-col max-xl:gap-8 max-xl:px-5"
    >
      <TextReveal
        as="h2"
        className="col-start-2 col-span-6 row-start-1 self-start font-display text-[100px] leading-[.8] tracking-[-4px] text-brand max-xl:text-[64px]"
      >
        Built like
        <br />
        our name
        <br />
        is on it
      </TextReveal>
      <div className="col-start-9 col-span-4 row-start-1 relative h-74.75 w-89.5 justify-self-end max-xl:self-end">
        <div
          {...entrance('photos', 'family')}
          className="ml-auto -mt-2.25 translate-x-1 h-77 w-67.75 overflow-hidden"
        >
          <img
            {...responsiveImage('/about-page/story-family.webp', '271px')}
            alt="The Flores family"
            width="271"
            height="308"
            className="h-104 w-78.25 max-w-none -translate-x-10.5 -translate-y-24.5"
          />
        </div>
        <img
          {...entrance('symbol')}
          src="/about-page/story-logo.svg"
          alt=""
          width="152"
          height="131"
          className="absolute left-0 bottom-0 h-32.75 w-38"
        />
      </div>
      <div className="col-start-5 col-span-7 row-start-2 grid grid-cols-2 items-start gap-6 text-lg leading-[normal] max-xl:grid-cols-1">
        <TextReveal as="p" className="min-w-0 tracking-[-.36px]">
          Born from our family values and driven by our impact on communities, FLO, short for
          Flores, our family's last name, was founded on the belief that infrastructure should be
          built with intention, accountability, and long-term impact.
        </TextReveal>
        <TextReveal as="p" className="min-w-0">
          Family-owned and operated, our company is backed by{' '}
          <strong>40 years of experience</strong> and grounded in hands-on field experience and
          multidisciplinary expertise spanning fintech, mechanical engineering, and construction
          program management.
          <br />
          <br />
          <strong>
            This foundation shapes a practical approach to the work and a deep responsibility to the
            crews, partners, and communities behind every job.
          </strong>
        </TextReveal>
      </div>
      <div
        {...entrance('photos', 'team')}
        className="col-start-1 col-span-4 row-start-2 self-end h-64.75 w-full overflow-hidden rounded-md"
      >
        <img
          {...responsiveImage('/about-page/story-team.webp', '521px')}
          alt="FLO team in the field"
          width="521"
          height="259"
          className="h-117.75 w-157.25 max-w-none -translate-x-16.25 -translate-y-53"
        />
      </div>
      <div
        {...entrance('lines')}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: storyLines }}
        className="pointer-events-none absolute bottom-0 left-0 -z-10 h-65.5 w-[2096px] max-w-none"
      />
    </section>
  )
}
