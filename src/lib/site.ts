const configuredUrl = import.meta.env.VITE_SITE_URL
// The public origin is deliberately unset until the production domain is known.
export const siteUrl = configuredUrl ? new URL(configuredUrl).origin : undefined
export const siteTitle = 'FLO Engineering — Built on Integrity. Engineered to Last.'
export const siteDescription = 'From emergency road repairs to lasting infrastructure resilience, FLO Engineering helps communities restore what matters and build for tomorrow.'
