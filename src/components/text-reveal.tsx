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
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let disposed = false
    let split: TextSplit | undefined
    const context = gsap.context(() => {}, element)
    let observer: IntersectionObserver | undefined
    let resize: ResizeObserver | undefined

    const restore = (reveal = true) => {
      context.revert()
      split?.revert()
      split = undefined
      resize?.disconnect()
      if (reveal) element.setAttribute('data-motion-ready', '')
    }
    const stop = (reveal = true) => {
      observer?.disconnect()
      restore(reveal)
    }
    const onMotionChange = () => {
      if (motion.matches) stop()
    }

    const prepare = async () => {
      await document.fonts.ready
      if (disposed || motion.matches || !document.documentElement.dataset.motion) return
      const owner = element.closest('[data-reveal-owner], a[data-entrance], button')
      const configuredThreshold = Number.parseFloat(getComputedStyle(element).getPropertyValue('--reveal-threshold'))
      const threshold = owner ? .08 : Number.isFinite(configuredThreshold) ? configuredThreshold : 0.12
      observer = new IntersectionObserver(entries => {
        if (disposed || motion.matches || !entries.some(entry => entry.isIntersecting)) return
        observer?.disconnect()
        if (!document.documentElement.dataset.motion || element.hasAttribute('data-motion-ready')) return
        try {
          split = splitText(element, { type: ['lines'], mask: { lines: '.15em' } })
          const style = getComputedStyle(element)
          const mobile = usesSimpleMotion()
          const duration = mobile ? animations.mobile.revealDuration : Number.parseFloat(style.getPropertyValue('--reveal-duration')) || animations.reveal.duration
          const configuredStagger = Number.parseFloat(style.getPropertyValue('--reveal-stagger'))
          const stagger = mobile ? (configuredStagger === 0 ? 0 : animations.mobile.revealStagger) : Number.isFinite(configuredStagger) ? configuredStagger : animations.reveal.stagger
          const easing = motionEase()
          const configuredDelay = Number.parseFloat(style.getPropertyValue('--reveal-delay'))
          const delay = mobile ? 0 : Number.isFinite(configuredDelay) ? configuredDelay : animations.reveal.delay
          const lineHeights = split.lines.map(line => line.getBoundingClientRect().height)
          const width = element.getBoundingClientRect().width
          const lines = split.lines
          context.add(() => {
            gsap.fromTo(lines, {
              y: (index: number) => lineHeights[index] * 0.9,
              rotation: mobile ? 0 : 1,
              opacity: 0,
            }, {
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
            })
          })

          element.setAttribute('data-motion-ready', '')

          // A split is a layout snapshot. If wrapping changes mid-reveal, show natural text.
          resize = new ResizeObserver(([entry]) => {
            const currentWidth = entry?.borderBoxSize[0]?.inlineSize
            if (currentWidth !== undefined && Math.abs(currentWidth - width) > 1) restore()
          })
          resize.observe(element, { box: 'border-box' })
        } catch {
          restore()
        }
      }, { threshold })
      // Use the same observed surface and threshold as its entrance animation.
      observer.observe(owner ?? element)
    }

    const onFocus = () => stop()
    element.addEventListener('focusin', onFocus)
    motion.addEventListener('change', onMotionChange)
    void prepare()
    return () => {
      disposed = true
      stop(false)
      element.removeEventListener('focusin', onFocus)
      motion.removeEventListener('change', onMotionChange)
    }
  }, [children])

  return createElement(as, { ...props, className: `**:data-line:origin-bottom-left ${props.className ?? ''}`, ref, 'data-text-reveal': '', ...(as === 'span' ? { style: { display: 'inline-block', ...props.style } } : {}) }, children)
}
