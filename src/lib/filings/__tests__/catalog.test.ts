import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  companyCatalogUrl,
  FILINGS_CDN_URL,
  getCompany,
  primaryFiling,
  reportUrl,
  SERVER_RENDER_MAX_BYTES,
  serverRenderUrl,
  tickerSlug,
} from '../catalog'
import type { CatalogFiling, CompanyCatalog, Representation } from '../types'

function rep(
  kind: Representation['kind'],
  url = `https://cdn.example/${kind}`,
  bytes = 1
): Representation {
  return {
    kind,
    name: `${kind}.json`,
    media_type: 'application/json',
    bytes,
    url,
  }
}

function filing(
  accession: string,
  form: string,
  representations: Representation[] = [],
  filing_date: string | null = null
): CatalogFiling {
  return {
    accession,
    form,
    filing_date,
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
  it('takes the newest statement filing with a renderable file, a quarterly over an older annual', () => {
    const k = filing('k-2024', '10-K', [rep('holon')], '2025-02-20')
    const q = filing('q-2025', '10-Q', [rep('holon')], '2025-08-04')
    const c = company([q, k], { '10-K': 'k-2024', '10-Q': 'q-2025' })
    expect(primaryFiling(c)?.accession).toBe('q-2025')
  })

  it('orders by filing date, not by the list', () => {
    const k = filing('k-2024', '10-K', [rep('holon')], '2025-02-20')
    const q = filing('q-2025', '10-Q', [rep('holon')], '2025-08-04')
    const c = company([k, q], { '10-K': 'k-2024', '10-Q': 'q-2025' })
    expect(primaryFiling(c)?.accession).toBe('q-2025')
  })

  it('skips a newer filing that carries no statements', () => {
    const proxy = filing('def-2025', 'DEF 14A', [rep('holon')], '2025-09-01')
    const q = filing('q-2025', '10-Q', [rep('holon')], '2025-08-04')
    const c = company([proxy, q])
    expect(primaryFiling(c)?.accession).toBe('q-2025')
  })

  it('falls back to any renderable filing when no statement form renders', () => {
    const proxy = filing('def-2025', 'DEF 14A', [rep('holon')], '2025-09-01')
    const q = filing('q-2025', '10-Q', [rep('document')], '2025-08-04')
    const c = company([proxy, q])
    expect(primaryFiling(c)?.accession).toBe('def-2025')
  })

  it('falls back to the older annual when the quarterly has no renderable file', () => {
    const k = filing('k-2024', '10-K', [rep('holon')], '2025-02-20')
    const q = filing('q-2025', '10-Q', [rep('document')], '2025-08-04')
    const c = company([q, k], { '10-K': 'k-2024', '10-Q': 'q-2025' })
    expect(primaryFiling(c)?.accession).toBe('k-2024')
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
  it('prefers the holon over the Tavi model', () => {
    const f = filing('a', '10-K', [
      rep('tavi', 'https://cdn/t'),
      rep('holon', 'https://cdn/h'),
    ])
    expect(reportUrl(f)).toBe('https://cdn/h')
  })

  it('falls back to the Tavi model', () => {
    expect(reportUrl(filing('a', '10-K', [rep('tavi', 'https://cdn/t')]))).toBe(
      'https://cdn/t'
    )
  })

  it('is null with neither', () => {
    expect(reportUrl(filing('a', '10-K', [rep('document')]))).toBeNull()
  })
})

describe('serverRenderUrl', () => {
  const tavi = SERVER_RENDER_MAX_BYTES.tavi
  const holon = SERVER_RENDER_MAX_BYTES.holon

  it.each([
    [
      'the Tavi model over the holon',
      [rep('holon', 'h'), rep('tavi', 't')],
      't',
    ],
    ['a small holon when there is no Tavi', [rep('holon', 'h', holon)], 'h'],
    [
      'a holon too large to parse',
      [rep('holon', 'h', holon + 1), rep('document')],
      null,
    ],
    [
      'a Tavi too large, falling back to a small holon',
      [rep('tavi', 't', tavi + 1), rep('holon', 'h', holon)],
      'h',
    ],
    [
      'a large filer with both over budget',
      [rep('tavi', 't', tavi + 1), rep('holon', 'h', 20_368_211)],
      null,
    ],
  ])('picks %s', (_case, reps, expected) => {
    expect(serverRenderUrl(filing('a', '10-K', reps))).toBe(expected)
  })
})
