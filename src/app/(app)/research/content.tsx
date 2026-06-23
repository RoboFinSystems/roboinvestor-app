'use client'
import {
  CoverageGrid,
  getAllCoverage,
  type CoverageItem,
} from '@/lib/core/research'
import { Spinner } from '@/lib/core/ui-components'
import { useEffect, useState } from 'react'

export default function ResearchContent() {
  const [items, setItems] = useState<CoverageItem[] | null>(null)

  useEffect(() => {
    getAllCoverage()
      .then(setItems)
      .catch(() => setItems([]))
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
        Research
      </h1>
      <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
        Equity research from the filings — one company per report, every figure
        traceable to an SEC filing. Not investment advice.
      </p>
      {items === null ? <Spinner size="xl" /> : <CoverageGrid items={items} />}
    </div>
  )
}
