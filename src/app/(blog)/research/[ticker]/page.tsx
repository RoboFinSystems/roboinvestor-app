import { ResearchJsonLd } from '@/components/research/ResearchJsonLd'
import { ResearchTopBar } from '@/components/research/ResearchTopBar'
import {
  RESEARCH_IS_CANONICAL_HERE,
  SELF_ORIGIN,
  researchCanonical,
} from '@/lib/research-site'
import {
  ResearchArticle,
  fetchBrief,
  getCoverage,
  getCoverageTickers,
} from '@robosystems/core/research'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// Short ISR window so catalog/publish/sync-youtube changes show up in minutes, not an hour.
export const revalidate = 300

export async function generateStaticParams() {
  const tickers = await getCoverageTickers().catch(() => [])
  return tickers.map((t) => ({ ticker: t.toLowerCase() }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ticker: string }>
}): Promise<Metadata> {
  const { ticker } = await params
  const item = await getCoverage(ticker).catch(() => null)
  if (!item) return { title: 'Research | RoboInvestor' }
  const url = `${SELF_ORIGIN}/research/${ticker.toLowerCase()}`
  const image = item.assets.thumbnail // 1920x1080 CDN PNG, the report thumbnail
  // Search vs social split: `title`/`summary` are the editorial copy written for a
  // YouTube thumbnail; the catalog also carries query-shaped seo_* copy for the SERP.
  // Widened locally: @robosystems/core's CoverageItem predates these fields.
  const seo = item as typeof item & {
    seo_title?: string
    seo_description?: string
  }
  return {
    title: `${seo.seo_title || item.title} | RoboInvestor Research`,
    description: (seo.seo_description || item.summary).slice(0, 160),
    // The canonical names the owner of these pages (robosystems.ai until Phase 2); og:url
    // stays this page so a share from roboinvestor.ai lands on roboinvestor.ai.
    alternates: { canonical: researchCanonical(ticker) },
    openGraph: {
      type: 'article',
      url,
      title: item.title,
      description: item.summary.slice(0, 200),
      images: image
        ? [{ url: image, width: 1920, height: 1080, alt: item.title }]
        : undefined,
      publishedTime: item.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: item.title,
      description: item.summary.slice(0, 200),
      images: image ? [image] : undefined,
    },
  }
}

export default async function ResearchTickerPage({
  params,
}: {
  params: Promise<{ ticker: string }>
}) {
  const { ticker } = await params
  const item = await getCoverage(ticker).catch(() => null)
  if (!item) notFound()

  const briefMarkdown = item.assets.brief
    ? await fetchBrief(item.assets.brief).catch(() => '')
    : ''

  return (
    <div className="dark min-h-screen bg-black text-gray-100">
      {RESEARCH_IS_CANONICAL_HERE && <ResearchJsonLd item={item} />}
      <div className="mx-auto max-w-7xl px-4 pt-6 pb-12 sm:px-6 lg:px-8">
        <ResearchTopBar />
        <Link
          href="/research"
          className="text-primary-400 mt-10 mb-8 inline-flex items-center gap-1 text-sm hover:underline"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          All research
        </Link>
        <ResearchArticle item={item} briefMarkdown={briefMarkdown} />
      </div>
    </div>
  )
}
