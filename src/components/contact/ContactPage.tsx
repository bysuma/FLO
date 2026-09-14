import type { ReactNode } from 'react'
import { ContactHero } from './ContactHero'
import { ContactDetails } from './ContactDetails'
import { ContactInquiry } from './ContactInquiry'
import { Footer } from '../shared/footer'

function Root({ children }: { children: ReactNode }) {
  return <div className="relative isolate bg-white text-ink [--spacing-page:31px] xl:[&_.footer]:px-[31px] xl:[&_.footer]:pt-[31px] xl:[&_.footer]:pb-[30px] xl:[&_.footer-top]:gap-[42px] xl:[&_.footer-top>div:first-child]:w-[236px] xl:[&_.footer-top>div:nth-child(2)]:w-[190.667px] xl:[&_.footer-top>div:nth-child(3)]:w-[190.667px] xl:[&_.footer_h2]:text-[16px] xl:[&_.footer_h2]:leading-[22px] xl:[&_.footer_address]:text-[14px] xl:[&_.footer_address]:leading-[1.09335] xl:[&_.footer_ul]:text-[14px] xl:[&_.footer_ul]:leading-[1.09335] xl:[&_.footer_ul]:mt-[24px] xl:[&_.footer_ul]:gap-[16px] xl:[&_.footer-top>div:nth-child(3)>p]:text-[14px] xl:[&_.footer-top>div:nth-child(3)>p]:leading-[1.09335] xl:[&_.footer-top>div:nth-child(3)>p]:mt-[24px] xl:[&_.footer-bottom>div:first-of-type]:gap-[62px] xl:[&_.footer-bottom>div:first-of-type]:text-[12px] xl:[&_.footer-bottom>div:first-of-type]:leading-[normal]">{children}</div>
}
function Content({ children }: { children: ReactNode }) {
  return <main className="relative z-10 bg-white">{children}</main>
}

export const ContactPage = { Root, Content, Hero: ContactHero, Details: ContactDetails, Inquiry: ContactInquiry, Footer }

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
