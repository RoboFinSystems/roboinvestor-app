// Shared types for the equity-research catalog produced by robosystems-content-machine
// (s3://robosystems-marketing-assets/content/index.json). The company is the durable
// entity; each run is a dated quarterly report version (latest + history[]).

export interface CoverageAssets {
  video?: string
  short?: string
  podcast_mp3?: string
  podcast_mp4?: string
  brief?: string
  thumbnail?: string
}

export interface CoverageVersion {
  version: string // e.g. "2026-Q1"
  date?: string // ISO date the report was published
  title?: string
  legacy_ticker?: string // e.g. TCNNF for Trulieve before the NYSE uplisting
  assets: CoverageAssets
}

export interface CoverageItem {
  ticker: string
  company: string
  title: string
  summary: string
  tags: string[]
  campaign?: string | null
  campaign_slug?: string | null
  coverage_label?: string | null
  date: string // ISO date of the latest version
  version: string // e.g. "2026-Q2"
  assets: CoverageAssets
  history: CoverageVersion[]
}

export interface Catalog {
  generated: string
  count: number
  items: CoverageItem[]
}
