import { responsiveImage } from '../../lib/images'
import { useEntrance } from './use-entrance'
import type { EntranceGroup } from './use-entrance'
import { useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { Decoration } from './decoration'
import { TextReveal } from '../text-reveal'
const entrances = [{ name: 'images', distance: 0, wipe: 'up', mobileFade: true }] satisfies readonly EntranceGroup[]

const footerLink = "relative inline-block no-underline after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out hover:after:origin-left hover:after:scale-x-100 focus-visible:after:origin-left focus-visible:after:scale-x-100 motion-reduce:after:transition-none"

export function Footer() {
  const motionRef = useRef<HTMLElement>(null)
  const entrance = useEntrance(motionRef, entrances)
  return <footer ref={motionRef} data-mobile-text="block" className="footer sticky bottom-0 z-0 isolate overflow-clip motion-reduce:relative max-md:relative [@media(max-height:650px)]:relative min-h-149.75 bg-brand [&_a]:transition-colors [&_a]:duration-250 [&_a]:motion-safe:hover:text-white [&_a]:motion-reduce:transition-none [&_address]:[--reveal-stagger:90] [&_li:nth-child(2)]:[--reveal-delay:180] [&_li:nth-child(3)]:[--reveal-delay:260] [&_li:nth-child(4)]:[--reveal-delay:340] section-shell px-page flex flex-col py-8 max-md:py-12 max-md:px-[34px]">
    <Decoration section="footer" />
    <div className="flex flex-wrap gap-10 md:gap-16 max-md:flex-col max-md:gap-[33px]">
      <div className="w-52 max-md:w-[236px] max-md:order-0"><TextReveal as="h2" className="font-semibold">Contact Us</TextReveal><TextReveal as="address" className="mt-8 text-small not-italic leading-tight">25029 Bleecker St<br />Suite 200<br />Baldwin Park, CA<br /><br /><br /><a className={footerLink} href="mailto:info@floengineering.net">info@floengineering.net</a><br />License No. 1078272</TextReveal></div>
      <div className="w-40 max-md:order-2 max-sm:w-auto max-sm:flex-1"><TextReveal as="h2" className="font-semibold">Company</TextReveal><ul className="mt-5 flex flex-col gap-3 text-small"><li><Link className={footerLink} to="/" hash="about"><TextReveal as="span">About us</TextReveal></Link></li><li><Link className={footerLink} to="/" hash="services"><TextReveal as="span">Services</TextReveal></Link></li><li><Link className={footerLink} to="/" hash="projects"><TextReveal as="span">Projects</TextReveal></Link></li><li><Link className={footerLink} to="/" hash="contact"><TextReveal as="span">Contact</TextReveal></Link></li></ul></div>
      <div className="w-40 max-md:order-2 max-sm:w-auto max-sm:flex-1"><TextReveal as="h2" className="font-semibold">Resources</TextReveal><TextReveal as="p" className="mt-5 text-small">Blog</TextReveal></div>
      <div className="ml-auto flex items-start gap-12 max-md:ml-0 max-md:basis-auto max-md:order-1 max-md:gap-12" aria-label="Social media"><img {...entrance('images', 'image-1')} src="/footer/social-1.svg" width="20" height="20" alt="Facebook" /><img {...entrance('images', 'image-2')} src="/footer/social-2.svg" width="20" height="20" alt="Instagram" /><img {...entrance('images', 'image-3')} src="/footer/social-3.svg" width="20" height="20" alt="LinkedIn" /></div>
    </div>
    <div className="mt-8 flex items-center gap-12 max-md:hidden"><span {...entrance('images', 'image-4')} className="flex size-13.5 shrink-0 items-center justify-center overflow-hidden mix-blend-darken"><img {...responsiveImage('/footer/dbe.webp', '54px')} alt="DBE certification" width="160" height="160" className="size-13.5 max-w-none shrink-0" loading="lazy" decoding="async" /></span><span {...entrance('images', 'image-5')} className="flex size-13.5 shrink-0 items-center justify-center overflow-hidden mix-blend-darken"><img {...responsiveImage('/footer/sbe.webp', '85.5px')} alt="SBE certification" width="160" height="160" className="size-[85.5px] max-w-none shrink-0 -translate-x-[2.4px] translate-y-[0.3px]" loading="lazy" decoding="async" /></span></div>
    <div className="footer-bottom max-md:pt-9 max-md:flex-col max-md:items-start max-md:gap-[57px] mt-auto flex flex-wrap items-end justify-between gap-8 pt-24">
      <Link to="/" hash="home" aria-label="FLO home" className="flex items-start max-md:order-2"><img {...entrance('images', 'image-6')} className="footer-logo w-97.5 h-auto max-[1100px]:w-72 max-md:w-[178px]" src="/footer/logo.svg" width="390" height="182" alt="FLO" /><img {...entrance('images', 'image-7')} src="/footer/trademark.svg" alt="" width="30" height="16" className="-ml-5 mt-1" /></Link>
      <div className="flex flex-wrap gap-8 pb-1 text-caption max-md:flex-col max-md:gap-3.5"><TextReveal as="span">Privacy policy</TextReveal><TextReveal as="span">Terms of service</TextReveal><TextReveal as="span">Cookies settings</TextReveal></div>
      <TextReveal as="p" className="pb-1 text-caption max-md:order-3">© 2026 FLO Engineering. All rights reserved.</TextReveal>
    </div>
  </footer>
}
