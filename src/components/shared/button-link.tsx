import { Link } from '@tanstack/react-router'
import { Rollover } from './rollover'
import type { ReactNode, Ref } from 'react'

export function ButtonLink({
  children,
  href,
  primary = false,
  arrow = false,
  ref,
  'data-entrance': entrance,
}: {
  children: ReactNode
  href: string
  primary?: boolean
  arrow?: boolean
  ref?: Ref<HTMLAnchorElement>
  'data-entrance'?: string
}) {
  const className = `button inline-flex items-center justify-center gap-3 min-h-9 px-4 py-2 rounded-button font-display text-base leading-[1.2] has-[img]:p-[.2rem] has-[img]:pl-[.8rem] active:scale-[.98] [--reveal-delay:0] motion-reduce:transition-none ${primary ? 'bg-brand text-white' : 'bg-white text-ink'}`
  const content = (
    <>
      <Rollover>{children}</Rollover>
      {arrow && (
        <Rollover icon>
          <img src="/services/arrow.svg" alt="" width="34" height="34" />
        </Rollover>
      )}
    </>
  )
  return href.startsWith('#') ? (
    <Link ref={ref} data-entrance={entrance} to="/" hash={href.slice(1)} className={className}>
      {content}
    </Link>
  ) : (
    <a ref={ref} data-entrance={entrance} href={href} className={className}>
      {content}
    </a>
  )
}
