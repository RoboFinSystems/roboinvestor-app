import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import PortfolioPageContent from '../content'

// Graphs are driven per-test; `GraphFilters.roboinvestor` is stubbed to accept
// whatever graph the test supplies so these cover the page's state machine
// rather than the shared extension filter.
const graphs = vi.hoisted(() => ({
  current: [] as Array<{ graphId: string; graphName: string }>,
  selectedId: null as string | null,
}))

const listPortfolios = vi.hoisted(() => vi.fn())
const getHoldings = vi.hoisted(() => vi.fn())
const createSecurity = vi.hoisted(() => vi.fn())
const updatePortfolioBlock = vi.hoisted(() => vi.fn())
const createPortfolioBlock = vi.hoisted(() => vi.fn())
const listEntities = vi.hoisted(() => vi.fn())
const getSecurity = vi.hoisted(() => vi.fn())
const updateSecurity = vi.hoisted(() => vi.fn())
const deleteSecurity = vi.hoisted(() => vi.fn())
const listPositions = vi.hoisted(() => vi.fn())

vi.mock('@robosystems/core', async () => {
  const actual = await vi.importActual('@robosystems/core')
  return {
    ...actual,
    GraphFilters: { roboinvestor: () => true },
    useGraphContext: () => ({
      state: { graphs: graphs.current, currentGraphId: graphs.selectedId },
    }),
    clients: {
      investor: {
        listPortfolios,
        getHoldings,
        createSecurity,
        updatePortfolioBlock,
        createPortfolioBlock,
        getSecurity,
        updateSecurity,
        deleteSecurity,
        listPositions,
      },
      ledger: { listEntities },
    },
  }
})

