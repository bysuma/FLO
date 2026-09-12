import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { gsap } from 'gsap'
import { animations } from '../../lib/animations'

function createPreparation() {
  const tasks: Promise<void>[] = []
  const held = new Set<gsap.core.Animation>()
  let released = false
  let resolveRelease!: () => void
  const ready = new Promise<void>(resolve => { resolveRelease = resolve })
  return {
    tasks,
    ready,
    get released() { return released },
    register() {
      let finish!: () => void
      tasks.push(new Promise<void>(resolve => { finish = resolve }))
      return finish
    },
    hold(context: gsap.Context) {
      if (released) return
      for (const tween of context.getTweens()) {
        let animation: gsap.core.Animation = tween
        while (animation.parent && animation.parent !== gsap.globalTimeline) animation = animation.parent
        animation.pause(0)
        held.add(animation)
      }
    },
    release() {
      released = true
      resolveRelease()
      held.forEach(animation => animation.play())
      held.clear()
    },
  }
}
const Preparation = createContext<ReturnType<typeof createPreparation> | null>(null)
export const useHeroPreparation = () => useContext(Preparation)

/** Only the hero participates; all other sections retain their in-view lifecycle. */
export function HeroPreparation({ children }: { children: ReactNode }) {
  const [preparation] = useState(createPreparation)
  useEffect(() => {
    let disposed = false
    let timer: ReturnType<typeof setTimeout> | undefined
    let frame = 0
    const run = async () => {
      await Promise.race([
        Promise.all(preparation.tasks),
        new Promise<void>(resolve => { timer = setTimeout(resolve, animations.hero.preparationTimeout) }),
      ])
      clearTimeout(timer)
      if (disposed) return
      frame = requestAnimationFrame(() => { if (!disposed) preparation.release() })
    }
    void run()
    return () => { disposed = true; clearTimeout(timer); cancelAnimationFrame(frame) }
  }, [preparation])
  return <Preparation.Provider value={preparation}>{children}</Preparation.Provider>
}
