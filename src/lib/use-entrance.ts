import { scheduleMotionPreparation } from './motion-preparation'
import { useGSAP } from '@gsap/react'
import { useHeroPreparation } from '../components/shared/hero-preparation'
import { animations, usesSimpleMotion } from './animations'
import { useRef } from 'react'
import { gsap } from 'gsap'

gsap.registerPlugin(useGSAP)
import { motionEase } from './motion-ease'
import type { RefObject } from 'react'

export type EntranceGroup = {
  name: string
  distance: number
  scale?: number
  wipe?: 'up' | 'side' | 'center' | 'bottom-to-top'
  simultaneous?: boolean
  mobileFade?: boolean
  animate?: (target: Element) => void | (() => void)
}

/** Shared lifecycle only. Targets and choreography are owned by each component. */
export function useEntrance(root: RefObject<HTMLElement | null>, groups: readonly EntranceGroup[]) {
  const preparation = useHeroPreparation()
  const targetsRef = useRef(new Map<string, Map<string, Element>>())
  const bindingsRef = useRef(
    new Map<string, { ref: (node: Element | null) => void; 'data-entrance': string }>(),
  )
  const bind = (name: string, key = name) => {
    const id = `${name}:${key}`
    let binding = bindingsRef.current.get(id)
    if (!binding) {
      binding = {
        'data-entrance': name,
        ref: (node) => {
          let targets = targetsRef.current.get(name)
          if (!targets) targetsRef.current.set(name, (targets = new Map()))
          if (node) targets.set(key, node)
          else targets.delete(key)
        },
      }
      bindingsRef.current.set(id, binding)
    }
    return binding
  }
  useGSAP(
    () => {
      const scope = root.current
      if (!scope) return
      // Preference changes can revert motion without dismantling this hook.
      const context = gsap.context(() => {}, scope)
      const prepared = preparation?.register()
      const media = matchMedia('(prefers-reduced-motion: reduce)')
      const observers: IntersectionObserver[] = []
      let disposed = false
      const pending = new Set<() => void>()
      const enqueue = (run: () => void) => {
        const cancel = scheduleMotionPreparation(() => {
          pending.delete(cancel)
          if (!disposed && !media.matches) run()
        })
        pending.add(cancel)
      }

      const stop = (reveal = false) => {
        pending.forEach((cancel) => cancel())
        pending.clear()
        observers.forEach((observer) => observer.disconnect())
        context.revert()
        groups.forEach((group) =>
          targetsRef.current
            .get(group.name)
            ?.forEach((element) => element.removeAttribute('data-motion-pending')),
        )
        if (reveal)
          groups.forEach((group) => {
            const targets = Array.from(targetsRef.current.get(group.name)?.values() ?? [])
            targets.forEach((element) => element.setAttribute('data-motion-ready', ''))
          })
      }
      const onPreference = () => {
        if (media.matches) stop(true)
      }
      const setup = async () => {
        await document.fonts.ready
        if (disposed || media.matches || !document.documentElement.dataset.motion) {
          prepared?.()
          return
        }
        const { duration, delay, stagger } = animations.entrance
        const easing = motionEase()
        for (const group of groups) {
          const targets = Array.from(targetsRef.current.get(group.name)?.values() ?? [])
          // Order belongs to the section's DOM, never to IntersectionObserver batches.
          const positions = new Map<Element, number>()
          const counts = new Map<Element, number>()
          targets.forEach((target) => {
            const section = target.closest('section, header, footer') ?? scope
            const index = counts.get(section) ?? 0
            positions.set(target, index)
            counts.set(section, index + 1)
          })
          const reveal = (entries: IntersectionObserverEntry[]) => {
            if (disposed || media.matches) return
            const visible = entries.filter((entry) => entry.isIntersecting)
            const measurements = visible.map((entry) => entry.target.getBoundingClientRect())
            visible.forEach((entry, index) => {
              observer?.unobserve(entry.target)
              if (
                !document.documentElement.dataset.motion ||
                entry.target.hasAttribute('data-motion-ready')
              )
                return
              const mobile = usesSimpleMotion()
              if (mobile && (!group.wipe || group.mobileFade)) {
                context.add(() => {
                  gsap.fromTo(
                    entry.target,
                    { opacity: 0 },
                    {
                      opacity: 1,
                      duration: animations.mobile.duration / 1000,
                      ease: 'power1.out',
                      clearProps: 'opacity',
                    },
                  )
                })
                preparation?.hold(context)
                entry.target.setAttribute('data-motion-ready', '')
                return
              }
              if (group.animate) {
                context.add(() => group.animate?.(entry.target))
                preparation?.hold(context)
                entry.target.setAttribute('data-motion-ready', '')
                return
              }
              const bounds = measurements[index]
              const closedClip =
                group.wipe === 'side'
                  ? `inset(0px ${bounds.width}px 0px 0px)`
                  : group.wipe === 'center'
                    ? `inset(${bounds.height / 2}px 0px ${bounds.height / 2}px 0px)`
                    : group.wipe === 'bottom-to-top'
                      ? `inset(${bounds.height}px 0px 0px 0px)`
                      : `inset(0px 0px ${bounds.height}px 0px)`
              context.add(() => {
                const timeline = gsap.timeline()
                const start =
                  mobile || group.simultaneous
                    ? 0
                    : (delay +
                        Math.min(positions.get(entry.target) ?? 0, 2) * Math.min(stagger, 100)) /
                      1000
                timeline.fromTo(
                  entry.target,
                  {
                    opacity: group.wipe ? 1 : 0,
                    ...(group.distance ? { y: group.distance } : {}),
                    ...(group.scale ? { scale: group.scale } : {}),
                    ...(group.wipe ? { clipPath: closedClip } : {}),
                  },
                  {
                    opacity: 1,
                    ...(group.distance ? { y: 0 } : {}),
                    ...(group.scale ? { scale: 1 } : {}),
                    ...(group.wipe ? { clipPath: 'inset(0px 0px 0px 0px)' } : {}),
                    duration: (mobile ? animations.mobile.maskDuration : duration) / 1000,
                    ease: easing,
                    // Release masks and transforms so hover styles work after entry.
                    clearProps: [
                      'opacity',
                      ...(group.distance || group.scale ? ['transform'] : []),
                      ...(group.wipe ? ['clipPath'] : []),
                    ].join(','),
                  },
                  start,
                )
              })
              preparation?.hold(context)
              entry.target.setAttribute('data-motion-ready', '')
            })
          }
          const observer = new IntersectionObserver(
            (entries) => {
              const visible = entries.filter((entry) => entry.isIntersecting)
              visible.forEach((entry) => observer.unobserve(entry.target))
              if (visible.length) enqueue(() => reveal(visible))
            },
            { threshold: 0.08 },
          )
          if (preparation)
            enqueue(() =>
              reveal(
                targets
                  .filter((target) => target.getClientRects().length > 0)
                  .map((target) => ({ target, isIntersecting: true }) as IntersectionObserverEntry),
              ),
            )
          else
            targets.forEach((element) => {
              element.setAttribute('data-motion-pending', '')
              observer.observe(element)
            })
          observers.push(observer)
        }
        prepared?.()
      }
      const onFocus = (event: FocusEvent) => {
        const target = event.target
        if (!(target instanceof Element)) return
        const control = target.closest('a, button')
        if (!control || !scope.contains(control)) return
        gsap.getTweensOf(control).forEach((tween) => tween.progress(1))
        control.setAttribute('data-motion-ready', '')
      }
      scope.addEventListener('focusin', onFocus)
      media.addEventListener('change', onPreference)
      void setup()
      return () => {
        disposed = true
        prepared?.()
        stop()
        targetsRef.current.forEach((targets) =>
          targets.forEach((element) => element.removeAttribute('data-motion-ready')),
        )
        scope.removeEventListener('focusin', onFocus)
        media.removeEventListener('change', onPreference)
      }
    },
    { scope: root, dependencies: [groups, preparation], revertOnUpdate: true },
  )
  return bind
}
