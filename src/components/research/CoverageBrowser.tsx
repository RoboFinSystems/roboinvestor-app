'use client'

import { TextInput } from 'flowbite-react'
import { useMemo, useState } from 'react'
import { HiSearch } from 'react-icons/hi'

import type { CoverageItem } from '@/lib/research/types'
import { CoverageGrid } from './CoverageGrid'

export interface CoverageBrowserProps {
  items: CoverageItem[]
  /** Base path for card links, forwarded to the grid (defaults to /research). */
  hrefBase?: string
  /** Override the search box placeholder. */
  placeholder?: string
}

/**
 * The research listing with a live client-side filter above it. A drop-in
 * replacement for {@link CoverageGrid}: the full grid renders on first paint
 * (so the server-rendered SEO page keeps every card in its HTML), and typing
 * narrows it in the browser. Matches ticker, company, title, and tags —
 * someone who types "Green Thumb" finds GTBIF without knowing the symbol.
 *
 * Filtering the whole in-memory catalog is fine at this scale; when the
 * catalog outgrows a single fetch this is where server-backed search slots in.
 */
export function CoverageBrowser({
  items,
  hrefBase,
  placeholder = 'Search by ticker, company, or title…',
}: CoverageBrowserProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return items
    return items.filter(
      (item) =>
        item.ticker.toLowerCase().includes(term) ||
        item.company.toLowerCase().includes(term) ||
        item.title.toLowerCase().includes(term) ||
        item.tags.some((tag) => tag.toLowerCase().includes(term))
    )
  }, [items, query])

  // Empty catalog: let the grid render its own "no coverage yet" state, no
  // point showing a search box over nothing.
  if (!items.length) {
    return <CoverageGrid items={items} hrefBase={hrefBase} />
  }

  const term = query.trim()

  return (
    <div className="space-y-6">
      <TextInput
        icon={HiSearch}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label="Search research"
      />
      {term && filtered.length === 0 ? (
        <p className="py-12 text-center text-gray-500 dark:text-gray-400">
          No results for “{term}”.
        </p>
      ) : (
        <CoverageGrid items={filtered} hrefBase={hrefBase} />
      )}
    </div>
  )
}
