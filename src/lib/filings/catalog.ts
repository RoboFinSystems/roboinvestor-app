// Data access for the filer catalog on the public data CDN. Read server-side
// (ISR) by the public company pages, the same way the research catalog is.
// Everything here is a file on the CDN: the catalog for one filer, the corpus
// index, and the filing's holon. No API, no database.

import type { CatalogFiling, CompanyCatalog, CompanyIndex } from './types'

/** The public data CDN (robosystems' PUBLIC_DATA_CDN_URL). Local: LocalStack. */
export const FILINGS_CDN_URL = (
  process.env.NEXT_PUBLIC_FILINGS_CDN_URL || 'https://public.robosystems.ai'
).replace(/\/$/, '')

/**
 * What a ticker looks like on EDGAR: letters, digits and the `.` / `-` class
 * separators (BRK.B, BF-B), at most ten characters. The route segment is the
 * only input to the catalog URL, so anything else — a path escape, a stray
 * query — is not a filer and never reaches the CDN.
 */
const TICKER = /^[A-Z0-9.-]{1,10}$/i

/** The catalog slug for a ticker, or null when the input is not a ticker. */
export function tickerSlug(ticker: string): string | null {
  const slug = ticker.trim().toLowerCase()
  return TICKER.test(slug) ? slug : null
}

export function companyCatalogUrl(ticker: string): string | null {
  const slug = tickerSlug(ticker)
  return slug ? `${FILINGS_CDN_URL}/companies/${slug}.json` : null
}

export const COMPANY_INDEX_URL = `${FILINGS_CDN_URL}/companies/index.json`

/** One filer's catalog, or null when the CDN has no file for the ticker. */
export async function getCompany(
  ticker: string,
  revalidate = 300
): Promise<CompanyCatalog | null> {
  const url = companyCatalogUrl(ticker)
  if (!url) return null
  const res = await fetch(url, { next: { revalidate } })
  // The CDN answers a missing object with 403 (no list permission), not 404.
  if (res.status === 404 || res.status === 403) return null
  if (!res.ok) throw new Error(`Company catalog fetch failed: ${res.status}`)
  return (await res.json()) as CompanyCatalog
}

/** The corpus index: every listed filer with its latest filing. */
export async function getCompanyIndex(
  revalidate = 300
): Promise<CompanyIndex | null> {
  const res = await fetch(COMPANY_INDEX_URL, { next: { revalidate } })
  if (res.status === 404 || res.status === 403) return null
  if (!res.ok) throw new Error(`Company index fetch failed: ${res.status}`)
  return (await res.json()) as CompanyIndex
}

const FORM_ORDER = ['10-K', '20-F', '40-F', '10-Q']

/** Whether a filing has a representation the page can render from. */
function renderable(filing: CatalogFiling): boolean {
  return filing.representations.some(
    (r) => r.kind === 'tavi' || r.kind === 'holon'
  )
}

/** The filing the page renders: the latest annual with a renderable representation, else the newest with one. */
export function primaryFiling(company: CompanyCatalog): CatalogFiling | null {
  for (const form of FORM_ORDER) {
    const accession = company.latest[form]
    const filing = accession
      ? company.filings.find((f) => f.accession === accession)
      : undefined
    if (filing && renderable(filing)) return filing
  }
  return company.filings.find(renderable) ?? null
}

/**
 * The file the page renders a filing from: the Tavi model when the filing has
 * one (parsed directly, no RDF step), else the holon. Both carry the same
 * facts and render the same statements.
 */
export function reportUrl(filing: CatalogFiling): string | null {
  const reps = filing.representations
  return (
    reps.find((r) => r.kind === 'tavi')?.url ??
    reps.find((r) => r.kind === 'holon')?.url ??
    null
  )
}

/**
 * A filing's report file (Tavi or holon) as text. Fetched with Next's default
 * cache option, so it is read once per page regeneration and never enters the
 * data cache (several megabytes, past its 2 MB cap); the rendered page is what
 * ISR caches. `no-store` would refetch on every request instead.
 */
export async function fetchReportText(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Report fetch failed: ${res.status}`)
  return await res.text()
}
