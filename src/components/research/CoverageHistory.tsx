import { versionSlug } from '@/lib/research/catalog'
import type { CoverageVersion } from '@/lib/research/types'
import Link from 'next/link'

/**
 * The coverage timeline: each earlier report, linked to its own page at
 * /research/{ticker}/{version} where the brief is rendered, with its video and audio.
 */
export function CoverageHistory({
  ticker,
  history,
}: {
  ticker: string
  history: CoverageVersion[]
}) {
  if (!history.length) return null
  const base = `/research/${ticker.toLowerCase()}`
  return (
    <section className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
        Coverage history
      </h2>
      <ol className="space-y-3">
        {history.map((h) => (
          <li
            key={h.version}
            className="flex flex-col gap-1 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center sm:gap-4 dark:border-gray-800"
          >
            <span className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              {h.version}
            </span>
            <span className="flex-1 text-sm text-gray-700 dark:text-gray-200">
              {h.assets.brief ? (
                <Link
                  href={`${base}/${versionSlug(h.version)}`}
                  className="hover:underline"
                >
                  {h.title || 'Prior report'}
                </Link>
              ) : (
                h.title || 'Prior report'
              )}
              {h.legacy_ticker && (
                <em className="text-gray-400"> (as {h.legacy_ticker})</em>
              )}
            </span>
            <span className="flex gap-3 text-xs">
              {(h.youtube_url || h.assets.video) && (
                <a
                  href={h.youtube_url || h.assets.video}
                  className="text-cyan-600 hover:underline dark:text-cyan-400"
                >
                  Video
                </a>
              )}
              {h.assets.narration && (
                <a
                  href={h.assets.narration}
                  className="text-cyan-600 hover:underline dark:text-cyan-400"
                >
                  Audio
                </a>
              )}
              {h.assets.brief && (
                <Link
                  href={`${base}/${versionSlug(h.version)}`}
                  className="text-cyan-600 hover:underline dark:text-cyan-400"
                >
                  Read
                </Link>
              )}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
