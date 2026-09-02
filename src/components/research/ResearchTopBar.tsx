'use client'

import { useAuth } from '@robosystems/core/auth-components'
import { LogoBadge } from '@robosystems/core/ui-components/Logo'
import Link from 'next/link'

// The public research pages live outside the (app) shell, so a signed-in reader who
// arrived from the sidebar needs a way back and a stranger needs the door in. Rendered
// on the client because only the browser knows which one is reading.
export function ResearchTopBar() {
  const { isAuthenticated, isLoading } = useAuth()
  const signedIn = isAuthenticated && !isLoading

  return (
    <div className="flex items-center justify-between">
      <Link
        href="/"
        className="flex items-center transition-opacity hover:opacity-80"
      >
        <LogoBadge className="h-10 w-10" />
        <span className="font-heading ml-2 text-xl font-semibold text-white sm:text-2xl">
          RoboInvestor
        </span>
      </Link>
      <div className="flex items-center gap-3">
        {signedIn ? (
          <Link
            href="/home"
            className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:border-gray-500 hover:bg-white/5"
          >
            Back to the app
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              className="px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="from-primary-500 to-secondary-500 shadow-primary-500/25 hover:shadow-primary-500/40 rounded-lg bg-linear-to-r px-4 py-2 text-sm font-medium text-white shadow-lg transition-all"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
