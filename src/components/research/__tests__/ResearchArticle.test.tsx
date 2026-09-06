import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { CoverageItem } from '@/lib/research/types'
import { ResearchArticle } from '../ResearchArticle'

// The "Listen" slot holds the audio article: a single-voice read of the brief, played
// from the CDN MP3. It replaced the Q&A podcast, whose YouTube uploads were removed
// 2026-09-03 (a ticker page showed YouTube's "Video unavailable" card under "Listen")
// and whose S3 assets were deleted 2026-09-05. Nothing in the Listen slot embeds YouTube.

function makeItem(overrides: Partial<CoverageItem> = {}): CoverageItem {
  return {
    ticker: 'GTBIF',
    company: 'Green Thumb Industries Inc.',
    title: 'Green Thumb coverage update',
    summary: 'Summary text',
    tags: [],
    date: '2026-06-22',
    version: '2026-Q2',
    youtube_url: 'https://youtu.be/F6o_NypHMnU',
    assets: {},
    history: [],
    ...overrides,
  }
}

const NARRATION =
  'https://assets.robosystems.ai/content/GTBIF/GTBIF_narration.mp3'

function iframeSrcs(container: HTMLElement) {
  return Array.from(container.querySelectorAll('iframe'), (f) => f.src)
}

describe('ResearchArticle listen section', () => {
  it('renders no player for coverage with no narration', () => {
    const { container, queryByText } = render(
      <ResearchArticle item={makeItem()} />
    )
    expect(queryByText(/Listen/)).toBeNull()
    expect(container.querySelector('audio')).toBeNull()
    expect(iframeSrcs(container)).toEqual([
      'https://www.youtube.com/embed/F6o_NypHMnU',
    ])
  })

  it('plays the narration from the CDN and adds no second iframe', () => {
    const { container, getByText } = render(
      <ResearchArticle item={makeItem({ assets: { narration: NARRATION } })} />
    )
    expect(getByText('Listen to this report')).toBeInTheDocument()
    expect(container.querySelector('audio')?.getAttribute('src')).toBe(
      NARRATION
    )
    // The report video is the only embed on the page; audio never goes to YouTube.
    expect(iframeSrcs(container)).toEqual([
      'https://www.youtube.com/embed/F6o_NypHMnU',
    ])
  })

  it('keeps the report video on YouTube', () => {
    const { container } = render(<ResearchArticle item={makeItem()} />)
    expect(iframeSrcs(container)).toEqual([
      'https://www.youtube.com/embed/F6o_NypHMnU',
    ])
  })
})

describe('ResearchArticle footer badge', () => {
  it('serves the ElevenLabs badges from the static bucket, not the optimizer', () => {
    const { container } = render(<ResearchArticle item={makeItem()} />)
    const badges = Array.from(container.querySelectorAll('img')).filter((img) =>
      img.getAttribute('alt')?.includes('ElevenLabs')
    )
    expect(badges.map((img) => img.getAttribute('src'))).toEqual([
      '/images/logos/elevenlabs-grants.webp',
      '/images/logos/elevenlabs-grants-white.webp',
    ])
    for (const img of badges) {
      expect(img.getAttribute('loading')).toBe('lazy')
      expect(img.getAttribute('height')).toBe('18')
    }
  })
})
