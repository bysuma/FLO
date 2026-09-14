import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cn } from '../src/lib/cn'

test('resolves overrides while preserving project font-size and color tokens', () => {
  assert.equal(cn('px-4 text-base text-white', 'px-6 text-caption'), 'text-white px-6 text-caption')
  assert.equal(
    cn('font-display text-hero text-brand', false && 'hidden'),
    'font-display text-hero text-brand',
  )
  assert.equal(cn('md:px-4 px-2', 'md:px-8'), 'px-2 md:px-8')
})
