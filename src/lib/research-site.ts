// Where the public research pages are canonical. Phase 1 of the site-content-surfaces spec
// mirrors robosystems.ai/research here with every page's canonical pointing at the owner,
// so Google keeps one URL per report while roboinvestor.ai gets the product surface. Phase 2
// (after the 2026-10-02 Search Console read) flips ownership by setting
// RESEARCH_CANONICAL_ORIGIN to SELF_ORIGIN. The canonical tags, the JSON-LD and the sitemap
// all key off that one value, so the flip on this side is this file alone.

export const SELF_ORIGIN = 'https://roboinvestor.ai'

export const RESEARCH_CANONICAL_ORIGIN: string = 'https://robosystems.ai'

export const RESEARCH_IS_CANONICAL_HERE =
  RESEARCH_CANONICAL_ORIGIN === SELF_ORIGIN

/** Canonical URL for the research index (no argument) or one ticker page. */
export function researchCanonical(ticker?: string): string {
  return ticker
    ? `${RESEARCH_CANONICAL_ORIGIN}/research/${ticker.toLowerCase()}`
    : `${RESEARCH_CANONICAL_ORIGIN}/research`
}
