'use client'

/**
 * Company search — type a ticker or a name; a debounced Cypher lookup (ticker
 * prefix OR name substring) fills the dropdown. Keyboard: ↑/↓ to move, Enter to
 * pick, Esc to close. Selecting a company hands it to `onSelect` (the search page
 * navigates to that entity's route).
 */
import { Spinner } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'
import { HiSearch } from 'react-icons/hi'
import { searchEntities, type SecEntity } from '../client'

interface TickerSearchProps {
  /** Repository graph to search (e.g. "sec"). */
  graphId: string
  onSelect: (entity: SecEntity) => void
}

export function TickerSearch({ graphId, onSelect }: TickerSearchProps) {
  const [term, setTerm] = useState('')
  const [results, setResults] = useState<SecEntity[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
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
      searchEntities(graphId, q)
        .then((rows) => {
          if (!current) return
          setResults(rows)
          setActive(0)
          setLoading(false)
        })
        .catch(() => {
          if (!current) return
          setResults([])
          setLoading(false)
        })
    }, 250)
    return () => {
      current = false
      clearTimeout(handle)
    }
  }, [term, graphId])

  // Close on outside click.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node))
        setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const choose = (entity: SecEntity) => {
    onSelect(entity)
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
      <div className="relative">
        <HiSearch className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-zinc-400" />
        <input
          className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-zinc-300 bg-white py-2.5 pr-4 pl-10 text-zinc-900 placeholder-zinc-400 focus:ring-1 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
          type="text"
          value={term}
          placeholder="Search by ticker or company name…"
          onChange={(e) => {
            setTerm(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoComplete="off"
        />
      </div>

      {open && term.trim() ? (
        <ul
          className="absolute z-20 mt-1 max-h-80 w-full overflow-auto rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
          role="listbox"
        >
          {loading ? (
            <li className="flex items-center gap-2 px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400">
              <Spinner size="sm" /> Searching…
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
                  className={`flex w-full items-baseline gap-3 px-4 py-2 text-left ${
                    i === active
                      ? 'bg-primary-50 dark:bg-primary-900/30'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-700/50'
                  }`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(r)}
                >
                  <span className="text-primary-700 dark:text-primary-400 w-16 shrink-0 font-mono text-sm font-semibold">
                    {r.ticker ?? '—'}
                  </span>
                  <span className="truncate text-sm text-zinc-800 dark:text-zinc-200">
                    {r.name}
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
