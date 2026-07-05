'use client'

/**
 * The report surface: a left table-of-contents and one section rendered at a time.
 * Selecting a section resolves its report via `loadSection` (cached, so revisiting
 * is instant) and renders it with the library `ReportView` (fact inspector intact).
 *
 * The rendered report is wrapped in `.rs-report-scope`, which maps the library's
 * `--rs-*` theme variables onto the app palette (light + dark) — see globals.css.
 *
 * Mount this with a `key` per report (`reportId`) so each report gets fresh state;
 * the initial selection then falls out of `sections[0]`.
 */
import type { NormalizedReport } from '@robosystems/report-components'
import { ReportView } from '@robosystems/report-components'
import { Spinner } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'
import { TocSidebar, type SectionRef } from './TocSidebar'

interface SectionedReportProps {
  /** The navigable sections, in display order (first is selected initially). */
  sections: SectionRef[]
  /** Resolve one section's renderable report (a live SEC fetch). */
  loadSection: (id: string) => Promise<NormalizedReport>
}

export function SectionedReport({
  sections,
  loadSection,
}: SectionedReportProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    sections[0]?.id ?? null
  )
  const [report, setReport] = useState<NormalizedReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadedIds, setLoadedIds] = useState<Set<string>>(new Set())
  const cache = useRef(new Map<string, NormalizedReport>())

  useEffect(() => {
    if (!selectedId) return
    const cached = cache.current.get(selectedId)
    if (cached) {
      setReport(cached)
      setError(null)
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    loadSection(selectedId)
      .then((r) => {
        if (cancelled) return
        cache.current.set(selectedId, r)
        setReport(r)
        setLoadedIds((prev) => new Set(prev).add(selectedId))
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
  }, [selectedId, loadSection])

  if (sections.length === 0) {
    return (
      <div className="py-8 text-sm text-zinc-500 dark:text-zinc-400">
        This report has no renderable sections.
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:self-start lg:overflow-y-auto">
        <TocSidebar
          sections={sections}
          selectedId={selectedId}
          loadingId={loading ? selectedId : null}
          loadedIds={loadedIds}
          onSelect={setSelectedId}
        />
      </aside>
      <main className="min-w-0">
        {loading ? (
          <div className="flex items-center gap-2 py-8 text-sm text-zinc-500 dark:text-zinc-400">
            <Spinner size="sm" /> Loading section…
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        ) : report ? (
          <div className="rs-report-scope">
            <ReportView report={report} />
          </div>
        ) : null}
      </main>
    </div>
  )
}
