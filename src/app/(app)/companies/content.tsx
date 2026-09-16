'use client'

import { CompanySearch } from '@/components/companies/CompanySearch'
import { researchCanonical } from '@/lib/research-site'
import { PageHeader, PageLayout } from '@robosystems/core'
import { useRouter } from 'next/navigation'
import { HiDocumentText, HiExternalLink } from 'react-icons/hi'

/**
 * Company Research — the authenticated door to every listed filer's filings.
 * Search is the whole page: pick a company and its filings render from the
 * public filing catalog on the CDN. No graph is read, so nothing gates it.
 */
export function CompaniesSearchContent() {
  const router = useRouter()

  return (
    <PageLayout>
      <PageHeader
        icon={HiDocumentText}
        title="Company Research"
        subtitle="Every listed filer's 10-K, 10-Q, 20-F and 40-F since 2024, rendered from the filings themselves. Search a ticker or a company name."
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
        <p className="mt-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Looking for the published research?{' '}
          <a
            href={researchCanonical()}
            target="_blank"
            rel="noreferrer noopener"
            className="text-primary-600 dark:text-primary-400 inline-flex items-center gap-1 hover:underline"
          >
            Public research pages
            <HiExternalLink className="h-4 w-4" />
          </a>
        </p>
      </div>
    </PageLayout>
  )
}
