'use client'
import { LoadingState, PageHeader, PageLayout } from '@robosystems/core'
import {
  CoverageGrid,
  getAllCoverage,
  type CoverageItem,
} from '@robosystems/core/research'
import { useEffect, useState } from 'react'
import { HiDocumentText } from 'react-icons/hi'

export default function ResearchContent() {
  const [items, setItems] = useState<CoverageItem[] | null>(null)

  useEffect(() => {
    getAllCoverage()
      .then(setItems)
      .catch(() => setItems([]))
  }, [])

  return (
    <PageLayout>
      <PageHeader
        icon={HiDocumentText}
        title="Research"
        subtitle="Equity research from the filings — every figure traceable to a source."
      />
      {items === null ? (
        <LoadingState message="Loading research…" />
      ) : (
        <CoverageGrid items={items} />
      )}
    </PageLayout>
  )
}
