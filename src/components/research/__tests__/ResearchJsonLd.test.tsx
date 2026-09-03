import type { CoverageItem } from '@robosystems/core/research'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ResearchJsonLd, schemaDateTime } from '../ResearchJsonLd'

// Search Console (2026-09-03) flagged the research pages' VideoObject: a date-only
// `uploadDate` is reported as an invalid datetime with no timezone. Every date field
// in the JSON-LD must be a full ISO datetime carrying a timezone.

const item: CoverageItem = {
  ticker: 'TRLV',
  company: 'Trilogy Ventures',
  title: 'Trilogy Ventures, from the filings',
  summary: 'A public company, one report.',
  tags: ['10-K'],
  date: '2026-06-22',
  version: '2026Q2',
  youtube_url: 'https://youtu.be/TiGEZGb0lpU',
  assets: {
    thumbnail: 'https://assets.robosystems.ai/content/TRLV/TRLV_thumb.jpg',
    podcast_mp3: 'https://assets.robosystems.ai/content/TRLV/TRLV_podcast.mp3',
  },
} as CoverageItem

function jsonLdBlocks(markup: string): Record<string, unknown>[] {
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
  return Array.from(markup.matchAll(re), (m) => JSON.parse(m[1]))
}

describe('schemaDateTime', () => {
  it('pins a date-only value to midnight UTC', () => {
    expect(schemaDateTime('2026-06-22')).toBe('2026-06-22T00:00:00Z')
  })
  it('marks a timezone-less datetime as UTC', () => {
    expect(schemaDateTime('2026-06-22T14:05:00')).toBe('2026-06-22T14:05:00Z')
    expect(schemaDateTime('2026-06-22T14:05')).toBe('2026-06-22T14:05Z')
  })
  it('passes a datetime that already carries an offset through', () => {
    expect(schemaDateTime('2026-06-22T14:05:00-05:00')).toBe(
      '2026-06-22T14:05:00-05:00'
    )
    expect(schemaDateTime('2026-06-22T14:05:00Z')).toBe('2026-06-22T14:05:00Z')
  })
  it('leaves an absent date absent', () => {
    expect(schemaDateTime(undefined)).toBeUndefined()
    expect(schemaDateTime('')).toBeUndefined()
  })
})

describe('ResearchJsonLd', () => {
  const blocks = jsonLdBlocks(
    renderToStaticMarkup(<ResearchJsonLd item={item} />)
  )
  const byType = Object.fromEntries(blocks.map((b) => [b['@type'], b]))

  it('emits every date as a full datetime with a timezone', () => {
    const tz = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/
    expect(byType.VideoObject.uploadDate).toMatch(tz)
    expect(byType.Article.datePublished).toMatch(tz)
    expect(byType.Article.dateModified).toMatch(tz)
    expect(byType.PodcastEpisode.datePublished).toMatch(tz)
  })

  it('keeps the catalog date as the published day', () => {
    expect(byType.VideoObject.uploadDate).toBe('2026-06-22T00:00:00Z')
    expect(byType.Article.datePublished).toBe('2026-06-22T00:00:00Z')
  })

  it('never emits a bare date anywhere in the markup', () => {
    for (const block of blocks) {
      for (const [key, value] of Object.entries(block)) {
        if (/date/i.test(key)) expect(value).not.toMatch(/^\d{4}-\d{2}-\d{2}$/)
      }
    }
  })
})
