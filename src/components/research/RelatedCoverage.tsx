import type { RelatedCoverage as Related } from '@/lib/research/related'
import Link from 'next/link'

const href = (ticker: string) => `/research/${ticker.toLowerCase()}`

/**
 * The reports on the same industry, linked by company name. Rendered on the server with
 * the page, so every report is reachable from its peers and not only from the index.
 */
export function RelatedCoverage({ related }: { related?: Related | null }) {
  if (!related || (!related.items.length && !related.hub)) return null
  return (
    <section
      aria-labelledby="related-coverage"
      className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800"
    >
      <h2
        id="related-coverage"
        className="mb-4 text-xl font-bold text-gray-900 dark:text-white"
      >
        More coverage in {related.label}
      </h2>
      {related.hub && (
        <p className="mb-4 text-sm text-gray-700 dark:text-gray-200">
          Sector report:{' '}
          <Link
            href={href(related.hub.ticker)}
            className="text-cyan-600 hover:underline dark:text-cyan-400"
          >
            {related.hub.title}
          </Link>
        </p>
      )}
      {related.items.length > 0 && (
        <ul className="space-y-3">
          {related.items.map((r) => (
            <li
              key={r.ticker}
              className="rounded-lg border border-gray-200 p-4 dark:border-gray-800"
            >
              <Link
                href={href(r.ticker)}
                className="font-semibold text-cyan-600 hover:underline dark:text-cyan-400"
              >
                {r.company} ({r.ticker})
              </Link>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">
                {r.title}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
