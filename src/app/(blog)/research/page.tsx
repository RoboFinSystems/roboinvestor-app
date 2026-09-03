import { CoverageBrowser } from '@/components/research/CoverageBrowser'
import { ResearchListJsonLd } from '@/components/research/ResearchJsonLd'
import { ResearchTopBar } from '@/components/research/ResearchTopBar'
import { getAllCoverage } from '@/lib/research'
import {
  RESEARCH_IS_CANONICAL_HERE,
  SELF_ORIGIN,
  researchCanonical,
} from '@/lib/research-site'
import type { Metadata } from 'next'

const TITLE = 'Research | RoboInvestor'
const DESCRIPTION =
  'Equity research from the filings: one public company per report, every figure traceable to an SEC filing. No price targets.'
const URL = `${SELF_ORIGIN}/research`

export async function generateMetadata(): Promise<Metadata> {
  // Use the newest report's thumbnail as the OG preview when available; otherwise
  // Next falls back to the brand image set in the root layout.
  const items = await getAllCoverage().catch(() => [])
  const image = items.find((i) => i.assets.thumbnail)?.assets.thumbnail
  return {
    title: TITLE,
    description: DESCRIPTION,
    // The canonical names the owner of these pages (src/lib/research-site.ts); og:url is
    // always this page so a share from roboinvestor.ai lands on roboinvestor.ai.
    alternates: { canonical: researchCanonical() },
    openGraph: {
      type: 'website',
      url: URL,
      siteName: 'RoboInvestor',
      title: TITLE,
      description: DESCRIPTION,
      images: image
        ? [{ url: image, width: 1920, height: 1080, alt: TITLE }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: TITLE,
      description: DESCRIPTION,
      images: image ? [image] : undefined,
    },
  }
}

// Short ISR window so catalog/publish/sync-youtube changes show up in minutes, not an hour.
export const revalidate = 300

export default async function ResearchPage() {
  const items = await getAllCoverage().catch(() => [])

  return (
    <div className="dark min-h-screen bg-black">
      {RESEARCH_IS_CANONICAL_HERE && <ResearchListJsonLd items={items} />}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="from-primary-900/20 via-secondary-900/20 to-accent-900/20 absolute inset-0 bg-linear-to-br" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 pt-6 pb-20 sm:px-6 lg:px-8">
          <ResearchTopBar />
          <h1 className="font-heading mt-16 text-center text-5xl font-bold md:text-6xl">
            <span className="from-primary-400 via-secondary-400 to-accent-400 bg-linear-to-r bg-clip-text text-transparent">
              Research
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-gray-300">
            Equity research straight from the filings: one public company per
            report, every figure traceable to an SEC filing. No hype, no price
            targets.
          </p>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <CoverageBrowser items={items} />
      </div>
    </div>
  )
}
