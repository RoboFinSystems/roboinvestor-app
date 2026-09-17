import { describe, expect, it } from 'vitest'
import {
  reportAnchorNote,
  reportExampleQuestions,
  reportFocus,
  type ReceivedReportAnchor,
} from '../chat'

// A fictional issuer.
const anchor: ReceivedReportAnchor = {
  reportId: 'rpt_01JABCDEFGHJKMNPQRSTVWXYZ',
  name: 'FY 2026 Annual Report',
  entityName: 'Halvorsen Instruments Corp',
  periodStart: '2025-09-01',
  periodEnd: '2026-08-31',
}

describe('reportFocus', () => {
  it('carries the report identifiers and marks the report as received', () => {
    expect(reportFocus(anchor)).toEqual({
      report_id: 'rpt_01JABCDEFGHJKMNPQRSTVWXYZ',
      name: 'FY 2026 Annual Report',
      entity_name: 'Halvorsen Instruments Corp',
      period_start: '2025-09-01',
      period_end: '2026-08-31',
      shared_report: true,
    })
  })

  it('nulls the optional fields rather than dropping them', () => {
    expect(reportFocus({ reportId: 'rpt_1', name: 'Q1' })).toEqual({
      report_id: 'rpt_1',
      name: 'Q1',
      entity_name: null,
      period_start: null,
      period_end: null,
      shared_report: true,
    })
  })
})

describe('reportAnchorNote', () => {
  it('names the issuer, the period and the report identifier', () => {
    const note = reportAnchorNote(anchor)
    expect(note).toContain('Issuer: Halvorsen Instruments Corp')
    expect(note).toContain(
      'Report: FY 2026 Annual Report (2025-09-01 to 2026-08-31)'
    )
    expect(note).toContain('Report identifier: rpt_01JABCDEFGHJKMNPQRSTVWXYZ')
  })

  it('tells the operator the facts are a received copy, not this fund’s books', () => {
    expect(reportAnchorNote(anchor)).toContain('received copy')
  })

  it('falls back to a single date when only one end of the period is known', () => {
    const openEnded = { ...anchor, periodStart: null }
    expect(reportAnchorNote(openEnded)).toContain(
      'Report: FY 2026 Annual Report (2026-08-31)'
    )
  })

  it('omits the issuer line when the report carries no entity name', () => {
    const anonymous = { ...anchor, entityName: null }
    expect(reportAnchorNote(anonymous)).not.toContain('Issuer:')
  })
})

describe('reportExampleQuestions', () => {
  it('words the first example for the report on screen', () => {
    expect(reportExampleQuestions(anchor)[0]).toBe(
      'Summarize FY 2026 Annual Report'
    )
  })
})
