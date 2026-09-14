import { responsiveImage, responsiveSource } from '../../lib/images'
import { useEntrance } from '../../lib/use-entrance'
import type { EntranceGroup } from '../../lib/use-entrance'
import { useRef } from 'react'
import { Decoration } from '../shared/decoration'
import { TextReveal } from '../text-reveal'
const entrances = [{ name: 'images', distance: 0, wipe: 'up' }] satisfies readonly EntranceGroup[]

export function HomeAbout() {
  const galleryRef = useRef<HTMLDivElement>(null)
  const scrollGallery = (direction: number) => {
    const gallery = galleryRef.current
    if (gallery)
      gallery.scrollBy({
        left: direction * 161.33,
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      })
  }
  const motionRef = useRef<HTMLElement>(null)
  const entrance = useEntrance(motionRef, entrances)
  return (
    <section
      ref={motionRef}
      id="about"
      aria-labelledby="about-heading"
      className="mt-0.5 relative isolate overflow-clip min-h-177.75 flex flex-col pt-[7.8rem] pr-page pb-4 pl-inset max-md:mt-0 max-md:min-h-133 max-md:pt-14 max-md:px-5 max-md:pb-11.25 bg-white"
    >
      <Decoration section="about" />
      {/* Desktop: 124.8px section padding + 262.674px copy row = SVG line at y=387.474. */}
      <div className="items-start flex flex-col gap-8 max-md:gap-6.25 lg:min-h-[262.674px] lg:flex-row lg:gap-16">
        <TextReveal
          as="h2"
          id="about-heading"
          className="max-w-lg flex-1 font-display text-display max-md:text-intro-heading-mobile max-md:max-w-79.5"
        >
          The partner
          <br className="max-md:hidden" /> communities
          <br className="max-md:hidden" /> rely on
        </TextReveal>
        <TextReveal
          as="p"
          className="[--reveal-delay:240] max-w-96 flex-1 text-intro max-md:text-[15px] max-md:leading-[1.4]"
        >
          From road repair to landslide stabilization, we restore what needs attention today while
          reinforcing what needs to last tomorrow.
        </TextReveal>
      </div>
      <div
        ref={galleryRef}
        className="min-w-0 mt-[2.85rem] lg:mt-0 self-end overflow-clip max-md:self-stretch max-md:mt-8 max-md:overflow-x-auto max-md:snap-x max-md:snap-mandatory max-md:gap-0.75 max-md:scrollbar-none flex gap-2.5"
      >
        <picture className="contents">
          <source
            media="(max-width: 767px)"
            {...responsiveSource('/about/team-mobile.webp', '158.33px')}
          />
          <img
            className="min-w-0 flex-1 w-55 h-77 object-cover max-md:w-[158.33px] max-md:flex-none max-md:h-52.5 max-md:snap-start"
            {...entrance('images', 'team')}
            {...responsiveImage('/about/team.webp', '220px')}
            alt="FLO team inspecting work on site"
            width="219"
            height="308"
            loading="lazy"
            decoding="async"
          />
        </picture>
        <picture className="contents">
          <source
            media="(max-width: 767px)"
            {...responsiveSource('/about/excavator-mobile.webp', '158.33px')}
          />
          <img
            className="min-w-0 flex-1 w-55 h-77 object-cover max-md:w-[158.33px] max-md:flex-none max-md:h-52.5 max-md:snap-start"
            {...entrance('images', 'excavator')}
            {...responsiveImage('/about/excavator.webp', '220px')}
            alt="Excavator carrying out hillside repairs"
            width="220"
            height="308"
            loading="lazy"
            decoding="async"
          />
        </picture>
        <picture className="contents">
          <source
            media="(max-width: 767px)"
            {...responsiveSource('/about/hillside-mobile.webp', '158.33px')}
          />
          <img
            className="min-w-0 flex-1 w-55 h-77 object-cover max-md:w-[158.33px] max-md:flex-none max-md:h-52.5 max-md:snap-start"
            {...entrance('images', 'hillside')}
            {...responsiveImage('/about/hillside.webp', '220px')}
            alt="Restored road along a wooded hillside"
            width="226"
            height="308"
            loading="lazy"
            decoding="async"
          />
        </picture>
      </div>
      <div className="mt-3 flex justify-end gap-[2.48px] md:hidden">
        <button
          {...entrance('images', 'previous')}
          type="button"
          aria-label="Previous gallery image"
          className="flex size-7 items-center justify-center"
          onClick={() => scrollGallery(-1)}
        >
          <img
            loading="lazy"
            src="/about/gallery-arrow.svg"
            alt=""
            width="28"
            height="28"
            className="rotate-180"
          />
        </button>
        <button
          {...entrance('images', 'next')}
          type="button"
          aria-label="Next gallery image"
          className="flex size-7 items-center justify-center"
          onClick={() => scrollGallery(1)}
        >
          <img loading="lazy" src="/about/gallery-arrow.svg" alt="" width="28" height="28" />
        </button>
      </div>
    </section>
  )
}
