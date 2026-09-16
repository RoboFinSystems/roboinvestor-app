import type * as CatalogLib from '@/lib/filings/catalog'
import type { CompanyCatalog } from '@/lib/filings/types'
import type * as ResearchLib from '@/lib/research'
import { afterEach, describe, expect, it, vi } from 'vitest'

// The quality floor on a generated filer page: a company with nothing to
// render is de-indexed, one with a renderable filing is not. Both catalogs
// are mocked at the module seam; the page's own selection logic runs as is.
vi.mock('@/lib/research', async (importOriginal) => ({
  ...(await importOriginal<typeof ResearchLib>()),
  getCoverage: vi.fn().mockResolvedValue(null),
  getCoverageTickers: vi.fn().mockResolvedValue([]),
}))
vi.mock('@/lib/filings/catalog', async (importOriginal) => ({
  ...(await importOriginal<typeof CatalogLib>()),
  getCompany: vi.fn(),
}))

import { getCompany } from '@/lib/filings/catalog'
import { generateMetadata } from '../page'

// A fictional filer.
function company(withTavi: boolean): CompanyCatalog {
  return {
    version: 1,
    generated_at: '',
    source: 'sec',
    cik: '1',
    ticker: 'HVI',
    name: 'Halvorsen Instruments Corp',
    exchange: 'NYSE',
    sic: null,
    sic_description: null,
    latest: {},
    filings: [
      {
        accession: 'a',
        form: '10-Q',
        filing_date: '2026-08-04',
        report_date: '2026-06-30',
        fiscal_year: 2026,
        fiscal_period: 'Q2',
        report_id: null,
        folder: null,
        representations: withTavi
          ? [
              {
                kind: 'tavi',
                name: 'tavi.json',
                media_type: 'application/json',
                bytes: 1,
                url: 'https://cdn.example/tavi.json',
              },
            ]
          : [],
        viewer: {},
      },
    ],
  }
}

describe('generateMetadata for a generated filer page', () => {
  afterEach(() => vi.mocked(getCompany).mockReset())

  it('leaves a rendering page indexable, titled by its latest filing', async () => {
    vi.mocked(getCompany).mockResolvedValue(company(true))
    const meta = await generateMetadata({
      params: Promise.resolve({ ticker: 'hvi' }),
    })
    expect(meta.title).toBe(
      'Halvorsen Instruments Corp (HVI) financial statements Q2 2026 | RoboInvestor'
    )
    expect(meta.robots).toBeUndefined()
  })

  it('de-indexes a page with nothing to render, but keeps it crawlable', async () => {
    vi.mocked(getCompany).mockResolvedValue(company(false))
    const meta = await generateMetadata({
      params: Promise.resolve({ ticker: 'hvi' }),
    })
    expect(meta.robots).toEqual({ index: false, follow: true })
  })
})
