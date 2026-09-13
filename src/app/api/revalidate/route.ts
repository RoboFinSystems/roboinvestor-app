// On-demand ISR invalidation for the public research pages.
//
// The research routes carry a long `revalidate` because the data behind them
// changes on a publish, not on a clock: the content machine writes a report and
// reindexes the coverage catalog, and the SEC pipeline rewrites a filer's
// catalog after a reprocess. Polling for that on a short timer is what costs —
// a filer page regenerates by fetching and parsing a multi-MB Tavi or holon,
// and the corpus is one page per SEC filer. So the producers push here instead.
//
// Called with the shared secret in `Authorization: Bearer …`:
//
//   POST /api/revalidate  {"tickers": ["intu", "avav"]}
//   POST /api/revalidate  {"paths": ["/research"]}
//
// In a route handler `revalidatePath` only *marks* the path — the regeneration
// happens on the next visit — so a bulk call after a corpus run is cheap and
// cannot stampede the origin.
//
// Caveat worth knowing: App Runner keeps the ISR cache on each container's own
// filesystem, so this invalidates the instance that serves the request, not the
// fleet. The route `revalidate` is the backstop that bounds staleness on the
// instances a push misses, and CloudFront caches in front of all of them.

import { revalidatePath } from 'next/cache'
import type { NextRequest } from 'next/server'
import { timingSafeEqual } from 'node:crypto'

/** Bound the work one call can queue; a corpus run batches rather than sends one list. */
const MAX_PATHS = 500

/**
 * What this route is allowed to invalidate: the public research surface, nothing else.
 *
 * Only the two `/research` entries sit behind the CloudFront behavior added with this
 * route; `/` and `/sitemap.xml` are served on the default CachingDisabled behavior, so
 * revalidating those clears the App Runner ISR cache and nothing at the edge.
 */
const ALWAYS_ALLOWED = new Set(['/', '/research', '/sitemap.xml'])

const RESEARCH_PREFIX = '/research/'

/** A route segment that is a plausible ticker — the same shape the catalog accepts. */
const TICKER = /^[a-z0-9.-]{1,10}$/

/**
 * The path this route will revalidate for one input, or null when the input is not part
 * of the public research surface.
 *
 * A ticker segment is lower-cased rather than merely accepted. `revalidatePath` is
 * case-sensitive and the pages are prerendered under a lowercase segment, so passing
 * `/research/AVAV` through verbatim would mark a cache entry that does not exist — a
 * silent no-op, and a worse answer than a rejection. Normalizing here is also what makes
 * a `paths` entry and a `tickers` entry for the same company behave identically.
 */
function canonicalPath(input: string): string | null {
  const path = input.trim()
  if (ALWAYS_ALLOWED.has(path)) return path
  if (!path.startsWith(RESEARCH_PREFIX)) return null
  const ticker = path.slice(RESEARCH_PREFIX.length).toLowerCase()
  return TICKER.test(ticker) ? `${RESEARCH_PREFIX}${ticker}` : null
}

/** Constant-time secret comparison, length difference included. */
function secretMatches(provided: string, expected: string): boolean {
  const a = Buffer.from(provided)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export async function POST(request: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET
  // No secret configured means the route is off, never open: an unset env var
  // must not become an empty password.
  if (!expected) {
    return Response.json(
      { error: 'Revalidation is not configured' },
      { status: 503 }
    )
  }

  const header = request.headers.get('authorization') ?? ''
  const provided = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!provided || !secretMatches(provided, expected)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { paths?: unknown; tickers?: unknown }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const fromTickers = Array.isArray(body.tickers)
    ? body.tickers
        .filter((t): t is string => typeof t === 'string')
        .map((t) => `${RESEARCH_PREFIX}${t.trim()}`)
    : []
  const fromPaths = Array.isArray(body.paths)
    ? body.paths.filter((p): p is string => typeof p === 'string')
    : []

  const requested = [...fromTickers, ...fromPaths]
  if (requested.length === 0) {
    return Response.json(
      { error: 'Provide `tickers` or `paths` to revalidate' },
      { status: 400 }
    )
  }
  if (requested.length > MAX_PATHS) {
    return Response.json(
      { error: `At most ${MAX_PATHS} paths per request` },
      { status: 400 }
    )
  }

  // Deduplicate on the canonical path, not the input, so a ticker and a path naming the
  // same page queue one revalidation. A rejected input is reported as it was sent.
  const revalidated: string[] = []
  const rejected: string[] = []
  const seen = new Set<string>()
  for (const input of requested) {
    const path = canonicalPath(input)
    if (!path) {
      rejected.push(input)
      continue
    }
    if (seen.has(path)) continue
    seen.add(path)
    revalidatePath(path)
    revalidated.push(path)
  }

  return Response.json({ revalidated, rejected })
}
