import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { CoverageItem } from '@/lib/research/types'
import { CoverageCard } from '../CoverageCard'

// The catalog thumbnails are 1920x1080 PNGs of ~2.5 MB on the content CDN. A card loads
// the card-sized webps published beside them straight from the CDN, so the app instance
// does no image work (shrinking PNGs on 0.25 vCPU held every click for ~20s, 2026-09-16).
// An item without the webps falls back to next/image rather than the raw PNG. Either way
// everything below the first row lazy-loads.

const CDN = 'https://assets.robosystems.ai/content/GTBIF'
const THUMBNAIL = `${CDN}/GTBIF_thumbnail.png`
const CARD_800 = `${CDN}/GTBIF_thumbnail_card_800.webp`
const CARD_1200 = `${CDN}/GTBIF_thumbnail_card_1200.webp`

function makeItem(overrides: Partial<CoverageItem> = {}): CoverageItem {
  return {
    ticker: 'GTBIF',
    company: 'Green Thumb Industries Inc.',
    title: 'Green Thumb coverage update',
    summary: 'Summary text',
    tags: [],
    date: '2026-06-22',
    version: '2026-Q2',
    assets: { thumbnail: THUMBNAIL },
    history: [],
    ...overrides,
  }
}

describe('CoverageCard thumbnail', () => {
  it('loads the card webps straight from the CDN, never through the optimizer', () => {
    const { container } = render(
      <CoverageCard
        item={makeItem({
          assets: {
            thumbnail: THUMBNAIL,
            thumbnail_card_800: CARD_800,
            thumbnail_card_1200: CARD_1200,
          },
        })}
      />
    )
    const img = container.querySelector('img')
    expect(img?.getAttribute('src')).toBe(CARD_800)
    expect(img?.getAttribute('srcset')).toBe(
      `${CARD_800} 800w, ${CARD_1200} 1200w`
    )
    expect(img?.getAttribute('srcset')).not.toContain('/_next/image')
    expect(img?.getAttribute('sizes')).toContain('100vw')
    expect(img?.getAttribute('loading')).toBe('lazy')
    expect(img?.getAttribute('alt')).toBe('Green Thumb coverage update')
  })

  it('loads a first-row card webp eagerly at high priority when asked', () => {
    const { container } = render(
      <CoverageCard
        item={makeItem({
          assets: {
            thumbnail_card_800: CARD_800,
            thumbnail_card_1200: CARD_1200,
          },
        })}
        eager
      />
    )
    const img = container.querySelector('img')
    expect(img?.getAttribute('loading')).toBe('eager')
    expect(img?.getAttribute('fetchpriority')).toBe('high')
  })

  it('falls back to the optimizer when only one card width is published', () => {
    const { container } = render(
      <CoverageCard
        item={makeItem({
          assets: { thumbnail: THUMBNAIL, thumbnail_card_800: CARD_800 },
        })}
      />
    )
    expect(container.querySelector('img')?.getAttribute('src')).toContain(
      '/_next/image?url='
    )
  })

  it('falls back to the image optimizer for an item without card webps, lazily by default', () => {
    const { container } = render(<CoverageCard item={makeItem()} />)
    const img = container.querySelector('img')
    expect(img).not.toBeNull()
    expect(img?.getAttribute('src')).toContain(
      `/_next/image?url=${encodeURIComponent(THUMBNAIL)}`
    )
    expect(img?.getAttribute('srcset')).toContain('/_next/image?url=')
    expect(img?.getAttribute('sizes')).toContain('100vw')
    expect(img?.getAttribute('loading')).toBe('lazy')
    expect(img?.hasAttribute('fetchpriority')).toBe(false)
    expect(img?.getAttribute('alt')).toBe('Green Thumb coverage update')
  })

  it('loads the first-row thumbnail eagerly at high priority when asked', () => {
    const { container } = render(<CoverageCard item={makeItem()} eager />)
    const img = container.querySelector('img')
    expect(img?.getAttribute('loading')).toBe('eager')
    expect(img?.getAttribute('fetchpriority')).toBe('high')
  })

  it('renders no image for an item without a thumbnail', () => {
    const { container, getByText } = render(
      <CoverageCard item={makeItem({ assets: {} })} />
    )
    expect(container.querySelector('img')).toBeNull()
    expect(getByText('Green Thumb coverage update')).toBeInTheDocument()
  })
})
