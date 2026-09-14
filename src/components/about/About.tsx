import { AboutHero } from './AboutHero'
import { AboutStory } from './AboutStory'
import { AboutLeadership } from './AboutLeadership'
import { AboutStandards } from './AboutStandards'
import { AboutOpportunities } from './AboutOpportunities'
import { Contact } from '../shared/contact'
import { Footer } from '../shared/footer'

export function About() {
  return (
    <div className="relative isolate bg-white text-ink">
      <main className="relative z-10 bg-white">
        <AboutHero />
        <AboutStory />
        <AboutLeadership />
        <AboutStandards />
        <AboutOpportunities />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
