import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { loadPrimaryStatements } from '../statements'

// The page's whole read path on a real filing: fetch the file the catalog
// offers, sniff and parse it, keep the primary statements, read the headline.
// The fixture is 3M's FY2024 10-K trimmed to its balance sheet and income
// statement, as xbrlkit wrote the Tavi model.
const here = dirname(fileURLToPath(import.meta.url))
const tavi = readFileSync(
  join(here, 'fixtures', 'mmm-fy2024-statements.tavi.json'),
  'utf8'
)

describe('loadPrimaryStatements', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('renders a filing from its Tavi model', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(tavi, { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    const s = await loadPrimaryStatements(
      'https://cdn.example/2025/66740/0000066740-25-000006/tavi.json'
    )
    expect(fetchMock).toHaveBeenCalledWith(
      'https://cdn.example/2025/66740/0000066740-25-000006/tavi.json'
    )
    expect(s.entity?.name).toBe('3M COMPANY')
    expect(s.tables.map((t) => t.title)).toEqual([
      'Consolidated Statement of Income (Loss)',
      'Consolidated Balance Sheet',
    ])
    expect(s.headline.find((h) => h.label === 'Total assets')).toMatchObject({
      concept: 'us-gaap:Assets',
      value: 39868000000,
      period: 'as of 2024-12-31',
      symbol: '$',
    })
    expect(s.units['iso4217:USD']).toBeDefined()
  })

  it('fails loudly when the file is missing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('', { status: 403 }))
    )
    await expect(
      loadPrimaryStatements('https://cdn.example/x/tavi.json')
    ).rejects.toThrow('403')
  })
})
