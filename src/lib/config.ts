/** Public company details shared by pages, forms, and contact links. */
export const company = {
  name: 'FLO Engineering',
  email: 'info@floengineering.net',
  phone: {
    number: '+19092484309',
    display: '909-248-4309',
  },
  address: {
    street: '25029 Bleecker St',
    suite: 'Suite 200',
    locality: 'Baldwin Park, CA',
  },
  hours: {
    daily: '24 hours a day',
    weekly: '7 days a week',
  },
  licenseNumber: '1078272',
} as const

export const contactLinks = {
  email: `mailto:${company.email}`,
  phone: `tel:${company.phone.number}`,
} as const

export const navigationLinks = [
  { label: 'About us', to: '/about', hash: undefined },
  { label: 'Services', to: '/', hash: 'services' },
  { label: 'Projects', to: '/', hash: 'projects' },
  { label: 'Contact Us', to: '/contact', hash: undefined },
] as const

export type NavigationLink = (typeof navigationLinks)[number]

export const socialLinks = {
  instagram: 'https://www.instagram.com/floengineeringinc/',
  linkedin: 'https://www.linkedin.com/company/flo-engineering-inc/home/',
} as const
