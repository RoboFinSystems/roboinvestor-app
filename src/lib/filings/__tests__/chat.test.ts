import { describe, expect, it } from 'vitest'
import {
  anchorNote,
  anchoredMessage,
  exampleQuestions,
  filingFocus,
  onSecTrial,
} from '../chat'
import type { CatalogFiling, CompanyCatalog } from '../types'

// A fictional filer.
const company: CompanyCatalog = {
  version: 1,
  generated_at: '',
  source: 'sec',
  cik: '0001234567',
  ticker: 'HVI',
  name: 'Halvorsen Instruments Corp',
  exchange: 'NYSE',
  sic: null,
  sic_description: null,
  filings: [],
  latest: {},
}

const filing: CatalogFiling = {
  accession: '0001234567-26-000060',
  form: '10-Q',
  filing_date: '2026-08-04',
  report_date: '2026-06-30',
  fiscal_year: 2026,
  fiscal_period: 'Q2',
  report_id: null,
  folder: null,
  representations: [],
  viewer: {},
}

describe('filingFocus', () => {
  it('carries the entity and the filing identifiers the operator can anchor on', () => {
    expect(filingFocus(company, filing)).toEqual({
      cik: '0001234567',
      ticker: 'HVI',
      name: 'Halvorsen Instruments Corp',
      accession: '0001234567-26-000060',
      form: '10-Q',
      fiscal_year: 2026,
      fiscal_period: 'Q2',
      report_date: '2026-06-30',
    })
  })
})

describe('anchorNote and anchoredMessage', () => {
  it('names the company by CIK and ticker and the filing by accession and period', () => {
    const note = anchorNote(company, filing)
    expect(note).toContain('Halvorsen Instruments Corp (HVI), CIK 0001234567')
    expect(note).toContain('10-Q for Q2 2026, period ending 2026-06-30')
    expect(note).toContain('Accession: 0001234567-26-000060')
  })

  it('puts the question after the note, trimmed', () => {
    const msg = anchoredMessage(company, filing, '  What was revenue?  ')
    expect(msg.startsWith('REPORT IN CONTEXT')).toBe(true)
    expect(msg.endsWith('\n\nQuestion: What was revenue?')).toBe(true)
  })

  it('falls back to the report date when the fiscal fields are missing', () => {
    const undated = { ...filing, fiscal_year: null, fiscal_period: null }
    expect(anchorNote(company, undated)).toContain(
      '10-Q for 2026-06-30, period ending 2026-06-30'
    )
  })
})

describe('exampleQuestions', () => {
  it('words the examples for the filing on screen', () => {
    const [summary, , peers] = exampleQuestions(company, filing)
    expect(summary).toBe(
      "Summarize Halvorsen Instruments Corp's 10-Q for Q2 2026"
    )
    expect(peers).toContain('HVI')
  })
})

describe('onSecTrial', () => {
  const now = new Date('2026-11-19T12:00:00Z')
  const sec = { resource_type: 'repository', resource_id: 'sec' }

  it('is true while the SEC subscription is in its free trial', () => {
    expect(
      onSecTrial([{ ...sec, trial_ends_at: '2026-11-25T00:00:00Z' }], 'u1', now)
    ).toBe(true)
  })

  it('is false once the trial has ended or the plan never had one', () => {
    expect(
      onSecTrial([{ ...sec, trial_ends_at: '2026-11-01T00:00:00Z' }], 'u1', now)
    ).toBe(false)
    expect(onSecTrial([{ ...sec, trial_ends_at: null }], 'u1', now)).toBe(false)
    expect(onSecTrial([sec], 'u1', now)).toBe(false)
  })

  it("reads the viewer's own seat, never a colleague's", () => {
    const theirs = {
      ...sec,
      user_id: 'u2',
      trial_ends_at: '2026-11-25T00:00:00Z',
    }
    expect(onSecTrial([theirs], 'u1', now)).toBe(false)
    expect(onSecTrial([{ ...theirs, user_id: 'u1' }], 'u1', now)).toBe(true)
  })

  it('ignores another repository and a graph subscription', () => {
    const trial = '2026-11-25T00:00:00Z'
    expect(
      onSecTrial(
        [
          {
            resource_type: 'repository',
            resource_id: 'other',
            trial_ends_at: trial,
          },
          { resource_type: 'graph', resource_id: 'sec', trial_ends_at: trial },
        ],
        'u1',
        now
      )
    ).toBe(false)
  })
})
