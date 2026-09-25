'use client'

import { useEffect } from 'react'

/**
 * Last-resort boundary for an error in the root layout itself, where the
 * route-level `error.tsx` cannot render. It replaces the whole document, so it
 * carries its own `<html>`/`<body>` and no app styling dependencies.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 0,
        }}
      >
        <div style={{ textAlign: 'center', padding: '0 24px' }}>
          <h1 style={{ fontSize: '1.75rem', marginBottom: 12 }}>
            Something has gone seriously wrong
          </h1>
          <p style={{ color: '#6b7280', marginBottom: 20 }}>
            Please try again. If it keeps happening, come back in a few minutes.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{ padding: '8px 16px', marginRight: 8, cursor: 'pointer' }}
          >
            Try again
          </button>
          <button
            type="button"
            // A full load, not client navigation: the layout itself failed.
            // eslint-disable-next-line @next/next/no-location-assign-relative-destination
            onClick={() => window.location.assign('/')}
            style={{ padding: '8px 16px', cursor: 'pointer' }}
          >
            Go back home
          </button>
        </div>
      </body>
    </html>
  )
}
