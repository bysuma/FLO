import { HeroPreparation } from '../shared/hero-preparation'
import { useEntrance } from '../../lib/use-entrance'
import type { EntranceGroup } from '../../lib/use-entrance'
import { useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { Rollover } from '../shared/rollover'
import { Decoration } from '../shared/decoration'
import { HomeVideo } from './HomeVideo'
import { TextReveal } from '../text-reveal'
import { Navbar } from '../shared/navbar'
import { ButtonLink } from '../shared/button-link'

const entrances = [{ name: 'controls', distance: 20 }] satisfies readonly EntranceGroup[]

export function HomeHero() {
  return (
    <HeroPreparation>
      <HeroContent />
    </HeroPreparation>
  )
}

function HeroContent() {
  const motionRef = useRef<HTMLElement>(null)
  const entrance = useEntrance(motionRef, entrances)
  return (
    <header
      ref={motionRef}
      id="home"
      className="sticky top-0 z-0 isolate min-h-189.5 overflow-clip bg-ink mask-[url('/hero/background.svg')] mask-size-[100%_100%] mask-no-repeat mask-center max-[1100px]:min-h-0 max-md:min-h-163 max-md:mask-none"
    >
      <Decoration section="hero" />
      <Navbar />
      <div className="flex items-start gap-0 ml-35.5 pt-26.75 pb-11 max-[1100px]:flex-col max-[1100px]:gap-10 max-[1100px]:ml-0 max-[1100px]:px-page max-[1100px]:pt-14 max-[1100px]:pb-12 max-md:pt-15 max-md:gap-6 max-md:pb-6.75 min-[1101px]:justify-between">
        <div className="min-w-0 max-[1100px]:self-stretch basis-125 pt-[.1rem] max-[1100px]:basis-auto max-md:pt-0 min-[1101px]:pt-[1.95px] flex shrink-0 flex-col items-start">
          <TextReveal
            as="h1"
            className="font-sans text-hero max-md:text-hero-mobile md:max-[1100px]:text-[60px] uppercase text-brand max-md:tracking-[-1.38px]"
          >
            <span className="font-light min-[1101px]:leading-[.958]">
              Built on
              <br />
              Integrity.
            </span>
            <br />
            <span className="max-md:font-semibold">
              Engineered
              <br />
              to last.
            </span>
          </TextReveal>
          <div className="min-[1101px]:ml-1 min-[1101px]:gap-7.5 mt-9 max-md:mt-5.75 flex items-center gap-7 max-md:gap-7.5">
            <ButtonLink
              className="min-w-31.75 min-[1101px]:w-31.75 min-[1101px]:px-3.25 min-[1101px]:py-2.25 min-[1101px]:leading-normal"
              {...entrance('controls', 'projects')}
              href="#projects"
              primary
            >
              Projects
            </ButtonLink>
            <Link
              {...entrance('controls', 'services')}
              to="/"
              hash="services"
              className="[--reveal-delay:0] flex min-h-10 items-center gap-2 font-display text-white"
            >
              <span className="size-1 bg-accent" />
              <Rollover>Services</Rollover>
            </Link>
          </div>
        </div>
        <HomeVideo
          src="/hero/landscape-desktop.mp4"
          mobileSrc="/hero/landscape-mobile.mp4"
          alt="FLO Engineering project video"
        />
      </div>
    </header>
  )
}
