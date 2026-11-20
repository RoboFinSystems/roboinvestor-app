import type { CatalogFiling, CompanyCatalog } from './types'

/**
 * What the operator is told about the filing on screen. Sent two ways: as
 * `context.focus`, the structured form a future operator release can read
 * directly, and as a note ahead of the question, which is what anchors the
 * operator today. The note names the entity by CIK and ticker and the filing
 * by accession, so the graph tools and the information-block tools land on
 * the same report the reader has open.
 */
export interface FilingFocus {
  cik: string
  ticker: string
  name: string
  accession: string
  form: string
  fiscal_year: number | null
  fiscal_period: string | null
  report_date: string | null
}

export function filingFocus(
  company: CompanyCatalog,
  filing: CatalogFiling
): FilingFocus {
  return {
    cik: company.cik,
    ticker: company.ticker,
    name: company.name,
    accession: filing.accession,
    form: filing.form,
    fiscal_year: filing.fiscal_year,
    fiscal_period: filing.fiscal_period,
    report_date: filing.report_date,
  }
}

function periodOf(filing: CatalogFiling): string {
  if (filing.fiscal_period && filing.fiscal_year)
    return `${filing.fiscal_period} ${filing.fiscal_year}`
  return filing.report_date ?? ''
}

/** The note that anchors the operator on the open filing. */
export function anchorNote(
  company: CompanyCatalog,
  filing: CatalogFiling
): string {
  const period = periodOf(filing)
  return [
    'REPORT IN CONTEXT — the user is reading this filing:',
    `  Company: ${company.name} (${company.ticker}), CIK ${company.cik}`,
    `  Filing: ${filing.form}${period ? ` for ${period}` : ''}${
      filing.report_date ? `, period ending ${filing.report_date}` : ''
    }`,
    `  Accession: ${filing.accession}`,
    'Anchor on this Entity (match by CIK or ticker) and, when the question is about "this filing" or "this report", on this accession. If the user clearly asks about another company or the corpus at large, answer that instead.',
  ].join('\n')
}

/** The message sent for one question: the anchor, then the question. */
export function anchoredMessage(
  company: CompanyCatalog,
  filing: CatalogFiling,
  question: string
): string {
  return `${anchorNote(company, filing)}\n\nQuestion: ${question.trim()}`
}

/** Questions offered on the empty state, worded for the filing on screen. */
export function exampleQuestions(
  company: CompanyCatalog,
  filing: CatalogFiling
): string[] {
  const period = periodOf(filing)
  return [
    `Summarize ${company.name}'s ${filing.form}${period ? ` for ${period}` : ''}`,
    'How did revenue and net income change from the prior period?',
    `How do ${company.ticker}'s margins compare to its industry peers?`,
  ]
}

/** The fields of an org subscription that say whether it is an SEC trial. */
export interface SubscriptionSeat {
  resource_type?: string | null
  resource_id?: string | null
  user_id?: string | null
  trial_ends_at?: string | null
}

/**
 * Whether the viewer's SEC subscription is still in its free trial. The trial
 * covers the analysis tools and not the operator, which the API refuses until
 * the first payment, so the chat says so instead of taking the question.
 */
export function onSecTrial(
  subscriptions: SubscriptionSeat[],
  userId: string | undefined,
  now: Date = new Date()
): boolean {
  return subscriptions.some((sub) => {
    if (sub.resource_type !== 'repository' || sub.resource_id !== 'sec')
      return false
    // An owner or admin is listed every member's seat.
    if (sub.user_id && sub.user_id !== userId) return false
    if (!sub.trial_ends_at) return false
    // The API writes UTC with no zone.
    const ends = /(Z|[+-]\d\d:?\d\d)$/.test(sub.trial_ends_at)
      ? sub.trial_ends_at
      : `${sub.trial_ends_at}Z`
    return new Date(ends) > now
  })
}
