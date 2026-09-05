// Schema.org JSON-LD for a company page: the filer as a Corporation, each
// filing as a Dataset whose distributions are the machine-readable files on the
// CDN (the holon, the Tavi model, the document as filed), and a breadcrumb.
// The Dataset markup is what puts each filing in Google Dataset Search — the
// concrete return on publishing the JSON-LD. Server component, no fetches.

import type { CatalogFiling, CompanyCatalog } from '@/lib/filings/types'
import { SELF_ORIGIN, researchCanonical } from '@/lib/research-site'

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}

/** The filing's index on EDGAR — the record these pages are based on. */
export function edgarFilingUrl(cik: string, accession: string): string {
  return `https://www.sec.gov/Archives/edgar/data/${Number(cik)}/${accession.replace(/-/g, '')}/`
}

export function edgarFilerUrl(cik: string): string {
  return `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cik}`
}

function filingName(company: CompanyCatalog, filing: CatalogFiling): string {
  const period =
    filing.fiscal_period && filing.fiscal_year
      ? ` ${filing.fiscal_period} ${filing.fiscal_year}`
      : filing.report_date
        ? ` ${filing.report_date}`
        : ''
  return `${company.name} ${filing.form}${period} (SEC filing ${filing.accession})`
}

function datasetFor(
  company: CompanyCatalog,
  filing: CatalogFiling,
  pageUrl: string
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: filingName(company, filing),
    description: `${company.name} (${company.ticker}) ${filing.form} filed ${filing.filing_date ?? ''}: the XBRL financial statements as a JSON-LD holon and a Project Tavi compiled model, with the filing as filed. Source: SEC EDGAR.`,
    url: pageUrl,
    identifier: filing.accession,
    isBasedOn: edgarFilingUrl(company.cik, filing.accession),
    temporalCoverage: filing.report_date ?? undefined,
    creator: {
      '@type': 'Organization',
      name: 'RoboSystems',
      url: 'https://robosystems.ai',
    },
    publisher: {
      '@type': 'Organization',
      name: 'RoboInvestor',
      url: SELF_ORIGIN,
    },
    distribution: filing.representations.map((r) => ({
      '@type': 'DataDownload',
      name: r.name,
      encodingFormat: r.media_type,
      contentUrl: r.url,
      contentSize: `${r.bytes} B`,
    })),
  }
}

export function FilingsJsonLd({ company }: { company: CompanyCatalog }) {
  const pageUrl = researchCanonical(company.ticker)
  const withArtifacts = company.filings.filter(
    (f) => f.representations.length > 0
  )
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Corporation',
          name: company.name,
          tickerSymbol: company.ticker,
          url: pageUrl,
          sameAs: [edgarFilerUrl(company.cik)],
        }}
      />
      {withArtifacts.map((filing) => (
        <JsonLd
          key={filing.accession}
          data={datasetFor(company, filing, pageUrl)}
        />
      ))}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Research',
              item: researchCanonical(),
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: `${company.name} (${company.ticker})`,
              item: pageUrl,
            },
          ],
        }}
      />
    </>
  )
}
