// One page per filer, rendered from the filing's own holon on the public CDN.
// The facts are the page; the hand-made research, where it exists, is the
// editorial layer on top. Server component: the statements are projected and
// rendered on the server through the shared report components' pure
// projection and the hook-free StatementTable, so every figure is in the HTML
// a crawler or an answer engine reads. Interactive inspection is the viewer's.

import { CompareYourCompany } from '@/components/research/CompareYourCompany'
import { ResearchArticle } from '@/components/research/ResearchArticle'
import type { PrimaryStatements } from '@/lib/filings/statements'
import { compactMoney } from '@/lib/filings/statements'
import type { CatalogFiling, CompanyCatalog } from '@/lib/filings/types'
import type { CoverageItem } from '@/lib/research'
import { StatementTable } from '@robosystems/report-components'
import { edgarFilingUrl } from './FilingsJsonLd'

const FORM_ORDER = ['10-K', '20-F', '40-F', '10-Q']

/** The filing the page renders: the latest annual with a holon, else the newest with one. */
export function primaryFiling(company: CompanyCatalog): CatalogFiling | null {
  for (const form of FORM_ORDER) {
    const accession = company.latest[form]
    const filing = accession
      ? company.filings.find((f) => f.accession === accession)
      : undefined
    if (filing?.representations.some((r) => r.kind === 'holon')) return filing
  }
  return (
    company.filings.find((f) =>
      f.representations.some((r) => r.kind === 'holon')
    ) ?? null
  )
}

export function holonUrl(filing: CatalogFiling): string | null {
  return filing.representations.find((r) => r.kind === 'holon')?.url ?? null
}

function periodOf(filing: CatalogFiling): string {
  if (filing.fiscal_period && filing.fiscal_year)
    return `${filing.fiscal_period} ${filing.fiscal_year}`
  return filing.report_date ?? ''
}

function LinkOut({
  href,
  children,
  muted,
}: {
  href: string
  children: React.ReactNode
  muted?: boolean
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={
        muted
          ? 'text-gray-400 underline-offset-2 hover:text-gray-200 hover:underline'
          : 'text-primary-400 underline-offset-2 hover:underline'
      }
    >
      {children}
    </a>
  )
}

function FilingRow({
  company,
  filing,
  current,
}: {
  company: CompanyCatalog
  filing: CatalogFiling
  current: boolean
}) {
  const reps = Object.fromEntries(
    filing.representations.map((r) => [r.kind, r])
  )
  return (
    <li
      className={`flex flex-col gap-2 rounded-lg border px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${
        current
          ? 'border-primary-500/40 bg-primary-500/5'
          : 'border-gray-800 bg-white/[0.02]'
      }`}
    >
      <div className="text-sm">
        <span className="font-semibold text-gray-100">{filing.form}</span>
        <span className="text-gray-400"> · {periodOf(filing)}</span>
        {filing.filing_date && (
          <span className="text-gray-500"> · filed {filing.filing_date}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {filing.viewer.holon && (
          <LinkOut href={filing.viewer.holon}>Open in the viewer</LinkOut>
        )}
        {reps.holon && <LinkOut href={reps.holon.url}>Holon JSON-LD</LinkOut>}
        {reps.tavi && <LinkOut href={reps.tavi.url}>Tavi JSON</LinkOut>}
        {reps.document && (
          <LinkOut href={reps.document.url} muted>
            As filed
          </LinkOut>
        )}
        <LinkOut href={edgarFilingUrl(company.cik, filing.accession)} muted>
          EDGAR
        </LinkOut>
        {filing.representations.length === 0 && (
          <span className="text-gray-500">artifacts pending</span>
        )}
      </div>
    </li>
  )
}

export function CompanyPage({
  company,
  filing,
  statements,
  coverage,
  briefMarkdown,
}: {
  company: CompanyCatalog
  /** The filing the statements come from, or null when none has a holon yet. */
  filing: CatalogFiling | null
  statements: PrimaryStatements | null
  coverage: CoverageItem | null
  briefMarkdown?: string
}) {
  const name = statements?.entity?.name ?? company.name
  const filingLine = filing
    ? `Financial statements from the ${filing.form} for ${periodOf(filing)}${
        filing.filing_date ? `, filed ${filing.filing_date}` : ''
      }. Every figure is traceable to the filing's XBRL facts.`
    : null

  // With coverage the hand-made research leads — it is what earned the
  // ranking and the click — and its title is the page's H1; the filing's
  // statements follow under their own heading. Without coverage the facts
  // are the page and the company name is the H1.
  const identity = (
    <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-gray-400">
      <span className="rounded bg-cyan-500/10 px-2 py-0.5 font-semibold text-cyan-400">
        {company.ticker}
      </span>
      {company.exchange && <span>{company.exchange}</span>}
      {company.sic_description && <span>· {company.sic_description}</span>}
      <span>· CIK {company.cik}</span>
    </div>
  )

  return (
    <div className="mx-auto max-w-5xl">
      {coverage ? (
        <>
          <header className="mb-6">
            {identity}
            <p className="text-lg font-semibold text-gray-200">{name}</p>
          </header>
          <ResearchArticle item={coverage} briefMarkdown={briefMarkdown} />
          <header className="mt-14 mb-8 border-t border-gray-800 pt-10">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Financial statements
            </h2>
            {filingLine && <p className="mt-2 text-gray-400">{filingLine}</p>}
          </header>
        </>
      ) : (
        <header className="mb-8">
          {identity}
          <h1 className="text-3xl font-bold text-white sm:text-4xl">{name}</h1>
          {filingLine && <p className="mt-2 text-gray-400">{filingLine}</p>}
        </header>
      )}

      {statements && statements.headline.length > 0 && (
        <dl className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {statements.headline.map((h) => (
            <div
              key={h.concept}
              className="rounded-lg border border-gray-800 bg-white/[0.02] p-4"
              title={`${h.concept} · ${h.period}`}
            >
              <dt className="text-xs tracking-wide text-gray-400 uppercase">
                {h.label}
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-white">
                {compactMoney(h.value, h.symbol)}
              </dd>
              <dd className="mt-1 text-xs text-gray-500">{h.period}</dd>
            </div>
          ))}
        </dl>
      )}

      {statements && statements.tables.length > 0 && (
        <section className="rs-report-scope mb-12">
          {statements.tables.map((table) => (
            <StatementTable
              key={table.ib.id}
              table={table}
              units={statements.units}
            />
          ))}
          <p className="text-sm text-gray-500">
            Primary statements only; the notes, dimensional breakdowns and fact
            inspection are in the viewer. Source: SEC EDGAR, accession{' '}
            {filing?.accession}.
          </p>
        </section>
      )}

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-bold text-white">Filings</h2>
        <ul className="space-y-2">
          {company.filings.map((f) => (
            <FilingRow
              key={f.accession}
              company={company}
              filing={f}
              current={f.accession === filing?.accession}
            />
          ))}
        </ul>
      </section>

      <CompareYourCompany company={name} ticker={company.ticker} />
    </div>
  )
}
