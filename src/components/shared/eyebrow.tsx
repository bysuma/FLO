import { TextReveal } from '../text-reveal'
import type { ReactNode } from 'react'

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <span
      data-eyebrow
      className={`[--reveal-duration:700] [--reveal-delay:40] self-start rounded-tag border px-3 py-1.5 font-display text-eyebrow uppercase ${light ? 'border-white text-white' : 'border-brand text-ink'}`}
    >
      <TextReveal as="span">{children}</TextReveal>
    </span>
  )
}
