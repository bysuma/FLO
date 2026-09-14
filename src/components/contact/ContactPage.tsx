import type { ReactNode } from 'react'
import { ContactHero } from './ContactHero'
import { ContactDetails } from './ContactDetails'
import { ContactInquiry } from './ContactInquiry'
import { Footer } from '../shared/footer'

function Root({ children }: { children: ReactNode }) {
  return <div className="relative isolate bg-white text-ink">{children}</div>
}
function Content({ children }: { children: ReactNode }) {
  return <main className="relative z-10 bg-white">{children}</main>
}

export const ContactPage = {
  Root,
  Content,
  Hero: ContactHero,
  Details: ContactDetails,
  Inquiry: ContactInquiry,
  Footer,
}

export function ContactUs() {
  return (
    <ContactPage.Root>
      <ContactPage.Content>
        <ContactPage.Hero />
        <ContactPage.Details />
        <ContactPage.Inquiry />
      </ContactPage.Content>
      <ContactPage.Footer />
    </ContactPage.Root>
  )
}
