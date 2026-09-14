import { company } from '../lib/config'
import { createFileRoute } from '@tanstack/react-router'
import { ContactUs } from '../components/contact/ContactPage'
import { siteUrl } from '../lib/site'

export const Route = createFileRoute('/contact')({
  head: () => ({
    meta: [
      { title: `Contact Us | ${company.name}` },
      { name: 'description', content: `Let’s build together. Contact ${company.name} to discuss your project, infrastructure needs, or emergency response. Available ${company.hours.daily}, ${company.hours.weekly}.` },
    ],
    links: siteUrl ? [{ rel: 'canonical', href: `${siteUrl}/contact` }] : [],
  }),
  component: ContactUs,
})
