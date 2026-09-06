import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { CoverageItem } from '@/lib/research/types'
import { CoverageGrid } from '../CoverageGrid'

// The grid is three columns at `lg`, so exactly the first three cards form the
// above-the-fold row that loads eagerly; every later card must stay lazy.

function makeItem(ticker: string): CoverageItem {
  return {
    ticker,
    company: `${ticker} Inc.`,
    title: `${ticker} coverage`,
    summary: 'Summary text',
    tags: [],
    date: '2026-06-22',
    version: '2026-Q2',
    assets: {
      thumbnail: `https://assets.robosystems.ai/content/${ticker}/${ticker}_thumbnail.png`,
    },
    history: [],
  }
}

describe('CoverageGrid', () => {
  it('loads only the first row of thumbnails eagerly', () => {
    const items = ['AAA', 'BBB', 'CCC', 'DDD', 'EEE'].map(makeItem)
    const { container } = render(<CoverageGrid items={items} />)
    const imgs = Array.from(container.querySelectorAll('img'))
    expect(imgs.map((img) => img.getAttribute('loading'))).toEqual([
      'eager',
      'eager',
      'eager',
      'lazy',
      'lazy',
    ])
    expect(imgs.map((img) => img.getAttribute('fetchpriority'))).toEqual([
      'high',
      'high',
      'high',
      null,
      null,
    ])
  })

  it('renders the empty state when there is no coverage', () => {
    const { getByText, container } = render(<CoverageGrid items={[]} />)
    expect(getByText(/No coverage yet/)).toBeInTheDocument()
    expect(container.querySelector('img')).toBeNull()
  })
})
