import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import { createPortal, flushSync } from 'react-dom'
import { Link, useNavigate } from '@tanstack/react-router'
import { gsap } from 'gsap'

gsap.registerPlugin(useGSAP)
import { animations } from '../../lib/animations'
import { Rollover } from './rollover'

import type { NavigationLink } from '../../lib/config'

export function MobileMenu({
  links,
  onClose,
}: {
  links: readonly NavigationLink[]
  onClose: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const timeline = useRef<gsap.core.Timeline | null>(null)
  const finish = useRef<(() => void) | null>(null)
  const closing = useRef(false)
  const navigate = useNavigate()

  useGSAP(
    () => {
      const dialog = ref.current!
      const root = document.documentElement
      const previousOverflow = root.style.overflow
      const previousFocus = document.activeElement as HTMLElement | null
      root.style.overflow = 'hidden'
      dialog.showModal()
      // React autofocus runs before showModal; move focus after the dialog opens.
      closeButtonRef.current?.focus({ preventScroll: true })
      const media = gsap.matchMedia()
      media.add(
        {
          reduced: '(prefers-reduced-motion: reduce)',
          animated: '(prefers-reduced-motion: no-preference)',
        },
        (context) => {
          const reduced = context.conditions?.reduced
          const items = dialog.querySelectorAll('[data-menu-link]')
          const sequence = gsap.timeline().fromTo(
            dialog,
            { yPercent: reduced ? 0 : -100, opacity: 1 },
            {
              yPercent: 0,
              duration: reduced ? 0 : animations.menu.duration / 1000,
              ease: 'power3.out',
            },
          )
          if (!reduced)
            sequence.fromTo(
              items,
              { y: 24, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.35,
                stagger: 0.06,
                ease: 'power2.out',
              },
              0.16,
            )
          timeline.current = sequence
        },
        dialog,
      )
      const desktop = matchMedia('(min-width: 768px)')
      const onDesktop = () => {
        if (desktop.matches) onClose()
      }
      desktop.addEventListener('change', onDesktop)
      return () => {
        desktop.removeEventListener('change', onDesktop)
        media.revert()
        dialog.close()
        root.style.overflow = previousOverflow
        previousFocus?.focus({ preventScroll: true })
      }
    },
    { scope: ref, dependencies: [onClose], revertOnUpdate: true },
  )

  const close = (after?: () => void) => {
    if (closing.current) return
    closing.current = true
    finish.current = after ?? null
    let completed = false
    const complete = () => {
      if (completed) return
      completed = true
      const navigateAfterClose = finish.current
      finish.current = null
      // Leave the menu's GSAP callback context before starting the page curtain.
      // Finish unmounting the modal and reverting its animations first.
      queueMicrotask(() => {
        flushSync(onClose)
        navigateAfterClose?.()
      })
    }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !timeline.current) {
      complete()
      return
    }
    timeline.current.eventCallback('onReverseComplete', complete).timeScale(1.6).reverse()
    if (timeline.current.time() === 0) complete()
  }

  return createPortal(
    <dialog
      ref={ref}
      id="mobile-navigation"
      aria-label="Mobile navigation"
      data-lenis-prevent
      onCancel={(event) => {
        event.preventDefault()
        close()
      }}
      className="fixed inset-0 m-0 flex h-dvh max-h-none w-screen max-w-none flex-col overflow-y-auto border-0 bg-ink px-page text-white opacity-0 backdrop:bg-transparent"
    >
      <div className="flex min-h-32 shrink-0 items-center justify-between pt-[env(safe-area-inset-top)]">
        <Link
          to="/"
          hash="home"
          aria-label="FLO Engineering home"
          onClick={(event) => {
            if (
              event.defaultPrevented ||
              event.button !== 0 ||
              event.metaKey ||
              event.ctrlKey ||
              event.shiftKey ||
              event.altKey
            )
              return
            event.preventDefault()
            close(() => {
              void navigate({ to: '/', hash: 'home' })
            })
          }}
          className="flex size-21.5 shrink-0 items-end justify-center pb-[1.3rem] [background:url('/navbar/logo-detail.svg')_right_1.25rem_top_2.22rem/.925rem_.925rem_no-repeat,url('/navbar/logo.svg')_center/contain_no-repeat]"
        >
          <span className="font-display text-[4.789px] leading-[.8] tracking-[2.2508px] text-ink">
            ENGINEERING
          </span>
        </Link>
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Close menu"
          onClick={() => close()}
          className="flex size-14 items-center justify-center"
        >
          <span aria-hidden="true" className="grid w-14">
            <span className="col-start-1 row-start-1 h-[1.3px] w-14 bg-white rotate-45" />
            <span className="col-start-1 row-start-1 h-[1.3px] w-14 bg-white -rotate-45" />
          </span>
        </button>
      </div>
      <nav
        aria-label="Mobile"
        className="flex flex-1 flex-col justify-center gap-6 pb-[max(3rem,env(safe-area-inset-bottom))]"
      >
        {links.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            hash={link.hash}
            data-menu-link
            onClick={(event) => {
              if (
                event.defaultPrevented ||
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
              )
                return
              event.preventDefault()
              close(() => {
                void navigate({
                  to: link.to,
                  hash: link.hash,
                })
              })
            }}
            className="py-2 font-display text-[40px] leading-[1.1]"
          >
            <Rollover reveal={false}>{link.label}</Rollover>
          </Link>
        ))}
      </nav>
    </dialog>,
    document.body,
  )
}
