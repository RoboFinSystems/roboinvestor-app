'use client'
import { EmptyState, LoadingState, PageLayout } from '@robosystems/core'
import {
  ResearchArticle,
  fetchBrief,
  getCoverage,
  type CoverageItem,
} from '@robosystems/core/research'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { HiArrowLeft, HiDocumentText } from 'react-icons/hi'

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

  if (item === undefined) {
    return (
      <PageLayout>
        <LoadingState className="min-h-[60vh]" />
      </PageLayout>
    )
  }

  if (item === null) {
    return (
      <PageLayout>
        <EmptyState
          icon={HiDocumentText}
          title="No coverage found"
          description={`We don't have a research report for ${ticker.toUpperCase()} yet.`}
        />
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <Link
        href="/research"
        className="text-primary-600 dark:text-primary-400 inline-flex items-center gap-1 text-sm hover:underline"
      >
        <HiArrowLeft className="h-4 w-4" /> All research
      </Link>
      <ResearchArticle item={item} briefMarkdown={brief} />
    </PageLayout>
  )
}
