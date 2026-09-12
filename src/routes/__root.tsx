import { NotFound, RouteError } from '../components/route-feedback'
import { motionBootstrap, motionInitialCSS } from '../lib/motion-bootstrap'
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { SmoothScroll } from '../components/smooth-scroll'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'FLO Engineering — Built on Integrity. Engineered to Last.',
      },
    ],
    links: [
      { rel: 'preload', href: '/fonts/PPMori-Regular.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
      { rel: 'preload', href: '/fonts/PPMori-Light.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
      { rel: 'preload', href: '/fonts/PPMori-Semibold.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
      { rel: 'preload', href: '/fonts/PPTelegraf-Regular.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
  errorComponent: RouteError,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <style dangerouslySetInnerHTML={{ __html: motionInitialCSS }} />
        <script dangerouslySetInnerHTML={{ __html: motionBootstrap }} />
      </head>
      <body className="m-0 bg-white font-sans text-ink antialiased [&_a]:[-webkit-tap-highlight-color:transparent] [&_button]:[-webkit-tap-highlight-color:transparent] [&_button]:cursor-pointer [&_a]:touch-manipulation [&_button]:touch-manipulation [&_section]:scroll-mt-6 **:focus-visible:outline-2 **:focus-visible:outline-accent **:focus-visible:outline-offset-5">
        <SmoothScroll />
        {children}
        {import.meta.env.DEV && <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />}
        <Scripts />
      </body>
    </html>
  )
}
