import { contactLinks } from './config'
import type { ContactValues } from './schemas/contact'

export function createContactEmail(data: ContactValues) {
  const subject = `Project inquiry: ${data.project}`
  const body = [
    `Name: ${data.firstName} ${data.lastName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || 'Not provided'}`,
    `Project: ${data.project}`,
    `Role: ${data.role}`,
    '',
    data.message,
  ].join('\n')

  return `${contactLinks.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
