import storyLines from '../../../public/about-page/story-lines.svg?raw'
import { animateDecoration } from '../shared/decoration'
import { useRef } from 'react'
import { useEntrance } from '../shared/use-entrance'
import type { EntranceGroup } from '../shared/use-entrance'
import { TextReveal } from '../text-reveal'
import { responsiveImage } from '../../lib/images'
const entrances = [
  { name: 'photos', distance: 0, wipe: 'bottom-to-top', simultaneous: true },
  { name: 'symbol', distance: 0, wipe: 'side', simultaneous: true },
  { name: 'lines', distance: 0, wipe: 'side', animate: animateDecoration },
] satisfies readonly EntranceGroup[]

export function AboutStory() {
  const sectionRef = useRef<HTMLElement>(null)
  const entrance = useEntrance(sectionRef, entrances)
  return (
    <section
      ref={sectionRef}
      className="relative isolate grid h-[847px] grid-cols-[145px_minmax(0,1fr)_309px_24px_319px_159px] grid-rows-[300px_72px_auto_minmax(0,1fr)] overflow-clip bg-[#f5f5f5] max-xl:flex max-xl:h-auto max-xl:flex-col max-xl:gap-8 max-xl:px-5 max-xl:py-16"
    >
      <TextReveal
        as="h2"
        className="col-start-2 col-end-4 row-start-1 row-span-2 mt-[139px] self-start font-display text-[100px] leading-[.8] tracking-[-4px] text-brand max-xl:mt-0 max-xl:text-[64px]"
      >
        Built like
        <br />
        our name
        <br />
        is on it
      </TextReveal>
      <div className="col-start-5 col-end-7 row-start-1 relative h-[299px] w-[358px] justify-self-end max-xl:self-end">
        <div
          {...entrance('photos', 'family')}
          className="ml-auto -mt-[9px] translate-x-1 h-77 w-[271px] overflow-hidden"
        >
          <img
            {...responsiveImage('/about-page/story-family.webp', '271px')}
            alt="The Flores family"
            width="271"
            height="308"
            className="h-[416px] w-[313px] max-w-none -translate-x-[42px] -translate-y-[98px]"
          />
        </div>
        <img
          {...entrance('symbol')}
          src="/about-page/story-logo.svg"
          alt=""
          width="152"
          height="131"
          className="absolute left-0 bottom-0 h-[131px] w-38"
        />
      </div>
      <div className="col-start-3 col-end-6 row-start-3 flex items-start gap-6 text-lg leading-[normal] max-xl:flex-col">
        <TextReveal as="p" className="w-[309px] shrink-0 tracking-[-.36px] max-xl:w-full">
          Born from our family values and driven by our impact on communities, FLO, short for
          Flores, our family's last name, was founded on the belief that infrastructure should be
          built with intention, accountability, and long-term impact.
        </TextReveal>
        <TextReveal as="p" className="w-[319px] shrink-0 max-xl:w-full">
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
        className="col-start-1 col-end-3 row-start-1 row-span-4 mt-[620px] self-start h-[259px] w-[521px] overflow-hidden rounded-md max-xl:mt-0 max-xl:max-w-full"
      >
        <img
          {...responsiveImage('/about-page/story-team.webp', '521px')}
          alt="FLO team in the field"
          width="521"
          height="259"
          className="h-[471px] w-[629px] max-w-none -translate-x-[65px] -translate-y-[212px]"
        />
      </div>
      <div
        {...entrance('lines')}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: storyLines }}
        className="pointer-events-none col-start-1 col-end-7 row-start-4 -z-10 mt-2 -ml-[221px] h-[262px] w-[2096px] max-w-none self-start max-xl:mt-0"
      />
    </section>
  )
}
