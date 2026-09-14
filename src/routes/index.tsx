import { siteUrl, siteTitle, siteDescription } from '../lib/site'
import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '../components/home/hero'
import { About } from '../components/home/about'
import { Services } from '../components/home/services'
import { Results } from '../components/home/results'
import { Projects } from '../components/home/projects'
import { Testimonials } from '../components/home/testimonials'
import { Contact } from '../components/home/contact'
import { Footer } from '../components/home/footer'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: siteTitle },
      { name: 'description', content: siteDescription },
      { property: 'og:title', content: siteTitle },
      { property: 'og:description', content: siteDescription },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'FLO Engineering' },
      { name: 'twitter:card', content: 'summary_large_image' },
      ...(siteUrl ? [
        { property: 'og:url', content: `${siteUrl}/` },
        { property: 'og:image', content: `${siteUrl}/hero/video-poster.webp` },
      ] : []),
    ],
    links: [
      { rel: 'preload', href: '/hero/video-poster.webp', as: 'image' },
      ...(siteUrl ? [{ rel: 'canonical', href: `${siteUrl}/` }] : []),
    ],
  }),
  component: Home,
})

function Home() {
  return <div className="relative isolate">
    <Hero />
    <div className="relative z-10 bg-white">
      <main className="relative z-10 bg-white"><About /><Services /><Results /><Projects /><Testimonials /><Contact /></main>
      <Footer />
    </div>
  </div>
}
