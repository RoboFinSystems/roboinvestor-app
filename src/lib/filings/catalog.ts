// Data access for the filer catalog on the public data CDN. Read server-side
// (ISR) by the public company pages, the same way the research catalog is.
// Everything here is a file on the CDN: the catalog for one filer, the corpus
// index, and the filing's holon. No API, no database.

import type { CompanyCatalog, CompanyIndex } from './types'

/** The public data CDN (robosystems' PUBLIC_DATA_CDN_URL). Local: LocalStack. */
export const FILINGS_CDN_URL = (
  process.env.NEXT_PUBLIC_FILINGS_CDN_URL || 'https://public.robosystems.ai'
).replace(/\/$/, '')

export function companyCatalogUrl(ticker: string): string {
  return `${FILINGS_CDN_URL}/companies/${ticker.trim().toLowerCase()}.json`
}

export const COMPANY_INDEX_URL = `${FILINGS_CDN_URL}/companies/index.json`

/** One filer's catalog, or null when the CDN has no file for the ticker. */
export async function getCompany(
  ticker: string,
  revalidate = 300
): Promise<CompanyCatalog | null> {
  const res = await fetch(companyCatalogUrl(ticker), { next: { revalidate } })
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

/**
 * A filing's holon as text. Several megabytes, so it is not put in the
 * Next.js data cache (2 MB cap); the rendered page is cached by ISR instead,
 * so this runs once per page regeneration, not per request.
 */
export async function fetchHolonText(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Holon fetch failed: ${res.status}`)
  return await res.text()
}
