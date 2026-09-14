import { cn } from '../../lib/cn'
import { contactLinks } from '../../lib/config'
import { TextReveal } from '../text-reveal'
import { ButtonLink } from '../shared/button-link'
import { responsiveImage } from '../../lib/images'
export function AboutOpportunities() {
  return (
    <section className="flex flex-col items-center gap-4 px-5 pt-23 pb-18">
      <TextReveal
        as="h2"
        className="mb-12 font-display text-[42px] leading-[1.24] tracking-[-.84px]"
      >
        Together, we build
      </TextReveal>
      {[
        { title: 'Join Our Crew!', image: 'careers', action: 'Browse Careers' },
        { title: 'Become a Partner!', image: 'partners', action: 'Contact Us' },
      ].map((item, index) => (
        <article
          key={item.title}
          className={cn(
            "relative isolate flex min-h-66.25 w-full max-w-228 overflow-clip max-md:flex-col",
            index ? 'flex-row-reverse bg-surface' : 'bg-ink text-white',
          )}
        >
          <div className="flex flex-1 flex-col items-start gap-3 px-9 py-6">
            <TextReveal
              as="h3"
              className="font-display text-[42px] leading-[1.24] tracking-[-.84px] max-md:text-[34px]"
            >
              {item.title}
            </TextReveal>
            <TextReveal as="p" className="text-lg leading-normal">
              Join a team that builds things that matter.
            </TextReveal>
            <div>
              <ButtonLink
                className="min-h-7.5 text-sm"
                href={`${contactLinks.email}?subject=${index ? 'Partnership' : 'Careers'}`}
                primary
              >
                {item.action}
              </ButtonLink>
            </div>
          </div>
          <img
            {...responsiveImage(`/about-page/${item.image}.webp`, '474px')}
            alt={index ? 'FLO infrastructure partner' : 'Join the FLO team'}
            width="474"
            height="265"
            className={cn(
              "h-66.25 min-w-0 flex-1 object-cover mask-size-[100%_100%] mask-no-repeat",
              index
                ? "mask-[url('/about-page/partners-mask.svg')]"
                : "mask-[url('/about-page/careers-mask.svg')]",
            )}
          />
        </article>
      ))}
    </section>
  )
}
