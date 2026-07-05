import { executeCypherQuery } from '@robosystems/client'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getEntityByCik,
  listReports,
  makeSecQuery,
  searchEntities,
} from '../client'

const mockCypher = vi.mocked(executeCypherQuery)

/** Shape the SDK's `{ data: { data: rows } }` envelope around a set of rows. */
function ok(rows: Array<Record<string, unknown>>) {
  return { data: { data: rows }, error: undefined } as never
}

beforeEach(() => {
  mockCypher.mockReset()
})

describe('makeSecQuery', () => {
  it('targets the given graph in sync mode and returns the rows', async () => {
    mockCypher.mockResolvedValue(ok([{ a: 1 }]))
    const query = makeSecQuery('sec')

    const rows = await query('MATCH (n) RETURN n', { x: 1 })

    expect(rows).toEqual([{ a: 1 }])
    expect(mockCypher).toHaveBeenCalledWith({
      path: { graph_id: 'sec' },
      body: { query: 'MATCH (n) RETURN n', parameters: { x: 1 } },
      query: { mode: 'sync' },
    })
  })

  it('passes null parameters when none are given', async () => {
    mockCypher.mockResolvedValue(ok([]))
    await makeSecQuery('sec')('RETURN 1')
    expect(mockCypher.mock.calls[0][0]).toMatchObject({
      body: { parameters: null },
    })
  })

  it('is keyed off the repository graph id', async () => {
    mockCypher.mockResolvedValue(ok([]))
    await makeSecQuery('other-repo')('RETURN 1')
    expect(mockCypher.mock.calls[0][0]).toMatchObject({
      path: { graph_id: 'other-repo' },
    })
  })

  it('throws on a transport error', async () => {
    mockCypher.mockResolvedValue({
      data: undefined,
      error: { detail: 'boom' },
    } as never)
    await expect(makeSecQuery('sec')('RETURN 1')).rejects.toThrow('boom')
  })

  it('throws on an error embedded in the response body', async () => {
    mockCypher.mockResolvedValue({
      data: { error: 'bad query' },
      error: undefined,
    } as never)
    await expect(makeSecQuery('sec')('RETURN 1')).rejects.toThrow('bad query')
  })
})

describe('searchEntities', () => {
  it('returns [] without hitting the graph for a blank term', async () => {
    expect(await searchEntities('sec', '   ')).toEqual([])
    expect(mockCypher).not.toHaveBeenCalled()
  })

  it('upper-cases the ticker param and lower-cases the name param', async () => {
    mockCypher.mockResolvedValue(ok([]))
    await searchEntities('sec', 'nvda')
    expect(mockCypher.mock.calls[0][0]).toMatchObject({
      body: { parameters: { ticker: 'NVDA', name: 'nvda' } },
    })
  })

  it('maps rows and drops any without a CIK', async () => {
    mockCypher.mockResolvedValue(
      ok([
        { ticker: 'NVDA', name: 'NVIDIA Corp', cik: '0001045810' },
        { ticker: null, name: 'No CIK Inc', cik: '' },
      ])
    )
    const rows = await searchEntities('sec', 'nv')
    expect(rows).toEqual([
      { ticker: 'NVDA', name: 'NVIDIA Corp', cik: '0001045810' },
    ])
  })
})

describe('getEntityByCik', () => {
  it('resolves an entity from its CIK', async () => {
    mockCypher.mockResolvedValue(
      ok([{ ticker: 'AAPL', name: 'Apple Inc', cik: '0000320193' }])
    )
    expect(await getEntityByCik('sec', '0000320193')).toEqual({
      ticker: 'AAPL',
      name: 'Apple Inc',
      cik: '0000320193',
    })
  })

  it('returns null when the CIK matches no entity', async () => {
    mockCypher.mockResolvedValue(ok([]))
    expect(await getEntityByCik('sec', '9999')).toBeNull()
  })
})

describe('listReports', () => {
  it('anchors on the CIK and maps filing rows', async () => {
    mockCypher.mockResolvedValue(
      ok([
        {
          report_id: 'r1',
          form: '10-K',
          report_date: '2024-12-31',
          filing_date: '2025-02-01',
          accession: '0000-1',
          fy: 2024,
          fp: 'FY',
        },
        { report_id: '', form: '8-K' },
      ])
    )
    const rows = await listReports('sec', '0000320193')

    expect(mockCypher.mock.calls[0][0]).toMatchObject({
      body: { parameters: { cik: '0000320193' } },
    })
    expect(rows).toEqual([
      {
        reportId: 'r1',
        form: '10-K',
        reportDate: '2024-12-31',
        filingDate: '2025-02-01',
        accession: '0000-1',
        fiscalYear: 2024,
        fiscalPeriod: 'FY',
      },
    ])
  })
})
