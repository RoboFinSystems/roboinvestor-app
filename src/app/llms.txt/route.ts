import type { DocsPage } from '@/lib/docs'
import { DOCS_SITE, getDocsCatalog, getDocsNav } from '@/lib/docs'
import { getAllCoverage } from '@/lib/research'
import { RESEARCH_IS_CANONICAL_HERE, SELF_ORIGIN } from '@/lib/research-site'
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/site'

// llms.txt (llmstxt.org): a plain-markdown map of the site for language models. Built from
// the same docs and research catalogs as the sitemap, and lists research only while those
// pages are canonical here, as the sitemap does.

export const revalidate = 300

function link(title: string, url: string, note?: string): string {
  const text = note?.replace(/\s+/g, ' ').trim()
  return text ? `- [${title}](${url}): ${text}` : `- [${title}](${url})`
}

function docsLinks(pages: DocsPage[]): string[] {
  return pages.map((p) =>
    link(p.title, `${SELF_ORIGIN}${p.path}`, p.description)
  )
}

export async function GET() {
  const [catalog, coverage] = await Promise.all([
    getDocsCatalog(),
    RESEARCH_IS_CANONICAL_HERE
      ? getAllCoverage().catch(() => [])
      : Promise.resolve([]),
  ])
  const docs = catalog
    ? (getDocsNav(catalog, DOCS_SITE, 'product')?.ordered ?? [])
    : []

  const research = RESEARCH_IS_CANONICAL_HERE
    ? [
        '## Research',
        link(
          'Research',
          `${SELF_ORIGIN}/research`,
          'equity research briefs on public companies, built from their SEC filings'
        ),
        ...coverage.map((item) =>
          link(
            item.title,
            `${SELF_ORIGIN}/research/${item.ticker.toLowerCase()}`,
            item.summary
          )
        ),
        '',
      ]
    : []

  const body = [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_DESCRIPTION}`,
    '',
    'RoboInvestor is the portfolio product on RoboSystems (https://robosystems.ai), open source under Apache 2.0, by RFS LLC.',
    '',
    '## Docs',
    ...docsLinks(docs),
    '',
    ...research,
    '## Company',
    link(
      'About RoboSystems',
      'https://robosystems.ai/about',
      'who builds RoboInvestor and the company behind it'
    ),
    '',
  ].join('\n')

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
