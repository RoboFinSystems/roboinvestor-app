// Product pages: one permanent page per query a buyer searches for the product itself
// (vault: gtm/content/pages). Each page's metadata, structured data, sitemap entry,
// llms.txt line and footer link come from this registry, so a page cannot ship
// half-wired; __tests__/product-pages.test.ts checks every entry against the SEO rules.

import type { Metadata } from 'next'
import { SITE_NAME } from './site'

const SITE_URL = 'https://roboinvestor.ai'
const ORGANIZATION_ID = 'https://robosystems.ai/#organization'

export interface ProductPage {
  /** URL path, also the route segment under app/(pages). */
  path: string
  /** The one query this page answers. It leads the title and appears in the H1. */
  query: string
  /** <title>: the query first, then `| RoboInvestor`. */
  title: string
  /** Search snippet: contains the query, 160 characters or fewer. */
  description: string
  h1: string
  /** Footer link label. */
  navLabel: string
  /** Social-card eyebrow and subtitle. */
  ogEyebrow: string
  ogSubtitle: string
  /** The product docs page every claim on the page is checked against. */
  docsPath: string
  /** Last substantive edit (YYYY-MM-DD): the sitemap's lastmod. */
  updated: string
}

export const PRODUCT_PAGES: ProductPage[] = [
  {
    path: '/private-equity-portfolio-monitoring',
    query: 'private equity portfolio monitoring',
    title: 'Private Equity Portfolio Monitoring Software | RoboInvestor',
    description:
      "Private equity portfolio monitoring from each company's own statements: every report checked total by total and kept in one graph your AI assistant reads.",
    h1: "Private equity portfolio monitoring, from each company's own statements",
    navLabel: 'Portfolio monitoring',
    ogEyebrow: 'Portfolio monitoring',
    ogSubtitle:
      'Board packages read into one graph, every total checked before it is saved.',
    docsPath: '/docs/reports-from-a-file',
    updated: '2026-11-21',
  },
]

export function getProductPage(path: string): ProductPage {
  const page = PRODUCT_PAGES.find((p) => p.path === path)
  if (!page) throw new Error(`No product page registered at ${path}`)
  return page
}

export function productPageUrl(page: ProductPage): string {
  return `${SITE_URL}${page.path}`
}

export function productPageMetadata(page: ProductPage): Metadata {
  const url = productPageUrl(page)
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.description,
      type: 'website',
      url,
      // og:image comes from the generated opengraph-image.tsx in the page's segment.
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
    },
  }
}

export function productPageJsonLd(page: ProductPage) {
  const url = productPageUrl(page)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: SITE_NAME,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        // No `offers`: pricing lives on the RoboSystems side (structured-data.ts).
        description: page.description,
        url,
        image: `${SITE_URL}/images/logos/roboinvestor-icon.png`,
        publisher: { '@id': ORGANIZATION_ID },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: page.navLabel, item: url },
        ],
      },
    ],
  }
}
