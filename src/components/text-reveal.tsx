import { useHeroPreparation } from './shared/hero-preparation'
import { animations, usesSimpleMotion } from '../lib/animations'
import { createElement, useEffect, useRef } from 'react'
import type { HTMLAttributes } from 'react'
import { gsap } from 'gsap'
import { motionEase } from '../lib/motion-ease'
import { splitText } from 'kugiri'
import type { TextSplit } from 'kugiri'

type TextRevealProps = HTMLAttributes<HTMLElement> & {
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'blockquote' | 'address'
}

/** Progressive enhancement: SSR and reduced-motion users always get ordinary text. */
export function TextReveal({ as = 'h2', children, ...props }: TextRevealProps) {
  const preparation = useHeroPreparation()
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const prepared = preparation?.register()
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let disposed = false
    let split: TextSplit | undefined
    let preparedWidth = 0
    const context = gsap.context(() => {}, element)
    let observer: IntersectionObserver | undefined
    let resize: ResizeObserver | undefined
    let prewarm: IntersectionObserver | undefined

    const restore = (reveal = true) => {
      context.revert()
      split?.revert()
      split = undefined
      resize?.disconnect()
      if (reveal) element.setAttribute('data-motion-ready', '')
    }
    const stop = (reveal = true) => {
      observer?.disconnect()
      prewarm?.disconnect()
      restore(reveal)
      element.removeAttribute('data-motion-pending')
    }
    const onMotionChange = () => {
      if (motion.matches) stop()
    }

    const prepare = async () => {
      await document.fonts.ready
      if (disposed || motion.matches || !document.documentElement.dataset.motion) {
        prepared?.()
        return
      }
      const owner = element.closest('[data-reveal-owner], a[data-entrance], button')
      const configuredThreshold = Number.parseFloat(
        getComputedStyle(element).getPropertyValue('--reveal-threshold'),
      )
      const threshold = owner
        ? 0.08
        : Number.isFinite(configuredThreshold)
          ? configuredThreshold
          : 0.12
      const reveal = (entries: IntersectionObserverEntry[]) => {
        if (
          disposed ||
          motion.matches ||
          (!preparation && !entries.some((entry) => entry.isIntersecting))
        )
          return
        observer?.disconnect()
        if (!document.documentElement.dataset.motion || element.hasAttribute('data-motion-ready')) {
          prepared?.()
          return
        }
        try {
          // Compact footer copy does not need DOM splitting during touch scroll.
          if (usesSimpleMotion() && element.closest('[data-mobile-text="block"]')) {
            context.add(() => {
              gsap.fromTo(
                element,
                { y: animations.mobile.distance, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: animations.mobile.revealDuration / 1000,
                  ease: motionEase(),
                  clearProps: 'transform,opacity',
                },
              )
            })
            preparation?.hold(context)
            element.setAttribute('data-motion-ready', '')
            return
          }
          if (split && Math.abs(element.getBoundingClientRect().width - preparedWidth) > 1) {
            split.revert()
            split = undefined
          }
          split ??= splitText(element, { type: ['lines'], mask: { lines: '.15em' } })
          const style = getComputedStyle(element)
          const mobile = usesSimpleMotion()
          const duration = mobile
            ? animations.mobile.revealDuration
            : Number.parseFloat(style.getPropertyValue('--reveal-duration')) ||
              animations.reveal.duration
          const configuredStagger = Number.parseFloat(style.getPropertyValue('--reveal-stagger'))
          const stagger = mobile
            ? configuredStagger === 0
              ? 0
              : animations.mobile.revealStagger
            : Number.isFinite(configuredStagger)
              ? configuredStagger
              : animations.reveal.stagger
          const easing = motionEase()
          const configuredDelay = Number.parseFloat(style.getPropertyValue('--reveal-delay'))
          const delay = mobile
            ? 0
            : Number.isFinite(configuredDelay)
              ? configuredDelay
              : animations.reveal.delay
          const lineHeights = split.lines.map((line) => line.getBoundingClientRect().height)
          const width = element.getBoundingClientRect().width
          const lines = split.lines
          context.add(() => {
            gsap.fromTo(
              lines,
              {
                y: (index: number) => lineHeights[index] * 0.9,
                rotation: mobile ? 0 : 1,
                opacity: 0,
              },
              {
                y: 0,
                rotation: 0,
                opacity: 1,
                duration: duration / 1000,
                delay: delay / 1000,
                stagger: stagger / 1000,
                ease: easing,
                clearProps: 'transform,opacity',
                // Avoid reflowing the text again during touch scrolling. Width changes
                // and component cleanup still restore the original DOM.
                onComplete: mobile ? undefined : () => restore(),
              },
            )
          })

          preparation?.hold(context)
          element.setAttribute('data-motion-ready', '')

          // A split is a layout snapshot. If wrapping changes mid-reveal, show natural text.
          resize = new ResizeObserver(([entry]) => {
            const currentWidth = entry?.borderBoxSize[0]?.inlineSize
            if (currentWidth !== undefined && Math.abs(currentWidth - width) > 1) restore()
          })
          resize.observe(element, { box: 'border-box' })
        } catch {
          restore()
        } finally {
          prepared?.()
        }
      }
      observer = new IntersectionObserver(reveal, { threshold })
      // Use the same observed surface and threshold as its entrance animation.
      if (preparation) {
        if (element.getClientRects().length) reveal([])
        else prepared?.()
      } else {
        element.setAttribute('data-motion-pending', '')
        // Prepare line DOM ahead of the viewport; playback still uses the original threshold.
        if (!(usesSimpleMotion() && element.closest('[data-mobile-text="block"]'))) {
          prewarm = new IntersectionObserver(
            (entries) => {
              if (disposed || motion.matches || !entries.some((entry) => entry.isIntersecting))
                return
              prewarm?.disconnect()
              if (!split && !element.hasAttribute('data-motion-ready')) {
                try {
                  split = splitText(element, { type: ['lines'], mask: { lines: '.15em' } })
                  preparedWidth = element.getBoundingClientRect().width
                } catch {
                  restore()
                }
              }
            },
            { rootMargin: '300px 0px', threshold: 0 },
          )
          prewarm.observe(owner ?? element)
        }
        observer.observe(owner ?? element)
      }
    }

    const onFocus = () => stop()
    element.addEventListener('focusin', onFocus)
    motion.addEventListener('change', onMotionChange)
    void prepare()
    return () => {
      disposed = true
      prepared?.()
      stop(false)
      element.removeEventListener('focusin', onFocus)
      motion.removeEventListener('change', onMotionChange)
    }
  }, [children, preparation])

  return createElement(
    as,
    {
      ...props,
      className: `**:data-line:origin-bottom-left ${props.className ?? ''}`,
      ref,
      'data-text-reveal': '',
      ...(as === 'span' ? { style: { display: 'inline-block', ...props.style } } : {}),
    },
    children,
  )
}
