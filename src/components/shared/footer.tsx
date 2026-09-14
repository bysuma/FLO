import { company, contactLinks, socialLinks } from '../../lib/config'
import { responsiveImage } from '../../lib/images'
import { useEntrance } from '../../lib/use-entrance'
import type { EntranceGroup } from '../../lib/use-entrance'
import { useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { Decoration } from './decoration'
import { TextReveal } from '../text-reveal'
const entrances = [
  { name: 'images', distance: 0, wipe: 'up', mobileFade: true },
] satisfies readonly EntranceGroup[]

const footerLink =
  'transition-colors duration-250 motion-safe:hover:text-white motion-reduce:transition-none relative inline-block no-underline after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out hover:after:origin-left hover:after:scale-x-100 focus-visible:after:origin-left focus-visible:after:scale-x-100 motion-reduce:after:transition-none'

export function Footer() {
  const motionRef = useRef<HTMLElement>(null)
  const entrance = useEntrance(motionRef, entrances)
  return (
    <footer
      ref={motionRef}
      data-mobile-text="block"
      className="sticky bottom-0 z-0 isolate overflow-clip motion-reduce:relative max-md:relative [@media(max-height:650px)]:relative min-h-149.75 bg-brand px-8 flex flex-col py-8 max-md:py-12 max-md:px-8.5"
    >
      <Decoration section="footer" />
      <div className="flex flex-wrap gap-10 max-md:flex-col max-md:gap-8.25">
        <div className="w-59">
          <TextReveal as="h2" className="text-base leading-5.5 font-semibold">
            Contact Us
          </TextReveal>
          <TextReveal
            as="address"
            className="mt-8 text-small not-italic leading-tight [--reveal-stagger:90]"
          >
            {company.address.street}
            <br />
            {company.address.suite}
            <br />
            {company.address.locality}
            <br />
            <br />
            <br />
            <a className={footerLink} href={contactLinks.email}>
              {company.email}
            </a>
            <br />
            License No. {company.licenseNumber}
          </TextReveal>
        </div>
        <div className="w-48 max-md:order-2 max-sm:w-auto max-sm:flex-1">
          <TextReveal as="h2" className="text-base leading-5.5 font-semibold">
            Company
          </TextReveal>
          <ul className="mt-6 flex flex-col gap-4 text-small">
            <li>
              <Link className={footerLink} to="/about">
                <TextReveal as="span">About us</TextReveal>
              </Link>
            </li>
            <li className="[--reveal-delay:180]">
              <Link className={footerLink} to="/" hash="services">
                <TextReveal as="span">Services</TextReveal>
              </Link>
            </li>
            <li className="[--reveal-delay:260]">
              <Link className={footerLink} to="/" hash="projects">
                <TextReveal as="span">Projects</TextReveal>
              </Link>
            </li>
            <li className="[--reveal-delay:340]">
              <Link className={footerLink} to="/contact">
                <TextReveal as="span">Contact</TextReveal>
              </Link>
            </li>
          </ul>
        </div>
        <div className="w-48 max-md:order-2 max-sm:w-auto max-sm:flex-1">
          <TextReveal as="h2" className="text-base leading-5.5 font-semibold">
            Resources
          </TextReveal>
          <TextReveal as="p" className="mt-6 text-small">
            Blog
          </TextReveal>
        </div>
        <div
          className="ml-auto flex items-start gap-12 max-md:ml-0 max-md:order-1"
          aria-label="Social media"
        >
          <a {...entrance('images', 'instagram')} href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="FLO Engineering on Instagram">
            <img loading="lazy" src="/footer/social-1.svg" width="20" height="20" alt="" />
          </a>
          <a {...entrance('images', 'linkedin')} href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="FLO Engineering on LinkedIn">
            <img loading="lazy" src="/footer/social-2.svg" width="20" height="20" alt="" />
          </a>
          <img {...entrance('images', 'facebook')} loading="lazy" src="/footer/social-3.svg" width="20" height="20" alt="Facebook" />
        </div>
      </div>
      <div className="max-md:pt-9 max-md:flex-col max-md:items-start max-md:gap-14.25 mt-auto flex flex-wrap items-end justify-between gap-8 pt-24">
        <Link to="/" hash="home" aria-label="FLO home" className="flex items-start max-md:order-2">
          <img
            loading="lazy"
            {...entrance('images', 'image-6')}
            className="w-97.5 h-auto max-[1100px]:w-72 max-md:w-44.5"
            src="/footer/logo.svg"
            width="390"
            height="182"
            alt="FLO"
          />
          <img
            loading="lazy"
            {...entrance('images', 'image-7')}
            src="/footer/trademark.svg"
            alt=""
            width="30"
            height="16"
            className="ml-1 mt-1 shrink-0"
          />
        </Link>
        <div className="flex flex-wrap gap-16 pb-1 text-caption max-md:flex-col max-md:gap-3.5">
          <TextReveal as="span">Privacy policy</TextReveal>
          <TextReveal as="span">Terms of service</TextReveal>
          <TextReveal as="span">Cookies settings</TextReveal>
        </div>
        <div className="flex flex-col items-end gap-6 max-md:items-start max-md:order-3">
          <div className="flex items-center gap-12">
            <span
              {...entrance('images', 'image-4')}
              className="flex size-13.5 shrink-0 items-center justify-center overflow-hidden mix-blend-darken"
            >
              <img
                {...responsiveImage('/footer/dbe.webp', '54px')}
                alt="DBE certification"
                width="160"
                height="160"
                className="size-13.5 max-w-none shrink-0"
                loading="lazy"
                decoding="async"
              />
            </span>
            <span
              {...entrance('images', 'image-5')}
              className="flex size-13.5 shrink-0 items-center justify-center overflow-hidden mix-blend-darken"
            >
              <img
                {...responsiveImage('/footer/sbe.webp', '85.5px')}
                alt="SBE certification"
                width="160"
                height="160"
                className="size-[85.5px] max-w-none shrink-0 translate-x-[-2.4px] translate-y-[0.3px]"
                loading="lazy"
                decoding="async"
              />
            </span>
          </div>
          <TextReveal as="p" className="pb-1 text-caption">
            © 2026 {company.name}. All rights reserved.
          </TextReveal>
        </div>
      </div>
    </footer>
  )
}
