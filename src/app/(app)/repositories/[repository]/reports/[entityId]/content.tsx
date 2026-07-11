'use client'

import {
  FilingPicker,
  getEntityByCik,
  ReportScreen,
  type SecEntity,
  type SecFiling,
} from '@/lib/sec'
import {
  EmptyState,
  LoadingState,
  PageHeader,
  PageLayout,
} from '@robosystems/core'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { HiArrowLeft, HiOfficeBuilding } from 'react-icons/hi'

interface EntityReportsProps {
  repository: string
  /** The entity id from the URL — a SEC CIK. */
  cik: string
}

const backLinkClass =
  'text-primary-600 dark:text-primary-400 inline-flex items-center gap-1 text-sm hover:underline'

/**
 * A company's filings for the given repository. `?report=<reportId>` selects a
 * filing to render (kept in the URL so it's shareable and survives Back); with no
 * `report` param we show the filing list. `useSearchParams` is read behind a
 * Suspense boundary per Next.js requirements.
 */
export function EntityReportsContent(props: EntityReportsProps) {
  return (
    <Suspense
      fallback={
        <PageLayout>
          <LoadingState className="min-h-[60vh]" />
        </PageLayout>
      }
    >
      <EntityReportsInner {...props} />
    </Suspense>
  )
}

function EntityReportsInner({ repository, cik }: EntityReportsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reportId = searchParams.get('report')

  const [entity, setEntity] = useState<SecEntity | null | undefined>(undefined)

  useEffect(() => {
    let active = true
    setEntity(undefined)
    getEntityByCik(repository, cik)
      .then((e) => active && setEntity(e))
      .catch(() => active && setEntity(null))
    return () => {
      active = false
    }
  }, [repository, cik])

  const reportsBase = `/repositories/${repository}/reports`

  const selectFiling = (f: SecFiling) => {
    router.push(
      `${reportsBase}/${cik}?report=${encodeURIComponent(f.reportId)}`
    )
  }
  const clearFiling = () => router.push(`${reportsBase}/${cik}`)

  if (entity === undefined) {
    return (
      <PageLayout>
        <LoadingState className="min-h-[60vh]" message="Loading company…" />
      </PageLayout>
    )
  }

  if (entity === null) {
    return (
      <PageLayout>
        <Link href={reportsBase} className={backLinkClass}>
          <HiArrowLeft className="h-4 w-4" /> Search companies
        </Link>
        <EmptyState
          icon={HiOfficeBuilding}
          title="Company not found"
          description={`No company with CIK ${cik} in the ${repository.toUpperCase()} repository.`}
        />
      </PageLayout>
    )
  }

  const subtitle = entity.ticker
    ? `${entity.ticker} · CIK ${entity.cik}`
    : `CIK ${entity.cik}`

  return (
    <PageLayout>
      <PageHeader
        icon={HiOfficeBuilding}
        title={entity.name}
        subtitle={subtitle}
        actions={
          reportId ? (
            <button
              type="button"
              onClick={clearFiling}
              className={backLinkClass}
            >
              <HiArrowLeft className="h-4 w-4" /> All filings
            </button>
          ) : (
            <Link href={reportsBase} className={backLinkClass}>
              <HiArrowLeft className="h-4 w-4" /> Search companies
            </Link>
          )
        }
      />

      {reportId ? (
        <ReportScreen graphId={repository} reportId={reportId} />
      ) : (
        <FilingPicker graphId={repository} cik={cik} onSelect={selectFiling} />
      )}
    </PageLayout>
  )
}
