import { cn } from '../../lib/cn'
import { useEffect, useImperativeHandle, useRef, type Ref } from 'react'

/** Decorative looping background video; the section owns positioning, overlay and animation. */
export function BackgroundVideo({
  src,
  poster,
  className,
  ref,
}: {
  src: string
  poster?: string
  className?: string
  ref?: Ref<HTMLVideoElement>
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  useImperativeHandle(ref, () => videoRef.current!, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    void video.play().catch(() => {})
  }, [])

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
      className={cn('block h-full w-full object-cover', className)}
    />
  )
}