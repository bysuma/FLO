import { useEntrance } from './use-entrance'
import type { EntranceGroup } from './use-entrance'
import { useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { Rollover } from './rollover'
import { Decoration } from './decoration'
import { HeroImage } from './hero-image'
import { TextReveal } from '../text-reveal'
import { Navbar } from './navbar'
import { ButtonLink } from './button-link'

const entrances = [{ name: 'controls', distance: 20 }] satisfies readonly EntranceGroup[]

export function Hero() {
  const motionRef = useRef<HTMLElement>(null)
  const entrance = useEntrance(motionRef, entrances)
  return <header ref={motionRef} id="home" className="hero relative isolate min-h-190 overflow-clip bg-ink mask-[url('/hero/background.svg')] mask-size-[100%_100%] mask-no-repeat mask-center max-[1100px]:min-h-0 max-md:min-h-[652px] max-md:mask-none min-[1101px]:min-h-[758px]">
    <Decoration section="hero" />
    <Navbar />
    <div className="hero-content flex items-start gap-0 ml-inset pt-26.75 pb-11.5 max-[1100px]:flex-col max-[1100px]:gap-10 max-[1100px]:ml-0 max-[1100px]:px-page max-[1100px]:pt-14 max-[1100px]:pb-12 max-md:pt-15 max-md:gap-6 max-md:pb-[27px] min-[1101px]:ml-[142px] min-[1101px]:mr-0 min-[1101px]:pt-[107px] min-[1101px]:pb-[44px] min-[1101px]:justify-between">
      <div className="hero-copy min-w-0 max-[1100px]:self-stretch basis-124.5 pt-[.1rem] max-[1100px]:basis-auto max-md:pt-0 min-[1101px]:basis-[500px] min-[1101px]:pt-[1.95px] [&_a]:[--reveal-delay:0] [&_.button]:min-w-[127px] min-[1101px]:[&_h1>.font-light]:leading-[.958] min-[1101px]:[&>div]:mt-[35.806px] min-[1101px]:[&>div]:ml-1 min-[1101px]:[&>div]:gap-[30px] min-[1101px]:[&_.button]:w-[127px] min-[1101px]:[&_.button]:px-[13px] min-[1101px]:[&_.button]:py-[9px] min-[1101px]:[&_.button]:leading-normal flex shrink-0 flex-col items-start">
        <TextReveal as="h1" className="font-sans text-hero max-md:text-hero-mobile md:max-[1100px]:text-[60px] uppercase text-brand max-md:tracking-[-1.38px]"><span className="font-light">Built on<br />Integrity.</span><br /><span className="max-md:font-semibold">Engineered<br />to last.</span></TextReveal>
        <div className="mt-9 max-md:mt-[23px] flex items-center gap-7 max-md:gap-7.5"><ButtonLink {...entrance('controls', 'projects')} href="#projects" primary>Projects</ButtonLink><Link {...entrance('controls', 'services')} to="/" hash="services" className="flex min-h-10 items-center gap-2 font-display text-white"><span className="size-1 bg-accent" /><Rollover>Services</Rollover></Link></div>
      </div>
      <HeroImage src="/hero/landscape.webp" alt="A winding mountain road surrounded by green hills" />
    </div>
  </header>
}
