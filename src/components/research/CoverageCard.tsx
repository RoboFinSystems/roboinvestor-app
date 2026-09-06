import type { CoverageItem } from '@/lib/research/types'
import Image from 'next/image'
import Link from 'next/link'

/**
 * A coverage tile: full-bleed thumbnail on top, then ticker/label, title, summary, and
 * prior-report count. Self-contained (not the shared Flowbite Card) so the cover image
 * sits flush at the top of every card regardless of how much text each one has — the
 * shared card theme centers its content (`justify-center`), which left the covers at
 * different heights across a row.
 *
 * The thumbnail is the catalog's 1920x1080 CDN PNG (~2.5 MB) served through
 * `next/image`, which resizes it to the card and serves webp to browsers that accept it. `sizes`
 * mirrors the grid: full width on mobile, half at `md`, and ~390px in the three
 * `lg` columns of the `max-w-7xl` container.
 */
export function CoverageCard({
  item,
  hrefBase = '/research',
  eager = false,
}: {
  item: CoverageItem
  hrefBase?: string
  /** Load the thumbnail immediately (first row, a likely LCP element) instead of lazily. */
  eager?: boolean
}) {
  return (
    <Link
      href={`${hrefBase}/${item.ticker.toLowerCase()}`}
      className="group block h-full"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white/80 shadow-lg backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-zinc-950">
        {item.assets.thumbnail && (
          <Image
            src={item.assets.thumbnail}
            alt={item.title}
            width={1920}
            height={1080}
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 400px"
            loading={eager ? 'eager' : 'lazy'}
            className="aspect-video w-full object-cover"
          />
        )}
        <div className="flex flex-1 flex-col gap-2 p-5">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            <span className="rounded bg-cyan-500/10 px-2 py-0.5 font-semibold text-cyan-600 dark:text-cyan-400">
              {item.ticker}
            </span>
            {item.coverage_label && <span>{item.coverage_label}</span>}
            <span className="ml-auto">{item.date?.slice(0, 10)}</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-cyan-600 dark:text-white dark:group-hover:text-cyan-400">
            {item.title}
          </h3>
          <p className="line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
            {item.summary}
          </p>
          {item.history.length > 0 && (
            <p className="mt-auto pt-1 text-xs text-gray-400">
              +{item.history.length} prior{' '}
              {item.history.length === 1 ? 'report' : 'reports'}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
