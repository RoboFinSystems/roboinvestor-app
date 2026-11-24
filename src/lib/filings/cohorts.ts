import type { IndexRow } from './types'

/** How deep two filers must agree to be industry peers: sector/subsector/industry. */
const PEER_DEPTH = 3

/**
 * The groups a filer is compared in: each of its industries, cut at the
 * industry level. A filer the classification has not placed falls back to its
 * SIC description, so an index from before the classification still groups.
 */
export function peerGroups(row: IndexRow): string[] {
  const industries = row.industries ?? []
  if (industries.length > 0) {
    return industries.map((i) => i.id.split('/').slice(0, PEER_DEPTH).join('/'))
  }
  return row.sic_description ? [`sic:${row.sic_description}`] : []
}

/**
 * The generated filer pages, grouped into the cohorts the sitemaps release them
 * in (`RESEARCH_RELEASED_COHORTS` in `lib/research-site.ts`). A cohort holds
 * filers that have a renderable filing and no hand-made coverage — the covered companies
 * are in the main sitemap already — in a stable order, so a cohort's members
 * do not shuffle between reads: the covered companies' industry peers first
 * (in the same industry as a covered filer, the comps a reader of that
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
      .flatMap(peerGroups)
  )
  const isPeer = (r: IndexRow) =>
    peerGroups(r).some((group) => coveredIndustries.has(group))
  const uncovered = rows.filter(
    (r) => r.renderable === true && !coveredTickers.has(r.ticker.toUpperCase())
  )
  const peers = uncovered.filter(isPeer).sort(byTicker)
  const rest = uncovered.filter((r) => !isPeer(r)).sort(byTicker)
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
