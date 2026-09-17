// Shared types for the equity-research catalog produced by robosystems-content-machine
// (https://assets.robosystems.ai/content/index.json). The company is the durable
// entity; each run is a dated quarterly report version (latest + history[]).

export interface CoverageAssets {
  video?: string
  short?: string
  brief?: string
  /** The audio article: a single-voice ElevenLabs read of the brief, produced by
   *  `just narrate` and published alongside it. Replaced the Q&A podcast (retired
   *  2026-07-21, its assets deleted 2026-09-05) as the "listen" format. */
  narration?: string
  /** 1920x1080 PNG (~2.5 MB): the social and search image, and the card fallback. */
  thumbnail?: string
  /** Card-sized webps of the thumbnail, 800 and 1200 wide, published beside the PNG by
   *  robosystems-content-machine (`card_thumbnails.py`) so cards load them straight from
   *  the CDN. Absent on items published before 2026-09-17 until the backfill runs. */
  thumbnail_card_800?: string
  thumbnail_card_1200?: string
}

export interface CoverageVersion {
  version: string // e.g. "2026-Q1"
  date?: string // ISO date the report was published
  title?: string
  legacy_ticker?: string // e.g. TCNNF for Trulieve before the NYSE uplisting
  youtube_url?: string // captured by `just sync-youtube` (RSS title-match)
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
  // YouTube URLs captured by `just sync-youtube` — prefer these over the S3 MP4 (free egress).
  youtube_url?: string
  short_youtube_url?: string
  assets: CoverageAssets
  history: CoverageVersion[]
}

export interface Catalog {
  generated: string
  count: number
  items: CoverageItem[]
}
