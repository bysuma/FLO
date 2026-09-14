import { flushSync } from 'react-dom'
import { gsap } from 'gsap'
import { animations } from '../../lib/animations'
import { responsiveImage } from '../../lib/images'
import { useEntrance } from './use-entrance'
import type { EntranceGroup } from './use-entrance'
import { memo, useEffect, useRef, useState } from 'react'
import type { Ref } from 'react'
import { Rollover } from './rollover'
import { Decoration } from './decoration'
import { TextReveal } from '../text-reveal'
import { Eyebrow } from './eyebrow'

const entrances = [{ name: 'cards', distance: 0, wipe: 'bottom-to-top' }] satisfies readonly EntranceGroup[]

const PartnerCard = memo(function PartnerCard({ entrance }: { entrance?: { ref: Ref<HTMLElement>; 'data-entrance': string } }) {
  const Text = TextReveal
  return <figure {...entrance} data-reveal-owner className={`testimonial-card relative after:pointer-events-none after:absolute after:inset-y-0 after:right-18.5 after:w-px after:bg-ink/60 snap-start w-100.25 min-h-99.25 [&_blockquote]:max-w-94 [&_blockquote]:min-h-70 max-md:min-h-[346.509px] max-md:[&_blockquote]:min-h-0 max-md:[&_blockquote]:h-[244.39px] max-md:rounded-[8.728px] [&_blockquote]:[--reveal-stagger:110] [--reveal-delay:80] [&_figcaption]:[--reveal-delay:180] max-md:w-auto max-md:self-stretch flex shrink-0 flex-col overflow-hidden rounded-card bg-brand`}>
        <Text as="blockquote" className="flex-1 px-6 pt-9 font-display text-quote max-md:text-quote-mobile max-md:flex-none max-md:px-[20.07px] max-md:pt-[31.42px] max-md:tracking-[-.559px]">“They showed up before dawn and didn't leave until the slope was secure.”</Text>
        <figcaption className="flex items-center gap-4 max-md:gap-[13.088px] max-md:px-[33.17px] max-md:py-[26.18px] max-md:[&_img]:w-[59.352px] max-md:[&_img]:h-[47.132px] border-t border-ink/30 px-9 py-7"><img {...responsiveImage('/testimonials/avatar.webp', '(max-width: 767px) 59.352px, 68px')} alt="" width="68" height="54" loading="lazy" decoding="async" /><div><Text as="p" className="font-semibold uppercase max-md:text-[13.965px]">Marcus Chen</Text><Text as="p" className="mt-2 max-w-40 text-caption max-md:mt-[5px] max-md:max-w-[132.668px] max-md:text-[10.474px]">Facilities Director, Monterey Park</Text></div></figcaption>
      </figure>
})

