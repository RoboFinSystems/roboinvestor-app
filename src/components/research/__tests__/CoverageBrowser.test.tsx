import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { CoverageItem } from '@/lib/research/types'
import { CoverageBrowser } from '../CoverageBrowser'

function makeItem(overrides: Partial<CoverageItem> = {}): CoverageItem {
  return {
    ticker: 'TEST',
    company: 'Test Company',
    title: 'A test report',
    summary: 'Summary text',
    tags: [],
    date: '2026-01-01',
    version: '2026-Q1',
    assets: {},
    history: [],
    ...overrides,
  }
}

const ITEMS: CoverageItem[] = [
  makeItem({
    ticker: 'GTBIF',
    company: 'Green Thumb Industries',
    title: 'Green Thumb Q2 coverage',
    tags: ['cannabis'],
  }),
  makeItem({
    ticker: 'MSFT',
    company: 'Microsoft Corporation',
    title: 'Microsoft cloud growth',
    tags: ['technology'],
  }),
  makeItem({
    ticker: 'TRLV',
    company: 'Trulieve Cannabis',
    title: 'Trulieve retail footprint',
    tags: ['cannabis', 'retail'],
  }),
]

function searchBox() {
  return screen.getByRole('searchbox')
}

describe('CoverageBrowser', () => {
  it('renders every item before any query', () => {
    render(<CoverageBrowser items={ITEMS} />)
    expect(screen.getByText('GTBIF')).toBeInTheDocument()
    expect(screen.getByText('MSFT')).toBeInTheDocument()
    expect(screen.getByText('TRLV')).toBeInTheDocument()
  })

  it('filters by ticker, case-insensitively', () => {
    render(<CoverageBrowser items={ITEMS} />)
    fireEvent.change(searchBox(), { target: { value: 'msft' } })
    expect(screen.getByText('MSFT')).toBeInTheDocument()
    expect(screen.queryByText('GTBIF')).not.toBeInTheDocument()
    expect(screen.queryByText('TRLV')).not.toBeInTheDocument()
  })

  it('filters by company name (find the ticker without knowing the symbol)', () => {
    render(<CoverageBrowser items={ITEMS} />)
    fireEvent.change(searchBox(), { target: { value: 'green thumb' } })
    expect(screen.getByText('GTBIF')).toBeInTheDocument()
    expect(screen.queryByText('MSFT')).not.toBeInTheDocument()
  })

  it('filters by title', () => {
    render(<CoverageBrowser items={ITEMS} />)
    fireEvent.change(searchBox(), { target: { value: 'cloud growth' } })
    expect(screen.getByText('MSFT')).toBeInTheDocument()
    expect(screen.queryByText('GTBIF')).not.toBeInTheDocument()
  })

  it('filters by tag (matches multiple items)', () => {
    render(<CoverageBrowser items={ITEMS} />)
    fireEvent.change(searchBox(), { target: { value: 'cannabis' } })
    expect(screen.getByText('GTBIF')).toBeInTheDocument()
    expect(screen.getByText('TRLV')).toBeInTheDocument()
    expect(screen.queryByText('MSFT')).not.toBeInTheDocument()
  })

  it('shows a no-results message when nothing matches', () => {
    render(<CoverageBrowser items={ITEMS} />)
    fireEvent.change(searchBox(), { target: { value: 'nonexistent' } })
    expect(screen.getByText(/No results for/)).toBeInTheDocument()
    expect(screen.queryByText('GTBIF')).not.toBeInTheDocument()
  })

  it('restores the full list when the query is cleared', () => {
    render(<CoverageBrowser items={ITEMS} />)
    fireEvent.change(searchBox(), { target: { value: 'msft' } })
    expect(screen.queryByText('GTBIF')).not.toBeInTheDocument()
    fireEvent.change(searchBox(), { target: { value: '' } })
    expect(screen.getByText('GTBIF')).toBeInTheDocument()
    expect(screen.getByText('MSFT')).toBeInTheDocument()
    expect(screen.getByText('TRLV')).toBeInTheDocument()
  })

  it('renders the empty-catalog state without a search box', () => {
    render(<CoverageBrowser items={[]} />)
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
    expect(screen.getByText(/No coverage yet/)).toBeInTheDocument()
  })
})
