import { animations, usesSimpleMotion } from '../../lib/animations'
import { useEffect } from 'react'
import { gsap } from 'gsap'
import { motionEase } from '../../lib/motion-ease'
import type { RefObject } from 'react'

export type EntranceGroup = {
  selector: string
  distance: number
  scale?: number
  wipe?: 'up' | 'side' | 'center'
  simultaneous?: boolean
  animate?: (target: Element) => void | (() => void)
}

/** Shared lifecycle only. Targets and choreography are owned by each component. */
export function useEntrance(root: RefObject<HTMLElement | null>, groups: readonly EntranceGroup[]) {
  useEffect(() => {
    const scope = root.current
    if (!scope) return
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const context = gsap.context(() => {}, scope)
    const observers: IntersectionObserver[] = []
    let disposed = false

    const stop = (reveal = false) => {
      observers.forEach(observer => observer.disconnect())
      context.revert()
      if (reveal) groups.forEach(group => {
        const targets = group.selector === ':self' ? [scope] : scope.querySelectorAll(group.selector)
        targets.forEach(element => element.setAttribute('data-motion-ready', ''))
      })
    }
    const onPreference = () => { if (media.matches) stop(true) }
    const setup = async () => {
      await document.fonts.ready
      if (disposed || media.matches || !document.documentElement.dataset.motion) return
      const { duration, delay, stagger } = animations.entrance
      const easing = motionEase()
      for (const group of groups) {
        const targets = group.selector === ':self' ? [scope] : Array.from(scope.querySelectorAll(group.selector))
        // Order belongs to the section's DOM, never to IntersectionObserver batches.
        const positions = new Map<Element, number>()
        const counts = new Map<Element, number>()
        targets.forEach(target => {
          const section = target.closest('section, header, footer') ?? scope
          const index = counts.get(section) ?? 0
          positions.set(target, index)
          counts.set(section, index + 1)
        })
        const observer = new IntersectionObserver(entries => {
          if (disposed || media.matches) return
          const visible = entries.filter(entry => entry.isIntersecting)
          const measurements = visible.map(entry => entry.target.getBoundingClientRect())
          visible.forEach((entry, index) => {
            observer.unobserve(entry.target)
            if (!document.documentElement.dataset.motion || entry.target.hasAttribute('data-motion-ready')) return
            const mobile = usesSimpleMotion()
            if (mobile && !group.wipe) {
              context.add(() => {
                gsap.fromTo(entry.target, { opacity: 0 }, {
                  opacity: 1,
                  duration: animations.mobile.duration / 1000,
                  ease: 'power1.out',
                  clearProps: 'opacity',
                })
              })
              entry.target.setAttribute('data-motion-ready', '')
              return
            }
            if (group.animate) {
              context.add(() => group.animate?.(entry.target))
              entry.target.setAttribute('data-motion-ready', '')
              return
            }
            const bounds = measurements[index]
            const closedClip = group.wipe === 'side'
              ? `inset(0px ${bounds.width}px 0px 0px)`
              : group.wipe === 'center'
                ? `inset(${bounds.height / 2}px 0px ${bounds.height / 2}px 0px)`
                : `inset(0px 0px ${bounds.height}px 0px)`
            context.add(() => {
              const timeline = gsap.timeline()
              const start = mobile || group.simultaneous ? 0 : (delay + Math.min(positions.get(entry.target) ?? 0, 2) * Math.min(stagger, 100)) / 1000
              timeline.fromTo(entry.target, {
                opacity: group.wipe ? 1 : 0,
                ...(group.distance ? { y: group.distance } : {}),
                ...(group.scale ? { scale: group.scale } : {}),
                ...(group.wipe ? { clipPath: closedClip } : {}),
              }, {
                opacity: 1,
                ...(group.distance ? { y: 0 } : {}),
                ...(group.scale ? { scale: 1 } : {}),
                ...(group.wipe ? { clipPath: 'inset(0px 0px 0px 0px)' } : {}),
                duration: (mobile ? animations.mobile.maskDuration : duration) / 1000,
                ease: easing,
                // Release masks and transforms so hover styles work after entry.
                clearProps: ['opacity', ...(group.distance || group.scale ? ['transform'] : []), ...(group.wipe ? ['clipPath'] : [])].join(','),
              }, start)

            })
            entry.target.setAttribute('data-motion-ready', '')
          })
        }, { threshold: .08 })
        targets.forEach(element => observer.observe(element))
        observers.push(observer)
      }
      document.documentElement.dataset.motion = 'ready'
    }
    const onFocus = (event: FocusEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const control = target.closest('a, button')
      if (!control || !scope.contains(control)) return
      gsap.getTweensOf(control).forEach(tween => tween.progress(1))
      control.setAttribute('data-motion-ready', '')
    }
    scope.addEventListener('focusin', onFocus)
    media.addEventListener('change', onPreference)
    void setup()
    return () => {
      disposed = true
      stop()
      scope.removeEventListener('focusin', onFocus)
      media.removeEventListener('change', onPreference)
    }
  }, [root, groups])
}
