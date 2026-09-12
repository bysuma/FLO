import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '../components/home/hero'
import { About } from '../components/home/about'
import { Services } from '../components/home/services'
import { Results } from '../components/home/results'
import { Projects } from '../components/home/projects'
import { Testimonials } from '../components/home/testimonials'
import { Contact } from '../components/home/contact'
import { Footer } from '../components/home/footer'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return <div><Hero /><main><About /><Services /><Results /><Projects /><Testimonials /><Contact /></main><Footer /></div>
}
