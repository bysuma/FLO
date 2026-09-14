import { test } from 'node:test'
import assert from 'node:assert/strict'
import { contactSchema } from '../src/lib/schemas/contact'

const valid = {
  firstName: ' Jane ',
  lastName: ' Doe ',
  email: ' jane@example.com ',
  phone: '',
  project: 'Other',
  role: 'Property owner',
  message: ' Help with a project. ',
  terms: 'on',
}

test('normalizes contact data and permits an empty optional phone', () => {
  const data = contactSchema.parse(valid)
  assert.equal(data.firstName, 'Jane')
  assert.equal(data.email, 'jane@example.com')
  assert.equal(data.message, 'Help with a project.')
})

test('rejects blank content, invalid email, unknown options and missing consent', () => {
  for (const invalid of [
    { firstName: ' ' },
    { message: ' ' },
    { email: 'invalid' },
    { project: 'unknown' },
    { role: 'unknown' },
    { terms: undefined },
    { message: 'x'.repeat(4001) },
  ])
    assert.equal(contactSchema.safeParse({ ...valid, ...invalid }).success, false)
})
