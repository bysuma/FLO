import { z } from 'zod'

export const projectTypes = [
  'Emergency response',
  'Slope stabilization',
  'Roadway and drainage',
  'Infrastructure planning',
  'Other',
] as const
export const contactRoles = [
  'Property owner',
  'Government agency',
  'Developer',
  'Engineering / design consultant',
  'General contractor / subcontractor',
  'Other',
] as const

export const contactSchema = z.object({
  firstName: z.string().trim().min(1, 'Enter your first name.').max(100),
  lastName: z.string().trim().min(1, 'Enter your last name.').max(100),
  email: z.string().trim().email('Enter a valid email address.').max(254),
  phone: z.string().trim().max(40),
  project: z.enum(projectTypes, { error: 'Select your project type.' }),
  role: z.enum(contactRoles, { error: 'Select the option that describes you.' }),
  message: z.string().trim().min(1, 'Tell us about your project.').max(4000),
  terms: z.literal('on', { error: 'Please agree to the terms.' }),
})

export type ContactValues = z.infer<typeof contactSchema>
