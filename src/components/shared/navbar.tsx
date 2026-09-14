import { useEntrance } from './use-entrance'
import type { EntranceGroup } from './use-entrance'
import { useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { TextReveal } from '../text-reveal'
import { useCallback, useState } from 'react'
import { MobileMenu } from './mobile-menu'

import { navigationLinks as links } from './navigation'

const entrances = [{ name: 'controls', distance: 20 }] satisfies readonly EntranceGroup[]

export function Navbar({ light = false, variant = 'default' }: { light?: boolean; variant?: 'default' | 'photo' }) {
  const motionRef = useRef<HTMLElement>(null)
  const entrance = useEntrance(motionRef, entrances)
  const [open, setOpen] = useState(false)
  const closeMenu = useCallback(() => setOpen(false), [])
  return (
    <nav
      ref={motionRef}
      aria-label="Main navigation"
      className={`${light ? 'text-ink [&_button>span]:bg-ink md:pt-8' : 'text-white'} navbar flex items-center gap-20 max-w-174 mx-auto pt-5.25 font-display text-sm max-md:mx-5 max-md:pt-[18px] max-md:gap-4 max-md:flex-wrap [--reveal-duration:750] [--reveal-delay:80] [&_a]:transition-colors [&_a]:duration-250 [&_a:not(.brand-logo)]:motion-safe:hover:text-brand [&_a]:motion-reduce:transition-none`}
    >
      <div className="hidden flex-1 items-center justify-between md:flex">
        {links.slice(0, 2).map((link) => (
          <Link
            {...entrance('controls', link.label)}
            key={link.label}
            to={link.to}
            hash={link.hash}
          >
            <TextReveal as="span">{link.label}</TextReveal>
          </Link>
        ))}
      </div>
      <Link
        {...entrance('controls', 'logo')}
        to="/"
        hash="home"
        aria-label="FLO Engineering home"
        className={`${variant === 'photo' ? "[background-image:url('/contact-page/nav-detail.svg'),url('/contact-page/nav-logo.svg')]! [&_.brand-word]:text-white" : light ? "[background-image:url('/about-page/nav-detail.svg'),url('/about-page/nav-logo.svg')]! [&_.brand-word]:text-white" : ''} brand-logo max-md:size-[69px] max-md:pb-[16.7px] max-md:bg-size-[11.87px_11.87px,contain] max-md:bg-position-[right_16px_top_28.6px,center] w-21.5 h-21.5 [background:url('/navbar/logo-detail.svg')_right_1.25rem_top_2.22rem/.925rem_.925rem_no-repeat,url('/navbar/logo.svg')_center/contain_no-repeat] flex items-end justify-center pb-[1.3rem] shrink-0`}
      >
        <TextReveal
          as="span"
          className="brand-word max-md:text-[3.842px] max-md:tracking-[1.806px] font-display text-[4.789px] leading-[.8] tracking-[2.2508px] text-ink"
        >
          ENGINEERING
        </TextReveal>
      </Link>
      <div className="hidden flex-1 items-center justify-between md:flex">
        {links.slice(2).map((link) => (
          <Link
            {...entrance('controls', link.label)}
            key={link.label}
            to={link.to}
            hash={link.hash}
          >
            <TextReveal as="span">{link.label}</TextReveal>
          </Link>
        ))}
      </div>
      <button
        {...entrance('controls', 'menu')}
        type="button"
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        className="ml-auto flex min-h-14 w-14 flex-col items-center justify-center gap-2.5 md:hidden"
        onClick={() => setOpen(true)}
      >
        {[0, 1, 2].map((line) => (
          <span key={line} aria-hidden="true" className="h-[1.3px] w-14 shrink-0 bg-white" />
        ))}
      </button>
      {open && <MobileMenu links={links} onClose={closeMenu} />}
    </nav>
  )
}
