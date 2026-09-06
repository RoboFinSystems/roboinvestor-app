import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { CoverageItem } from '@/lib/research/types'
import { CoverageCard } from '../CoverageCard'

// The catalog thumbnails are 1920x1080 PNGs of ~2.5 MB on the content CDN. The card
// must hand them to next/image (resized + webp via `/_next/image`) rather than
// render the raw PNG, and must lazy-load everything below the first row.

const THUMBNAIL =
  'https://assets.robosystems.ai/content/GTBIF/GTBIF_thumbnail.png'

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
  it('serves the CDN thumbnail through the image optimizer, lazily by default', () => {
    const { container } = render(<CoverageCard item={makeItem()} />)
    const img = container.querySelector('img')
    expect(img).not.toBeNull()
    expect(img?.getAttribute('src')).toContain(
      `/_next/image?url=${encodeURIComponent(THUMBNAIL)}`
    )
    expect(img?.getAttribute('srcset')).toContain('/_next/image?url=')
    expect(img?.getAttribute('sizes')).toContain('100vw')
    expect(img?.getAttribute('loading')).toBe('lazy')
    expect(img?.getAttribute('alt')).toBe('Green Thumb coverage update')
  })

  it('loads the first-row thumbnail eagerly when asked', () => {
    const { container } = render(<CoverageCard item={makeItem()} eager />)
    expect(container.querySelector('img')?.getAttribute('loading')).toBe(
      'eager'
    )
  })

  it('renders no image for an item without a thumbnail', () => {
    const { container, getByText } = render(
      <CoverageCard item={makeItem({ assets: {} })} />
    )
    expect(container.querySelector('img')).toBeNull()
    expect(getByText('Green Thumb coverage update')).toBeInTheDocument()
  })
})