export function Testimonials() {
  const motionRef = useRef<HTMLElement>(null)
  const entrance = useEntrance(motionRef, entrances)
  const trackRef = useRef<HTMLDivElement>(null)
  const [order, setOrder] = useState([0, 1, 2, 3, 4, 5])
  const navigateRef = useRef<(direction: number) => void>(() => {})
  const step = (direction: number) => navigateRef.current(direction)
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const desktop = matchMedia('(min-width: 1024px) and (pointer: fine)')
    let timer: ReturnType<typeof setTimeout> | undefined
    let tween: gsap.core.Tween | undefined
    let visible = false
    let drag: { id: number; x: number; scroll: number; lastX: number; time: number; velocity: number; samples: Array<{ x: number; time: number }> } | null = null
    const max = () => Math.max(0, track.scrollWidth - track.clientWidth)
    const stride = () => {
      const first = track.children[0] as HTMLElement | undefined
      const second = track.children[1] as HTMLElement | undefined
      return first && second ? second.getBoundingClientRect().left - first.getBoundingClientRect().left : 0
    }
    let position = track.scrollLeft
    let rotating = false
    const normalize = () => {
      if (rotating || max() <= 1 || !matchMedia('(min-width: 768px)').matches) return
      const width = stride()
      if (!width) return
      const steps = Math.floor(position / width) - 1
      if (!steps) return
      rotating = true
      flushSync(() => setOrder(items => {
        const shift = ((steps % items.length) + items.length) % items.length
        return [...items.slice(shift), ...items.slice(0, shift)]
      }))
      position -= steps * width
      track.scrollLeft = position
      rotating = false
    }
    const clear = () => { clearTimeout(timer); tween?.kill(); tween = undefined }
    const schedule = () => {
      clearTimeout(timer)
      if (!visible || document.hidden || drag || reduced.matches || !desktop.matches || max() <= 1) return
      timer = setTimeout(() => animate(track.scrollLeft + stride()), animations.testimonials.hold)
    }
    const animate = (destination: number, momentumDuration?: number) => {
      clear()
      position = track.scrollLeft
      const progress = { distance: 0 }
      let previous = 0
      tween = gsap.to(progress, {
        distance: destination - track.scrollLeft,
        onUpdate: () => {
          position += progress.distance - previous
          track.scrollLeft = position
          previous = progress.distance
          normalize()
        },
        duration: reduced.matches ? 0 : momentumDuration ?? animations.testimonials.duration / 1000,
        ease: momentumDuration !== undefined ? 'power3.out' : animations.testimonials.ease,
        onComplete: () => { tween = undefined; schedule() },
      })
    }
    navigateRef.current = direction => {
      // Ignore repeated arrow clicks until the current movement finishes.
      if (tween?.isActive() || drag) return
      const width = stride()
      if (width) animate((Math.round(track.scrollLeft / width) + direction) * width)
    }
    const update = () => {
      if (!tween && !drag) position = track.scrollLeft
      normalize()
      if (!tween && !drag) schedule()
    }
    const interrupt = () => { clear(); schedule() }
    const down = (event: PointerEvent) => {
      clear()
      if (event.pointerType !== 'mouse' || event.button !== 0 || max() <= 1) { schedule(); return }
      position = track.scrollLeft
      drag = { id: event.pointerId, x: event.clientX, scroll: track.scrollLeft, lastX: event.clientX, time: performance.now(), velocity: 0, samples: [{ x: event.clientX, time: performance.now() }] }
      track.setPointerCapture(event.pointerId)
      track.style.cursor = 'grabbing'
      event.preventDefault()
    }
    const move = (event: PointerEvent) => {
      if (!drag) return
      const now = performance.now()
      drag.samples.push({ x: event.clientX, time: now })
      drag.samples = drag.samples.filter(sample => now - sample.time <= 100)
      const first = drag.samples[0]
      drag.velocity = (first.x - event.clientX) / Math.max(1, now - first.time)
      position += drag.lastX - event.clientX
      track.scrollLeft = position
      normalize()
      drag.lastX = event.clientX
      drag.time = now
    }
    const up = (event: PointerEvent) => {
      if (!drag) { schedule(); return }
      const velocity = event.type === 'pointercancel' || performance.now() - drag.time > 100 ? 0 : drag.velocity
      const id = drag.id
      drag = null
      if (track.hasPointerCapture(id)) track.releasePointerCapture(id)
      track.style.removeProperty('cursor')
      const width = stride()
      if (!width) { schedule(); return }
      // Project the gesture, then decelerate directly to a card boundary.
      // Keep floating-point position separate from browser scroll rounding.
      const speed = Math.min(Math.abs(velocity), 3)
      const travel = Math.sign(velocity) * speed * speed / (2 * .006)
      const destination = Math.round((position + travel) / width) * width
      const remaining = Math.abs(destination - position)
      const duration = Math.max(.28, Math.min(1.1, remaining / Math.max(speed * 1000, 650) * 3))
      animate(destination, duration)
    }
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (!visible) clear(); else schedule() })
    visibility.observe(track)
    const resize = new ResizeObserver(() => { update(); schedule() })
    resize.observe(track)
    const onVisibility = () => { if (document.hidden) clear(); else schedule() }
    const onMedia = () => { clear(); schedule() }
    track.addEventListener('scroll', update, { passive: true })
    track.addEventListener('wheel', interrupt, { passive: true })
    track.addEventListener('keydown', interrupt)
    track.addEventListener('pointerdown', down)
    track.addEventListener('pointermove', move)
    track.addEventListener('pointerup', up)
    track.addEventListener('pointercancel', up)
    document.addEventListener('visibilitychange', onVisibility)
    reduced.addEventListener('change', onMedia)
    desktop.addEventListener('change', onMedia)
    const initialFrame = requestAnimationFrame(() => { normalize(); schedule() })
    return () => {
      cancelAnimationFrame(initialFrame)
      clear()
      navigateRef.current = () => {}
      resize.disconnect()
      visibility.disconnect()
      if (drag && track.hasPointerCapture(drag.id)) track.releasePointerCapture(drag.id)
      track.style.removeProperty('cursor')
      track.removeEventListener('scroll', update)
      track.removeEventListener('wheel', interrupt)
      track.removeEventListener('keydown', interrupt)
      track.removeEventListener('pointerdown', down)
      track.removeEventListener('pointermove', move)
      track.removeEventListener('pointerup', up)
      track.removeEventListener('pointercancel', up)
      document.removeEventListener('visibilitychange', onVisibility)
      reduced.removeEventListener('change', onMedia)
      desktop.removeEventListener('change', onMedia)
    }
  }, [])
  return <section ref={motionRef} aria-labelledby="testimonials-heading" className="testimonials-section relative isolate min-h-168.5 pt-41.25 pr-0 pb-28 pl-inset bg-ink overflow-clip max-md:min-h-0 max-md:pt-16 max-md:pb-[26px] max-md:px-5 max-md:gap-[27px] flex flex-col gap-12 lg:flex-row">
    <Decoration section="testimonials" />
    <div className="testimonial-heading basis-108 max-[1100px]:basis-80 max-lg:basis-auto max-md:w-[270px] max-md:gap-[29px] flex shrink-0 flex-col items-start gap-7"><Eyebrow light>Testimonials</Eyebrow><TextReveal as="h2" id="testimonials-heading" className="max-w-72 font-display text-section max-md:text-[42px] max-md:leading-[1.071] max-md:tracking-[-.84px] text-white">Trusted by Our Partners</TextReveal>

    </div>
    <div className="mr-page flex min-w-0 max-w-[812px] flex-1 flex-col gap-6 max-md:mr-0 max-md:max-w-none">
    <div ref={trackRef} className="testimonial-track flex flex-1 min-w-0 gap-2.5 overflow-x-auto pb-2 cursor-grab select-none [scrollbar-width:none] [overflow-anchor:none] max-md:flex-col max-md:gap-6 max-md:pr-0 max-md:cursor-auto" tabIndex={0} role="region" aria-label="Partner testimonials">
      {/* Temporary duplicates for testing drag and arrow navigation. */}
      {order.map(index => <PartnerCard entrance={entrance('cards', String(index))} key={index} />)}
    </div>
      <div className="flex justify-end gap-2 max-md:hidden">
        {[-1, 1].map(direction => <button key={direction} type="button" aria-label={direction < 0 ? 'Previous testimonial' : 'Next testimonial'} onClick={() => step(direction)} className="flex size-8.5 items-center justify-center rounded-button bg-white disabled:opacity-40 disabled:cursor-default">
          <Rollover icon><img src="/projects/arrow.svg" alt="" width="34" height="34" className={direction < 0 ? 'rotate-180' : ''} /></Rollover>
        </button>)}
      </div>
    </div>
  </section>
}
