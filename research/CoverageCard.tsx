import { Card } from 'flowbite-react'
import Link from 'next/link'
import { customTheme } from '../theme'
import type { CoverageItem } from './types'

/** A coverage tile: thumbnail, ticker/label, title, summary, prior-report count. */
export function CoverageCard({
  item,
  hrefBase = '/research',
}: {
  item: CoverageItem
  hrefBase?: string
}) {
  return (
    <Link
      href={`${hrefBase}/${item.ticker.toLowerCase()}`}
      className="group block"
    >
      <Card
        theme={customTheme.card}
        className="h-full overflow-hidden transition hover:shadow-lg"
      >
        {item.assets.thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.assets.thumbnail}
            alt={item.title}
            className="-mx-4 -mt-4 mb-2 aspect-video w-[calc(100%+2rem)] object-cover"
          />
        )}
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
          <p className="text-xs text-gray-400">
            +{item.history.length} prior{' '}
            {item.history.length === 1 ? 'report' : 'reports'}
          </p>
        )}
      </Card>
    </Link>
  )
}
