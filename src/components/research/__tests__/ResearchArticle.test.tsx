import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { CoverageItem } from '@/lib/research/types'
import { ResearchArticle } from '../ResearchArticle'

// The podcast YouTube uploads were removed (2026-09-03: a ticker page showed YouTube's
// "Video unavailable" card under "Listen"). The podcast renders from the CDN MP3 or not
// at all; the catalog's `podcast_youtube_url` is never embedded or linked.

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

const PODCAST_YT = 'https://youtu.be/k_udVHUhPU8'
const PODCAST_MP3 =
  'https://assets.robosystems.ai/content/GTBIF/GTBIF_podcast.mp3'

function iframeSrcs(container: HTMLElement) {
  return Array.from(container.querySelectorAll('iframe'), (f) => f.src)
}

describe('ResearchArticle podcast section', () => {
  it('renders nothing for a podcast that only exists on YouTube', () => {
    const { container, queryByText } = render(
      <ResearchArticle item={makeItem({ podcast_youtube_url: PODCAST_YT })} />
    )
    expect(queryByText(/Listen/)).toBeNull()
    expect(container.querySelector('audio')).toBeNull()
    expect(iframeSrcs(container)).toEqual([
      'https://www.youtube.com/embed/F6o_NypHMnU',
    ])
    expect(container.innerHTML).not.toContain('k_udVHUhPU8')
  })

  it('renders the CDN MP3 in a native player and never links YouTube', () => {
    const { container, getByText } = render(
      <ResearchArticle
        item={makeItem({
          podcast_youtube_url: PODCAST_YT,
          assets: { podcast_mp3: PODCAST_MP3 },
        })}
      />
    )
    expect(getByText(/Listen/)).toBeInTheDocument()
    expect(container.querySelector('audio')?.getAttribute('src')).toBe(
      PODCAST_MP3
    )
    expect(container.innerHTML).not.toContain('k_udVHUhPU8')
    expect(container.innerHTML).not.toContain('Watch on YouTube')
  })

  it('keeps the report video on YouTube', () => {
    const { container } = render(<ResearchArticle item={makeItem()} />)
    expect(iframeSrcs(container)).toEqual([
      'https://www.youtube.com/embed/F6o_NypHMnU',
    ])
  })
})
