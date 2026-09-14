import { animations } from '../lib/animations'
import { useEffect, useRef, useState } from 'react'

export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(value)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) return
    let frame = 0
    const target = parseInt(value, 10)
    const suffix = value.replace(/^\d+/, '')
    const duration = animations.counter.duration
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1)
          setDisplay(`${Math.round(target * (1 - Math.pow(1 - progress, 3)))}${suffix}`)
          if (progress < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    const stop = () => {
      if (!media.matches) return
      cancelAnimationFrame(frame)
      observer.disconnect()
      setDisplay(value)
    }
    observer.observe(element)
    media.addEventListener('change', stop)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      media.removeEventListener('change', stop)
    }
  }, [value])
  return (
    <span ref={ref} aria-label={value}>
      <span aria-hidden="true">{display}</span>
    </span>
  )
}
