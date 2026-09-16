'use client'

import { FilingReader } from '@/components/companies/FilingReader'
import { FilingsBar } from '@/components/companies/FilingsBar'
import { ResearchArticle } from '@/components/research/ResearchArticle'
import { getCompany, primaryFiling, tickerSlug } from '@/lib/filings/catalog'
import type { CompanyCatalog } from '@/lib/filings/types'
import { type CoverageItem, fetchBrief, getCoverage } from '@/lib/research'
import { researchCanonical } from '@/lib/research-site'
import {
  EmptyState,
  LoadingState,
  PageHeader,
  PageLayout,
} from '@robosystems/core'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { HiArrowLeft, HiExternalLink, HiOfficeBuilding } from 'react-icons/hi'

interface CompanyContentProps {
  /** The ticker from the URL. */
  ticker: string
}

const linkClass =
  'text-primary-600 dark:text-primary-400 inline-flex items-center gap-1 text-sm hover:underline'

/**
 * One company's filings, read from the public filing catalog on the CDN.
 * `?filing=<accession>` selects the filing to render (kept in the URL so it is
 * shareable and survives Back); without it the newest statement-bearing
 * filing renders — the same one the public company page leads with.
 * `useSearchParams` is read behind a Suspense boundary per Next's requirements.
 */
export function CompanyContent(props: CompanyContentProps) {
  return (
    <Suspense
      fallback={
        <PageLayout>
          <LoadingState className="min-h-[60vh]" />
        </PageLayout>
      }
    >
      <CompanyInner {...props} />
    </Suspense>
  )
}

function CompanyInner({ ticker }: CompanyContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const accession = searchParams.get('filing')
  const slug = tickerSlug(ticker)

  const [company, setCompany] = useState<CompanyCatalog | null | undefined>(
    undefined
  )

  useEffect(() => {
    let active = true
    setCompany(undefined)
    getCompany(ticker)
      .then((c) => active && setCompany(c))
      .catch(() => active && setCompany(null))
    return () => {
      active = false
    }
  }, [ticker])

  // The published research, where it exists: the brief leads the page, as it
  // does on the public company page, and the filings follow.
  const [coverage, setCoverage] = useState<CoverageItem | null>(null)
  const [brief, setBrief] = useState('')

  useEffect(() => {
    let active = true
    setCoverage(null)
    setBrief('')
    getCoverage(ticker)
      .then((item) => {
        if (!active) return
        setCoverage(item)
        if (item?.assets.brief) {
          fetchBrief(item.assets.brief)
            .then((md) => active && setBrief(md))
            .catch(() => active && setBrief(''))
        }
      })
      .catch(() => active && setCoverage(null))
    return () => {
      active = false
    }
  }, [ticker])

  const filing = useMemo(() => {
    if (!company) return null
    return (
      (accession && company.filings.find((f) => f.accession === accession)) ||
      primaryFiling(company)
    )
  }, [company, accession])

  if (company === undefined) {
    return (
      <PageLayout>
        <LoadingState className="min-h-[60vh]" message="Loading company…" />
      </PageLayout>
    )
  }

  if (company === null) {
    return (
      <PageLayout>
        <Link href="/companies" className={linkClass}>
          <HiArrowLeft className="h-4 w-4" /> Search companies
        </Link>
        <EmptyState
          icon={HiOfficeBuilding}
          title="Company not found"
          description={`No listed filer with the ticker ${ticker.toUpperCase()} in the filing catalog.`}
        />
      </PageLayout>
    )
  }

  const subtitle = [
    company.ticker,
    company.exchange,
    company.sic_description,
    `CIK ${company.cik}`,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <PageLayout>
      <PageHeader
        icon={HiOfficeBuilding}
        title={company.name}
        subtitle={subtitle}
        actions={
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={researchCanonical(company.ticker)}
              target="_blank"
              rel="noreferrer noopener"
              className={linkClass}
              title="This company's public page on roboinvestor.ai"
            >
              Public page <HiExternalLink className="h-4 w-4" />
            </a>
            <Link href="/companies" className={linkClass}>
              <HiArrowLeft className="h-4 w-4" /> Search companies
            </Link>
          </div>
        }
      />

      {coverage ? (
        <section className="mb-12">
          <ResearchArticle item={coverage} briefMarkdown={brief} />
        </section>
      ) : null}

      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
        Filings
      </h2>

      {filing ? (
        <>
          <FilingsBar
            company={company}
            selected={filing}
            onSelect={(f) =>
              router.push(
                `/companies/${slug ?? ticker.toLowerCase()}?filing=${encodeURIComponent(f.accession)}`
              )
            }
          />
          <FilingReader filing={filing} />
        </>
      ) : (
        <EmptyState
          icon={HiOfficeBuilding}
          title="No filing to render yet"
          description="This company's filings are listed in the catalog, but none has its artifacts written yet."
        />
      )}
    </PageLayout>
  )
}
