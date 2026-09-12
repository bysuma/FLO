import { responsiveImage } from '../../lib/images'

/** Decorative photography; the section owns positioning, overlay and animation. */
export function BackgroundPhoto({ src, mobileSrc, sizes = '100vw', position = 'center' }: {
  src: string
  mobileSrc: string
  sizes?: string
  position?: 'center' | 'bottom'
}) {
  return <picture className="absolute inset-0 block">
    <source media="(width < 48rem)" {...responsiveImage(mobileSrc, sizes)} />
    <img {...responsiveImage(src, sizes)} alt="" width="1440" height="900" loading="lazy" decoding="async" className={`block h-full w-full object-cover ${position === 'bottom' ? 'object-bottom' : 'object-center'}`} />
  </picture>
}
