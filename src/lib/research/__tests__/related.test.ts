import { describe, expect, it } from 'vitest'

import { relatedCoverage } from '../related'
import type { CoverageIndustry, CoverageItem } from '../types'

const node = (
  id: string,
  labels: string[],
  extra: Partial<CoverageIndustry> = {}
): CoverageIndustry => ({ id, labels, primary: true, ...extra })

const item = (
  ticker: string,
  industries?: CoverageIndustry[]
): CoverageItem => ({
  ticker,
  company: `${ticker} Corp`,
  title: `${ticker} report`,
  summary: '',
  tags: [],
  date: '2026-11-01',
  version: '2026-Q4',
  assets: {},
  history: [],
  industries,
})

const PAYROLL = node('technology/software/application/payroll-and-hcm', [
  'Technology',
  'Software',
  'Application',
  'Payroll & HCM',
])
const FINANCE = node('technology/software/application/finance-and-accounting', [
  'Technology',
  'Software',
  'Application',
  'Finance & Accounting',
])
const VERTICAL = node('technology/software/vertical', [
  'Technology',
  'Software',
  'Vertical',
])
const SEMIS = node('technology/semiconductors/diversified', [
  'Technology',
  'Semiconductors',
  'Diversified',
])
// A subsector nobody has divided: its one industry repeats it and shows once.
const TOBACCO = node('consumer-goods/tobacco-products/tobacco-products', [
  'Consumer Goods',
  'Tobacco Products',
])
const tickers = (r: ReturnType<typeof relatedCoverage>) =>
  r?.items.map((i) => i.ticker).sort()

describe('relatedCoverage', () => {
  it('links the reports in the same sub-industry when there are enough', () => {
    const all = [
      item('PAYC', [PAYROLL]),
      item('PCTY', [PAYROLL]),
      item('PAYX', [PAYROLL]),
      item('WDAY', [PAYROLL]),
      item('INTU', [FINANCE]),
    ]
    const r = relatedCoverage(all[0], all)
    expect(r?.label).toBe('Payroll & HCM')
    expect(tickers(r)).toEqual(['PAYX', 'PCTY', 'WDAY'])
  })

  it('goes up a level when the sub-industry is thin, closest reports first', () => {
    const all = [
      item('PAYC', [PAYROLL]),
      item('PCTY', [PAYROLL]),
      item('INTU', [FINANCE]),
      item('BILL', [FINANCE]),
    ]
    const r = relatedCoverage(all[0], all)
    expect(r?.label).toBe('Application')
    expect(r?.items[0].ticker).toBe('PCTY')
    expect(tickers(r)).toEqual(['BILL', 'INTU', 'PCTY'])
  })

  it('settles for the subsector with fewer than three peers', () => {
    const all = [item('PAYC', [PAYROLL]), item('GWRE', [VERTICAL])]
    const r = relatedCoverage(all[0], all)
    expect(r?.label).toBe('Software')
    expect(tickers(r)).toEqual(['GWRE'])
  })

  it('falls back to the sector only when the subsector has nobody else', () => {
    const all = [item('PAYC', [PAYROLL]), item('AVGO', [SEMIS])]
    const r = relatedCoverage(all[0], all)
    expect(r?.label).toBe('Technology')
    expect(tickers(r)).toEqual(['AVGO'])
  })

  it('names an undivided subsector once', () => {
    const all = [item('ISPR', [TOBACCO]), item('MO', [TOBACCO])]
    expect(relatedCoverage(all[0], all)?.label).toBe('Tobacco Products')
  })

  it('caps the links at six and never links a report to itself', () => {
    const all = Array.from({ length: 12 }, (_, i) =>
      item(`T${String(i).padStart(2, '0')}`, [PAYROLL])
    )
    const r = relatedCoverage(all[0], all)
    expect(r?.items).toHaveLength(6)
    expect(tickers(r)).not.toContain('T00')
  })

  it('shows different peers on different pages of a large industry', () => {
    const all = Array.from({ length: 12 }, (_, i) =>
      item(`T${String(i).padStart(2, '0')}`, [PAYROLL])
    )
    const linked = new Set(
      all.flatMap((a) => relatedCoverage(a, all)?.items.map((i) => i.ticker))
    )
    expect(linked.size).toBe(12)
  })

  it('uses a second industry when the first has no peers anywhere', () => {
    const miners = node(
      'financials/digital-assets/miners',
      ['Financials', 'Digital Assets', 'Miners'],
      { primary: false }
    )
    const alone = node('energy/nuclear/reactor-developers', [
      'Energy',
      'Nuclear',
      'Reactor Developers',
    ])
    const all = [
      item('XXXX', [alone, miners]),
      item('MARA', [{ ...miners, primary: true }]),
    ]
    const r = relatedCoverage(all[0], all)
    expect(r?.label).toBe('Digital Assets')
    expect(tickers(r)).toEqual(['MARA'])
  })

  it('points a member at the report on its industry, and that report at its members', () => {
    const us = node('consumer-goods/cannabis/us-operators', [
      'Consumer Goods',
      'Cannabis',
      'US Operators',
    ])
    const hub = item('CANNABIS', [
      node('consumer-goods/cannabis', ['Consumer Goods', 'Cannabis'], {
        hub: true,
      }),
    ])
    const all = [hub, item('GTBIF', [us]), item('TRLV', [us]), item('NKE', [])]
    expect(relatedCoverage(all[1], all)?.hub?.ticker).toBe('CANNABIS')
    // The sector report is not listed among a member's peers.
    expect(tickers(relatedCoverage(all[1], all))).toEqual(['TRLV'])
    const fromHub = relatedCoverage(hub, all)
    expect(fromHub?.label).toBe('Cannabis')
    expect(tickers(fromHub)).toEqual(['GTBIF', 'TRLV'])
  })

  it('returns nothing for a report with no industry or no peers', () => {
    const all = [item('PAYC', [PAYROLL]), item('OLD')]
    expect(relatedCoverage(all[1], all)).toBeNull()
    expect(relatedCoverage(all[0], all)).toBeNull()
  })
})
