'use client'
import {
  ResearchArticle,
  fetchBrief,
  getCoverage,
  type CoverageItem,
} from '@/lib/core/research'
import { Spinner } from '@/lib/core/ui-components'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function ResearchDetailContent({ ticker }: { ticker: string }) {
  const [item, setItem] = useState<CoverageItem | null | undefined>(undefined)
  const [brief, setBrief] = useState('')

  useEffect(() => {
    let active = true
    getCoverage(ticker)
      .then(async (it) => {
        if (!active) return
        setItem(it)
        if (it?.assets.brief) {
          setBrief(await fetchBrief(it.assets.brief).catch(() => ''))
        }
      })
      .catch(() => active && setItem(null))
    return () => {
      active = false
    }
  }, [ticker])

  if (item === undefined) return <Spinner size="xl" fullScreen />
  if (item === null) {
    return (
      <div className="p-8 text-gray-500 dark:text-gray-400">
        No coverage found for {ticker.toUpperCase()}.
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link
        href="/research"
        className="mb-6 inline-block text-sm text-cyan-600 hover:underline dark:text-cyan-400"
      >
        ← All research
      </Link>
      <ResearchArticle item={item} briefMarkdown={brief} />
    </div>
  )
}
