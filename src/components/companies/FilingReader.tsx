'use client'

/**
 * One filing, read whole: fetch its Tavi model (or holon) from the public data
 * CDN, parse it in the browser, and hand its sections to `SectionedReport`.
 * Every section is in memory once the file is parsed, so a section loads
 * instantly — no graph, no API, one fetch per filing.
 */
import { fetchReportText, reportUrl } from '@/lib/filings/catalog'
import type { CatalogFiling } from '@/lib/filings/types'
import type { NormalizedReport } from '@robosystems/report-components'
import {
  reportSections,
  sliceReportSection,
} from '@robosystems/report-components'
import { parseReportDocument } from '@robosystems/report-components/adapters'
import { Spinner } from 'flowbite-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { SectionedReport } from './SectionedReport'

export function FilingReader({ filing }: { filing: CatalogFiling }) {
  const url = reportUrl(filing)
  const [report, setReport] = useState<NormalizedReport | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!url) return
    let cancelled = false
    setReport(null)
    setError(null)
    fetchReportText(url)
      .then((text) => parseReportDocument(text))
      .then(({ report: parsed }) => {
        if (!cancelled) setReport(parsed)
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e))
      })
    return () => {
      cancelled = true
    }
  }, [url])

  const sections = useMemo(
    () => (report ? reportSections(report) : []),
    [report]
  )
  const loadSection = useCallback(
    (id: string): Promise<NormalizedReport> =>
      report
        ? Promise.resolve(sliceReportSection(report, id))
        : Promise.reject(new Error('No report loaded')),
    [report]
  )

  if (!url) {
    return (
      <p className="py-8 text-sm text-zinc-500 dark:text-zinc-400">
        This filing&apos;s artifacts are not written yet. Check back after the
        next pipeline run.
      </p>
    )
  }
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
        Could not load this filing: {error}
      </div>
    )
  }
  if (!report) {
    return (
      <div className="flex items-center gap-2 py-8 text-sm text-zinc-500 dark:text-zinc-400">
        <Spinner size="sm" /> Loading the {filing.form}…
      </div>
    )
  }
  return (
    <SectionedReport
      key={filing.accession}
      sections={sections}
      loadSection={loadSection}
    />
  )
}
