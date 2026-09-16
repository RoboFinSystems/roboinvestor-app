import { describe, expect, it } from 'vitest'
import { cohortsOf, pageLastModified } from '../cohorts'
import type { IndexRow } from '../types'

// Fictional filers throughout.
function row(
  ticker: string,
  renderable = true,
  latestRenderableDate: string | null = '2026-08-04'
): IndexRow {
  return {
    ticker,
    cik: ticker,
    name: `${ticker} Corp`,
    exchange: 'NYSE',
    sic_description: null,
    filings: 2,
    latest: {
      accession: `${ticker}-26-000002`,
      form: '10-Q',
      filing_date: '2026-09-10',
      report_date: '2026-06-30',
      fiscal_year: 2026,
      fiscal_period: 'Q2',
    },
    renderable,
    latest_renderable: renderable
      ? {
          accession: `${ticker}-26-000001`,
          form: '10-Q',
          filing_date: latestRenderableDate,
          report_date: '2026-06-30',
          fiscal_year: 2026,
          fiscal_period: 'Q2',
        }
      : null,
  }
}

describe('cohortsOf', () => {
  const rows = [
    row('ZEN'),
    row('HVI'),
    row('PLQ', false),
    row('AHV'),
    row('HV'),
    row('MRB'),
  ]

  it('keeps renderable, uncovered filers in ticker order, chunked', () => {
    const cohorts = cohortsOf(rows, new Set(['MRB']), 2)
    expect(cohorts.map((c) => c.map((r) => r.ticker))).toEqual([
      ['AHV', 'HV'],
      ['HVI', 'ZEN'],
    ])
  })

  it('puts the covered companies’ industry peers first, then the rest', () => {
    const withIndustry = (r: IndexRow, sic: string | null) => ({
      ...r,
      sic_description: sic,
    })
    const industryRows = [
      withIndustry(row('ZEN'), 'Trucking'),
      withIndustry(row('HVI'), 'Instruments'),
      withIndustry(row('AHV'), 'Food'),
      withIndustry(row('HV'), null),
      withIndustry(row('MRB'), 'Instruments'), // covered
    ]
    const cohorts = cohortsOf(industryRows, new Set(['MRB']), 10)
    expect(cohorts[0].map((r) => r.ticker)).toEqual(['HVI', 'AHV', 'HV', 'ZEN'])
  })

  it('matches covered tickers regardless of case', () => {
    const cohorts = cohortsOf(
      rows,
      new Set(['mrb', 'zen'].map((t) => t.toUpperCase())),
      10
    )
    expect(cohorts[0].map((r) => r.ticker)).toEqual(['AHV', 'HV', 'HVI'])
  })

  it('treats a row without the renderable flag as not renderable', () => {
    const legacy = {
      ...row('OLD'),
      renderable: undefined,
      latest_renderable: undefined,
    }
    expect(cohortsOf([legacy], new Set(), 10)).toEqual([])
  })

  it('is empty with nothing eligible', () => {
    expect(cohortsOf([row('PLQ', false)], new Set(), 10)).toEqual([])
  })
})

describe('pageLastModified', () => {
  it('dates the page by the filing it renders, not the newest filing', () => {
    expect(pageLastModified(row('HVI'))?.toISOString().slice(0, 10)).toBe(
      '2026-08-04'
    )
  })

  it('falls back to the newest filing, and to nothing when undated', () => {
    const undatedRenderable = row('HVI', true, null)
    expect(
      pageLastModified(undatedRenderable)?.toISOString().slice(0, 10)
    ).toBe('2026-09-10')
    const undated = {
      ...row('HVI', true, null),
      latest: { ...row('HVI').latest, filing_date: null },
    }
    expect(pageLastModified(undated)).toBeUndefined()
  })
})
