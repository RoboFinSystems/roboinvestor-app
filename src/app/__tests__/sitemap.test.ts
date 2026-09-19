import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockGetAllCoverage = vi.fn()
const mockGetDocsCatalog = vi.fn()
// Mutable so one test can point the research pages at another origin (a mirror).
const researchSite = vi.hoisted(() => ({ canonicalHere: true }))

vi.mock('@/lib/research', () => ({
  getAllCoverage: () => mockGetAllCoverage(),
}))
vi.mock('@/lib/research-site', () => ({
  get RESEARCH_IS_CANONICAL_HERE() {
    return researchSite.canonicalHere
  },
  SELF_ORIGIN: 'https://roboinvestor.ai',
}))
// Only the fetch is replaced; the nav grouping is the real one.
vi.mock('@/lib/docs', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  getDocsCatalog: () => mockGetDocsCatalog(),
}))

import type { DocsCatalog, DocsPage } from '@/lib/docs'
import sitemap from '../sitemap'

function docsPage(slug: string, updated: string | null): DocsPage {
  return {
    site: 'roboinvestor',
    layer: 'product',
    slug,
    path: slug === 'index' ? '/docs' : `/docs/${slug}`,
    title: slug,
    description: '',
    section: null,
    order: 0,
    updated,
    body: `product/roboinvestor/${slug}.md`,
    source_url: '',
  }
}

// The catalog is shared across sites: this app lists its own product pages and
// nothing else, so the fixture carries another site's product pages and the
// technical docs too.
const docsCatalog: DocsCatalog = {
  schema_version: 1,
  digest: 'abc',
  collections: [
    {
      site: 'roboinvestor',
      layer: 'product',
      base_path: '/docs',
      sections: [
        {
          title: null,
          slugs: ['index', 'your-portfolio', 'research-and-sec-filings'],
        },
      ],
    },
    {
      site: 'roboledger',
      layer: 'product',
      base_path: '/docs',
      sections: [{ title: null, slugs: ['index', 'month-end-close'] }],
    },
    {
      site: 'robosystems',
      layer: 'technical',
      base_path: '/docs/technical',
      sections: [{ title: 'Getting Started', slugs: ['quick-start'] }],
    },
  ],
  pages: [
    docsPage('index', '2026-09-19T01:00:00-05:00'),
    docsPage('your-portfolio', '2026-09-18T12:00:00-05:00'),
    docsPage('research-and-sec-filings', null),
    {
      ...docsPage('index', '2026-09-17T01:00:00-05:00'),
      site: 'roboledger',
      body: 'product/roboledger/index.md',
    },
    {
      ...docsPage('month-end-close', '2026-09-17T01:00:00-05:00'),
      site: 'roboledger',
      body: 'product/roboledger/month-end-close.md',
    },
    {
      ...docsPage('quick-start', '2026-08-09T22:40:55-05:00'),
      site: 'robosystems',
      layer: 'technical',
      path: '/docs/technical/quick-start',
      body: 'technical/quick-start.md',
    },
  ],
}

const expectedDocs = [
  {
    url: 'https://roboinvestor.ai/docs',
    lastModified: new Date('2026-09-19T01:00:00-05:00'),
    changeFrequency: 'monthly',
    priority: 0.9,
  },
  {
    url: 'https://roboinvestor.ai/docs/your-portfolio',
    lastModified: new Date('2026-09-18T12:00:00-05:00'),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    url: 'https://roboinvestor.ai/docs/research-and-sec-filings',
    lastModified: undefined,
    changeFrequency: 'monthly',
    priority: 0.8,
  },
]

const coverage = [
  { ticker: 'MSFT', date: '2026-07-30' },
  { ticker: 'SBUX', date: '2026-07-28' },
  { ticker: 'NEW' },
]

// A lastmod is a real date or absent. A date stamped at request time teaches Bing and
// Google to ignore the field on every entry, including the research pages whose dates
// are true.
describe('sitemap', () => {
  beforeEach(() => {
    researchSite.canonicalHere = true
    mockGetDocsCatalog.mockResolvedValue(null)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('sends no lastmod for the homepage or a covered company with no date', async () => {
    mockGetAllCoverage.mockResolvedValue(coverage)
    const byUrl = new Map((await sitemap()).map((e) => [e.url, e]))

    expect(byUrl.get('https://roboinvestor.ai')?.lastModified).toBeUndefined()
    expect(byUrl.has('https://roboinvestor.ai/research/new')).toBe(true)
    expect(
      byUrl.get('https://roboinvestor.ai/research/new')?.lastModified
    ).toBeUndefined()
  })

  it('dates the research hub by its newest report and each page by its own', async () => {
    mockGetAllCoverage.mockResolvedValue(coverage)
    const byUrl = new Map((await sitemap()).map((e) => [e.url, e.lastModified]))

    expect(byUrl.get('https://roboinvestor.ai/research')).toEqual(
      new Date('2026-07-30')
    )
    expect(byUrl.get('https://roboinvestor.ai/research/sbux')).toEqual(
      new Date('2026-07-28')
    )
  })

  it('sends no lastmod for the hub when coverage is unreachable', async () => {
    mockGetAllCoverage.mockRejectedValue(new Error('catalog down'))
    const hub = (await sitemap()).find(
      (e) => e.url === 'https://roboinvestor.ai/research'
    )

    expect(hub?.lastModified).toBeUndefined()
  })

  it('is byte-identical across fetches', async () => {
    mockGetAllCoverage.mockResolvedValue(coverage)
    const first = JSON.stringify(await sitemap())
    await new Promise((resolve) => setTimeout(resolve, 5))

    expect(JSON.stringify(await sitemap())).toEqual(first)
  })

  it("lists this site's docs pages, dated by their last commit", async () => {
    mockGetAllCoverage.mockResolvedValue(coverage)
    mockGetDocsCatalog.mockResolvedValue(docsCatalog)
    const docs = (await sitemap()).filter((e) => e.url.includes('/docs'))

    expect(docs).toEqual(expectedDocs)
  })

  it('leaves the docs out, and keeps everything else, when the docs catalog is unreachable', async () => {
    mockGetAllCoverage.mockResolvedValue(coverage)
    mockGetDocsCatalog.mockResolvedValue(null)
    const urls = (await sitemap()).map((e) => e.url)

    expect(urls.some((u) => u.includes('/docs'))).toBe(false)
    expect(urls).toContain('https://roboinvestor.ai')
    expect(urls).toContain('https://roboinvestor.ai/research/msft')
  })

  it('lists the homepage and the docs, and no research, while the research pages are a mirror', async () => {
    researchSite.canonicalHere = false
    mockGetAllCoverage.mockResolvedValue(coverage)
    mockGetDocsCatalog.mockResolvedValue(docsCatalog)
    const entries = await sitemap()

    expect(entries.map((e) => e.url)).toEqual([
      'https://roboinvestor.ai',
      ...expectedDocs.map((d) => d.url),
    ])
    expect(entries.filter((e) => e.url.includes('/docs'))).toEqual(expectedDocs)
    expect(mockGetAllCoverage).not.toHaveBeenCalled()
  })
})
