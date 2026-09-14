import { cn } from '../../lib/cn'
import { gsap } from 'gsap'
import { animations } from '../../lib/animations'
import { useRef } from 'react'
import { useEntrance } from '../../lib/use-entrance'
import type { EntranceGroup } from '../../lib/use-entrance'
// Local Figma vectors, kept inline so GSAP can animate the actual strokes.
const vectors = {
  hero: '<svg xmlns="http://www.w3.org/2000/svg" width="1256" height="170" viewBox="0 0 1256 170" fill="none">\n  <path d="M506.619 117.636V235.04H27L-163 41.3124V0.24999L228.988 0.25L506.619 117.636ZM506.619 117.636V0.25H978.024L1255.66 117.636V235.04H784.249L506.619 117.636Z" stroke="#3B6DFE" stroke-width="0.5" stroke-miterlimit="10"/>\n</svg>\n',
  about:
    '<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="1856.71" height="774.949" viewBox="0 0 1856.71 774.949" fill="none" xmlns="http://www.w3.org/2000/svg">\n<path d="M619.015 581.038V484.249M619.015 581.038H229.665L0.360723 484.249V387.474H389.711L619.015 484.249M619.015 581.038L1008.38 581.038L1237.68 677.813M619.015 581.038V677.813M619.015 484.249V387.474M619.015 484.249L848.334 581.038H1237.68M619.015 677.813V774.588H229.665L0.360723 677.813V581.038H389.711L619.015 677.813ZM619.015 677.813L848.334 774.588H1237.68V677.813M1237.68 581.038V484.249M1237.68 581.038L1627.03 581.038L1856.34 677.813V774.588H1466.99L1237.68 677.813M1237.68 581.038V677.813M1237.68 484.249L1008.38 387.474H619.015M1237.68 484.249L1237.68 387.474M1237.68 484.249L1466.99 581.038H1856.34V484.249L1627.03 387.474H1237.68M619.015 387.474V290.699M619.015 387.474L229.665 387.474L0.360723 290.699V193.925H389.711L619.015 290.699M1237.68 387.474L1237.68 290.699M1237.68 387.474L848.334 387.474L619.015 290.699M619.015 193.925V97.1355M619.015 193.925H229.665L208.861 41.2681L252.361 0.360723L389.711 0.360723L619.015 97.1355M619.015 193.925L1008.38 193.925L1237.68 290.699M619.015 193.925V290.699M619.015 97.1355V0.360723H1008.38L1237.68 97.1355M619.015 97.1355L848.334 193.925H1237.68M1237.68 193.925V97.1355M1237.68 193.925L1627.03 193.925L1856.34 290.699V387.474H1466.99L1237.68 290.699M1237.68 193.925V290.699M1237.68 97.1355L1237.68 0.360723H1627.03L1853.03 109.5L1856.34 193.925H1466.99L1237.68 97.1355Z" stroke="#121C58" stroke-opacity="0.21" stroke-width="0.721446" stroke-miterlimit="10"/>\n</svg>\n',
  footer:
    '<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="1407.9" height="934.963" viewBox="0 0 1407.9 934.963" fill="none" xmlns="http://www.w3.org/2000/svg">\n<path d="M351.744 561.433V467.928M351.744 561.433H130.662L0.44824 467.928V374.438H221.544L351.744 467.928M351.744 561.433H573.412L703.948 654.476M351.744 561.433V654.476L482.295 747.52H703.948M351.744 467.928V374.438H573.412L703.948 467.928M351.744 467.928L482.295 561.433H703.948M703.948 561.433V467.928M703.948 561.433H925.607L1056.15 654.476M703.948 561.433V654.476M703.948 467.928V374.438H925.607L1056.15 467.928M703.948 467.928L834.494 561.433H1056.15M1056.15 187.443V93.9387M1056.15 187.443H834.494L703.948 93.9387V0.44824H925.607L1056.15 93.9387M1056.15 187.443L1277.23 187.443L1407.45 280.94V374.438H1186.35L1056.15 280.94M1056.15 187.443V280.94M1056.15 93.9387V0.44824H1277.23L1407.45 93.9387V187.443H1186.35L1056.15 93.9387ZM1056.15 374.438V280.94M1056.15 374.438H834.494L703.948 280.94V187.443H925.607L1056.15 280.94M1056.15 374.438H1277.23L1407.45 467.928V561.433H1186.35L1056.15 467.928M1056.15 374.438V467.928M1056.15 561.433V467.928M1056.15 561.433H1277.23L1407.45 654.476V747.52H1186.35L1056.15 654.476M1056.15 561.433V654.476M703.948 747.52V654.476M703.948 747.52H925.607L1056.15 841.024M703.948 747.52V841.024M703.948 654.476L834.494 747.52H1056.15M703.948 841.024V934.515H482.295L351.744 841.024V747.52H573.412L703.948 841.024ZM703.948 841.024L834.494 934.515H1056.15V841.024M1056.15 747.52V654.476M1056.15 747.52H1277.23L1407.45 841.024V934.515H1186.35L1056.15 841.024M1056.15 747.52V841.024" stroke="#121C58" stroke-opacity="0.2" stroke-width="0.89648" stroke-miterlimit="10"/>\n</svg>\n',
  testimonials:
    '<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="640" height="399" viewBox="0 0 640 399" fill="none" xmlns="http://www.w3.org/2000/svg">\n<g>\n<path d="M640 200V100L402.784 0H0V100L237.216 200H640Z" fill="#202B72"/>\n<path d="M640 399V299L402.784 199H0V299L237.216 399H640Z" fill="#202B72"/>\n</g>\n</svg>\n',
}

