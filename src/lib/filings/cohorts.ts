import type { IndexRow } from './types'

/**
 * The generated filer pages, grouped into the cohorts the sitemaps release them
 * in (specs/roboinvestor/sec-public-surface.md §5). A cohort holds filers that
 * have a renderable filing and no hand-made coverage — the covered companies
 * are in the main sitemap already — in a stable order, so a cohort's members
 * do not shuffle between reads: the covered companies' industry peers first
 * (same SIC description as a covered filer, the comps a reader of that
 * research would look for next), then everyone else, each group in ticker
 * order. The catalog's first-seen tag is the durable order and can replace
 * this without moving a URL.
 */
export function cohortsOf(
  rows: IndexRow[],
  coveredTickers: Set<string>,
  size: number
): IndexRow[][] {
  const byTicker = (a: IndexRow, b: IndexRow) =>
    a.ticker.localeCompare(b.ticker)
  const coveredIndustries = new Set(
    rows
      .filter((r) => coveredTickers.has(r.ticker.toUpperCase()))
      .map((r) => r.sic_description)
      .filter((s): s is string => !!s)
  )
  const uncovered = rows.filter(
    (r) => r.renderable === true && !coveredTickers.has(r.ticker.toUpperCase())
  )
  const peers = uncovered
    .filter(
      (r) => !!r.sic_description && coveredIndustries.has(r.sic_description)
    )
    .sort(byTicker)
  const rest = uncovered
    .filter(
      (r) => !r.sic_description || !coveredIndustries.has(r.sic_description)
    )
    .sort(byTicker)
  const eligible = [...peers, ...rest]
  const cohorts: IndexRow[][] = []
  for (let i = 0; i < eligible.length; i += size) {
    cohorts.push(eligible.slice(i, i + size))
  }
  return cohorts
}

/** The honest last-modified for a filer's page: the filing it renders, else its newest. */
export function pageLastModified(row: IndexRow): Date | undefined {
  const date = row.latest_renderable?.filing_date ?? row.latest.filing_date
  if (!date) return undefined
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}
