import { useEntrance } from './use-entrance'
import type { EntranceGroup } from './use-entrance'
import { useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { Decoration } from './decoration'
import { TextReveal } from '../text-reveal'
const entrances = [{ name: 'images', distance: 0, wipe: 'up', mobileFade: true }] satisfies readonly EntranceGroup[]

export function Footer() {
  const motionRef = useRef<HTMLElement>(null)
  const entrance = useEntrance(motionRef, entrances)
  return <footer ref={motionRef} data-mobile-text="block" className="footer relative isolate overflow-clip min-h-149.75 bg-brand [&_a]:transition-colors [&_a]:duration-250 [&_a]:motion-safe:hover:text-white [&_a]:motion-reduce:transition-none [&_address]:[--reveal-stagger:90] [&_li:nth-child(2)]:[--reveal-delay:180] [&_li:nth-child(3)]:[--reveal-delay:260] [&_li:nth-child(4)]:[--reveal-delay:340] section-shell px-page flex flex-col py-8 max-md:py-12 max-md:px-[34px]">
    <Decoration section="footer" />
    <div className="flex flex-wrap gap-10 md:gap-16 max-md:flex-col max-md:gap-[33px]">
      <div className="w-52 max-md:w-[236px] max-md:order-0"><TextReveal as="h2" className="font-semibold">Contact Us</TextReveal><TextReveal as="address" className="mt-8 text-small not-italic leading-tight">251 South Lake Avenue<br />Suite 800<br />Pasadena, CA<br /><br /><br /><a className="underline" href="mailto:info@floengineering.net">info@floengineering.net</a><br />License No. 1078272</TextReveal></div>
      <div className="w-40 max-md:order-2 max-sm:w-auto max-sm:flex-1"><TextReveal as="h2" className="font-semibold">Company</TextReveal><ul className="mt-5 flex flex-col gap-3 text-small"><li><Link to="/" hash="about"><TextReveal as="span">About us</TextReveal></Link></li><li><Link to="/" hash="services"><TextReveal as="span">Services</TextReveal></Link></li><li><Link to="/" hash="projects"><TextReveal as="span">Projects</TextReveal></Link></li><li><Link to="/" hash="contact"><TextReveal as="span">Contact</TextReveal></Link></li></ul></div>
      <div className="w-40 max-md:order-2 max-sm:w-auto max-sm:flex-1"><TextReveal as="h2" className="font-semibold">Resources</TextReveal><TextReveal as="p" className="mt-5 text-small">Blog</TextReveal></div>
      <div className="ml-auto flex items-start gap-12 max-md:ml-0 max-md:basis-auto max-md:order-1 max-md:gap-12" aria-label="Social media"><img {...entrance('images', 'image-1')} src="/footer/social-1.svg" width="20" height="20" alt="Facebook" /><img {...entrance('images', 'image-2')} src="/footer/social-2.svg" width="20" height="20" alt="Instagram" /><img {...entrance('images', 'image-3')} src="/footer/social-3.svg" width="20" height="20" alt="LinkedIn" /></div>
    </div>
    <div className="mt-8 flex items-center gap-12 max-md:hidden"><img {...entrance('images', 'image-4')} src="/footer/dbe.webp" alt="DBE certification" width="54" height="54" className="mix-blend-darken" loading="lazy" decoding="async" /><img {...entrance('images', 'image-5')} src="/footer/sbe.webp" alt="SBE certification" width="54" height="56" className="mix-blend-darken" loading="lazy" decoding="async" /></div>
    <div className="footer-bottom max-md:pt-9 max-md:flex-col max-md:items-start max-md:gap-[57px] mt-auto flex flex-wrap items-end justify-between gap-8 pt-24">
      <Link to="/" hash="home" aria-label="FLO home" className="flex items-start max-md:order-2"><img {...entrance('images', 'image-6')} className="footer-logo w-97.5 h-auto max-[1100px]:w-72 max-md:w-[178px]" src="/footer/logo.svg" width="390" height="182" alt="FLO" /><img {...entrance('images', 'image-7')} src="/footer/trademark.svg" alt="" width="30" height="16" className="-ml-5 mt-1" /></Link>
      <div className="flex flex-wrap gap-8 pb-1 text-caption max-md:flex-col max-md:gap-3.5"><TextReveal as="span">Privacy policy</TextReveal><TextReveal as="span">Terms of service</TextReveal><TextReveal as="span">Cookies settings</TextReveal></div>
      <TextReveal as="p" className="pb-1 text-caption max-md:order-3">© 2026 FLO Engineering. All rights reserved.</TextReveal>
    </div>
  </footer>
}
