'use client'

import { TickerSearch, type SecEntity } from '@/lib/sec'
import { PageHeader, PageLayout } from '@robosystems/core'
import { useRouter } from 'next/navigation'
import { HiDocumentSearch } from 'react-icons/hi'

export function ReportsSearchContent({ repository }: { repository: string }) {
  const router = useRouter()

  const openEntity = (entity: SecEntity) => {
    router.push(`/repositories/${repository}/reports/${entity.cik}`)
  }

  return (
    <PageLayout>
      <PageHeader
        icon={HiDocumentSearch}
        title="Reports"
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
