import { useRef } from 'react'
import { useEntrance, type EntranceGroup } from '../../lib/use-entrance'
import { Navbar } from '../shared/navbar'
import { TextReveal } from '../text-reveal'
import { HeroPreparation } from '../shared/hero-preparation'
import { responsiveImage } from '../../lib/images'

const entrances = [{ name: 'socials', distance: 20 }] satisfies readonly EntranceGroup[]

export function ContactHero() {
  return (
    <HeroPreparation>
      <ContactHeroContent />
    </HeroPreparation>
  )
}

function ContactHeroContent() {
  const ref = useRef<HTMLElement>(null)
  const entrance = useEntrance(ref, entrances)
  return (
    <header
      ref={ref}
      className="relative isolate min-h-116.25 overflow-clip bg-ink text-white max-md:min-h-100"
    >
      <img
        {...responsiveImage('/contact-page/hero.webp', '100vw')}
        alt=""
        width="1920"
        height="1080"
        fetchPriority="high"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[center_65%]"
      />
      <div className="absolute inset-0 -z-10 bg-black/30" />
      <Navbar variant="photo" />
      <div className="mx-auto flex max-w-178.5 flex-col items-center gap-7.5 px-5 pt-27.5 pb-24 text-center md:pb-0 max-md:pt-20">
        <TextReveal
          as="h1"
          className="md:h-10.5 text-[52px] leading-14.5 tracking-[-1.04px] uppercase max-md:text-[38px]"
        >
          Let’s build together
        </TextReveal>
        <img
          {...entrance('socials')}
          src="/contact-page/socials.svg"
          alt="Instagram, LinkedIn and Facebook"
          width="157"
          height="20"
          className="h-[19.783px] w-39.25"
        />
      </div>
    </header>
  )
}
