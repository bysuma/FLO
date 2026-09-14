import { useState } from 'react'
import { TextReveal } from '../text-reveal'
import { responsiveImage } from '../../lib/images'
export function AboutRecognitions() {
  const [selected, setSelected] = useState(0)
  const labels = [
    'CALTRANS Mentor-Protégé Program',
    'Metabolic Studio',
    'Metabolic Studio',
    'Metabolic Studio',
    'Metabolic Studio',
  ]
  return (
    <section className="relative isolate flex min-h-213 flex-col gap-10 overflow-clip bg-ink px-inset py-28 text-white max-md:px-5 max-md:py-16">
      <img
        src="/about-page/recognition-lines.svg"
        alt=""
        className="pointer-events-none absolute inset-y-0 -left-80 -z-10 h-full w-[1800px] max-w-none"
      />
      <div className="flex items-center justify-between">
        <TextReveal as="h2" className="font-display text-[42px] leading-[1.24] tracking-[-.84px]">
          Recognitions
        </TextReveal>
        <div className="flex gap-2">
          {[-1, 1].map((direction) => (
            <button
              key={direction}
              type="button"
              aria-label={direction < 0 ? 'Previous recognition' : 'Next recognition'}
              onClick={() =>
                setSelected((value) => (value + direction + labels.length) % labels.length)
              }
            >
              <img
                src="/projects/arrow.svg"
                alt=""
                width="34"
                height="34"
                className={direction < 0 ? 'rotate-180' : ''}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-1 items-end justify-between gap-16 max-md:flex-col max-md:items-stretch">
        <div className="flex flex-col items-start gap-6">
          {labels.map((label, index) => (
            <button
              type="button"
              key={index}
              aria-pressed={index === selected}
              onClick={() => setSelected(index)}
              className={`max-w-100 text-left text-[32px] leading-normal tracking-[-.64px] ${index === selected ? 'text-white' : 'text-[#898989]'}`}
            >
              {index === selected && (
                <span aria-hidden="true" className="mr-4 inline-block size-1 bg-accent" />
              )}
              {label}
            </button>
          ))}
        </div>
        <div className="flex w-116 max-w-full flex-col gap-14">
          <img
            {...responsiveImage('/about-page/recognition.webp', '463px')}
            alt="FLO recognition event"
            width="463"
            height="416"
            className="h-104 w-full rounded-md object-cover object-bottom"
          />
          <TextReveal as="p" className="text-base leading-[1.375]">
            Recognized as a Small Business Trailblazer for leadership, growth, and participation in
            advancing the next generation of infrastructure contractors.
          </TextReveal>
        </div>
      </div>
    </section>
  )
}
