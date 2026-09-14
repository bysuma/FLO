type Job = { run: () => void; cancelled: boolean }
const visible: Job[] = []
const upcoming: Job[] = []
let frame = 0

/** Prepare at most one layout-heavy reveal per frame; visible content goes first. */
export function scheduleMotionPreparation(run: () => void, prewarm = false) {
  const job = { run, cancelled: false }
  ;(prewarm ? upcoming : visible).push(job)
  if (!frame) frame = requestAnimationFrame(flush)
  return () => {
    job.cancelled = true
  }
}

function flush() {
  frame = 0
  let job: Job | undefined
  do {
    job = visible.shift() ?? upcoming.shift()
  } while (job?.cancelled)
  try {
    job?.run()
  } finally {
    if (visible.length || upcoming.length) frame = requestAnimationFrame(flush)
  }
}
