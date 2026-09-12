import { defineConfig, loadEnv } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig(({ mode }) => {
  const siteUrl = loadEnv(mode, process.cwd(), 'VITE_SITE_URL').VITE_SITE_URL
  return {
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    tailwindcss(),
    tanstackStart({
      prerender: { enabled: true, failOnError: true, filter: page => page.path === '/' },
      sitemap: { enabled: Boolean(siteUrl), ...(siteUrl ? { host: new URL(siteUrl).origin } : {}) },
    }),
    viteReact(),
  ],
  }
})

export default config
