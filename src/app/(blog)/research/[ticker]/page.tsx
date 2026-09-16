import { CompanyPage } from '@/components/filings/CompanyPage'
import { FilingsJsonLd } from '@/components/filings/FilingsJsonLd'
import { CompareYourCompany } from '@/components/research/CompareYourCompany'
import { ResearchArticle } from '@/components/research/ResearchArticle'
import { ResearchJsonLd } from '@/components/research/ResearchJsonLd'
import { ResearchTopBar } from '@/components/research/ResearchTopBar'
import { getCompany, primaryFiling, reportUrl } from '@/lib/filings/catalog'
import { loadPrimaryStatements } from '@/lib/filings/statements'
import { fetchBrief, getCoverage, getCoverageTickers } from '@/lib/research'
import {
  RESEARCH_IS_CANONICAL_HERE,
  SELF_ORIGIN,
  researchCanonical,
} from '@/lib/research-site'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// An hour, where this was five minutes. A filer page regenerates by fetching and parsing
// a multi-MB Tavi or holon, and this route will serve one page per SEC filer, so a
// five-minute window means the corpus re-does that work on a timer, per App Runner
// instance, for as long as a crawler is walking it.
//
// An hour, and not the day the cost argument would justify, because the pages that carry
// traffic today are the hand-made coverage reports and they have no other way to refresh:
// a longer window would delay a published report by that much. The day becomes right once
// the corpus is actually published and a publish can announce itself, rather than the page
// waiting out a clock.
export const revalidate = 3600

// Next takes the *lowest* revalidate across a route's fetches as the route's own, so every
// catalog read below is passed this window explicitly. A default left at minutes on any one
// of them would re-pin the whole page to minutes and undo the line above.

/** A meta description within the length a result snippet shows, cut at a word, never mid-word. */
export function descriptionOf(text: string, max = 160): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max + 1)
  const at = cut.lastIndexOf(' ')
  return (at > 0 ? cut.slice(0, at) : cut.slice(0, max)).replace(
    /[\s,;:]+$/,
    ''
  )
}

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
  const [item, company] = await Promise.all([
    getCoverage(ticker, revalidate).catch(() => null),
    getCompany(ticker, revalidate).catch(() => null),
  ])
  const url = `${SELF_ORIGIN}/research/${ticker.toLowerCase()}`
  if (!item) {
    // A filer with no hand-made coverage: the page is its financial statements.
    if (!company) return { title: 'Research | RoboInvestor' }
    const latest = primaryFiling(company)
    const period =
      latest?.fiscal_period && latest?.fiscal_year
        ? ` ${latest.fiscal_period} ${latest.fiscal_year}`
        : ''
    const title = `${company.name} (${company.ticker}) financial statements${period}`
    const source = latest ? ` from its ${latest.form} for${period}` : ''
    return {
      title: `${title} | RoboInvestor`,
      description: descriptionOf(
        `${company.name} (${company.ticker}) financial statements${source}: balance sheet, income statement and cash flows, every figure traced to the SEC XBRL filing.`
      ),
      alternates: { canonical: researchCanonical(ticker) },
      openGraph: { type: 'article', url, title },
      // The quality floor: a page with nothing to render is a filings list, not
      // a page worth indexing. Crawlable, so its links still count; not indexed.
      robots: latest ? undefined : { index: false, follow: true },
    }
  }
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
    description: descriptionOf(seo.seo_description || item.summary),
    // The canonical names the owner of these pages (src/lib/research-site.ts); og:url is
    // always this page so a share from roboinvestor.ai lands on roboinvestor.ai.
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
  const [item, company] = await Promise.all([
    getCoverage(ticker, revalidate).catch(() => null),
    getCompany(ticker, revalidate).catch(() => null),
  ])
  if (!item && !company) notFound()

  const briefMarkdown = item?.assets.brief
    ? await fetchBrief(item.assets.brief, revalidate).catch(() => '')
    : ''

  // A filer in the catalog gets the company page: the facts are the page and
  // the research, where it exists, is the layer on top. Rendering the
  // statements needs the filing's Tavi model or holon; a filer whose artifacts
  // are not written yet still gets the page, with the filings listed.
  if (company) {
    const filing = primaryFiling(company)
    const url = filing ? reportUrl(filing) : null
    const statements = url
      ? await loadPrimaryStatements(url, filing?.form).catch((e) => {
          console.error(`Statements failed for ${company.ticker}: ${e}`)
          return null
        })
      : null
    return (
      <div className="dark min-h-screen bg-black text-gray-100">
        {RESEARCH_IS_CANONICAL_HERE && <FilingsJsonLd company={company} />}
        {RESEARCH_IS_CANONICAL_HERE && item && <ResearchJsonLd item={item} />}
        <div className="mx-auto max-w-7xl px-4 pt-6 pb-12 sm:px-6 lg:px-8">
          <ResearchTopBar />
          <Link
            href="/research"
            className="text-primary-400 mt-10 mb-8 inline-flex items-center gap-1 text-sm hover:underline"
          >
            ← All research
          </Link>
          <CompanyPage
            company={company}
            filing={filing}
            statements={statements}
            coverage={item}
            briefMarkdown={briefMarkdown}
          />
        </div>
      </div>
    )
  }

  // Hand-made coverage for a ticker the filing catalog does not list yet.
  if (!item) notFound()

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
        <CompareYourCompany company={item.company} ticker={item.ticker} />
      </div>
    </div>
  )
}
