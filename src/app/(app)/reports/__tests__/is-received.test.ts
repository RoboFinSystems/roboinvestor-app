import type { ReportListItem } from '@robosystems/client/clients'
import { describe, expect, it } from 'vitest'
import { isReceived } from '../content'

const report = (fields: Partial<ReportListItem>): ReportListItem =>
  ({ id: 'rpt_1', name: 'Report', ...fields }) as ReportListItem

describe('isReceived', () => {
  it('keeps a report shared from another graph', () => {
    expect(isReceived(report({ origin: 'shared', sourceGraphId: 'kg1' }))).toBe(
      true
    )
  })

  it('keeps a report loaded from a file, which has no source graph', () => {
    expect(
      isReceived(report({ origin: 'uploaded', sourceGraphId: null }))
    ).toBe(true)
  })

  it('leaves out a report this graph authored', () => {
    expect(
      isReceived(report({ origin: 'authored', sourceGraphId: null }))
    ).toBe(false)
  })

  it('falls back to the source graph when the API does not say the origin', () => {
    expect(isReceived(report({ sourceGraphId: 'kg1' }))).toBe(true)
    expect(isReceived(report({ sourceGraphId: null }))).toBe(false)
  })
})
