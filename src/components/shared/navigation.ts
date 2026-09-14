export const navigationLinks = [
  { label: 'About us', to: '/about', hash: undefined },
  { label: 'Services', to: '/', hash: 'services' },
  { label: 'Projects', to: '/', hash: 'projects' },
  { label: 'Contact Us', to: '/contact', hash: undefined },
] as const

export type NavigationLink = (typeof navigationLinks)[number]
