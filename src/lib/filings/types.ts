// The filer catalog the SEC pipeline writes to the public data CDN
// (robosystems: adapters/sec/pipeline/catalog.py). One file per filer at
// `companies/{ticker}.json`, the corpus at `companies/index.json`; each filing
// lists its public representations as written by the processor's manifest.
// The catalog is a fold over the pipeline's own tables, regenerated whole on
// every run — there is no database behind these pages.

export interface Representation {
  /** `holon` (dataset-form JSON-LD), `tavi` (Project Tavi compiled model), `document` (as filed). */
  kind: 'holon' | 'tavi' | 'document' | string
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
  /** The filing's folder on the CDN, or null when its artifacts are not written yet. */
  folder: string | null
  representations: Representation[]
  /** Holon viewer links per openable representation (`holon`, `tavi`). */
  viewer: Record<string, string>
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
  /** Newest first. */
  filings: CatalogFiling[]
  /** The latest filing per form that has representations to open. */
  latest: Record<string, string>
}

export interface IndexRow {
  ticker: string
  cik: string
  name: string
  exchange: string | null
  sic_description: string | null
  filings: number
  latest: {
    accession: string
    form: string
    filing_date: string | null
    report_date: string | null
    fiscal_year: number | null
    fiscal_period: string | null
  }
}

export interface CompanyIndex {
  version: number
  generated_at: string
  source: string
  count: number
  companies: IndexRow[]
}
