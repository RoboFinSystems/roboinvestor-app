import type * as CatalogLib from '@/lib/filings/catalog'
import type { CompanyCatalog } from '@/lib/filings/types'
import type * as ResearchLib from '@/lib/research'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// During ISR regeneration a throw keeps the last good render, while anything the page
// returns is cached for the hour. So an outage throws, and what is really missing does not.
vi.mock('@/lib/research', async (importOriginal) => ({
  ...(await importOriginal<typeof ResearchLib>()),
  getCoverage: vi.fn(),
  getCoverageTickers: vi.fn().mockResolvedValue([]),
  fetchBrief: vi.fn(),
}))
vi.mock('@/lib/filings/catalog', async (importOriginal) => ({
  ...(await importOriginal<typeof CatalogLib>()),
  getCompany: vi.fn(),
}))
vi.mock('@/lib/filings/statements', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  loadPrimaryStatements: vi.fn(),
}))

import { getCompany, ReportUnavailableError } from '@/lib/filings/catalog'
import { loadPrimaryStatements } from '@/lib/filings/statements'
import { getCoverage } from '@/lib/research'
import ResearchTickerPage, { generateMetadata } from '../page'

// A fictional filer with a filing the page can render.
const company = {
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
      representations: [
        {
          kind: 'tavi',
          name: 'tavi.json',
          media_type: 'application/json',
          bytes: 1,
          url: 'https://cdn.example/tavi.json',
        },
      ],
      viewer: {},
    },
  ],
} as unknown as CompanyCatalog

const props = { params: Promise.resolve({ ticker: 'hvi' }) }

describe('a research page when the CDN fails', () => {
  beforeEach(() => {
    vi.mocked(getCoverage).mockResolvedValue(null)
    vi.mocked(getCompany).mockResolvedValue(company)
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('throws when the coverage catalog cannot be read', async () => {
    vi.mocked(getCoverage).mockRejectedValue(new Error('catalog down'))
    await expect(ResearchTickerPage(props)).rejects.toThrow('catalog down')
    await expect(generateMetadata(props)).rejects.toThrow('catalog down')
  })

  it('throws when the company catalog cannot be read', async () => {
    vi.mocked(getCompany).mockRejectedValue(new Error('company down'))
    await expect(ResearchTickerPage(props)).rejects.toThrow('company down')
    await expect(generateMetadata(props)).rejects.toThrow('company down')
  })

  it('throws when the filing cannot be fetched', async () => {
    vi.mocked(loadPrimaryStatements).mockRejectedValue(
      new ReportUnavailableError('report down')
    )
    await expect(ResearchTickerPage(props)).rejects.toThrow('report down')
  })

  it('renders without statements when the filing cannot be read at all', async () => {
    vi.mocked(loadPrimaryStatements).mockRejectedValue(new Error('corrupt'))
    await expect(ResearchTickerPage(props)).resolves.toBeTruthy()
  })

  it('falls back during a build, which has no last render to keep', async () => {
    vi.stubEnv('NEXT_PHASE', 'phase-production-build')
    vi.mocked(getCoverage).mockRejectedValue(new Error('catalog down'))
    vi.mocked(loadPrimaryStatements).mockRejectedValue(
      new ReportUnavailableError('report down')
    )
    await expect(ResearchTickerPage(props)).resolves.toBeTruthy()
  })
})
