import { RESEARCH_IS_CANONICAL_HERE, SELF_ORIGIN } from '@/lib/research-site'
import { getAllCoverage } from '@robosystems/core/research'
import type { MetadataRoute } from 'next'

/** Newest valid date in a list, or `now` when none, so the hub `lastmod` stays honest. */
function latestDate(dates: (string | undefined)[]): Date {
  const ts = dates
    .filter((d): d is string => !!d)
    .map((d) => new Date(d).getTime())
    .filter((n) => !Number.isNaN(n))
  return ts.length ? new Date(Math.max(...ts)) : new Date()
}

// RoboInvestor's public surface is the marketing homepage plus, once these pages are
// canonical here, the research index and one page per covered company. While /research is
// a mirror of robosystems.ai (src/lib/research-site.ts) it is deliberately not submitted.
// Everything else is behind auth in the (app) route group (see robots.ts); /register is
// de-indexed ahead of the centralized-login flip, and /pages/privacy + /pages/terms are
// server redirects to the consolidated RoboSystems legal docs, so they are excluded.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SELF_ORIGIN

  const home: MetadataRoute.Sitemap[number] = {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
  }

  if (!RESEARCH_IS_CANONICAL_HERE) return [home]

  const coverage = await getAllCoverage().catch(() => [])
  const researchPages = coverage.map((item) => ({
    url: `${baseUrl}/research/${item.ticker.toLowerCase()}`,
    lastModified: item.date ? new Date(item.date) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    { ...home, lastModified: latestDate(coverage.map((c) => c.date)) },
    {
      url: `${baseUrl}/research`,
      lastModified: latestDate(coverage.map((c) => c.date)),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...researchPages,
  ]
}
