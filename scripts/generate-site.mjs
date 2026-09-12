import { writeFile } from 'node:fs/promises'
import { loadEnv } from 'vite'
const configured = loadEnv('production', process.cwd(), 'VITE_SITE_URL').VITE_SITE_URL
const origin = configured ? new URL(configured).origin : undefined
await writeFile(new URL('../public/robots.txt', import.meta.url), `User-agent: *\nAllow: /\n${origin ? `\nSitemap: ${origin}/sitemap.xml\n` : ''}`)
