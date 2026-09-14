import { About } from '../components/about/About'
import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { title: 'About Us | FLO Engineering' },
      {
        name: 'description',
        content:
          'Meet the people behind FLO Engineering. Family-owned, community-driven, and backed by 40 years of experience.',
      },
    ],
  }),
  component: About,
})
