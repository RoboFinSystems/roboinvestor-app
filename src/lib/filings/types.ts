// The filer catalog the SEC pipeline writes to the public data CDN
// (robosystems: adapters/sec/pipeline/catalog.py). One file per filer at
// `companies/{ticker}.json`, the corpus at `companies/index.json`; each filing
// lists its public representations as written by the processor's manifest.
// The catalog is a fold over the pipeline's own tables, regenerated whole on
// every run — there is no database behind these pages.

export interface Representation {
  /** `holon` (dataset-form JSON-LD), `tavi` (Project Tavi compiled model), `document` (as filed). */
  kind: 'holon' | 'tavi' | 'document'
  name: string
  media_type: string
  bytes: number
  url: string
  /** Tavi only: the draft the document was written against. */
  spec?: string
  /** Tavi only: the gaps sidecar — what the filing carries that the draft cannot hold. */
  gaps?: string
}

export interface CatalogFiling {
  accession: string
  form: string
  filing_date: string | null
  report_date: string | null
  fiscal_year: number | null
  fiscal_period: string | null
  report_id: string | null
  /**
   * The registrant that filed it. On a ticker whose company changed
   * registrant, a predecessor's filings carry the predecessor's CIK; absent
   * on a catalog written before 2026-11-14, where it is the company's own.
   */
  cik?: string
  /** The filing's folder on the CDN, or null when its artifacts are not written yet. */
  folder: string | null
  representations: Representation[]
  /** Holon viewer links per openable representation (`holon`, `tavi`). */
  viewer: Record<string, string>
}

/**
 * One industry a filer is classified in. `id` is the node's slug path
 * (technology/software/application), so its ancestors are its prefixes;
 * `labels` is the same path as a reader names it, root first.
 */
export interface FilerIndustry {
  id: string
  labels: string[]
  primary: boolean
}

export interface CompanyCatalog {
  version: number
  generated_at: string
  source: string
  cik: string
  ticker: string
  name: string
  exchange: string | null
  sic: string | null
  sic_description: string | null
  /**
   * The filer's place in the industry classification, primary first; empty when
   * it is not placed. Written by the catalog since robosystems #2126; optional
   * so an older file still parses.
   */
  industries?: FilerIndustry[]
  /** Newest first. */
  filings: CatalogFiling[]
  /** The latest filing per form that has representations to open. */
  latest: Record<string, string>
  /** Set on a ticker's file once its filer has moved to another ticker. */
  moved_to?: string
  /** The tickers this filer has left. */
  former_tickers?: string[]
  /** The registrants this one succeeded, whose filings `filings` also lists. */
  predecessors?: { cik: string; name: string | null }[]
}

/** An old ticker and the filer that left it. */
export interface TickerAlias {
  cik: string
  ticker: string
  since: string
}

export interface TickerAliases {
  aliases: Record<string, TickerAlias>
}

export interface IndexFiling {
  accession: string
  form: string
  filing_date: string | null
  report_date: string | null
  fiscal_year: number | null
  fiscal_period: string | null
}

export interface IndexRow {
  ticker: string
  cik: string
  name: string
  exchange: string | null
  sic_description: string | null
  /** As on the filer's own file: its industries, primary first. */
  industries?: FilerIndustry[]
  filings: number
  /** The newest filing of any kind — it may have no artifacts yet. */
  latest: IndexFiling
  /**
   * Whether any of the filer's filings has a file a page can render from, and
   * the newest that does — what the page actually shows, so its date is the
   * honest last-modified. Written by the catalog since robosystems #1387;
   * optional so an older index still parses.
   */
  renderable?: boolean
  latest_renderable?: IndexFiling | null
}

export interface CompanyIndex {
  version: number
  generated_at: string
  source: string
  count: number
  companies: IndexRow[]
}
