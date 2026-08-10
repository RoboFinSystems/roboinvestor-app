'use client'

/**
 * Reports a portfolio company has sent to this fund.
 *
 * A cross-graph share copies the issuer's published report into the
 * recipient's own tenant schema, so these are ordinary reads against the
 * fund's graph — no repository, and no RoboLedger. A report the fund did not
 * author is exactly the one with a `sourceGraphId`, which is why that field
 * drives both the filter and the provenance line.
 */

import type { ReportListItem } from '@robosystems/client/clients'
import {
  clients,
  EmptyState,
  GraphFilters,
  LoadingState,
  PageHeader,
  PageLayout,
  useGraphContext,
} from '@robosystems/core'
import {
  Alert,
  Badge,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from 'flowbite-react'
import Link from 'next/link'
import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import {
  HiDocumentReport,
  HiExclamationCircle,
  HiEye,
  HiShare,
} from 'react-icons/hi'

const formatDate = (value: string | null | undefined): string => {
  if (!value) return '—'
  const date = new Date(value.includes('T') ? value : `${value}T00:00:00`)
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
}

const formatPeriod = (report: ReportListItem): string => {
  const start = report.periodStart ? formatDate(report.periodStart) : null
  const end = report.periodEnd ? formatDate(report.periodEnd) : null
  if (start && end) return `${start} — ${end}`
  return end ?? start ?? '—'
}

const ReceivedReportsContent: FC = function () {
  const { state: graphState } = useGraphContext()
  const [reports, setReports] = useState<ReportListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const currentGraph = useMemo(() => {
    const investorGraphs = graphState.graphs.filter(GraphFilters.roboinvestor)
    return (
      investorGraphs.find((g) => g.graphId === graphState.currentGraphId) ??
      investorGraphs[0]
    )
  }, [graphState.graphs, graphState.currentGraphId])

  useEffect(() => {
    if (!currentGraph) {
      setReports([])
      setIsLoading(false)
      return
    }

    let cancelled = false
    const load = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const list = await clients.ledger.listReports(currentGraph.graphId)
        if (cancelled) return

        // Only what someone sent us. A report this graph authored has a null
        // `sourceGraphId`, and authoring is not a RoboInvestor capability.
        const received = (list ?? [])
          .filter((r) => !!r.sourceGraphId)
          .sort(
            (a, b) =>
              new Date(b.sharedAt ?? b.createdAt).getTime() -
              new Date(a.sharedAt ?? a.createdAt).getTime()
          )

        setReports(received)
      } catch (err) {
        if (cancelled) return
        console.error('Error loading received reports:', err)
        setError('Failed to load reports. Please try again.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [currentGraph])

  if (isLoading) {
    return (
      <PageLayout>
        <PageHeader
          icon={HiDocumentReport}
          title="Reports"
          subtitle="Financial reports shared with this fund by its portfolio companies."
        />
        <LoadingState />
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <PageHeader
        icon={HiDocumentReport}
        title="Reports"
        subtitle="Financial reports shared with this fund by its portfolio companies."
      />

      {error && (
        <Alert color="failure" icon={HiExclamationCircle}>
          {error}
        </Alert>
      )}

      {!error && reports.length === 0 && (
        <EmptyState
          icon={HiDocumentReport}
          title="No reports received yet"
          description={
            'When a portfolio company publishes a report to a distribution ' +
            'list that includes this fund, it appears here.'
          }
        />
      )}

      {reports.length > 0 && (
        <Card>
          <div className="overflow-x-auto">
            <Table hoverable>
              <TableHead>
                <TableRow>
                  <TableHeadCell>Report</TableHeadCell>
                  <TableHeadCell>From</TableHeadCell>
                  <TableHeadCell>Period</TableHeadCell>
                  <TableHeadCell>Received</TableHeadCell>
                  <TableHeadCell>
                    <span className="sr-only">View</span>
                  </TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y">
                {reports.map((report) => (
                  <TableRow
                    key={report.id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                      {report.name}
                    </TableCell>
                    <TableCell>
                      <span className="text-primary-500 flex items-center gap-1">
                        <HiShare className="h-4 w-4 shrink-0" />
                        {report.entityName ?? 'Portfolio company'}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatPeriod(report)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(report.sharedAt)}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/reports/${report.id}`}
                        className="text-primary-500 hover:text-primary-400 inline-flex items-center gap-1 font-medium"
                      >
                        <HiEye className="h-4 w-4" />
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {!currentGraph && !isLoading && (
        <Badge color="gray">No investor graph selected.</Badge>
      )}
    </PageLayout>
  )
}

export default ReceivedReportsContent
