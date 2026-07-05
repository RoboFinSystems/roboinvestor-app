'use client'

/**
 * Loads the section list for one filing (a fast first read), then hands it to
 * `SectionedReport`, which fetches each section on demand as the user navigates.
 *
 * Both reads run through a `SecQuery` bound to the repository graph; the actual
 * report reconstruction (shell → sections → normalized model) lives in
 * `@robosystems/report-components`.
 */
import type {
  NormalizedReport,
  SecReportShell,
} from '@robosystems/report-components'
import {
  fetchSecReportShell,
  fetchSecSection,
} from '@robosystems/report-components'
import { Spinner } from 'flowbite-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { makeSecQuery } from '../client'
import { SectionedReport } from './SectionedReport'

interface ReportScreenProps {
  /** Repository graph (e.g. "sec"). */
  graphId: string
  /** The filing to render — a `Report.identifier`. */
  reportId: string
}

export function ReportScreen({ graphId, reportId }: ReportScreenProps) {
  const query = useMemo(() => makeSecQuery(graphId), [graphId])
  const [shell, setShell] = useState<SecReportShell | null>(null)
  const [loadingShell, setLoadingShell] = useState(true)
  const [shellError, setShellError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setShell(null)
    setLoadingShell(true)
    setShellError(null)
    fetchSecReportShell(query, reportId)
      .then((s) => {
        if (cancelled) return
        setShell(s)
        setLoadingShell(false)
      })
      .catch((e) => {
        if (cancelled) return
        setShellError(e instanceof Error ? e.message : String(e))
        setLoadingShell(false)
      })
    return () => {
      cancelled = true
    }
  }, [query, reportId])

  const loadSection = useCallback(
    (id: string): Promise<NormalizedReport> => {
      if (!shell) return Promise.reject(new Error('Report not loaded'))
      const section = shell.sections.find((s) => s.id === id)
      if (!section) return Promise.reject(new Error(`Unknown section ${id}`))
      return fetchSecSection(query, shell, section)
    },
    [query, shell]
  )

  if (loadingShell) {
    return (
      <div className="flex items-center gap-2 py-8 text-sm text-zinc-500 dark:text-zinc-400">
        <Spinner size="sm" /> Loading report sections…
      </div>
    )
  }
  if (shellError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
        {shellError}
      </div>
    )
  }

  return (
    <SectionedReport
      key={reportId}
      sections={shell?.sections ?? []}
      loadSection={loadSection}
    />
  )
}
