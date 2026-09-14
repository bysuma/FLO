import { Link, useRouter } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'

const action =
  'inline-flex min-h-11 items-center justify-center rounded-button bg-brand px-5 py-3 text-white'

export function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-start justify-center gap-6 bg-white px-page text-ink">
      <p className="text-sm">404</p>
      <h1 className="font-display text-section">Page not found</h1>
      <p>The page you’re looking for is not available.</p>
      <Link to="/" className={action}>
        Back to home
      </Link>
    </main>
  )
}

export function RouteError({ reset }: ErrorComponentProps) {
  const router = useRouter()
  return (
    <main className="flex min-h-dvh flex-col items-start justify-center gap-6 bg-white px-page text-ink">
      <h1 className="font-display text-section">Something went wrong</h1>
      <p>Please try again or return to the homepage.</p>
      <div className="flex flex-wrap gap-4">
        <button
          className={action}
          onClick={() => {
            void router.invalidate().then(reset)
          }}
        >
          Try again
        </button>
        <Link to="/" className="inline-flex min-h-11 items-center underline">
          Back to home
        </Link>
      </div>
    </main>
  )
}
