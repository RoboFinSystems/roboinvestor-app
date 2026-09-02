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

/** Canonical URL for the research index (no argument) or one ticker page. */
export function researchCanonical(ticker?: string): string {
  return ticker
    ? `${RESEARCH_CANONICAL_ORIGIN}/research/${ticker.toLowerCase()}`
    : `${RESEARCH_CANONICAL_ORIGIN}/research`
}
