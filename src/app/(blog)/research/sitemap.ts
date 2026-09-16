import { getCompanyIndex } from '@/lib/filings/catalog'
import { cohortsOf, pageLastModified } from '@/lib/filings/cohorts'
import { getAllCoverage } from '@/lib/research'
import {
  RESEARCH_COHORT_SIZE,
  RESEARCH_IS_CANONICAL_HERE,
  RESEARCH_RELEASED_COHORTS,
  SELF_ORIGIN,
} from '@/lib/research-site'
import type { MetadataRoute } from 'next'

// One sitemap file per released cohort of generated filer pages, at
// /research/sitemap/{n}.xml, so Search Console reports indexing per cohort and
// the stop rule can be read off it. The hand-made coverage stays in the main
// /sitemap.xml. How many cohorts exist is RESEARCH_RELEASED_COHORTS
// (src/lib/research-site.ts); at zero this route generates nothing.
//
// An hour, like the pages: the corpus index is a few megabytes, past Next's
// data-cache cap, so this window is what keeps it from being fetched per request.
export const revalidate = 3600

export async function generateSitemaps(): Promise<{ id: number }[]> {
  if (!RESEARCH_IS_CANONICAL_HERE) return []
  return Array.from({ length: RESEARCH_RELEASED_COHORTS }, (_, i) => ({
    id: i + 1,
  }))
}

export default async function sitemap(props: {
  id: Promise<string>
}): Promise<MetadataRoute.Sitemap> {
  const id = Number(await props.id)
  if (
    !RESEARCH_IS_CANONICAL_HERE ||
    !Number.isInteger(id) ||
    id < 1 ||
    id > RESEARCH_RELEASED_COHORTS
  ) {
    return []
  }
  const [index, coverage] = await Promise.all([
    getCompanyIndex(revalidate).catch(() => null),
    getAllCoverage(revalidate).catch(() => []),
  ])
  const covered = new Set(coverage.map((c) => c.ticker.toUpperCase()))
  const cohorts = cohortsOf(
    index?.companies ?? [],
    covered,
    RESEARCH_COHORT_SIZE
  )
  return (cohorts[id - 1] ?? []).map((row) => ({
    url: `${SELF_ORIGIN}/research/${row.ticker.toLowerCase()}`,
    lastModified: pageLastModified(row),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))
}
