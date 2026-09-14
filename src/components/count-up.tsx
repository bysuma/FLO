import { animations } from '../lib/animations'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'

gsap.registerPlugin(useGSAP)

export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const displayRef = useRef<HTMLSpanElement>(null)
  useGSAP(
    (_context, contextSafe) => {
      const element = ref.current!
      const display = displayRef.current!
      const media = matchMedia('(prefers-reduced-motion: reduce)')
      const target = parseInt(value, 10)
      const suffix = value.replace(/^\d+/, '')
      let tween: gsap.core.Tween | undefined
      const start = contextSafe!(() => {
        const counter = { value: 0 }
        let previous = -1
        tween = gsap.to(counter, {
          value: target,
          duration: animations.counter.duration / 1000,
          ease: 'power2.out',
          onUpdate: () => {
            const rounded = Math.round(counter.value)
            if (rounded !== previous) display.textContent = `${rounded}${suffix}`
            previous = rounded
          },
        })
      })
      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return
          observer.disconnect()
          if (!media.matches) start()
        },
        { threshold: 0.4 },
      )
      const stop = () => {
        if (!media.matches) return
        observer.disconnect()
        tween?.kill()
        display.textContent = value
      }
      if (!media.matches) observer.observe(element)
      media.addEventListener('change', stop)
      return () => {
        observer.disconnect()
        media.removeEventListener('change', stop)
        display.textContent = value
      }
    },
    { scope: ref, dependencies: [value], revertOnUpdate: true },
  )
  return (
    <span ref={ref} aria-label={value}>
      <span ref={displayRef} aria-hidden="true">
        {value}
      </span>
    </span>
  )
}
