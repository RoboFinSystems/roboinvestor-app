import { describe, expect, it } from 'vitest'
import { searchIndex } from '../search'
import type { IndexRow } from '../types'

// Fictional filers throughout.
function row(ticker: string, name: string): IndexRow {
  return {
    ticker,
    cik: ticker,
    name,
    exchange: 'NYSE',
    sic_description: null,
    filings: 1,
    latest: {
      accession: `${ticker}-26-000001`,
      form: '10-K',
      filing_date: '2026-02-20',
      report_date: '2025-12-31',
      fiscal_year: 2025,
      fiscal_period: 'FY',
    },
  }
}

const ROWS: IndexRow[] = [
  row('HVI', 'Halvorsen Instruments Corp'),
  row('HV', 'Hollow Valley Mining Ltd'),
  row('PLQ', 'Plinth Quarry Holdings'),
  row('ZEN', 'Zenith Halvorsen Logistics'),
  row('AHV', 'Ambling Hive Foods'),
]

describe('searchIndex', () => {
  it('puts an exact ticker first, then ticker prefixes in ticker order, then names', () => {
    expect(searchIndex(ROWS, 'hv').map((r) => r.ticker)).toEqual(['HV', 'HVI'])
    expect(searchIndex(ROWS, 'halvorsen').map((r) => r.ticker)).toEqual([
      'HVI',
      'ZEN',
    ])
  })

  it('is case-insensitive and ignores surrounding space', () => {
    expect(searchIndex(ROWS, '  Plinth ').map((r) => r.ticker)).toEqual(['PLQ'])
  })

  it('caps the result list', () => {
    expect(searchIndex(ROWS, 'h', 2)).toHaveLength(2)
  })

  it('finds a filer by the ticker it left, ahead of prefixes', () => {
    const aliases = { HVX: { cik: 'PLQ', ticker: 'PLQ', since: '2026-11-05' } }
    expect(searchIndex(ROWS, 'hvx', 20, aliases).map((r) => r.ticker)).toEqual([
      'PLQ',
    ])
    const onPrefix = { HV: { cik: 'PLQ', ticker: 'PLQ', since: '2026-11-05' } }
    expect(searchIndex(ROWS, 'hv', 20, onPrefix).map((r) => r.ticker)).toEqual([
      'HV',
      'PLQ',
      'HVI',
    ])
  })

  it('ranks a current holder of the ticker above the filer that left it', () => {
    // Index order would put the filer that left first.
    const rows = [
      row('PLQ', 'Plinth Quarry Holdings'),
      row('HV', 'Hollow Valley'),
    ]
    const aliases = { HV: { cik: 'PLQ', ticker: 'PLQ', since: '2026-11-05' } }
    expect(searchIndex(rows, 'hv', 20, aliases).map((r) => r.ticker)).toEqual([
      'HV',
      'PLQ',
    ])
  })

  it('is empty for an empty term', () => {
    expect(searchIndex(ROWS, '   ')).toEqual([])
  })
})
