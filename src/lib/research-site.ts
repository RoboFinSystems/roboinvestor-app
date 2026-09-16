// Which site owns the public research pages. roboinvestor.ai does, since 2026-09-02:
// robosystems.ai redirects /research and /research/:ticker here (site-content-surfaces).
// The seam stays because everything that depends on ownership keys off this one value:
// the canonical tags, whether the JSON-LD renders, and whether the sitemap lists the
// pages. Point RESEARCH_CANONICAL_ORIGIN at another origin and these pages become a
// mirror of it, with no other edit.

export const SELF_ORIGIN = 'https://roboinvestor.ai'

export const RESEARCH_CANONICAL_ORIGIN: string = SELF_ORIGIN

export const RESEARCH_IS_CANONICAL_HERE =
  RESEARCH_CANONICAL_ORIGIN === SELF_ORIGIN

/**
 * The release switch for the generated filer pages (specs/roboinvestor/sec-public-surface.md
 * §5). Every listed filer has a page at /research/{ticker}, reachable by URL; how many of
 * them the sitemaps list is decided here, in cohorts of RESEARCH_COHORT_SIZE, each cohort
 * its own sitemap file at /research/sitemap/{n}.xml so Search Console reports indexing per
 * cohort. At 0 nothing generated is listed and the sitemaps are exactly the hand-made
 * coverage. Bump it by one per Search Console read while the stop rule holds — if
 * "Discovered, currently not indexed" grows faster than "Indexed" for two weeks, hold.
 * A bump is a PR on purpose: the release of each cohort is a reviewable act.
 */
export const RESEARCH_RELEASED_COHORTS = 0

/** Filers per cohort sitemap. */
export const RESEARCH_COHORT_SIZE = 50

/** The cohort sitemap URLs currently released, for robots.txt. */
export function releasedCohortSitemaps(): string[] {
  return Array.from(
    { length: RESEARCH_RELEASED_COHORTS },
    (_, i) => `${RESEARCH_CANONICAL_ORIGIN}/research/sitemap/${i + 1}.xml`
  )
}

/** Canonical URL for the research index (no argument) or one ticker page. */
export function researchCanonical(ticker?: string): string {
  return ticker
    ? `${RESEARCH_CANONICAL_ORIGIN}/research/${ticker.toLowerCase()}`
    : `${RESEARCH_CANONICAL_ORIGIN}/research`
}
