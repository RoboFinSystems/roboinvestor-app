'use client'

/**
 * The selected company's filings, most recent first. Pick one to render its report.
 */
import { Spinner } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { HiChevronRight, HiDocumentText } from 'react-icons/hi'
import { listReports, type SecFiling } from '../client'

interface FilingPickerProps {
  graphId: string
  cik: string
  onSelect: (filing: SecFiling) => void
}

function formatDate(iso: string | null): string {
  if (!iso) return ''
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  if (!m) return iso
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  return `${months[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}`
}

export function FilingPicker({ graphId, cik, onSelect }: FilingPickerProps) {
  const [filings, setFilings] = useState<SecFiling[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setFilings([])
    listReports(graphId, cik)
      .then((rows) => {
        if (cancelled) return
        setFilings(rows)
        setLoading(false)
      })
      .catch((e) => {
        if (cancelled) return
        setError(e instanceof Error ? e.message : String(e))
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [graphId, cik])

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-8 text-sm text-zinc-500 dark:text-zinc-400">
        <Spinner size="sm" /> Loading filings…
      </div>
    )
  }
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
        {error}
      </div>
    )
  }
  if (filings.length === 0) {
    return (
      <div className="py-8 text-sm text-zinc-500 dark:text-zinc-400">
        No filings found for this company.
      </div>
    )
  }

  return (
    <ul className="divide-y divide-zinc-100 overflow-hidden rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-700">
      {filings.map((f) => (
        <li key={f.reportId}>
          <button
            type="button"
            className="group flex w-full items-center gap-4 bg-white px-4 py-3 text-left hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800/60"
            onClick={() => onSelect(f)}
          >
            <span className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 flex h-10 w-14 shrink-0 items-center justify-center rounded-md text-sm font-bold">
              {f.form}
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                <HiDocumentText className="h-4 w-4 shrink-0" />
                Filed {formatDate(f.filingDate) || '—'}
              </span>
              {f.fiscalYear ? (
                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                  FY{f.fiscalYear}
                  {f.fiscalPeriod && f.fiscalPeriod !== 'FY'
                    ? ` · ${f.fiscalPeriod}`
                    : ''}
                </span>
              ) : null}
            </span>
            <HiChevronRight className="h-5 w-5 shrink-0 text-zinc-300 group-hover:text-zinc-500 dark:text-zinc-600 dark:group-hover:text-zinc-300" />
          </button>
        </li>
      ))}
    </ul>
  )
}
