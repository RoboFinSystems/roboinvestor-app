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
 * The thumbnail loads straight from the content CDN as a card-sized webp, 800 or 1200
 * wide by `srcSet`, published beside the 1920x1080 PNG. Until 2026-09-17 the card sent
 * the ~2.5 MB PNG through `next/image`, which shrank it on the 0.25 vCPU App Runner
 * instance: a screen of cards held the server for ~20s and every click waited behind it.
 * An item published before the webps existed still takes that path, so no card renders
 * blank while the backfill catches up. `sizes` mirrors the grid: full width on mobile,
 * half at `md`, and ~390px in the three `lg` columns of the `max-w-7xl` container.
 */
const SIZES = '(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 400px'

export function CoverageCard({
  item,
  hrefBase = '/research',
  eager = false,
}: {
  item: CoverageItem
  hrefBase?: string
  /**
   * First row: load the thumbnail immediately and at high fetch priority (a likely
   * LCP element) instead of lazily. Not `preload`: Next 16 advises against it when
   * several images could be the LCP depending on viewport, as in a three-column row.
   */
  eager?: boolean
}) {
  const card800 = item.assets.thumbnail_card_800
  const card1200 = item.assets.thumbnail_card_1200

  return (
    <Link
      href={`${hrefBase}/${item.ticker.toLowerCase()}`}
      className="group block h-full"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white/80 shadow-lg backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-zinc-950">
        {card800 && card1200 ? (
          // eslint-disable-next-line @next/next/no-img-element -- the CDN already serves the sized webp; next/image would put the server back in the path
          <img
            src={card800}
            srcSet={`${card800} 800w, ${card1200} 1200w`}
            sizes={SIZES}
            alt={item.title}
            width={800}
            height={450}
            loading={eager ? 'eager' : 'lazy'}
            fetchPriority={eager ? 'high' : undefined}
            decoding="async"
            className="aspect-video w-full object-cover"
          />
        ) : (
          item.assets.thumbnail && (
            <Image
              src={item.assets.thumbnail}
              alt={item.title}
              width={1920}
              height={1080}
              sizes={SIZES}
              loading={eager ? 'eager' : 'lazy'}
              fetchPriority={eager ? 'high' : undefined}
              className="aspect-video w-full object-cover"
            />
          )
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
