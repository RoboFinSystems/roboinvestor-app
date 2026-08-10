'use client'

/**
 * Viewer for a report a portfolio company shared with this fund.
 *
 * Renders the **holon** — the report as scene/boundary/projection named graphs
 * — rather than re-deriving a view from the copied rows. The share carries the
 * issuer's own published artifact into this graph's bundle prefix, so what the
 * fund reads is the publication the issuer actually made, byte for byte.
 *
 * That is also why this needs no RoboLedger: a holon is self-contained.
 * `parseJsonld` normalizes it and the shared `<ReportView>` reconstructs the
 * statement tables, exactly as the SEC filing viewer does from its own adapter.
 *
 * The bundle is fetched through the same-origin `/api/reports/holon` proxy —
 * the presigned S3 URL is an attachment from a bucket with no CORS, so a direct
 * browser fetch is blocked.
 */

import type { ReportListItem } from '@robosystems/client/clients'
import {
  clients,
  PageHeader,
  PageLayout,
  useGraphContext,
} from '@robosystems/core'
import type { NormalizedReport } from '@robosystems/report-components'
import {
  reportSections,
  ReportView,
  sliceReportSection,
} from '@robosystems/report-components'
import { parseJsonld } from '@robosystems/report-components/adapters'
import { Alert, Card, Spinner } from 'flowbite-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { HiDocumentReport, HiExclamationCircle, HiShare } from 'react-icons/hi'

const formatDate = (value: string | null | undefined): string | null => {
  if (!value) return null
  const date = new Date(value.includes('T') ? value : `${value}T00:00:00`)
  return Number.isNaN(date.getTime())
    ? null
    : date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
}

export default function ReceivedReportContent({
  reportId,
}: {
  reportId: string
}) {
  const { state: graphState } = useGraphContext()
  const graphId = graphState.currentGraphId

  const [meta, setMeta] = useState<ReportListItem | null>(null)
  const [report, setReport] = useState<NormalizedReport | null>(null)
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null
  )
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const sections = useMemo(
    () => (report ? reportSections(report) : []),
    [report]
  )

  const activeSlice = useMemo(() => {
    if (!report) return null
    if (!selectedSectionId) return report
    return sliceReportSection(report, selectedSectionId)
  }, [report, selectedSectionId])

  useEffect(() => {
    if (report) setSelectedSectionId(reportSections(report)[0]?.id ?? null)
  }, [report])

  const load = useCallback(async () => {
    if (!graphId) return
    setIsLoading(true)
    setError(null)
    try {
      // Metadata first: it drives the header, and it is also how a report that
      // was revoked between the list and this page surfaces as a clean miss.
      const list = await clients.ledger.listReports(graphId)
      const found = (list ?? []).find((r) => r.id === reportId) ?? null
      setMeta(found)
      if (!found) {
        setError('This report is no longer available.')
        return
      }

      const resp = await clients.ledger.getReportDownloadUrl(
        graphId,
        reportId,
        {
          format: 'HOLON_JSONLD',
        }
      )
      if (!resp) {
        setError('This report has no published bundle to render.')
        return
      }

      const proxied = await fetch('/api/reports/holon', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url: resp.downloadUrl }),
      })
      if (!proxied.ok) {
        const detail = (await proxied.json().catch(() => null)) as {
          error?: string
        } | null
        throw new Error(detail?.error ?? `Proxy returned ${proxied.status}`)
      }

      const parsed = await parseJsonld(await proxied.text())
      if (!parsed.informationBlocks.length) {
        setError('No statements found in this report.')
        return
      }
      setReport(parsed)
    } catch (err) {
      setError(
        `Could not load this report: ${
          err instanceof Error ? err.message : String(err)
        }`
      )
    } finally {
      setIsLoading(false)
    }
  }, [graphId, reportId])

  useEffect(() => {
    void load()
  }, [load])

  const received = formatDate(meta?.sharedAt)

  return (
    <PageLayout>
      <PageHeader
        icon={HiDocumentReport}
        title={meta?.name ?? 'Report'}
        subtitle={
          meta
            ? [meta.entityName, formatDate(meta.periodEnd)]
                .filter(Boolean)
                .join(' — ')
            : undefined
        }
      />

      {meta?.sourceGraphId && (
        <Card>
          <span className="text-primary-500 flex items-center gap-1 text-sm">
            <HiShare className="h-4 w-4 shrink-0" />
            Shared report
            {meta.entityName ? ` from ${meta.entityName}` : ''}
            {received ? ` — received ${received}` : ''}
          </span>
        </Card>
      )}

      {error && (
        <Alert color="failure" icon={HiExclamationCircle}>
          {error}
        </Alert>
      )}

      {isLoading && (
        <Card>
          <div className="flex items-center justify-center gap-3 py-12">
            <Spinner size="lg" />
            <span className="text-gray-500 dark:text-gray-400">
              Loading report…
            </span>
          </div>
        </Card>
      )}

      {report && (
        <div className="flex flex-col gap-4 lg:flex-row">
          {sections.length > 1 && (
            <aside className="lg:w-64 lg:shrink-0">
              <nav className="flex flex-col gap-1 lg:sticky lg:top-4">
                {sections.map((section) => {
                  const active = section.id === selectedSectionId
                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => setSelectedSectionId(section.id)}
                      aria-current={active}
                      className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        active
                          ? 'bg-primary-500 font-medium text-white'
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                      }`}
                    >
                      {section.title}
                    </button>
                  )
                })}
              </nav>
            </aside>
          )}
          <div className="rs-report-scope min-w-0 flex-1">
            {activeSlice && <ReportView report={activeSlice} />}
          </div>
        </div>
      )}
    </PageLayout>
  )
}
