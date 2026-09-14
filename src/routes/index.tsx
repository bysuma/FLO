import { Home } from '../components/home/Home'
import { siteUrl, siteTitle, siteDescription } from '../lib/site'
import { createFileRoute } from '@tanstack/react-router'

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
      ...(siteUrl
        ? [
            { property: 'og:url', content: `${siteUrl}/` },
            { property: 'og:image', content: `${siteUrl}/hero/video-poster.webp` },
          ]
        : []),
    ],
    links: [
      { rel: 'preload', href: '/hero/video-poster.webp', as: 'image' },
      ...(siteUrl ? [{ rel: 'canonical', href: `${siteUrl}/` }] : []),
    ],
  }),
  component: Home,
})
