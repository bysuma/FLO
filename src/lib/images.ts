import manifest from './images.generated.json'

type ImageMetadata = { width: number; height: number; srcSet: string }
const images: Record<string, ImageMetadata> = manifest

/** Uses pre-generated files; no client image processing or CDN dependency. */
export function responsiveImage(src: string, sizes: string) {
  const image = images[src]
  if (!image) return { src }
  return { src, srcSet: image.srcSet, sizes }
}

/** Picture sources accept srcSet, never the img-only src attribute. */
export function responsiveSource(src: string, sizes: string) {
  return { srcSet: images[src]?.srcSet ?? src, sizes }
}