const portfolio = (id: string, name: string, baseCurrency = 'USD') => ({
  id,
  name,
  description: null,
  strategy: null,
  inceptionDate: null,
  baseCurrency,
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
    listEntities.mockResolvedValue([])
    listPositions.mockResolvedValue({ positions: [] })
    graphs.current = [{ graphId: 'graph-a', graphName: 'Graph A' }]
    graphs.selectedId = null
  })

  it('reads the selected graph, not the first one', async () => {
    graphs.current = [
      { graphId: 'graph-a', graphName: 'Graph A' },
      { graphId: 'graph-b', graphName: 'Graph B' },
    ]
    graphs.selectedId = 'graph-b'
    listPortfolios.mockResolvedValue({
      portfolios: [portfolio('p-b1', 'Seed Fund')],
    })

    render(<PortfolioPageContent />)

    await waitFor(() =>
      expect(getHoldings).toHaveBeenCalledWith('graph-b', 'p-b1')
    )
    expect(listPortfolios).not.toHaveBeenCalledWith('graph-a')
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
    listEntities.mockResolvedValue([])
    listPositions.mockResolvedValue({ positions: [] })
    graphs.current = [{ graphId: 'graph-a', graphName: 'Graph A' }]
    graphs.selectedId = null
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

  it('requires a quantity, since a security with no position shows nowhere', async () => {
    fill('sec-name', 'Warrant')
    submit()

    expect(await screen.findByText(/Enter a quantity/i)).toBeInTheDocument()
    expect(createSecurity).not.toHaveBeenCalled()
  })

  it('reuses the created security when the position write is retried', async () => {
    updatePortfolioBlock.mockRejectedValueOnce(
      new Error('Update portfolio block failed: 500')
    )
    fill('sec-name', 'Series A Preferred')
    fill('sec-qty', '1000')
    fill('sec-cost', '150000')
    submit()
    await screen.findByText(/Update portfolio block failed/)

    submit()
    await waitFor(() => expect(updatePortfolioBlock).toHaveBeenCalledTimes(2))
    expect(createSecurity).toHaveBeenCalledTimes(1)
    expect(
      updatePortfolioBlock.mock.calls[1][2].positions.add[0]
    ).toMatchObject({ security_id: 'sec-1' })
  })

  it('corrects the created security when the name changes before a retry', async () => {
    updatePortfolioBlock.mockRejectedValueOnce(new Error('boom'))
    fill('sec-name', 'Series A')
    fill('sec-qty', '10')
    submit()
    await screen.findByText('boom')

    fill('sec-name', 'Series B')
    submit()
    await waitFor(() => expect(updatePortfolioBlock).toHaveBeenCalledTimes(2))
    expect(createSecurity).toHaveBeenCalledTimes(1)
    expect(updateSecurity).toHaveBeenCalledWith('graph-a', 'sec-1', {
      name: 'Series B',
    })
  })

  it('recreates rather than patches when the source graph changes before a retry', async () => {
    updatePortfolioBlock.mockRejectedValueOnce(new Error('boom'))
    createSecurity
      .mockResolvedValueOnce({ id: 'sec-1' })
      .mockResolvedValueOnce({ id: 'sec-2' })
    fill('sec-name', 'Series A')
    fill('sec-graph', 'kg_a')
    fill('sec-qty', '10')
    submit()
    await screen.findByText('boom')

    fill('sec-graph', 'kg_b')
    submit()
    await waitFor(() => expect(updatePortfolioBlock).toHaveBeenCalledTimes(2))
    expect(updateSecurity).not.toHaveBeenCalled()
    expect(deleteSecurity).toHaveBeenCalledWith('graph-a', 'sec-1')
    expect(createSecurity).toHaveBeenLastCalledWith(
      'graph-a',
      expect.objectContaining({ source_graph_id: 'kg_b' })
    )
    expect(
      updatePortfolioBlock.mock.calls[1][2].positions.add[0].security_id
    ).toBe('sec-2')
  })

  it('does not add the position twice when a failed write actually landed', async () => {
    updatePortfolioBlock.mockRejectedValueOnce(new Error('network error'))
    fill('sec-name', 'Series A')
    fill('sec-qty', '10')
    submit()
    await screen.findByText('network error')

    listPositions.mockResolvedValueOnce({ positions: [{ id: 'pos-1' }] })
    submit()
    await waitFor(() =>
      expect(listPositions).toHaveBeenCalledWith('graph-a', {
        portfolioId: 'p-a1',
        securityId: 'sec-1',
      })
    )
    await waitFor(() => expect(screen.queryByText('network error')).toBeNull())
    expect(updatePortfolioBlock).toHaveBeenCalledTimes(1)
    expect(createSecurity).toHaveBeenCalledTimes(1)
  })

  it('finishes the same security after the modal is closed and reopened', async () => {
    updatePortfolioBlock.mockRejectedValueOnce(new Error('boom'))
    fill('sec-name', 'Series A')
    fill('sec-qty', '10')
    submit()
    await screen.findByText('boom')

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    fireEvent.click(screen.getByRole('button', { name: /Add Security/i }))
    submit()
    await waitFor(() => expect(updatePortfolioBlock).toHaveBeenCalledTimes(2))
    expect(createSecurity).toHaveBeenCalledTimes(1)
  })

  it('opens a fresh form after a cancel that wrote nothing', async () => {
    fill('sec-name', 'Series A')
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    fireEvent.click(screen.getByRole('button', { name: /Add Security/i }))
    expect(document.getElementById('sec-name')).toHaveValue('')
  })

  it('refuses a cost basis it cannot read before writing anything', async () => {
    fill('sec-name', 'Common')
    fill('sec-qty', '1000')
    fill('sec-cost', '1.525,50')
    submit()

    expect(
      await screen.findByText(/Enter the cost basis as an amount/i)
    ).toBeInTheDocument()
    expect(createSecurity).not.toHaveBeenCalled()
  })

  it('reads a US-formatted cost basis', async () => {
    fill('sec-name', 'Common')
    fill('sec-qty', '1,000')
    fill('sec-cost', '$1,525.50')
    submit()

    await waitFor(() => expect(updatePortfolioBlock).toHaveBeenCalled())
    expect(
      updatePortfolioBlock.mock.calls[0][2].positions.add[0]
    ).toMatchObject({ quantity: 1000, cost_basis: 152550 })
  })

  it('refuses a negative cost basis', async () => {
    fill('sec-name', 'Common')
    fill('sec-qty', '10')
    fill('sec-cost', '-1500')
    submit()

    expect(
      await screen.findByText(/Enter the cost basis as an amount/i)
    ).toBeInTheDocument()
    expect(createSecurity).not.toHaveBeenCalled()
  })

  it('takes quantity and cost as text so the browser cannot rewrite them', () => {
    // A `type=number` input blanks (Firefox/Safari) or rewrites (Chromium)
    // input it can't read before the parser ever sees it.
    for (const id of ['sec-qty', 'sec-cost']) {
      const input = document.getElementById(id) as HTMLInputElement
      expect(input.type).toBe('text')
      expect(input.inputMode).toBe('decimal')
    }
  })

  it('offers the API’s documented security types and units', () => {
    const types = Array.from(
      (document.getElementById('sec-type') as HTMLSelectElement).options
    ).map((o) => o.value)
    expect(types).toEqual(
      expect.arrayContaining(['llc_unit', 'restricted_stock_unit'])
    )
    expect(types).not.toContain('llc_units')
    expect(types).not.toContain('kiss')
    const units = Array.from(
      (document.getElementById('sec-qty-type') as HTMLSelectElement).options
    ).map((o) => o.value)
    expect(units).toEqual(['shares', 'units', 'principal'])
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

describe('portfolio page details', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getHoldings.mockResolvedValue({ holdings: [] })
    listEntities.mockResolvedValue([])
    listPositions.mockResolvedValue({ positions: [] })
    graphs.current = [{ graphId: 'graph-a', graphName: 'Graph A' }]
    graphs.selectedId = null
  })

  it('formats amounts in the portfolio’s base currency', async () => {
    listPortfolios.mockResolvedValue({
      portfolios: [portfolio('p-a1', 'Fund EU', 'EUR')],
    })
    getHoldings.mockResolvedValue({
      holdings: [
        {
          entityId: 'e1',
          entityName: 'Acme GmbH',
          sourceGraphId: null,
          totalCostBasisDollars: 1000,
          totalCurrentValueDollars: null,
          positionCount: 1,
          securities: [
            {
              securityId: 's1',
              securityName: 'Ordinary',
              securityType: 'common_stock',
              quantity: 1,
              quantityType: 'shares',
              costBasisDollars: 1000,
              currentValueDollars: null,
            },
          ],
        },
      ],
    })

    render(<PortfolioPageContent />)
    await screen.findByText('Acme GmbH')
    expect(screen.queryAllByText(/\$1,000/)).toHaveLength(0)
    expect(screen.queryAllByText(/€1,000/).length).toBeGreaterThan(0)
  })

  it('shows a failed portfolio create inside the dialog', async () => {
    listPortfolios.mockResolvedValue({ portfolios: [] })
    createPortfolioBlock.mockRejectedValue(
      new Error('Create portfolio block failed: 422')
    )
    render(<PortfolioPageContent />)
    await waitFor(() => expect(listPortfolios).toHaveBeenCalled())

    fireEvent.click(screen.getByRole('button', { name: /New Portfolio/i }))
    fireEvent.change(document.getElementById('name') as HTMLInputElement, {
      target: { value: 'Fund II' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Create' }))

    const dialog = await screen.findByRole('dialog')
    expect(
      await within(dialog).findByText(/Create portfolio block failed/)
    ).toBeInTheDocument()
  })

  it('shows a load error for linked companies, not the empty state', async () => {
    listPortfolios.mockResolvedValue({
      portfolios: [portfolio('p-a1', 'Growth Fund')],
    })
    listEntities.mockRejectedValue(new Error('LEDGER_NOT_INITIALIZED'))
    render(<PortfolioPageContent />)
    await waitFor(() =>
      expect(getHoldings).toHaveBeenCalledWith('graph-a', 'p-a1')
    )
    fireEvent.click(screen.getByRole('button', { name: /Add Security/i }))

    expect(
      await screen.findByText(/Could not load companies/i)
    ).toBeInTheDocument()
    expect(
      screen.queryByText('No companies have shared reports with you yet.')
    ).toBeNull()
  })

  it('drops a linked-companies load that lands after a graph switch', async () => {
    listPortfolios.mockImplementation(async (g: string) => ({
      portfolios: [portfolio(g === 'graph-a' ? 'p-a1' : 'p-b1', 'Fund')],
    }))
    let resolveA: (v: unknown) => void = () => {}
    listEntities.mockImplementation((g: string) =>
      g === 'graph-a'
        ? new Promise((r) => {
            resolveA = r
          })
        : Promise.resolve([{ id: 'ent-b', name: 'Bravo Co', source: 'linked' }])
    )

    const { rerender } = render(<PortfolioPageContent />)
    await waitFor(() =>
      expect(getHoldings).toHaveBeenCalledWith('graph-a', 'p-a1')
    )
    fireEvent.click(screen.getByRole('button', { name: /Add Security/i }))
    await waitFor(() =>
      expect(listEntities).toHaveBeenCalledWith('graph-a', expect.anything())
    )

    graphs.current = [{ graphId: 'graph-b', graphName: 'Graph B' }]
    rerender(<PortfolioPageContent />)
    await waitFor(() =>
      expect(getHoldings).toHaveBeenCalledWith('graph-b', 'p-b1')
    )
    fireEvent.click(screen.getByRole('button', { name: /Add Security/i }))
    await screen.findByText('Bravo Co')

    resolveA([{ id: 'ent-a', name: 'Alpha Co', source: 'linked' }])
    await new Promise((r) => setTimeout(r, 20))
    expect(screen.queryByText('Alpha Co')).toBeNull()
    expect(screen.getByText('Bravo Co')).toBeInTheDocument()
  })

  it('opens the link modal on the security’s current link and sends only changes', async () => {
    listPortfolios.mockResolvedValue({
      portfolios: [portfolio('p-a1', 'Growth Fund')],
    })
    getHoldings.mockResolvedValue({
      holdings: [
        {
          entityId: 'unlinked',
          entityName: 'Unlinked Securities',
          sourceGraphId: null,
          totalCostBasisDollars: 10,
          totalCurrentValueDollars: null,
          positionCount: 1,
          securities: [
            {
              securityId: 's1',
              securityName: 'Series A',
              securityType: 'preferred_stock',
              quantity: 1,
              quantityType: 'shares',
              costBasisDollars: 10,
              currentValueDollars: null,
            },
          ],
        },
      ],
    })
    getSecurity.mockResolvedValue({
      id: 's1',
      entityId: null,
      sourceGraphId: 'kg_x',
    })
    updateSecurity.mockResolvedValue({})
    render(<PortfolioPageContent />)

    fireEvent.click(
      await screen.findByRole('button', { name: 'Link Series A' })
    )
    await waitFor(() =>
      expect(
        (document.getElementById('edit-graph') as HTMLInputElement).value
      ).toBe('kg_x')
    )
    expect(getSecurity).toHaveBeenCalledWith('graph-a', 's1')

    fireEvent.change(
      document.getElementById('edit-graph') as HTMLInputElement,
      {
        target: { value: 'kg_y' },
      }
    )
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    await waitFor(() =>
      expect(updateSecurity).toHaveBeenCalledWith('graph-a', 's1', {
        source_graph_id: 'kg_y',
      })
    )
  })
})
