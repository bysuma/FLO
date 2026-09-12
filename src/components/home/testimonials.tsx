import { responsiveImage } from '../../lib/images'
import { useEntrance } from './use-entrance'
import type { EntranceGroup } from './use-entrance'
import { createElement, useEffect, useRef } from 'react'
import type { ComponentProps, Ref } from 'react'
import { gsap } from 'gsap'
import { animations } from '../../lib/animations'
import { Decoration } from './decoration'
import { TextReveal } from '../text-reveal'
import { Eyebrow } from './eyebrow'

const entrances = [{ name: 'cards', distance: 0, wipe: 'bottom-to-top' }] satisfies readonly EntranceGroup[]

function PlainText({ as = 'span', children, ...props }: ComponentProps<typeof TextReveal>) {
  return createElement(as, props, children)
}

function PartnerCard({ duplicate = false, entrance }: { duplicate?: boolean; entrance?: { ref: Ref<HTMLElement>; 'data-entrance': string } }) {
  const Text = duplicate ? PlainText : TextReveal
  return <figure {...entrance} data-reveal-owner className={`${duplicate ? '' : 'testimonial-card '}snap-start w-100.25 min-h-99.25 [&_blockquote]:max-w-94 [&_blockquote]:min-h-70 max-md:min-h-[346.509px] max-md:[&_blockquote]:min-h-0 max-md:[&_blockquote]:h-[244.39px] max-md:rounded-[8.728px] [&_blockquote]:[--reveal-stagger:110] [--reveal-delay:80] [&_figcaption]:[--reveal-delay:180] max-md:w-auto max-md:self-stretch flex shrink-0 flex-col overflow-hidden rounded-card bg-brand`}>
        <Text as="blockquote" className="flex-1 px-6 pt-9 font-display text-quote max-md:text-quote-mobile max-md:flex-none max-md:px-[20.07px] max-md:pt-[31.42px] max-md:tracking-[-.559px]">“They showed up before dawn and didn't leave until the slope was secure.”</Text>
        <figcaption className="flex items-center gap-4 max-md:gap-[13.088px] max-md:px-[33.17px] max-md:py-[26.18px] max-md:[&_img]:w-[59.352px] max-md:[&_img]:h-[47.132px] border-t border-ink/30 px-9 py-7"><img {...responsiveImage('/testimonials/avatar.webp', '(max-width: 767px) 59.352px, 68px')} alt="" width="68" height="54" loading="lazy" decoding="async" /><div><Text as="p" className="font-semibold uppercase max-md:text-[13.965px]">Marcus Chen</Text><Text as="p" className="mt-2 max-w-40 text-caption max-md:mt-[5px] max-md:max-w-[132.668px] max-md:text-[10.474px]">Facilities Director, Monterey Park</Text></div></figcaption>
      </figure>
}

export function Testimonials() {
  const motionRef = useRef<HTMLElement>(null)
  const entrance = useEntrance(motionRef, entrances)
  const trackRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Timeline | null>(null)
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let disposed = false
    const media = gsap.matchMedia()
    void document.fonts.ready.then(() => {
      if (disposed) return
      media.add('(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const group = track.firstElementChild as HTMLElement
        let width = 0
        const rebuild = () => {
          const nextWidth = group.getBoundingClientRect().width
          if (!nextWidth || nextWidth === width) return
          width = nextWidth
          const progress = tweenRef.current?.progress() ?? 0
          tweenRef.current?.kill()
          gsap.set(track, { x: 0 })
          const { hold, duration, ease } = animations.testimonials
          const timeline = gsap.timeline({ repeat: -1 })
          const cards = group.children.length
          for (let index = 1; index <= cards; index++) {
            timeline.to(track, {
              x: -(width / cards) * index,
              duration: duration / 1000,
              ease,
            }, `+=${hold / 1000}`)
          }
          tweenRef.current = timeline.progress(progress)
          sync()
        }
        let visible = true
        let hovering = false
        const sync = () => tweenRef.current?.paused(!visible || hovering)
        const enter = () => { hovering = true; sync() }
        const leave = () => { hovering = false; sync() }
        const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
        visibility.observe(track.parentElement!)
        const resize = new ResizeObserver(rebuild)
        resize.observe(group)
        track.parentElement!.addEventListener('pointerenter', enter)
        track.parentElement!.addEventListener('pointerleave', leave)
        rebuild()
        return () => {
          resize.disconnect()
          visibility.disconnect()
          track.parentElement?.removeEventListener('pointerenter', enter)
          track.parentElement?.removeEventListener('pointerleave', leave)
          tweenRef.current?.revert()
          tweenRef.current = null
        }
      }, track)
    })
    return () => { disposed = true; media.revert() }
  }, [])
  return <section ref={motionRef} aria-labelledby="testimonials-heading" className="testimonials-section relative isolate min-h-168.5 pt-41.25 pr-0 pb-28 pl-inset bg-ink overflow-clip max-md:min-h-0 max-md:pt-16 max-md:pb-[26px] max-md:px-5 max-md:gap-[27px] flex flex-col gap-12 lg:flex-row">
    <Decoration section="testimonials" />
    <div className="testimonial-heading basis-108 max-[1100px]:basis-80 max-lg:basis-auto max-md:w-[270px] max-md:gap-[29px] flex shrink-0 flex-col items-start gap-7"><Eyebrow light>Testimonials</Eyebrow><TextReveal as="h2" id="testimonials-heading" className="max-w-72 font-display text-section max-md:text-[42px] max-md:leading-[1.071] max-md:tracking-[-.84px] text-white">Trusted by Our Partners</TextReveal></div>
    <div className="testimonial-track snap-x snap-mandatory flex-1 max-lg:self-stretch min-w-0 pr-page pb-2 max-md:pr-0 max-md:pb-0 scrollbar-thin [scrollbar-color:var(--color-brand)_var(--color-ink)] overflow-hidden motion-reduce:overflow-x-auto max-lg:overflow-x-auto [@media(pointer:coarse)]:overflow-x-auto" tabIndex={0} role="region" aria-label="Partner testimonials">
      <div ref={trackRef} className="flex w-max max-md:w-auto max-md:flex-col">
        {[false, true, true].map((duplicate, groupIndex) => <div key={groupIndex} aria-hidden={duplicate || undefined} className="flex shrink-0 gap-2.5 pr-2.5 max-md:flex-col max-md:gap-6 max-md:pr-0 aria-hidden:motion-reduce:hidden aria-hidden:max-lg:hidden [@media(pointer:coarse)]:aria-hidden:hidden">
          {[0, 1].map(index => <PartnerCard entrance={duplicate ? undefined : entrance('cards', String(index))} key={index} duplicate={duplicate} />)}
        </div>)}
      </div>
    </div>
  </section>
}
