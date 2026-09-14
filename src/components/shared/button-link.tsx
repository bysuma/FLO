import { cn } from '../../lib/cn'
import { Link } from '@tanstack/react-router'
import { Rollover } from './rollover'
import type { ReactNode, Ref } from 'react'

export function ButtonLink({
  children,
  href,
  primary = false,
  arrow = false,
  iconClassName,
  ref,
  className: extraClassName = '',
  'data-entrance': entrance,
}: {
  children: ReactNode
  className?: string
  href: string
  primary?: boolean
  arrow?: boolean
  iconClassName?: string
  ref?: Ref<HTMLAnchorElement>
  'data-entrance'?: string
}) {
  const className = cn(
    "inline-flex items-center justify-center gap-3 min-h-9 px-4 py-2 rounded-button font-display text-base leading-[1.2] active:scale-[.98] [--reveal-delay:0] motion-reduce:transition-none",
    arrow && 'p-[.2rem] pl-[.8rem]',
    primary ? 'bg-[#3564ed] text-white' : 'bg-white text-ink',
    extraClassName,
  )
  const content = (
    <>
      <Rollover>{children}</Rollover>
      {arrow && (
        <Rollover icon>
          <img
            className={iconClassName}
            loading="lazy"
            src="/services/arrow.svg"
            alt=""
            width="34"
            height="34"
          />
        </Rollover>
      )}
    </>
  )
  return href === '/contact' ? (
    <Link ref={ref} data-entrance={entrance} to="/contact" className={className}>
      {content}
    </Link>
  ) : href.startsWith('#') ? (
    <Link ref={ref} data-entrance={entrance} to="/" hash={href.slice(1)} className={className}>
      {content}
    </Link>
  ) : (
    <a ref={ref} data-entrance={entrance} href={href} className={className}>
      {content}
    </a>
  )
}
