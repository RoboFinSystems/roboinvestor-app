import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useInvestorGraph } from '../useInvestorGraph'

// The real `GraphFilters.roboinvestor` runs here, so these graphs carry the
// fields it reads: the extension list and the repository flag.
const graphState = vi.hoisted(() => ({
  graphs: [] as Array<Record<string, unknown>>,
  currentGraphId: null as string | null,
}))

vi.mock('@robosystems/core', async () => {
  const actual = await vi.importActual('@robosystems/core')
  return {
    ...actual,
    useGraphContext: () => ({ state: graphState }),
  }
})

const investorGraph = (graphId: string) => ({
  graphId,
  graphName: graphId,
  graphType: 'entity',
  isRepository: false,
  isSubgraph: false,
  schemaExtensions: ['roboinvestor'],
})

const secRepository = {
  graphId: 'sec',
  graphName: 'SEC',
  graphType: 'entity',
  isRepository: true,
  isSubgraph: false,
  schemaExtensions: [],
}

const ledgerGraph = {
  graphId: 'kg-ledger',
  graphName: 'Books',
  graphType: 'entity',
  isRepository: false,
  isSubgraph: false,
  schemaExtensions: ['roboledger'],
}

describe('useInvestorGraph', () => {
  beforeEach(() => {
    graphState.graphs = [
      secRepository,
      investorGraph('kg-fund-a'),
      investorGraph('kg-fund-b'),
      ledgerGraph,
    ]
    graphState.currentGraphId = null
  })

  it('returns the selected graph when it is a RoboInvestor graph', () => {
    graphState.currentGraphId = 'kg-fund-b'

    const { result } = renderHook(() => useInvestorGraph())

    expect(result.current?.graphId).toBe('kg-fund-b')
  })

  it('falls back to the first RoboInvestor graph when a repository is selected', () => {
    graphState.currentGraphId = 'sec'

    const { result } = renderHook(() => useInvestorGraph())

    expect(result.current?.graphId).toBe('kg-fund-a')
  })

  it('falls back to the first RoboInvestor graph when another product graph is selected', () => {
    graphState.currentGraphId = 'kg-ledger'

    const { result } = renderHook(() => useInvestorGraph())

    expect(result.current?.graphId).toBe('kg-fund-a')
  })

  it('falls back to the first RoboInvestor graph when nothing is selected', () => {
    const { result } = renderHook(() => useInvestorGraph())

    expect(result.current?.graphId).toBe('kg-fund-a')
  })

  it('returns undefined when the user has no RoboInvestor graph', () => {
    graphState.graphs = [secRepository, ledgerGraph]
    graphState.currentGraphId = 'sec'

    const { result } = renderHook(() => useInvestorGraph())

    expect(result.current).toBeUndefined()
  })

  it('keeps the same graph object across renders while the inputs are unchanged', () => {
    graphState.currentGraphId = 'kg-fund-b'

    const { result, rerender } = renderHook(() => useInvestorGraph())
    const first = result.current
    rerender()

    expect(result.current).toBe(first)
  })
})
