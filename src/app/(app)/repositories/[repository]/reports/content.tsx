'use client'

import { PageHeader, PageLayout } from '@/lib/core'
import { TickerSearch, type SecEntity } from '@/lib/sec'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { HiArrowLeft, HiDocumentSearch } from 'react-icons/hi'

export function ReportsSearchContent({ repository }: { repository: string }) {
  const router = useRouter()

  const openEntity = (entity: SecEntity) => {
    router.push(`/repositories/${repository}/reports/${entity.cik}`)
  }

  return (
    <PageLayout>
      <Link
        href={`/repositories/${repository}/getting-started`}
        className="text-primary-600 dark:text-primary-400 inline-flex items-center gap-1 text-sm hover:underline"
      >
        <HiArrowLeft className="h-4 w-4" /> {repository.toUpperCase()}{' '}
        repository
      </Link>

      <PageHeader
        icon={HiDocumentSearch}
        title="Financial Statements"
        subtitle="Search a public company to browse its filings and view rendered financial statements."
      />

      <div className="mx-auto w-full max-w-2xl">
        <TickerSearch graphId={repository} onSelect={openEntity} />
        <p className="mt-3 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Start typing a ticker (e.g. NVDA) or a company name.
        </p>
      </div>
    </PageLayout>
  )
}
