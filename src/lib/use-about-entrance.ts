import { scheduleMotionPreparation } from './motion-preparation'
import { useRef } from 'react'
import type { RefObject } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { animations } from './animations'
import { motionEase } from './motion-ease'
import type { EntranceGroup } from './use-entrance'

gsap.registerPlugin(useGSAP)

/** About section entries. GSAP owns tweens; observers are disconnected on teardown. */
export function useAboutEntrance(
  root: RefObject<HTMLElement | null>,
  groups: readonly EntranceGroup[],
) {
  const targets = useRef(new Map<string, { group: string; node: Element }>())
  useGSAP(
    (_context, contextSafe) => {
      const media = gsap.matchMedia()
      media.add(
        {
          always: 'all',
          reduced: '(prefers-reduced-motion: reduce)',
          mobile: '(max-width: 1023px)',
        },
        (context) => {
          const { reduced, mobile } = context.conditions!
          const cleanups: Array<() => void> = []
          const enter = contextSafe!((element: Element, group: EntranceGroup) => {
            if (group.animate) {
              const cleanup = group.animate(element)
              if (cleanup) cleanups.push(cleanup)
            } else {
              const bounds = element.getBoundingClientRect()
              gsap.fromTo(
                element,
                {
                  clipPath:
                    group.wipe === 'side'
                      ? `inset(0px ${bounds.width}px 0px 0px)`
                      : `inset(${bounds.height}px 0px 0px 0px)`,
                },
                {
                  clipPath: 'inset(0px 0px 0px 0px)',
                  duration:
                    (mobile ? animations.mobile.maskDuration : animations.entrance.duration) / 1000,
                  ease: motionEase(),
                  clearProps: 'clipPath',
                },
              )
            }
            element.setAttribute('data-motion-ready', '')
          })
          const observer = new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                if (!entry.isIntersecting) continue
                observer.unobserve(entry.target)
                const group = groups.find(
                  (group) => group.name === entry.target.getAttribute('data-entrance'),
                )
                if (group)
                  cleanups.push(scheduleMotionPreparation(() => enter(entry.target, group)))
              }
            },
            { threshold: 0 },
          )
          targets.current.forEach(({ node }) => {
            if (reduced || !document.documentElement.dataset.motion)
              node.setAttribute('data-motion-ready', '')
            else {
              node.setAttribute('data-motion-pending', '')
              observer.observe(node)
            }
          })
          return () => {
            observer.disconnect()
            cleanups.forEach((cleanup) => cleanup())
          }
        },
      )
      return () => media.revert()
    },
    { scope: root },
  )
  return (group: string, key = group) => ({
    'data-entrance': group,
    ref: (node: Element | null) => {
      const id = `${group}:${key}`
      if (node) targets.current.set(id, { group, node })
      else targets.current.delete(id)
    },
  })
}
