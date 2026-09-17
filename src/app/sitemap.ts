import { getAllCoverage } from '@/lib/research'
import { RESEARCH_IS_CANONICAL_HERE, SELF_ORIGIN } from '@/lib/research-site'
import type { MetadataRoute } from 'next'

/**
 * Newest valid date in a list, or none. A `lastmod` is a real date or absent: a date
 * stamped at request time teaches Bing and Google to ignore the field on every entry,
 * including the research pages whose dates are true.
 */
function latestDate(dates: (string | undefined)[]): Date | undefined {
  const ts = dates
    .filter((d): d is string => !!d)
    .map((d) => new Date(d).getTime())
    .filter((n) => !Number.isNaN(n))
  return ts.length ? new Date(Math.max(...ts)) : undefined
}

// RoboInvestor's public surface is the marketing homepage, the research index and one page
// per covered company. The research entries are listed only while these pages are canonical
// here (src/lib/research-site.ts); a mirror is deliberately not submitted.
// Everything else is behind auth in the (app) route group (see robots.ts); /register is
// de-indexed ahead of the centralized-login flip, and /pages/privacy + /pages/terms are
// server redirects to the consolidated RoboSystems legal docs, so they are excluded.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SELF_ORIGIN

  // No lastModified: the homepage changes on deploys, and nothing here knows when.
  const home: MetadataRoute.Sitemap[number] = {
    url: baseUrl,
    changeFrequency: 'weekly',
    priority: 1,
  }

  if (!RESEARCH_IS_CANONICAL_HERE) return [home]

  const coverage = await getAllCoverage().catch(() => [])
  const researchPages = coverage.map((item) => ({
    url: `${baseUrl}/research/${item.ticker.toLowerCase()}`,
    lastModified: item.date ? new Date(item.date) : undefined,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    home,
    {
      url: `${baseUrl}/research`,
      lastModified: latestDate(coverage.map((c) => c.date)),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...researchPages,
  ]
}
