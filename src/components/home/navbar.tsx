import { useEntrance } from './use-entrance'
import type { EntranceGroup } from './use-entrance'
import { useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { TextReveal } from '../text-reveal'
import { useCallback, useState } from 'react'
import { MobileMenu } from './mobile-menu'

const links = [{ label: 'About us', href: '#about' }, { label: 'Services', href: '#services' }, { label: 'Projects', href: '#projects' }, { label: 'Contact Us', href: '#contact' }]

const entrances = [{ name: 'controls', distance: 20 }] satisfies readonly EntranceGroup[]

export function Navbar() {
  const motionRef = useRef<HTMLElement>(null)
  const entrance = useEntrance(motionRef, entrances)
  const [open, setOpen] = useState(false)
  const closeMenu = useCallback(() => setOpen(false), [])
  return <nav ref={motionRef} aria-label="Main navigation" className="navbar flex items-center gap-20 max-w-174 mx-auto pt-5.25 text-white font-display text-sm max-md:mx-page max-md:gap-4 max-md:flex-wrap [--reveal-duration:750] [--reveal-delay:80] [&_a]:transition-colors [&_a]:duration-250 [&_a:not(.brand-logo)]:motion-safe:hover:text-brand [&_a]:motion-reduce:transition-none">
    <div className="hidden flex-1 items-center justify-between md:flex">{links.slice(0, 2).map(link => <Link {...entrance('controls', link.href)} key={link.href} to="/" hash={link.href.slice(1)}><TextReveal as="span">{link.label}</TextReveal></Link>)}</div>
    <Link {...entrance('controls', 'logo')} to="/" hash="home" aria-label="FLO Engineering home" className="brand-logo w-21.5 h-21.5 [background:url('/navbar/logo-detail.svg')_right_1.25rem_top_2.22rem/.925rem_.925rem_no-repeat,url('/navbar/logo.svg')_center/contain_no-repeat] flex items-end justify-center pb-[1.3rem] shrink-0"><TextReveal as="span" className="brand-word font-display text-[4.789px] leading-[.8] tracking-[2.2508px] text-ink">ENGINEERING</TextReveal></Link>
    <div className="hidden flex-1 items-center justify-between md:flex">{links.slice(2).map(link => <Link {...entrance('controls', link.href)} key={link.href} to="/" hash={link.href.slice(1)}><TextReveal as="span">{link.label}</TextReveal></Link>)}</div>
    <button {...entrance('controls', 'menu')} type="button" aria-label="Open menu" aria-haspopup="dialog" aria-expanded={open} aria-controls="mobile-navigation"
      className="ml-auto flex min-h-14 w-14 flex-col items-center justify-center gap-2.5 md:hidden" onClick={() => setOpen(true)}>
      {[0, 1, 2].map(line => <span key={line} aria-hidden="true" className="h-[1.3px] w-14 shrink-0 bg-white" />)}
    </button>
    {open && <MobileMenu links={links} onClose={closeMenu} />}
  </nav>
}
