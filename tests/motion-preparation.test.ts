import { test } from 'node:test'
import assert from 'node:assert/strict'
import { scheduleMotionPreparation } from '../src/lib/motion-preparation'

test('preparation prioritizes visible work, spreads frames and cancels unmounted jobs', () => {
  const original = globalThis.requestAnimationFrame
  const frames: FrameRequestCallback[] = []
  globalThis.requestAnimationFrame = (callback) => {
    frames.push(callback)
    return frames.length
  }
  const calls: string[] = []
  try {
    scheduleMotionPreparation(() => calls.push('prewarm'), true)
    const cancel = scheduleMotionPreparation(() => calls.push('unmounted'))
    scheduleMotionPreparation(() => calls.push('visible'))
    cancel()
    assert.equal(frames.length, 1)
    frames.shift()!(0)
    assert.deepEqual(calls, ['visible'])
    assert.equal(frames.length, 1)
    frames.shift()!(16)
    assert.deepEqual(calls, ['visible', 'prewarm'])
    assert.equal(frames.length, 0)
  } finally {
    globalThis.requestAnimationFrame = original
  }
})
