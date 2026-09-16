'use client'

/**
 * Company search — type a ticker or a name; a debounced call to
 * `/api/companies/search` (the corpus index, searched server-side) fills the
 * dropdown. Keyboard: ↑/↓ to move, Enter to pick, Esc to close.
 */
import type { IndexRow } from '@/lib/filings/types'
import { useEffect, useRef, useState } from 'react'

interface CompanySearchProps {
  onSelect: (row: IndexRow) => void
  /** Override the placeholder. */
  placeholder?: string
}

function latestLabel(row: IndexRow): string {
  const { form, fiscal_period, fiscal_year, report_date } = row.latest
  const period =
    fiscal_period && fiscal_year
      ? `${fiscal_period} ${fiscal_year}`
      : (report_date ?? '')
  return period ? `${form} · ${period}` : form
}

export function CompanySearch({
  onSelect,
  placeholder = 'Search by ticker or company name…',
}: CompanySearchProps) {
  const [term, setTerm] = useState('')
  const [results, setResults] = useState<IndexRow[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [active, setActive] = useState(0)
  const boxRef = useRef<HTMLDivElement>(null)

  // Debounced search. A stale-response guard (`current`) keeps a slow earlier
  // query from overwriting a newer one.
  useEffect(() => {
    const q = term.trim()
    if (!q) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    let current = true
    const handle = setTimeout(() => {
      fetch(`/api/companies/search?q=${encodeURIComponent(q)}`)
        .then(async (res) => {
          if (!res.ok) throw new Error(`Search failed: ${res.status}`)
          return (await res.json()) as { companies: IndexRow[] }
        })
        .then((body) => {
          if (!current) return
          setResults(body.companies)
          setError(null)
          setActive(0)
          setLoading(false)
        })
        .catch((e: unknown) => {
          if (!current) return
          setResults([])
          setError(e instanceof Error ? e.message : String(e))
          setLoading(false)
        })
    }, 250)
    return () => {
      current = false
      clearTimeout(handle)
    }
  }, [term])

  // Close on outside click.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node))
        setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const choose = (row: IndexRow) => {
    onSelect(row)
    setTerm('')
    setResults([])
    setOpen(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const pick = results[active]
      if (pick) choose(pick)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="relative" ref={boxRef}>
      <input
        type="text"
        value={term}
        placeholder={placeholder}
        onChange={(e) => {
          setTerm(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        spellCheck={false}
        autoComplete="off"
        aria-label="Search companies"
        className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 placeholder-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
      />
      {open && term.trim() ? (
        <ul
          role="listbox"
          className="absolute z-20 mt-1 max-h-96 w-full overflow-y-auto rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
        >
          {loading ? (
            <li className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400">
              Searching…
            </li>
          ) : error ? (
            <li className="px-4 py-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </li>
          ) : results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400">
              No companies found
            </li>
          ) : (
            results.map((r, i) => (
              <li key={r.cik}>
                <button
                  type="button"
                  role="option"
                  aria-selected={i === active}
                  className={`flex w-full items-baseline gap-3 px-4 py-2.5 text-left text-sm ${
                    i === active
                      ? 'bg-primary-50 dark:bg-primary-900/30'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(r)}
                >
                  <span className="text-primary-700 dark:text-primary-300 w-16 shrink-0 font-mono font-semibold">
                    {r.ticker}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-zinc-900 dark:text-zinc-100">
                    {r.name}
                  </span>
                  <span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                    {r.exchange ? `${r.exchange} · ` : ''}
                    {latestLabel(r)}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  )
}
