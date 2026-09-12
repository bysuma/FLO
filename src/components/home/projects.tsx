import { useEntrance } from './use-entrance'
import type { EntranceGroup } from './use-entrance'
import { ParallaxImage } from './parallax-image'
import { Rollover } from './rollover'
import { TextReveal } from '../text-reveal'
import { useRef, useState } from 'react'
import { Eyebrow } from './eyebrow'

const projects = [
  { title: 'I-10 Robertson Boulevard', description: 'Drainage & Roadway Restoration', image: 'robertson' },
  { title: 'SR-27 Topanga Canyon', description: 'Emergency Landslide Response', image: 'topanga-landslide' },
  { title: 'SR-27 Topanga Canyon', description: 'Emergency Slope Stabilization', image: 'topanga-slope' },
]

const entrances = [{ selector: '.project-image', distance: 0, wipe: 'up' }, { selector: 'button:has(.button), .button:not(button .button)', distance: 20 }] satisfies readonly EntranceGroup[]

export function Projects() {
  const motionRef = useRef<HTMLElement>(null)
  useEntrance(motionRef, entrances)
  const dialog = useRef<HTMLDialogElement>(null)
  const [selected, setSelected] = useState(projects[0])
  return <section ref={motionRef} id="projects" aria-labelledby="projects-heading" className="[&_article]:overflow-clip [&_article_h3]:[--reveal-delay:180] [&_article_p]:[--reveal-delay:310] [&_article_button]:[--reveal-delay:0] section-shell px-page py-10 pb-30">
    <div className="flex flex-col items-start gap-7"><Eyebrow>Recent projects</Eyebrow><TextReveal as="h2" id="projects-heading" className="max-w-sm font-display text-section max-md:text-section-mobile">Reliability when it matters most</TextReveal></div>
    <div className="mt-7 flex flex-col gap-3.5 md:flex-row">{projects.map(project => <article key={project.image} className="flex min-w-0 flex-1 flex-col bg-surface">
      <ParallaxImage src={`/projects/${project.image}.webp`} alt={project.description} />
      <div className="flex flex-1 flex-col items-start px-5 pb-6 pt-8"><TextReveal as="h3" className="max-w-56 text-project font-semibold uppercase">{project.title}</TextReveal><TextReveal as="p" className="mt-2 text-lg">{project.description}</TextReveal>
      <button type="button" className="mt-9 flex self-stretch items-center justify-between text-left" onClick={() => { setSelected(project); dialog.current?.showModal() }} aria-label={`View project: ${project.description}`}><span className="button inline-flex items-center justify-center gap-3 min-h-9 px-4 py-2 rounded-button font-display text-base leading-[1.2] has-[img]:p-[.2rem] has-[img]:pl-[.8rem] active:scale-[.98] [--reveal-delay:0] motion-reduce:transition-none bg-white"><Rollover>View Project</Rollover></span><Rollover icon><img src="/projects/arrow.svg" width="34" height="34" alt="" /></Rollover></button></div>
    </article>)}</div>
    <dialog ref={dialog} className="project-dialog m-auto max-w-[min(48rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] p-6 border-0 rounded-card text-ink backdrop:bg-[#121c58bb]" aria-labelledby="project-dialog-title" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close() }}>
      <div className="flex flex-col gap-5"><button className="button inline-flex items-center justify-center gap-3 min-h-9 px-4 py-2 rounded-button font-display text-base leading-[1.2] has-[img]:p-[.2rem] has-[img]:pl-[.8rem] active:scale-[.98] [--reveal-delay:0] motion-reduce:transition-none self-end bg-surface" onClick={() => dialog.current?.close()} autoFocus><Rollover>Close</Rollover></button><img src={`/projects/${selected.image}.webp`} alt={selected.description} width="447" height="392" className="max-h-96 self-center object-contain" /><TextReveal as="h3" id="project-dialog-title" className="font-display text-section max-md:text-section-mobile">{selected.title}</TextReveal><TextReveal as="p">{selected.description}</TextReveal><a className="button inline-flex items-center justify-center gap-3 min-h-9 px-4 py-2 rounded-button font-display text-base leading-[1.2] has-[img]:p-[.2rem] has-[img]:pl-[.8rem] active:scale-[.98] [--reveal-delay:0] motion-reduce:transition-none self-start bg-brand text-white" href={`mailto:info@floengineering.net?subject=${encodeURIComponent(selected.description)}`}><Rollover>Ask about this project</Rollover></a></div>
    </dialog>
  </section>
}
