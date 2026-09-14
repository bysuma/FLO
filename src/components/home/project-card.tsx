import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import type { ReactNode } from 'react'
import { gsap } from 'gsap'

gsap.registerPlugin(useGSAP)
import { animations } from '../../lib/animations'

export function ProjectCard({ image, children }: { image: ReactNode; children: ReactNode }) {
  const card = useRef<HTMLElement>(null)
  const backdrop = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const element = card.current
      const copy = content.current
      if (!element || !copy) return
      const media = gsap.matchMedia()
      media.add(
        {
          hover: '(hover: hover) and (pointer: fine)',
          reduced: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          if (!context.conditions?.hover) return
          const reduced = context.conditions.reduced
          const { duration, ease } = animations.projectHover
          const textColor = getComputedStyle(copy).color
          const timeline = gsap
            .timeline({ paused: true })
            .fromTo(
              backdrop.current,
              { scaleY: 0 },
              { scaleY: 1, duration: duration / 1000, ease },
              0,
            )
            .fromTo(
              copy,
              { color: textColor, y: 0 },
              { color: '#ffffff', y: -4, duration: duration / 1000, ease },
              0,
            )
          let hovered = false
          const setActive = (active: boolean) => {
            if (reduced) timeline.progress(active ? 1 : 0).pause()
            else if (active) timeline.timeScale(1).play()
            else timeline.timeScale(1.25).reverse()
          }
          const enter = () => {
            hovered = true
            setActive(true)
          }
          const leave = () => {
            hovered = false
            setActive(element.contains(document.activeElement))
          }
          const focus = () => setActive(true)
          const blur = (event: FocusEvent) => {
            if (!element.contains(event.relatedTarget as Node | null)) setActive(hovered)
          }
          element.addEventListener('pointerenter', enter)
          element.addEventListener('pointerleave', leave)
          element.addEventListener('focusin', focus)
          element.addEventListener('focusout', blur)
          return () => {
            element.removeEventListener('pointerenter', enter)
            element.removeEventListener('pointerleave', leave)
            element.removeEventListener('focusin', focus)
            element.removeEventListener('focusout', blur)
          }
        },
        element,
      )
      return () => media.revert()
    },
    { scope: card },
  )

  return (
    <article ref={card} className="flex min-w-0 flex-1 flex-col bg-surface max-md:bg-[#f6f6f2]">
      {image}
      <div className="relative isolate flex flex-1 overflow-clip">
        <div
          ref={backdrop}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 origin-bottom scale-y-0 bg-ink"
        />
        <div
          ref={content}
          className="flex min-w-0 flex-1 flex-col items-start px-5 pt-8 pb-6 text-ink max-md:p-[18px]"
        >
          {children}
        </div>
      </div>
    </article>
  )
}
