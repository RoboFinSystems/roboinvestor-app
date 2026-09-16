'use client'

/**
 * The filing selector above the reader: every filing the catalog lists for the
 * company, newest first, plus the links that belong to the selected one — the
 * viewer, the document as filed, EDGAR.
 */
import { edgarFilingUrl } from '@/components/filings/FilingsJsonLd'
import { reportUrl } from '@/lib/filings/catalog'
import type { CatalogFiling, CompanyCatalog } from '@/lib/filings/types'
import { HiExternalLink } from 'react-icons/hi'

interface FilingsBarProps {
  company: CompanyCatalog
  selected: CatalogFiling
  onSelect: (filing: CatalogFiling) => void
}

export function periodOf(filing: CatalogFiling): string {
  if (filing.fiscal_period && filing.fiscal_year)
    return `${filing.fiscal_period} ${filing.fiscal_year}`
  return filing.report_date ?? ''
}

function optionLabel(filing: CatalogFiling): string {
  const parts = [filing.form, periodOf(filing)].filter(Boolean)
  if (filing.filing_date) parts.push(`filed ${filing.filing_date}`)
  if (!reportUrl(filing)) parts.push('artifacts pending')
  return parts.join(' · ')
}

function LinkOut({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="text-primary-600 dark:text-primary-400 inline-flex items-center gap-1 text-sm hover:underline"
    >
      {children}
      <HiExternalLink className="h-4 w-4" />
    </a>
  )
}

export function FilingsBar({ company, selected, onSelect }: FilingsBarProps) {
  const reps = Object.fromEntries(
    selected.representations.map((r) => [r.kind, r])
  )
  const viewer = selected.viewer.tavi ?? selected.viewer.holon
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <label className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
        <span>Filing</span>
        <select
          value={selected.accession}
          onChange={(e) => {
            const next = company.filings.find(
              (f) => f.accession === e.target.value
            )
            if (next) onSelect(next)
          }}
          className="focus:border-primary-500 focus:ring-primary-500 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        >
          {company.filings.map((f) => (
            <option
              key={f.accession}
              value={f.accession}
              disabled={!reportUrl(f)}
            >
              {optionLabel(f)}
            </option>
          ))}
        </select>
      </label>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {viewer && <LinkOut href={viewer}>Open in the viewer</LinkOut>}
        {reps.document && <LinkOut href={reps.document.url}>As filed</LinkOut>}
        <LinkOut href={edgarFilingUrl(company.cik, selected.accession)}>
          EDGAR
        </LinkOut>
      </div>
    </div>
  )
}
