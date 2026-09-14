import { socialLinks } from '../../lib/config'
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
        <div className="flex w-39.25 items-center justify-between" aria-label="Social media">
          <a {...entrance('socials', 'instagram')} href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="FLO Engineering on Instagram">
            <img src="/footer/social-1.svg" width="20" height="20" alt="" className="size-5 brightness-0 invert" />
          </a>
          <a {...entrance('socials', 'linkedin')} href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="FLO Engineering on LinkedIn">
            <img src="/footer/social-2.svg" width="20" height="20" alt="" className="size-5 brightness-0 invert" />
          </a>
          <img {...entrance('socials', 'facebook')} src="/footer/social-3.svg" width="20" height="20" alt="Facebook" className="size-5 brightness-0 invert" />
        </div>
      </div>
    </header>
  )
}
