import { useEffect, useRef } from 'react'
import { useBlocker, useRouter } from '@tanstack/react-router'
import { gsap } from 'gsap'
import { animations } from '../lib/animations'

/** A persistent curtain bridges route loading without replacing Router links. */
export function PageTransition() {
  const router = useRouter()
  const curtainRef = useRef<HTMLDivElement>(null)
  const pendingRef = useRef<Promise<void> | null>(null)
  const releaseRef = useRef<(() => void) | null>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useBlocker({
    enableBeforeUnload: false,
    shouldBlockFn: async ({ current, next }) => {
      const curtain = curtainRef.current
      if (
        current.pathname === next.pathname ||
        !curtain ||
        matchMedia('(prefers-reduced-motion: reduce)').matches
      )
        return false
      if (!pendingRef.current) {
        tweenRef.current?.kill()
        curtain.style.pointerEvents = 'auto'
        pendingRef.current = new Promise<void>((resolve) => {
          releaseRef.current = resolve
          gsap.set(curtain, {
            visibility: 'visible',
            yPercent: 0,
            scaleY: 0,
            transformOrigin: 'bottom',
          })
          tweenRef.current = gsap.to(curtain, {
            scaleY: 1,
            duration: animations.pageTransition.duration / 1000,
            ease: animations.pageTransition.ease,
            onComplete: resolve,
          })
        })
        // A rejected/cancelled navigation must never leave an opaque overlay.
        timeoutRef.current = setTimeout(() => {
          tweenRef.current?.kill()
          releaseRef.current?.()
          pendingRef.current = null
          gsap.set(curtain, { visibility: 'hidden', pointerEvents: 'none' })
        }, 10000)
      }
      // Keep the current route mounted until the curtain fully covers it.
      await pendingRef.current
      return false
    },
  })

  useEffect(() => {
    const unsubscribe = router.subscribe('onResolved', async () => {
      if (!pendingRef.current || !curtainRef.current) return
      const pending = pendingRef.current
      await pending
      if (pendingRef.current !== pending || !curtainRef.current) return
      clearTimeout(timeoutRef.current)
      pendingRef.current = null
      releaseRef.current = null
      tweenRef.current?.kill()
      const curtain = curtainRef.current
      tweenRef.current = gsap.to(curtain, {
        yPercent: -100,
        duration: matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 0
          : animations.pageTransition.duration / 1000,
        ease: animations.pageTransition.ease,
        onComplete: () => {
          gsap.set(curtain, { visibility: 'hidden', pointerEvents: 'none' })
        },
      })
    })
    return () => {
      unsubscribe()
      clearTimeout(timeoutRef.current)
      tweenRef.current?.kill()
      releaseRef.current?.()
      pendingRef.current = null
    }
  }, [router])

  return (
    <div
      ref={curtainRef}
      aria-hidden="true"
      className="pointer-events-none invisible fixed inset-0 z-[10000] bg-brand"
    />
  )
}