// Figma coordinates include the exported stroke bounds. About starts at page x=-3.
const positioning = {
  hero: 'max-md:hidden left-0 top-[588.035px] w-314 h-42.5 overflow-hidden',
  about: 'max-md:hidden left-[-229.361px] top-0 w-[1856.71px] h-[774.949px] ',
  footer:
    'max-md:-left-46.25 max-md:top-100 max-md:w-211 max-md:h-140 max-md:contain-paint left-[244.552px] top-[-84.448px] w-[1407.9px] h-[934.963px] ',
  testimonials: 'max-md:hidden -left-11.75 top-93.5 w-160 h-99.75 ',
}

export function animateDecoration(target: Element) {
  const paths = Array.from(target.querySelectorAll<SVGPathElement>('path'))
  const strokes = paths.filter((path) => path.hasAttribute('stroke'))
  const fills = paths.filter((path) => !path.hasAttribute('stroke'))
  const lengths = strokes.map((path) => path.getTotalLength())
  const speed = animations.lines.speed
  // Account for the SVG's displayed scale, not just its viewBox units.
  // Measurements happen once on entry, never inside the animation loop.
  const durations = strokes.map((path, index) => {
    const matrix = path.getScreenCTM()
    const scale = matrix ? (Math.hypot(matrix.a, matrix.b) + Math.hypot(matrix.c, matrix.d)) / 2 : 1
    return (lengths[index] * scale) / speed
  })
  const origins = fills.map((path) => {
    const box = path.getBBox()
    return `${box.x} ${box.y + box.height / 2}`
  })
  const timeline = gsap.timeline()
  // Outlines draw in place. No fade or movement obscures the tracing.
  if (strokes.length)
    timeline.fromTo(
      strokes,
      {
        strokeDasharray: (i: number) => lengths[i],
        strokeDashoffset: (i: number) => lengths[i],
      },
      {
        strokeDashoffset: 0,
        duration: (i: number) => durations[i],
        ease: 'none',
        stagger: 0,
        clearProps: 'strokeDasharray,strokeDashoffset',
      },
      0,
    )
  // Solid bands share the hero mask's geometric opening.
  if (fills.length)
    timeline.fromTo(
      fills,
      {
        scaleY: 0,
        svgOrigin: (i: number) => origins[i],
      },
      {
        scaleY: 1,
        duration: 1.45,
        stagger: 0.2,
        ease: 'power3.inOut',
        clearProps: 'transform',
      },
      0,
    )
  // Long outlines can outlast their section's visit. Suspend painting off-screen.
  const visibility = new IntersectionObserver((entries) => {
    if (timeline.progress() === 1 || (timeline.paused() && timeline.time() === 0)) return
    if (entries.some((entry) => entry.isIntersecting)) timeline.resume()
    else timeline.pause()
  })
  visibility.observe(target)
  timeline.eventCallback('onComplete', () => visibility.disconnect())
  return () => visibility.disconnect()
}
const entrances = [
  { name: 'decoration', distance: 0, animate: animateDecoration },
] satisfies readonly EntranceGroup[]

export function Decoration({ section }: { section: keyof typeof vectors }) {
  const motionRef = useRef<HTMLDivElement>(null)
  const entrance = useEntrance(motionRef, entrances)
  return (
    <div
      {...entrance('decoration')}
      ref={(node) => {
        motionRef.current = node
        entrance('decoration').ref(node)
      }}
      aria-hidden="true"
      className={cn(
        "absolute pointer-events-none -z-10 flex",
        positioning[section],
      )}
      dangerouslySetInnerHTML={{
        __html: vectors[section].replace('<svg ', '<svg class="h-full w-full min-w-0 flex-none" '),
      }}
    />
  )
}
