import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import PortfolioPageContent from '../content'

// Graphs are driven per-test; `GraphFilters.roboinvestor` is stubbed to accept
// whatever graph the test supplies so these cover the page's state machine
// rather than the shared extension filter.
const graphs = vi.hoisted(() => ({
  current: [] as Array<{ graphId: string; graphName: string }>,
}))

const listPortfolios = vi.hoisted(() => vi.fn())
const getHoldings = vi.hoisted(() => vi.fn())
const createSecurity = vi.hoisted(() => vi.fn())
const updatePortfolioBlock = vi.hoisted(() => vi.fn())

vi.mock('@robosystems/core', async () => {
  const actual = await vi.importActual('@robosystems/core')
  return {
    ...actual,
    GraphFilters: { roboinvestor: () => true },
    useGraphContext: () => ({ state: { graphs: graphs.current } }),
    clients: {
      investor: {
        listPortfolios,
        getHoldings,
        createSecurity,
        updatePortfolioBlock,
      },
      ledger: { listEntities: vi.fn().mockResolvedValue([]) },
    },
  }
})

const portfolio = (id: string, name: string) => ({
  id,
  name,
  description: null,
  strategy: null,
  inceptionDate: null,
  baseCurrency: 'USD',
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
})

// The portfolio name renders twice on a selected portfolio (list card and
// detail heading), so presence is asserted by match count rather than by a
// single-element query.
const isShowing = (name: string) => screen.queryAllByText(name).length > 0

describe('PortfolioPageContent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getHoldings.mockResolvedValue({ holdings: [] })
    createSecurity.mockResolvedValue({ id: 'sec-1' })
    updatePortfolioBlock.mockResolvedValue({})
    graphs.current = [{ graphId: 'graph-a', graphName: 'Graph A' }]
  })

  it('selects the first portfolio and loads its holdings', async () => {
    listPortfolios.mockResolvedValue({
      portfolios: [portfolio('p-a1', 'Growth Fund')],
    })

    render(<PortfolioPageContent />)

    await waitFor(() =>
      expect(getHoldings).toHaveBeenCalledWith('graph-a', 'p-a1')
    )
    expect(isShowing('Growth Fund')).toBe(true)
  })

  it('re-seeds the selection from the new graph on a graph switch', async () => {
    listPortfolios.mockResolvedValue({
      portfolios: [portfolio('p-a1', 'Growth Fund')],
    })

    const { rerender } = render(<PortfolioPageContent />)
    await waitFor(() =>
      expect(getHoldings).toHaveBeenCalledWith('graph-a', 'p-a1')
    )

    // The active graph changes underneath the page.
    graphs.current = [{ graphId: 'graph-b', graphName: 'Graph B' }]
    listPortfolios.mockResolvedValue({
      portfolios: [portfolio('p-b1', 'Seed Fund')],
    })
    rerender(<PortfolioPageContent />)

    await waitFor(() =>
      expect(getHoldings).toHaveBeenCalledWith('graph-b', 'p-b1')
    )
    // Regression: the previous graph's portfolio id must never be paired with
    // the new graph. Reaching a read here means it could also reach a write —
    // updatePortfolioBlock takes the same (graphId, portfolioId) pair.
    expect(getHoldings).not.toHaveBeenCalledWith('graph-b', 'p-a1')
    expect(isShowing('Growth Fund')).toBe(false)
    expect(isShowing('Seed Fund')).toBe(true)
  })

  it('clears the selection when the new graph has no portfolios', async () => {
    listPortfolios.mockResolvedValue({
      portfolios: [portfolio('p-a1', 'Growth Fund')],
    })

    const { rerender } = render(<PortfolioPageContent />)
    await waitFor(() =>
      expect(getHoldings).toHaveBeenCalledWith('graph-a', 'p-a1')
    )

    graphs.current = [{ graphId: 'graph-b', graphName: 'Graph B' }]
    listPortfolios.mockResolvedValue({ portfolios: [] })
    rerender(<PortfolioPageContent />)

    expect(await screen.findByText('No Portfolios Yet')).toBeInTheDocument()
    expect(isShowing('Growth Fund')).toBe(false)
    expect(getHoldings).not.toHaveBeenCalledWith('graph-b', 'p-a1')
  })

  it('ignores a portfolio list that resolves after the graph moved on', async () => {
    // Graph A's list is still in flight when the switch happens; it must not
    // repopulate the page under graph B.
    let resolveA: (value: unknown) => void = () => {}
    listPortfolios.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveA = resolve
      })
    )

    const { rerender } = render(<PortfolioPageContent />)

    graphs.current = [{ graphId: 'graph-b', graphName: 'Graph B' }]
    listPortfolios.mockResolvedValue({
      portfolios: [portfolio('p-b1', 'Seed Fund')],
    })
    rerender(<PortfolioPageContent />)

    resolveA({ portfolios: [portfolio('p-a1', 'Growth Fund')] })

    await waitFor(() =>
      expect(getHoldings).toHaveBeenCalledWith('graph-b', 'p-b1')
    )
    expect(isShowing('Seed Fund')).toBe(true)
    expect(isShowing('Growth Fund')).toBe(false)
  })
})

describe('adding a security with a position', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    getHoldings.mockResolvedValue({ holdings: [] })
    createSecurity.mockResolvedValue({ id: 'sec-1' })
    updatePortfolioBlock.mockResolvedValue({})
    graphs.current = [{ graphId: 'graph-a', graphName: 'Graph A' }]
    listPortfolios.mockResolvedValue({
      portfolios: [portfolio('p-a1', 'Growth Fund')],
    })

    render(<PortfolioPageContent />)
    await waitFor(() =>
      expect(getHoldings).toHaveBeenCalledWith('graph-a', 'p-a1')
    )
    fireEvent.click(screen.getByRole('button', { name: /Add Security/i }))
  })

  const fill = (id: string, value: string) =>
    fireEvent.change(document.getElementById(id) as HTMLInputElement, {
      target: { value },
    })

  const submit = () =>
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))

  it('submits cost basis as integer cents against the selected portfolio', async () => {
    fill('sec-name', 'Common Stock Class A')
    fill('sec-qty', '1000')
    fill('sec-cost', '1525.50')
    submit()

    await waitFor(() => expect(updatePortfolioBlock).toHaveBeenCalled())
    const [graphId, portfolioId, body] = updatePortfolioBlock.mock.calls[0]
    expect(graphId).toBe('graph-a')
    expect(portfolioId).toBe('p-a1')
    expect(body.positions.add[0]).toMatchObject({
      security_id: 'sec-1',
      quantity: 1000,
      cost_basis: 152550,
    })
  })

  it('creates the security without a position when no quantity is given', async () => {
    fill('sec-name', 'Warrant')
    submit()

    await waitFor(() => expect(createSecurity).toHaveBeenCalled())
    expect(updatePortfolioBlock).not.toHaveBeenCalled()
  })

  it('rejects a non-positive quantity before creating an orphan security', async () => {
    // The security is written before the position, so bailing out after it
    // would leave a security behind with no position attached.
    fill('sec-name', 'Common Stock Class A')
    fill('sec-qty', '-5')
    submit()

    expect(
      await screen.findByText(/Enter a positive quantity/i)
    ).toBeInTheDocument()
    expect(createSecurity).not.toHaveBeenCalled()
    expect(updatePortfolioBlock).not.toHaveBeenCalled()
  })
})
