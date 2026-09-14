import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { gsap } from 'gsap'
import { TextReveal } from '../text-reveal'

export function Rollover({
  children,
  icon = false,
  reveal = true,
}: {
  children: ReactNode
  icon?: boolean
  reveal?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = ref.current
    const control = element?.closest('a, button')
    if (!element || !control) return
    const media = gsap.matchMedia()
    media.add(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
      () => {
        const layers = element.querySelectorAll(':scope > span')
        const timeline = gsap
          .timeline({ paused: true, defaults: { duration: 0.3, ease: 'power2.inOut' } })
          .fromTo(layers[0], { y: 0, yPercent: 0 }, { y: 0, yPercent: -110 }, 0)
          .fromTo(
            layers[1],
            {
              y: 0,
              yPercent: 110,
              visibility: 'inherit',
            },
            { y: 0, yPercent: 0 },
            0,
          )
        const enter = () => timeline.play()
        const leave = () => timeline.reverse()
        control.addEventListener('pointerenter', enter)
        control.addEventListener('pointerleave', leave)
        return () => {
          control.removeEventListener('pointerenter', enter)
          control.removeEventListener('pointerleave', leave)
        }
      },
      element,
    )
    return () => media.revert()
  }, [])

  return (
    <span
      ref={ref}
      className="rollover inline-grid overflow-clip align-middle [&>span]:[grid-area:1/1] [&>span]:inline-flex [&>span]:items-center [&>span]:justify-center"
    >
      <span className="rollover-original">
        {icon || !reveal ? children : <TextReveal as="span">{children}</TextReveal>}
      </span>
      <span className="rollover-copy invisible" aria-hidden="true">
        {children}
      </span>
    </span>
  )
}
