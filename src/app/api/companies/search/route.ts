import { COMPANY_INDEX_URL } from '@/lib/filings/catalog'
import { searchIndex } from '@/lib/filings/search'
import type { CompanyIndex, IndexRow } from '@/lib/filings/types'
import type { NextRequest } from 'next/server'

/**
 * Company search for the authenticated research view: `?q=` against the
 * corpus index on the public data CDN, answered from memory.
 *
 * The index is a few megabytes — past Next's data-cache cap — so it is held
 * per server instance and refreshed hourly, the window the company pages
 * regenerate on. A stale or failed refresh keeps serving the last copy. The data is
 * public, so the route needs no session; it sits under `/api/`, which
 * robots.txt already disallows.
 */
const TTL_MS = 60 * 60 * 1000
/** A CDN that stalls rather than errors must not hold searches open. */
const FETCH_TIMEOUT_MS = 10_000
let cached: { at: number; rows: IndexRow[] } | null = null
let inflight: Promise<IndexRow[]> | null = null

function refresh(): Promise<IndexRow[]> {
  if (!inflight) {
    inflight = fetch(COMPANY_INDEX_URL, {
      cache: 'no-store',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })
      .then(async (res) => {
        if (!res.ok)
          throw new Error(`Company index fetch failed: ${res.status}`)
        const body = (await res.json()) as CompanyIndex
        cached = { at: Date.now(), rows: body.companies ?? [] }
        return cached.rows
      })
      .finally(() => {
        inflight = null
      })
  }
  return inflight
}

/**
 * The index, answered from memory whenever a copy exists: an expired copy is
 * served at once while a single background refresh replaces it, so a slow or
 * failing CDN never delays a search that has something to answer with. Only
 * the first load on an instance waits (bounded by the fetch timeout).
 */
async function loadIndex(): Promise<IndexRow[]> {
  if (cached) {
    if (Date.now() - cached.at >= TTL_MS) {
      refresh().catch(() => {
        // Keep serving the last copy; the next expired read retries.
      })
    }
    return cached.rows
  }
  return refresh()
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? ''
  if (!q) return Response.json({ companies: [] })
  try {
    const rows = await loadIndex()
    return Response.json(
      { companies: searchIndex(rows, q) },
      { headers: { 'Cache-Control': 'private, max-age=300' } }
    )
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : 'Company index unavailable' },
      { status: 502 }
    )
  }
}
