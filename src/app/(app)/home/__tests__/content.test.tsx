import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import HomePageContent from '../content'

const graphState = vi.hoisted(() => ({
  graphs: [] as Array<Record<string, unknown>>,
  currentGraphId: null as string | null,
}))

const openConsoleDrawer = vi.hoisted(() => vi.fn())

vi.mock('@robosystems/core', async () => {
  const actual = await vi.importActual('@robosystems/core')
  return {
    ...actual,
    openConsoleDrawer,
    useGraphContext: () => ({ state: graphState }),
  }
})
vi.mock('@/lib/cross-app', () => ({
  useCreateGraphHandoff: () => ({ openCreateGraph: vi.fn() }),
}))

const graph = (graphId: string, extra: Record<string, unknown>) => ({
  graphId,
  graphName: graphId,
  graphType: 'entity',
  isRepository: false,
  isSubgraph: false,
  schemaExtensions: [],
  ...extra,
})

describe('HomePageContent graph resolution', () => {
  beforeEach(() => {
    graphState.graphs = [
      graph('kg-ledger', { schemaExtensions: ['roboledger'] }),
      graph('kg-fund', { schemaExtensions: ['roboinvestor'] }),
    ]
  })

  it('offers the portfolio when a non-investor graph is selected, as the portfolio page resolves one', () => {
    graphState.currentGraphId = 'kg-ledger'
    render(<HomePageContent />)
    expect(screen.getByText('Portfolio')).toBeInTheDocument()
  })

  it('keeps a selected repository’s own actions', () => {
    graphState.graphs.push(
      graph('sec', { isRepository: true, graphType: 'repository' })
    )
    graphState.currentGraphId = 'sec'
    render(<HomePageContent />)
    expect(screen.queryByText('Portfolio')).toBeNull()
  })

  it('opens the console drawer in place from the Console card', () => {
    graphState.currentGraphId = 'kg-fund'
    openConsoleDrawer.mockReset()
    render(<HomePageContent />)
    const card = screen.getByText('Console').closest('a')!
    const navigated = fireEvent.click(card)
    expect(openConsoleDrawer).toHaveBeenCalledTimes(1)
    expect(navigated).toBe(false)
  })
})
