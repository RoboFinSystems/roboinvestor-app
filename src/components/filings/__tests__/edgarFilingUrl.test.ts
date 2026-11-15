import { describe, expect, it } from 'vitest'
import { edgarFilingUrl } from '../FilingsJsonLd'

describe('edgarFilingUrl', () => {
  const holdings = { cik: '0002115436' }

  it('links a filing under the registrant that filed it', () => {
    // A predecessor's 10-K on a ticker whose company changed registrant.
    expect(
      edgarFilingUrl(holdings, {
        accession: '0000034088-26-000045',
        cik: '0000034088',
      })
    ).toBe('https://www.sec.gov/Archives/edgar/data/34088/000003408826000045/')
  })

  it("falls back to the company's own CIK for a filing that names none", () => {
    expect(
      edgarFilingUrl(holdings, { accession: '0002115436-26-000002' })
    ).toBe(
      'https://www.sec.gov/Archives/edgar/data/2115436/000211543626000002/'
    )
  })
})
