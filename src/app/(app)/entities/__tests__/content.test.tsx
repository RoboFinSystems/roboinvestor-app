import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import EntitiesListPageContent from '../content'

const graphState = vi.hoisted(() => ({
  graphs: [] as Array<Record<string, unknown>>,
  currentGraphId: null as string | null,
}))
const listEntities = vi.hoisted(() => vi.fn())

vi.mock('@robosystems/core', async () => {
  const actual = await vi.importActual('@robosystems/core')
  return {
    ...actual,
    GraphFilters: { roboinvestor: () => true },
    useGraphContext: () => ({ state: graphState }),
    clients: { ledger: { listEntities } },
  }
})

const fund = { graphId: 'kg-fund', graphName: 'Fund I' }

describe('EntitiesListPageContent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    graphState.graphs = [fund]
  })

  it('lists the fund’s own entities, not linked portfolio companies', async () => {
    listEntities.mockResolvedValue([
      { id: 'ent-fund', name: 'Fund I LP', source: 'native' },
      { id: 'ent-co', name: 'Cadence Labs, Inc.', source: 'linked' },
    ])
    render(<EntitiesListPageContent />)

    expect(await screen.findByText('Fund I LP')).toBeInTheDocument()
    expect(screen.queryByText('Cadence Labs, Inc.')).toBeNull()
    expect(screen.getByText('All Entities (1)')).toBeInTheDocument()
    expect(listEntities).toHaveBeenCalledWith('kg-fund')
  })

  it('reports a graph that failed to load instead of showing it empty', async () => {
    listEntities.mockRejectedValue(new Error('500'))
    render(<EntitiesListPageContent />)

    expect(
      await screen.findByText(/Could not load entities from Fund I/)
    ).toBeInTheDocument()
  })
})
