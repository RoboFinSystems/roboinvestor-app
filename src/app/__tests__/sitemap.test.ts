import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockGetAllCoverage = vi.fn()
const mockGetDocsCatalog = vi.fn()

vi.mock('@/lib/research', () => ({
  getAllCoverage: () => mockGetAllCoverage(),
}))
vi.mock('@/lib/research-site', () => ({
  RESEARCH_IS_CANONICAL_HERE: true,
  SELF_ORIGIN: 'https://roboinvestor.ai',
}))
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

const docsCatalog: DocsCatalog = {
  schema_version: 1,
  digest: 'abc',
  collections: [
    {
      site: 'roboinvestor',
      layer: 'product',
      base_path: '/docs',
      sections: [{ title: null, slugs: ['index', 'your-portfolio'] }],
    },
  ],
  pages: [
    docsPage('index', '2026-09-19T01:00:00-05:00'),
    docsPage('your-portfolio', '2026-09-19T01:00:00-05:00'),
  ],
}

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

    expect(docs).toEqual([
      {
        url: 'https://roboinvestor.ai/docs',
        lastModified: new Date('2026-09-19T01:00:00-05:00'),
        changeFrequency: 'monthly',
        priority: 0.9,
      },
      {
        url: 'https://roboinvestor.ai/docs/your-portfolio',
        lastModified: new Date('2026-09-19T01:00:00-05:00'),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
    ])
  })
})
