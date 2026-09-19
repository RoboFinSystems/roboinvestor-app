import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SearchPageContent } from '../content'

// The hook returns an object, not a boolean. Reading the object itself as the
// flag once sent every graph down the repository branch, so these assert the
// config each kind of graph actually receives.
const mockUseIsRepository = vi.fn()

vi.mock('@robosystems/core', async () => {
  const actual = await vi.importActual('@robosystems/core')
  return {
    ...actual,
    SearchContent: vi.fn(({ config }) => (
      <div data-testid="search-content">
        <p>{config.placeholder}</p>
        {config.filters.formType && <span>form-type filter</span>}
      </div>
    )),
    useIsRepository: () => mockUseIsRepository(),
  }
})

describe('SearchPageContent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('gives your own graph the document search, without filing filters', () => {
    mockUseIsRepository.mockReturnValue({
      isRepository: false,
      currentGraph: { graphId: 'kg123' },
      graphType: 'graph',
    })

    render(<SearchPageContent />)

    expect(screen.getByText('Search your documents...')).toBeInTheDocument()
    expect(screen.queryByText('form-type filter')).not.toBeInTheDocument()
  })

  it('gives a shared repository the filing search with its filters', () => {
    mockUseIsRepository.mockReturnValue({
      isRepository: true,
      currentGraph: { graphId: 'sec' },
      graphType: 'repository',
    })

    render(<SearchPageContent />)

    expect(
      screen.getByText('Search filings, fund documents, research...')
    ).toBeInTheDocument()
    expect(screen.getByText('form-type filter')).toBeInTheDocument()
  })
})
