import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  FILINGS_CDN_URL,
  companyCatalogUrl,
  getCompany,
  primaryFiling,
  reportUrl,
  tickerSlug,
} from '../catalog'
import type { CatalogFiling, CompanyCatalog, Representation } from '../types'

function rep(
  kind: Representation['kind'],
  url = `https://cdn.example/${kind}`
): Representation {
  return {
    kind,
    name: `${kind}.json`,
    media_type: 'application/json',
    bytes: 1,
    url,
  }
}

function filing(
  accession: string,
  form: string,
  representations: Representation[] = []
): CatalogFiling {
  return {
    accession,
    form,
    filing_date: null,
    report_date: null,
    fiscal_year: null,
    fiscal_period: null,
    report_id: null,
    folder: null,
    representations,
    viewer: {},
  }
}

function company(
  filings: CatalogFiling[],
  latest: Record<string, string> = {}
): CompanyCatalog {
  return {
    version: 1,
    generated_at: '',
    source: 'sec',
    cik: '1',
    ticker: 'ACME',
    name: 'Acme',
    exchange: null,
    sic: null,
    sic_description: null,
    filings,
    latest,
  }
}

describe('tickerSlug', () => {
  it('lower-cases and trims a ticker', () => {
    expect(tickerSlug(' NFLX ')).toBe('nflx')
  })

  it('keeps the class separators EDGAR uses', () => {
    expect(tickerSlug('BRK.B')).toBe('brk.b')
    expect(tickerSlug('BF-B')).toBe('bf-b')
  })

  it('rejects anything that is not a ticker', () => {
    for (const bad of [
      '',
      '../index',
      '..%2f..%2findex',
      'nflx?x=1',
      'nflx/index',
      'nf lx',
      'a'.repeat(11),
    ]) {
      expect(tickerSlug(bad), bad).toBeNull()
    }
  })
})

describe('companyCatalogUrl', () => {
  it('names the filer file under companies/', () => {
    expect(companyCatalogUrl('NFLX')).toBe(
      `${FILINGS_CDN_URL}/companies/nflx.json`
    )
  })

  it('has no URL for a non-ticker', () => {
    expect(companyCatalogUrl('../index')).toBeNull()
  })
})

describe('getCompany', () => {
  afterEach(() => vi.unstubAllGlobals())

  function respond(status: number, body: unknown = {}) {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(body), { status }))
    vi.stubGlobal('fetch', fetchMock)
    return fetchMock
  }

  it('returns the catalog', async () => {
    const fetchMock = respond(200, { ticker: 'NFLX' })
    const got = await getCompany('nflx')
    expect(got?.ticker).toBe('NFLX')
    expect(fetchMock).toHaveBeenCalledWith(
      `${FILINGS_CDN_URL}/companies/nflx.json`,
      expect.anything()
    )
  })

  it('is null when the CDN has no file, whether it says 404 or 403', async () => {
    respond(404)
    expect(await getCompany('nflx')).toBeNull()
    respond(403)
    expect(await getCompany('nflx')).toBeNull()
  })

  it('throws on any other failure', async () => {
    respond(500)
    await expect(getCompany('nflx')).rejects.toThrow('500')
  })

  it('never fetches for a non-ticker', async () => {
    const fetchMock = respond(200)
    expect(await getCompany('../index')).toBeNull()
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

describe('primaryFiling', () => {
  it('prefers the latest annual with a holon over a newer quarterly', () => {
    const k = filing('k-2024', '10-K', [rep('holon')])
    const q = filing('q-2025', '10-Q', [rep('holon')])
    const c = company([q, k], { '10-K': 'k-2024', '10-Q': 'q-2025' })
    expect(primaryFiling(c)?.accession).toBe('k-2024')
  })

  it('falls back to the quarterly when the annual has no renderable file', () => {
    const k = filing('k-2024', '10-K', [rep('document')])
    const q = filing('q-2025', '10-Q', [rep('holon')])
    const c = company([q, k], { '10-K': 'k-2024', '10-Q': 'q-2025' })
    expect(primaryFiling(c)?.accession).toBe('q-2025')
  })

  it('renders from a filing that has only a Tavi model', () => {
    const k = filing('k-2024', '10-K', [rep('tavi')])
    const c = company([k], { '10-K': 'k-2024' })
    expect(primaryFiling(c)?.accession).toBe('k-2024')
  })

  it('takes the newest renderable filing when latest names none', () => {
    const c = company([
      filing('b', '10-Q'),
      filing('a', '10-Q', [rep('holon')]),
    ])
    expect(primaryFiling(c)?.accession).toBe('a')
  })

  it('is null when no filing has a renderable file', () => {
    expect(
      primaryFiling(company([filing('a', '10-K', [rep('document')])]))
    ).toBeNull()
  })
})

describe('reportUrl', () => {
  it('prefers the Tavi model over the holon', () => {
    const f = filing('a', '10-K', [
      rep('holon', 'https://cdn/h'),
      rep('tavi', 'https://cdn/t'),
    ])
    expect(reportUrl(f)).toBe('https://cdn/t')
  })

  it('falls back to the holon', () => {
    expect(
      reportUrl(filing('a', '10-K', [rep('holon', 'https://cdn/h')]))
    ).toBe('https://cdn/h')
  })

  it('is null with neither', () => {
    expect(reportUrl(filing('a', '10-K', [rep('document')]))).toBeNull()
  })
})
