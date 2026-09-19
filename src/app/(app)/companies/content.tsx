'use client'

import { CompanySearch } from '@/components/companies/CompanySearch'
import DocsLink from '@/components/DocsLink'
import { CoverageGrid } from '@/components/research/CoverageGrid'
import { type CoverageItem, getAllCoverage } from '@/lib/research'
import { researchCanonical } from '@/lib/research-site'
import { LoadingState, PageHeader, PageLayout } from '@robosystems/core'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { HiDocumentText, HiExternalLink } from 'react-icons/hi'

/** How many of the newest briefs the lane shows; the public index has them all. */
const LATEST_COUNT = 12

/**
 * Research — the authenticated research lane. Search on top: any listed
 * filer, whose filings render from the public filing catalog on the CDN, no
 * graph needed. Below it, the latest published research from the same
 * catalog the public pages are built from; a card opens the public page,
 * which carries the brief, the video and the filing's statements. Filters
 * and sorts belong here as the catalog grows.
 */
export function CompaniesSearchContent() {
  const router = useRouter()
  // undefined = loading, [] = nothing published (or the catalog unreachable).
  const [latest, setLatest] = useState<CoverageItem[] | undefined>(undefined)

  useEffect(() => {
    let active = true
    getAllCoverage()
      .then((items) => active && setLatest(items.slice(0, LATEST_COUNT)))
      .catch(() => active && setLatest([]))
    return () => {
      active = false
    }
  }, [])

  return (
    <PageLayout>
      <PageHeader
        icon={HiDocumentText}
        title="Research"
        subtitle={
          <>
            Search any listed filer&apos;s 10-K, 10-Q, 20-F or 40-F since 2024,
            rendered from the filing itself, or read the latest published
            research. <DocsLink href="/docs/research-and-sec-filings" />
          </>
        }
      />

      <div className="mx-auto w-full max-w-2xl">
        <CompanySearch
          onSelect={(row) =>
            router.push(`/companies/${row.ticker.toLowerCase()}`)
          }
        />
        <p className="mt-3 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Start typing a ticker (e.g. NVDA) or a company name.
        </p>
      </div>

      <section className="mt-12">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Latest research
          </h2>
          <a
            href={researchCanonical()}
            target="_blank"
            rel="noreferrer noopener"
            className="text-primary-600 dark:text-primary-400 inline-flex items-center gap-1 text-sm hover:underline"
          >
            All research
            <HiExternalLink className="h-4 w-4" />
          </a>
        </div>
        {latest === undefined ? (
          <LoadingState className="min-h-[20vh]" message="Loading research…" />
        ) : (
          <CoverageGrid items={latest} />
        )}
      </section>
    </PageLayout>
  )
}
