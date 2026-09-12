import { describe, it as test } from 'node:test'
import assert from 'node:assert/strict'
import { runInNewContext } from 'node:vm'
import { motionBootstrap, motionInitialCSS, motionGroups } from '../src/lib/motion-bootstrap'

function boot(reduced = false) {
  const dataset: Record<string, string> = {}
  const timers: (() => void)[] = []
  runInNewContext(motionBootstrap, {
    matchMedia: () => ({ matches: reduced }),
    document: { documentElement: { dataset, removeAttribute: () => { delete dataset.motion } } },
    setTimeout: (callback: () => void) => timers.push(callback),
  })
  return { dataset, timers }
}

describe('SSR reveal preparation', () => {
  test('opts in synchronously, before hydration or intersection callbacks', () => {
    assert.equal(boot().dataset.motion, 'boot')
    assert.ok(motionInitialCSS.includes('[data-text-reveal]'))
    assert.ok(motionInitialCSS.includes(':not([data-motion-ready]) { opacity: 0; }'))
    for (const group of motionGroups) assert.ok(motionInitialCSS.includes(group.selector))
  })
  test('failed hydration reveals content instead of leaving it hidden', () => {
    const state = boot()
    state.timers[0]()
    assert.equal(state.dataset.motion, undefined)
  })
  test('successful setup keeps below-fold reveals prepared after the timeout', () => {
    const state = boot()
    state.dataset.motion = 'ready'
    state.timers[0]()
    assert.equal(state.dataset.motion, 'ready')
  })
  test('reduced motion does not hide server-rendered content', () => {
    assert.equal(boot(true).dataset.motion, undefined)
    assert.equal(boot(true).timers.length, 0)
  })
})
