import { CompareYourCompany } from '@/components/research/CompareYourCompany'
import { ResearchArticle } from '@/components/research/ResearchArticle'
import { ResearchTopBar } from '@/components/research/ResearchTopBar'
import {
  archivedVersion,
  fetchBrief,
  getAllCoverage,
  getCoverage,
  versionSlug,
} from '@/lib/research'
import { researchCanonical, SELF_ORIGIN } from '@/lib/research-site'
import { orBuildFallback } from '@robosystems/core/docs/catalog'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'
import { descriptionOf } from '../page'

// An earlier report of a company's coverage, rendered as its own page. When a company is
// covered again its ticker page takes the new report; this is where the one before it
// stays readable, at /research/{ticker}/{version}. It is the report alone: the financial
// statements on the ticker page are the latest filing's and would not match it.
//
// An hour, like the ticker page, and every read below is passed the window explicitly for
// the reason given there. An archived report does not change, but the catalog that says
// which versions are archived does.
export const revalidate = 3600

type Params = Promise<{ ticker: string; version: string }>

export async function generateStaticParams() {
  const items = await getAllCoverage(revalidate).catch(() => [])
  return items.flatMap((item) =>
    (item.history ?? []).map((h) => ({
      ticker: item.ticker.toLowerCase(),
      version: versionSlug(h.version),
    }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const { ticker, version } = await params
  const latest = await orBuildFallback(getCoverage(ticker, revalidate), null)
  const item = latest && archivedVersion(latest, version.toLowerCase())
  if (!item) return { title: 'Research | RoboInvestor' }
  const canonical = researchCanonical(ticker, version)
  const image = item.assets.thumbnail
  return {
    title: `${item.title} | RoboInvestor Research`,
    description: item.summary ? descriptionOf(item.summary) : undefined,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      url: `${SELF_ORIGIN}/research/${ticker.toLowerCase()}/${version.toLowerCase()}`,
      title: item.title,
      description: item.summary.slice(0, 200) || undefined,
      images: image
        ? [{ url: image, width: 1920, height: 1080, alt: item.title }]
        : undefined,
      publishedTime: item.date || undefined,
    },
  }
}

export default async function ResearchVersionPage({
  params,
}: {
  params: Params
}) {
  const { ticker, version } = await params
  const slug = version.toLowerCase()
  const latest = await orBuildFallback(getCoverage(ticker, revalidate), null)
  if (!latest) notFound()
  // The current version has no archive page: it is the ticker page.
  if (versionSlug(latest.version) === slug) {
    permanentRedirect(`/research/${ticker.toLowerCase()}`)
  }
  const item = archivedVersion(latest, slug)
  if (!item) notFound()

  const briefMarkdown = item.assets.brief
    ? await orBuildFallback(fetchBrief(item.assets.brief, revalidate), '')
    : ''
  // A version with no brief to render has no page; its video and audio stay linked
  // from the coverage history.
  if (!briefMarkdown) notFound()

  const latestHref = `/research/${ticker.toLowerCase()}`
  return (
    <div className="dark min-h-screen bg-black text-gray-100">
      <div className="mx-auto max-w-7xl px-4 pt-6 pb-12 sm:px-6 lg:px-8">
        <ResearchTopBar />
        <Link
          href={latestHref}
          className="text-primary-400 mt-10 mb-8 inline-flex items-center gap-1 text-sm hover:underline"
        >
          ← {latest.company} research
        </Link>
        <p className="mx-auto mb-8 max-w-3xl rounded-lg border border-gray-800 bg-white/5 p-4 text-sm text-gray-300">
          This is an earlier report
          {item.date ? `, published ${item.date.slice(0, 10)}` : ''}. Its
          figures are as of that filing.{' '}
          <Link
            href={latestHref}
            className="text-primary-400 font-medium hover:underline"
          >
            Read the latest {latest.ticker} report
          </Link>
          .
        </p>
        <ResearchArticle item={item} briefMarkdown={briefMarkdown} />
        <CompareYourCompany company={item.company} ticker={item.ticker} />
      </div>
    </div>
  )
}
