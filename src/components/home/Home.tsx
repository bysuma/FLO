import { HomeHero } from './HomeHero'
import { HomeAbout } from './HomeAbout'
import { HomeServices } from './HomeServices'
import { HomeResults } from './HomeResults'
import { HomeProjects } from './HomeProjects'
import { HomeTestimonials } from './HomeTestimonials'
import { Contact } from '../shared/contact'
import { Footer } from '../shared/footer'

export function Home() {
  return (
    <div className="relative isolate">
      <HomeHero />
      <div className="relative z-10 bg-white">
        <main className="relative z-10 bg-white">
          <HomeAbout />
          <HomeServices />
          <HomeResults />
          <HomeProjects />
          <HomeTestimonials />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  )
}
