import { cn } from '../../lib/cn'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import { gsap } from 'gsap'
import { animations } from '../../lib/animations'
import { responsiveImage } from '../../lib/images'

gsap.registerPlugin(useGSAP)

const photos = [
  { name: 'field', width: 221, className: 'w-55.25' },
  { name: 'crew', width: 243, className: 'w-60.75' },
  { name: 'kristen', width: 397, className: 'w-99.25' },
  { name: 'road', width: 327, className: 'w-81.75' },
  { name: 'site', width: 323, className: 'w-80.75' },
]

export function AboutGallery() {
  const ref = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  useGSAP(
    (_context, contextSafe) => {
      const viewport = ref.current
      const track = trackRef.current
      if (!viewport || !track) return
      const reduced = matchMedia('(prefers-reduced-motion: reduce)')
      let cycle = 0
      let stops: number[] = []
      const position = { value: 0 }
      let visible = false
      let tween: gsap.core.Tween | undefined
      let drag: { x: number; id: number; samples: Array<{ x: number; time: number }> } | undefined
      const setX = gsap.quickSetter(track, 'x', 'px')
      const render = () => {
        if (cycle) setX(-cycle - (((position.value % cycle) + cycle) % cycle))
      }
      const clear = () => {
        gsap.ticker.remove(tick)
        tween?.kill()
        tween = undefined
      }
      const snap = (value: number, direction = 0) => {
        if (!cycle) return value
        const lap = Math.floor(value / cycle)
        const candidates = [-1, 0, 1].flatMap((offset) =>
          stops.map((stop) => (lap + offset) * cycle + stop),
        )
        if (direction > 0) return candidates.find((stop) => stop > value + 1) ?? value
        if (direction < 0) return candidates.filter((stop) => stop < value - 1).at(-1) ?? value
        return candidates.reduce((best, stop) =>
          Math.abs(stop - value) < Math.abs(best - value) ? stop : best,
        )
      }
      const tick = (_time: number, delta: number) => {
        if (drag || tween || !visible || document.hidden || reduced.matches || !cycle) return
        position.value =
          (position.value + (animations.aboutGallery.speed * Math.min(delta, 50)) / 1000) % cycle
        render()
      }
      const schedule = () => {
        gsap.ticker.remove(tick)
        if (!visible || document.hidden || reduced.matches || drag || !cycle) return
        gsap.ticker.add(tick)
      }
      const animate = contextSafe!((destination: number, duration?: number) => {
        clear()
        tween = gsap.to(position, {
          value: destination,
          duration: reduced.matches ? 0 : (duration ?? animations.testimonials.duration / 1000),
          ease: duration === undefined ? animations.testimonials.ease : 'power3.out',
          onUpdate: render,
          onComplete: () => {
            tween = undefined
            position.value = ((position.value % cycle) + cycle) % cycle
            render()
            schedule()
          },
        })
      })
      const measure = () => {
        clear()
        const group = track.children[0] as HTMLElement
        cycle = (track.children[1] as HTMLElement).offsetLeft - group.offsetLeft
        stops = Array.from(
          group.children,
          (child) => (child as HTMLElement).offsetLeft - group.offsetLeft,
        )
        position.value = snap(position.value)
        render()
        schedule()
      }
      const down = (event: PointerEvent) => {
        if (event.button !== 0) return
        clear()
        drag = {
          x: event.clientX,
          id: event.pointerId,
          samples: [{ x: event.clientX, time: performance.now() }],
        }
        viewport.setPointerCapture(event.pointerId)
      }
      const move = (event: PointerEvent) => {
        if (!drag || drag.id !== event.pointerId) return
        const now = performance.now()
        position.value += drag.x - event.clientX
        drag.x = event.clientX
        drag.samples.push({ x: event.clientX, time: now })
        drag.samples = drag.samples.filter((sample) => now - sample.time <= 100)
        render()
      }
      const up = (event: PointerEvent) => {
        if (!drag || drag.id !== event.pointerId) return
        const first = drag.samples[0]
        const last = drag.samples.at(-1)!
        const velocity =
          event.type === 'pointercancel' || performance.now() - last.time > 100
            ? 0
            : (first.x - last.x) / Math.max(1, last.time - first.time)
        const id = drag.id
        drag = undefined
        if (viewport.hasPointerCapture(id)) viewport.releasePointerCapture(id)
        const speed = Math.min(Math.abs(velocity), 3)
        const travel = (Math.sign(velocity) * speed * speed) / (2 * 0.006)
        const destination = snap(position.value + travel)
        const duration = Math.max(
          0.28,
          Math.min(1.1, (Math.abs(destination - position.value) / Math.max(speed * 1000, 650)) * 3),
        )
        animate(destination, duration)
      }
      const key = (event: KeyboardEvent) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
        event.preventDefault()
        if (!tween?.isActive()) animate(snap(position.value, event.key === 'ArrowRight' ? 1 : -1))
      }
      const visibility = () => {
        clear()
        schedule()
      }
      const resize = new ResizeObserver(measure)
      resize.observe(track.children[0])
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
        visibility()
      })
      observer.observe(viewport)
      measure()
      viewport.addEventListener('pointerdown', down)
      viewport.addEventListener('pointermove', move)
      viewport.addEventListener('pointerup', up)
      viewport.addEventListener('pointercancel', up)
      viewport.addEventListener('keydown', key)
      document.addEventListener('visibilitychange', visibility)
      reduced.addEventListener('change', visibility)
      return () => {
        clear()
        resize.disconnect()
        observer.disconnect()
        if (drag && viewport.hasPointerCapture(drag.id)) viewport.releasePointerCapture(drag.id)
        viewport.removeEventListener('pointerdown', down)
        viewport.removeEventListener('pointermove', move)
        viewport.removeEventListener('pointerup', up)
        viewport.removeEventListener('pointercancel', up)
        viewport.removeEventListener('keydown', key)
        document.removeEventListener('visibilitychange', visibility)
        reduced.removeEventListener('change', visibility)
      }
    },
    { scope: ref },
  )
  return (
    <div
      ref={ref}
      role="region"
      aria-label="FLO team photo carousel"
      tabIndex={0}
      className="mt-24.25 overflow-hidden px-4.25 select-none touch-pan-y cursor-grab active:cursor-grabbing"
    >
      <div ref={trackRef} className="flex w-max gap-3">
        {[0, 1, 2].map((copy) => (
          <div key={copy} aria-hidden={copy !== 1} className="flex gap-3">
            {photos.map(({ name, width, className }) => (
              <div
                key={name}
                className={cn(
                  className,
                  "h-74.75 shrink-0 overflow-hidden rounded-md max-md:max-w-[80vw]",
                )}
              >
                <img
                  {...responsiveImage(`/about-page/hero-${name}.webp`, `${width}px`)}
                  alt="FLO people and infrastructure projects"
                  width={width}
                  height="299"
                  draggable={false}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
