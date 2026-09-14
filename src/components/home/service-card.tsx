import { cn } from '../../lib/cn'
import { contactLinks } from '../../lib/config'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import { gsap } from 'gsap'

gsap.registerPlugin(useGSAP)
import { animations } from '../../lib/animations'
import { TextReveal } from '../text-reveal'
import { BackgroundPhoto } from '../shared/background-photo'
import { ButtonLink } from '../shared/button-link'

type EntranceBinding = { ref: (node: Element | null) => void; 'data-entrance': string }
type Props = {
  kind: 'emergency' | 'planning'
  cardEntrance: EntranceBinding
  controlEntrance: EntranceBinding
}

// Exact vector paths exported from the two Figma hover variants.
const outline = 'M308.28 0.5L489.5 76.832V152.5H181.72L0.5 76.167V0.5H308.28Z'
const filled = 'M490 153V76.5L308.381 0H0V76.5L181.619 153H490Z'

export function ServiceCard({ kind, cardEntrance, controlEntrance }: Props) {
  const card = useRef<HTMLElement>(null)
  const background = useRef<HTMLDivElement>(null)
  const heading = useRef<HTMLDivElement>(null)
  const description = useRef<HTMLParagraphElement>(null)
  const badge = useRef<HTMLSpanElement>(null)
  const ribbons = useRef<Array<SVGSVGElement | null>>([])
  const paths = useRef<Array<SVGPathElement | null>>([])
  const emergency = kind === 'emergency'

  useGSAP(
    () => {
      const element = card.current
      if (!element) return
      const media = gsap.matchMedia()
      media.add(
        {
          desktop: '(min-width: 768px) and (hover: hover) and (pointer: fine)',
          reduced: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          if (!context.conditions?.desktop) return
          const reduced = context.conditions.reduced
          const { duration, stagger, ease } = animations.serviceHover
          const vectors = ribbons.current.filter((node) => node !== null)
          const lengths = paths.current.map((path) => path?.getTotalLength() ?? 0)
          const timeline = gsap
            .timeline({ paused: true, defaults: { duration: duration / 1000, ease } })
            // Animate flex continuously: FLIP on both sibling cards caused competing
            // transforms and stretched content when switching hover mid-transition.
            .to(element, { flexGrow: 795 / 577 }, 0)
            .fromTo(background.current, { scaleX: 0 }, { scaleX: 1 }, 0)
            .to(heading.current, { y: -63 }, 0)
            .fromTo(description.current, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0 }, 0.12)
            .fromTo(badge.current, { autoAlpha: 0, y: -12 }, { autoAlpha: 1, y: 0 }, 0.08)
            .fromTo(
              vectors,
              { autoAlpha: 0, x: 45 },
              { autoAlpha: 1, x: 0, stagger: stagger / 1000 },
              0.08,
            )
          if (emergency) {
            paths.current.forEach((path, index) => {
              timeline.fromTo(
                path,
                { strokeDasharray: lengths[index], strokeDashoffset: lengths[index] },
                {
                  strokeDashoffset: 0,
                  duration: lengths[index] / animations.lines.speed,
                  ease: 'none',
                },
                0.08 + (index * stagger) / 1000,
              )
            })
          } else {
            timeline.fromTo(
              vectors,
              { scaleY: 0, transformOrigin: 'center top' },
              { scaleY: 1, stagger: stagger / 1000 },
              0.08,
            )
          }
          let hovered = false
          const update = () => {
            const active = hovered || element.contains(document.activeElement)
            if (reduced) timeline.progress(active ? 1 : 0).pause()
            else if (active) timeline.play()
            else timeline.reverse()
          }
          const enter = () => {
            hovered = true
            update()
          }
          const leave = () => {
            hovered = false
            update()
          }
          const blur = (event: FocusEvent) => {
            if (!element.contains(event.relatedTarget as Node | null)) {
              if (reduced) timeline.progress(hovered ? 1 : 0).pause()
              else if (!hovered) timeline.reverse()
            }
          }
          element.addEventListener('pointerenter', enter)
          element.addEventListener('pointerleave', leave)
          element.addEventListener('focusin', update)
          element.addEventListener('focusout', blur)
          return () => {
            element.removeEventListener('pointerenter', enter)
            element.removeEventListener('pointerleave', leave)
            element.removeEventListener('focusin', update)
            element.removeEventListener('focusout', blur)
          }
        },
        element,
      )
      return () => media.revert()
    },
    { scope: card, dependencies: [emergency], revertOnUpdate: true },
  )

  return (
    <article
      {...cardEntrance}
      ref={(node) => {
        card.current = node
        cardEntrance.ref(node)
      }}
      data-reveal-owner
      className="relative isolate flex min-h-130 min-w-0 flex-1 flex-col items-start justify-end gap-7 overflow-clip px-8.5 pt-8 pb-7 max-md:min-h-77.5 max-md:justify-between max-md:p-5 [--reveal-delay:0] [--reveal-stagger:0] [--reveal-threshold:.01]"
    >
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <BackgroundPhoto
          src={`/services/${kind}.webp`}
          mobileSrc={`/services/${kind}-mobile.webp`}
          sizes="(max-width: 767px) calc(100vw - 40px), 58vw"
        />
        <div
          className={cn("absolute inset-0 max-md:bg-black/30", emergency ? '' : 'md:bg-black/30')}
        />
        <div
          ref={background}
          className={cn(
            "absolute inset-0 origin-left scale-x-0",
            emergency ? 'bg-brand' : 'bg-ink',
          )}
        />
        <div className="absolute -right-27.75 bottom-0 flex flex-col max-md:hidden">
          {[0, 1].map((index) => (
            <svg
              key={index}
              ref={(node) => {
                ribbons.current[index] = node
              }}
              width="490"
              height="153"
              viewBox="0 0 490 153"
              fill="none"
              className="invisible h-38.25 w-122.5 shrink-0"
            >
              <path
                ref={(node) => {
                  paths.current[index] = node
                }}
                d={emergency ? outline : filled}
                stroke={emergency ? 'white' : undefined}
                fill={emergency ? 'none' : '#3B6DFE'}
              />
            </svg>
          ))}
        </div>
      </div>
      <span
        ref={badge}
        aria-hidden="true"
        className={cn(
          "invisible absolute top-0 px-4 py-2.5 font-display text-base max-md:hidden",
          emergency ? 'left-0 bg-ink text-brand' : 'right-0 bg-brand text-ink',
        )}
      >
        {emergency ? '01' : '02'}
      </span>
      <div ref={heading} className="relative">
        <TextReveal
          as="h3"
          className={cn(
            "font-display text-service text-white max-md:max-w-58.25 max-md:text-service-mobile",
            emergency ? 'max-w-74' : 'max-w-107.5',
          )}
        >
          {emergency ? 'Emergency Work' : 'Infrastructure Planning'}
        </TextReveal>
      </div>
      <p
        ref={description}
        className={cn(
          "invisible absolute bottom-21 left-9.25 text-lg leading-normal tracking-[-.36px] text-white max-md:hidden",
          emergency ? 'max-w-58.25' : 'max-w-86.5',
        )}
      >
        {emergency
          ? 'Rapid, precise infrastructure repair and restoration.'
          : 'Long-term infrastructure planning for stronger, more resilient communities.'}
      </p>
      <ButtonLink
        {...controlEntrance}
        href={`${contactLinks.email}?subject=${encodeURIComponent(emergency ? 'Emergency work' : 'Infrastructure planning')}`}
        arrow
      >
        Learn More
      </ButtonLink>
    </article>
  )
}
