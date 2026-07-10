/**
 * SEC repository data access — session-authenticated.
 *
 * Unlike the standalone holon-viewer (which is static-hosted and asks the visitor
 * for an API key), this runs inside the authenticated app: the `@robosystems/client`
 * default client is already configured with the user's session (see
 * `auth-core/client.ts`), so every read here rides that session automatically —
 * no API key, no per-call auth wiring.
 *
 * Everything is keyed off the caller-supplied `graphId` (the selected shared
 * repository, e.g. `"sec"`) rather than a hardcoded graph, so the same viewer works
 * for any SEC-schema repository. This module owns the navigation Cypher (company
 * search, filing listing, entity lookup); the section-by-section report
 * reconstruction lives in `@robosystems/report-components`, which we feed through
 * the `SecQuery` closure returned by `makeSecQuery`.
 *
 * The navigation query bodies mirror the ones verified against the live SEC graph
 * in the report-components SEC adapter: anchor on an indexed key, keep a
 * `WHERE ... IS NOT NULL` predicate, and always `LIMIT` — those keep the planner on
 * the fast path.
 */
import { executeCypher } from '@robosystems/client'
import type { SecQuery } from '@robosystems/report-components'

/** A public company in the SEC repository. `cik` is its stable primary identifier. */
export interface SecEntity {
  ticker: string | null
  name: string
  cik: string
}

/** One filing (a `Report`) belonging to a company, newest first when listed. */
export interface SecFiling {
  reportId: string
  form: string
  reportDate: string | null
  filingDate: string | null
  accession: string | null
  fiscalYear: number | null
  fiscalPeriod: string | null
}

function describeError(error: unknown): string {
  if (typeof error === 'string') return error
  if (error && typeof error === 'object') {
    const e = error as Record<string, unknown>
    if (typeof e.detail === 'string') return e.detail
    if (typeof e.message === 'string') return e.message
    if (typeof e.error === 'string') return e.error
  }
  return 'Request failed'
}

/**
 * A `SecQuery` bound to one repository graph. This is the transport the
 * report-components SEC adapter (`fetchSecReportShell` / `fetchSecSection`) runs
 * its reconstruction through, and also what the navigation helpers below use.
 *
 * `mode: 'sync'` forces a plain JSON response (not SSE) — we want the rows in hand
 * for the row → model mapping, not a stream.
 */
export function makeSecQuery(graphId: string): SecQuery {
  return async (cypher, params) => {
    const res = await executeCypher({
      path: { graph_id: graphId },
      body: {
        query: cypher,
        parameters: (params as Record<string, unknown> | undefined) ?? null,
      },
      query: { mode: 'sync' },
    })
    if (res.error) throw new Error(describeError(res.error))
    const body = res.data as
      | { data?: unknown[]; error?: string | null }
      | undefined
    if (body?.error) throw new Error(body.error)
    return (body?.data as Array<Record<string, unknown>>) ?? []
  }
}

// Ticker prefix (upper-cased) OR company-name substring (lower-cased). Capped and
// ordered so the dropdown stays small and stable.
const SEARCH_Q = `
MATCH (e:Entity)
WHERE e.ticker STARTS WITH $ticker OR toLower(e.name) CONTAINS $name
RETURN e.ticker AS ticker, e.name AS name, e.cik AS cik
ORDER BY e.ticker
LIMIT 20`

export async function searchEntities(
  graphId: string,
  term: string
): Promise<SecEntity[]> {
  const q = term.trim()
  if (!q) return []
  const query = makeSecQuery(graphId)
  const rows = await query(SEARCH_Q, {
    ticker: q.toUpperCase(),
    name: q.toLowerCase(),
  })
  return rows
    .map((r) => ({
      ticker: (r.ticker as string | null) ?? null,
      name: (r.name as string) ?? '',
      cik: (r.cik as string) ?? '',
    }))
    .filter((e) => e.cik)
}

// A single company by its CIK — the URL's entity id resolves back to a name/ticker
// on a fresh (deep-linked) load. Same indexed `{cik}` anchor as the listing.
const ENTITY_Q = `
MATCH (e:Entity {cik: $cik})
RETURN e.ticker AS ticker, e.name AS name, e.cik AS cik
LIMIT 1`

export async function getEntityByCik(
  graphId: string,
  cik: string
): Promise<SecEntity | null> {
  const rows = await makeSecQuery(graphId)(ENTITY_Q, { cik })
  const r = rows[0]
  if (!r || !r.cik) return null
  return {
    ticker: (r.ticker as string | null) ?? null,
    name: (r.name as string) ?? '',
    cik: r.cik as string,
  }
}

// Anchored on the entity (cik); the report fan-out is small, so this is fast.
const REPORTS_Q = `
MATCH (e:Entity {cik: $cik})-[:ENTITY_HAS_REPORT]->(r:Report)
RETURN r.identifier AS report_id, r.form AS form, r.report_date AS report_date,
       r.filing_date AS filing_date, r.accession_number AS accession,
       r.fiscal_year_focus AS fy, r.fiscal_period_focus AS fp
ORDER BY r.filing_date DESC
LIMIT 100`

export async function listReports(
  graphId: string,
  cik: string
): Promise<SecFiling[]> {
  const rows = await makeSecQuery(graphId)(REPORTS_Q, { cik })
  return rows
    .map((r) => ({
      reportId: (r.report_id as string) ?? '',
      form: (r.form as string) ?? '',
      reportDate: (r.report_date as string | null) ?? null,
      filingDate: (r.filing_date as string | null) ?? null,
      accession: (r.accession as string | null) ?? null,
      fiscalYear: (r.fy as number | null) ?? null,
      fiscalPeriod: (r.fp as string | null) ?? null,
    }))
    .filter((f) => f.reportId)
}
